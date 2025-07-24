import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../App.css"; // Make sure this path is correct
import ConfirmExample from "./ConfirmExample";
import {useUser} from "../context/usercontext";
function Details() {
  const {user, incrementSubjectCount, decrementSubjectCount,setSubjectCount} = useUser();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const printRef = useRef();
  const [showDownBtns, setShowDownBtn] = useState(false);
  const [editingValues, setEditingValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [displayAction,setDisplayAction] = useState(false);
  const [swapDownloadOption,setSwapDownloadOption] = useState();

const addSubject = () => {
  console.log("Current subject count:", rows.length);

  if (rows.length >= 10) {
    alert("Maximum of 10 subjects reached. Cannot add more.");
    return;
  }

  // Update the context before navigating
  setSubjectCount(rows.length);

  navigate("/"); // Navigate to the subject input page
};

  async function handlePrint() {
    navigate("/printingpreview");
    // const element = printRef.current;
    // const canvas = await html2canvas(element, {
    //   scale: 2,
    // });
    // const imgData = canvas.toDataURL("image/jpeg");
    // const pdf = new jsPDF("p", "mm", "a4");
    // const width = pdf.internal.pageSize.getWidth();
    // const height = (canvas.height * width) / canvas.width;

    // pdf.addImage(imgData, "JPEG", 0, 0, width, height);
    // pdf.setFontSize(20);
    // pdf.save("download.pdf");
  }

  useEffect(() => {
    if(user.downloadOption == "pdf"){
      setSwapDownloadOption("Generate PDF");
    }else{
      setSwapDownloadOption("Download IMG");
    }
    const fetchUserSubjects = async () => {
      try {
        const email = JSON.parse(localStorage.getItem("email"));
        const res = await axios.post(
          `${import.meta.env.VITE_AXIOS_URL}subject/getsubjects`,
          { email }
        );
        const data = res.data;
        console.log(data);
        const rowsArray = Object.entries(data).map(([subject, details], index) => ({
          id: index + 1,
          subject: subject,
          cat1: details.cat1,
          cat2: details.cat2,
          cat3: details.cat3,
          assign1: details.assignment1,
          assign2: details.assignment2,
          assign3: details.assignment3,
          internal: details.internal,
        }));

        setRows(rowsArray);
      } catch (error) {
        console.error("Error fetching user subjects:", error);
      }
    };

    fetchUserSubjects();
    if (localStorage.getItem("email")) {
      setShowDownBtn(true);
    }
  }, []);

  const removeRow = async (id, subject) => {
    const email = JSON.parse(localStorage.getItem("email"));
    try {
      const res = await axios.delete(`${import.meta.env.VITE_AXIOS_URL}subject/removesubject`, {
        params: { email, subject },
      });
      if (res.data.success) {
        setRows(rows.filter((row) => row.id !== id));
        decrementSubjectCount();
        alert(res.data.msg);
      } else {
        alert(res.data.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // ADDED: Calculate internal mark from cat and assignment scores
  const calculateInternal = (c1, a1, c2, a2, c3, a3) => {
    const m1 = (parseFloat(c1) * 0.7) + (parseFloat(a1) * 0.3);
    const m2 = (parseFloat(c2) * 0.7) + (parseFloat(a2) * 0.3);
    const m3 = (parseFloat(c3) * 0.7) + (parseFloat(a3) * 0.3);
    const avg = (m1 + m2 + m3) / 3;
    return Math.round(avg * 0.8);
  };
  // ADDED: Save the subject with updated internal to backend
  const saveToDB = async (row) => {
    try {
      const email = JSON.parse(localStorage.getItem("email"));
      await axios.post(`${import.meta.env.VITE_AXIOS_URL}subject/addsubject`, {
        email,
        subject: row.subject,
        cat1: row.cat1,
        cat2: row.cat2,
        cat3: row.cat3,
        assignment1: row.assign1,
        assignment2: row.assign2,
        assignment3: row.assign3,
        internal: row.internal,
      });
    } catch (err) {
      console.error("Error saving to DB", err);
    }
  };
  // ADDED: Update a field value, auto-calculate internal if all filled
  const updateField = (id, field, value) => {
    const updated = rows.map((row) => {
      if (row.id === id) {
        const newRow = { ...row, [field]: value };
        const allFilled = ["cat1", "cat2", "cat3", "assign1", "assign2", "assign3"].every(
          (f) => newRow[f] !== "" && newRow[f] !== undefined && newRow[f] !== null
        );
        if (allFilled) {
          newRow.internal = calculateInternal(
            Number(newRow.cat1),
            Number(newRow.assign1),
            Number(newRow.cat2),
            Number(newRow.assign2),
            Number(newRow.cat3),
            Number(newRow.assign3)
          );
          saveToDB(newRow); // Save if all fields filled
        }
        return newRow;
      }
      return row;
    });
    setRows(updated);
  };
  function handleBlur(row) {
    const allFilled = ["cat1", "cat2", "cat3", "assign1", "assign2", "assign3"].every(
      (f) => row[f] !== "" && row[f] !== undefined && row[f] !== null
    );

    if (allFilled) {
      const internal = calculateInternal(
        row.cat1,
        row.assign1,
        row.cat2,
        row.assign2,
        row.cat3,
        row.assign3
      );

      const updatedRow = { ...row, internal };
      saveToDB(updatedRow);

      // update internal in rows
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? updatedRow : r))
      );
    }
  }
  function handleEdit(){
    if(!isEdit){
      setIsEdit(true);
    }else{
      setIsEdit(false);
    }
  }
  return (
    <>
    <p></p>
    {/* <p style={{color:"white",fontSize:"45px",position: "relative",left:"60px"}}>{user.downloadOption}</p> */}
      <div className="details-wrapper">

        <div className="details-container" ref={printRef}>
          <div className="details-header"><span className="rotated-text">Subject</span></div>
          <div className="details-header"><span className="rotated-text">CAT 1</span></div>
          <div className="details-header"><span className="rotated-text">CAT 2</span></div>
          <div className="details-header"><span className="rotated-text">CAT 3</span></div>
          <div className="details-header"><span className="rotated-text">Assignment 1</span></div>
          <div className="details-header"><span className="rotated-text">Assignment 2</span></div>
          <div className="details-header"><span className="rotated-text">Assignment 3</span></div>
          <div className="details-header"><span className="rotated-text">Internal</span></div>
          <div className="details-header"><span className="rotated-text">Action</span></div>
          {rows.map((row) => (
            <React.Fragment key={row.id}>
              {/* <div className="details-cell">{row.subject}</div>
              <div className="details-cell">{row.cat1}</div>
              <div className="details-cell">{row.cat2}</div>
              <div className="details-cell">{row.cat3}</div>
              <div className="details-cell">{row.assign1}</div>
              <div className="details-cell">{row.assign2}</div>
              <div className="details-cell">{row.assign3}</div>
              <div className="details-cell">{row.internal}</div>
              <div className="details-cell">
                <img
                  className="details-remove-button"
                  onClick={() => removeRow(row.id, row.subject)}
                  src="delete.png"
                />
                
                
              </div> */}
              <div className="details-cell">{row.subject}</div>

              {/* MODIFIED: Conditionally render input for missing fields */}
              {["cat1", "cat2", "cat3", "assign1", "assign2", "assign3"].map((field) => (
                <div className="details-cell" key={field + row.id}>

                  {isEdit && (row[field] === "" || row[field] === null || row[field] === undefined )? (
                    <input
                      type = "number"
                      min = "0"
                      max = "50"
                      className = "details-input"
                      value = {
                          editingValues[row.id]?.[field] ?? ""  // use temporary editing value
                        }
                      onChange = {(e) => {
                        const value = e.target.value;
                        setEditingValues((prev) => ({
                    ...prev,
                    [row.id]: {
                    ...prev[row.id],
                    [field]: value,
                          },
                        }));
                      }}
                  onBlur={() => {
                    const value = editingValues[row.id]?.[field];
                    updateField(row.id, field, value);
                    setEditingValues((prev) => {
                      const updated = { ...prev };
                      delete updated[row.id]?.[field];
                      return updated;
                    });
                  }}
                    />
                  ) : (
                  <span>{row[field]}</span>
                  )}
                </div>
              ))}
                
              <div className="details-cell">{row.internal !== undefined ? row.internal : "-"}</div>
              <div className="details-cell">
                <img
                  className="details-remove-button"
                  onClick={() => removeRow(row.id, row.subject)}
                  src="delete.png"
                />
              </div>
      
            </React.Fragment>
          ))}
        </div>


      </div>
      {showDownBtns && (
        <div className="downbtns">
          <button className="detailsEditBtn" onClick={handleEdit}>Edit</button>
          <button className="addsubject" onClick={addSubject}>Add Subject</button>
          <button onClick={handlePrint} className="generate_pdf_btn">{swapDownloadOption}</button>
        </div>
      )}
    </>
  );
}

export default Details;
