import React, { useEffect, useState,useRef } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
    // State to track sidebar visibility
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible,setIsVisible] = useState(true);
    const [userName,setUserName] = useState("");
    const [logOutStatus,setLogOutStatus] = useState(false);
    const [userEmail,setUserEmail] = useState("");
    const [showLogOutBtn,setShowLogOutBtn] = useState(false);
    //ref
    const sidebarRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(()=>{
        const name = localStorage.getItem("name");
        function handleClickOutside(event){
            if(sidebarRef.current && !sidebarRef.current.contains(event.target) && menuRef.current && !menuRef.current.contains(event.target)){
                setIsOpen(false);
            }
        }
        document.addEventListener("click",handleClickOutside);


        // localStorage.getItem("user_email");
        if(name){
        setUserName(name);
        setShowLogOutBtn(true);
        }
        return () => {
            document.removeEventListener("click",handleClickOutside);
        }
    },[]);
    
    
    // Function to open sidebar
    const openSidebar = () => {
        setIsOpen(true);
    };

    // Function to close sidebar
    const closeSidebar = () => {
        setIsOpen(false);
    };
    const logOut = async() =>{
        setLogOutStatus(true);
        const email = localStorage.getItem("email");
        setUserEmail(email);
        try{
        const res = await axios.post(`${import.meta.env.VITE_AXIOS_URL}auth/logout`,{
            email : email

        })
        }catch(err){
            console.log(err);
        }
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        window.location.reload();
    }
    return (
        <div>
            
            {/* Menu Icon */}
                <div className="toplayer">
                <img src="menu.png" className={`menu ${isOpen ? "open": ""}`} onClick={openSidebar} ref={menuRef}/>
                <div className="heading"></div>
                </div>

            {/* Sidebar - Controlled via CSS class */}
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <img src="cross.png" className="cross" onClick={closeSidebar} alt="Close" ref={sidebarRef}/>
                
                <div className="sections">
                    <i className="material-icons user-icon">account_circle</i>
                    <div className="section_a">
                        Welcome, <br/>{userName || "Guest"} 
                    </div>
                    <div className="section0">
                        {/* <a href="todaytimetable.html">Today Time Table</a> */}
                        <Link to="/signin"><i className="material-icons signin-icon">login</i>Sign In</Link>
                    </div>
                    <div className="section1">
                        {/* <a href="fulltimetable.html">View Full Time Table</a> */}
                        <Link to="/"><i className="material-icons home-icon">home</i>Home</Link>
                    </div>
                    <div className="section2">
                        {/* <a href="academic.html">Academic Schedule</a> */}
                        <Link to="/details"><i className="material-icons details-icon">account_box</i>User Details</Link>
                    </div>
                    <div className="section3">
                        {/* <a href="academic.html">Academic Schedule</a> */}
                        <Link to="/about"><i className="material-icons about-icon">info</i>About</Link>
                    </div>
                    <div className="section5">
                        <Link to="/settings"><i className="material-icons settings-icon">settings</i>Settings</Link>
                    </div>
                    <div className="section4">
                        {/* <a href="academic.html">Academic Schedule</a> */}
                        {/* <Link to="/details">Logout</Link> */}
                        {(showLogOutBtn &&
                        <button className="logOutBtn" onClick={logOut}>LogOut</button>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
