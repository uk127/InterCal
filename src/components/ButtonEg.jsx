import React from "react";
function ButtonEg(){
    function handleclick(e){
        alert("You clicked "+e.target.id)
    }
    return(
        <button className="btn" id="id_button" onClick={handleclick}>click me</button>
    )
}

export default ButtonEg