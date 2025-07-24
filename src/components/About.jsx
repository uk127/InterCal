import React from "react";
import Backbtn from "./Backbtn";
const About = () => {
  return (
    <>
      <style>
        {`
          .container {
            padding: 20px;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: white;
            background-color: #1e1e1e; /* Optional dark background for contrast */
          }
          .heading1 {
            text-align: center;
            color: white;
          }
          .heading2 {
            color: yellow;
          }
          .highlight {
            color: orange;
            font-weight: bold;
          }
          .requirement-heading {
            color: red;
            font-weight: bold;
            text-decoration: underline;
          }
          section {
            margin-bottom: 30px;
          }
        `}
      </style>
      <Backbtn/>
      <div className="container">
        <h1 className="heading1">INTERNAL MARK - THEORY</h1>

        <section>
          <h2 className="heading2">Formative Assessment Test (FAT)</h2>
          <p>
            The internal marks are based on three <strong>FATs (Formative Assessment Tests)</strong>.
          </p>
          <p>Each FAT consists of:</p>
          <ul>
            <li>One <strong>Test</strong> (out of 50 marks)</li>
            <li>One <strong>Assignment</strong> (out of 50 marks)</li>
          </ul>

          <h3 className="heading2">Weightage for Each FAT:</h3>
          <ul>
            <li><strong>Test:</strong> Test Marks × 0.7</li>
            <li><strong>Assignment:</strong> Assignment Marks × 0.3</li>
          </ul>
          <p>These are combined to make 50 marks, then converted as:</p>
          <ul>
            <li>X₁ = 50 / 3 ≈ 16.67 (FAT 1)</li>
            <li>X₂ = 50 / 3 ≈ 16.67 (FAT 2)</li>
            <li>X₃ = 50 / 3 ≈ 16.67 (FAT 3)</li>
          </ul>
        </section>

        <section>
          <h2 className="heading2">Internal Mark Calculation</h2>
          <p>
            Internal Total (X) is calculated as:<br />
            <strong>X = (X₁ + X₂ + X₃) × 0.8</strong><br />
            = (16.67 + 16.67 + 16.67) × 0.8<br />
            = 50.01 × 0.8<br />
            = <span className="highlight">40 marks (maximum)</span>
          </p>
        </section>

        <section>
          <h2 className="heading2">End Semester Exam Mark (Y)</h2>
          <p>
            End Semester Exam is out of 100 marks.<br />
            It is scaled to 60 using:<br />
            <strong>Y = 0.6 × Y₁</strong>
          </p>
        </section>

        <section>
          <h2 className="heading2">Final Mark (Z)</h2>
          <p>
            <strong>Z = Internal Mark (X) + End Semester Exam Mark (Y)</strong><br />
            Z = (out of 40) + (out of 60)
          </p>
        </section>
      </div>
    </>
  );
};

export default About;
