
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, ImageFile, ProjectFile, EditorChatResponse } from '../types';

// The build process replaces `process.env.API_KEY` with the actual key.
// As per instructions, we assume it's always available and valid.
// If not, the SDK will throw an error on API calls, which is handled below.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_GENERATE_FRONTEND = `You are an AI with the mind of a world-class senior frontend engineer and UI/UX designer. Your purpose is to translate a user's idea into a single, complete, and stunningly professional single-page website. You MUST follow a strict 'design-first' methodology.

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

const SYSTEM_INSTRUCTION_GENERATE_BACKEND = `You are an AI with the mind of a world-class senior backend engineer. Your purpose is to translate a user's idea into a complete, runnable, and well-structured backend application.

**Your Core Logic & Reasoning Flow:**

1.  **THE ARCHITECTURE (MANDATORY FIRST STEP):** Before writing any code, create a detailed plan.
    *   **Tech Stack:** Choose a suitable language and framework based on the prompt (Default to Node.js with Express if not specified).
    *   **File Structure:** Design a logical directory structure (e.g., \`src/routes\`, \`src/controllers\`).
    *   **Endpoints:** List all API endpoints to be created, including HTTP method, path, and purpose.
    *   **Data Models:** Define the schema for any data models if applicable.
    *   **Setup Instructions:** Plan the steps for a developer to set up and run the project.

2.  **IMPLEMENTATION:** Write the code for each file based on your architecture.
    *   **Dependency Management:** Create a complete \`package.json\` with all necessary dependencies (\`express\`, \`cors\`, \`dotenv\`, \`nodemon\`, etc.).
    *   **Modular Code:** Separate concerns into different files (e.g., server setup, routes, controller logic).
    *   **Environment Variables:** Use a \`.env\` file for configuration like ports. Include a \`.env.example\` file.
    *   **Clear Comments:** Add comments where the logic is complex.

3.  **DOCUMENTATION (CRITICAL):** Create a \`README.md\` file that explains:
    *   A brief project description.
    *   Prerequisites (e.g., Node.js v18+).
    *   Step-by-step installation instructions (\`npm install\`).
    *   How to run the application (\`npm start\` or \`npm run dev\`).
    *   Available API endpoints with examples.

4.  **FINAL OUTPUT FORMAT:**
    *   Your response MUST be a single JSON object that strictly adheres to the provided JSON schema.
    *   The JSON object must contain a single key, "files", which is an array of objects.
    *   Each object in the "files" array must have two keys: "name" (the full file path, e.g., "src/server.js") and "content" (the code for that file).
    *   One of the files MUST be named \`README.md\`.
    *   Your final output must ONLY be the raw JSON object. No explanations, no markdown formatting like \`\`\`json.`;


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
Your task is to take a user's simple idea for a a website and expand it into a more descriptive and detailed prompt.
This new prompt will be used to generate a website, so it should be rich with detail.

RULES:
1.  **Focus on Detail:** Add specifics about the visual style (e.g., "minimalist," "brutalist," "corporate," "playful"), color palette (e.g., "pastel colors," "monochromatic black and white," "earthy tones"), typography (e.g., "bold sans-serif fonts," "elegant serif type"), and content sections (e.g., "a hero section with a clear call-to-action," "a features grid," "a pricing table," "a contact form").
2.  **Be Concise:** The output should be a single, fluent paragraph. Do not use lists or bullet points.
3.  **Output Format:** Respond ONLY with the new prompt text. Do not include any explanations, greetings, or markdown formatting. JUST THE PROMPT.

Example Input: a portfolio for a photographer
Example Output: A visually stunning, minimalist portfolio website for a professional wedding photographer. It should feature a large hero image gallery, a clean grid layout for different photo categories, an elegant 'About Me' section with a professional headshot, and a simple contact form. The color scheme should be monochromatic with black, white, and shades of gray, using a modern serif font for headings.
`;

const backendFileSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        content: { type: Type.STRING }
    },
    required: ["name", "content"]
};

const backendResponseSchema = {
    type: Type.OBJECT,
    properties: {
        files: {
            type: Type.ARRAY,
            items: backendFileSchema
        }
    },
    required: ["files"]
};

export async function generateProject(
  type: 'frontend' | 'backend',
  prompt: string,
  image: ImageFile | null,
  onStream: (chunk: string) => void,
  onDone: () => void,
  onError: (error: Error) => void
): Promise<Record<string, string> | void> {
    if (!process.env.API_KEY) {
        const err = new Error("AI Service is not configured. Please ensure the API_KEY environment variable is set correctly.");
        onError(err);
        if (type === 'backend') throw err;
        return;
    }
    
    if (type === 'frontend') {
      // Use existing streaming logic for frontend
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
      return;
    } else { // Handle backend generation (non-streaming)
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION_GENERATE_BACKEND,
                    temperature: 0.5,
                    topP: 0.95,
                    responseMimeType: "application/json",
                    responseSchema: backendResponseSchema,
                }
            });

            let jsonString = response.text.trim();
             if (jsonString.startsWith("```json")) {
                jsonString = jsonString.substring(7);
                if (jsonString.endsWith("```")) {
                  jsonString = jsonString.slice(0, -3);
                }
            }
            
            const parsed = JSON.parse(jsonString);
            
            if (!parsed.files || !Array.isArray(parsed.files)) {
                throw new Error("AI returned an invalid file structure.");
            }

            const projectFiles: Record<string, string> = {};
            for (const file of parsed.files) {
                if (file.name && file.content) {
                    projectFiles[file.name] = file.content;
                }
            }
            
            if (!projectFiles['README.md']) {
                throw new Error("AI did not include the required README.md file.");
            }

            return projectFiles;

        } catch (error: any) {
            console.error("Error generating backend with Gemini:", error);
            const errorMessage = error.message?.toLowerCase().includes('api key')
              ? "AI Service is not configured. Please ensure the API_KEY environment variable is set correctly."
              : `Failed to generate backend project. ${error.message}`;
            throw new Error(errorMessage);
        }
    }
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
