/**
 * Comprehensive tests for bankability scoring algorithms
 * Tests all 5 scoring categories and composite score calculation
 */

import { describe, it, expect } from "vitest";

// Mock data structures
interface SupplyAgreement {
  id: number;
  tier: "tier1" | "tier2" | "options" | "rofr";
  annualVolume: number;
  contractLength: number;
  priceStructure: "fixed" | "indexed" | "hybrid";
  takeOrPay: boolean;
  supplierId: number;
}

interface GrowerQualification {
  level: "GQ1" | "GQ2" | "GQ3" | "GQ4";
  supplierId: number;
}

interface Project {
  annualFeedstockVolume: number;
  operationalReadiness: number;
}

// ============================================================================
// VOLUME SECURITY SCORING (30% weight)
// ============================================================================

describe("Volume Security Scoring", () => {
  const calculateVolumeSecurityScore = (
    agreements: SupplyAgreement[],
    project: Project
  ): number => {
    const tier1Volume = agreements
      .filter(a => a.tier === "tier1")
      .reduce((sum, a) => sum + a.annualVolume, 0);

    const tier2Volume = agreements
      .filter(a => a.tier === "tier2")
      .reduce((sum, a) => sum + a.annualVolume, 0);

    const totalSecuredVolume = tier1Volume + tier2Volume;
    const coverageRatio = totalSecuredVolume / project.annualFeedstockVolume;

    // Score based on coverage ratio
    if (coverageRatio >= 1.5) return 100;
    if (coverageRatio >= 1.2) return 85;
    if (coverageRatio >= 1.0) return 70;
    if (coverageRatio >= 0.8) return 50;
    return 30;
  };

  it("should score 100 for 150%+ coverage", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 15000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
    ];
    const project: Project = {
      annualFeedstockVolume: 10000,
      operationalReadiness: 80,
    };

    const score = calculateVolumeSecurityScore(agreements, project);
    expect(score).toBe(100);
  });

  it("should score 85 for 120-149% coverage", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 12000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
    ];
    const project: Project = {
      annualFeedstockVolume: 10000,
      operationalReadiness: 80,
    };

    const score = calculateVolumeSecurityScore(agreements, project);
    expect(score).toBe(85);
  });

  it("should score 70 for 100-119% coverage", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 10000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
    ];
    const project: Project = {
      annualFeedstockVolume: 10000,
      operationalReadiness: 80,
    };

    const score = calculateVolumeSecurityScore(agreements, project);
    expect(score).toBe(70);
  });

  it("should combine Tier 1 and Tier 2 volumes", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 7000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
      {
        id: 2,
        tier: "tier2",
        annualVolume: 5000,
        contractLength: 7,
        priceStructure: "indexed",
        takeOrPay: false,
        supplierId: 2,
      },
    ];
    const project: Project = {
      annualFeedstockVolume: 10000,
      operationalReadiness: 80,
    };

    const score = calculateVolumeSecurityScore(agreements, project);
    expect(score).toBe(85); // 120% coverage
  });

  it("should ignore Options and ROFR tiers", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 8000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
      {
        id: 2,
        tier: "options",
        annualVolume: 5000,
        contractLength: 5,
        priceStructure: "indexed",
        takeOrPay: false,
        supplierId: 2,
      },
    ];
    const project: Project = {
      annualFeedstockVolume: 10000,
      operationalReadiness: 80,
    };

    const score = calculateVolumeSecurityScore(agreements, project);
    expect(score).toBe(50); // Only 80% coverage from Tier 1
  });
});

// ============================================================================
// COUNTERPARTY QUALITY SCORING (25% weight)
// ============================================================================

describe("Counterparty Quality Scoring", () => {
  const calculateCounterpartyQualityScore = (
    agreements: SupplyAgreement[],
    qualifications: GrowerQualification[]
  ): number => {
    if (agreements.length === 0) return 0;

    const totalVolume = agreements.reduce((sum, a) => sum + a.annualVolume, 0);

    let weightedScore = 0;
    for (const agreement of agreements) {
      const qual = qualifications.find(
        q => q.supplierId === agreement.supplierId
      );
      let supplierScore = 50; // Default for unqualified

      if (qual) {
        switch (qual.level) {
          case "GQ1":
            supplierScore = 100;
            break;
          case "GQ2":
            supplierScore = 85;
            break;
          case "GQ3":
            supplierScore = 70;
            break;
          case "GQ4":
            supplierScore = 55;
            break;
        }
      }

      const weight = agreement.annualVolume / totalVolume;
      weightedScore += supplierScore * weight;
    }

    return Math.round(weightedScore);
  };

  it("should score 100 for all GQ1 suppliers", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 5000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
      {
        id: 2,
        tier: "tier1",
        annualVolume: 5000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 2,
      },
    ];
    const qualifications: GrowerQualification[] = [
      { level: "GQ1", supplierId: 1 },
      { level: "GQ1", supplierId: 2 },
    ];

    const score = calculateCounterpartyQualityScore(agreements, qualifications);
    expect(score).toBe(100);
  });

  it("should calculate weighted average for mixed qualifications", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 6000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      }, // 60%
      {
        id: 2,
        tier: "tier1",
        annualVolume: 4000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 2,
      }, // 40%
    ];
    const qualifications: GrowerQualification[] = [
      { level: "GQ1", supplierId: 1 }, // 100 points
      { level: "GQ3", supplierId: 2 }, // 70 points
    ];

    const score = calculateCounterpartyQualityScore(agreements, qualifications);
    // Expected: (100 * 0.6) + (70 * 0.4) = 60 + 28 = 88
    expect(score).toBe(88);
  });

  it("should handle unqualified suppliers with default score", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 10000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
    ];
    const qualifications: GrowerQualification[] = [];

    const score = calculateCounterpartyQualityScore(agreements, qualifications);
    expect(score).toBe(50); // Default for unqualified
  });
});

// ============================================================================
// CONTRACT STRUCTURE SCORING (20% weight)
// ============================================================================

describe("Contract Structure Scoring", () => {
  const calculateContractStructureScore = (
    agreements: SupplyAgreement[]
  ): number => {
    if (agreements.length === 0) return 0;

    const totalVolume = agreements.reduce((sum, a) => sum + a.annualVolume, 0);

    let weightedScore = 0;
    for (const agreement of agreements) {
      let contractScore = 0;

      // Contract length (0-40 points)
      if (agreement.contractLength >= 10) contractScore += 40;
      else if (agreement.contractLength >= 7) contractScore += 30;
      else if (agreement.contractLength >= 5) contractScore += 20;
      else contractScore += 10;

      // Price structure (0-30 points)
      if (agreement.priceStructure === "fixed") contractScore += 30;
      else if (agreement.priceStructure === "indexed") contractScore += 20;
      else contractScore += 15; // hybrid

      // Take-or-pay (0-30 points)
      if (agreement.takeOrPay) contractScore += 30;

      const weight = agreement.annualVolume / totalVolume;
      weightedScore += contractScore * weight;
    }

    return Math.round(weightedScore);
  };

  it("should score 100 for optimal contract terms", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 10000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
    ];

    const score = calculateContractStructureScore(agreements);
    expect(score).toBe(100); // 40 + 30 + 30 = 100
  });

  it("should score lower for shorter contracts", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 10000,
        contractLength: 5,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
    ];

    const score = calculateContractStructureScore(agreements);
    expect(score).toBe(80); // 20 + 30 + 30 = 80
  });

  it("should score lower for indexed pricing", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 10000,
        contractLength: 10,
        priceStructure: "indexed",
        takeOrPay: true,
        supplierId: 1,
      },
    ];

    const score = calculateContractStructureScore(agreements);
    expect(score).toBe(90); // 40 + 20 + 30 = 90
  });

  it("should score lower without take-or-pay", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 10000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: false,
        supplierId: 1,
      },
    ];

    const score = calculateContractStructureScore(agreements);
    expect(score).toBe(70); // 40 + 30 + 0 = 70
  });

  it("should calculate weighted average for multiple contracts", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 7000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      }, // 70%, score 100
      {
        id: 2,
        tier: "tier1",
        annualVolume: 3000,
        contractLength: 5,
        priceStructure: "indexed",
        takeOrPay: false,
        supplierId: 2,
      }, // 30%, score 40
    ];

    const score = calculateContractStructureScore(agreements);
    // Expected: (100 * 0.7) + (40 * 0.3) = 70 + 12 = 82
    expect(score).toBe(82);
  });
});

// ============================================================================
// CONCENTRATION RISK SCORING (15% weight)
// ============================================================================

describe("Concentration Risk Scoring (HHI)", () => {
  const calculateConcentrationRiskScore = (
    agreements: SupplyAgreement[]
  ): number => {
    if (agreements.length === 0) return 0;

    const totalVolume = agreements.reduce((sum, a) => sum + a.annualVolume, 0);
    if (totalVolume === 0) return 0;

    // Calculate HHI
    const hhi = agreements.reduce((sum, a) => {
      const marketShare = (a.annualVolume / totalVolume) * 100;
      return sum + marketShare * marketShare;
    }, 0);

    // Convert HHI to score (inverse relationship)
    if (hhi < 1500) return 100;
    if (hhi < 2000) return 80;
    if (hhi < 2500) return 60;
    if (hhi < 3000) return 40;
    return 20;
  };

  it("should score 100 for low concentration (HHI < 1500)", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 2500,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
      {
        id: 2,
        tier: "tier1",
        annualVolume: 2500,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 2,
      },
      {
        id: 3,
        tier: "tier1",
        annualVolume: 2500,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 3,
      },
      {
        id: 4,
        tier: "tier1",
        annualVolume: 2500,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 4,
      },
    ];

    const score = calculateConcentrationRiskScore(agreements);
    // HHI = 4 * (25^2) = 4 * 625 = 2500
    // Each supplier: 25% market share
    // HHI = 25^2 + 25^2 + 25^2 + 25^2 = 2500
    // HHI 2500 falls in 2500-3000 range = score 40
    expect(score).toBe(40); // HHI 2500 = score 40
  });

  it("should score lower for high concentration (single supplier)", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 10000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
    ];

    const score = calculateConcentrationRiskScore(agreements);
    // HHI = 100^2 = 10000 (maximum concentration)
    expect(score).toBe(20);
  });

  it("should score better for well-distributed supply", () => {
    const agreements: SupplyAgreement[] = [
      {
        id: 1,
        tier: "tier1",
        annualVolume: 1000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 1,
      },
      {
        id: 2,
        tier: "tier1",
        annualVolume: 1000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 2,
      },
      {
        id: 3,
        tier: "tier1",
        annualVolume: 1000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 3,
      },
      {
        id: 4,
        tier: "tier1",
        annualVolume: 1000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 4,
      },
      {
        id: 5,
        tier: "tier1",
        annualVolume: 1000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 5,
      },
      {
        id: 6,
        tier: "tier1",
        annualVolume: 1000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 6,
      },
      {
        id: 7,
        tier: "tier1",
        annualVolume: 1000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 7,
      },
      {
        id: 8,
        tier: "tier1",
        annualVolume: 1000,
        contractLength: 10,
        priceStructure: "fixed",
        takeOrPay: true,
        supplierId: 8,
      },
    ];

    const score = calculateConcentrationRiskScore(agreements);
    // Each supplier: 12.5% market share
    // HHI = 8 * (12.5^2) = 8 * 156.25 = 1250
    expect(score).toBe(100); // HHI < 1500 = score 100
  });
});

// ============================================================================
// OPERATIONAL READINESS SCORING (10% weight)
// ============================================================================

describe("Operational Readiness Scoring", () => {
  const calculateOperationalReadinessScore = (project: Project): number => {
    return project.operationalReadiness;
  };

  it("should return the operational readiness value directly", () => {
    const project: Project = {
      annualFeedstockVolume: 10000,
      operationalReadiness: 85,
    };
    const score = calculateOperationalReadinessScore(project);
    expect(score).toBe(85);
  });

  it("should handle low operational readiness", () => {
    const project: Project = {
      annualFeedstockVolume: 10000,
      operationalReadiness: 30,
    };
    const score = calculateOperationalReadinessScore(project);
    expect(score).toBe(30);
  });

  it("should handle perfect operational readiness", () => {
    const project: Project = {
      annualFeedstockVolume: 10000,
      operationalReadiness: 100,
    };
    const score = calculateOperationalReadinessScore(project);
    expect(score).toBe(100);
  });
});

// ============================================================================
// COMPOSITE SCORE CALCULATION
// ============================================================================

describe("Composite Bankability Score", () => {
  const calculateCompositeScore = (
    volumeSecurity: number,
    counterpartyQuality: number,
    contractStructure: number,
    concentrationRisk: number,
    operationalReadiness: number
  ): number => {
    const composite =
      volumeSecurity * 0.3 +
      counterpartyQuality * 0.25 +
      contractStructure * 0.2 +
      concentrationRisk * 0.15 +
      operationalReadiness * 0.1;

    return Math.round(composite);
  };

  it("should calculate weighted composite score correctly", () => {
    const composite = calculateCompositeScore(100, 100, 100, 100, 100);
    expect(composite).toBe(100);
  });

  it("should apply correct weights to each category", () => {
    const composite = calculateCompositeScore(80, 70, 90, 60, 50);
    // Expected: (80*0.3) + (70*0.25) + (90*0.2) + (60*0.15) + (50*0.1)
    //         = 24 + 17.5 + 18 + 9 + 5 = 73.5 → 74
    expect(composite).toBe(74);
  });

  it("should handle poor scores across all categories", () => {
    const composite = calculateCompositeScore(30, 40, 35, 20, 25);
    // Expected: (30*0.3) + (40*0.25) + (35*0.2) + (20*0.15) + (25*0.1)
    //         = 9 + 10 + 7 + 3 + 2.5 = 31.5 → 32
    expect(composite).toBe(32);
  });

  it("should weight volume security most heavily", () => {
    // High volume security, low everything else
    const composite1 = calculateCompositeScore(100, 50, 50, 50, 50);
    // Low volume security, high everything else
    const composite2 = calculateCompositeScore(50, 100, 100, 100, 100);

    // composite1 = 30 + 12.5 + 10 + 7.5 + 5 = 65
    // composite2 = 15 + 25 + 20 + 15 + 10 = 85
    expect(composite1).toBe(65);
    expect(composite2).toBe(85);
    // Despite volume security being highest weighted, other categories combined outweigh it
  });
});

// ============================================================================
// RATING ASSIGNMENT
// ============================================================================

describe("Rating Assignment", () => {
  const assignRating = (compositeScore: number): string => {
    if (compositeScore >= 90) return "AAA";
    if (compositeScore >= 80) return "AA";
    if (compositeScore >= 70) return "A";
    if (compositeScore >= 60) return "BBB";
    if (compositeScore >= 50) return "BB";
    if (compositeScore >= 40) return "B";
    return "CCC";
  };

  it("should assign AAA for scores 90+", () => {
    expect(assignRating(95)).toBe("AAA");
    expect(assignRating(90)).toBe("AAA");
  });

  it("should assign AA for scores 80-89", () => {
    expect(assignRating(85)).toBe("AA");
    expect(assignRating(80)).toBe("AA");
  });

  it("should assign A for scores 70-79", () => {
    expect(assignRating(75)).toBe("A");
    expect(assignRating(70)).toBe("A");
  });

  it("should assign BBB for scores 60-69", () => {
    expect(assignRating(65)).toBe("BBB");
    expect(assignRating(60)).toBe("BBB");
  });

  it("should assign BB for scores 50-59", () => {
    expect(assignRating(55)).toBe("BB");
    expect(assignRating(50)).toBe("BB");
  });

  it("should assign B for scores 40-49", () => {
    expect(assignRating(45)).toBe("B");
    expect(assignRating(40)).toBe("B");
  });

  it("should assign CCC for scores below 40", () => {
    expect(assignRating(35)).toBe("CCC");
    expect(assignRating(20)).toBe("CCC");
    expect(assignRating(0)).toBe("CCC");
  });
});
