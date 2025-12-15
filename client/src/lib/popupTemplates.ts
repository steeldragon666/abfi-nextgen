// Layer-specific popup templates for FeedstockMap

export function createPopupHTML(layerId: string, props: any): string {
  switch (layerId) {
    case "sugar-mills":
      return `
        <div class="p-3 min-w-[280px]">
          <h3 class="font-bold text-lg mb-3 text-primary border-b pb-2">${props?.name || "Unknown Mill"}</h3>
          <div class="space-y-1.5 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Location:</span>
              <span class="font-medium">${props?.town || "N/A"}, ${props?.state || "N/A"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Owner:</span>
              <span class="font-medium">${props?.owner || "N/A"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Region:</span>
              <span class="font-medium">${props?.region || "N/A"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Crushing Capacity:</span>
              <span class="font-medium">${parseInt(props?.crushing_capacity_tonnes || 0).toLocaleString()} t/season</span>
            </div>
            ${
              props?.cogeneration_mw
                ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Cogeneration:</span>
              <span class="font-medium">${props.cogeneration_mw} MW</span>
            </div>
            `
                : ""
            }
            ${
              props?.bagasse_production_tonnes
                ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Bagasse Production:</span>
              <span class="font-medium">${parseInt(props.bagasse_production_tonnes).toLocaleString()} t/yr</span>
            </div>
            `
                : ""
            }
            ${
              props?.grid_export
                ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Grid Export:</span>
              <span class="font-medium text-green-600">✓ Yes</span>
            </div>
            `
                : ""
            }
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="px-2 py-0.5 rounded text-xs font-medium ${props?.status === "operational" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}">${props?.status || "unknown"}</span>
            </div>
          </div>
        </div>
      `;

    case "grain-regions":
      return `
        <div class="p-3 min-w-[280px]">
          <h3 class="font-bold text-lg mb-3 text-primary border-b pb-2">${props?.name || "Unknown Region"}</h3>
          <div class="space-y-1.5 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">State:</span>
              <span class="font-medium">${props?.state || "N/A"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Primary Crops:</span>
              <span class="font-medium">${props?.primary_crops || "N/A"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Area:</span>
              <span class="font-medium">${parseInt(props?.area_hectares || 0).toLocaleString()} ha</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Stubble Production:</span>
              <span class="font-medium">${parseInt(props?.stubble_production_tonnes || 0).toLocaleString()} t/yr</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Sustainable Removal:</span>
              <span class="font-medium text-green-600">${parseInt(props?.sustainable_removal_tonnes || 0).toLocaleString()} t/yr</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Density:</span>
              <span class="font-medium">${props?.density_tonnes_per_ha || 0} t/ha</span>
            </div>
            ${
              props?.harvest_months
                ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Harvest Season:</span>
              <span class="font-medium">${props.harvest_months}</span>
            </div>
            `
                : ""
            }
          </div>
        </div>
      `;

    case "forestry-regions":
      if (props?.type === "forestry_facility") {
        return `
          <div class="p-3 min-w-[280px]">
            <h3 class="font-bold text-lg mb-3 text-primary border-b pb-2">${props?.name || "Unknown Facility"}</h3>
            <div class="space-y-1.5 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium capitalize">${(props?.facility_type || "N/A").replace(/_/g, " ")}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Location:</span>
                <span class="font-medium">${props?.town || "N/A"}, ${props?.state || "N/A"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Region:</span>
                <span class="font-medium">${props?.region || "N/A"}</span>
              </div>
              ${
                props?.managed_hectares
                  ? `
              <div class="flex justify-between">
                <span class="text-gray-600">Managed Area:</span>
                <span class="font-medium">${parseInt(props.managed_hectares).toLocaleString()} ha</span>
              </div>
              `
                  : ""
              }
              ${
                props?.annual_output_tonnes
                  ? `
              <div class="flex justify-between">
                <span class="text-gray-600">Annual Output:</span>
                <span class="font-medium">${parseInt(props.annual_output_tonnes).toLocaleString()} t/yr</span>
              </div>
              `
                  : ""
              }
              ${
                props?.annual_capacity_gmt
                  ? `
              <div class="flex justify-between">
                <span class="text-gray-600">Capacity:</span>
                <span class="font-medium">${parseFloat(props.annual_capacity_gmt).toLocaleString()} GMT/yr</span>
              </div>
              `
                  : ""
              }
            </div>
          </div>
        `;
      } else {
        return `
          <div class="p-3 min-w-[280px]">
            <h3 class="font-bold text-lg mb-3 text-primary border-b pb-2">${props?.name || "Unknown Region"}</h3>
            <div class="space-y-1.5 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">State:</span>
                <span class="font-medium">${props?.state || "N/A"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Area:</span>
                <span class="font-medium">${parseInt(props?.area_hectares || 0).toLocaleString()} ha</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Annual Residue:</span>
                <span class="font-medium">${parseInt(props?.annual_residue_tonnes || 0).toLocaleString()} t/yr</span>
              </div>
              ${
                props?.primary_species
                  ? `
              <div class="flex justify-between">
                <span class="text-gray-600">Primary Species:</span>
                <span class="font-medium">${props.primary_species}</span>
              </div>
              `
                  : ""
              }
              ${
                props?.key_facilities
                  ? `
              <div class="mt-2">
                <span class="text-gray-600 block mb-1">Key Facilities:</span>
                <span class="text-xs">${props.key_facilities}</span>
              </div>
              `
                  : ""
              }
            </div>
          </div>
        `;
      }

    case "biogas-facilities":
      return `
        <div class="p-3 min-w-[280px]">
          <h3 class="font-bold text-lg mb-3 text-primary border-b pb-2">${props?.name || "Unknown Facility"}</h3>
          <div class="space-y-1.5 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Type:</span>
              <span class="font-medium capitalize">${(props?.facility_type || "N/A").replace(/_/g, " ")}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Location:</span>
              <span class="font-medium">${props?.town || "N/A"}, ${props?.state || "N/A"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Feedstock:</span>
              <span class="font-medium capitalize">${props?.feedstock || "N/A"}</span>
            </div>
            ${
              props?.capacity_mw
                ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Capacity:</span>
              <span class="font-medium">${props.capacity_mw} MW</span>
            </div>
            `
                : ""
            }
            ${
              props?.capacity_tonnes_yr
                ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Processing Capacity:</span>
              <span class="font-medium">${parseInt(props.capacity_tonnes_yr).toLocaleString()} t/yr</span>
            </div>
            `
                : ""
            }
            ${
              props?.annual_generation_gwh
                ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Annual Generation:</span>
              <span class="font-medium">${props.annual_generation_gwh} GWh/yr</span>
            </div>
            `
                : ""
            }
            <div class="flex justify-between">
              <span class="text-gray-600">Operator:</span>
              <span class="font-medium">${props?.operator || "N/A"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="px-2 py-0.5 rounded text-xs font-medium ${props?.status === "operational" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}">${props?.status || "unknown"}</span>
            </div>
          </div>
        </div>
      `;

    case "biofuel-plants":
      return `
        <div class="p-3 min-w-[280px]">
          <h3 class="font-bold text-lg mb-3 text-primary border-b pb-2">${props?.name || "Unknown Plant"}</h3>
          <div class="space-y-1.5 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Fuel Type:</span>
              <span class="font-medium capitalize">${props?.fuel_type || "N/A"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Location:</span>
              <span class="font-medium">${props?.town || "N/A"}, ${props?.state || "N/A"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Capacity:</span>
              <span class="font-medium">${props?.capacity_ml_yr || 0} ML/yr</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Feedstock:</span>
              <span class="font-medium capitalize">${props?.feedstock || "N/A"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Operator:</span>
              <span class="font-medium">${props?.operator || "N/A"}</span>
            </div>
            ${
              props?.year_commissioned
                ? `
            <div class="flex justify-between">
              <span class="text-gray-600">Commissioned:</span>
              <span class="font-medium">${props.year_commissioned}</span>
            </div>
            `
                : ""
            }
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="px-2 py-0.5 rounded text-xs font-medium ${props?.status === "operational" ? "bg-green-100 text-green-800" : props?.status === "pilot" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}">${props?.status || "unknown"}</span>
            </div>
          </div>
        </div>
      `;

    case "transport-ports":
      if (props?.infrastructure_type === "port") {
        return `
          <div class="p-3 min-w-[280px]">
            <h3 class="font-bold text-lg mb-3 text-primary border-b pb-2">${props?.name || "Unknown Port"}</h3>
            <div class="space-y-1.5 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium">Port</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Location:</span>
                <span class="font-medium">${props?.town || "N/A"}, ${props?.state || "N/A"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Annual Throughput:</span>
                <span class="font-medium">${parseFloat(props?.annual_throughput_mt || 0).toLocaleString()} MT/yr</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Bulk Handling:</span>
                <span class="font-medium">${props?.bulk_handling ? "✓ Yes" : "✗ No"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Container Terminal:</span>
                <span class="font-medium">${props?.container_terminal ? "✓ Yes" : "✗ No"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Rail Connected:</span>
                <span class="font-medium">${props?.rail_connected ? "✓ Yes" : "✗ No"}</span>
              </div>
              ${
                props?.woodchip_terminal
                  ? `
              <div class="flex justify-between">
                <span class="text-gray-600">Woodchip Terminal:</span>
                <span class="font-medium text-green-600">✓ Yes</span>
              </div>
              `
                  : ""
              }
            </div>
          </div>
        `;
      } else if (props?.infrastructure_type === "grain_hub") {
        return `
          <div class="p-3 min-w-[280px]">
            <h3 class="font-bold text-lg mb-3 text-primary border-b pb-2">${props?.name || "Unknown Grain Hub"}</h3>
            <div class="space-y-1.5 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium">Grain Hub</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Location:</span>
                <span class="font-medium">${props?.town || "N/A"}, ${props?.state || "N/A"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Storage Capacity:</span>
                <span class="font-medium">${parseInt(props?.storage_capacity_tonnes || 0).toLocaleString()} tonnes</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Rail Connected:</span>
                <span class="font-medium">${props?.rail_connected ? "✓ Yes" : "✗ No"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Road Access:</span>
                <span class="font-medium capitalize">${props?.road_access || "N/A"}</span>
              </div>
            </div>
          </div>
        `;
      } else if (props?.infrastructure_type === "rail_line") {
        return `
          <div class="p-3 min-w-[280px]">
            <h3 class="font-bold text-lg mb-3 text-primary border-b pb-2">${props?.name || "Unknown Rail Line"}</h3>
            <div class="space-y-1.5 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium">Rail Line</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">State:</span>
                <span class="font-medium">${props?.state || "N/A"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Gauge:</span>
                <span class="font-medium capitalize">${props?.gauge || "N/A"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Freight Capacity:</span>
                <span class="font-medium capitalize">${props?.freight_capacity || "N/A"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Electrified:</span>
                <span class="font-medium">${props?.electrified ? "✓ Yes" : "✗ No"}</span>
              </div>
            </div>
          </div>
        `;
      }
      return `<div class="p-2"><h3 class="font-bold">${props?.name || "Unknown Infrastructure"}</h3></div>`;

    default:
      return `
        <div class="p-2">
          <h3 class="font-bold text-lg mb-2">${props?.name || "Unknown"}</h3>
          <p class="text-sm"><strong>Type:</strong> ${props?.type || "N/A"}</p>
          <p class="text-sm"><strong>State:</strong> ${props?.state || "N/A"}</p>
        </div>
      `;
  }
}
