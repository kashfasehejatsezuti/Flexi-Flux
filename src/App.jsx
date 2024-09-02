//
import "./App.css";
import { useState } from "react";
import Logo from "../public/vite.png";

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledDownload, setIsDisabledDownload] = useState(false);

  const convertCsvToJson = (csvData) => {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");
    const result = [];

    // go each line of csv data  without header
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split(",");
      // Loop  go each column of csv data and map it corresponding heading.
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = currentLine[j] ? currentLine[j].trim() : "";
      }
      result.push(obj);
    }
    return result;
  };

  const handelCSVInputChange = (event) => {
    const file = event.target.files[0];
    const render = new FileReader();
    render.onload = (e) => {
      const csvData = e.target.result;
      // Call the function to convert Csv to Json

      const jsonData = convertCsvToJson(csvData);
      setJsonData(jsonData);
      console.log(jsonData);
    };
    render.readAsText(file);
  };

  const handleCopy = (e) => {
    e.target.innerText = "Done";
    setIsDisabled(true);
    const jsonString = JSON.stringify(jsonData, null, 2);
    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        console.table(jsonString);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const downloadJsonFile = (e) => {
    e.target.innerText = "Done";
    setIsDisabledDownload(true);
    const jsonString = JSON.stringify(jsonData, null, 2);
    const jsonFile = new Blob([jsonString], { type: "application/json" });
    const fileUrl = URL.createObjectURL(jsonFile);
    const link = document.createElement("a");
    link.href = fileUrl;
    console.log(fileUrl);
    link.download = "Converted_File.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTable = (data) => {
    if (!data || data.length === 0) return null;
    const headers = Object.keys(data[0]);

    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{ border: "1.5px solid ", padding: "8px" }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td
                  key={header}
                  style={{ border: "1px solid ", padding: "8px" }}
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div style={{ textAlign: "center", margin: "2rem", width: "100%" }}>
        <img
          src={Logo}
          alt="Description"
          style={{ width: "25%", maxWidth: "500px", margin: "auto" }}
        />
        <label
          htmlFor="file-upload"
          style={{
            fontSize: "1.5rem",
            color: "#2f5f98",
            backgroundColor: "white",
            borderRadius: "8px",
            cursor: "pointer",
            display: "block",
          }}
        >
          <h1>CSV TO JSON</h1>
          To get started, upload or paste your data from Excel (saved as CSV ).
        </label>
        <input
          style={{
            fontSize: "1rem",
            color: "#2f5f98",
            padding: "1rem 1rem",
            backgroundColor: "white",
            border: "4px solid #2f5f98",
            borderRadius: "12px",
            cursor: "pointer",
            display: "inline-block",
            margin: "2rem",
          }}
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handelCSVInputChange}
        />
        {jsonData ? (
          <>
            {/* Container for the parallel display */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "flex-start",
                margin: "1rem",
              }}
            >
              <div
                style={{
                  flex: "1",
                  marginRight: "2rem",
                  overflowY: "auto",
                  height: "31.4rem",
                  backgroundColor: "#2f5f98",
                  color: "white",
                  borderRadius: "3px",
                  fontSize: "1rem",
                }}
              >
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(jsonData, null, 3)}
                </pre>
              </div>

              <div
                style={{
                  flex: "1",
                  backgroundColor: "white",
                  color: "#2f5f98",
                  overflowY: "auto",
                  height: "31.4rem",
                  borderRadius: "3px",
                  fontSize: "1rem",
                }}
              >
                {renderTable(jsonData)}
              </div>
            </div>

            <button
              style={{
                fontSize: "1rem",
                textAlign: "center",
                color: "#2f5f98",
                margin: "5rem",
                justifyItems: "start",
                backgroundColor: "white",
                border: "2px solid #2f5f98",
              }}
              onClick={downloadJsonFile}
              disabled={isDisabledDownload}
            >
              Download The File
            </button>
            <button
              style={{
                fontSize: "1rem",
                textAlign: "center",
                color: "#2f5f98",
                margin: "5rem",
                justifyItems: "end",
                backgroundColor: "white",
                border: "2px solid #2f5f98",
              }}
              onClick={handleCopy}
              disabled={isDisabled}
            >
              Copy The Texts
            </button>
          </>
        ) : (
          <div style={{ fontSize: "1.2rem", color: "#2f5f98" }}>
            Upload a CSV file
          </div>
        )}
      </div>
    </>
  );
}

export default App;
