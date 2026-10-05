"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import { Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { ApiError } from "@/types/api";

const loginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage("");

    try {
      const user = await login(data.identifier.trim(), data.password);

      // Route based on role
      if (user.roles.includes("ROLE_VETERINARIAN")) {
        router.push("/health");
      } else if (user.roles.includes("ROLE_WORKER")) {
        router.push("/cows");
      } else if (user.roles.includes("ROLE_DELIVERY_STAFF")) {
        router.push("/deliveries");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (apiError?.error === "ACCOUNT_DISABLED") {
        setErrorMessage("Your account is disabled. Please contact the farm system administrator.");
      } else if (apiError?.error === "ACCOUNT_LOCKED") {
        setErrorMessage("Your account has been suspended or locked. Please contact support.");
      } else if (apiError?.status === 401 || apiError?.error === "BAD_CREDENTIALS") {
        setErrorMessage("Invalid credentials. Please verify your username/email and password.");
      } else if (apiError?.status === 0 || apiError?.message?.includes("fetch")) {
        setErrorMessage("Cannot reach DairyFlow backend service. Please check your network connection.");
      } else {
        setErrorMessage(apiError?.message || "Invalid credentials. Please check your username and password.");
      }
    }
  };

  const setQuickCredentials = (identifier: string) => {
    setValue("identifier", identifier);
    setValue("password", "password");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9F6] p-4">
      <Card className="w-full max-w-md shadow-card border-[#E2E5DF]">
        <CardHeader className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-xl mx-auto mb-2 shadow-sm">
            DF
          </div>
          <CardTitle className="text-2xl font-bold text-[#1F2421] font-headline">DairyFlow Sign In</CardTitle>
          <CardDescription className="text-xs text-gray-500">
            Enter your farm credentials to access the herd management ERP
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="p-3 text-xs rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1F2421] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-500" />
                Username or Email
              </label>
              <Input
                type="text"
                placeholder="e.g. owner@dairyflow.com or manager"
                {...register("identifier")}
                className={errors.identifier ? "border-rose-400 focus:ring-rose-400" : ""}
              />
              {errors.identifier && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.identifier.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#1F2421] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-500" />
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#1E3A2F] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-rose-400 focus:ring-rose-400" : ""}
              />
              {errors.password && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Quick Demo Credentials */}
            <div className="pt-2 border-t border-[#E2E5DF]/70">
              <span className="text-[11px] font-semibold text-gray-500 block mb-1.5">
                Quick Select Demo Account:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuickCredentials("owner@dairyflow.com")}
                  className="text-left px-2 py-1 bg-[#F4F6F2] hover:bg-[#EAECE7] border border-[#E2E5DF] rounded text-[11px] text-gray-700 font-medium transition-colors"
                >
                  👑 Owner <span className="text-gray-400 font-normal block truncate">owner@dairyflow.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCredentials("manager@dairyflow.com")}
                  className="text-left px-2 py-1 bg-[#F4F6F2] hover:bg-[#EAECE7] border border-[#E2E5DF] rounded text-[11px] text-gray-700 font-medium transition-colors"
                >
                  📋 Manager <span className="text-gray-400 font-normal block truncate">manager@dairyflow.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCredentials("vet@dairyflow.com")}
                  className="text-left px-2 py-1 bg-[#F4F6F2] hover:bg-[#EAECE7] border border-[#E2E5DF] rounded text-[11px] text-gray-700 font-medium transition-colors"
                >
                  🩺 Veterinarian <span className="text-gray-400 font-normal block truncate">vet@dairyflow.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCredentials("worker@dairyflow.com")}
                  className="text-left px-2 py-1 bg-[#F4F6F2] hover:bg-[#EAECE7] border border-[#E2E5DF] rounded text-[11px] text-gray-700 font-medium transition-colors"
                >
                  🚜 Worker <span className="text-gray-400 font-normal block truncate">worker@dairyflow.com</span>
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-[#1E3A2F] hover:bg-[#162B23]" disabled={isSubmitting}>
              {isSubmitting ? "Authenticating..." : "Sign In"}
            </Button>
            <div className="text-center text-xs text-gray-500">
              Need assistance? Contact your Farm System Administrator.
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
