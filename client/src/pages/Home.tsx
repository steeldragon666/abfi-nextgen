import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatsCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { ArrowRight, Award, BarChart3, Leaf, Search, Shield, TrendingUp, MapPin, FileCheck, Zap, Users, Building2, Banknote, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { FadeInUp, StaggerContainer, StaggerItem, HoverCard, AnimatedCounter, Floating } from "@/components/ui/motion";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground font-display">ABFI</span>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/browse">
              <Button variant="ghost">Marketplace</Button>
            </Link>
            <Link href="/feedstock-map">
              <Button variant="ghost">Data</Button>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Dashboard</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Sign In</Button>
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-br from-background via-primary/5 to-background">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <FadeInUp className="max-w-4xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-1.5">
              <Floating amplitude={3} duration={2}>
                <Leaf className="h-3.5 w-3.5 mr-1.5" />
              </Floating>
              Australia's Bioenergy Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-normal mb-6 leading-tight text-foreground">
              Australian Bioenergy<br />
              <span className="text-primary">Feedstock Institute</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
              Connecting the bioenergy supply chain through verified data, transparent markets, and bankability assessments
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/producer-registration">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Register as Producer
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </FadeInUp>

          {/* Three User Groups */}
          <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Growers/Producers */}
            <StaggerItem>
              <HoverCard className="h-full">
                <Card variant="elevated" className="group border-2 border-transparent hover:border-success/30 h-full">
              <CardHeader className="text-center pb-4">
                <div className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-success/10 group-hover:bg-success/20 transition-colors">
                  <Users className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="heading-3 mb-2">Growers & Producers</CardTitle>
                <CardDescription className="body-lg">
                  Register your feedstock supply and connect with verified buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-success/10 shrink-0 mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                    </div>
                    <span>Register planned or existing feedstock supply</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-success/10 shrink-0 mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                    </div>
                    <span>Receive market signals and fair price discovery</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-success/10 shrink-0 mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                    </div>
                    <span>Get verified through ABFI qualification system</span>
                  </li>
                </ul>
                <Link href="/producer-registration">
                  <Button className="w-full mt-4" variant="success" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Register as Producer
                  </Button>
                </Link>
              </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>

            {/* Project Developers/Offtakers */}
            <StaggerItem>
              <HoverCard className="h-full">
                <Card variant="elevated" className="group border-2 border-transparent hover:border-warning/30 h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-warning/10 group-hover:bg-warning/20 transition-colors">
                      <Building2 className="h-8 w-8 text-warning" />
                    </div>
                    <CardTitle className="heading-3 mb-2">Project Developers</CardTitle>
                    <CardDescription className="body-lg">
                      Secure feedstock supply and assess project bankability
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-warning/10 shrink-0 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-warning" />
                        </div>
                        <span>Browse verified feedstock suppliers by location</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-warning/10 shrink-0 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-warning" />
                        </div>
                        <span>Assess supply chain bankability with ABFI rating</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-warning/10 shrink-0 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-warning" />
                        </div>
                        <span>Generate compliance certificates for lenders</span>
                      </li>
                    </ul>
                    <Link href="/bankability">
                      <Button className="w-full mt-4 bg-warning hover:bg-warning/90 text-warning-foreground" rightIcon={<ArrowRight className="h-4 w-4" />}>
                        Start Assessment
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>

            {/* Lenders/Financial Institutions */}
            <StaggerItem>
              <HoverCard className="h-full">
                <Card variant="elevated" className="group border-2 border-transparent hover:border-info/30 h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-info/10 group-hover:bg-info/20 transition-colors">
                      <Banknote className="h-8 w-8 text-info" />
                    </div>
                    <CardTitle className="heading-3 mb-2">Lenders & Financiers</CardTitle>
                    <CardDescription className="body-lg">
                      Monitor project covenants and supply chain risk
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-info/10 shrink-0 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-info" />
                        </div>
                        <span>Real-time covenant compliance monitoring</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-info/10 shrink-0 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-info" />
                        </div>
                        <span>Automated breach alerts and renewal notices</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-info/10 shrink-0 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-info" />
                        </div>
                        <span>Independent bankability assessments</span>
                      </li>
                    </ul>
                    <Link href="/lender-portal">
                      <Button className="w-full mt-4 bg-info hover:bg-info/90 text-info-foreground" rightIcon={<ArrowRight className="h-4 w-4" />}>
                        Access Portal
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </HoverCard>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Platform Metrics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Weekly Index"
              value="1,245.50"
              description="Market benchmark"
              icon={<TrendingUp className="h-5 w-5" />}
              trend={{ value: 2.3, direction: "up" }}
            />

            <StatsCard
              title="Sustainability Score"
              value="92/100"
              description="Platform average"
              icon={<Leaf className="h-5 w-5" />}
              variant="success"
            />

            <StatsCard
              title="Feedstock Available"
              value="1,246.79"
              description="Thousand tonnes"
              icon={<BarChart3 className="h-5 w-5" />}
              trend={{ value: 2.3, direction: "up" }}
            />

            <StatsCard
              title="Production Volume"
              value="1.2M"
              description="Annual tonnes"
              icon={<Zap className="h-5 w-5" />}
              trend={{ value: 0.1, direction: "up" }}
            />
          </div>
        </div>
      </section>

      {/* Why Choose ABFI */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Platform Features</Badge>
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">Why Choose ABFI?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The trusted platform connecting Australia's bioenergy supply chain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card hover variant="outlined" className="group">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="heading-3">ABFI Rating System</CardTitle>
                <CardDescription className="body-lg mt-3">
                  Comprehensive 5-pillar bankability assessment framework evaluating volume security, counterparty quality, contract structure, concentration risk, and operational readiness.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card hover variant="outlined" className="group">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="heading-3">Verified Suppliers</CardTitle>
                <CardDescription className="body-lg mt-3">
                  All suppliers undergo rigorous verification including ABN validation, grower qualification (GQ1-GQ4), quality testing, and certification checks before listing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card hover variant="outlined" className="group">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="heading-3">Covenant Monitoring</CardTitle>
                <CardDescription className="body-lg mt-3">
                  Automated daily covenant checks, weekly supply recalculation, and contract renewal alerts keep lenders informed of project health and compliance status.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid md:grid-cols-3 gap-12 text-center">
            <StaggerItem>
              <div className="metric-xl mb-3 text-primary-foreground">
                <AnimatedCounter value={250} suffix="+" className="font-mono" />
              </div>
              <div className="text-lg opacity-90 font-medium">Registered Producers</div>
            </StaggerItem>
            <StaggerItem>
              <div className="metric-xl mb-3 text-primary-foreground">
                <AnimatedCounter value={45} suffix="+" className="font-mono" />
              </div>
              <div className="text-lg opacity-90 font-medium">Active Projects</div>
            </StaggerItem>
            <StaggerItem>
              <div className="metric-xl mb-3 text-primary-foreground">
                <AnimatedCounter value={2.5} prefix="$" suffix="B" decimals={1} className="font-mono" />
              </div>
              <div className="text-lg opacity-90 font-medium">Financed Volume</div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join Australia's leading bioenergy feedstock platform today
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/producer-registration">
                <Button size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Register as Producer
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="xl" variant="outline">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-bold font-display text-foreground">ABFI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Australian Bioenergy Feedstock Institute - Connecting the bioenergy supply chain through verified data and transparent markets.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">For Producers</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/producer-registration" className="hover:text-foreground transition-colors">Register Supply</Link></li>
                <li><Link href="/grower-benefits" className="hover:text-foreground transition-colors">Grower Benefits</Link></li>
                <li><Link href="/feedstock-map" className="hover:text-foreground transition-colors">Interactive Map</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">For Developers</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/browse" className="hover:text-foreground transition-colors">Browse Feedstocks</Link></li>
                <li><Link href="/bankability" className="hover:text-foreground transition-colors">Bankability Assessment</Link></li>
                <li><Link href="/certificates" className="hover:text-foreground transition-colors">Certificates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">For Lenders</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/lender-portal" className="hover:text-foreground transition-colors">Lender Portal</Link></li>
                <li><Link href="/compliance-dashboard" className="hover:text-foreground transition-colors">Compliance Dashboard</Link></li>
                <li><Link href="/admin" className="hover:text-foreground transition-colors">Admin Access</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-10 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Australian Bioenergy Feedstock Institute. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
