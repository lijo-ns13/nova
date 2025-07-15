// import express from "express";
// import {
//   createCheckoutSession,
//   handleRefund,
// } from "../controllers/stripe.controller";

// import tranasctionModal from "../models/tranasction.modal";

// const router = express.Router();
// // /api/stripe
// router.post("/create-checkout-session", createCheckoutSession);
// router.post("/refund", handleRefund);
// // GET /api/refund/session/:userId
// router.get("/session/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const latestTransaction = await tranasctionModal
//       .findOne({ userId, status: "completed" })
//       .sort({ createdAt: -1 });

//     if (!latestTransaction) {
//       res.status(404).json({ message: "No completed transaction found" });
//       return;
//     }

//     res.status(200).json({
//       stripeSessionId: latestTransaction.stripeSessionId,
//       planName: latestTransaction.planName,
//       amount: latestTransaction.amount,
//       currency: latestTransaction.currency,
//       createdAt: latestTransaction.createdAt,
//     });
//     return;
//   } catch (err) {
//     console.error("Error fetching session ID:", err);
//     res.status(500).json({ message: "Internal server error" });
//     return;
//   }
// });

// // Add this to your stripe routes file
// router.get("/session-details/:sessionId", async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     // First try to get from our database
//     const transaction = await tranasctionModal.findOne({
//       stripeSessionId: sessionId,
//     });
//     if (!transaction) {
//       throw new Error("transaction not found");
//     }
//     res.status(200).json({ success: true, transaction });
//   } catch (err) {
//     console.error("Error fetching session details:", err);
//     res.status(500).json({ message: "Failed to fetch session details" });
//   }
// });
// export default router;
