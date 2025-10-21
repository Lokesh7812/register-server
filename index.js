require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Connect to MongoDB Atlas using .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// 2. Schema + Routes remain same...

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
    res.status(500).json({ message: "Failed to save" });
  }
});

// 4. Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
