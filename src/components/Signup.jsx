import {useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import MainHead from "./MainHead";
import { useNavigate } from "react-router-dom";
function Signup() {
    const [name,set_name] = useState("")
    const [email,set_email] = useState("");
    const [password,set_password] = useState("");
    const [confirm_password,set_confirm_password] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async ()=>{
        if(email === "" || password === "" || confirm_password === "" || name== ""){
            alert("Please fill all fields");
            return;
        }
        if(password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }
        if(password != confirm_password){
            alert("Password do not match.");
            return;
        }
        try{
            console.log("Sending to server", { name, email, password, confirm_password });
            const res = await axios.post(`${import.meta.env.VITE_AXIOS_URL}auth/signup`,{
                name : name,
                email: email,
                password: password,
            });
            // alert("response from server ",res.data);
            // alert(res.data.msg);
            if(res.data.msg === "Account created successfully"){
                alert("Account created successfully");
                navigate("/signin");
            }
        }catch(err){
            console.log(err);
        }
    }
    return (
        <>

            {/* <h1 className="signup_main_head">InterCal</h1> */}
            <MainHead/>
            <div className="signup_layer">
                <h1 className="signup_head">Signup page</h1>
                <div className="name_head">Enter your Name ?</div>
                <input className="signup_name_input" placeholder="Enter Name" value={name} onChange={(e)=>set_name(e.target.value)}/>
                <div className="email_head">Enter your email? </div>
                <input className="signup_email_input" placeholder="Enter email" value={email} onChange={(e)=>set_email(e.target.value)}/>
                <div className="password_head" >Enter password</div>
                <input className="signup_password" type="password" placeholder="Enter password" value={password} onChange={(e)=>set_password(e.target.value)}/>
                <div className="confirm_password_head" >Enter confirm password</div>
                <input className="signup_confirm_password" type="password" placeholder="Enter confirm password" value={confirm_password} onChange={ (e)=>set_confirm_password(e.target.value)}/>
                <button className="signup_submit" onClick={handleSubmit}>Submit</button>
                
                <div className="signup_bottom">Already have an account ?</div>
                <Link to="/signin" className="signup_anchor">SignIn</Link>
                <p>
                    {name}
                    {email}
                    {password}
                    {confirm_password}
                </p>
            </div>
        </>
    );
}
export default Signup;