"use client";
import { ToastProvider } from "./ToastContext";
import { CookiesProvider } from "react-cookie";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        {children}
      </CookiesProvider>
    </ToastProvider>
  );
}
