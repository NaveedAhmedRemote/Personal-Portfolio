/**
 * Central configuration — reads Vite environment variables.
 *
 * All VITE_* vars from .env are available via import.meta.env
 * AI features gracefully degrade when keys are absent.
 */
export const config = {
  ai: {
    /** Active provider: 'openai' | 'langchain' | 'none' */
    provider: import.meta.env.VITE_AI_PROVIDER || 'none',

    /** OpenAI direct */
    openaiKey:     import.meta.env.VITE_OPENAI_API_KEY || '',
    openaiBaseUrl: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model:         import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini',

    /** LangChain backend */
    langchainEndpoint: import.meta.env.VITE_LANGCHAIN_ENDPOINT || '',
    langchainHeaders:  {},
  },

  /** Web3Forms access key (already in HTML hidden field, kept here for reference) */
  web3formsKey: '0a6d850a-1ecb-4f69-9f7e-4f3968b29d7a',
};
