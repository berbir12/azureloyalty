const express = require("express");
const {
  ISSUER_ID,
  createLoyaltyClass,
  createSaveToWalletLink,
} = require("./walletService");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

app.post("/api/generate-wallet-link", async (req, res) => {
  try {
    const { name, email } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        error: "name and email are required.",
      });
    }

    await createLoyaltyClass(ISSUER_ID);
    const saveUrl = await createSaveToWalletLink({ name, email });

    return res.json({ url: saveUrl });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to generate Google Wallet link.",
      details: error?.message || "Unknown error",
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Wallet backend running on port ${PORT}`);
});
