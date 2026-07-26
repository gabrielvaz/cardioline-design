"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cardioline/ui";
import { usePrototypeData, type Exam } from "@/lib/prototype-data";

const examTypes = [
  "Resting ECG",
  "ECG single lead",
  "Holter 24h",
  "Holter 48h",
  "Stress Test",
];
const devices = ["ECG100L", "ECG200+", "TouchECG", "Walk400h"];

/** Mock acquisition dialog: registers a new examination for a patient. */
export function NewExamDialog({
  open,
  onOpenChange,
  patientId,
  patientName,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  patientName: string;
  onCreated: (exam: Exam) => void;
}) {
  const { addExam } = usePrototypeData();
  const [type, setType] = React.useState(examTypes[0]);
  const [device, setDevice] = React.useState(devices[0]);

  const create = () => {
    const exam = addExam({ patientId, type, device });
    if (!exam) return;
    onOpenChange(false);
    onCreated(exam);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New examination</DialogTitle>
          <DialogDescription>
            Register a new mock examination for {patientName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-exam-type">Exam type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="new-exam-type" className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-exam-device">Acquisition device</Label>
            <Select value={device} onValueChange={setDevice}>
              <SelectTrigger id="new-exam-device" className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {devices.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={create}>Create examination</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
