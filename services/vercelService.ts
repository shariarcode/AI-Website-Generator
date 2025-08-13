
// A service for interacting with the Vercel API to deploy websites.

const API_ENDPOINT = 'https://api.vercel.com/v13/deployments';

/**
 * Deploys a single HTML file to Vercel.
 * @param htmlContent The HTML content of the website to deploy.
 * @param token The Vercel API token.
 * @returns The URL of the deployed website.
 */
export const deployToVercel = async (htmlContent: string, token: string): Promise<string> => {
  if (!htmlContent || !token) {
    throw new Error('HTML content and Vercel token are required.');
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'ai-generated-site',
        files: [
          {
            file: 'index.html',
            data: htmlContent,
          },
        ],
        projectSettings: {
            framework: null // Indicates a static site
        }
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.error?.message || `Vercel API Error: ${response.statusText}`;
      console.error('Vercel deployment failed:', result);
      throw new Error(errorMessage);
    }
    
    // The response contains a URL, but it's better to add https://
    return `https://${result.url}`;
  } catch (error: any) {
    console.error('Error deploying to Vercel:', error);
    throw new Error(error.message || 'An unknown error occurred during deployment.');
  }
};
