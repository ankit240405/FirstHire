
import express from "express";
import multer from "multer";
import { analyzeResume } from "../utils/parseResume.js";
import Scan from "../models/Scan.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();
const upload = multer();
const requireAuth = ClerkExpressRequireAuth();


router.post(
"/",
requireAuth,
upload.single("resume"),
async (req, res) => {
try {
console.log("=== /api/analyze called ===");
console.log("User ID:", req.auth.userId);

if (!req.file) {  
    return res.status(400).json({ error: "No file uploaded" });  
  }  

  const result = await analyzeResume(  
    req.file.buffer,  
    req.file.mimetype  
  );  

  const saved = await Scan.create({  
    userId: req.auth.userId,  
    result,  
  });  

  console.log("Saved scan:", saved._id);  

  res.json({ result });  
} catch (err) {  
  console.error("ATS error:", err);  
  res.status(500).json({ error: "Failed to analyze resume" });  
}

}
);


router.get(
"/history",
requireAuth,
async (req, res) => {
try {
const scans = await Scan.find({
userId: req.auth.userId,
}).sort({ date: -1 });

res.json({ scans });  
} catch (err) {  
  console.error("History fetch error:", err);  
  res.status(500).json({ error: "Failed to fetch history" });  
}

}
);

export default router;   