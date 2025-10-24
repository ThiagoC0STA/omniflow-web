"use client"

import * as React from "react"

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={`overflow-auto ${className || ''}`}
    {...props}
  >
    {children}
  </div>
))
ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { className?: string; orientation?: "vertical" | "horizontal" }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    className={`scrollbar ${orientation === "vertical" ? "scrollbar-vertical" : "scrollbar-horizontal"} ${className || ''}`}
    {...props}
  />
))
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
