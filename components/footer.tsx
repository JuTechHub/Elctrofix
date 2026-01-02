"use client";

import { Github, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12 mt-8 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-3 md:mb-4">
              <Zap className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
              <span className="ml-2 text-xl md:text-2xl font-bold">
                ElectroFix
              </span>
            </div>
            <p className="text-gray-300 mb-3 md:mb-4 max-w-md text-sm md:text-base">
              Connecting customers with trusted electrical professionals for
              safe and reliable home repairs. Your electrical safety is our
              priority.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-xs md:text-sm text-gray-300">
                Developed by
              </span>
              <a
                href="https://github.com/JuTechHub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium text-xs md:text-sm"
              >
                <Github className="w-3 h-3 md:w-4 md:h-4" />
                <span>Aman Kumar</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/dashboard/customer"
                  className="text-gray-300 hover:text-white transition-colors text-sm md:text-base"
                >
                  Customer Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/mechanic"
                  className="text-gray-300 hover:text-white transition-colors text-sm md:text-base"
                >
                  Mechanic Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/ai-electrician"
                  className="text-gray-300 hover:text-white transition-colors text-sm md:text-base"
                >
                  AI Electrician
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  className="text-gray-300 hover:text-white transition-colors text-sm md:text-base"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="sm:col-span-1">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/support"
                  className="text-gray-300 hover:text-white transition-colors text-sm md:text-base"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/support#safety"
                  className="text-gray-300 hover:text-white transition-colors text-sm md:text-base"
                >
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a
                  href="/support#contact"
                  className="text-gray-300 hover:text-white transition-colors text-sm md:text-base"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/support#privacy"
                  className="text-gray-300 hover:text-white transition-colors text-sm md:text-base"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm text-gray-300">
                © {new Date().getFullYear()} ElectroFix. All rights reserved.
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-400">
                Professional electrical services • Licensed electricians • 24/7
                emergency support
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
