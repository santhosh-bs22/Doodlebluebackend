const express = require("express")
const router = express.Router();
const usercontroller = require("../controllers/user.controller.js")
const protect = require("../middleware/auth.middleware.js")

router.post("/signup", usercontroller.signup);
router.get("/users", protect, usercontroller.getAllUser);
router.get("/search", protect, usercontroller.getUserByQuery)
router.delete("/users/:id", protect, usercontroller.deleteUser);
router.put("/users/:id", protect, usercontroller.updateUser);
router.post("/login",  usercontroller.login);
router.delete("/soft/:id", protect, usercontroller.softdeleteUser);

module.exports = router

