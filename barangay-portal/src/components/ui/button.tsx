import * as React from "react"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: "sm" | "icon" }
>(({ className, size, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
      size === "sm" ? "h-8 px-3 text-xs" : size === "icon" ? "h-9 w-9" : "h-10 px-4 py-2"
    } ${className}`}
    {...props}
  />
))
Button.displayName = "Button"

export { Button }
