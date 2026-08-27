"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cardioline/ui";

const pageSizeOptions = [10, 20, 50, 100];

export function TablePagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}) {
  if (!total) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
      <div className="flex flex-wrap items-center gap-3">
        {onPageSizeChange && (
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger aria-label="Items shown per page" className="h-9 w-[112px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  Show {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <span>
          Showing {start} to {end} of {total} entries
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map(
          (number) => (
            <Button
              key={number}
              size="icon"
              variant="outline"
              onClick={() => onPageChange(number)}
              className={
                number === page
                  ? "border-border bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/80"
                  : ""
              }
            >
              {number}
            </Button>
          ),
        )}
        <Button
          size="icon"
          variant="outline"
          disabled={page === pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
