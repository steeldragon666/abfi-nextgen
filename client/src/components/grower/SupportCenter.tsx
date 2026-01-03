/**
 * SupportCenter - Grower support infrastructure
 *
 * Spec requirements:
 * - Regional support hotline: 1800-FARM-ABFI
 * - Video tutorial library organized by task complexity
 * - Quarterly workshop registration
 * - CSIRO extension services appointment booking
 * - In-context help tooltips and chat support
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Phone,
  Video,
  Calendar,
  MessageCircle,
  BookOpen,
  Users,
  Clock,
  ExternalLink,
  Play,
  CheckCircle2,
  HelpCircle,
  Headphones,
  Sprout,
  FileText,
  Mail,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Tutorial library organized by complexity
const TUTORIALS = {
  beginner: [
    {
      id: "getting-started",
      title: "Getting Started with ABFI",
      duration: "5:30",
      description: "Create your account and complete your profile",
      thumbnail: "/tutorials/getting-started.jpg",
    },
    {
      id: "first-listing",
      title: "Creating Your First Feedstock Listing",
      duration: "8:15",
      description: "Step-by-step guide to listing your feedstock",
      thumbnail: "/tutorials/first-listing.jpg",
    },
    {
      id: "property-setup",
      title: "Setting Up Your Property",
      duration: "6:45",
      description: "Add property details and boundaries",
      thumbnail: "/tutorials/property-setup.jpg",
    },
  ],
  intermediate: [
    {
      id: "carbon-calculator",
      title: "Using the Carbon Calculator",
      duration: "12:20",
      description: "Calculate your carbon intensity and ABFI rating",
      thumbnail: "/tutorials/carbon-calc.jpg",
    },
    {
      id: "contracts",
      title: "Understanding Contracts",
      duration: "10:00",
      description: "How to review and accept buyer offers",
      thumbnail: "/tutorials/contracts.jpg",
    },
    {
      id: "price-lock",
      title: "48-Hour Price Lock Explained",
      duration: "7:30",
      description: "Secure pricing while you make decisions",
      thumbnail: "/tutorials/price-lock.jpg",
    },
  ],
  advanced: [
    {
      id: "accu-registration",
      title: "Registering for Carbon Credits",
      duration: "18:45",
      description: "Complete guide to ACCU project registration",
      thumbnail: "/tutorials/accu.jpg",
    },
    {
      id: "logistics",
      title: "Managing Logistics & Delivery",
      duration: "15:20",
      description: "Coordinate transport and track consignments",
      thumbnail: "/tutorials/logistics.jpg",
    },
    {
      id: "api-integration",
      title: "Farm Management Integration",
      duration: "20:00",
      description: "Connect ABFI with your existing farm software",
      thumbnail: "/tutorials/integration.jpg",
    },
  ],
};

// Upcoming workshops
const WORKSHOPS = [
  {
    id: "ws-2024-q1",
    title: "Carbon Farming Best Practices",
    date: "2024-03-15",
    time: "10:00 AM AEST",
    type: "Webinar",
    presenter: "Dr. Sarah Chen, CSIRO",
    spots: 45,
    maxSpots: 100,
  },
  {
    id: "ws-2024-q1-2",
    title: "Maximizing Your Feedstock Value",
    date: "2024-03-22",
    time: "2:00 PM AEST",
    type: "In-Person",
    location: "Toowoomba Agricultural Centre",
    presenter: "ABFI Team",
    spots: 12,
    maxSpots: 30,
  },
  {
    id: "ws-2024-q2",
    title: "ACCU Registration Workshop",
    date: "2024-04-10",
    time: "9:00 AM AEST",
    type: "Hybrid",
    presenter: "Clean Energy Regulator",
    spots: 78,
    maxSpots: 150,
  },
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: "How long does payment take after delivery?",
    answer: "ABFI guarantees payment within 7 days of verified delivery. Most payments are processed within 3-5 business days via NAB direct deposit.",
  },
  {
    question: "What certifications do I need?",
    answer: "Basic listings don't require certifications. However, ISCC or RSB certification can increase your ABFI rating and attract premium buyers. We can help you get certified.",
  },
  {
    question: "How is the price calculated?",
    answer: "Prices are based on feedstock type, quality (carbon intensity), volume, and market conditions. Use our price calculator for transparent breakdowns.",
  },
  {
    question: "Can I sell to multiple buyers?",
    answer: "Yes! You can split your available volume across multiple contracts. Our matching system helps you find the best combination of buyers.",
  },
  {
    question: "What if there's a dispute with a buyer?",
    answer: "ABFI provides dispute resolution services. All evidence (photos, weighbridge dockets) is stored in our secure vault. Most disputes are resolved within 14 days.",
  },
];

interface SupportCenterProps {
  /** User's region for localized support */
  region?: string;
  /** Open to a specific section */
  defaultSection?: "contact" | "tutorials" | "workshops" | "faq";
}

export function SupportCenter({ region = "QLD", defaultSection = "contact" }: SupportCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Quick Contact Banner */}
      <Card className="bg-gradient-to-r from-[#1E3A5A] to-[#2D4A6A] text-white">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
                <Headphones className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Need Help?</h2>
                <p className="text-white/80">Our regional support team is here for you</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <a
                href="tel:1800327622"
                className="flex items-center gap-2 bg-[#D4AF37] text-[#1E3A5A] px-6 py-3 rounded-lg font-bold hover:bg-[#D4AF37]/90 transition-colors"
              >
                <Phone className="h-5 w-5" />
                1800-FARM-ABFI
              </a>
              <span className="text-sm text-white/60">
                Mon-Fri 7am-7pm AEST
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Support Tabs */}
      <Tabs defaultValue={defaultSection} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="contact" className="gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Tutorials</span>
          </TabsTrigger>
          <TabsTrigger value="workshops" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Workshops</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Phone Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-[#D4AF37]" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-[#1E3A5A]">1800 327 622</p>
                  <p className="text-sm text-gray-600">1800-FARM-ABFI (Toll Free)</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Mon-Fri: 7:00 AM - 7:00 PM AEST</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Sat: 8:00 AM - 2:00 PM AEST</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Average wait time: 2 min
                </Badge>
              </CardContent>
            </Card>

            {/* Email Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#D4AF37]" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <a
                    href="mailto:growers@abfi.io"
                    className="text-xl font-bold text-[#1E3A5A] hover:underline"
                  >
                    growers@abfi.io
                  </a>
                  <p className="text-sm text-gray-600">Response within 24 hours</p>
                </div>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>

            {/* CSIRO Extension Services */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  CSIRO Extension Services
                </CardTitle>
                <CardDescription>
                  Book a consultation with CSIRO agricultural specialists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Carbon Practices</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Get advice on improving your carbon intensity score
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Crop Optimization</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Maximize yield while maintaining sustainability
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Technology Adoption</h4>
                    <p className="text-sm text-purple-700 mb-3">
                      Integrate precision agriculture technologies
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Input
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Beginner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700">Beginner</Badge>
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {TUTORIALS.beginner.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {tutorial.duration}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm mb-1">{tutorial.title}</h4>
                      <p className="text-xs text-gray-600">{tutorial.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Intermediate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-amber-100 text-amber-700">Intermediate</Badge>
                Core Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {TUTORIALS.intermediate.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {tutorial.duration}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm mb-1">{tutorial.title}</h4>
                      <p className="text-xs text-gray-600">{tutorial.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700">Advanced</Badge>
                Expert Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {TUTORIALS.advanced.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {tutorial.duration}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm mb-1">{tutorial.title}</h4>
                      <p className="text-xs text-gray-600">{tutorial.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workshops Tab */}
        <TabsContent value="workshops" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Workshops & Webinars</CardTitle>
              <CardDescription>
                Register for free training sessions with ABFI and industry partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {WORKSHOPS.map((workshop) => (
                  <div
                    key={workshop.id}
                    className="border rounded-lg p-4 hover:border-[#D4AF37] transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              workshop.type === "Webinar" && "bg-blue-50 text-blue-700",
                              workshop.type === "In-Person" && "bg-green-50 text-green-700",
                              workshop.type === "Hybrid" && "bg-purple-50 text-purple-700"
                            )}
                          >
                            {workshop.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(workshop.date).toLocaleDateString("en-AU", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </span>
                        </div>
                        <h4 className="font-semibold text-lg">{workshop.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {workshop.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {workshop.presenter}
                          </span>
                          {workshop.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {workshop.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm text-gray-500">
                          {workshop.spots}/{workshop.maxSpots} spots remaining
                        </div>
                        <Button className="bg-[#D4AF37] text-[#1E3A5A] hover:bg-[#D4AF37]/90">
                          Register Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((item, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Still Need Help */}
          <Card className="bg-gray-50">
            <CardContent className="py-6">
              <div className="text-center">
                <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
                <p className="text-gray-600 mb-4">
                  Our support team is ready to help you
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                  <Button className="bg-[#1E3A5A]">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SupportCenter;
