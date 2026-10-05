"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth-api";
import { CheckCircle2, AlertCircle } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMessage("");
    try {
      await authApi.forgotPassword({ email: data.email });
      setIsSuccess(true);
    } catch {
      setErrorMessage("Unable to send reset instructions. Please check your network or try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9F6] p-4">
      <Card className="w-full max-w-md shadow-card border-[#E2E5DF]">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-xl mx-auto mb-2 shadow-sm">
            DF
          </div>
          <CardTitle className="text-2xl font-bold text-[#1F2421] font-headline">Reset Password</CardTitle>
          <CardDescription className="text-xs text-gray-500">
            Enter your registered farm email address to receive password reset instructions
          </CardDescription>
        </CardHeader>
        {isSuccess ? (
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-1">Check Your Email</strong>
                If an active account exists with this email address, password reset instructions have been dispatched.
              </div>
            </div>
            <Link href="/login" className="block text-center text-xs text-[#1E3A2F] font-semibold hover:underline pt-2">
              ← Return to Sign In
            </Link>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="p-3 text-xs rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1F2421]">Email Address</label>
                <Input
                  type="email"
                  placeholder="e.g. manager@dairyflow.com"
                  {...register("email")}
                  className={errors.email ? "border-rose-400 focus:ring-rose-400" : ""}
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-600 font-medium">{errors.email.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full bg-[#1E3A2F] hover:bg-[#162B23]" disabled={isSubmitting}>
                {isSubmitting ? "Dispatching..." : "Send Reset Instructions"}
              </Button>
              <Link href="/login" className="text-xs text-[#1E3A2F] hover:underline font-medium text-center">
                Back to Sign In
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
