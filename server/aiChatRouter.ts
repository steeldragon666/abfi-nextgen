import { Router } from "express";
import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";

export const aiChatRouter = Router();

// System prompt for Sam, the ABFI bioenergy expert
const SYSTEM_PROMPT = `You are Sam, an expert Australian bioenergy feedstock trading assistant for the ABFI Platform.
Answer questions about ethanol, biodiesel, woodchips, bagasse, wheat straw, pricing, supplier certification, carbon intensity, and the ABFI marketplace.
Keep answers under 150 words. Be friendly, professional, and accurate.
Use Australian English spelling and terminology.
If you don't know something specific, say "I'll connect you with our support team for more details."

Key facts about ABFI:
- ABFI has 50+ certified Australian suppliers across all states
- Prices update every 15 minutes from real market data
- All suppliers hold Sustainability Certification (ISCC EU, RED II, FSC, or equivalent)
- Typical quote response time: 24 hours
- Minimum orders vary: 100L for liquids, 1 tonne for solids
- Carbon calculator tracks Scope 1-3 emissions with gCO2e/MJ metrics
- Bankability ratings help lenders assess project viability
- Evidence Vault provides blockchain-verified sustainability documentation

Common user questions:
- Quote requests: Navigate to Supplier Directory, select supplier, click "Request Quote"
- Pricing: Check Price Dashboard for live ethanol, biodiesel, and woodchip prices
- Certifications: Look for gold "Verified" badge on supplier profiles
- Carbon tracking: Use Emissions Calculator for ESG reporting`;

// HeyGen API configuration
const HEYGEN_API_URL = "https://api.heygen.com/v1/video.generate";

interface AIChatRequest {
  question: string;
}

interface AIChatResponse {
  answer: string;
  videoUrl?: string;
}

// Fallback responses when LLM is not available
const FALLBACK_RESPONSES: Record<string, string> = {
  quote:
    "To request a quote, navigate to the Supplier Directory at /supplier-directory, select a supplier you're interested in, and click 'Request Quote'. Fill in your feedstock type, volume, delivery location, and company details. Suppliers typically respond within 24 hours with competitive pricing.",
  certification:
    "All ABFI suppliers must hold valid Sustainability Certification. Look for the gold 'Verified' badge on supplier profiles. Common certifications include ISCC EU for biofuels, RED II compliance, and FSC for forestry products. You can filter suppliers by certification type in the directory.",
  carbon:
    "Carbon intensity is calculated using our Emissions Calculator at /emissions. It factors in feedstock type, transportation distance, and processing methods. Results are reported in gCO2e/MJ, making it easy to compare against fossil fuel alternatives (typically 94 gCO2e/MJ for petrol).",
  price:
    "Check our Price Dashboard at /price-dashboard for live pricing on ethanol, biodiesel, and woodchip. Prices update every 15 minutes from 50+ verified suppliers. You can view 30-day trends and volume data to time your purchases strategically.",
  minimum:
    "Minimum orders vary by supplier and feedstock type. Typically, liquid biofuels (ethanol, biodiesel) start at 100 litres or 1 kilolitre, while solid biomass like woodchips starts at 1 tonne. Check individual supplier profiles for specific minimums.",
  supplier:
    "Browse our Supplier Directory at /supplier-directory to find certified biofuel producers. Each profile shows location, feedstock types, capacity, certifications, and ratings. Use the search to filter by feedstock, location, or certification.",
  default:
    "G'day! I'm Sam, your ABFI bioenergy expert. I can help you with requesting quotes, finding suppliers, understanding carbon calculations, and navigating the platform. What would you like to know more about?",
};

function getFallbackResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("quote") || q.includes("request")) return FALLBACK_RESPONSES.quote;
  if (q.includes("certification") || q.includes("verified") || q.includes("certif")) return FALLBACK_RESPONSES.certification;
  if (q.includes("carbon") || q.includes("emission") || q.includes("co2")) return FALLBACK_RESPONSES.carbon;
  if (q.includes("price") || q.includes("cost") || q.includes("pricing")) return FALLBACK_RESPONSES.price;
  if (q.includes("minimum") || q.includes("order") || q.includes("volume")) return FALLBACK_RESPONSES.minimum;
  if (q.includes("supplier") || q.includes("find") || q.includes("browse")) return FALLBACK_RESPONSES.supplier;
  return FALLBACK_RESPONSES.default;
}

aiChatRouter.post("/", async (req, res) => {
  try {
    const { question } = req.body as AIChatRequest;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return res.status(400).json({ error: "Invalid question" });
    }

    let answer: string;

    // Try to use LLM if configured, otherwise use fallback
    if (ENV.forgeApiKey) {
      try {
        const llmResponse = await invokeLLM({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: question },
          ],
          maxTokens: 500,
        });

        answer =
          typeof llmResponse.choices[0]?.message?.content === "string"
            ? llmResponse.choices[0].message.content
            : getFallbackResponse(question);
      } catch (llmError) {
        console.error("[AI Chat] LLM error, using fallback:", llmError);
        answer = getFallbackResponse(question);
      }
    } else {
      // Use fallback responses when LLM is not configured
      answer = getFallbackResponse(question);
    }

    const response: AIChatResponse = { answer };

    // If HeyGen API key is configured, generate video response
    if (ENV.heygenApiKey) {
      try {
        const heygenResponse = await fetch(HEYGEN_API_URL, {
          method: "POST",
          headers: {
            "X-Api-Key": ENV.heygenApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            avatar_id: ENV.heygenAvatarId || "sam_australian_001",
            input_text: answer,
            aspect_ratio: "16:9",
            quality: "high",
          }),
        });

        if (heygenResponse.ok) {
          const heygenData = await heygenResponse.json();
          const videoId = heygenData.data?.video_id;

          if (videoId) {
            // Poll for video completion (simplified - use webhook in production)
            await new Promise((resolve) => setTimeout(resolve, 8000));

            const statusResponse = await fetch(
              `https://api.heygen.com/v1/video.status?video_id=${videoId}`,
              {
                headers: {
                  "X-Api-Key": ENV.heygenApiKey,
                },
              }
            );

            if (statusResponse.ok) {
              const statusData = await statusResponse.json();
              response.videoUrl = statusData.data?.video_url || "";
            }
          }
        }
      } catch (heygenError) {
        console.error("[AI Chat] HeyGen video generation failed:", heygenError);
        // Continue without video - text response is still valid
      }
    }

    return res.json(response);
  } catch (error) {
    console.error("[AI Chat] Error:", error);
    return res.status(500).json({
      error: "Failed to generate response",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Health check endpoint
aiChatRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    heygenConfigured: !!ENV.heygenApiKey,
    llmConfigured: !!ENV.forgeApiKey,
  });
});
