import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Check, Copy, Shield, FileCheck, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CertificateVerification() {
  const [activeTab, setActiveTab] = useState("verify");
  const [certificateId, setCertificateId] = useState("");
  const [computedHash, setComputedHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Generate SHA-256 hash from input data
  const generateHash = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleGenerateHash = async () => {
    if (!certificateId) return;

    // In real implementation, fetch certificate data from backend
    const mockCertificateData = JSON.stringify({
      id: certificateId,
      supplier: "Queensland Bioenergy Pty Ltd",
      feedstock: "Bagasse",
      quantity: 5000,
      date: "2024-12-13",
      verified: true,
    });

    const hash = await generateHash(mockCertificateData);
    setComputedHash(hash);
  };

  const handleVerifyHash = async () => {
    if (!computedHash) return;

    // Mock verification - in real implementation, call backend API
    setVerificationResult({
      valid: true,
      certificateId: certificateId,
      supplier: "Queensland Bioenergy Pty Ltd",
      feedstock: "Bagasse (Sugarcane)",
      quantity: "5,000 tonnes",
      issueDate: "2024-12-13",
      verifiedBy: "ABFI Platform",
      status: "Active",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f14] text-white">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-96 h-96 bg-green-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[10%] w-96 h-96 bg-[#c9a962]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12 pb-8 border-b border-[#c9a962]/15">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-[#c9a962] to-[#8a7443] rounded-xl flex items-center justify-center">
              <span className="font-serif text-xl text-[#0a0f14]">B</span>
            </div>
            <h1 className="font-serif text-3xl">
              BioFeed<span className="text-[#c9a962]">AU</span>
            </h1>
          </div>

          <div className="inline-block bg-green-500/15 text-green-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
            🔒 Blockchain Verified
          </div>

          <h2 className="font-serif text-3xl mb-3">
            Certificate Validation & Immutable Records
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Verify certificate authenticity using cryptographic hashing and
            blockchain-anchored records. All certificates are tamper-proof and
            independently auditable.
          </p>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-[#111820] border border-[#c9a962]/15">
            <TabsTrigger
              value="verify"
              className="data-[state=active]:bg-[#c9a962] data-[state=active]:text-[#0a0f14]"
            >
              <Shield className="w-4 h-4 mr-2" />
              Verify Certificate
            </TabsTrigger>
            <TabsTrigger
              value="generate"
              className="data-[state=active]:bg-[#c9a962] data-[state=active]:text-[#0a0f14]"
            >
              <Hash className="w-4 h-4 mr-2" />
              Generate Hash
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="data-[state=active]:bg-[#c9a962] data-[state=active]:text-[#0a0f14]"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          {/* Verify Certificate Tab */}
          <TabsContent value="verify" className="mt-6">
            <Card className="bg-[#111820] border-[#c9a962]/15">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Verify Certificate by Hash
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter a certificate hash to verify its authenticity and view
                  details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="verifyHash"
                    className="text-xs uppercase tracking-wide text-gray-400"
                  >
                    Certificate Hash (SHA-256)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="verifyHash"
                      value={computedHash}
                      onChange={e => setComputedHash(e.target.value)}
                      placeholder="Enter 64-character SHA-256 hash..."
                      className="bg-[#1a222d] border-[#c9a962]/20 font-mono text-sm flex-1"
                    />
                    <Button
                      onClick={handleVerifyHash}
                      className="bg-gradient-to-r from-[#c9a962] to-[#8a7443] text-[#0a0f14] hover:opacity-90"
                    >
                      Verify
                    </Button>
                  </div>
                </div>

                {verificationResult && (
                  <div className="bg-[#0a0f14] border border-green-500/30 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-green-500/20">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-400">
                          Certificate Verified
                        </h3>
                        <p className="text-xs text-gray-400">
                          This certificate is authentic and has not been
                          tampered with
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Certificate ID
                        </p>
                        <p className="font-mono text-sm text-white">
                          {verificationResult.certificateId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Status
                        </p>
                        <span className="inline-block bg-green-500/15 text-green-400 px-2 py-1 rounded text-xs font-semibold">
                          {verificationResult.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Supplier
                        </p>
                        <p className="text-sm text-white">
                          {verificationResult.supplier}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Feedstock Type
                        </p>
                        <p className="text-sm text-white">
                          {verificationResult.feedstock}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Quantity
                        </p>
                        <p className="text-sm text-white">
                          {verificationResult.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Issue Date
                        </p>
                        <p className="text-sm text-white">
                          {verificationResult.issueDate}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-green-500/20">
                      <p className="text-xs text-gray-400 mb-2">Verified by</p>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#c9a962]" />
                        <span className="text-sm font-semibold text-[#c9a962]">
                          {verificationResult.verifiedBy}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Hash Tab */}
          <TabsContent value="generate" className="mt-6">
            <Card className="bg-[#111820] border-[#c9a962]/15">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Generate Certificate Hash
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Generate a cryptographic hash for a certificate to ensure
                  immutability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="certId"
                    className="text-xs uppercase tracking-wide text-gray-400"
                  >
                    Certificate ID
                  </Label>
                  <Input
                    id="certId"
                    value={certificateId}
                    onChange={e => setCertificateId(e.target.value)}
                    placeholder="e.g., CERT-2024-001234"
                    className="bg-[#1a222d] border-[#c9a962]/20"
                  />
                </div>

                <Button
                  onClick={handleGenerateHash}
                  className="w-full bg-gradient-to-r from-[#c9a962] to-[#8a7443] text-[#0a0f14] hover:opacity-90"
                >
                  <Hash className="w-4 h-4 mr-2" />
                  Generate Hash
                </Button>

                {computedHash && (
                  <div className="bg-[#0a0f14] border border-[#c9a962]/30 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                        SHA-256 Hash
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-[#c9a962]/15 text-[#c9a962] px-2 py-1 rounded text-xs font-mono">
                          <Hash className="w-3 h-3" />
                          SHA-256
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#111820] border border-[#c9a962]/15 rounded-lg p-4 mb-3">
                      <p className="font-mono text-xs text-gray-300 break-all leading-relaxed">
                        {computedHash}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(computedHash)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-[#c9a962]/30 text-white hover:bg-[#c9a962]/10"
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        {copied ? "Copied!" : "Copy Hash"}
                      </Button>
                      <Button
                        onClick={handleVerifyHash}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
                      >
                        <Shield className="w-3 h-3 mr-2" />
                        Verify Now
                      </Button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#c9a962]/15">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        <strong className="text-gray-400">Note:</strong> This
                        hash is a cryptographic fingerprint of the certificate
                        data. Any modification to the certificate will result in
                        a completely different hash, ensuring tamper-proof
                        verification.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="mt-6">
            <Card className="bg-[#111820] border-[#c9a962]/15">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Blockchain Audit Trail
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View the complete history of certificate verification events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      action: "Certificate Issued",
                      timestamp: "2024-12-13 10:30:15",
                      hash: "a3f8...92c1",
                      status: "success",
                    },
                    {
                      action: "Hash Generated",
                      timestamp: "2024-12-13 10:30:16",
                      hash: "a3f8...92c1",
                      status: "success",
                    },
                    {
                      action: "Blockchain Anchor",
                      timestamp: "2024-12-13 10:31:02",
                      hash: "a3f8...92c1",
                      status: "success",
                    },
                    {
                      action: "Verification Request",
                      timestamp: "2024-12-13 14:22:45",
                      hash: "a3f8...92c1",
                      status: "success",
                    },
                  ].map((event, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0a0f14] border border-[#c9a962]/15 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            event.status === "success"
                              ? "bg-green-500/20"
                              : "bg-gray-500/20"
                          }`}
                        >
                          <Check
                            className={`w-4 h-4 ${event.status === "success" ? "text-green-400" : "text-gray-400"}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {event.action}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {event.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Hash</p>
                        <p className="font-mono text-xs text-[#c9a962]">
                          {event.hash}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileCheck className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-300 mb-1">
                        Immutability Guarantee
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        All certificate hashes are anchored to a public
                        blockchain, creating an immutable audit trail. Once
                        recorded, the data cannot be altered or deleted,
                        ensuring permanent proof of authenticity.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-[#111820] border border-[#c9a962]/15 rounded-xl p-5">
            <div className="w-10 h-10 bg-[#c9a962]/15 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-[#c9a962]" />
            </div>
            <h3 className="font-semibold text-white mb-2">Tamper-Proof</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cryptographic hashing ensures any modification to certificate data
              is immediately detectable
            </p>
          </div>

          <div className="bg-[#111820] border border-[#c9a962]/15 rounded-xl p-5">
            <div className="w-10 h-10 bg-green-500/15 rounded-lg flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">
              Blockchain Anchored
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Certificate hashes are permanently recorded on public blockchain
              for independent verification
            </p>
          </div>

          <div className="bg-[#111820] border border-[#c9a962]/15 rounded-xl p-5">
            <div className="w-10 h-10 bg-blue-500/15 rounded-lg flex items-center justify-center mb-3">
              <Hash className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">SHA-256 Standard</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Industry-standard cryptographic algorithm used by banks and
              governments worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
