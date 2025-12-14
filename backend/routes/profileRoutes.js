import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import ResumeScan from "../models/ResumeScan.js";

const router = express.Router();

router.get("/history", verifyToken, async (req, res) => {
  try {
    const scans = await ResumeScan.find({ userId: req.userId })
      .sort({ scanDate: 1 });
    return res.json({ scans });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/progress", verifyToken, async (req, res) => {
  try {
    const scans = await ResumeScan.find({ userId: req.userId })
      .sort({ scanDate: 1 });

    const labels = scans.map((s) =>
      s.scanDate.toISOString().split("T")[0]
    );
    const atsScores = scans.map((s) => s.atsScore);

    return res.json({ labels, atsScores, scans });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
