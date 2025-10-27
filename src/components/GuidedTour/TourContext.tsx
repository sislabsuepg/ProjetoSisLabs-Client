"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface GuidedTourContextType {
  activeSection?: string;
  setActiveSection: (section: string) => void;
}

const GuidedTourContext = createContext<GuidedTourContextType>({
  activeSection: undefined,
  setActiveSection: () => {},
});

export const useGuidedTour = () => useContext(GuidedTourContext);

export const GuidedTourSectionProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState<string>();
  return (
    <GuidedTourContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </GuidedTourContext.Provider>
  );
};