import * as React from 'react';
import { ArrowLeft, Edit, FileText, HeartPulse, History, Phone, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@cardioline/ui';
import Link from 'next/link';

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  // Mock data for patient details
  const patient = {
    id: id || 'P-10023',
    name: 'John Doe',
    dob: '15 May 1965 (58 y/o)',
    gender: 'Male',
    bloodType: 'A+',
    phone: '+1 (555) 123-4567',
    email: 'johndoe@example.com',
    address: '123 Health Ave, Medical City, NY',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin'],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#071046]">{patient.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Patient ID: {patient.id}</p>
        </div>
        <Button variant="outline" className="border-gray-200 text-gray-700">
          <Edit className="mr-2 h-4 w-4" />
          Edit Details
        </Button>
        <Button className="bg-[#ee5b00] hover:bg-[#d05000] text-white">
          <HeartPulse className="mr-2 h-4 w-4" />
          New ECG
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Profile Summary */}
        <div className="space-y-6 md:col-span-1">
          <Card className="border-gray-200 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg text-gray-900">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Date of Birth</span>
                <span className="font-medium text-gray-900">{patient.dob}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium text-gray-900">{patient.gender}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Blood Type</span>
                <span className="font-medium text-gray-900">{patient.bloodType}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  {patient.phone}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg text-gray-900">Medical Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalHistory.map((cond, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Allergies</h4>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((alg, i) => (
                    <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-xs font-medium border border-red-100">
                      {alg}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clinical History & Exams */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-gray-200 shadow-sm bg-white h-full">
            <CardHeader className="border-b border-gray-100 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-gray-900">Exam History</CardTitle>
              <Button variant="ghost" size="sm" className="text-[#ee5b00] hover:bg-orange-50 hover:text-[#d05000]">
                View All
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-gray-100">
                {[
                  { date: 'Oct 24, 2026', type: 'Resting ECG', status: 'Normal', physician: 'Dr. Sarah Jenkins' },
                  { date: 'Sep 12, 2026', type: 'Holter 24h', status: 'Abnormal', physician: 'Dr. Alan Grant' },
                  { date: 'Jan 05, 2026', type: 'Resting ECG', status: 'Normal', physician: 'Dr. Sarah Jenkins' },
                ].map((exam, i) => (
                  <div key={i} className="py-4 flex items-center justify-between hover:bg-gray-50/50 p-4 -mx-4 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#ee5b00]">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{exam.type}</p>
                        <p className="text-xs text-gray-500 mt-1">{exam.date} • {exam.physician}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        exam.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {exam.status}
                      </span>
                      <Button variant="outline" size="sm" className="text-gray-600">
                        <FileText className="h-4 w-4 mr-2" />
                        Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
