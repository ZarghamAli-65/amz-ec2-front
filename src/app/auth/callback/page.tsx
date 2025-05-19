"use client";

import CallbackHandler from "@/components/CallbackHandler";
import { Suspense } from "react";

export default function CallbackPage() {
  return (
    <Suspense fallback={<p className="text-center p-4">Preparing login...</p>}>
      <CallbackHandler />
    </Suspense>
  );
}
