const express = require("express");
const {
  getAllTours,
  getTour,
  checkID,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = require("../controller/tourController");
const authController = require("../controller/authController");

const router = express.Router();
router.route("/").get(authController.protect, getAllTours).post(createTour);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.param("id", checkID);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
