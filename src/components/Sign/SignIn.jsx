import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import CONFIG from '../../config';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Frontend validation
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post(`${CONFIG.API_BASE_URL}/api/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/maintenance");
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.error || error.message));
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign In</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
        </form>

        <p>Don't have an account?</p>
        <button onClick={handleRegisterRedirect}>Register</button>
      </div>
    </div>
  );
};

export default SignIn;
