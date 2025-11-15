"use client";

import * as React from "react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./utils";
import "react-day-picker/dist/style.css";

type CalendarProps = DayPickerProps & {
  components?: Record<string, React.ComponentType<any>>;
};

export default function Calendar({ components = {}, ...props }: CalendarProps) {
  const IconLeft: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
    <ChevronLeft {...p} className={cn("h-4 w-4", p.className)} />
  );

  const IconRight: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
    <ChevronRight {...p} className={cn("h-4 w-4", p.className)} />
  );

  const mergedComponents = {
    IconLeft,
    IconRight,
    ...components,
  };

  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-2">
      <DayPicker {...props} components={mergedComponents as any} />
    </div>
  );
}
