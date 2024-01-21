import { Controller, Post, Get, Res, Req, UseGuards } from "@nestjs/common";
import { user } from "./user.model";
import { userService } from "./user.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
const jwt = require("jsonwebtoken");
require("dotenv").config();
const env = process.env;
@ApiTags('User Module')

@Controller("user")
export class userController {
    constructor(private readonly userService: userService,
        @InjectModel("user") private readonly userModel: Model<user>
    ) { }

    @Post("/add")
    @ApiOperation({ summary: 'Add the user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fullName: { type: 'string', example: 'John Doe' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                password: { type: 'string', example: 'password123' },
                role: { type: 'string', example: 'admin' },
                countryCode: { type: 'string', example: '+1' },
                mobile: { type: 'string', example: '1234567890' },
                email: { type: 'string', example: 'john.doe@example.com' },
                active: { type: 'boolean', example: true },
                deviceType: { type: 'number', example: 1 },
                deviceToken: { type: 'string', example: 'device-token' },
                deviceID: { type: 'string', example: 'device-id' },
                notificationInMobile: { type: 'boolean', example: true },
                notificationInEmail: { type: 'boolean', example: true },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'User added successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Forbidden'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error'
    })
    async addUser(@Req() req, @Res() res) {
        try {
            const reqBody = req.body;
            if (reqBody.password != reqBody.confirmPassword) return res.json({ "status": -1, "message": "password not matched" });

            reqBody.fullName = reqBody.firstName + " " + reqBody.lastName;
            await this.userService.insertUser(reqBody);
            return res.json({ status: 1, message: "User added successfully" });
        } catch (error) {
            if (error.name === 'ValidationError') {
                // Extract the specific validation error message for contactNumber
                if (error.errors?.mobile?.message != undefined) {
                    var errorMessage = error.errors.mobile.message;
                } else if (error.errors?.email?.message != undefined) {
                    var errorMessage = error.errors.email.message;
                }
                return res.status(400).send({ status: -1, message: errorMessage });
            }
            else if (error.code == 11000) {
                if (error.keyPattern.email == 1) {
                    return res.status(400).send({ status: -1, message: "Email already exist" });
                } else if (error.keyPattern.mobile == 1) {
                    return res.status(400).send({ status: -1, message: "Mobile number already exist" });
                }
            } else {
                return res.status(500).json({ status: -1, message: 'Internal server error' });
            }
        }
    }

    @Get("/list")
    @ApiOperation({ summary: 'Get all the list' })
    @ApiResponse({
        status: 200,
        description: 'User Listed successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Forbidden'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error'
    })
    async allUserList(@Req() req, @Res() res) {
        try {
            const result = await this.userService.findAllUser({});
            return res.status(200).json({ status: 1, message: "User Listed successfully", responseData: result });
        } catch (err) {
            console.log("err", err);
            return res.status(500).json({ status: -1, message: "internal error" });
        }
    }

    @Post("/getById")
    @ApiOperation({ summary: 'Get all the list' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: '65aca32e621d2e9fcbe23910' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'User Listed successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Forbidden'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error'
    })
    async getUser(@Req() req, @Res() res) {
        try {
            const reqBody = req.body;
            const result = await this.userService.getUserDetail({ _id: reqBody.userId });
            return res.status(200).json({ status: 1, message: "success", responseData: result });
        } catch (err) {
            return res.status(500).json({ status: -1, message: "internal error" });
        }
    }

    @Post("/update")
    @ApiOperation({ summary: 'Update the user by Id' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                _id: { type: 'string', example: '65aca32e621d2e9fcbe23910' },
                fullName: { type: 'string', example: 'John Doe' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                password: { type: 'string', example: 'password123' },
                role: { type: 'string', example: 'admin' },
                countryCode: { type: 'string', example: '+1' },
                mobile: { type: 'string', example: '1234567890' },
                email: { type: 'string', example: 'john.doe@example.com' },
                active: { type: 'boolean', example: true },
                deviceType: { type: 'number', example: 1 },
                deviceToken: { type: 'string', example: 'device-token' },
                deviceID: { type: 'string', example: 'device-id' },
                notificationInMobile: { type: 'boolean', example: true },
                notificationInEmail: { type: 'boolean', example: true },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'User updated successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Forbidden'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error'
    })
    async updateUser(@Req() req, @Res() res) {
        try {
            const reqBody = req.body;
            if (reqBody.firstName != undefined && reqBody.lastName != undefined) {
                reqBody.fullName = reqBody.firstName + " " + reqBody.lastName;
            }
            await this.userService.updateUser(reqBody._id, reqBody);
            return res.status(200).json({ status: 1, message: "User updated successfully" });
        } catch (err) {
            return res.status(500).json({ status: -1, message: "internal error" });
        }
    }

    @Post("/delete")
    @ApiOperation({ summary: 'Delete the user by the Id' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: '65aca32e621d2e9fcbe23910' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Forbidden'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error'
    })
    async removeUser(@Req() req, @Res() res) {
        try {
            const reqBody = req.body;
            await this.userService.deleteUser(reqBody.userId);
            return res.status(200).json({ status: 1, message: "User deleted successfully" });
        } catch (err) {
            return res.status(500).json({ status: -1, message: "internal error" });
        }
    }

    @Post("/login")
    @ApiOperation({ summary: 'Login' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string', example: 'KalaiSelvan' },
                password: { type: 'string', example: '123456' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'User login successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Forbidden'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error'
    })
    async login(@Req() req, @Res() res) {
        const reqQuery = req.query;
        try {
            const reqBody = req.body;
            if (!reqBody.username) return res.status(400).json({ status: -1, message: "validation error" });
            if (!reqBody.password) return res.status(400).json({ status: -1, message: "validation error" });

            const userDetail = await this.userService.getUserDetail({ "email": reqBody.username, "password": reqBody.password });

            if (userDetail == null) return res.status(400).json({ status: -2, message: "invalid credentials" });

            if (userDetail.active == false) return res.status(400).json({ status: -3, message: "login not active" });

            // Generate Token
            const refreshToken = jwt.sign({ userId: userDetail._id, role: userDetail.role }, env.REFRESHSECRETKEY);

            const refreshUser = jwt.verify(refreshToken, env.REFRESHSECRETKEY);
            const accessToken = jwt.sign({ userId: refreshUser.userId, role: userDetail.role }, env.ACCESSSECRETKEY, { expiresIn: env.ACCESSEXPIREDTIME });

            return res.status(200).json({ status: 1, message: "login successfully", "refreshToken": refreshToken, "accessToken": accessToken, "role": userDetail.role, "userId": userDetail._id });
        } catch (err) {
            return res.status(500).json({ status: -1, message: "internal error" });
        }
    }

    @Post("/logout")
    @ApiOperation({ summary: 'Logout' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                _id: { type: 'string', example: '65aca32e621d2e9fcbe23910' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'User logout successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Forbidden'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error'
    })
    async logout(@Req() req, @Res() res) {
        try {
            const reqBody = req.body;
            const userDocs = await this.userService.getUserDetail({ _id: reqBody.userId });
            if (userDocs == null) return res.status(400).json({ status: -1, message: "user not found" });

            return res.status(200).json({ status: 1, message: "logout successfully" });
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ status: -1, message: "jwt error" });
            }
            return res.status(500).json({ status: -1, message: "internal error" });
        }
    }

}