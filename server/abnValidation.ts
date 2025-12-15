/**
 * ABN Validation Utility
 * Integrates with Australian Business Register (ABR) API for ABN lookup
 */

interface ABRResponse {
  success: boolean;
  entityName?: string;
  businessName?: string;
  abn?: string;
  acn?: string;
  abnStatus?: string;
  gstRegistered?: boolean;
  addressState?: string;
  addressPostcode?: string;
  entityType?: string;
  message?: string;
}

/**
 * Validates ABN checksum using the official algorithm
 * @param abn - 11-digit ABN string
 * @returns true if checksum is valid
 */
export function validateABNChecksum(abn: string): boolean {
  if (!/^\d{11}$/.test(abn)) return false;

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = abn.split("").map(Number);

  // Subtract 1 from the first digit
  digits[0] = digits[0] - 1;

  // Multiply each digit by its weight and sum
  const sum = digits.reduce(
    (acc, digit, index) => acc + digit * weights[index],
    0
  );

  // Valid if sum is divisible by 89
  return sum % 89 === 0;
}

/**
 * Calls ABR API to lookup ABN details
 * Requires ABR_GUID environment variable
 * @param abn - 11-digit ABN string
 * @returns ABR response with company details
 */
export async function lookupABN(abn: string): Promise<ABRResponse> {
  // Validate format first
  if (!validateABNChecksum(abn)) {
    return {
      success: false,
      message: "Invalid ABN checksum",
    };
  }

  const abrGuid = process.env.ABR_GUID;

  // If no GUID configured, return basic validation only
  if (!abrGuid) {
    return {
      success: true,
      abn,
      message:
        "ABN format valid. ABR API key not configured - please enter company name manually.",
    };
  }

  try {
    // Call ABR JSON API
    const url = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${abn}&guid=${abrGuid}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`ABR API returned ${response.status}`);
    }

    const text = await response.text();

    // ABR returns JSONP, need to extract JSON
    const jsonMatch = text.match(/callback\((.*)\)/);
    if (!jsonMatch) {
      throw new Error("Invalid ABR response format");
    }

    const data = JSON.parse(jsonMatch[1]);

    // Check if ABN is active
    if (data.AbnStatus !== "Active") {
      return {
        success: false,
        message: `ABN is ${data.AbnStatus}. Please use an active ABN.`,
      };
    }

    // Extract business names (may be array)
    let businessName = "";
    if (data.BusinessName && Array.isArray(data.BusinessName)) {
      businessName = data.BusinessName[0] || "";
    } else if (typeof data.BusinessName === "string") {
      businessName = data.BusinessName;
    }

    return {
      success: true,
      abn: data.Abn,
      acn: data.Acn,
      entityName: data.EntityName,
      businessName,
      abnStatus: data.AbnStatus,
      gstRegistered: !!data.Gst,
      addressState: data.AddressState,
      addressPostcode: data.AddressPostcode,
      entityType: data.EntityTypeName,
    };
  } catch (error) {
    console.error("ABR API error:", error);
    return {
      success: true, // Still allow registration
      abn,
      message:
        "ABN format valid. Could not retrieve company details from ABR - please enter manually.",
    };
  }
}
