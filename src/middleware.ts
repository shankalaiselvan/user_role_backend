import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
const common = require("./common/CommonFunction");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const env = process.env;
import { ObjectId } from 'mongodb';
var MongoClient = require('mongodb').MongoClient;
const mongoDB = new MongoClient('mongodb+srv://las2023:fzGFJexqt4ym5Pw6@las.qnzzuhw.mongodb.net');

@Injectable()

export class authPage implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const reqQuery = req.query;
        try {
            const reqHeader = req.headers;
            if (!reqHeader.authorization) return res.status(401).json({ "httpCode": 401, "status": -1, "message": common.translate("##jwt error##", reqQuery.language) });

            // Token Verify
            const authorizedUser = common.verifyAccessToken(reqHeader.authorization);
            const userId = new ObjectId(authorizedUser.userId);
            await mongoDB.connect();
            const userDocs = await mongoDB.db('user_ms').collection("users").findOne({ "_id": userId });
            console.log("userDocs", userDocs);
            if (userDocs != null) {
                next();
            } else {
                return res.send({ "httpCode": 400, "status": -1, "message": common.translate("##jwt error##", reqQuery.language) });
            }
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ "httpCode": 401, "status": -1, "message": common.translate("##jwt error##", reqQuery.language) });
            }
        }

    }
}

// const authPage = (permissions) => {
//     return (req, res, next) => {
//         const userRole = req.body.role
//         if (permissions.includes(userRole)) {
//             next()
//         } else {
//             return res.send("you don't have permission")
//         }
//     }
// };

// const authCourse = (req, res, next) => {

// };

// module.exports = { authPage, authCourse }

/* @Injectable()
export class authPage implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const permissions = ["Admin", "Teacher"];
        const userRole = req.body.role;
        if (permissions.includes(userRole)) {
            next()
        } else {
            return res.send("you don't have permission")
        }
    }
} */
