import { signup, login, logout } from "../controllers/auth.controller.js";

import {Router} from "express";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout); // we'll use 'POST' in logout instead of 'GET'

export default router;