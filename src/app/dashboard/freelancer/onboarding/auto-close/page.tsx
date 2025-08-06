"use client";

import { useEffect } from "react";

export default function AutoClosePage() {
  useEffect(() => {
    window.close(); 
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl text-gray-600">You can now close this tab.</p>
    </div>
  );
}