const express = require("express");
const authorization = require("../middlewares/ApiAuthentication");
const userController = require("../controllers/userControllers");
const serviceTypeController = require("../controllers/serviceTypeController");

const router = express.Router();

router.post("/user", userController.createUser);
router.get("/user", authorization, userController.getUsers);
router.get("/user/:userId", authorization, userController.getUserById);
router.put("/user/:userId", authorization, userController.updateUser);

router.post(
  "/cleaningservice/refreshtoken",
  authorization,
  userController.refreshToken
);

// User Login
router.post("/login", userController.loginUser);

router.get("/test", authorization, (req, res) => {
  res.status(200).send({ success: true, msg: "Authenticated" });
});

module.exports = router;
