import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Submit() {
    const {isLoggedIn,user} = useAuth();

    const [x, set_x] = useState();               // internal marks
    const [e, set_e] = useState();               // external marks
    const [total, set_total] = useState();       // total = internal + external
    const [showSave, setShowSave] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const [showSub,setSub] = useState(false);
    const [subject,setSubject] = useState();
    const [internal,setInternal] = useState();
    

    const navigate = useNavigate();

    // Load internal marks when component mounts
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_AXIOS_URL}subject/data`)
            .then(res => {
                setInternal(res.data.internal);
                console.log(res.data);
            })
            .catch((err) => {
                console.log("Error fetching internal marks:", err);
            });
    }, []);

    // Submit button handler - calculate total
    function handle_submit() {
        axios.post(`${import.meta.env.VITE_AXIOS_URL}exter/external`, {
            external: e,
            internal: internal
        })
        .then((res) => {
            set_total(res.data.total);
            setShowSave(true); // show Save button after total is calculated
        })
        .catch(err => {
            console.error("Error calculating total:", err);
        });
    }

    // Save button handler - store marks in MongoDB
    async function handle_save() {
        try{
        const res = await axios.get(`${import.meta.env.VITE_AXIOS_URL}savemarks`);
        if(res.data.login){
            console.log("Login confirmed. Showing subject input.");
            setSub(true);
        }
        }
        catch(err){
            console.error("Error saving marks:", err);
            setSaveMsg("Failed to save marks.");
        }
    }
    async function handle_next(){
        const email = JSON.parse(localStorage.getItem("email"));
        const res = await axios.post(`${import.meta.env.VITE_AXIOS_URL}savesub`,{subject: subject,email : email});
        console.log(res.data);
    }

    return (
        <>
            <h1 className="submit_main_head">From submit component</h1>
            <div className="submit_layer">
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
                    <div>
                    <input placeholder="Enter Subject Name" value={subject} onChange={(e)=>{setSubject(e.target.value)} }/>
                    <button onClick={handle_next}>Next</button>
                    <h1>{subject}</h1>
                    </div>
                )}

                {/* {saveMsg && <div className="save_msg">{saveMsg}</div>} */}
            </div>
        </>
    );
}

export default Submit;
