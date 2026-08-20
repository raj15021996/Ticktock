import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

export function apiSuccess<T>(data: T, init?: number | ResponseInit) {
  const body: ApiResponse<T> = { success: true, data };
  return NextResponse.json(body, init as ResponseInit | undefined);
}

export function apiError(message: string, status = 400) {
  const body: ApiResponse<never> = { success: false, error: message };
  return NextResponse.json(body, { status });
}