import * as React from 'react';
import { Activity, Download, Eye, FileText, Filter, Search } from 'lucide-react';
import { Card, CardContent, Button, Input } from '@cardioline/ui';

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#071046]">Exams & ECG</h1>
          <p className="text-sm text-gray-500 mt-1">Browse, view, and manage all electrocardiogram recordings.</p>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm bg-white">
        <div className="border-b border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-[#ee5b00] border-[#ee5b00]/20 bg-orange-50 hover:bg-orange-100">
              All Exams
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Pending Review</Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Critical</Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search exams..." 
                className="pl-9 bg-gray-50 border-gray-200"
              />
            </div>
            <Button variant="outline" className="text-gray-600 border-gray-200">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Exam Type</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Device</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'John Doe', type: 'Resting ECG', date: 'Oct 24, 2026 - 10:45 AM', device: 'ECG100L', result: 'Normal' },
                  { name: 'Jane Smith', type: 'Holter 24h', date: 'Oct 24, 2026 - 09:30 AM', device: 'Walk400h', result: 'Pending Review' },
                  { name: 'Robert Johnson', type: 'Stress Test', date: 'Oct 24, 2026 - 08:15 AM', device: 'ECG200+', result: 'Abnormal' },
                  { name: 'Emily Davis', type: 'Resting ECG', date: 'Oct 23, 2026 - 16:20 PM', device: 'ECG100L', result: 'Normal' },
                  { name: 'Michael Brown', type: 'Resting ECG', date: 'Oct 23, 2026 - 14:10 PM', device: 'ECG100L', result: 'Normal' },
                ].map((exam, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{exam.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-900">
                        <Activity className="mr-2 h-4 w-4 text-gray-400" />
                        {exam.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{exam.date}</td>
                    <td className="px-6 py-4 text-gray-500">{exam.device}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        exam.result === 'Normal' ? 'bg-green-100 text-green-700' :
                        exam.result === 'Abnormal' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {exam.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-500 hover:text-[#ee5b00] rounded-md hover:bg-orange-50 transition-colors" title="View ECG">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-[#ee5b00] rounded-md hover:bg-orange-50 transition-colors" title="Download Report">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
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
