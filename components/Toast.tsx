"use client";

import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/lib/store";

export default function Toast() {
  const toast = useToast();
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 animate-fade-up">
      <div className="flex items-center gap-2 rounded-full bg-primary-950 px-5 py-3 text-sm font-bold text-white shadow-2xl">
        <CheckCircle2 size={17} className="text-gold-400" />
        {toast}
      </div>
    </div>
  );
}
