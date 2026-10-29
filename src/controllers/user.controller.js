const userService = require("../services/user.services.js")

class UserController {
    async signup(req, res) {

        try {
            const { name, password, email } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ status: false, message: "All Fields are required" })
            }
            const result = await userService.signup(name, email, password);
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                data: result
            })

        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: error.message
                // message: "Internal Server Error"
            })

        }
    }

    async getAllUser(req, res) {
        try {
            const result = await userService.getAllUser();
            return res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                count: result.length,
                data: result
            })
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async getUserByQuery(req, res) {
        try {
            const { name, email } = req.query;
            const result = await userService.getUserByQuery(name, email);
            return res.status(200).json({
                success: true,
                message: "User fetch successfully",
                count: result.length,
                data: result
            })

        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = await userService.deleteUser(id);
            return res.status(200).json({
                success: true,
                message: "User deleted successfully",
            })
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const result = await userService.updateUser(id, updateData);
            console.log(result)
            return res.status(200).json({
                success: true,
                message: "User updated Successfully",
                data: result
            })
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async softdeleteUser(req, res) {
        try {
            const { id } = req.params;

            const result = await userService.softdeleteUser(id);

            return res.status(200).json({
                success: true,
                message: "User soft deleted successfully",
                data: result
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async login(req, res) {

        try {
            const { password, email } = req.body;
            if (!email || !password) {
                return res.status(400).json({ status: false, message: "Email and password are required" })
            }
            const result = await userService.loginUser(email, password, res);

            return res.status(201).json({
                success: true,
                message: "Login successfully",
                data: result
            })

        }
        catch (error) {
            console.log(error.message);
            return res.status(401).json({
                success: false,
                message: error.message
            })

        }
    }

}

module.exports = new UserController;
