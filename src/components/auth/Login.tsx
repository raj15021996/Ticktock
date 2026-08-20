"use client";
import { LoginFormData, LoginFormErrors } from "@/types";
import { ROUTES_PATH, storageKeys } from "@/utils/constant";
import { validateLoginForm } from "@/utils/validators";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Cookies from "js-cookie";
import { forError, forSuccess} from "@/utils/commonServices";
import { login } from "@/services/auth";

function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user starts correcting it
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await login(formData);
      
      Cookies.set(storageKeys.userData, JSON.stringify(data.user), {
        expires: formData.rememberMe ? 7 : undefined,
      });

      Cookies.set(storageKeys.accessToken, data.token, {
        expires: formData.rememberMe ? 7 : undefined,
      });

      router.replace(ROUTES_PATH.DASHBOARD);

      router.replace("/dashboard");

      forSuccess("Login successful!");
    } catch {
      setErrors({
        email: "Something went wrong. Please try again.",
      });
      forError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left section */}
      <div className="flex items-center justify-center bg-white px-6 py-16 md:py-0">
        <form onSubmit={handleSubmit} noValidate className="w-full max-w-xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Welcome back
          </h1>

          <div className="flex flex-col gap-4">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>

      {/* Right section */}
      <div className="flex items-center justify-center bg-[#1C64F2] px-10 py-16 md:py-0">
        <div className="max-w-xl">
          <h2 className="mb-4 text-4xl font-bold text-white">ticktock</h2>

          <p className="leading-[150%] tracking-normal text-gray-200 font-normal">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any
            internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
