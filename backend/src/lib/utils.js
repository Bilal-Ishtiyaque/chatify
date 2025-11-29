import jwt from "jsonwebtoken";

import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
    const { JWT_SECRET } = ENV;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    //creating jwt token
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "7d",
    });
    
    //it says, here is your token, keep it as a cookie, and send it back with future requests so I know who you are
    res.cookie("jwt", token, {
        //making the authentication cookie secure
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevent XSS attacks: cross-site scripting
        sameSite: "strict", //prevent CSRF attacks
        secure: ENV.NODE_ENV === "development" ? false : true,
    });

    return token;
};