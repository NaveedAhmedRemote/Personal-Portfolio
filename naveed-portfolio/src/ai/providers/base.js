/**
 * AIProvider — Abstract base class that every AI provider must extend.
 *
 * To add a new provider:
 *   1. Create a new file in src/ai/providers/  (e.g. gemini.js)
 *   2. Extend AIProvider and implement sendMessage() and optionally streamMessage()
 *   3. Register it in src/ai/index.js
 */
export class AIProvider {
  constructor(config = {}) {
    if (new.target === AIProvider) {
      throw new Error('AIProvider is abstract — extend it instead.');
    }
    this.config = config;
  }

  /** Return the provider name for display / logging. */
  get name() {
    return 'base';
  }

  /**
   * Send a message and get a complete response.
   * @param {string} message - User message
   * @param {Array}  history - Conversation history [{role, content}, ...]
   * @param {string} systemContext - Portfolio context injected as system prompt
   * @returns {Promise<string>} AI response text
   */
  async sendMessage(message, history = [], systemContext = '') {
    throw new Error(`${this.name}: sendMessage() not implemented`);
  }

  /**
   * Stream a response token-by-token (optional — falls back to sendMessage).
   * @param {string}   message
   * @param {Array}    history
   * @param {string}   systemContext
   * @param {Function} onToken - Called with each token chunk: onToken(text)
   * @returns {Promise<string>} Complete response when finished
   */
  async streamMessage(message, history = [], systemContext = '', onToken = () => {}) {
    const full = await this.sendMessage(message, history, systemContext);
    onToken(full);
    return full;
  }
}
