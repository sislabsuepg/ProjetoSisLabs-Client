"use client";
import { ToastProvider } from "./ToastContext";
import { CookiesProvider } from "react-cookie";
import React from "react";
import GuidedTourProvider from "@/components/GuidedTour/GuidedTourProvider";
import { GuidedTourSectionProvider } from "@/components/GuidedTour/TourContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <GuidedTourSectionProvider>
          <GuidedTourProvider>
            {children}
          </GuidedTourProvider>
        </GuidedTourSectionProvider>
      </CookiesProvider>
    </ToastProvider>
  );
}
