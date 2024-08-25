import "./App.css";
import { useState } from "react";

function App() {
  const [jsonData, setJsonData] = useState(null);

  const convertCsvToJson = (csvData) => {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");
    const result = [];

    // go each line of csv data  without header
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split(",");
      //Loop  go each column of csv data and map it corresponding heading.
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

  const handleCopy = () => {
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

  const downloadJsonFile = () => {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const jsonFile = new Blob([jsonString], { type: "application/json" });
    const fileUrl = URL.createObjectURL(jsonFile);
    const link = document.createElement("a");
    link.href = fileUrl;
    console.log(fileUrl);
    link.download = "data.json";
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
                style={{ border: "3px solid green", padding: "8px" }}
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
                  style={{ border: "2px solid green", padding: "8px" }}
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
      <div>
        <input type="file" accept=".csv" onChange={handelCSVInputChange} />
        {jsonData ? (
          <>
            <div>
              <button
                style={{
                  fontSize: "1.5rem",
                  textAlign: "center",
                  color: "#4ea28e",
                  margin: "5rem",
                  justifyItems: "center",
                  backgroundColor: "white",
                }}
                onClick={handleCopy}
              >
                Copy
              </button>
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                textAlign: "center",
                display: "flex",
                width: "auto",
                height: "35rem",
                justifyContent: "center",
                overflowX: "hidden",
                overflowY: "auto",
                backgroundColor: "#4ea28e",
                color: "white",
              }}
            >
              {<pre>{JSON.stringify(jsonData, null, 2)}</pre>}
            </div>
            <div
              style={{
                color: "#4ea28e",
                backgroundColor: "white",
                marginRight: "4rem",
                marginTop: "4rem",
              }}
            >
              {renderTable(jsonData)}
            </div>

            <button
              style={{
                fontSize: "1.5rem",
                textAlign: "center",
                color: "#4ea28e",
                margin: "5rem",
                justifyItems: "center",
                backgroundColor: "white",
              }}
              onClick={downloadJsonFile}
            >
              Download
            </button>
          </>
        ) : (
          <div style={{ fontSize: "1.5rem" }}>
            <br></br> Please choose a csv file.
          </div>
        )}
      </div>
    </>
  );
}

export default App;
