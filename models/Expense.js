const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    // Links expense to a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Transport",
        "Shopping",
        "Entertainment",
        "Health",
        "Education",
        "Bills",
        "Other",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", ExpenseSchema);