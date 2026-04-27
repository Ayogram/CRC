"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Verifying System Link...");
    setError("");

    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/admin/media",
      });
    } catch (err) {
      setMsg("");
      setError("Portal Connection Timeout");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8 shadow-2xl border-0 border-t-8 border-primary rounded-2xl bg-white">
        <div className="flex justify-center mb-6">
           <div className="bg-primary/10 p-4 rounded-full">
             <Lock className="text-primary h-8 w-8" />
           </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold font-heading text-slate-900 mb-2">Secure Portal</h2>
        <p className="text-center text-sm text-slate-500 mb-8">Administrators Only</p>
        
        <form onSubmit={handleLogin} method="POST" className="space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm text-center rounded border border-red-200">{error}</div>}
          {msg && <div className="p-3 bg-blue-50 text-blue-600 text-sm text-center rounded border border-blue-200">{msg}</div>}
          <div className="space-y-4">
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button 
                type="button" 
                onClick={() => setMsg("Please contact the Super Administrator (09069168041) to reset your secured credentials.")}
                className="font-medium text-primary hover:text-primary-dark"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg drop-shadow-md">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
