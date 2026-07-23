'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@cardioline/ui';

export function TablePagination({ page, pageCount, total, pageSize, onPageChange }: { page: number; pageCount: number; total: number; pageSize: number; onPageChange: (page: number) => void }) {
  if (!total) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-500"><span>Showing {start}–{end} of {total} entries</span><div className="flex items-center gap-1"><Button size="icon" variant="outline" disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page"><ChevronLeft /></Button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <Button key={number} size="icon" variant="outline" onClick={() => onPageChange(number)} className={number === page ? 'border-accent bg-accent text-accent-foreground hover:bg-accent' : ''}>{number}</Button>)}<Button size="icon" variant="outline" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page"><ChevronRight /></Button></div></div>;
}
