import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";

import {Router} from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = Router();

router.use(arcjetProtection); // by using it here like this, it will run before any of the below routes

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout); // we'll use 'POST' in logout instead of 'GET'

router.put("/update-profile", protectRoute, updateProfile); // if user is authenticated, only then it will be able to run next function 'updateProfile'

router.get("/check", protectRoute, (req, res)=> res.status(200).json(req.user)); // it will run on every refresh in application frontend

export default router;