"use server";

import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const postUser = async (payload) => {
    console.log(payload);
    // 0. validation


    // 1. check user is existing or not
    const isExist = await dbConnect("users").findOne({
        email: payload.email,
    });

    if (isExist) {
        return {
            success: false,
            message: "User already exist",
        }
    }

    // 2. if not user, create a new user
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = {
        ...payload,
        createdAt: new Date().toISOString(),
        role: "user",
        password: hashedPassword,
    }

    // 3. send user to database
    const result = await dbConnect("users").insertOne(newUser);
    if (result.acknowledged) {
        return {
            success: true,
            message: `User created with ${result.insertedId.toString()}`,
        }
    } else {
        return {
            success: false,
            message: `User create to failed! Try again.`,
        }
    }
}