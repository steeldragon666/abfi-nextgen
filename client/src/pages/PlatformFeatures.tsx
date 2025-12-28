import { Button } from "@/components/ui/button";
import { H1, H2, H3, H4, Body, MetricValue, DataLabel } from "@/components/Typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Award,
  BarChart3,
  Leaf,
  Shield,
  TrendingUp,
  MapPin,
  FileCheck,
  Calendar,
  Users,
  CheckCircle2,
  DollarSign,
  Clock,
  Building2,
  Banknote,
  Target,
  Eye,
  AlertTriangle,
  LineChart,
  Search,
  FileText,
  Lock,
  Database,
  Activity,
  Bell,
  History,
  GitBranch,
  Fingerprint,
  Globe,
  Layers,
  PieChart,
  Zap,
  TreeDeciduous,
  Sprout,
  RefreshCw,
  Settings,
  Key,
  Webhook,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  AnimatedCounter,
  motion,
} from "@/components/ui/motion";

// Feature Card with expanded details
function FeatureCard({
  icon: Icon,
  title,
  description,
  features,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  color: string;
}) {
  const colorClasses: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    emerald: {
      bg: "bg-[#D4AF37]/10",
      text: "text-[#D4AF37]",
      border: "hover:border-[#D4AF37]/30",
    },
    amber: {
      bg: "bg-[#D4AF37]/10",
      text: "text-[#D4AF37]",
      border: "hover:border-[#D4AF37]/30",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      border: "hover:border-blue-500/30",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-600",
      border: "hover:border-purple-500/30",
    },
    rose: {
      bg: "bg-rose-500/10",
      text: "text-rose-600",
      border: "hover:border-rose-500/30",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-600",
      border: "hover:border-cyan-500/30",
    },
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <Card
      className={cn(
        "h-full border-2 border-transparent transition-colors",
        classes.border
      )}
    >
      <CardHeader>
        <div
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center mb-4",
            classes.bg
          )}
        >
          <Icon className={cn("h-6 w-6", classes.text)} />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <CheckCircle2
                className={cn("h-4 w-4 shrink-0 mt-0.5", classes.text)}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function PlatformFeatures() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-2 rounded-xl bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors">
                <Leaf className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <span className="text-xl font-bold text-foreground font-display">
                ABFI
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/futures">
              <Button variant="ghost" size="sm">
                Marketplace
              </Button>
            </Link>
            <Link href="/producer-registration">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white text-black py-20 lg:py-28">
        <div className="absolute inset-0 opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <pattern
              id="hex"
              patternUnits="userSpaceOnUse"
              width="20"
              height="23"
            >
              <path
                d="M10 0 L20 5.77 L20 17.32 L10 23.09 L0 17.32 L0 5.77 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hex)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInUp>
              <Badge
                variant="outline"
                className="border-white/20 text-black/90 bg-white/5 mb-6"
              >
                <Layers className="h-3 w-3 mr-1.5" />
                Complete Platform Overview
              </Badge>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                Bank-Grade Infrastructure
                <span className="block text-[#D4AF37]">
                  for Bioenergy Finance
                </span>
              </h1>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                A complete ecosystem connecting growers, developers, and lenders
                through verified data, standardized ratings, and cryptographic
                security.
              </p>
            </FadeInUp>

            <FadeInUp
              delay={0.3}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/producer-registration">
                <Button
                  size="lg"
                  className="bg-[#D4AF37] hover:bg-[#D4AF37]"
                >
                  <Sprout className="h-4 w-4 mr-2" />
                  For Growers
                </Button>
              </Link>
              <Link href="/bankability">
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#D4AF37]">
                  <Building2 className="h-4 w-4 mr-2" />
                  For Developers
                </Button>
              </Link>
              <Link href="/lender-portal">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                  <Banknote className="h-4 w-4 mr-2" />
                  For Lenders
                </Button>
              </Link>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Core Platform
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need, Built In
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From supply discovery to covenant monitoring — a complete
              infrastructure stack.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <StaggerItem>
              <FeatureCard
                icon={Globe}
                title="Futures Marketplace"
                description="Browse and list long-term biomass supply contracts up to 25 years forward."
                color="emerald"
                features={[
                  "Filter by crop type, region, volume",
                  "View supplier GQ ratings",
                  "Submit expressions of interest",
                  "Negotiate directly on platform",
                ]}
              />
            </StaggerItem>

            <StaggerItem>
              <FeatureCard
                icon={Award}
                title="Bankability Rating"
                description="Standardized AAA-CCC ratings that lenders understand and trust."
                color="amber"
                features={[
                  "5-pillar assessment framework",
                  "Weighted scoring methodology",
                  "Rating watch and outlook",
                  "Historical trend analysis",
                ]}
              />
            </StaggerItem>

            <StaggerItem>
              <FeatureCard
                icon={Users}
                title="Grower Qualification"
                description="GQ1-GQ4 tiers standardize supplier assessment across the industry."
                color="emerald"
                features={[
                  "Progressive tier advancement",
                  "Verification requirements",
                  "Track record documentation",
                  "Certification integration",
                ]}
              />
            </StaggerItem>

            <StaggerItem>
              <FeatureCard
                icon={Eye}
                title="Covenant Monitoring"
                description="Automated daily checks with instant breach alerts to all stakeholders."
                color="blue"
                features={[
                  "Contract expiration tracking",
                  "Volume threshold monitoring",
                  "Supplier status changes",
                  "Custom covenant rules",
                ]}
              />
            </StaggerItem>

            <StaggerItem>
              <FeatureCard
                icon={MapPin}
                title="Interactive Maps"
                description="Visualize supply chains geospatially with advanced filtering and analysis."
                color="cyan"
                features={[
                  "Supplier location mapping",
                  "Concentration analysis",
                  "Distance calculations",
                  "Regional statistics",
                ]}
              />
            </StaggerItem>

            <StaggerItem>
              <FeatureCard
                icon={Target}
                title="Demand Signals"
                description="Match supply availability with buyer requirements automatically."
                color="purple"
                features={[
                  "Buyer requirement posting",
                  "Automated matching",
                  "Interest notifications",
                  "Market intelligence",
                ]}
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <Badge
              variant="outline"
              className="border-white/20 text-black/90 mb-4"
            >
              Security & Compliance
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Bank-Grade Security Built In
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every feature designed with financial compliance requirements from
              day one.
            </p>
          </FadeInUp>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Fingerprint,
                title: "SHA-256 Evidence Chain",
                description:
                  "Every document cryptographically hashed and chained",
              },
              {
                icon: History,
                title: "Temporal Versioning",
                description: "Query any data point at any historical date",
              },
              {
                icon: Shield,
                title: "SOC 2 Type II",
                description: "Enterprise security controls and audit logging",
              },
              {
                icon: Lock,
                title: "256-bit Encryption",
                description: "Data encrypted at rest and in transit",
              },
              {
                icon: Database,
                title: "AU Data Residency",
                description: "All data stored in Australian data centers",
              },
              {
                icon: FileCheck,
                title: "Compliance Certificates",
                description: "Auditor-ready packages with crypto signatures",
              },
              {
                icon: Activity,
                title: "99.9% Uptime SLA",
                description: "Enterprise-grade availability guarantee",
              },
              {
                icon: Key,
                title: "SSO Support",
                description: "Enterprise single sign-on integration",
              },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Feature Categories by User Type */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Features by User Type
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore capabilities tailored to your role in the bioenergy supply
              chain.
            </p>
          </FadeInUp>

          <Tabs defaultValue="growers" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="growers" className="gap-2">
                <TreeDeciduous className="h-4 w-4" />
                Growers
              </TabsTrigger>
              <TabsTrigger value="developers" className="gap-2">
                <Building2 className="h-4 w-4" />
                Developers
              </TabsTrigger>
              <TabsTrigger value="lenders" className="gap-2">
                <Banknote className="h-4 w-4" />
                Lenders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="growers">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Sprout,
                    title: "Producer Registration",
                    desc: "Complete onboarding with ABN verification and property details",
                  },
                  {
                    icon: Calendar,
                    title: "Futures Listing",
                    desc: "Project yields up to 25 years forward with annual breakdown",
                  },
                  {
                    icon: Award,
                    title: "GQ Qualification",
                    desc: "Progress through GQ4 to GQ1 as you build track record",
                  },
                  {
                    icon: FileText,
                    title: "EOI Management",
                    desc: "Receive and respond to buyer expressions of interest",
                  },
                  {
                    icon: BarChart3,
                    title: "Performance Dashboard",
                    desc: "Track deliveries, quality tests, and compliance status",
                  },
                  {
                    icon: DollarSign,
                    title: "Fair Pricing",
                    desc: "Transparent market pricing based on verified quality",
                  },
                ].map((item, i) => (
                  <Card
                    key={i}
                    className="border-2 border-emerald-100 hover:border-emerald-300 transition-colors"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-[#D4AF37]" />
                        </div>
                        <CardTitle className="text-base">
                          {item.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/for-growers">
                  <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]">
                    Learn More for Growers
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="developers">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Search,
                    title: "Supply Discovery",
                    desc: "Browse verified suppliers filtered by region, crop, and capacity",
                  },
                  {
                    icon: Target,
                    title: "EOI Submission",
                    desc: "Express interest in futures with volume and term preferences",
                  },
                  {
                    icon: Layers,
                    title: "Portfolio Builder",
                    desc: "Aggregate suppliers into diversified supply chains",
                  },
                  {
                    icon: Award,
                    title: "Bankability Assessment",
                    desc: "Get AAA-CCC rating on your supply portfolio",
                  },
                  {
                    icon: PieChart,
                    title: "Concentration Analysis",
                    desc: "Analyze single-supplier and geographic concentration",
                  },
                  {
                    icon: FileCheck,
                    title: "Compliance Packages",
                    desc: "Generate bank-ready documentation with crypto signatures",
                  },
                ].map((item, i) => (
                  <Card
                    key={i}
                    className="border-2 border-amber-100 hover:border-amber-300 transition-colors"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-[#D4AF37]" />
                        </div>
                        <CardTitle className="text-base">
                          {item.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/for-developers">
                  <Button className="bg-[#D4AF37] hover:bg-[#D4AF37] text-black">
                    Learn More for Developers
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="lenders">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Eye,
                    title: "Portfolio Dashboard",
                    desc: "Monitor all financed projects in one view",
                  },
                  {
                    icon: Clock,
                    title: "Covenant Monitoring",
                    desc: "Automated daily checks with instant breach alerts",
                  },
                  {
                    icon: History,
                    title: "Time Machine",
                    desc: "Reconstruct any data point at historical dates",
                  },
                  {
                    icon: Bell,
                    title: "Alert Center",
                    desc: "Centralized notifications for all covenant events",
                  },
                  {
                    icon: LineChart,
                    title: "Rating Tracker",
                    desc: "Historical trends and outlook forecasts",
                  },
                  {
                    icon: Webhook,
                    title: "API Integration",
                    desc: "Connect to loan management and risk systems",
                  },
                ].map((item, i) => (
                  <Card
                    key={i}
                    className="border-2 border-blue-100 hover:border-blue-300 transition-colors"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-base">
                          {item.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/for-lenders">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Learn More for Lenders
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Integration & API */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <FadeInUp>
              <Badge variant="outline" className="mb-4">
                Developer Tools
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Build on ABFI Infrastructure
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Comprehensive APIs for integration with your existing systems.
                Webhooks for real-time event notifications.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "REST API with full CRUD operations",
                  "Webhook notifications for events",
                  "Bulk data export (CSV, JSON)",
                  "OAuth 2.0 authentication",
                  "Rate limiting and quotas",
                  "Sandbox environment for testing",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#D4AF37] shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <Card className="bg-white text-black border-0">
                <CardHeader>
                  <CardTitle className="text-sm font-mono text-gray-500">
                    API Example
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs leading-relaxed overflow-x-auto">
                    {`GET /api/v1/projects/{id}/rating

{
  "project_id": "PRJ-2024-0042",
  "rating": {
    "current": "AA+",
    "outlook": "stable",
    "effective_date": "2024-03-15"
  },
  "pillars": {
    "volume_security": 92,
    "counterparty_quality": 88,
    "contract_structure": 95,
    "concentration_risk": 78,
    "operational_readiness": 85
  },
  "evidence_hash": "a3f8b2c1..."
}`}
                  </pre>
                </CardContent>
              </Card>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-[#D4AF37]-foreground">
        <div className="container mx-auto px-4">
          <FadeInUp className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90 mb-10">
              Join Australia's leading bioenergy supply chain platform today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/producer-registration">
                <Button size="xl" variant="secondary">
                  <Sprout className="h-5 w-5 mr-2" />
                  I'm a Grower
                </Button>
              </Link>
              <Link href="/bankability">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-black hover:bg-white/10"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  I'm a Developer
                </Button>
              </Link>
              <Link href="/lender-portal">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-black hover:bg-white/10"
                >
                  <Banknote className="h-5 w-5 mr-2" />
                  I'm a Lender
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white text-gray-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <Link href="/">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="h-5 w-5 text-[#D4AF37]" />
                  <span className="font-bold font-display text-black">
                    ABFI
                  </span>
                </div>
              </Link>
              <p className="text-sm">
                Bank-grade infrastructure for biomass supply chain management.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-black">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/futures"
                    className="hover:text-black transition-colors"
                  >
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bankability"
                    className="hover:text-black transition-colors"
                  >
                    Bankability
                  </Link>
                </li>
                <li>
                  <Link
                    href="/feedstock-map"
                    className="hover:text-black transition-colors"
                  >
                    Supply Map
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-black">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/for-growers"
                    className="hover:text-black transition-colors"
                  >
                    For Growers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/for-developers"
                    className="hover:text-black transition-colors"
                  >
                    For Developers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/for-lenders"
                    className="hover:text-black transition-colors"
                  >
                    For Lenders
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-black">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-black transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-black transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="hover:text-black transition-colors"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-black0">
            © {new Date().getFullYear()} Australian Bioenergy Feedstock
            Institute. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
