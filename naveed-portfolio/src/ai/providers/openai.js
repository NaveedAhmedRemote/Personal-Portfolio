import { AIProvider } from './base.js';

/**
 * Direct OpenAI API provider.
 *
 * Config:
 *   - apiKey:  OpenAI API key (required)
 *   - model:   Model name (default: gpt-4o-mini)
 *   - baseUrl: API base URL (default: https://api.openai.com/v1)
 */
export class OpenAIProvider extends AIProvider {
  get name() { return 'openai'; }

  async sendMessage(message, history = [], systemContext = '') {
    const { apiKey, model = 'gpt-4o-mini', baseUrl = 'https://api.openai.com/v1' } = this.config;
    if (!apiKey) throw new Error('OpenAI API key is required');

    const messages = [];
    if (systemContext) messages.push({ role: 'system', content: systemContext });
    messages.push(...history, { role: 'user', content: message });

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature: 0.7 }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }

  async streamMessage(message, history = [], systemContext = '', onToken = () => {}) {
    const { apiKey, model = 'gpt-4o-mini', baseUrl = 'https://api.openai.com/v1' } = this.config;
    if (!apiKey) throw new Error('OpenAI API key is required');

    const messages = [];
    if (systemContext) messages.push({ role: 'system', content: systemContext });
    messages.push(...history, { role: 'user', content: message });

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, temperature: 0.7, stream: true }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI API error: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
        try {
          const json = JSON.parse(line.slice(6));
          const token = json.choices[0]?.delta?.content || '';
          if (token) {
            full += token;
            onToken(token);
          }
        } catch { /* skip malformed chunks */ }
      }
    }

    return full;
  }
}
