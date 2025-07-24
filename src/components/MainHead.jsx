import React from "react";
const MainHeadStyles = {
    fontSize: "55px",
    fontWeight: "bold",
    color: "white",
    position: "relative",
    textAlign: "center",
    top: "-50px",
}
function MainHead(){
    return(
        <>
        <div style={MainHeadStyles}>
        InterCal
        </div>
        </>
    );
}
export default MainHead;