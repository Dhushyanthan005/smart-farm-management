"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth-api";
import { useAuth } from "@/providers/auth-provider";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await authApi.login({ username, password });
      if (res.data) {
        setUser({
          id: res.data.userId,
          username: res.data.username,
          email: res.data.email,
          roles: res.data.roles,
          status: "ACTIVE",
        });
        router.push("/dashboard");
      }
    } catch {
      setErrorMsg("Invalid credentials. Please verify your username and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9F6] p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-xl mx-auto mb-2">
            DF
          </div>
          <CardTitle className="text-2xl font-bold text-[#1F2421]">DairyFlow Sign In</CardTitle>
          <CardDescription>
            Enter your farm credentials to access the management portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                {errorMsg}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1F2421] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-500" />
                Username or Email
              </label>
              <Input
                type="text"
                placeholder="e.g. manager@dairyflow.local"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#1F2421] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-500" />
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#1E3A2F] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-xs text-gray-500">
              Need access? Contact your Farm System Administrator.
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
