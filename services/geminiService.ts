
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, ImageFile } from '../types';

// The build process replaces `process.env.API_KEY` with the actual key.
// As per instructions, we assume it's always available and valid.
// If not, the SDK will throw an error on API calls, which is handled below.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_GENERATE = `You are an AI with the mind of a world-class senior frontend engineer and UI/UX designer. Your purpose is to translate a user's idea into a single, complete, and stunningly professional single-page website. You MUST follow a strict 'design-first' methodology.

**Your Core Logic & Reasoning Flow:**

1.  **THE BLUEPRINT (MANDATORY FIRST STEP):** Before writing a single line of HTML, you MUST internally create a detailed design and structure plan. This is your most critical step. Your internal blueprint must define:
    *   **Core Identity:** A one-sentence summary of the website's purpose and audience (e.g., "A playful, engaging landing page for a new mobile game for kids.").
    *   **Visual Direction:**
        *   **Inspiration:** If an image is provided, it is the absolute source of truth. The design MUST reflect its colors, typography, layout, and mood. If not, derive from the prompt.
        *   **Color Palette:** Define primary, secondary, accent, and neutral colors.
        *   **Typography:** Choose specific Google Fonts for headings and body text that match the desired aesthetic (e.g., "Headings: 'Poppins', Body: 'Lato'").
    *   **Structural Architecture:** List every single section of the page in order, from \`<header>\` to \`<footer>\`. For each section, briefly describe its purpose (e.g., "Section 1: Hero - Bold title, subtitle, and a primary call-to-action button.").
    *   **Interactivity Plan:** Specify the exact JavaScript-powered features you will implement (e.g., "On-scroll fade-in animations for all sections", "An interactive FAQ accordion in the 'Questions' section").

2.  **IMPLEMENT THE '$10,000' STANDARD:** Now, execute your blueprint. This is what separates your work from basic generators.
    *   **Dynamic Interactivity:** Execute the interactivity plan from your blueprint. The most important is on-scroll animations using the \`IntersectionObserver\` API to make elements gracefully fade or slide into view.
    *   **Polished Components:** Where appropriate, build a more complex interactive component as defined in your blueprint, like a photo gallery slider, an accordion for FAQs, or tabs for features.
    *   **Micro-interactions:** Ensure all interactive elements (buttons, links, nav items) have smooth CSS transitions and subtle hover/focus states for a premium feel.
    *   **Responsive Excellence:** The site must be flawlessly responsive, with a mobile navigation menu that is both beautiful and functional.

3.  **WRITE, COMMENT, AND REFINE:** Generate the complete, self-contained \`index.html\` file based on your plan.
    *   **Tailwind CSS Only:** Use the Tailwind CSS CDN and include the chosen Google Fonts in the \`<head>\`. Do not write any custom CSS in \`<style>\` blocks or inline styles.
    *   **Clean Vanilla JS:** All logic must be in clean, well-commented, modern vanilla JavaScript inside a single \`<script>\` tag before \`</body>\`. Clearly explain the logic for observers, event listeners, and component initializations.
    *   **Accessibility (A11y):** Build with accessibility in mind. Use proper ARIA roles and attributes.
    *   **Final Output:** Your response must ONLY be the raw HTML code, starting with \`<!DOCTYPE html>\` and ending with \`</html>\`. No explanations, no apologies, no markdown—just the code.

You are not just a code writer; you are a digital architect. Your output is the physical manifestation of a well-thought-out design plan. Do not deviate.`;


const SYSTEM_INSTRUCTION_EDITOR_CHAT = `You are an AI with the mind of a world-class senior frontend engineer and UI/UX designer, acting as a helpful assistant in a real-time website editor. Your role is to be a collaborative partner, helping the user refine their website through conversation.

**Your Core Logic & Reasoning Flow:**

1.  **Analyze User Intent:** First, carefully read the user's latest message in the context of the conversation history and the current HTML. Classify the intent:
    *   **Modification Request:** The user wants a specific change to the code (e.g., "Change the title," "Make the background blue").
    *   **Design Question:** The user is asking for your expert opinion (e.g., "What color palette would look good?", "How can I improve this section?").
    *   **General Query:** The user is asking a question not directly related to a code change (e.g., "What is Tailwind CSS?").
2.  **Formulate a Plan & Response:** Based on the intent, decide on your action.
    *   **For Modification Requests:**
        a.  **Sanity Check:** Does this request align with good design principles? If the user asks for something that will harm the UI/UX (e.g., "make the text yellow on a white background"), do not blindly obey.
        b.  **Plan the Change:** Identify the exact HTML elements and Tailwind classes that need to be added, removed, or modified.
        c.  **Generate Response:** Formulate your conversational response. If you're making the change, confirm it. If you're pushing back, politely explain *why* from a design perspective and suggest a better alternative. (e.g., "That's a creative idea! However, yellow text on a white background can be difficult to read. For better accessibility, how about we try a dark gray or a deep blue instead?").
    *   **For Design Questions:** Access your internal knowledge base of UI/UX principles. Provide a helpful, expert answer in the \`response\` field. Do not modify the code unless the user confirms they want to proceed with your suggestion.
3.  **Execute and Format Output:**
    *   You MUST respond with a JSON object using this exact schema:
        \`\`\`json
        {
          "response": "Your friendly, expert, and conversational reply to the user.",
          "html": "The full, updated HTML code if a modification was made. Return an empty string if no code was changed."
        }
        \`\`\`
    *   **If modifying code,** return the *entire*, updated HTML document in the \`html\` field.
    *   **If providing advice or answering a question,** return an empty string (\`""\`) in the \`html\` field.
    *   **Final Output:** Only output the raw JSON object. Do not include any extra text, comments, or markdown formatting like \`\`\`json.

Your goal is to be more than a tool; be a mentor. Guide the user towards creating a better website, leveraging your ingrained expertise in design and development.`;


const SYSTEM_INSTRUCTION_ENHANCE = `You are an AI assistant skilled in creative writing and web design concepts.
Your task is to take a user's simple idea for a a website and expand it into a more descriptive and detailed prompt.
This new prompt will be used to generate a website, so it should be rich with detail.

RULES:
1.  **Focus on Detail:** Add specifics about the visual style (e.g., "minimalist," "brutalist," "corporate," "playful"), color palette (e.g., "pastel colors," "monochromatic black and white," "earthy tones"), typography (e.g., "bold sans-serif fonts," "elegant serif type"), and content sections (e.g., "a hero section with a clear call-to-action," "a features grid," "a pricing table," "a contact form").
2.  **Be Concise:** The output should be a single, fluent paragraph. Do not use lists or bullet points.
3.  **Output Format:** Respond ONLY with the new prompt text. Do not include any explanations, greetings, or markdown formatting. JUST THE PROMPT.

Example Input: a portfolio for a photographer
Example Output: A visually stunning, minimalist portfolio website for a professional wedding photographer. It should feature a large hero image gallery, a clean grid layout for different photo categories, an elegant 'About Me' section with a professional headshot, and a simple contact form. The color scheme should be monochromatic with black, white, and shades of gray, using a modern serif font for headings.
`;

export const generateWebsite = async (prompt: string, image: ImageFile | null): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
  }
  
  try {
    const textPart = { text: prompt };
    const contents: any = image 
        ? { parts: [
            textPart, 
            {
                inlineData: {
                    mimeType: image.mimeType,
                    data: image.data.split(',')[1], // remove the data URL prefix
                },
            }
        ]} 
        : prompt;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
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
  } catch (error: any) {
    console.error("Error generating website with Gemini:", error);
    if (error.message?.toLowerCase().includes('api key')) {
        throw new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
    }
    throw new Error("Failed to generate website. The AI model might be busy. Please try again later.");
  }
};

const editorResponseSchema = {
    type: Type.OBJECT,
    properties: {
        response: {
            type: Type.STRING,
            description: "Your friendly, conversational reply to the user."
        },
        html: {
            type: Type.STRING,
            description: "The full, updated HTML code if a modification was made. Otherwise, this should be an empty string."
        }
    },
    required: ["response", "html"]
};

export const chatInEditor = async (
  currentHtml: string,
  chatHistory: ChatMessage[],
  instruction: string
): Promise<{ response: string; html: string }> => {
  if (!process.env.API_KEY) {
    throw new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
  }

  const historyString = chatHistory
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
    .join('\n');

  const fullPrompt = `Here is the context for our conversation.

## Current HTML Code
\`\`\`html
${currentHtml}
\`\`\`

## Conversation History
${historyString}

## New User Message
User: "${instruction}"

Based on all this context, please respond with the required JSON object.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION_EDITOR_CHAT,
            temperature: 0.6,
            topP: 0.95,
            responseMimeType: "application/json",
            responseSchema: editorResponseSchema,
        }
    });

    let jsonString = response.text.trim();
    if (jsonString.startsWith("```json")) {
        jsonString = jsonString.substring(7);
        if (jsonString.endsWith("```")) {
          jsonString = jsonString.slice(0, -3);
        }
    }

    const parsedResponse = JSON.parse(jsonString);

    return {
      response: parsedResponse.response || "I seem to be having trouble forming a thought. Could you try rephrasing?",
      html: parsedResponse.html || "",
    };

  } catch (error: any) {
    console.error("Error in editor chat with Gemini:", error);
    if (error.message?.toLowerCase().includes('api key')) {
        throw new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
    }
    throw new Error("Failed to get response from AI assistant. Please try again later.");
  }
};


export const enhancePrompt = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
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
  } catch (error: any) {
    console.error("Error enhancing prompt with Gemini:", error);
    if (error.message?.toLowerCase().includes('api key')) {
        throw new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
    }
    throw new Error("Failed to enhance prompt. The AI model might be busy.");
  }
};
