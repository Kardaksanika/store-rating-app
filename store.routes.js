const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

// GET STORES WITH RATINGS
router.get("/", auth, async (req, res) => {
  const stores = await pool.query(`
    SELECT s.id, s.name, s.address,
    COALESCE(AVG(r.rating),0) as rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id
  `);

  res.json(stores.rows);
});

module.exports = router;
