import express from "express";
import { getLoginState, getLoggedInEmail } from "./auth.js";
const router = express.Router();

// let login = false;
// let loggedInUserEmail = null;

// export function setLoginState(isLoggedIn, email) {
//     login = isLoggedIn;
//     loggedInUserEmail = email;
// }


// router.get("/data", (req, res) => {
//     res.json(
//         {
//             internal: internal
//         }
//     );
// });

router.post("/data", async (req, res) => {
    const { c1, c2, c3, a1, a2, a3, subject ,internal} = req.body;
    console.log(req.body);
    console.log(c1, c2, c3, a1, a2, a3, internal, subject);
    const isLoggedIn = getLoginState();
    const email = getLoggedInEmail();
    // const subData = {
    //     // name: subjectName,
    //     cat1: c1,
    //     cat2: c2,
    //     cat3: c3,
    //     assignment1: a1,
    //     assignment2: a2,
    //     assignment3: a3,
    //     // internal
    // };
    if (!isLoggedIn || !email) {
        console.log("not login response send to fontend");
        return res.json(
            {
                saved: false,
                msg: "not saved",
                catmarks: [c1, c2, c3],
                assigmentmarks: [a1, a2, a3]
            }
        );
    }
    console.log(c1, c2, c3, a1, a2, a3);
    console.log("email",email);
    const db = req.db;
    try {
        const subjectData = {
            cat1: c1,
            cat2: c2,
            cat3: c3,
            assignment1: a1,
            assignment2: a2,
            assignment3: a3,
            internal: internal
        };
        //update user with new subject
        const result = await db.collection("users").updateOne(
            { email: email },
            { $set: { [`subjects.${subject}`]: subjectData } }
        );
        console.log('subject details stored in db successfully')
        res.json({
            saved: true,
            msg: "Subject data saved successfully",
            result: result
        });
    } catch (err) {
        console.error(err);
    }
});
router.post("/getsubjects", async (req, res) => {
    const { email } = req.body;
    const db = req.db;
    console.log("this is email",email);

    try {
        const user = await db.collection("users").findOne({ email });
        if (!user || !user.subjects) {
            return res.json({});
        }
        res.json(user.subjects);
    } catch (err) {
        console.error("Error fetching subjects:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/removesubject",async(req,res)=>{
    const db = req.db;
    const {email,subject} = req.query;
    try{
        const result = await db.collection("users").updateOne(
            {email: email},
            {$unset : {[`subjects.${subject}`]:""}}
        );
        res.json({success: true, msg: "subject removed successfully"});
    }catch(err){
        res.status(500).json({succes: false, msg:"Internal server error"});
    }
});
router.post("/addsubject", async (req, res) => {
  const db = req.db;
  const {
    email,
    subject,
    cat1,
    cat2,
    cat3,
    assignment1,
    assignment2,
    assignment3,
    internal,
  } = req.body;

  if (!email || !subject) {
    return res.status(400).json({ success: false, msg: "Email and subject are required." });
  }

  try {
    const subjectData = {
      cat1,
      cat2,
      cat3,
      assignment1,
      assignment2,
      assignment3,
      internal,
    };

    const result = await db.collection("users").updateOne(
      { email: email },
      { $set: { [`subjects.${subject}`]: subjectData } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, msg: "User not found or no change made." });
    }

    res.json({ success: true, msg: "Subject saved successfully." });
  } catch (err) {
    console.error("Error adding subject:", err);
    res.status(500).json({ success: false, msg: "Internal Server Error." });
  }
});
// Get all subjects as array for a given email
router.get("/getsubjects", async (req, res) => {
  const db = req.db;
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, msg: "Email is required" });
  }

  try {
    const user = await db.collection("users").findOne({ email });

    if (!user || !user.subjects) {
      return res.status(404).json({ success: false, msg: "No subjects found" });
    }

    const subjectsArray = Object.entries(user.subjects).map(([subjectName, data]) => ({
      name: subjectName,
      ...Object.fromEntries(
        Object.entries(data).map(([key, val]) => [key, Number(val)])
      )
    }));

    res.json({ success: true, subjects: subjectsArray });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

export default router;