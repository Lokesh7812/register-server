require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ------------------------------------------------------------------
// FIX: Explicitly configure CORS to allow requests from any frontend domain
app.use(cors({
  origin: '*', // Allows requests from ALL domains (including your Vercel URL)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
// ------------------------------------------------------------------

app.use(bodyParser.json());

// 1. Connect to MongoDB Atlas using .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// 2. Define Schema + Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  mobile: String,
});
const User = mongoose.model("User", userSchema);

// 3. POST route to save user
app.post("/submit", async (req, res) => {
  const { email, password, mobile } = req.body;
  try {
    const newUser = new User({ email, password, mobile });
    await newUser.save();
    res.status(200).json({ message: "Details saved" });
  } catch (err) {
    console.error("Save Error:", err); // Log the error on the server
    res.status(500).json({ message: "Failed to save" });
  }
});

// 4. Start server
// Use process.env.PORT provided by Render, or default to 5000 if running locally
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
