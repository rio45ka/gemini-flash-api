const form = document.querySelector('#chatForm');
const input = document.querySelector('#messageInput');
const messages = document.querySelector('#messages');
const sendButton = document.querySelector('#sendButton');
const clearButton = document.querySelector('#clearButton');
const statusText = document.querySelector('#status');

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
  avatar.textContent = role === 'user' ? 'U' : 'G';

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
    <div class="avatar" aria-hidden="true">G</div>
    <div class="bubble" aria-label="Gemini sedang mengetik">
      <span class="typing" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
    </div>
  `;
  messages.append(item);
  scrollToBottom();
  return item;
}

function setSendingState(value) {
  isSending = value;
  sendButton.disabled = value;
  input.disabled = value;
  clearButton.disabled = value;
}

function resizeInput() {
  input.style.height = 'auto';
  input.style.height = `${input.scrollHeight}px`;
}

async function sendMessage(text) {
  conversation.push({ role: 'user', text });
  createMessage('user', text);
  setSendingState(true);
  setStatus('Kami sedang berpikir...');
  const typingMessage = createTypingMessage();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
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

input.addEventListener('input', resizeInput);

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

clearButton.addEventListener('click', () => {
  conversation = [];
  messages.innerHTML = '';
  createMessage('model', 'Percakapan sudah dibersihkan. Silakan mulai lagi.');
  setStatus('');
  input.focus();
});

resizeInput();
