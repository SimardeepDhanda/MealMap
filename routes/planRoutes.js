// routes/planRoutes.js
const express = require('express');
const router = express.Router();
const { generatePlan } = require('../controllers/planController');

// POST /api/plan
router.post('/', generatePlan);

module.exports = router;
