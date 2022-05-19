const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "uploads/default-user-image.png",
    },
    introduction: {
      type: String,
    },
    birthday: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["M", "W"],
      default: "M",
    },
    favorites: [
      {
        userid: {
          type: String,
        },
      },
    ],
    liked: [
      {
        userid: {
          type: String,
        },
      },
    ],
    conversations: [
      {
        conversationid: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
