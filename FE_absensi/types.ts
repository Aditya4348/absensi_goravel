
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // ISO String
  checkOut?: string; // ISO String
  location?: string;
  note?: string;
}

export interface AIInsight {
  summary: string;
  productivityScore: number;
  recommendations: string[];
}

export enum AuthView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  INSIGHTS = 'INSIGHTS'
}
