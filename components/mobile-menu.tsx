"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  Home,
  User,
  MessageCircle,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuProps {
  currentPage?: string;
}

export default function MobileMenu({ currentPage }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { user, profile, logout } = useAuth();

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      id: "dashboard",
    },
    {
      href: "/dashboard/customer/post-problem",
      label: "Post Problem",
      icon: MessageCircle,
      id: "post-problem",
      condition: profile?.role === "customer",
    },
    {
      href: "/dashboard/mechanic",
      label: "Jobs",
      icon: MessageCircle,
      id: "jobs",
      condition: profile?.role === "mechanic",
    },
    {
      href: "/ai-electrician",
      label: "AI Assistant",
      icon: Zap,
      id: "ai-assistant",
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      id: "profile",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      id: "settings",
    },
  ].filter((item) => !item.condition || item.condition);

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">
                ElectroFix
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="py-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile?.name || user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile?.role || "User"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 py-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          {user && (
            <div className="border-t pt-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
