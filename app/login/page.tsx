// pages/login.tsx
'use client'
import { useState } from "react";
import { useRouter } from "next/router";
import { Auth } from "../../lib/auth"

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (event: any) => {
    event.preventDefault();
    try {
      const user = await Auth.signIn(email, password);
      console.log("Logged in user:", user);
      router.push("/");
    } catch (error) {
      console.error(error);
      setError("Invalid email or password.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
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
      <button type="submit">Login</button>
    </form>
  );
}
