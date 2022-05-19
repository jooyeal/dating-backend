const router = require("express").Router();
const { verifyToken } = require("../middleware/handleToken");
const Chat = require("../models/Chat");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.valid.signedId;
    const conversation = await Conversation.findById(req.params.id);
    const chats = await Chat.find({ conversationId: req.params.id }).sort({
      createdAt: 1,
    });
    const senderInfo = await User.findById(currentUser);
    const receiverId = conversation.members.filter(
      (member) => member !== currentUser
    )[0];
    const receiverInfo = await User.findById(receiverId);
    res.status(200).json({
      currentUser,
      receiverId,
      conversation,
      chats,
      senderInfo,
      receiverInfo,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const senderId = req.valid.signedId;
    const receiverId = req.body.receiverId;
    const conversationId = req.body.conversationid;
    if (!receiverId) return res.status(401).json("receiver does not exist");
    const newChat = new Chat({
      conversationId,
      senderId,
      receiverId,
      content: req.body.content,
    });
    const savedChat = await newChat.save();
    res.status(200).json(savedChat);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
