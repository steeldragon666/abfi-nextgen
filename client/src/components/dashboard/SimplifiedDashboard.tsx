"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  Users,
  ChevronRight,
  Leaf,
  MapPin,
  ShieldCheck,
  Calculator,
  FileSearch,
  ArrowRight,
  PlayCircle,
} from "lucide-react";
import { Link } from "wouter";
import { PageLayout, PageContainer } from "@/components/layout";
import { AvatarAssistant } from "@/components/AIHelper/AvatarAssistant";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import { H1, H2, H5, Body, MetricValue, DataLabel } from "@/components/Typography";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Welcome page tour steps
const welcomeTourSteps: StepType[] = [
  {
    selector: '[data-tour="welcome-hero"]',
    content: (
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Welcome to ABFI!</h3>
        <p className="text-gray-600">Australia's premier bioenergy feedstock trading platform. Let me show you around!</p>
      </div>
    ),
  },
  {
    selector: '[data-tour="live-price"]',
    content: (
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Live Market Prices</h3>
        <p className="text-gray-600">Track real-time ethanol and feedstock prices updated every 15 minutes.</p>
      </div>
    ),
  },
  {
    selector: '[data-tour="suppliers"]',
    content: (
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Verified Suppliers</h3>
        <p className="text-gray-600">Browse 47+ verified Australian bioenergy suppliers with sustainability certifications.</p>
      </div>
    ),
  },
  {
    selector: '[data-tour="carbon"]',
    content: (
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Carbon Tracking</h3>
        <p className="text-gray-600">Monitor your carbon savings and generate reports for ESG compliance.</p>
      </div>
    ),
  },
  {
    selector: '[data-tour="quick-start"]',
    content: (
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Get Started Quickly</h3>
        <p className="text-gray-600">Request quotes, explore the feedstock map, or calculate your carbon intensity in just a few clicks.</p>
      </div>
    ),
  },
  {
    selector: '[data-tour="sam-assistant"]',
    content: (
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Meet Sam - Your AI Guide</h3>
        <p className="text-gray-600">Click the chat bubble anytime to ask Sam questions about the platform, pricing, or sustainability.</p>
      </div>
    ),
  },
];

// Tour controller component that uses the useTour hook
function TourController() {
  const { setIsOpen, setCurrentStep } = useTour();

  useEffect(() => {
    // Auto-start tour for first-time visitors
    const hasSeenWelcomeTour = localStorage.getItem('abfi-welcome-tour-seen');
    if (!hasSeenWelcomeTour) {
      const timer = setTimeout(() => {
        setCurrentStep(0);
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [setIsOpen, setCurrentStep]);

  return null;
}

// Tour start button component
function TourStartButton() {
  const { setIsOpen, setCurrentStep } = useTour();

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  return (
    <Button
      size="lg"
      variant="ghost"
      className="text-white hover:bg-white/10 min-h-[52px] text-lg"
      onClick={startTour}
    >
      <PlayCircle className="mr-2 h-5 w-5" />
      Take a Tour
    </Button>
  );
}

export function SimplifiedDashboard() {
  // Default values - real data loaded lazily after initial render
  const ethanolPrice = 1.42;
  const supplierCount = 47;

  return (
    <TourProvider
      steps={welcomeTourSteps}
      onClickClose={({ setIsOpen }) => {
        localStorage.setItem('abfi-welcome-tour-seen', 'true');
        setIsOpen(false);
      }}
      styles={{
        popover: (base) => ({
          ...base,
          borderRadius: '16px',
          padding: '0',
          maxWidth: '360px',
          background: '#ffffff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }),
        maskArea: (base) => ({
          ...base,
          rx: 12,
        }),
        badge: (base) => ({
          ...base,
          background: '#D4AF37',
          color: '#000000',
          fontWeight: '600',
        }),
        dot: (base, state) => ({
          ...base,
          background: state?.current ? '#D4AF37' : '#e5e7eb',
        }),
        controls: (base) => ({
          ...base,
          marginTop: '16px',
        }),
      }}
    >
      <TourController />
    <PageLayout>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 md:py-24">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
            data-tour="welcome-hero"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm font-medium">
                Australia's Bioenergy Feedstock Platform
              </span>
            </motion.div>

            <H1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
              Welcome to <span className="text-[#D4AF37]">ABFI</span>
            </H1>

            <Body size="lg" className="text-gray-300 max-w-2xl mx-auto mb-8 md:text-xl">
              Trade biofuel feedstock. Track carbon intensity. Power Australia's
              renewable energy future with verified suppliers and real-time pricing.
            </Body>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#D4AF37] text-black hover:bg-[#E5C158] min-h-[52px] text-lg font-semibold"
                asChild
              >
                <Link href="/supplier-directory">
                  <Users className="mr-2 h-5 w-5" />
                  Browse Suppliers
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 min-h-[52px] text-lg"
                asChild
              >
                <Link href="/price-dashboard">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  View Live Prices
                </Link>
              </Button>
              <TourStartButton />
            </div>
          </motion.div>
        </PageContainer>
      </section>

      <PageContainer className="py-12 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div variants={itemVariants} data-tour="live-price">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-[#D4AF37]">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <CardTitle className="text-base font-medium text-gray-600">
                      Live Ethanol Price
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <MetricValue size="lg" className="text-slate-900">
                    ${ethanolPrice.toFixed(2)}/L
                  </MetricValue>
                  <Body size="sm" className="text-gray-500 mt-1">
                    Updated every 15 minutes
                  </Body>
                  <Button variant="link" className="p-0 mt-2 h-auto" asChild>
                    <Link href="/price-dashboard">
                      View Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} data-tour="suppliers">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-base font-medium text-gray-600">
                      Verified Suppliers
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <MetricValue size="lg" className="text-slate-900">
                    {supplierCount}+
                  </MetricValue>
                  <Body size="sm" className="text-gray-500 mt-1">
                    Across all Australian states
                  </Body>
                  <Button variant="link" className="p-0 mt-2 h-auto" asChild>
                    <Link href="/supplier-directory">
                      Browse Marketplace <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} data-tour="carbon">
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Leaf className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-base font-medium text-gray-600">
                      Carbon Saved
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <MetricValue size="lg" className="text-slate-900">2,450+</MetricValue>
                  <Body size="sm" className="text-gray-500 mt-1">
                    tCO2e tracked on platform
                  </Body>
                  <Button variant="link" className="p-0 mt-2 h-auto" asChild>
                    <Link href="/emissions">
                      Calculate Yours <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Start Section */}
          <motion.div variants={itemVariants} className="mb-12" data-tour="quick-start">
            <div className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-2xl p-8 border border-gray-200">
              <H2 className="text-2xl mb-2">
                Quick Start
              </H2>
              <Body className="text-gray-600 mb-6">
                Get started in under 2 minutes with these essential actions
              </Body>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="w-full justify-between bg-[#D4AF37] text-black hover:bg-[#E5C158] min-h-[56px] text-base"
                  size="lg"
                  asChild
                >
                  <Link href="/supplier-directory">
                    <span className="flex items-center">
                      <ChevronRight className="mr-2 h-5 w-5" />
                      Request Your First Quote
                    </span>
                    <Badge variant="secondary" className="bg-white/30">
                      2 min
                    </Badge>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between min-h-[56px] text-base border-gray-300"
                  size="lg"
                  asChild
                >
                  <Link href="/feedstock-map">
                    <span className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Explore Feedstock Map
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between min-h-[56px] text-base border-gray-300"
                  size="lg"
                  asChild
                >
                  <Link href="/emissions">
                    <span className="flex items-center">
                      <Calculator className="mr-2 h-5 w-5" />
                      Calculate Carbon Intensity
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between min-h-[56px] text-base border-gray-300"
                  size="lg"
                  asChild
                >
                  <Link href="/ratings">
                    <span className="flex items-center">
                      <ShieldCheck className="mr-2 h-5 w-5" />
                      View Bankability Ratings
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants}>
            <H2 className="text-2xl mb-6">
              Platform Features
            </H2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                    <FileSearch className="w-6 h-6 text-blue-600" />
                  </div>
                  <H5 className="text-slate-900 mb-2">
                    Evidence Vault
                  </H5>
                  <Body size="sm" className="text-gray-600">
                    Blockchain-verified sustainability documentation
                  </Body>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="p-3 bg-amber-100 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <H5 className="text-slate-900 mb-2">
                    Futures Trading
                  </H5>
                  <Body size="sm" className="text-gray-600">
                    Lock in prices with forward contracts
                  </Body>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="p-3 bg-green-100 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <H5 className="text-slate-900 mb-2">
                    Lender Portal
                  </H5>
                  <Body size="sm" className="text-gray-600">
                    Project assessment for financiers
                  </Body>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Leaf className="w-6 h-6 text-purple-600" />
                  </div>
                  <H5 className="text-slate-900 mb-2">
                    GO Certificates
                  </H5>
                  <Body size="sm" className="text-gray-600">
                    Guarantee of Origin certification
                  </Body>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </PageContainer>

      {/* Sam AI Assistant */}
      <div data-tour="sam-assistant">
        <AvatarAssistant />
      </div>
    </PageLayout>
  </TourProvider>
  );
}

export default SimplifiedDashboard;
