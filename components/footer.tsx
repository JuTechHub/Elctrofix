"use client";

import { Github, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-2xl font-bold">ElectroFix</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting customers with trusted electrical professionals for
              safe and reliable home repairs. Your electrical safety is our
              priority.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Developed by</span>
              <a
                href="https://github.com/JuTechHub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                <Github className="w-4 h-4" />
                <span>Aman Kumar</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/dashboard/customer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Customer Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/dashboard/mechanic"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Mechanic Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/ai-electrician"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  AI Electrician
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/support"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/support#safety"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a
                  href="/support#contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/support#privacy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-300">
                © {new Date().getFullYear()} ElectroFix. All rights reserved.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
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
