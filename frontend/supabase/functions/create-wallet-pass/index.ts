import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GOOGLE_WALLET_ISSUER_ID = Deno.env.get("GOOGLE_WALLET_ISSUER_ID");
    const GOOGLE_WALLET_SERVICE_ACCOUNT_KEY = Deno.env.get("GOOGLE_WALLET_SERVICE_ACCOUNT_KEY");

    if (!GOOGLE_WALLET_ISSUER_ID || !GOOGLE_WALLET_SERVICE_ACCOUNT_KEY) {
      // Demo mode: return a placeholder save URL when credentials aren't configured
      console.warn("Google Wallet credentials not configured, returning demo URL");
      const demoUrl = `https://pay.google.com/gp/v/save/demo`;
      return new Response(
        JSON.stringify({ saveUrl: demoUrl }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the service account key
    const serviceAccount = JSON.parse(GOOGLE_WALLET_SERVICE_ACCOUNT_KEY);

    // Create JWT for Google Wallet API auth
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/wallet_object.issuer",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };

    // Base64URL encode
    const encode = (obj: unknown) =>
      btoa(JSON.stringify(obj))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    // Import private key and sign JWT
    const pemContents = serviceAccount.private_key
      .replace(/-----BEGIN PRIVATE KEY-----/, "")
      .replace(/-----END PRIVATE KEY-----/, "")
      .replace(/\n/g, "");
    const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      binaryKey,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signingInput = `${encode(header)}.${encode(payload)}`;
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(signingInput)
    );
    const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const jwt = `${signingInput}.${sig}`;

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Create a unique object ID
    const objectId = `${GOOGLE_WALLET_ISSUER_ID}.loyalty-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Create loyalty object via Google Wallet API
    const loyaltyObject = {
      id: objectId,
      classId: `${GOOGLE_WALLET_ISSUER_ID}.azure-breeze-loyalty`,
      state: "ACTIVE",
      accountId: email,
      accountName: name,
      loyaltyPoints: {
        label: "Points",
        balance: { int: 500 },
      },
      barcode: {
        type: "QR_CODE",
        value: objectId,
      },
    };

    const createRes = await fetch(
      "https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loyaltyObject),
      }
    );

    if (!createRes.ok) {
      const errBody = await createRes.text();
      console.error(`Wallet API error [${createRes.status}]:`, errBody);
      throw new Error(`Failed to create loyalty object: ${createRes.status}`);
    }

    await createRes.json();

    // Create a JWT for the save link
    const savePayload = {
      iss: serviceAccount.client_email,
      aud: "google",
      typ: "savetowallet",
      iat: now,
      origins: ["*"],
      payload: {
        loyaltyObjects: [{ id: objectId }],
      },
    };

    const saveSigningInput = `${encode(header)}.${encode(savePayload)}`;
    const saveSignature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(saveSigningInput)
    );
    const saveSig = btoa(String.fromCharCode(...new Uint8Array(saveSignature)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const saveJwt = `${saveSigningInput}.${saveSig}`;

    const saveUrl = `https://pay.google.com/gp/v/save/${saveJwt}`;

    return new Response(
      JSON.stringify({ saveUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating wallet pass:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
