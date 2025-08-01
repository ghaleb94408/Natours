const express = require("express");
const { signup, login } = require("../controller/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
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
