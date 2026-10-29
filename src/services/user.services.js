const User = require("../models/user.model");
const bcrypt = require("bcrypt")
const jwtservices = require("../jwt/jwt.services.js");
const mongoose = require("mongoose");
const userProfile = require("../models/user.profile.model.js")


class UserServives {
    async signup(name, email, password) {
        // const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(String(password), 10);
        // console.log(salt)
        // console.log(hashedpassword)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Email already there")
        }
        const user = await User.create({ name, email, password: hashedpassword })
        return user;
    }
    async getAllUser() {
        const users = await User.find({ isActive: true }).populate("profile");
        return users;
    }

    async getAllUserwithoutPop() {
        const users = await User.find({ isActive: true });
        const userid = users.map(user => user._id);
        console.log("User IDs:", userid);
        const userProfiles = await userProfile.find({ user: { $in: userid } });
        console.log("User Profiles:", userProfiles);

        const userwithProfiles = users.map(user => {
            const profile = userProfiles.find(profile => profile.user.toString() === user._id.toString());
            return {
                ...user.toObject(),
                profile: profile || null
            };
        }
        );
        return userwithProfiles;
    }

    async getUserByQuery(name, email) {
        const filter = {};
        if (name) {
            filter.name = name;
        }
        if (email) {
            filter.email = email;
        }
        const users = await User.find(filter);
        return users;
    }

    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            throw new Error("User not found");
        }
    }

    async updateUser(id, updateData) {

        const data = { ...updateData }
        // if (data.password) {
        //     data.password = await bcrypt.hash(String(data.password), 10);
        // }
        const user = await User.findByIdAndUpdate(id,
            data, {
            new: true,
            runValidators: true
        }
        );

        if (!user) {
            throw new Error("User not found");
        }
        return user;

    }

    async softdeleteUser(id) {
        const user = await User.findByIdAndUpdate(
            id,
            { isActive: false },
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
    async loginUser(email, password, res) {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new Error("User not Found");
        }
        if (!user.isActive) {
            throw new Error("Account was inactive");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid Password");
        }

        const payload = {
            id: user._id,
            email: user.email,
            isactive: user.isActive
        }
        const token = jwtservices.generateToken(payload);
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        // res.cookie("auth_token", token, {
        //     httpOnly: true,
        //     secure: false,
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7day 24hours 60mins 60secs 1000milisecs
        // });
        return { user: userWithoutPassword, token }
    }
    async adduserProfile(userid, profiledata) {
        if (!mongoose.isValidObjectId(userid)) {
            throw new Error("Invalid User ID")
        }
        const user = await User.findById(userid)

        if (!user) {
            throw new Error("User not found");
        }

        const newprofile = await userProfile.create({
            user: userid,
            age: profiledata.age,
            dob: profiledata.dob,
            bio: profiledata.bio
        });

        user.profile = newprofile._id;
        await user.save();

        return newprofile
    }
}
module.exports = new UserServives();