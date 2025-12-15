/**
 * PDF Export Utility for Radius Analysis Reports
 * Generates professional PDF reports with map screenshots and analysis data
 */

import type { AnalysisResults } from "./radiusAnalysis";

export interface PDFExportOptions {
  analysisResults: AnalysisResults;
  radiusKm: number;
  centerCoords: [number, number];
  mapScreenshot?: string; // Base64 encoded image
  projectName?: string;
}

/**
 * Generate PDF report for radius analysis
 * Uses browser's built-in print functionality with custom styling
 */
export async function exportAnalysisAsPDF(options: PDFExportOptions) {
  const {
    analysisResults,
    radiusKm,
    centerCoords,
    mapScreenshot,
    projectName = "Site Assessment",
  } = options;

  // Create a hidden container for the PDF content
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 210mm;
    height: 297mm;
    background: white;
    z-index: 9999;
    overflow: hidden;
    font-family: Arial, sans-serif;
  `;

  // Build HTML content for PDF
  container.innerHTML = `
    <style>
      @media print {
        body * {
          visibility: hidden;
        }
        #pdf-content, #pdf-content * {
          visibility: visible;
        }
        #pdf-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        @page {
          size: A4;
          margin: 20mm;
        }
      }
      .pdf-header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 3px solid #1B4332;
        margin-bottom: 20px;
      }
      .pdf-title {
        font-size: 24px;
        font-weight: bold;
        color: #1B4332;
        margin: 0;
      }
      .pdf-subtitle {
        font-size: 14px;
        color: #666;
        margin: 5px 0 0 0;
      }
      .pdf-section {
        margin: 20px 0;
        page-break-inside: avoid;
      }
      .pdf-section-title {
        font-size: 16px;
        font-weight: bold;
        color: #1B4332;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 2px solid #D4A853;
      }
      .pdf-map {
        width: 100%;
        max-height: 300px;
        object-fit: contain;
        border: 1px solid #ddd;
        margin: 10px 0;
      }
      .pdf-table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
      }
      .pdf-table th {
        background-color: #1B4332;
        color: white;
        padding: 8px;
        text-align: left;
        font-size: 12px;
      }
      .pdf-table td {
        padding: 8px;
        border-bottom: 1px solid #ddd;
        font-size: 11px;
      }
      .pdf-table tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .feasibility-badge {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 18px;
      }
      .feasibility-excellent {
        background-color: #10b981;
        color: white;
      }
      .feasibility-good {
        background-color: #3b82f6;
        color: white;
      }
      .feasibility-moderate {
        background-color: #f59e0b;
        color: white;
      }
      .feasibility-limited {
        background-color: #ef4444;
        color: white;
      }
      .pdf-footer {
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
        font-size: 10px;
        color: #666;
        text-align: center;
      }
      .recommendations {
        background-color: #f0f9ff;
        padding: 15px;
        border-left: 4px solid #3b82f6;
        margin: 15px 0;
      }
      .recommendations ul {
        margin: 10px 0;
        padding-left: 20px;
      }
      .recommendations li {
        margin: 5px 0;
        font-size: 12px;
      }
    </style>
    <div id="pdf-content">
      <!-- Header -->
      <div class="pdf-header">
        <h1 class="pdf-title">ABFI Feedstock Supply Chain Analysis</h1>
        <p class="pdf-subtitle">${projectName} - ${radiusKm}km Radius Assessment</p>
        <p class="pdf-subtitle">Generated: ${new Date().toLocaleDateString(
          "en-AU",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}</p>
      </div>

      <!-- Location Details -->
      <div class="pdf-section">
        <h2 class="pdf-section-title">1. Location Details</h2>
        <table class="pdf-table">
          <tr>
            <td><strong>Center Coordinates:</strong></td>
            <td>${centerCoords[1].toFixed(4)}°S, ${centerCoords[0].toFixed(4)}°E</td>
          </tr>
          <tr>
            <td><strong>Analysis Radius:</strong></td>
            <td>${radiusKm} km</td>
          </tr>
          <tr>
            <td><strong>Analysis Area:</strong></td>
            <td>${(Math.PI * radiusKm * radiusKm).toFixed(0)} km²</td>
          </tr>
        </table>
      </div>

      ${
        mapScreenshot
          ? `
      <!-- Map Screenshot -->
      <div class="pdf-section">
        <h2 class="pdf-section-title">2. Geographic Context</h2>
        <img src="${mapScreenshot}" alt="Map" class="pdf-map" />
      </div>
      `
          : ""
      }

      <!-- Feasibility Score -->
      <div class="pdf-section">
        <h2 class="pdf-section-title">3. Supply Chain Feasibility Assessment</h2>
        <div style="text-align: center; margin: 20px 0;">
          <span class="feasibility-badge feasibility-${
            analysisResults.feasibilityScore >= 75
              ? "excellent"
              : analysisResults.feasibilityScore >= 60
                ? "good"
                : analysisResults.feasibilityScore >= 40
                  ? "moderate"
                  : "limited"
          }">
            ${analysisResults.feasibilityScore}/100
          </span>
          <p style="margin-top: 10px; font-size: 14px; color: #666;">
            ${
              analysisResults.feasibilityScore >= 75
                ? "Excellent - Strong supply chain infrastructure"
                : analysisResults.feasibilityScore >= 60
                  ? "Good - Adequate supply chain support"
                  : analysisResults.feasibilityScore >= 40
                    ? "Moderate - Some infrastructure gaps"
                    : "Limited - Significant infrastructure development needed"
            }
          </p>
        </div>
      </div>

      <!-- Facilities Count -->
      <div class="pdf-section">
        <h2 class="pdf-section-title">4. Facilities Within Radius</h2>
        <table class="pdf-table">
          <thead>
            <tr>
              <th>Facility Type</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sugar Mills</td>
              <td>${analysisResults.facilities.sugarMills}</td>
            </tr>
            <tr>
              <td>Biogas Facilities</td>
              <td>${analysisResults.facilities.biogasFacilities}</td>
            </tr>
            <tr>
              <td>Biofuel Plants</td>
              <td>${analysisResults.facilities.biofuelPlants}</td>
            </tr>
            <tr>
              <td>Ports</td>
              <td>${analysisResults.facilities.ports}</td>
            </tr>
            <tr>
              <td>Grain Hubs</td>
              <td>${analysisResults.facilities.grainHubs}</td>
            </tr>
            <tr style="font-weight: bold; background-color: #f3f4f6;">
              <td>Total Facilities</td>
              <td>${Object.values(analysisResults.facilities).reduce((a, b) => a + b, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Feedstock Availability -->
      <div class="pdf-section">
        <h2 class="pdf-section-title">5. Estimated Annual Feedstock Availability</h2>
        <table class="pdf-table">
          <thead>
            <tr>
              <th>Feedstock Type</th>
              <th>Annual Tonnes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bagasse (Sugar Cane Residue)</td>
              <td>${analysisResults.feedstockTonnes.bagasse.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Grain Stubble</td>
              <td>${analysisResults.feedstockTonnes.grainStubble.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Forestry Residue</td>
              <td>${analysisResults.feedstockTonnes.forestryResidue.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Biogas (Organic Waste)</td>
              <td>${analysisResults.feedstockTonnes.biogas.toLocaleString()}</td>
            </tr>
            <tr style="font-weight: bold; background-color: #f3f4f6;">
              <td>Total Annual Feedstock</td>
              <td>${analysisResults.feedstockTonnes.total.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Transport Infrastructure -->
      ${
        analysisResults.infrastructure.ports.length > 0 ||
        analysisResults.infrastructure.railLines.length > 0
          ? `
      <div class="pdf-section">
        <h2 class="pdf-section-title">6. Transport Infrastructure</h2>
        ${
          analysisResults.infrastructure.ports.length > 0
            ? `
        <p><strong>Ports:</strong> ${analysisResults.infrastructure.ports.join(", ")}</p>
        `
            : ""
        }
        ${
          analysisResults.infrastructure.railLines.length > 0
            ? `
        <p><strong>Rail Lines:</strong> ${analysisResults.infrastructure.railLines.join(", ")}</p>
        `
            : ""
        }
      </div>
      `
          : ""
      }

      <!-- Recommendations -->
      <div class="pdf-section">
        <h2 class="pdf-section-title">7. Recommendations</h2>
        <div class="recommendations">
          <ul>
            ${analysisResults.recommendations.map(rec => `<li>${rec}</li>`).join("")}
          </ul>
        </div>
      </div>

      <!-- Footer -->
      <div class="pdf-footer">
        <p>Australian Biofuel Feedstock Intelligence (ABFI) Platform</p>
        <p>This report is generated based on publicly available data and should be verified with local suppliers.</p>
        <p>For more information, visit the ABFI platform or contact your regional bioenergy coordinator.</p>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Wait for images to load
  await new Promise(resolve => setTimeout(resolve, 500));

  // Trigger print dialog
  window.print();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(container);
  }, 1000);
}

/**
 * Capture map screenshot as base64 image
 * This should be called from the component with access to the Mapbox map instance
 */
export function captureMapScreenshot(map: any): Promise<string> {
  return new Promise(resolve => {
    const canvas = map.getCanvas();
    const dataUrl = canvas.toDataURL("image/png");
    resolve(dataUrl);
  });
}
