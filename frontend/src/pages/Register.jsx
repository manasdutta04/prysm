import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore.js";

function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup(form);
    if (res?.success) navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "black", // match background
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e1e1e",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Register</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "5px",
              border: "1px solid #555",
              background: "#2c2c2c",
              color: "white",
            }}
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "5px",
              border: "1px solid #555",
              background: "#2c2c2c",
              color: "white",
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "5px",
              border: "1px solid #555",
              background: "#2c2c2c",
              color: "white",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.75rem",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Register
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              color: "#4da6ff",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
