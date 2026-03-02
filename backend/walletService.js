const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID || "3388000000023092505";
const SERVICE_ACCOUNT_KEY_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(__dirname, "..", "service-account-key.json");
const WALLET_SCOPE = "https://www.googleapis.com/auth/wallet_object.issuer";

function readServiceAccountKey() {
  const raw = fs.readFileSync(SERVICE_ACCOUNT_KEY_PATH, "utf8");
  return JSON.parse(raw);
}

async function getWalletClient() {
  const auth = new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: [WALLET_SCOPE],
  });

  const authClient = await auth.getClient();
  return google.walletobjects({
    version: "v1",
    auth: authClient,
  });
}

async function createLoyaltyClass(issuerId) {
  const walletClient = await getWalletClient();
  const classId = `${issuerId}.AzureBreeze_Loyalty_Class`;

  try {
    await walletClient.loyaltyclass.get({
      resourceId: classId,
    });
    return classId;
  } catch (error) {
    const status = error?.response?.status;
    if (status !== 404) {
      throw error;
    }
  }

  const loyaltyClass = {
    id: classId,
    issuerName: "Azure Breeze Resort",
    programName: "Azure Breeze Rewards",
    reviewStatus: "UNDER_REVIEW",
    hexBackgroundColor: "#0077be",
    programLogo: {
      sourceUri: {
        uri: "https://placehold.co/300x300/0077be/ffffff.png",
      },
      contentDescription: {
        defaultValue: {
          language: "en-US",
          value: "Azure Breeze Resort program logo",
        },
      },
    },
    heroImage: {
      sourceUri: {
        uri: "https://placehold.co/1032x336/0077be/ffffff.png",
      },
      contentDescription: {
        defaultValue: {
          language: "en-US",
          value: "Azure Breeze Resort beach hero image",
        },
      },
    },
  };

  await walletClient.loyaltyclass.insert({
    requestBody: loyaltyClass,
  });

  return classId;
}

async function createSaveToWalletLink(userData) {
  if (!userData?.name || !userData?.email) {
    throw new Error("Both name and email are required.");
  }

  const key = readServiceAccountKey();
  const serviceAccountEmail = key.client_email || key.service_account_email;
  const privateKey = key.private_key;

  if (!serviceAccountEmail || !privateKey) {
    throw new Error("Service account key is missing client_email or private_key.");
  }

  const classId = `${ISSUER_ID}.AzureBreeze_Loyalty_Class`;
  const objectId = `${ISSUER_ID}.${uuidv4()}`;

  const loyaltyObject = {
    id: objectId,
    classId,
    state: "ACTIVE",
    accountId: userData.email,
    accountName: userData.name,
    textModulesData: [
      {
        id: "welcome",
        header: "Welcome",
        body: `Member ${userData.name}, enjoy your Azure Breeze Resort benefits.`,
      },
    ],
  };

  const claims = {
    iss: serviceAccountEmail,
    aud: "google",
    origins: [],
    typ: "savetowallet",
    payload: {
      loyaltyObjects: [loyaltyObject],
    },
  };

  const signedJwt = jwt.sign(claims, privateKey, {
    algorithm: "RS256",
  });

  return `https://pay.google.com/gp/v/save/${signedJwt}`;
}

module.exports = {
  ISSUER_ID,
  createLoyaltyClass,
  createSaveToWalletLink,
};
