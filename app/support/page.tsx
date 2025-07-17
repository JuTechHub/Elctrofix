"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Zap,
  Shield,
  HelpCircle,
  Mail,
  Linkedin,
  Github,
  Phone,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Support Center
                </h1>
                <p className="text-sm text-gray-500">
                  Everything you need to know about ElectroFix
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Help Center Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-blue-600" />
                Help Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">
                      How do I post a service request?
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Navigate to your Customer Dashboard and click "Post New
                      Problem". Fill out the form with details about your
                      electrical issue, including location, urgency, and
                      description.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">
                      How are electricians verified?
                    </h4>
                    <p className="text-gray-600 mt-1">
                      All electricians go through our verification process
                      including license validation, background checks, and skill
                      assessments to ensure quality service.
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium text-gray-900">
                      What if I need emergency electrical help?
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Mark your request as "High" urgency and use our AI
                      Electrician for immediate safety guidance. For
                      life-threatening situations, call emergency services
                      first.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-900">
                      How does the chat system work?
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Once an electrician accepts your job, a chat room is
                      created for real-time communication. You can discuss
                      details, share photos, and coordinate the service.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Guidelines Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-orange-600" />
                Safety Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">
                    Critical Safety Rules
                  </h3>
                </div>
                <ul className="space-y-2 text-red-800">
                  <li>
                    • Always turn off power at the circuit breaker before any
                    electrical work
                  </li>
                  <li>
                    • Never work on electrical systems with wet hands or in wet
                    conditions
                  </li>
                  <li>
                    • If you smell burning or see sparks, evacuate and call
                    emergency services
                  </li>
                  <li>
                    • Test circuits with a voltage tester before touching any
                    wires
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Before You Start Any Electrical Work
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Turn Off Power</h4>
                        <p className="text-sm text-gray-600">
                          Switch off the circuit breaker for the area you're
                          working on
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Test the Circuit</h4>
                        <p className="text-sm text-gray-600">
                          Use a voltage tester to confirm power is off
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Wear Safety Gear</h4>
                        <p className="text-sm text-gray-600">
                          Use insulated tools and wear rubber-soled shoes
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Know Your Limits</h4>
                        <p className="text-sm text-gray-600">
                          Complex work requires a licensed electrician
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Have Emergency Numbers</h4>
                        <p className="text-sm text-gray-600">
                          Keep electrician and emergency contacts handy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Use Proper Tools</h4>
                        <p className="text-sm text-gray-600">
                          Insulated tools and proper equipment only
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-2">
                  When to Call a Professional
                </h4>
                <ul className="space-y-1 text-amber-800 text-sm">
                  <li>• Main electrical panel work</li>
                  <li>• Adding new circuits or outlets</li>
                  <li>• Whole house wiring</li>
                  <li>• Electrical permits required</li>
                  <li>• Any work you're not 100% confident about</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-purple-600" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Last updated: July 17, 2025</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Information We Collect</h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Account information (name, email, phone number)</li>
                    <li>• Service request details and location information</li>
                    <li>• Chat messages between customers and electricians</li>
                    <li>• Usage data and app performance metrics</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    How We Use Your Information
                  </h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• To connect customers with qualified electricians</li>
                    <li>
                      • To facilitate communication and service coordination
                    </li>
                    <li>• To improve our platform and user experience</li>
                    <li>
                      • To send service updates and important notifications
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Data Security</h4>
                  <p className="text-gray-600 text-sm">
                    We implement industry-standard security measures to protect
                    your personal information. All data is encrypted in transit
                    and at rest. We never share your personal information with
                    third parties without your explicit consent.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Your Rights</h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Access and download your personal data</li>
                    <li>• Request correction of inaccurate information</li>
                    <li>• Delete your account and associated data</li>
                    <li>• Opt out of non-essential communications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Us Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6 text-green-600" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
                <p className="text-gray-600 mb-6">
                  Have questions, suggestions, or need help? We're here to
                  assist you!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Platform Support */}
                <div>
                  <h4 className="font-semibold mb-4 text-gray-900">
                    Platform Support
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">
                          General Support
                        </p>
                        <a
                          href="mailto:amanjee8055@gmail.com"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          amanjee8055@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <Phone className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-900">
                          Emergency Line
                        </p>
                        <p className="text-red-600">9905048916</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Developer Contact */}
                <div>
                  <h4 className="font-semibold mb-4 text-gray-900">
                    Contact Developer
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">AK</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          Aman Kumar
                        </h5>
                        <p className="text-sm text-gray-600">
                          Full Stack Developer
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <a
                        href="mailto:amanjee8055@gmail.com"
                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Email</p>
                          <p className="text-sm text-gray-600">
                            amanjee8055@gmail.com
                          </p>
                        </div>
                      </a>

                      <a
                        href="https://www.linkedin.com/in/aman-kumar-7a82432a4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Linkedin className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">LinkedIn</p>
                          <p className="text-sm text-gray-600">
                            Connect professionally
                          </p>
                        </div>
                      </a>

                      <a
                        href="https://github.com/JuTechHub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Github className="h-5 w-5 text-gray-900" />
                        <div>
                          <p className="font-medium text-gray-900">GitHub</p>
                          <p className="text-sm text-gray-600">
                            View projects & code
                          </p>
                        </div>
                      </a>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Available for:</strong> Technical support,
                        feature requests, bug reports, and collaboration
                        opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <Link href="/ai-electrician">
                    <Button variant="outline" size="sm">
                      <Zap className="h-4 w-4 mr-2" />
                      Try AI Electrician
                    </Button>
                  </Link>
                  <Link href="/dashboard/customer">
                    <Button variant="outline" size="sm">
                      Customer Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/mechanic">
                    <Button variant="outline" size="sm">
                      Mechanic Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
