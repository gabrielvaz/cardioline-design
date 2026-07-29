"use client";

import * as React from "react";
import {
  exams as seedExams,
  inboxExams as seedInbox,
  patients as seedPatients,
  reports as seedReports,
} from "@/lib/mock-data";

export type Patient = {
  id: string;
  name: string;
  dob: string;
  lastExam: string;
  status: string;
};

export type Exam = {
  id: string;
  patientId: string;
  name: string;
  type: string;
  date: string;
  device: string;
  result: string;
};

export type InboxExam = {
  id: string;
  patient: string;
  patientId: string;
  age: number;
  type: string;
  received: string;
  waitingMinutes: number;
  emergency: boolean;
  pediatric: boolean;
  unit: string;
  note: string;
  assignedTo?: string;
};

export type Report = {
  id: string;
  patient: string;
  patientId: string;
  examId: string;
  type: string;
  date: string;
  status: string;
  conclusion?: string;
  summary?: string;
};

export type PrototypeData = {
  patients: Patient[];
  exams: Exam[];
  inbox: InboxExam[];
  reports: Report[];
};

const STORAGE_KEY = "vireo-arc-prototype-v1";

function seedData(): PrototypeData {
  return {
    patients: seedPatients.map((patient) => ({ ...patient })),
    exams: seedExams.map((exam) => ({ ...exam })),
    inbox: seedInbox.map((exam) => ({ ...exam })),
    reports: seedReports.map((report) => ({ ...report })),
  };
}

function nextNumericId(ids: string[], prefix: string) {
  const highest = ids.reduce((value, id) => {
    const match = id.match(new RegExp(`^${prefix}(\\d+)$`));
    return match ? Math.max(value, Number(match[1])) : value;
  }, 0);
  return `${prefix}${highest + 1}`;
}

/** Formats a Date in the same display style used by the mock exam set. */
export function formatExamDate(date: Date) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const hours24 = date.getHours();
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours = hours24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} · ${String(hours).padStart(2, "0")}:${minutes} ${suffix}`;
}

/**
 * "Now" inside the mock timeline (the seed dataset ends on Oct 24, 2026).
 * New records get this date with the real current time so period filters
 * and chronological sorting stay coherent across the prototype.
 */
export function mockNow() {
  const now = new Date();
  return new Date(2026, 9, 24, now.getHours(), now.getMinutes());
}

type PrototypeDataContextValue = {
  /** False until the persisted snapshot has been read from localStorage. */
  hydrated: boolean;
  data: PrototypeData;
  addPatient: (input: { name: string; dob: string }) => Patient;
  updatePatient: (id: string, patch: Partial<Pick<Patient, "name" | "dob" | "status">>) => void;
  deletePatient: (id: string) => void;
  addExam: (input: { patientId: string; type: string; device: string }) => Exam | null;
  deleteExam: (id: string) => void;
  assignInboxExam: (id: string, professional: string) => void;
  updateReport: (id: string, patch: Partial<Pick<Report, "conclusion" | "summary" | "status">>) => void;
  deleteReport: (id: string) => void;
  resetData: () => void;
};

const PrototypeDataContext = React.createContext<PrototypeDataContextValue | null>(null);

export function PrototypeDataProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false);
  const [data, setData] = React.useState<PrototypeData>(seedData);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PrototypeData>;
        if (
          Array.isArray(parsed.patients) &&
          Array.isArray(parsed.exams) &&
          Array.isArray(parsed.inbox) &&
          Array.isArray(parsed.reports)
        ) {
          setData(parsed as PrototypeData);
        }
      }
    } catch {
      // Corrupted or unavailable storage: keep the mock seeds.
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage may be full or blocked; the session state still works.
    }
  }, [data, hydrated]);

  const value = React.useMemo<PrototypeDataContextValue>(() => ({
    hydrated,
    data,
    addPatient: ({ name, dob }) => {
      const patient: Patient = {
        id: nextNumericId(data.patients.map((item) => item.id), "P-"),
        name,
        dob,
        lastExam: "Never",
        status: "Active",
      };
      setData((current) => ({ ...current, patients: [...current.patients, patient] }));
      return patient;
    },
    updatePatient: (id, patch) => {
      setData((current) => ({
        ...current,
        patients: current.patients.map((patient) =>
          patient.id === id ? { ...patient, ...patch } : patient,
        ),
        exams: patch.name
          ? current.exams.map((exam) =>
              exam.patientId === id ? { ...exam, name: patch.name! } : exam,
            )
          : current.exams,
        inbox: patch.name
          ? current.inbox.map((exam) =>
              exam.patientId === id ? { ...exam, patient: patch.name! } : exam,
            )
          : current.inbox,
        reports: patch.name
          ? current.reports.map((report) =>
              report.patientId === id ? { ...report, patient: patch.name! } : report,
            )
          : current.reports,
      }));
    },
    deletePatient: (id) => {
      setData((current) => {
        const removedExamIds = current.exams
          .filter((exam) => exam.patientId === id)
          .map((exam) => exam.id);
        return {
          patients: current.patients.filter((patient) => patient.id !== id),
          exams: current.exams.filter((exam) => exam.patientId !== id),
          inbox: current.inbox.filter((exam) => exam.patientId !== id),
          reports: current.reports.filter(
            (report) =>
              report.patientId !== id && !removedExamIds.includes(report.examId),
          ),
        };
      });
    },
    addExam: ({ patientId, type, device }) => {
      const patient = data.patients.find((item) => item.id === patientId);
      if (!patient) return null;
      const exam: Exam = {
        id: nextNumericId(data.exams.map((item) => item.id), "ECG-"),
        patientId,
        name: patient.name,
        type,
        date: formatExamDate(mockNow()),
        device,
        result: "Pending Review",
      };
      setData((current) => ({
        ...current,
        exams: [...current.exams, exam],
        patients: current.patients.map((item) =>
          item.id === patientId ? { ...item, lastExam: "Just now" } : item,
        ),
      }));
      return exam;
    },
    deleteExam: (id) => {
      setData((current) => ({
        ...current,
        exams: current.exams.filter((exam) => exam.id !== id),
        inbox: current.inbox.filter((exam) => exam.id !== id),
        reports: current.reports.filter((report) => report.examId !== id),
      }));
    },
    assignInboxExam: (id, professional) => {
      setData((current) => ({
        ...current,
        inbox: current.inbox.map((exam) =>
          exam.id === id ? { ...exam, assignedTo: professional } : exam,
        ),
      }));
    },
    updateReport: (id, patch) => {
      setData((current) => ({
        ...current,
        reports: current.reports.map((report) =>
          report.id === id ? { ...report, ...patch } : report,
        ),
      }));
    },
    deleteReport: (id) => {
      setData((current) => ({
        ...current,
        reports: current.reports.filter((report) => report.id !== id),
      }));
    },
    resetData: () => {
      setData(seedData());
    },
  }), [data, hydrated]);

  return (
    <PrototypeDataContext.Provider value={value}>
      {children}
    </PrototypeDataContext.Provider>
  );
}

export function usePrototypeData() {
  const context = React.useContext(PrototypeDataContext);
  if (!context)
    throw new Error("usePrototypeData must be used inside PrototypeDataProvider");
  return context;
}
