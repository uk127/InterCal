import express from "express";
import { getLoginState, getLoggedInEmail } from "./auth.js";
const router = express.Router();

router.delete("/deleteuser", async (req, res) => {
    const db = req.db;
    const {email} = req.query;
    if (!email) {
        return res.json({ msg: "user not found" });
    }
    try {
        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found in DB" });
        }
        const result = await db.collection("users").deleteOne({ email });
        console.log("user deleted successfully");
        res.json({ msg: "user deleted successfully" });
        
    } catch (err) {
        // console.log(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
router.post("/changepassword", async (req, res) => {
    const db = req.db;
    try {
        const { email, curPassword,newPassword } = req.body;
        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "user not found" });
        }
        if(user.password !== curPassword){
            return res.status(200).json({msg: "current password is not matched"})
        }

        const result = await db.collection("users").updateOne(
            { email },
            { $set: { password:newPassword } }
        );
        if (result.modifiedCount === 1) {
            // console.log("password updated successfully");
            return res.json({ msg: "Password updated successfully" });
        } else {
            return res.status(500).json({ msg: "Failed to update password" });
        }
    } catch(err) {
        // console.log(err);
        res.status(500).json({msg: "Internal server Error"});
    }
});

export default router;