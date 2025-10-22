"use client";
import { TourProvider } from "@reactour/tour";
import { ReactNode } from "react";

export default function GuidedTourProvider({ children }: { children: ReactNode }) {
  return (
    <TourProvider
      steps={[]}
      padding={8}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: 12,
          backgroundColor: "#ffffff",
          color: "#1e293b",
          fontWeight: 400,
          left: 20,
          boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
        }),
        maskArea: (base) => ({ ...base, rx: 8 }),
        badge: (base) => ({ ...base, backgroundColor: "#2563eb" }),
      }}
    >
      {children}
    </TourProvider>
  );
}
