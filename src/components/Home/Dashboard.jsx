import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./Dashboard.css";
import CONFIG from '../../config';

const Dashboard = () => {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const navigate = useNavigate();

  // Fetch vehicle makes from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles/make")
      .then((response) => response.json())
      .then((data) => setMakes(data))
      .catch((error) => console.error("Error fetching makes:", error));
  }, []);

  // Fetch models based on selected make
  useEffect(() => {
    if (selectedMake) {
      fetch(`http://localhost:5000/api/vehicles/models?make=${selectedMake}`)
        .then((response) => response.json())
        .then((data) => setModels(data))
        .catch((error) => console.error("Error fetching models:", error));
    } else {
      setModels([]); // Reset models when no make is selected
    }
  }, [selectedMake]);

  // Redirect to diagnostics page with selected vehicle
  const handleEnter = () => {
    if (selectedMake && selectedModel) {
      localStorage.setItem("vehicleMake", selectedMake);
      localStorage.setItem("vehicleModel", selectedModel);
      navigate("/diagnostics");
    }
  };

  return (
    <div className="dashboard">
      <div className="content">
        <h1>Vehicle Issues Analyzer</h1>
        <p>Analyze and monitor your vehicle's health effectively.</p>
        <div className="dropdowns">
        <select className="dropdown" value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
          <option value="" disabled>Select Vehicle Make</option>
          {makes.map((make, index) => (
            <option key={index} value={make}>{make}</option>
          ))}
        </select>

        <select className="dropdown" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
          <option value="" disabled>Select Vehicle Model</option>
          {models.map((model, index) => (
            <option key={index} value={model}>{model}</option>
          ))}
        </select>
          <button className="enter-btn" onClick={handleEnter}>Enter</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
