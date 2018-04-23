const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const FilterController = require('../controllers/filter');

router.get("/mostfollowers/:userId", checkAuth, FilterController.filter_most_followers);

router.get("/leastfollowers/:userId", checkAuth, FilterController.filter_least_followers);

router.get("/gateway/:userId", checkAuth, FilterController.filter_gateway);

router.get("/mostactive/:userId", checkAuth, FilterController.filter_most_active);

router.get("/leastactive/:userId", checkAuth, FilterController.filter_least_active);

router.get("/mostinteractive/:userId", checkAuth, FilterController.filter_most_interactive);

module.exports = router;
