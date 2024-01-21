import { ApiProperty } from "@nestjs/swagger";
import * as mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
    fullName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    role: { type: String },
    countryCode: { type: String },
    mobile: { 
        type: String,
        trim: true,
        required: true,
        minlength: [10, 'Contact number must be 10 digits long'],
        maxlength: [10, 'Contact number must be 10 digits long'],
        match: [/^\d{10}$/, 'Invalid contact number format'],
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true, // Trim leading and trailing whitespaces
        lowercase: true, // Convert email to lowercase
        match: /^\S+@\S+\.\S+$/, // Basic email format validation
    },
    active: { type: Boolean, default: true },  // true -> active, false -> inActive
    notificationInMobile: { type: Boolean, default: true },
    notificationInEmail: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
});

export interface user extends mongoose.Document {
    _id: mongoose.ObjectId;
    fullName: String;
    firstName: String;
    lastName: String;
    password: String;
    role: String;
    countryCode: String;
    mobile: Number;
    email: String;
    active: Boolean; // true, false
    deviceType: Number;
    deviceToken: String;
    deviceID: String;
    notificationInMobile: Boolean;
    notificationInEmail: Boolean;
}