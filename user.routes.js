const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// SUBMIT / UPDATE RATING
router.post("/rate", auth, role("USER"), async (req, res) => {
  const { storeId, rating } = req.body;

  if (rating < 1 || rating > 5)
    return res.status(400).json({ message: "Invalid Rating" });

  await pool.query(
    `INSERT INTO ratings(user_id,store_id,rating)
     VALUES($1,$2,$3)
     ON CONFLICT (user_id,store_id)
     DO UPDATE SET rating=$3`,
    [req.user.id, storeId, rating]
  );

  res.json({ message: "Rating Submitted" });
});

module.exports = router;
