import * as React from 'react';
import { Download, FileText, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, Button } from '@cardioline/ui';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#071046]">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generated medical reports and findings.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { patient: 'John Doe', type: 'Resting ECG Report', date: 'Oct 24, 2026', status: 'Finalized', color: 'green' },
          { patient: 'Jane Smith', type: 'Holter 24h Summary', date: 'Oct 24, 2026', status: 'Pending Review', color: 'orange' },
          { patient: 'Robert Johnson', type: 'Stress Test Findings', date: 'Oct 23, 2026', status: 'Finalized', color: 'green' },
          { patient: 'Emily Davis', type: 'Resting ECG Report', date: 'Oct 22, 2026', status: 'Finalized', color: 'green' },
          { patient: 'Michael Brown', type: 'Echocardiogram', date: 'Oct 20, 2026', status: 'Finalized', color: 'green' },
          { patient: 'Sarah Wilson', type: 'Holter 48h Summary', date: 'Oct 19, 2026', status: 'Draft', color: 'gray' },
        ].map((report, i) => (
          <Card key={i} className="border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-[#071046]/5 flex items-center justify-center text-[#071046]">
                  <FileText className="h-5 w-5" />
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${report.color}-100 text-${report.color}-700`}>
                  {report.status === 'Finalized' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {report.status === 'Pending Review' && <Clock className="w-3 h-3 mr-1" />}
                  {report.status}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 truncate">{report.patient}</h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">{report.type}</p>
                <p className="text-xs text-gray-400 mt-2">Generated on {report.date}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                <Button variant="outline" className="flex-1 text-gray-700 bg-white hover:bg-gray-50 border-gray-200">
                  View
                </Button>
                <Button variant="outline" className="flex-1 text-[#ee5b00] border-[#ee5b00]/20 hover:bg-orange-50 bg-white">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
