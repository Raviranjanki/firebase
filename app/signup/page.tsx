// pages/signup.tsx
'use client'
import { useState } from "react";
import { useRouter } from "next/router";
import { Auth } from "../lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (event: any) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const user = await Auth.signUp(email, password);
      console.log("Signed up user:", user);
      router.push("/");
    } catch (error) {
      console.error(error);
      setError("Failed to sign up. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      {error && <p>{error}</p>}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <label>
        Confirm Password
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}
