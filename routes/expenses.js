const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Expense = require("../models/Expense");
const { protect } = require("../middleware/auth");

// All routes below are protected — user must be logged in
router.use(protect);

// ─── @route   GET /api/expenses ───────────────────────────────
// ─── @desc    Get all expenses for logged in user ─────────────
router.get("/", async (req, res) => {
  try {
    const { category, type, startDate, endDate, limit = 50 } = req.query;

    // Build filter object — always filter by logged in user's id
    let filter = { userId: req.user._id };

    if (category) filter.category = category;
    if (type) filter.type = type;

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1 }) // Newest first
      .limit(parseInt(limit));

    // Calculate totals
    const totalExpense = expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalIncome = expenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      count: expenses.length,
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
      data: expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─── @route   POST /api/expenses ──────────────────────────────
// ─── @desc    Add new expense/income ──────────────────────────
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("amount")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be greater than 0"),
    body("category").notEmpty().withMessage("Category is required"),
    body("date").notEmpty().withMessage("Date is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    try {
      const expense = await Expense.create({
        ...req.body,
        userId: req.user._id, // Always attach logged in user's id
      });

      res.status(201).json({
        success: true,
        message: "Added successfully",
        data: expense,
      });
    } catch (error) {
      console.error("Add expense error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ─── @route   PUT /api/expenses/:id ───────────────────────────
// ─── @desc    Update an expense ───────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    // Make sure logged in user owns this expense
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this expense",
      });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: "Updated successfully", data: expense });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─── @route   DELETE /api/expenses/:id ────────────────────────
// ─── @desc    Delete an expense ───────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    // Make sure logged in user owns this expense
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this expense",
      });
    }

    await expense.deleteOne();

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─── @route   GET /api/expenses/summary/categories ────────────
// ─── @desc    Get category-wise summary for charts ────────────
router.get("/summary/categories", async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;