import {Router} from "express";

const router = Router();

router.get("/login", (_, res)=>{
    res.send("hello login");
});

router.get("/logout", (_, res)=>{
    res.send("hello logout");
});

export default router;