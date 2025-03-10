// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";

const Register = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await doCreateUserWithEmailAndPassword(email, password);
    } catch (error) {
      setErrorMessage("Error registering.");
      setIsRegistering(false);
    }
  };

  if (userLoggedIn) return <Navigate to="/home" replace />;

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit" disabled={isRegistering}>{isRegistering ? "Signing Up..." : "Sign Up"}</button>
      </form>
      <Link to="/login">Already have an account? Log in</Link>
    </div>
  );
};

export default Register;
