import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";

const Login = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage("Invalid email or password.");
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
      } catch (error) {
        setErrorMessage("Google sign-in failed.");
        setIsSigningIn(false);
      }
    }
  };

  if (userLoggedIn) return <Navigate to="/home" replace />;

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit" disabled={isSigningIn}>{isSigningIn ? "Signing In..." : "Sign In"}</button>
      </form>
      <button onClick={onGoogleSignIn} disabled={isSigningIn}>Sign in with Google</button>
      <Link to="/register">Don't have an account? Sign up</Link>
    </div>
  );
};

export default Login;
