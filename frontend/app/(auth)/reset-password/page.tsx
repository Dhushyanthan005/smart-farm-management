import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9F6] p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#1F2421]">New Password</CardTitle>
          <CardDescription>Create a secure new password for your DairyFlow account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F2421]">New Password</label>
            <Input type="password" placeholder="••••••••" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1F2421]">Confirm Password</label>
            <Input type="password" placeholder="••••••••" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full">Update Password</Button>
          <Link href="/login" className="text-xs text-[#1E3A2F] hover:underline">
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
