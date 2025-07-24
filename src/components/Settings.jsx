import axios from "axios";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/usercontext";
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
    height: "130px",
    width: "250px",
    borderRadius: "12px",
    textAlign: "center",
};
const modalOverlayPasswordStyle = {
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

const modalContentPasswordStyle = {
    background: "white",
    padding: "20px",
    height: "200px",
    width: "250px",
    borderRadius: "12px",
    textAlign: "center",
};
const deleteHeadingStyles = {
    color: "",
    fontSize: "20px"
}
const accDeleteBtnStyles = {
    background: "red",
    color: "white"
}
const submitBtnStyle = {
    background: "black",
    color: "white",
    position: "relative",
    top: "20px"

}
const changePasswordInputs = {
    margin: "10px",
    height: "30px",
    width: "220px"
}
const enableBtnStyle = {
    color: "black",
    background: "white",
    position: "relative",
    left: "250px",
    top: "-60px"
}
const downloadTxtStyle = {
    color: "white",
    fontSize: "25px"
}
const downloadTxtDesStyle = {
    color: "white",
    fontSize: "20px"
}
const popUpWindowStyle = {
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
}
const popUpWindowContentStyle = {
    background: "white",
    padding: "20px",
    height: "130px",
    width: "250px",
    borderRadius: "12px",
    textAlign: "center",
}
const continueBtnStyle = {
    color: "white",
    background: "black",
    position: "relative",
    left: "-5px",
    top: "-15px"
}
const Settings = () => {
    const { user, setUser } = useUser();
    const [email, setEmail] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showModalPassword, setShowModalPassword] = useState(false);
    const [close, setClose] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [enableBtnText, setEnableBtnText] = useState("Enable");
    const [showModalPopUp, setShowModalPopUp] = useState(false);
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(JSON.parse(storedEmail));
        }
    }, []);

    function handleContinue() {
        setShowModalPopUp(false);
    }
    function handleEnableBtn() {
        if (user.enableBtnText === "Enable") {
            setUser((prev) => ({
                ...prev,                 // keep other fields (email, name, etc.)
                downloadOption: "jpeg",  // update only this one
                enableBtnText: "Disable"
            }));
            // setEnableBtnText("Disable");
        } else {
            setUser((prev) => ({
                ...prev,
                downloadOption: "pdf",
                enableBtnText: "Enable"
            }));

            // setEnableBtnText("Enable");
        }
    }
    function handleDeleteAcc() {
        setShowModal(true);
    }
    function handleChange() {
        setShowModalPassword(true);
    }
    async function confirmDelete() {
        const email = JSON.parse(localStorage.getItem("email"));
        try {
            const res = await axios.delete(`${import.meta.env.VITE_AXIOS_URL}settings/deleteuser`, {
                params: { email }
            });
            if (res.data.msg == "user deleted successfully") {
                // setShowModalPassword(false);
                setMsg("Your Account deleted successfully");
                setShowModalPopUp(true);
                localStorage.clear();
                navigate("/");
                window.location.reload();
                setShowModalPassword(false);
            }
        } catch (err) {
            console.error("Delete error:", err);
            setShowModal(false);
        };
    }
    async function handlePasswordSubmit() {
        if (!currentPassword || !newPassword) {
            setMsg("Please fill in both fields.");
            setShowModalPopUp(true);
            return;
        }
        if (newPassword.length < 8) {
            setMsg("Password must be at least 8 characters");
            setShowModalPopUp(true);
            return;
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_AXIOS_URL}settings/changepassword`, {
                email: email,
                curPassword: currentPassword,
                newPassword: newPassword
            })
            const message = res.data.msg;

            if (message === "user not found") {
                setMsg("User not found");
            } else if (message === "current password is not matched") {
                console.log("current password is not matched");
                setMsg("Current password is not matched");
            } else if (message === "Password updated successfully") {
                setMsg("Password updated successfully");
                setShowModalPassword(false);
            } else {
                setMsg("Unexpected response");
            }

            setShowModalPopUp(true); // Open modal for all cases

        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
        {/* <p>{msg}</p> */}
            <div className="settings_container">
                <div className="acc_management_head">Account Management</div>
                <div className="account_section">
                    <div className="account-txt-layer">
                        <div className="account-txt">Delete Account</div>
                        <p className="account-txt-des">Permanently delete your account and data.</p>
                        <button className="acc-delete-btn" onClick={handleDeleteAcc}>Delete</button>
                    </div>

                    <div className="account-txt-layer2">
                        <div className="account-txt">Change Password</div>
                        <p className="account-txt-des"></p>
                    </div>
                    <button className="acc-password-btn" onClick={handleChange}>Change</button>
                </div>
                <div className="acc_management_head">Download Options</div>
                <div className="download_section">
                    <div className="account-txt-layer">
                        <div style={downloadTxtStyle}>Image download</div>
                        <p style={downloadTxtDesStyle}>(.jpeg)</p>
                        <button style={enableBtnStyle} onClick={handleEnableBtn}>{user.enableBtnText}</button>
                    </div>
                </div>

            </div>
            {showModal && (
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
                            // close the popup
                            onClick={() => setShowModal(false)}
                        >
                            &times;
                        </div>
                        <h2 style={deleteHeadingStyles}>Do you want to delete your account permanently?</h2>
                        <button style={accDeleteBtnStyles} onClick={confirmDelete}>Delete</button>
                    </div>
                </div>
            )}
            {showModalPassword && (
                <div style={modalOverlayPasswordStyle}>
                    <div style={modalContentPasswordStyle}>
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
                            // close the popup
                            onClick={() => setShowModalPassword(false)}
                        >
                            &times;
                        </div>
                        <div></div>
                        <input
                            onChange={(e) => { setCurrentPassword(e.target.value) }}
                            value={currentPassword}
                            placeholder={"Enter current password"}
                            required
                            style={changePasswordInputs} />
                        <input onChange={(e) => { setNewPassword(e.target.value) }}
                            value={newPassword}
                            placeholder={"Enter new password"}
                            required
                            style={changePasswordInputs} />
                        {/* <input placeholder={"Confirm new password"}style={changePasswordInputs}/> */}
                        <br />
                        <button style={submitBtnStyle} onClick={handlePasswordSubmit}>Submit</button>
                    </div>
                </div>
            )}
            {showModalPopUp && (
                <div style={popUpWindowStyle}>
                    <div style={popUpWindowContentStyle}>
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
                            // close the popup
                            onClick={() => setShowModalPopUp(false)}
                        >
                            &times;
                        </div>
                        <h2>{msg}</h2>
                        <button style={continueBtnStyle} onClick={handleContinue}>Continue</button>
                    </div>
                </div>
            )}

        </>
    );
}
export default Settings;