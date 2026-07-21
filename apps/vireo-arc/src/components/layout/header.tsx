'use client';

import * as React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { cn } from '@cardioline/ui';
import { Input } from '@cardioline/ui';

export function Header() {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Search Bar */}
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            type="search" 
            placeholder="Search patients, exams, or ID..." 
            className="w-full pl-10 bg-gray-50 border-gray-200 focus-visible:ring-[#ee5b00]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500 transition-colors">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 block h-2 w-2 rounded-full bg-[#ee5b00] ring-2 ring-white" />
        </button>
        
        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end text-sm">
            <span className="font-medium text-gray-900">Dr. Sarah Jenkins</span>
            <span className="text-xs text-gray-500">Cardiologist</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#071046] text-white font-medium text-sm">
            SJ
          </div>
        </div>
      </div>
    </header>
  );
}
