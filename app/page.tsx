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
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                ElectroFix
              </span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with Trusted
            <span className="text-blue-600"> Electrical Mechanics</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Post your electrical problems and get connected with verified
            mechanics in your area. Fast, reliable, and professional home
            electrical repair services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=customer">
              <Button size="lg" className="w-full sm:w-auto">
                I Need Electrical Help
              </Button>
            </Link>
            <Link href="/auth/register?role=mechanic">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent"
              >
                I'm an Electrician
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How ElectroFix Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Post Your Problem</CardTitle>
                <CardDescription>
                  Describe your electrical issue with photos and location
                  details
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Get Connected</CardTitle>
                <CardDescription>
                  Nearby verified electricians will respond to your request
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Chat & Schedule</CardTitle>
                <CardDescription>
                  Communicate directly and schedule the perfect time for service
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose ElectroFix?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Verified Professionals</h3>
                    <p className="text-gray-600">
                      All electricians are background-checked and certified
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-yellow-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Rated & Reviewed</h3>
                    <p className="text-gray-600">
                      See real reviews from previous customers
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Local Service</h3>
                    <p className="text-gray-600">
                      Connect with electricians in your neighborhood
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-gray-600 mb-6">
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
