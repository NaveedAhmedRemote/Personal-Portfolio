import { AIProvider } from './base.js';

/**
 * LangChain provider — sends messages to a backend that runs a LangChain chain.
 *
 * This is the recommended approach for RAG pipelines, tool-calling agents,
 * or any chain that needs server-side execution.
 *
 * Config:
 *   - endpoint: Backend URL (e.g. http://localhost:8000/api/chat)
 *   - headers:  Extra headers (e.g. auth tokens)
 *
 * Expected backend request:  POST { message, history, context }
 * Expected backend response: { response: "..." } or SSE stream
 */
export class LangChainProvider extends AIProvider {
  get name() { return 'langchain'; }

  async sendMessage(message, history = [], systemContext = '') {
    const { endpoint, headers = {} } = this.config;
    if (!endpoint) throw new Error('LangChain backend endpoint is required');

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ message, history, context: systemContext }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `LangChain API error: ${res.status}`);
    }

    const data = await res.json();
    return data.response;
  }

  async streamMessage(message, history = [], systemContext = '', onToken = () => {}) {
    const { endpoint, headers = {} } = this.config;
    if (!endpoint) throw new Error('LangChain backend endpoint is required');

    const streamUrl = endpoint.replace(/\/?$/, '/stream');

    const res = await fetch(streamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ message, history, context: systemContext }),
    });

    if (!res.ok) {
      // Fall back to non-streaming
      return this.sendMessage(message, history, systemContext);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      full += chunk;
      onToken(chunk);
    }

    return full;
  }
}
