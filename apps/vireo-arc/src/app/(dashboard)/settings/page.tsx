import * as React from 'react';
import { User, Bell, Lock, Smartphone, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '@cardioline/ui';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#071046]">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-1">
          {[
            { name: 'Profile', icon: User, active: true },
            { name: 'Notifications', icon: Bell, active: false },
            { name: 'Security', icon: Lock, active: false },
            { name: 'Devices', icon: Smartphone, active: false },
            { name: 'Team', icon: Users, active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-orange-50 text-[#ee5b00]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${item.active ? 'text-[#ee5b00]' : 'text-gray-400'}`} />
              {item.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          <Card className="border-gray-200 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg text-gray-900">Public Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-[#071046] text-white flex items-center justify-center text-2xl font-semibold">
                  SJ
                </div>
                <div>
                  <Button variant="outline" className="border-gray-200 text-gray-700">Change Avatar</Button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 text-sm">First Name</Label>
                  <Input id="firstName" defaultValue="Sarah" className="bg-white border-gray-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 text-sm">Last Name</Label>
                  <Input id="lastName" defaultValue="Jenkins" className="bg-white border-gray-300" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-gray-700 text-sm">Email Address</Label>
                  <Input id="email" type="email" defaultValue="s.jenkins@hospital.com" className="bg-white border-gray-300" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="text-gray-700 text-sm">Professional Title</Label>
                  <Input id="title" defaultValue="Senior Cardiologist" className="bg-white border-gray-300" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button className="bg-[#ee5b00] hover:bg-[#d05000] text-white">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
