import express from "express";

const router = express.Router();
var login = false;
let loggedInUserEmail = null;

export function setLoginState(isLoggedIn,email){
    login = isLoggedIn;
    loggedInUserEmail = email;
}
export function getLoginState(){
    return login;
}
export function getLoggedInEmail(){
    return loggedInUserEmail;
}

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Received from frontend:", req.body);
        console.log(name, email, password);
        const db = req.db;
        const collection = db.collection("users");
        const exist_user = await collection.findOne({ email });
        if (exist_user) {
            console.log("user already exist");
            res.json({msg:"User already exist."});
        } else {
            await collection.insertOne({ email: email, name: name, password: password });
            console.log("user saved to the db");
            res.json({msg: "Account created successfully"});
        }
    }
    // res.statusCode(201).json({msg: "user saved",id: result.insertedId});
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
);
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("received from fontend", req.body);
        console.log(email, password);
        const db = req.db;
        const collection = db.collection("users");
        const exist_user = await collection.findOne({ email });
        if (!exist_user) {
            console.log("user does not exist");
            // alert("login success");
            return res.status(404).json({ msg: "User does not exist" });

        }
        if (exist_user.password !== password) {
            console.log("Invalid password");
            return res.status(401).json({ msg: "Invalid password" });
        }
        else {
            // login=true;
            setLoginState(true,email);
            
            console.log("Login success");
            console.log(login);
            res.json({
                msg: true,
                user: {
                    name: exist_user.name,
                    email: exist_user.email,
                    id: exist_user._id,
                },
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/logout",(req,res)=>{
    const {email} = req.body;
    if(email === loggedInUserEmail){
        setLoginState(false,null);
        console.log(`User ${email} logged out`);
        return res.json({success: true, msg: "logged out successfully"});
    }else{
        console.log("No user is logIn");
        return res.status(400).json({success: false, msg: "no user loggedIn"})
    }
    
})
export default router;