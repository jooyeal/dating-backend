const router = require("express").Router();
const { verifyToken } = require("../middleware/handleToken");
const User = require("../models/User");

router.get("/", verifyToken, async (req, res) => {
  try {
    const allUser = await User.find();
    const exceptedPassword = allUser.map((user) => {
      return {
        username: user.username,
        email: user.email,
        favorites: user.favorites,
        liked: user.liked,
      };
    });
    res.status(200).json(exceptedPassword);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/favorite/add/:id", verifyToken, async (req, res) => {
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

router.put("/favorite/delete/:id", verifyToken, async (req, res) => {
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

router.put("/favorite/add/:id", verifyToken, async (req, res) => {
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

module.exports = router;
