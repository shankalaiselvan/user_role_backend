import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { user } from "./user.model";
require('dotenv').config();
const env = process.env;

@Injectable() export class userService {
    constructor(@InjectModel("user") private readonly userModel: Model<user>) { }
    async insertUser(body) {
        const newUser = new this.userModel(body);
        const result = await newUser.save();
        return result;
    }

    async findAllUser(body: object) {
        var result = await this.userModel.find(body);
        return result;
    }

    async getUserDetail(userInfo: object) {
        const result = await this.userModel.findOne(userInfo);
        return result;
    }

    async updateUser(id, body) {
        const result = await this.userModel.updateOne({ _id: id }, {
            $set: body
        });
        return result;
    }

    async deleteUser(userId: string) {
        const result = await this.userModel.deleteOne({ _id: userId }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException("Could not find the user.");
        }
    }

}