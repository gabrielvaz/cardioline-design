import * as React from 'react';
import { Search, Plus, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent, Button, Input } from '@cardioline/ui';

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#071046]">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view patient records.</p>
        </div>
        <Button className="bg-[#ee5b00] hover:bg-[#d05000] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <Card className="border-gray-200 shadow-sm bg-white">
        <div className="border-b border-gray-100 p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search" 
              placeholder="Search patients..." 
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
          <Button variant="outline" className="text-gray-600 border-gray-200">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">ID / SSN</th>
                  <th className="px-6 py-4">Date of Birth</th>
                  <th className="px-6 py-4">Last Exam</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'John Doe', id: 'P-10023', dob: '15 May 1965', lastExam: '10 mins ago', status: 'Active' },
                  { name: 'Jane Smith', id: 'P-10024', dob: '22 Aug 1982', lastExam: '25 mins ago', status: 'Active' },
                  { name: 'Robert Johnson', id: 'P-10025', dob: '03 Nov 1950', lastExam: '1 hour ago', status: 'Critical' },
                  { name: 'Emily Davis', id: 'P-10026', dob: '14 Feb 1990', lastExam: '2 hours ago', status: 'Active' },
                  { name: 'Michael Brown', id: 'P-10027', dob: '30 Sep 1978', lastExam: 'Yesterday', status: 'Inactive' },
                ].map((patient, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                    <td className="px-6 py-4 text-gray-500">{patient.id}</td>
                    <td className="px-6 py-4 text-gray-500">{patient.dob}</td>
                    <td className="px-6 py-4 text-gray-500">{patient.lastExam}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'Active' ? 'bg-green-100 text-green-700' :
                        patient.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">
                      <button className="p-1 hover:text-gray-600 rounded-md hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
