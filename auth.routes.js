const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    if (name.length < 20 || name.length > 60)
      return res.status(400).json({ message: "Invalid Name Length" });

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users(name,email,address,password,role) VALUES($1,$2,$3,$4,'USER')",
      [name, email, address, hash]
    );

    res.json({ message: "Signup Successful" });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0)
      return res.status(400).json({ message: "User Not Found" });

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid)
      return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET
    );

    res.json({ token, role: user.rows[0].role });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
