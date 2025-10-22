"use client";
import { StepType, useTour } from "@reactour/tour";
import { useEffect } from "react";

interface GuidedTourBaseProps {
  steps: StepType[];
  tourKey: string;
}

export default function GuidedTourBase({ steps, tourKey }: GuidedTourBaseProps) {
  const { setIsOpen, setSteps } = useTour();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`tour-${tourKey}`);
    if (!hasSeenTour && setSteps && setIsOpen) {
      setSteps(steps);
      setIsOpen(true);
      localStorage.setItem(`tour-${tourKey}`, "true");
    }
  }, [steps, setIsOpen, setSteps, tourKey]);

  return null;
}
