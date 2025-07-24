import React from "react";
import { useNavigate } from "react-router-dom";

const Backbtn = ({style}) => {
  const navigate = useNavigate();

  const styles = {
    button: {
      backgroundColor: "black",
      fontSize: "30px",
      color: "white",
      border: "1px solid white",
      padding: "10px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "20px",
      transition: "background-color 0.3s ease",
    },
    hover: {
      backgroundColor: "#2563eb",
    },
    active: {
      backgroundColor: "#1e40af",
    },
  };

  return (
    <button
      style={styles.button}
      onClick={() => navigate(-1)}
      onMouseOver={(e) => (e.target.style.backgroundColor = styles.hover.backgroundColor)}
      onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
      onMouseDown={(e) => (e.target.style.backgroundColor = styles.active.backgroundColor)}
      onMouseUp={(e) => (e.target.style.backgroundColor = styles.hover.backgroundColor)}
    >
      <i className="material-icons">arrow_back</i>
    </button>
  );
};

export default Backbtn;
