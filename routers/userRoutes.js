const express = require("express");
const { signup } = require("../controller/authController");

const router = express.Router();

router.post("/signup", signup);
router
  .route("/")
  .get((req, res) => {
    res.send("ok");
  })
  .post((req, res) => {
    res.send("ok");
  });
router
  .route("/:id")
  .patch((req, res) => {
    res.send("ok");
  })
  .delete((req, res) => {
    res.send("ok");
  });

module.exports = router;
