const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// DASHBOARD
router.get("/dashboard", auth, role("ADMIN"), async (req, res) => {
  const users = await pool.query("SELECT COUNT(*) FROM users");
  const stores = await pool.query("SELECT COUNT(*) FROM stores");
  const ratings = await pool.query("SELECT COUNT(*) FROM ratings");

  res.json({
    totalUsers: users.rows[0].count,
    totalStores: stores.rows[0].count,
    totalRatings: ratings.rows[0].count,
  });
});

// ADD STORE
router.post("/store", auth, role("ADMIN"), async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  await pool.query(
    "INSERT INTO stores(name,email,address,owner_id) VALUES($1,$2,$3,$4)",
    [name, email, address, owner_id]
  );

  res.json({ message: "Store Added" });
});

// VIEW USERS
router.get("/users", auth, role("ADMIN"), async (req, res) => {
  const users = await pool.query(
    "SELECT name,email,address,role FROM users"
  );
  res.json(users.rows);
});

module.exports = router;
