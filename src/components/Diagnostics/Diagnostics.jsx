import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './Diagnostics.css'; 


const Diagnostics = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const make = queryParams.get("make") || localStorage.getItem("vehicleMake");
  const model = queryParams.get("model") || localStorage.getItem("vehicleModel");
  

  const [issue, setIssue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    if (issue.length > 2) {
      axios
        .get(`${CONFIG.API_BASE_URL}/api/diagnostics/issues?make=${make}&model=${model}&query=${issue}`)
        .then((response) => setSuggestions(response.data))
        .catch((err) => {
          setError("Failed to fetch issue suggestions");
          console.error(err);
        });
    } else {
      setSuggestions([]);
    }
  }, [issue, make, model]);

  const handleIssueClick = (clickedIssue) => {
    setSelectedIssue(clickedIssue);
    axios
      .get(`${CONFIG.API_BASE_URL}/api/diagnostics/solutions?make=${make}&model=${model}&issue=${clickedIssue}`)
      .then(res => setSolutions(res.data))
      .catch(err => {
        console.error("Failed to fetch solutions:", err);
        setSolutions([]);
      });
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://www.carimagery.com/api.asmx/GetImageUrl?searchTerm=${make}+${model}`);
        const xml = await response.text();
        const match = xml.match(/<string[^>]*>(.*?)<\/string>/);
        setVehicleImage(match ? match[1] : null);
      } catch (error) {
        console.error("Image fetch error:", error);
      }
    };

    if (make && model) {
      fetchImage();
    }
  }, [make, model]);

  return (
    <div className="diagnostics-container">
      <div className="left-panel">
        <h1>Diagnostics</h1>
        <h3>Selected Vehicle: {make} {model}</h3>
  
        <input
          type="text"
          placeholder="Describe your issue..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          className="input-field"
        />
  
        {error && <p style={{ color: "red" }}>{error}</p>}
  
        {suggestions.length > 0 && (
          <div>
            <h3>Possible Issues:</h3>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleIssueClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
  
        {selectedIssue && solutions.length > 0 && (
          <div>
            <h4>Solutions for "{selectedIssue}":</h4>
            <ul>
            {solutions.map((sol, idx) => (
              <li key={idx} className="solution-item">
                {sol}
              </li>
            ))}
          </ul>
          </div>
        )}
      </div>
  
      {vehicleImage && (
        <div className="right-panel">
          <img src={vehicleImage} alt={`${make} ${model}`} className="vehicle-image" />
        </div>
      )}
    </div>
  );
  
};

export default Diagnostics;
