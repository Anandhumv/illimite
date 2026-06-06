const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || "./config/serviceAccountKey.json";
const resolvedServiceAccountPath = path.resolve(__dirname, "..", serviceAccountPath);
const serviceAccount = require(resolvedServiceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "illimite-ec139.firebasestorage.app"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
