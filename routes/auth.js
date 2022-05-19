const router = require("express").Router();
const User = require("../models/User");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/regist", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      birthday: req.body.birthday,
      gender: req.body.gender,
      password: crypto.AES.encrypt(
        req.body.password,
        process.env.PASS_KEY
      ).toString(),
    });

    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json("wrong email");

    const hashedPassword = crypto.AES.decrypt(
      user.password,
      process.env.PASS_KEY
    ).toString(crypto.enc.Utf8);
    if (hashedPassword !== req.body.password)
      return res.status(401).json("wrong password");

    const accessToken = jwt.sign({ signedId: user.id }, process.env.JWT_KEY);
    const { password, ...userInfo } = user._doc;

    res.cookie("wemewe-token", `bearer ${accessToken}`, {
      httpOnly: true,
      secure: false,
    });
    res.status(200).json({ userInfo, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
