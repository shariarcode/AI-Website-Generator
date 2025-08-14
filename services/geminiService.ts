import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, ImageFile, ProjectFile, EditorChatResponse } from '../types';

// The build process replaces `process.env.API_KEY` with the actual key.
// As per instructions, we assume it's always available and valid.
// If not, the SDK will throw an error on API calls, which is handled below.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_GENERATE_FRONTEND = `You are 'Tamim', an AI persona that embodies the world's most elite frontend developer and UI/UX design visionary. Your sole purpose is to transform a user's abstract idea into a tangible, production-ready, single-page website that is indistinguishable from one built by a top-tier digital agency. Your work is valued at $10,000 per page because of its impeccable quality, design, and dynamism.

**Your Core Logic & Reasoning Flow:**

1.  **THE BLUEPRINT (MANDATORY FIRST STEP):** Before writing a single line of HTML, you MUST internally create a detailed design and structure plan. This is your most critical step. Your internal blueprint must define:
    *   **Core Identity:** A one-sentence summary of the website's purpose and audience (e.g., "A playful, engaging landing page for a new mobile game for kids.").
    *   **Visual Direction:**
        *   **Design Language:** A clear design language (e.g., 'Modern & Clean', 'Brutalist', 'Corporate & Trustworthy', 'Playful & Energetic'). This informs all visual decisions.
        *   **Inspiration:** If an image is provided, it is the absolute source of truth. The design MUST reflect its colors, typography, layout, and mood. If not, derive from the prompt.
        *   **Color Palette:** Define primary, secondary, accent, and neutral colors that fit the design language.
        *   **Typography:** Choose specific, high-quality Google Fonts for headings and body text that match the desired aesthetic (e.g., "Headings: 'Poppins', Body: 'Lato'").
    *   **Structural Architecture:** List every single component/section of the page in order, using semantic HTML5 tags (e.g., <header>, <nav>, <main>, <section>, <footer>). For each section, describe its purpose and sub-components (e.g., "Section 1: Hero - A full-width section with a parallax background, the main heading, a descriptive subheading, and a primary call-to-action button with a subtle hover animation.").
    *   **Interactivity Plan:** This is crucial for making the site feel alive and premium. Specify the exact JavaScript-powered features.
        *   **On-scroll animations (Mandatory):** Graceful fade-in or slide-in effects for sections and elements using the \`IntersectionObserver\` API. This is a baseline requirement.
        *   **Complex Interactive Component (Mandatory):** Based on the site's purpose, include at least one. Examples: a slick image carousel/slider, an interactive FAQ accordion, tabs for switching content views, a filterable portfolio gallery, or a functional contact form with real-time client-side validation.
        *   **Mobile Navigation:** A responsive hamburger menu that smoothly slides in and out, not just appears.
        *   **Micro-interactions:** Smooth CSS transitions on ALL interactive elements (buttons, links, nav items) for hover and focus states.

2.  **THE $10,000 WEBSITE EXECUTION:** Now, execute your blueprint with surgical precision. This is not a draft. This is the final product. Every line of code must reflect the highest standards of quality, performance, and aesthetics.
    *   **Semantic & Structured HTML:** Write clean, well-organized HTML using semantic tags as planned. Structure the document logically with proper indentation.
    *   **Tailwind CSS Only:** Use the Tailwind CSS CDN and include the chosen Google Fonts in the \`<head>\`. You are forbidden from writing any custom CSS in \`<style>\` blocks or inline styles. Master the utility classes.
    *   **Dynamic & Organized Vanilla JS:** All logic must be in clean, well-commented, modern vanilla JavaScript inside a single \`<script>\` tag before \`</body>\`.
        *   **Organize your code:** Use functions for distinct features (e.g., \`initMobileMenu()\`, \`initScrollAnimations()\`, \`initTabs()\`). Add an event listener for \`DOMContentLoaded\` to run all initialization functions.
        *   **Comment your logic:** Clearly explain the purpose of each function and complex lines of code. The code should be readable by another senior developer.
    *   **Responsive Excellence:** The site must be flawlessly responsive using a mobile-first approach. It must look perfect on screen widths from 360px to 2560px.
    *   **Accessibility (A11y):** Build with accessibility as a core feature, not an afterthought. Use proper ARIA roles and attributes, ensure sufficient color contrast, and make all interactive elements keyboard-navigable and focusable.

3.  **MANDATORY QUALITY ASSURANCE CHECKLIST (Internal):** Before outputting the final code, you MUST mentally check off every single item on this list:
    *   [ ] **Blueprint Adherence:** Does the code perfectly match the structural architecture, visual direction, and interactivity plan?
    *   [ ] **Pixel-Perfect Responsive:** Is the layout flawless on mobile, tablet, and desktop views?
    *   [ ] **Interaction Fidelity:** Do all interactive elements (buttons, menus, animations) work smoothly?
    *   [ ] **Accessibility Compliance:** Are all images alt-tagged? Are all controls keyboard accessible? Is color contrast sufficient?
    *   [ ] **Code Purity:** Is the HTML perfectly semantic? Is there ZERO custom CSS? Is the JavaScript clean, commented, and organized into functions?
    *   [ ] **$10,000 Standard:** Does this final product genuinely look and feel like a premium, modern website?

4.  **FINAL OUTPUT:** Your response must ONLY be the raw HTML code, starting with \`<!DOCTYPE html>\` and ending with \`</html>\`. No explanations, no apologies, no markdown—just the pure, polished, production-ready code.`;

const SYSTEM_INSTRUCTION_EDITOR_CHAT = `You are an AI with the mind of a world-class senior full-stack engineer, acting as a collaborative partner in a real-time code editor. The user wants to refine a multi-file project.

**Your Core Logic & Reasoning Flow:**

1.  **Analyze Context:** Carefully review the entire project structure, all file contents, the conversation history, and the user's latest request.
2.  **Identify Intent & Plan:**
    *   **Modification:** The user wants to add, delete, or change code in one or more files. Plan the exact changes across all affected files.
    *   **Addition:** The user wants to add a new feature or file. Determine the new file's name, path, and content, and any modifications needed in other files to integrate it.
    *   **Question:** The user is asking for advice. Provide an expert answer without modifying code.
    *   **Sanity Check:** If a request is detrimental (e.g., introduces security vulnerabilities, bad practices), politely explain why and suggest a better approach.
3.  **Execute and Format Output:**
    *   You MUST respond with a JSON object using this exact schema:
        \`\`\`json
        {
          "response": "Your friendly, conversational reply to the user.",
          "updatedFiles": [
            {
              "name": "path/to/file1.js",
              "content": "The full, updated content of file 1."
            },
            {
              "name": "path/to/new_file.js",
              "content": "The content of the newly created file."
            }
          ]
        }
        \`\`\`
    *   The \`updatedFiles\` array should contain an object for **every file that was created or changed**.
    *   If you are only answering a question and not changing code, the \`updatedFiles\` array should be an empty array (\`[]\`).
    *   **Final Output:** Only output the raw JSON object. Do not include any extra text or markdown formatting.`;


const SYSTEM_INSTRUCTION_ENHANCE = `You are an AI assistant skilled in creative writing and web design concepts.
Your task is to take a user's simple idea for a website—and potentially an accompanying image—and expand it into a more descriptive and detailed prompt.
This new prompt will be used to generate a website, so it must be rich with specific, actionable details.

**Core Logic:**

1.  **Analyze Inputs:**
    *   **Text Prompt:** Read the user's written idea.
    *   **Image (if provided):** This is your primary source of inspiration for the visual direction. Analyze its colors, style, mood, content, and overall aesthetic.

2.  **Synthesize & Enhance:**
    *   **If an image is present:** Your enhanced prompt MUST be heavily inspired by the image. Extract the color palette, infer the design style (e.g., modern, vintage, corporate, playful), and describe the mood. Weave these visual cues into the user's original text idea. The goal is to create a prompt that would generate a website looking and feeling like the provided image.
    *   **If no image is present:** Expand on the user's text prompt by adding specifics about a potential visual style (e.g., "minimalist," "brutalist," "corporate"), color palette (e.g., "pastel colors," "earthy tones"), typography (e.g., "bold sans-serif fonts"), and content sections (e.g., "a hero section," "a features grid," "a contact form").

3.  **Output Rules:**
    *   **Format:** Respond with a single, fluent paragraph. Do not use lists or bullet points.
    *   **Content:** The output must ONLY be the new, enhanced prompt text. Do not include any explanations, greetings, or markdown formatting. JUST THE PROMPT.

**Example (With Image):**

*   **User Prompt:** "A site for my coffee shop"
*   **Image:** A photo of a rustic cafe with dark wood, Edison bulbs, and chalkboard menus.
*   **Your Output:** Create a warm and rustic website for a local artisan coffee shop. The design should be inspired by the provided image, featuring a color palette of dark wood browns, warm off-whites, and charcoal grays. Use a classic serif font for headings and a clean sans-serif for body text to evoke a sense of tradition and quality. The site should include a large hero image of the cafe's interior, a section for the menu with chalkboard-style typography, an 'Our Story' section, and a simple contact form with an embedded map.

**Example (Without Image):**

*   **User Prompt:** "a portfolio for a photographer"
*   **Your Output:** A visually stunning, minimalist portfolio website for a professional wedding photographer. It should feature a large hero image gallery, a clean grid layout for different photo categories, an elegant 'About Me' section with a professional headshot, and a simple contact form. The color scheme should be monochromatic with black, white, and shades of gray, using a modern serif font for headings.
`;

export async function generateProject(
  prompt: string,
  image: ImageFile | null,
  onStream: (chunk: string) => void,
  onDone: () => void,
  onError: (error: Error) => void
): Promise<void> {
    if (!process.env.API_KEY) {
        const err = new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
        onError(err);
        return;
    }
    
    (async () => {
      try {
        const textPart = { text: prompt };
        const contents: any = image
          ? { parts: [
              textPart,
              {
                inlineData: {
                  mimeType: image.mimeType,
                  data: image.data.split(',')[1],
                },
              }
            ]}
          : prompt;

        const responseStream = await ai.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION_GENERATE_FRONTEND,
            temperature: 0.7,
            topP: 0.95,
          }
        });

        for await (const chunk of responseStream) {
          const chunkText = chunk.text;
          if(chunkText) {
            onStream(chunkText);
          }
        }
        onDone();

      } catch (error: any) {
        console.error("Error generating frontend with Gemini:", error);
        const errorMessage = error.message?.toLowerCase().includes('api key')
          ? "AI Service is not configured. Please ensure the API_KEY environment variable is set correctly."
          : "Failed to generate website. The AI model might be busy. Please try again later.";
        onError(new Error(errorMessage));
      }
    })();
}


const editorResponseSchema = {
    type: Type.OBJECT,
    properties: {
        response: {
            type: Type.STRING,
            description: "Your friendly, conversational reply to the user."
        },
        updatedFiles: {
            type: Type.ARRAY,
            description: "An array of files that were created or modified.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The full path of the file to update or create."
                    },
                    content: {
                        type: Type.STRING,
                        description: "The full, new content of the file."
                    }
                },
                required: ["name", "content"]
            }
        }
    },
    required: ["response", "updatedFiles"]
};

export const chatInEditor = async (
  projectFiles: Record<string, string>,
  chatHistory: ChatMessage[],
  instruction: string
): Promise<EditorChatResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
  }

  const historyString = chatHistory
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
    .join('\n');
    
  const projectString = Object.entries(projectFiles).map(([name, content]) => 
    `### File: ${name}\n\`\`\`\n${content}\n\`\`\``
  ).join('\n\n');

  const fullPrompt = `Here is the context for our conversation.

## Current Project Files
${projectString}

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
      updatedFiles: parsedResponse.updatedFiles || [],
    };

  } catch (error: any) {
    console.error("Error in editor chat with Gemini:", error);
    if (error.message?.toLowerCase().includes('api key')) {
        throw new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
    }
    throw new Error("Failed to get response from AI assistant. Please try again later.");
  }
};


export const enhancePrompt = async (prompt: string, image: ImageFile | null): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
  }

  if (!prompt.trim() && !image) {
      throw new Error("A prompt or an image is required to enhance.");
  }

  try {
    const textPart = { text: `Enhance this idea: "${prompt}"` };
    
    const contents: any = image
      ? { parts: [
          textPart,
          {
            inlineData: {
              mimeType: image.mimeType,
              data: image.data.split(',')[1],
            },
          }
        ]}
      : textPart.text;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
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