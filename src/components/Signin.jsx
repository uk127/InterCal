import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import MainHead from "./MainHead";
import {useUser} from "../context/usercontext"
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
  borderRadius: "12px",
  textAlign: "center",
};

function Signin() {
    const [ps, setPs] = useState("");
    const [email, setEmail] = useState("");
    const [marks, setMarks] = useState([]);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [showModal, setShowModal] = useState(false);

    const { setUser, setSubjectCount } = useUser();
    
    const navi = useNavigate();
    useEffect(() => {
        // Get data from localStorage
        const stored = localStorage.getItem("latest_marks");
        if (stored) {
            setMarks(JSON.parse(stored)); // Convert string back to array
        }
    }, []);
    const handleSubmit = async () => {
        if (!email.trim() || !ps.trim()) {
            alert("Email and password cannot be empty.");
            return;
        }
        try {
            localStorage.setItem("email", JSON.stringify(email));
            const endpoint = `${import.meta.env.VITE_AXIOS_URL}auth/signin`;
            console.log("Calling API:", endpoint);
            const res = await axios.post(endpoint, {
                email: email,
                password: ps
            });
            if (res.data.msg) {
                localStorage.setItem("name", JSON.stringify(res.data.user.name));
                localStorage.setItem("email", JSON.stringify(res.data.user.email));
                setShowModal(true);


            }

        } catch (err) {
            // Handle error response from backend
            if (err.response) {
                if (err.response.status === 404) {
                    alert("User does not exist.");
                } else if (err.response.status === 401) {
                    alert("Incorrect password.");
                } else {
                    alert("Something went wrong. Status: " + err.response.status);
                }
            } else {
                alert("Server not responding.");
                console.error(err);
            }
        }
    }
    const handleContinue = ()=>{
        setShowModal(false);
        
        navi("/");
        window.location.reload();
    }
    return (
        <>
            <MainHead />
            {/* <h1>Signin</h1> */}
            <div className="signin_layer">
                <div>

                    {/* <h2>user name {userName}</h2>
                    <h2>Email {email}</h2>
                    <h2>user id {userId}</h2> */}
                    {/* {marks.length > 0 ? (
                        <ul>
                            {marks.map((mark, index) => (
                                <li key={index}>Mark {index + 1}: {mark}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No marks found in localStorage.</p>
                    )} */}
                </div>
                <h1 className="signin_head">SignIn page</h1>
                <div className="sigin_email_head">Enter your email? </div>
                <input className="signin_email_input" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="signin_password_head" >Enter password</div>
                <input className="signin_password_input" type="password" placeholder="Enter password" value={ps} onChange={(e) => setPs(e.target.value)} />
                <button className="signin_submit" onClick={handleSubmit}>Submit</button>
                <div className="signin_bottom">Don't have an account ?</div>
                <Link to="/signup" className="signin_anchor">SignUp</Link>
                {showModal &&
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2>Login Successfully</h2>
                        <button style={{background: "black",color: "white"}} onClick={handleContinue}>Continue</button>
                    </div>
                </div>
                }
                {/* <p>
                    {email}
                    {ps}
                </p> */}
            </div>
        </>
    );
}
export default Signin;