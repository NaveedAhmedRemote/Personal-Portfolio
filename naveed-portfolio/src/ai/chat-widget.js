/**
 * ChatWidget — Self-contained floating chat UI.
 * Creates its own DOM, manages state, delegates AI calls to provider.
 */
import { buildSystemPrompt } from './context.js';

export class ChatWidget {
  constructor(provider) {
    this.provider = provider;
    this.history = [];
    this.isOpen = false;
    this.isLoading = false;
    this.systemPrompt = buildSystemPrompt();
    this._buildDOM();
    this._bindEvents();
  }

  /* ── DOM Construction ─────────────────────────────── */
  _buildDOM() {
    // Floating action button
    this.fab = document.createElement('button');
    this.fab.className = 'chat-fab';
    this.fab.setAttribute('aria-label', 'Open AI chat');
    this.fab.innerHTML = '💬';

    // Chat panel
    this.panel = document.createElement('div');
    this.panel.className = 'chat-panel';
    this.panel.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-dot"></div>
        <div class="chat-header-title">Ask about Naveed</div>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-input-wrap">
        <input class="chat-input" type="text" placeholder="Ask me anything…" />
        <button class="chat-send">Send</button>
      </div>
    `;

    this.messagesEl = this.panel.querySelector('.chat-messages');
    this.inputEl    = this.panel.querySelector('.chat-input');
    this.sendBtn    = this.panel.querySelector('.chat-send');

    document.body.appendChild(this.panel);
    document.body.appendChild(this.fab);

    // Welcome message
    this._addMessage('ai', "Hi! I'm Naveed's AI assistant. Ask me about his skills, experience, or projects.");
  }

  /* ── Event Binding ────────────────────────────────── */
  _bindEvents() {
    this.fab.addEventListener('click', () => this.toggle());

    this.sendBtn.addEventListener('click', () => this._handleSend());

    this.inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._handleSend();
      }
    });
  }

  /* ── Public API ───────────────────────────────────── */
  toggle() {
    this.isOpen = !this.isOpen;
    this.panel.classList.toggle('open', this.isOpen);
    this.fab.classList.toggle('open', this.isOpen);
    this.fab.innerHTML = this.isOpen ? '✕' : '💬';
    if (this.isOpen) this.inputEl.focus();
  }

  destroy() {
    this.fab.remove();
    this.panel.remove();
  }

  /* ── Internal ─────────────────────────────────────── */
  async _handleSend() {
    const text = this.inputEl.value.trim();
    if (!text || this.isLoading) return;

    this._addMessage('user', text);
    this.inputEl.value = '';
    this.isLoading = true;
    this.sendBtn.disabled = true;

    const typingEl = this._addMessage('ai', '…', true);

    try {
      let response = '';
      if (this.provider.streamMessage !== undefined) {
        response = await this.provider.streamMessage(
          text,
          this.history,
          this.systemPrompt,
          (token) => {
            if (typingEl.textContent === '…') typingEl.textContent = '';
            typingEl.textContent += token;
            typingEl.classList.remove('typing');
            this._scrollToBottom();
          }
        );
      } else {
        response = await this.provider.sendMessage(text, this.history, this.systemPrompt);
        typingEl.textContent = response;
        typingEl.classList.remove('typing');
      }

      this.history.push(
        { role: 'user', content: text },
        { role: 'assistant', content: response }
      );
    } catch (err) {
      typingEl.textContent = `Error: ${err.message}`;
      typingEl.classList.remove('typing');
    } finally {
      this.isLoading = false;
      this.sendBtn.disabled = false;
      this._scrollToBottom();
    }
  }

  _addMessage(role, text, isTyping = false) {
    const el = document.createElement('div');
    el.className = `chat-msg ${role}${isTyping ? ' typing' : ''}`;
    el.textContent = text;
    this.messagesEl.appendChild(el);
    this._scrollToBottom();
    return el;
  }

  _scrollToBottom() {
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }
}
