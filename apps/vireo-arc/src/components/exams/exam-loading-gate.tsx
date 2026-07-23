"use client";

import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { EcgViewer } from "./ecg-viewer";

type Exam = {
  id: string;
  patientId: string;
  name: string;
  type: string;
  date: string;
  result: string;
};

/** Keeps the prototype's exam-opening transition visible for six seconds. */
export function ExamLoadingGate({ exam }: { exam: Exam }) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 6000);
    return () => window.clearTimeout(timer);
  }, [exam.id]);
  if (ready) return <EcgViewer exam={exam} />;
  return <ExamLoadingScreen examName={exam.name} />;
}

/** Shared by the route loading boundary and the six-second prototype gate. */
export function ExamLoadingScreen({ examName }: { examName?: string }) {
  return (
    <div className="-m-6 flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-6">
      <div className="w-full max-w-md text-center">
        <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-[#ee5b00]" />
        <h1 className="mt-5 text-xl font-bold text-[#071046]">Loading exam</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Preparing the waveform, measurements and clinical information
          {examName ? ` for ${examName}` : ""}.
        </p>
      </div>
    </div>
  );
}
