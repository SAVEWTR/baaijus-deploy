import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY 
});

export interface ContentAnalysis {
  isBlocked: boolean;
  confidence: number;
  analysis: string;
  matchedKeywords: string[];
  sentiment: "positive" | "neutral" | "negative";
  categories: string[];
}

export async function analyzeContent(
  content: string,
  keywords: string[] = [],
  sensitivity: "permissive" | "balanced" | "strict" = "balanced"
): Promise<ContentAnalysis> {
  try {
    const sensitivityPrompts = {
      permissive: "Be lenient in filtering, only block clearly inappropriate content.",
      balanced: "Use moderate filtering standards, blocking content that may be inappropriate for general audiences.",
      strict: "Apply strict filtering standards, blocking any potentially questionable content."
    };

    const keywordFilter = keywords.length > 0 
      ? `Additional filtering keywords to consider: ${keywords.join(", ")}.` 
      : "";

    const prompt = `
You are an AI content filtering system. Analyze the following content and determine if it should be blocked based on the criteria below.

Sensitivity Level: ${sensitivity}
Instructions: ${sensitivityPrompts[sensitivity]}
${keywordFilter}

Content to analyze: "${content}"

Provide your analysis in the following JSON format:
{
  "isBlocked": boolean,
  "confidence": number (0-1),
  "analysis": "Brief explanation of the decision",
  "matchedKeywords": ["array", "of", "matched", "keywords"],
  "sentiment": "positive|neutral|negative",
  "categories": ["array", "of", "content", "categories"]
}

Consider factors like:
- Inappropriate language or content
- Political bias or controversial topics
- Violence, hate speech, or discrimination
- Sexual content
- Misinformation or harmful advice
- Spam or promotional content
- Relevance to specified keywords
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional content moderation AI. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Low temperature for consistent results
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate and sanitize the response
    return {
      isBlocked: Boolean(result.isBlocked),
      confidence: Math.max(0, Math.min(1, Number(result.confidence) || 0)),
      analysis: String(result.analysis || "No analysis provided"),
      matchedKeywords: Array.isArray(result.matchedKeywords) ? result.matchedKeywords : [],
      sentiment: ["positive", "neutral", "negative"].includes(result.sentiment) 
        ? result.sentiment 
        : "neutral",
      categories: Array.isArray(result.categories) ? result.categories : [],
    };
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    throw new Error("Failed to analyze content: " + (error as Error).message);
  }
}

export async function generateBaajusDescription(name: string, keywords: string[]): Promise<string> {
  try {
    const prompt = `
Generate a brief, professional description for a content filter called "${name}" with keywords: ${keywords.join(", ")}.
The description should explain what type of content this filter targets and its purpose.
Keep it under 100 characters and make it user-friendly.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 50,
      temperature: 0.3,
    });

    return response.choices[0].message.content?.trim() || `Content filter for ${name}`;
  } catch (error) {
    console.error("Failed to generate description:", error);
    return `Content filter for ${name}`;
  }
}
