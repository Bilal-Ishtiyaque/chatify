import { signup } from "../controllers/auth.controller.js";

import {Router} from "express";

const router = Router();

router.post("/signup", signup);

router.get("/login", (_, res)=>{
    res.send("hello login");
});

router.get("/logout", (_, res)=>{
    res.send("hello logout");
});

export default router;