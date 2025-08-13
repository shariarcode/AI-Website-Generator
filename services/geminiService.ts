import { GoogleGenAI } from "@google/genai";

// Safely get the API key to prevent a ReferenceError if 'process' is not defined.
const getApiKey = (): string | undefined => {
    try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
        return undefined;
    } catch (e) {
        console.error("Error accessing process.env:", e);
        return undefined;
    }
};

const apiKey = getApiKey();

if (!apiKey) {
    console.error("API_KEY environment variable not found. AI functionality will be disabled.");
}

// Initialize the AI client only if the API key is available.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION_GENERATE = `You are an expert web developer who specializes in creating stunning, single-page websites. 
Your task is to generate a complete, self-contained 'index.html' file based on a user's prompt.

The generated code MUST adhere to the following rules:
1.  **Single HTML File:** The entire output must be a single HTML file.
2.  **Tailwind CSS:** You MUST use Tailwind CSS for all styling. Include it via the CDN script tag in the <head>: <script src="https://cdn.tailwindcss.com"></script>.
3.  **No Custom CSS:** Do not use <style> blocks. All styles must be applied directly to HTML elements using Tailwind utility classes.
4.  **JavaScript:** If the user's prompt implies interactivity (e.g., image carousels, mobile menu toggles), include the necessary JavaScript in a <script> tag at the end of the <body>. Use modern, vanilla JavaScript.
5.  **Images:** Use placeholder images from 'https://picsum.photos/width/height'. For example: <img src="https://picsum.photos/1200/800" alt="placeholder">. Choose appropriate dimensions for the context.
6.  **Content:** Generate relevant and high-quality text content, headings, and button labels that match the user's prompt.
7.  **Structure:** The HTML should be well-structured with semantic tags (e.g., <header>, <main>, <section>, <footer>).
8.  **Responsiveness:** The layout MUST be fully responsive and look great on all screen sizes, from mobile to desktop.
9.  **Final Output:** The output must ONLY be the raw HTML code, starting with \`<!DOCTYPE html>\` and ending with \`</html>\`. Do not include any explanations, comments, or markdown formatting like \`\`\`html. JUST THE CODE.
`;

const SYSTEM_INSTRUCTION_ENHANCE = `You are an AI assistant skilled in creative writing and web design concepts.
Your task is to take a user's simple idea for a website and expand it into a more descriptive and detailed prompt.
This new prompt will be used to generate a website, so it should be rich with detail.

RULES:
1.  **Focus on Detail:** Add specifics about the visual style (e.g., "minimalist," "brutalist," "corporate," "playful"), color palette (e.g., "pastel colors," "monochromatic black and white," "earthy tones"), typography (e.g., "bold sans-serif fonts," "elegant serif type"), and content sections (e.g., "a hero section with a clear call-to-action," "a features grid," "a pricing table," "a contact form").
2.  **Be Concise:** The output should be a single, fluent paragraph. Do not use lists or bullet points.
3.  **Output Format:** Respond ONLY with the new prompt text. Do not include any explanations, greetings, or markdown formatting. JUST THE PROMPT.

Example Input: a portfolio for a photographer
Example Output: A visually stunning, minimalist portfolio website for a professional wedding photographer. It should feature a large hero image gallery, a clean grid layout for different photo categories, an elegant 'About Me' section with a professional headshot, and a simple contact form. The color scheme should be monochromatic with black, white, and shades of gray, using a modern serif font for headings.
`;

export const generateWebsite = async (prompt: string): Promise<string> => {
  if (!ai) {
    // If the AI client wasn't initialized, we can't proceed.
    throw new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION_GENERATE,
            temperature: 0.7,
            topP: 0.95,
        }
    });

    let htmlContent = response.text.trim();
    
    // Clean up potential markdown code block fences
    if (htmlContent.startsWith("```html")) {
      htmlContent = htmlContent.substring(7);
    }
    if (htmlContent.endsWith("```")) {
      htmlContent = htmlContent.slice(0, -3);
    }

    return htmlContent.trim();
  } catch (error) {
    console.error("Error generating website with Gemini:", error);
    throw new Error("Failed to generate website. The AI model might be busy. Please try again later.");
  }
};

export const enhancePrompt = async (prompt: string): Promise<string> => {
  if (!ai) {
    throw new Error("AI Service is not configured. Please ensure the API_KEY is set correctly.");
  }
  
  if (!prompt || prompt.trim().length < 5) {
      throw new Error("Prompt is too short to enhance.");
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Enhance this prompt: "${prompt}"`,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION_ENHANCE,
            temperature: 0.8,
            topP: 0.9,
        }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error enhancing prompt with Gemini:", error);
    throw new Error("Failed to enhance prompt. The AI model might be busy.");
  }
};
