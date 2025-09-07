"use client";

import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <CircularProgress />
    </div>
  );
}
