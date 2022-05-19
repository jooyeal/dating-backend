const router = require("express").Router();
const { verifyToken } = require("../middleware/handleToken");
const { upload } = require("../middleware/imageUpload");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

router.get("/", verifyToken, async (req, res) => {
  try {
    const allUser = await User.find();
    const exceptedPassword = allUser.map((user) => {
      return {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        introduction: user.introduction,
        birthday: user.birthday,
        gender: user.gender,
      };
    });
    res.status(200).json(exceptedPassword);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/mypage", verifyToken, async (req, res) => {
  try {
    const currentUser = req.valid.signedId;
    if (!currentUser) return res.status(401).json("you need to login");
    const user = await User.findById(currentUser);
    const { password, ...userInfo } = user._doc;
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/favorite/add/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.valid.signedId;
    const targetUser = req.params.id;
    if (!currentUser) return res.status(401).json("can not update other user");
    if (!targetUser) return res.status(401).json("target user does not exist");

    const targetUserInfo = await User.findById(targetUser);
    const conversations = await Conversation.find();
    const isAlreadyExistRoom = conversations.some(
      (conversation) =>
        conversation.members.includes(currentUser) &&
        conversation.members.includes(targetUser)
    );
    const isLiked = targetUserInfo.favorites.some(
      (favorite) => favorite.userid === currentUser
    );
    if (isLiked && !isAlreadyExistRoom) {
      const newConversation = new Conversation({
        members: [currentUser, targetUser],
      });
      await User.findByIdAndUpdate(
        currentUser,
        {
          $push: {
            favorites: {
              userid: targetUser,
            },
            conversations: {
              conversationid: newConversation._id,
            },
          },
        },
        { new: true }
      );
      await User.findByIdAndUpdate(
        targetUser,
        {
          $push: {
            conversations: {
              conversationid: newConversation._id,
            },
          },
        },
        { new: true }
      );
      await newConversation.save();
    } else {
      await User.findByIdAndUpdate(
        currentUser,
        {
          $push: {
            favorites: {
              userid: targetUser,
            },
          },
        },
        { new: true }
      );
    }

    res.status(200).json("favorite updated");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/favorite/delete/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.valid.signedId;
    const targetUser = req.params.id;
    if (!currentUser) return res.status(401).json("can not update other user");
    if (!targetUser) return res.status(401).json("target user does not exist");
    const updatedUser = await User.findByIdAndUpdate(
      currentUser,
      {
        $pull: {
          favorites: {
            userid: targetUser,
          },
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/liked/add/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.valid.signedId;
    const paramUser = req.params.id;
    const targetUser = req.body.targetUserId;
    currentUser !== paramUser &&
      res.status(401).json("can not update other user");
    !targetUser && res.status(401).json("target user does not exist");
    const updatedUser = await User.findByIdAndUpdate(
      paramUser,
      {
        $push: {
          liked: {
            userid: targetUser,
          },
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/liked/delete/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.valid.signedId;
    const paramUser = req.params.id;
    const targetUser = req.body.targetUserId;
    currentUser !== paramUser &&
      res.status(401).json("can not update other user");
    !targetUser && res.status(401).json("target user does not exist");
    const updatedUser = await User.findByIdAndUpdate(
      paramUser,
      {
        $pull: {
          liked: {
            userid: targetUser,
          },
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/introduct", verifyToken, async (req, res) => {
  try {
    const currentUser = req.valid.signedId;
    if (!currentUser) return res.status(401).json("can not update other user");
    const updatedUser = await User.findByIdAndUpdate(
      currentUser,
      {
        $set: {
          introduction: req.body.introduction,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const currentUser = req.valid.signedId;
    const paramUser = req.params.id;
    currentUser !== paramUser &&
      res.status(401).json("can not update other user");
    const updatedUser = await User.findByIdAndUpdate(
      paramUser,
      {
        $set: {
          email: req.body.email,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/upload", verifyToken, upload.single("img"), async (req, res) => {
  try {
    const currentUser = req.valid.signedId;
    if (!currentUser) return res.status(401).json("can not update other user");
    const updatedUser = await User.findByIdAndUpdate(
      currentUser,
      {
        $set: {
          avatar: req.file.path,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/chatlist", verifyToken, async (req, res) => {
  try {
    const currentUser = req.valid.signedId;
    const currentUserInfo = await User.findById(currentUser);
    const chatUserInfos = await Promise.all(
      currentUserInfo.conversations.map(async (chat) => {
        const conversation = await Conversation.findById(chat.conversationid);
        const targetUser = conversation.members.filter(
          (member) => member !== currentUser
        );
        if (targetUser.length !== 0) {
          const targetUserInfo = await User.findById(targetUser[0]);
          return {
            conversationid: chat.conversationid,
            targetUserInfo,
          };
        }
        return;
      })
    );

    res.status(200).json(chatUserInfos);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
