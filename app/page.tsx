"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { validateForm, validationRules } from "@/lib/validations";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
export default function LoginPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && user.role === "Admin") {
      window.location.href = "/dashboard/admin";
    } else if (user && user.role === "Seller") {
      window.location.href = "/dashboard/seller";
    }
  }, [user]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, {
      email: validationRules.email,
      password: [{ required: true, message: "Password is required" }],
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const login = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!login.ok) {
        setErrors({ general: "Login failed. Please try again." });
      }
      const data = await login.json();
      const user = data.user as UserAuthPayload;
      if (user.role === "Admin") {
        window.location.href = "/dashboard/admin";
      } else if (user.role === "User") {
        window.location.href = "/dashboard/user";
      } else if (user.role === "Seller") {
        window.location.href = "/dashboard/seller";
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
             Dakul Cosmotics
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {errors.general}
              </div>
            )}

            <FormField
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              icon={<Mail className="h-4 w-4" />}
              disabled={isLoading}
            />

            <div className="relative">
              <FormField
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                error={errors.password}
                icon={<Lock className="h-4 w-4" />}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* <div className="flex items-center justify-between">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div> */}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            {/* <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Sign up
              </Link>
            </div> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
