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
        obj[headers[j].trim()] = currentLine[j].trim();
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
      // console.log(jsonData);
    };
    render.readAsText(file);
  };
  return (
    <>
      <div>
        <input type="file" accept=".csv" onChange={handelCSVInputChange} />
        {jsonData ? (
          <div style={{ fontSize: "1.5rem" }}>
            {<pre>{JSON.stringify(jsonData, null, 4)}</pre>}
          </div>
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
