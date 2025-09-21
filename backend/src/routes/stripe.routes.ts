// import express from "express";

// import {
//   confirmPaymentSession,
//   createCheckoutSession,
//   handleRefund,
// } from "../controllers/StripeController";
// import transactionModel from "../repositories/models/transaction.model";

// const router = express.Router();

// router.post("/create-checkout-session", createCheckoutSession);
// router.post("/refund", handleRefund);
// router.get("/confirm-session/:sessionId", confirmPaymentSession);

// // (optional) fetch last session by userId
// router.get("/session/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const latestTransaction = await transactionModel
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
//   } catch (err) {
//     console.error("Error fetching session ID:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// router.get("/session-details/:sessionId", async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const transaction = await transactionModel.findOne({
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
