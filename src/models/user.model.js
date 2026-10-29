const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is Required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is Required"],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is Required"],
            select: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfile'
        }
    },
    {
        timestamps: true,
    }
)

const user = mongoose.model("User", userschema)

module.exports = user
