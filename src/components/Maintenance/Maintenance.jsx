import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Maintenance.css";
import CONFIG from '../../config';

const Maintenance = () => {
  const [tireCondition, setTireCondition] = useState(0);
  const [acCondition, setAcCondition] = useState(0);
  const [batteryCondition, setBatteryCondition] = useState(0);
  const [engineCondition, setEngineCondition] = useState(0);
  const [predictionResult, setPredictionResult] = useState(null);
  const [userName, setUserName] = useState("");
  const [vehicleImage, setVehicleImage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const make = queryParams.get("make") || localStorage.getItem("vehicleMake");
  const model = queryParams.get("model") || localStorage.getItem("vehicleModel");

  // ✅ Decode and set username from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserName(decoded.name || decoded.username || decoded.email || "User");
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      navigate("/signin");
    }
  }, [navigate]);

  // ✅ Fetch vehicle image
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://www.carimagery.com/api.asmx/GetImageUrl?searchTerm=${make}+${model}`);
        const xml = await response.text();
        const match = xml.match(/<string[^>]*>(.*?)<\/string>/);
        const url = match ? match[1] : null;
        setVehicleImage(url);
      } catch (err) {
        console.error("Error fetching image:", err);
        setVehicleImage(null);
      }
    };

    if (make && model) {
      fetchImage();
    }
  }, [make, model]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const handlePredict = async () => {
    try {
      const response = await axios.post(`${CONFIG.ML_API_URL}/predict`, {
        tire_condition: tireCondition,
        ac_condition: acCondition,
        hybrid_battery_condition: batteryCondition,
        engine_condition: engineCondition,
      });

      setPredictionResult(response.data);
    } catch (error) {
      console.error("Prediction error:", error);
      setPredictionResult({ error: "Prediction failed." });
    }
  };

  return (
    <div className="maintenance-container">
      <header className="maintenance-header">
        <h2>Vehicle Health Report</h2>
        <div className="user-info">
          <p className="welcome-text">Welcome, {userName}</p>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        <p>Vehicle: {make} {model}</p>
      </header>

      <div className="maintenance-content">
        <div className="input-section">
          <h3>Enter Vehicle Condition (%)</h3>
          <label>Tire</label>
          <input type="number" value={tireCondition} onChange={(e) => setTireCondition(Number(e.target.value))} />

          <label>A/C</label>
          <input type="number" value={acCondition} onChange={(e) => setAcCondition(Number(e.target.value))} />

          <label>Battery</label>
          <input type="number" value={batteryCondition} onChange={(e) => setBatteryCondition(Number(e.target.value))} />

          <label>Engine</label>
          <input type="number" value={engineCondition} onChange={(e) => setEngineCondition(Number(e.target.value))} />

          <button onClick={handlePredict}>Predict Maintenance</button>
        </div>

        <div className="image-section">
          {vehicleImage ? (
            <img src={vehicleImage} alt="Vehicle" />
          ) : (
            <p>Loading vehicle image...</p>
          )}
        </div>

        <div className="result-section">
          <h3>Upcoming Possible maintenance...</h3>
          {predictionResult ? (
            predictionResult.error ? (
              <p className="error">{predictionResult.error}</p>
            ) : (
              <>
                <p>🔧 Tire: {predictionResult.tire}</p>
                <p>❄️ A/C: {predictionResult.ac}</p>
                <p>🔋 Battery: {predictionResult.battery}</p>
                <p>⚙️ Engine: {predictionResult.engine}</p>
                <p>📊 Overall: {predictionResult.overall}%</p>
              </>
            )
          ) : (
            <p>Awaiting input...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
