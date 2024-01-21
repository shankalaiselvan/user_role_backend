import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { userController } from "./user.controller";
import { userSchema } from "./user.model";
import { userService } from "./user.service";
@Module({
    imports: [MongooseModule.forFeature([
        { name: "user", schema: userSchema }
    ])],
    controllers: [userController],
    providers: [userService],
    exports: [userService],
}) export class userModule { }