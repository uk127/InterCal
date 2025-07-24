import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import MainHead from "./MainHead";
import { useUser } from "../context/usercontext";

const MainHeadStyles = {
    position: "relative",
    top: "-40px",
    color: "red"
}
const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(50, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
};

const modalContentStyle = {
    background: "white",
    padding: "20px",
    height: "110px",
    width: "250px",
    borderRadius: "12px",
    textAlign: "center",
};
const subjectNameInputStyle = {
    width: "250px",
    height: "45px"
}
const nextBtnStyle = {
    background: "black",
    color: "white",
    position: "relative",
    top: "10px"
}
function Input_bar() {
    // const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
    const [c1, set_c1] = useState("");
    const [c2, set_c2] = useState("");
    const [c3, set_c3] = useState("");
    const [a1, set_a1] = useState("");
    const [a2, set_a2] = useState("");
    const [a3, set_a3] = useState("");
    const [showSubmitLayer, setShowSubmitLayer] = useState(false);

    const [x, set_x] = useState();               // internal marks
    const [e, set_e] = useState();               // external marks
    const [total, set_total] = useState();       // total = internal + external
    const [showSave, setShowSave] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const [showSub, setSub] = useState(false);
    const [subject, setSubject] = useState();
    const [internal, setInternal] = useState();
    const [external, setExternal] = useState();
    const [loginStatus, setLoginStatus] = useState(true);
    const [showModal, setShowModal] = useState(true);
    const { user, setSubjectCount } = useUser();

    function handleClick() {
        setShowSubmitLayer(true);
        const m1 = (parseFloat(c1) * 0.7) + (parseFloat(a1) * 0.3);
        const m2 = (parseFloat(c2) * 0.7) + (parseFloat(a2) * 0.3);
        const m3 = (parseFloat(c3) * 0.7) + (parseFloat(a3) * 0.3);
        const sum = (m1 + m2 + m3) / 3;
        //x -> internal
        const x = sum * 0.8;
        setInternal(x);
        // axios.post("http://localhost:5000/subject/data", {
        //     c1: c1,
        //     c2: c2,
        //     c3: c3,
        //     a1: a1,a
        //     a2: a2,
        //     a3: a3
        // })
        //     .then((res) => {
        //         // navigate("/submit");
        //         console.log("from server", res.data);
        //     }
        //     )
    }

    // Load internal marks when component mounts
    // useEffect(() => {
    //     axios.get("http://localhost:5000/subject/data")
    //         .then(res => {
    //             setInternal(res.data.internal);
    //             console.log(res.data);
    //         })
    //         .catch((err) => {
    //             console.log("Error fetching internal marks:", err);
    //         });
    // }, []);

    // Submit button handler - calculate total
    function handle_submit() {
        // axios.post("http://localhost:5000/exter/external", {
        //     external: e,
        //     internal: internal
        // })
        //     .then((res) => {
        //         set_total(res.data.total);
        //         setShowSave(true); // show Save button after total is calculated
        //     })
        //     .catch(err => {
        //         console.error("Error calculating total:", err);
        //     });
        const y = parseFloat(e) * 0.6;
        setExternal(y);
        const t = internal + y;
        set_total(t);
        setShowSave(true);
    }

    // Save button handler - store marks in MongoDB
    function handle_save() {

        if (localStorage.getItem("email")) {
            setSub(true);
        } else {
            //login false
            navigate("/signin");
        }


        // try {
        //     const res = await axios.get("http://localhost:5000/savemarks");
        //     if (res.data.login) {
        //         console.log("Login confirmed. Showing subject input.");
        //         setSub(true);
        //     }
        // }
        // catch (err) {
        //     console.error("Error saving marks:", err);
        //     setSaveMsg("Failed to save marks.");
        // }
    }
    async function handle_next() {
        console.log(user.maxSubjectCnt);
        if (user.maxSubjectCnt >= 10) {
            alert("Maximum of 10 subjects allowed.");
            return;
        }


        if (!subject || subject.trim() === "") {
            alert("Enter the subject Name");
            return;
        }
        try {
            setShowModal(false);
            const res = await axios.post(`${import.meta.env.VITE_AXIOS_URL}subject/data`, {
                c1: c1,
                c2: c2,
                c3: c3,
                a1: a1,
                a2: a2,
                a3: a3,
                internal: internal,
                subject: subject
            })
                .then((res) => {
                    // navigate("/submit");
                    console.log("from server", res.data);
                }
                )
            setSubjectCount(user.maxSubjectCnt + 1);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            {/* <h1 className="main_head">Internal Cal</h1> */}
            {/* <p style={{fontSize:"40px",color: "white",position:"relative",left:"-100px"}}>{user.maxSubjectCnt}</p> */}
            <MainHead style={MainHeadStyles} />
            <div className={`layer ${showSubmitLayer ? "hidden" : "visible"} `}>
                <div className="head1">ENTER CAT 1 MARKS</div>
                <input
                    className="input1"
                    placeholder="CAT 1 Marks"
                    type="number"
                    value={c1}
                    onChange={(e) => set_c1(e.target.value)}
                />
                <div className="head1a">ENTER ASSIGNMENT 1 MARKS</div>
                <input
                    className="input1a"
                    placeholder="Assignment 1 Marks"
                    type="number"
                    value={a1}
                    onChange={(e) => set_a1(e.target.value)}
                />
                <div className="head2">ENTER CAT2 MARKS</div>
                <input
                    className="input2"
                    placeholder="CAT 2 Marks"
                    type="number"
                    value={c2}
                    onChange={function (e) { return set_c2(e.target.value) }}
                />

                <div className="head2a">ENTER ASSIGNMENT 2 MARKS</div>
                <input
                    className="input2a"
                    placeholder="Assignment 2 Marks"
                    type="number"
                    value={a2}
                    onChange={(e) => set_a2(e.target.value)}
                />

                <div className="head3">ENTER CAT3 MARKS</div>
                <input
                    className="input3"
                    placeholder="CAT3 Marks"
                    type="number"
                    value={c3}
                    onChange={(e) => set_c3(e.target.value)}
                />

                <div className="head3a">ENTER ASSIGNMENT 3 MARKS</div>
                <input
                    className="input3a"
                    placeholder="Assignment 3 Marks"
                    type="number"
                    value={a3}
                    onChange={(e) => set_a3(e.target.value)}
                />
                <br />
                <button className="cal_btn" onClick={handleClick}>Calculate</button>

            </div>
            <div className={`submit_layer ${showSubmitLayer ? "visible" : "hidden"}`}>
                <h1 className="internal_head">Your Internal is {internal} out of 40</h1>

                <div className="external_head">Enter your External Marks (out of 100)</div>
                {(
                    <input
                        placeholder="Enter the External marks"
                        className="external_input"
                        type="number"
                        onChange={(e) => set_e(e.target.value)}
                    />
                )}

                <button onClick={handle_submit} className="submit_btn">Submit</button>

                <div className="total_head">Total Marks</div>
                <div className="total_txt">{total}</div>

                {showSave && (
                    <button onClick={handle_save} className="save_btn">Save</button>
                )}
                {showSub && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            {/* Close Icon */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "-30px",
                                    right: "15px",
                                    fontSize: "75px",
                                    cursor: "pointer",
                                    color: "#999",
                                }}
                                onClick={() => setSub(false)} // close the popup
                            >
                                &times;
                            </div>
                            <input style={subjectNameInputStyle} placeholder="Enter Subject Name" value={subject} onChange={(e) => { setSubject(e.target.value) }} />
                            <button onClick={handle_next} style={nextBtnStyle}>Next</button>
                            {/* <h1>{subject}</h1> */}
                        </div>
                    </div>
                )}


                {/* {saveMsg && <div className="save_msg">{saveMsg}</div>} */}
            </div>
        </>
    );
}
export default Input_bar;