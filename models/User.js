const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
    },
    introduction: {
        type: String,
    },
    favorites: [
        {
            userid: {
                type: String,
            },
        }
    ],
    liked: [
        {
            userid: {
                type: String,
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
