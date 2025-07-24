import express from "express";
import { getLoginState,getLoggedInEmail } from "./auth.js";
const router = express.Router();

router.post("/external",(req,res)=>{
    console.log(req.body);
    const {internal} = req.body;
    console.log(internal);
})
export default router;