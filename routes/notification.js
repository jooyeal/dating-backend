const router = require("express").Router();
const Notification = require("../models/Notification");
const { verifyToken } = require("../middleware/handleToken");
const User = require("../models/User");

router.get("/", verifyToken, async (req, res) => {
  try {
    const receiverId = req.valid.signedId;
    const notifications = await Notification.find({ receiverId }).sort({
      createdAt: -1,
    });
    const sendersInfo = await Promise.all(
      notifications.map(async (notification) => {
        const res = await User.findById(notification.senderId);
        return res;
      })
    );
    res.status(200).json(sendersInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const senderId = req.valid.signedId;
    const receiverId = req.body.receiverId;
    if (!receiverId) return res.status(401).json("receiver has not been set");
    const newNotification = new Notification({
      senderId,
      receiverId,
    });
    const savedNotification = await newNotification.save();
    res.status(200).json(savedNotification);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
