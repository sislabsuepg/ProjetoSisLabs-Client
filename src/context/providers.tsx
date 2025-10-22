"use client";
import { ToastProvider } from "./ToastContext";
import { CookiesProvider } from "react-cookie";
import React from "react";
import GuidedTourProvider from "@/components/GuidedTour/GuidedTourProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <GuidedTourProvider>
          {children}
        </GuidedTourProvider>
      </CookiesProvider>
    </ToastProvider>
  );
}
