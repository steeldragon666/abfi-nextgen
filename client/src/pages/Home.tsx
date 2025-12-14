import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { ArrowRight, Award, BarChart3, Leaf, Search, Shield, TrendingUp, MapPin, FileCheck, Zap, Users, Building2, Banknote } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>ABFI</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/browse">
              <Button variant="ghost" className="text-base">Marketplace</Button>
            </Link>
            <Link href="/feedstock-map">
              <Button variant="ghost" className="text-base">Data</Button>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90">Dashboard</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #faf8f3 0%, #f5f0e6 100%)' }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-normal mb-6 leading-tight" style={{ 
              fontFamily: "'DM Serif Display', serif",
              color: '#1a2e1a'
            }}>
              Australian Bioenergy<br />
              <span style={{ color: '#2d5a27' }}>Feedstock Institute</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ 
              color: '#4a5a4a',
              fontWeight: 300,
              lineHeight: 1.7
            }}>
              Connecting the bioenergy supply chain through verified data, transparent markets, and bankability assessments
            </p>
          </div>

          {/* Three User Groups */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Growers/Producers */}
            <Card className="border-2 hover:border-[#2d5a27] transition-all hover:shadow-xl bg-white">
              <CardHeader className="text-center pb-4">
                <div className="h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#e8f5e8' }}>
                  <Users className="h-8 w-8" style={{ color: '#2d5a27' }} />
                </div>
                <CardTitle className="text-2xl mb-2">Growers & Producers</CardTitle>
                <CardDescription className="text-base">
                  Register your feedstock supply and connect with verified buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <FileCheck className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#2d5a27' }} />
                    <span>Register planned or existing feedstock supply</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#2d5a27' }} />
                    <span>Receive market signals and fair price discovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#2d5a27' }} />
                    <span>Get verified through ABFI qualification system</span>
                  </li>
                </ul>
                <Link href="/producer-registration">
                  <Button className="w-full mt-4" style={{ background: '#2d5a27' }}>
                    Register as Producer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Project Developers/Offtakers */}
            <Card className="border-2 hover:border-[#b8860b] transition-all hover:shadow-xl bg-white">
              <CardHeader className="text-center pb-4">
                <div className="h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#fef3c7' }}>
                  <Building2 className="h-8 w-8" style={{ color: '#b8860b' }} />
                </div>
                <CardTitle className="text-2xl mb-2">Project Developers</CardTitle>
                <CardDescription className="text-base">
                  Secure feedstock supply and assess project bankability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Search className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#b8860b' }} />
                    <span>Browse verified feedstock suppliers by location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#b8860b' }} />
                    <span>Assess supply chain bankability with ABFI rating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileCheck className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#b8860b' }} />
                    <span>Generate compliance certificates for lenders</span>
                  </li>
                </ul>
                <Link href="/bankability">
                  <Button className="w-full mt-4" style={{ background: '#b8860b' }}>
                    Start Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Lenders/Financial Institutions */}
            <Card className="border-2 hover:border-[#1e3a5f] transition-all hover:shadow-xl bg-white">
              <CardHeader className="text-center pb-4">
                <div className="h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#e3f2fd' }}>
                  <Banknote className="h-8 w-8" style={{ color: '#1e3a5f' }} />
                </div>
                <CardTitle className="text-2xl mb-2">Lenders & Financiers</CardTitle>
                <CardDescription className="text-base">
                  Monitor project covenants and supply chain risk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <BarChart3 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#1e3a5f' }} />
                    <span>Real-time covenant compliance monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#1e3a5f' }} />
                    <span>Automated breach alerts and renewal notices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileCheck className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#1e3a5f' }} />
                    <span>Independent bankability assessments</span>
                  </li>
                </ul>
                <Link href="/lender-portal">
                  <Button className="w-full mt-4" style={{ background: '#1e3a5f' }}>
                    Access Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Metrics */}
      <section className="py-12" style={{ background: '#faf8f3' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 border-[#F4C430] shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-[#F4C430]" />
                  Weekly Index
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">1,245.50</div>
                <div className="text-sm text-emerald-600 font-medium">+2.3%</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#F4C430] shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Leaf className="h-4 w-4 text-[#F4C430]" />
                  Sustainability Score
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">92/100</div>
                <div className="text-sm text-muted-foreground">Platform average</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#F4C430] shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4 text-[#F4C430]" />
                  Feedstock Availability
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">1,246.79</div>
                <div className="text-sm text-emerald-600 font-medium">+2.3%</div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#F4C430] shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-[#F4C430]" />
                  Production Volume
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">1.2M</div>
                <div className="text-sm text-emerald-600 font-medium">+0.1% tonnes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose ABFI */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Why Choose ABFI?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The trusted platform connecting Australia's bioenergy supply chain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-[#DAA520]/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">ABFI Rating System</CardTitle>
                <CardDescription className="text-base mt-2">
                  Comprehensive 5-pillar bankability assessment framework evaluating volume security, counterparty quality, contract structure, concentration risk, and operational readiness.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#DAA520]/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Verified Suppliers</CardTitle>
                <CardDescription className="text-base mt-2">
                  All suppliers undergo rigorous verification including ABN validation, grower qualification (GQ1-GQ4), quality testing, and certification checks before listing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-[#DAA520]/50 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Covenant Monitoring</CardTitle>
                <CardDescription className="text-base mt-2">
                  Automated daily covenant checks, weekly supply recalculation, and contract renewal alerts keep lenders informed of project health and compliance status.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">250+</div>
              <div className="text-lg opacity-90">Registered Producers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">45+</div>
              <div className="text-lg opacity-90">Active Projects</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">$2.5B</div>
              <div className="text-lg opacity-90">Financed Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join Australia's leading bioenergy feedstock platform today
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/producer-registration">
              <Button size="lg" className="text-lg px-8 py-6" style={{ background: '#2d5a27' }}>
                Register as Producer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2" style={{
                borderColor: '#2d5a27',
                color: '#2d5a27'
              }}>
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">ABFI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Australian Bioenergy Feedstock Institute - Connecting the bioenergy supply chain
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Producers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/producer-registration">Register Supply</Link></li>
                <li><Link href="/grower-benefits">Grower Benefits</Link></li>
                <li><Link href="/feedstock-map">Interactive Map</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Developers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/browse">Browse Feedstocks</Link></li>
                <li><Link href="/bankability">Bankability Assessment</Link></li>
                <li><Link href="/certificates">Certificates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Lenders</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/lender-portal">Lender Portal</Link></li>
                <li><Link href="/compliance-dashboard">Compliance Dashboard</Link></li>
                <li><Link href="/admin">Admin Access</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Australian Bioenergy Feedstock Institute. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
