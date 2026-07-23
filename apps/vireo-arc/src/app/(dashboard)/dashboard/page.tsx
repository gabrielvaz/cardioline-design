import * as React from 'react';
import Link from 'next/link';
import { Activity, Users, Clock, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@cardioline/ui';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#071046]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of patient exams and recent activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Exams (Today)</CardTitle>
            <Activity className="h-4 w-4 text-[#ee5b00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">124</div>
            <p className="text-xs text-green-600 font-medium mt-1">+14% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">New Patients</CardTitle>
            <Users className="h-4 w-4 text-[#ee5b00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <p className="text-xs text-green-600 font-medium mt-1">+5 this week</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-[#ee5b00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">18</div>
            <p className="text-xs text-gray-500 mt-1">Needs review</p>
          </CardContent>
        </Card>
        <Card className="border-red-100 shadow-sm bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">3</div>
            <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900 text-lg">Recent Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'ECG-2401', name: 'John Doe', type: 'Resting ECG', time: '10 mins ago', status: 'Normal' },
                { id: 'ECG-2402', name: 'Jane Smith', type: 'Holter 24h', time: '25 mins ago', status: 'Pending Review' },
                { id: 'ECG-2403', name: 'Robert Johnson', type: 'Stress Test', time: '1 hour ago', status: 'Critical', alert: true },
                { id: 'ECG-2404', name: 'Emily Davis', type: 'Resting ECG', time: '2 hours ago', status: 'Normal' },
              ].map((exam, i) => (
                <Link key={exam.id} href={`/exams/${exam.id}`} className="-mx-2 flex items-center justify-between rounded-md border-b border-gray-100 px-2 py-2 transition-colors last:border-0 hover:bg-orange-50/70 focus-visible:bg-orange-50 focus-visible:outline-none">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                      {exam.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="font-medium text-[#ee5b00]">{exam.type}</span>
                        <span>•</span>
                        <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {exam.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    exam.alert ? 'bg-red-100 text-red-700' : 
                    exam.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {exam.status}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900 text-lg">Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: 'Cardioline ECG100L', location: 'Room 302', status: 'Online', battery: '85%' },
                { name: 'Cardioline Walk400h', location: 'Ward B', status: 'In Use', battery: '42%' },
                { name: 'Cardioline ECG200+', location: 'ER', status: 'Offline', battery: '0%' },
              ].map((device, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{device.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Location: {device.location}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium flex items-center justify-end gap-1.5 ${
                      device.status === 'Online' ? 'text-green-600' :
                      device.status === 'In Use' ? 'text-[#ee5b00]' : 'text-gray-500'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${
                        device.status === 'Online' ? 'bg-green-500' :
                        device.status === 'In Use' ? 'bg-primary' : 'bg-gray-400'
                      }`} />
                      {device.status}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Battery: {device.battery}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
