import {Router} from "express";

const router = Router();

router.get("/send", (_, res)=>{
    res.send("hello send");
});

export default router;