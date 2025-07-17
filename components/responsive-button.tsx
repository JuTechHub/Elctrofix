"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveButtonProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidthOnMobile?: boolean;
  icon?: ReactNode;
}

export default function ResponsiveButton({
  children,
  className,
  variant = "default",
  size = "default",
  onClick,
  disabled,
  type = "button",
  fullWidthOnMobile = false,
  icon,
  ...props
}: ResponsiveButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        // Base mobile-friendly styles
        "min-h-[44px] touch-manipulation",
        // Conditional full width on mobile
        fullWidthOnMobile && "w-full sm:w-auto",
        // Better touch targets
        "px-4 py-2 sm:px-6 sm:py-3",
        // Text sizing
        "text-sm sm:text-base",
        // Custom className
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className={cn(icon && "hidden sm:inline")}>{children}</span>
      </div>
    </Button>
  );
}
