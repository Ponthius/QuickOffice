"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/documents/login/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.ok) {
      router.push("/");
    } else {
      setError(data.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80 text-gray-900"
      >
        <h1 className="text-xl font-bold mb-4">QuickOffice Login</h1>
        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
        <input
          className="w-full border rounded p-2 mb-3 text-gray-900 placeholder-gray-400"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full border rounded p-2 mb-4 text-gray-900 placeholder-gray-400"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white rounded p-2 font-semibold">
          Log In
        </button>
        <p className="text-sm text-center mt-3">
          No account?{" "}
          <Link href="/signup" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
