import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import {GoogleGenAI} from '@google/genai';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Enable JSON body parsing for API routes
app.use(express.json());

/**
 * Example Express Rest API endpoints can be defined here.
 */
app.post('/api/ask-guide', async (req, res) => {
  const { firstName, lastName, cityName, bio, skills, languages, message } = req.body;
  
  try {
    const key = process.env['GEMINI_API_KEY'];
    if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
      console.warn("GEMINI_API_KEY is missing or generic in environment.");
      res.json({ 
        answer: `Bonjour ! Je suis ${firstName || 'Chloé'}, votre guide à ${cityName || 'Paris'}. Je suis ravi(e) de faire votre connaissance ! 😊\n\n*(Remarque technique : La clé GEMINI_API_KEY ne semble pas être encore configurée dans vos Secrets sous l'onglet AI Studio. Ne vous inquiétez pas ! Notre application est entièrement interactive et vous pouvez réserver des créneaux de visites réels, changer d'utilisateurs, explorer notre catalogue ultra moderne, et chatter librement. Une fois que vous aurez ajouté votre clé d'API, mon double virtuel basé sur l'IA se réveillera pour vous parler précisément en personne !)*` 
      });
      return;
    }

    // Lazy initialization of the GoogleGenAI client with strict SDK standards
    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build', // Mandatory user-agent identifier
        }
      }
    });

    const systemInstruction = `You are ${firstName} ${lastName}, a passionate, welcoming, and hyper-knowledgeable local travel guide in ${cityName}.
Your personal bio is: "${bio}".
You speak: ${languages ? languages.join(', ') : 'French and English'}.
Your specific expertise: ${skills ? skills.join(', ') : 'Local hidden gems'}.

Strict guidelines for your personality and formatting:
1. Always speak as a passionate real human local guide. You are NOT an AI assistant, robot, model, or software program. Never mention words like "prompt", "LLM", "artificial intelligence", "constraints", or "model".
2. Use a warm, energetic, and highly welcoming tone. Use emojis naturally like a friendly guide sending tips via WhatsApp.
3. Write your response entirely in French, matching the traveler's language naturally.
4. Introduce a brief native-tongue greeting occasionally based on your identity (e.g., if Japanese: "Konnichiwa! 🌸", if Arabic: "Marhaban! 🍯", if Italian: "Ciao! 🍝", if French: "Bonjour! 🥖").
5. Keep your response focused, concise, and beautifully structured (2-3 short paragraphs max).
6. Give genuine "insider secrets", off-the-beaten-path suggestions, local bakery names, or quiet times to visit. Never give generic, boring tourist traps that people can find on standard booklets.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    const answer = response.text || `Bonjour ! C'est ${firstName}. Je suis là pour vous livrer tous mes secrets sur ${cityName}. Quelle sorte de coins secrets aimeriez-vous explorer en priorité ?`;
    res.json({ answer });
    return;
  } catch (error) {
    console.error("AI Guide Server API error:", error);
    res.status(500).json({ error: "Une erreur est survenue lors de l'appel au guide virtuel." });
    return;
  }
});

/**
 * Serve static files from /browser
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
