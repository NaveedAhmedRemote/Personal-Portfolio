/* ══════════════════════════════════════════════════════
   MAIN — Entry point. Imports styles and initialises modules.
   ══════════════════════════════════════════════════════ */

// Styles
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/chat.css';

// Core modules
import { initTheme }         from './modules/theme.js';
import { initCursor }         from './modules/cursor.js';
import { initConstellation }  from './modules/constellation.js';
import { initScroll }         from './modules/scroll.js';
import { initContactForm }    from './modules/contact.js';

// AI module
import { initAI }             from './ai/index.js';

// Boot
initTheme();
initCursor();
initConstellation();
initScroll();
initContactForm();
initAI();
