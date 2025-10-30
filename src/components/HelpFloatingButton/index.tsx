"use client";

import HelpIcon from "@mui/icons-material/Help";
import { usePathname } from "next/navigation";
import { useTour } from "@reactour/tour";
import { useGuidedTour } from "@/components/GuidedTour/TourContext";
import { toursByPage } from "@/components/GuidedTour/stepsPages";

export default function HelpFloatingButton() {
  const pathname = usePathname();
  const { activeSection } = useGuidedTour();
  const { setIsOpen, setSteps, setCurrentStep } = useTour();

  const handleOpenTour = () => {
    const tourPage = toursByPage[pathname];
    if (!tourPage) {
      alert("Nenhum tour disponível para esta página!");
      return;
    }

    const steps = Array.isArray(tourPage)
      ? tourPage
      : tourPage[activeSection!];

    setTimeout(() => {
      setSteps!(steps);
      setCurrentStep!(0);
      setIsOpen!(true);
    }, 300);
  };

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
