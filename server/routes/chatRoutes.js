const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const checkAuth = require("../middleware/checkAuth");

router.route("/").post(checkAuth, chatController.accessChat);
router.route("/").get(checkAuth, chatController.getChats);
router.route("/group").post(checkAuth, chatController.createGroup);
router.route("/renamegroup").put(checkAuth, chatController.renameGroup);
router.route("/removefromgroup").put(checkAuth, chatController.removeFromGroup);
router.route("/addtogroup").put(checkAuth, chatController.addToGroup);
router.route("/addpic").put(checkAuth, chatController.addPic);

module.exports = router;
