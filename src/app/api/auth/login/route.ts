import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";
import { findUserByCredentials } from "@/lib/mock-db";
import { LoginRequestBody, LoginResponseData } from "@/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: Partial<LoginRequestBody>;
  try {
    body = await request.json();
  } catch {
    return apiError("Request body must be valid JSON", 400);
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return apiError("Email and password are required", 400);
  }
  if (!EMAIL_REGEX.test(email)) {
    return apiError("Enter a valid email address", 400);
  }

  const user = findUserByCredentials(email, password);
  if (!user) {
    return apiError("Invalid email or password", 401);
  }

  const tokenData = {
    name: user.name,
    email: user.email,
  };

  const token = `mock-token-${Buffer.from(JSON.stringify(tokenData)).toString(
    "base64",
  )}`;

  const data: LoginResponseData = { user, token };
  return apiSuccess(data);
}
