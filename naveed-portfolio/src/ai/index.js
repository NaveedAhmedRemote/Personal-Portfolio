/**
 * AI Module Bootstrap
 *
 * Reads config, picks the active provider, and mounts the chat widget.
 * If no AI keys are configured, the widget simply doesn't appear.
 *
 * To add a new provider:
 *   1. Create src/ai/providers/yourprovider.js  (extend AIProvider)
 *   2. Import it below and add a case in the switch
 *   3. Add VITE_AI_PROVIDER=yourprovider to .env
 */
import { config } from '../config.js';
import { OpenAIProvider } from './providers/openai.js';
import { LangChainProvider } from './providers/langchain.js';
import { ChatWidget } from './chat-widget.js';

let widget = null;

export function initAI() {
  const providerName = config.ai.provider;

  // Graceful degradation — no config = no widget
  if (!providerName || providerName === 'none') {
    console.info('[AI] No provider configured — chat widget hidden.');
    return;
  }

  let provider;
  switch (providerName) {
    case 'openai':
      if (!config.ai.openaiKey) {
        console.warn('[AI] VITE_OPENAI_API_KEY not set — chat widget hidden.');
        return;
      }
      provider = new OpenAIProvider({
        apiKey:  config.ai.openaiKey,
        model:   config.ai.model,
        baseUrl: config.ai.openaiBaseUrl,
      });
      break;

    case 'langchain':
      if (!config.ai.langchainEndpoint) {
        console.warn('[AI] VITE_LANGCHAIN_ENDPOINT not set — chat widget hidden.');
        return;
      }
      provider = new LangChainProvider({
        endpoint: config.ai.langchainEndpoint,
        headers:  config.ai.langchainHeaders,
      });
      break;

    default:
      console.warn(`[AI] Unknown provider "${providerName}" — chat widget hidden.`);
      return;
  }

  widget = new ChatWidget(provider);
  console.info(`[AI] Chat widget mounted with "${providerName}" provider.`);
}

/** Destroy the chat widget (useful for cleanup / hot reload). */
export function destroyAI() {
  if (widget) {
    widget.destroy();
    widget = null;
  }
}
