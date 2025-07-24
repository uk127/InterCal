import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./PrintableTable.css";
import { useUser } from "../context/usercontext";
import Backbtn from "./Backbtn";
function Printingpreview() {
    const [subjects, setSubjects] = useState([]);
    const printRef = useRef();
    const { user, downloadOption } = useUser();
    useEffect(() => {
        const email = JSON.parse(localStorage.getItem("email"));// Replace with dynamic value from context

        axios.get(`${import.meta.env.VITE_AXIOS_URL}subject/getsubjects`, {
            params: { email },
        })
            .then((res) => {
                if (res.data.success) {
                    setSubjects(res.data.subjects);
                } else {
                    console.error("No subjects found.");
                }
            })
            .catch((err) => {
                console.error("Failed to fetch subjects:", err);
            });
    }, []);

    // PDF Download
    const handlePDFDownload = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/jpeg");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;

        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;

        pdf.addImage(imgData, "JPEG", 0, 0, newWidth, newHeight);
        pdf.save("marks.pdf");
    };

    // JPEG Download
    const handleJPEGDownload = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/jpeg");

        const link = document.createElement("a");
        link.href = imgData;
        link.download = "marks.jpeg";
        link.click();
    };

    return (
        <div>
            <h2
                className="download-preview-txt"
            >
                Download Preview
            </h2>

            {subjects.length === 0 ? (
                <p>No subjects available.</p>
            ) : (
                <>
                    <div ref={printRef} className="print-area">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>CAT 1</th>
                                    <th>CAT 2</th>
                                    <th>CAT 3</th>
                                    <th>Assignment 1</th>
                                    <th>Assignment 2</th>
                                    <th>Assignment 3</th>
                                    <th>Internal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((subj, i) => (
                                    <tr key={i}>
                                        <td>{subj.name}</td>
                                        <td>{subj.cat1}</td>
                                        <td>{subj.cat2}</td>
                                        <td>{subj.cat3}</td>
                                        <td>{subj.assignment1}</td>
                                        <td>{subj.assignment2}</td>
                                        <td>{subj.assignment3}</td>
                                        <td>{subj.internal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ textAlign: "left", marginTop: "20px" }}>
                        {user.downloadOption === "pdf" && (
                            <button className="print-button" onClick={handlePDFDownload}>
                                Download PDF
                            </button>
                        )}
                        {user.downloadOption === "jpeg" && (
                            <button className="print-button" onClick={handleJPEGDownload}>
                                Download JPEG
                            </button>
                        )}
                    </div>

                </>
            )}
        </div>
    );
}

export default Printingpreview;
