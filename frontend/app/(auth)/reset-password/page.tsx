"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth-api";
import { CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { ApiError } from "@/types/api";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenParam,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setErrorMessage("");
    try {
      await authApi.resetPassword({
        token: data.token.trim(),
        newPassword: data.newPassword,
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setErrorMessage(apiError?.message || "Invalid or expired reset token. Please request a new link.");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-card border-[#E2E5DF]">
      <CardHeader className="text-center">
        <div className="w-12 h-12 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center font-bold text-xl mx-auto mb-2 shadow-sm">
          DF
        </div>
        <CardTitle className="text-2xl font-bold text-[#1F2421] font-headline">New Password</CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Create a secure new password for your DairyFlow account
        </CardDescription>
      </CardHeader>

      {isSuccess ? (
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-1">Password Updated Successfully</strong>
              Your password has been reset. Redirecting you to sign in...
            </div>
          </div>
          <Link href="/login" className="block text-center text-xs text-[#1E3A2F] font-semibold hover:underline pt-2">
            Click here if not redirected automatically
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
              <label className="text-xs font-semibold text-[#1F2421]">Reset Token</label>
              <Input
                type="text"
                placeholder="Paste token received in email"
                {...register("token")}
                className={errors.token ? "border-rose-400 focus:ring-rose-400" : ""}
              />
              {errors.token && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.token.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1F2421] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                New Password
              </label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                {...register("newPassword")}
                className={errors.newPassword ? "border-rose-400 focus:ring-rose-400" : ""}
              />
              {errors.newPassword && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1F2421] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                Confirm New Password
              </label>
              <Input
                type="password"
                placeholder="Repeat new password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-rose-400 focus:ring-rose-400" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-[#1E3A2F] hover:bg-[#162B23]" disabled={isSubmitting}>
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </Button>
            <Link href="/login" className="text-xs text-[#1E3A2F] hover:underline font-medium text-center">
              Back to Sign In
            </Link>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9F6] p-4">
      <Suspense fallback={<div className="text-xs text-gray-500">Loading form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
