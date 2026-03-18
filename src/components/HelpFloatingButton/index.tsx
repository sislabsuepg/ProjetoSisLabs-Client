"use client";

import { useEffect } from "react";
import HelpIcon from "@mui/icons-material/Help";
import { usePathname } from "next/navigation";
import { StepType, useTour } from "@reactour/tour";
import { useGuidedTour } from "@/components/GuidedTour/TourContext";
import { toursByPage } from "@/components/GuidedTour/stepsPages";

const MAX_TOUR_OPEN_RETRIES = 10;
const TOUR_OPEN_RETRY_DELAY_MS = 150;

function resolveStepsForPage(
  pathname: string,
  activeSection?: string,
): StepType[] | null {
  const tourPage = toursByPage[pathname];
  if (!tourPage) return null;

  if (Array.isArray(tourPage)) {
    return tourPage;
  }

  if (activeSection && Array.isArray(tourPage[activeSection])) {
    return tourPage[activeSection];
  }

  const firstSection = Object.keys(tourPage)[0];
  if (firstSection && Array.isArray(tourPage[firstSection])) {
    return tourPage[firstSection];
  }

  return null;
}

function hasAnyStepTargetInDom(steps: StepType[]): boolean {
  return steps.some((step) => {
    const selector = typeof step.selector === "string" ? step.selector : "";
    if (!selector) return false;
    return !!document.querySelector(selector);
  });
}

export default function HelpFloatingButton() {
  const pathname = usePathname();
  const { activeSection } = useGuidedTour();
  const { setIsOpen, setSteps, setCurrentStep } = useTour();

  const handleOpenTour = () => {
    const steps = resolveStepsForPage(pathname, activeSection);
    if (!steps || steps.length === 0) {
      alert("Nenhum tour disponível para esta página!");
      return;
    }

    const openTour = (retries = 0) => {
      if (hasAnyStepTargetInDom(steps) || retries >= MAX_TOUR_OPEN_RETRIES) {
        setSteps!(steps);
        setCurrentStep!(0);
        setIsOpen!(true);
        return;
      }

      setTimeout(() => {
        openTour(retries + 1);
      }, TOUR_OPEN_RETRY_DELAY_MS);
    };

    openTour();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F1") {
        event.preventDefault();
        handleOpenTour();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname, activeSection]); 

  return (
    <div className="fixed bottom-5 right-5 group w-fit z-50">
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-theme-blue text-theme-white font-normal text-sm px-2 py-1 rounded shadow-md whitespace-nowrap">
        Ajuda!
      </span>

      <HelpIcon
        sx={{ fontSize: 40 }}
        className="cursor-pointer text-theme-blue"
        onClick={handleOpenTour}
      />
    </div>
  );
}
