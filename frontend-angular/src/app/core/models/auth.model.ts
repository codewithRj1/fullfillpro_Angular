/**
 * Authentication Models
 * Interfaces for login and signup API endpoints
 */

export interface LoginRequest {
  identifier: string;  // email or username
  password: string;
  ipAddress: string;
  device: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  userCode: number;
  companyId: number;
}

export interface DecodedToken {
  sub?: string;
  email?: string;
  role?: string | string[];
  roles?: string | string[];
  companyId?: string;
  userCode?: string;
  jti?: string;
  exp?: number;
  [key: string]: unknown;
}

export interface CurrentUser {
  id: string;
  email: string;
  role: string;
  companyId: string;
  userCode: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  companyName: string;
  companyAddress: string;
  warehouseId: string;
  role: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  companyId: number;
  userCode: number;
}
