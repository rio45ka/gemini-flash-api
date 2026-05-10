const form = document.querySelector('#chatForm');
const input = document.querySelector('#messageInput');
const messages = document.querySelector('#messages');
const sendButton = document.querySelector('#sendButton');
const clearButton = document.querySelector('#clearButton');
const statusText = document.querySelector('#status');
const toneSelect = document.querySelector('#toneSelect');
const levelSelect = document.querySelector('#levelSelect');
const focusSelect = document.querySelector('#focusSelect');
const goalInput = document.querySelector('#goalInput');
const memoryInput = document.querySelector('#memoryInput');
const quickPromptButtons = document.querySelectorAll('[data-prompt]');

const STORAGE_KEY = 'kawan-belajar-ai-settings';

let conversation = [];
let isSending = false;

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.classList.toggle('error', isError);
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

function createMessage(role, text) {
  const item = document.createElement('article');
  item.className = `message ${role === 'user' ? 'user' : 'bot'}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = role === 'user' ? 'U' : 'K';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  bubble.append(paragraph);

  item.append(avatar, bubble);
  messages.append(item);
  scrollToBottom();

  return item;
}

function createTypingMessage() {
  const item = document.createElement('article');
  item.className = 'message bot';
  item.innerHTML = `
    <div class="avatar" aria-hidden="true">K</div>
    <div class="bubble" aria-label="Kawan Belajar AI sedang mengetik">
      <span class="typing" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
    </div>
  `;
  messages.append(item);
  scrollToBottom();
  return item;
}

function getSettings() {
  return {
    tone: toneSelect.value,
    level: levelSelect.value,
    focus: focusSelect.value,
    goal: goalInput.value.trim(),
    memory: memoryInput.value.trim(),
  };
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getSettings()));
}

function loadSettings() {
  const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  if (savedSettings.tone) toneSelect.value = savedSettings.tone;
  if (savedSettings.level) levelSelect.value = savedSettings.level;
  if (savedSettings.focus) focusSelect.value = savedSettings.focus;
  if (savedSettings.goal) goalInput.value = savedSettings.goal;
  if (savedSettings.memory) memoryInput.value = savedSettings.memory;
}

function setSendingState(value) {
  isSending = value;
  sendButton.disabled = value;
  input.disabled = value;
  clearButton.disabled = value;
}

function resizeInput(textarea = input) {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

async function sendMessage(text) {
  conversation.push({ role: 'user', text });
  createMessage('user', text);
  setSendingState(true);
  setStatus('Kawan Belajar AI sedang menyusun jawaban...');
  const typingMessage = createTypingMessage();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation,
        settings: getSettings(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal mendapatkan jawaban.');
    }

    const reply = data.result || 'Maaf, tidak ada jawaban dari model.';
    typingMessage.remove();
    createMessage('model', reply);
    conversation.push({ role: 'model', text: reply });
    setStatus('');
  } catch (error) {
    typingMessage.remove();
    conversation.pop();
    setStatus(error.message, true);
  } finally {
    setSendingState(false);
    input.focus();
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (isSending) return;

  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  resizeInput();
  sendMessage(text);
});

input.addEventListener('input', () => resizeInput());
memoryInput.addEventListener('input', () => {
  resizeInput(memoryInput);
  saveSettings();
});

[toneSelect, levelSelect, focusSelect, goalInput].forEach((element) => {
  element.addEventListener('input', saveSettings);
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

clearButton.addEventListener('click', () => {
  conversation = [];
  messages.innerHTML = '';
  createMessage('model', 'Percakapan sudah dibersihkan. Memory dan konfigurasi tetap tersimpan.');
  setStatus('');
  input.focus();
});

quickPromptButtons.forEach((button) => {
  button.addEventListener('click', () => {
    input.value = button.dataset.prompt;
    resizeInput();
    input.focus();
  });
});

loadSettings();
resizeInput();
resizeInput(memoryInput);
