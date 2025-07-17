import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap, Users, MapPin, MessageCircle, Shield, Star } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center">
              <Zap className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <span className="ml-2 text-xl md:text-2xl font-bold text-gray-900">
                ElectroFix
              </span>
            </div>
            <div className="flex space-x-2 md:space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="md:size-default">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="md:size-default">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            Connect with Trusted
            <span className="text-blue-600"> Electrical Mechanics</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
            Post your electrical problems and get connected with verified
            mechanics in your area. Fast, reliable, and professional home
            electrical repair services.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Link href="/auth/register?role=customer">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                I Need Electrical Help
              </Button>
            </Link>
            <Link href="/auth/register?role=mechanic">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-w-[200px] bg-transparent"
              >
                I'm an Electrician
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12 px-4">
            How ElectroFix Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <MapPin className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">
                  Post Your Problem
                </CardTitle>
                <CardDescription className="text-sm md:text-base px-2">
                  Describe your electrical issue with photos and location
                  details
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <Users className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">
                  Get Connected
                </CardTitle>
                <CardDescription className="text-sm md:text-base px-2">
                  Nearby verified electricians will respond to your request
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <MessageCircle className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
                </div>
                <CardTitle className="text-lg md:text-xl">
                  Chat & Schedule
                </CardTitle>
                <CardDescription className="text-sm md:text-base px-2">
                  Communicate directly and schedule the perfect time for service
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                Why Choose ElectroFix?
              </h2>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">
                      Verified Professionals
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      All electricians are background-checked and certified
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">
                      Rated & Reviewed
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      See real reviews from previous customers
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">
                      Local Service
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Connect with electricians in your neighborhood
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mx-4 lg:mx-0">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                Ready to get started?
              </h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Join thousands of satisfied customers who found reliable
                electrical help through ElectroFix.
              </p>
              <Link href="/auth/register">
                <Button className="w-full">Create Free Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
