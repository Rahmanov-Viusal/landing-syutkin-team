const googleUrl =
  'https://script.google.com/macros/s/AKfycbwVrHIKpHtKh23zj95W6wWVm1N8SpbEna_mhJbBVxAesvaCGa60WLEYh_dqtBNJSgfZVg/exec';

const modal = document.getElementById('aiModal');
const btn = document.getElementById('openModal'); // Переконайтеся, що у вашій кнопки id="openModal"
const closeBtn = document.getElementById('closeModal');
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendMessage');

let step = 0;
let clientName = '';

// Відкрити чат
if (btn) {
  btn.onclick = () => (modal.style.display = 'flex');
}

// Закрити чат
closeBtn.onclick = () => (modal.style.display = 'none');

// Функція відображення повідомлень
function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Функція збереження в Google Таблицю
async function saveToGoogle(name, contact) {
  try {
    await fetch(googleUrl, {
      method: 'POST',
      mode: 'no-cors', // Важливо для Google Scripts
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, contact: contact }),
    });
    console.log('Дані успішно відправлені!');
  } catch (e) {
    console.error('Помилка відправки:', e);
  }
}

// Логіка діалогу
async function handleChat() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';

  setTimeout(async () => {
    if (step === 0) {
      clientName = text;
      addMessage(
        `Приємно познайомитись, ${clientName}! Який твій номер телефону або Instagram для зв'язку?`,
        'ai',
      );
      step = 1;
    } else if (step === 1) {
      const clientContact = text;
      addMessage(
        "Дякую! Передаю дані тренеру. Сергій Сюткін зв'яжеться з тобою найближчим часом. From Human to Ironman! 🚀",
        'ai',
      );

      // ВІДПРАВКА В ТАБЛИЦЮ
      await saveToGoogle(clientName, clientContact);
      step = 2;
    } else {
      addMessage('Ми вже отримали твій запит, тренер скоро відповість!', 'ai');
    }
  }, 1000);
}

sendBtn.onclick = handleChat;
userInput.onkeypress = e => {
  if (e.key === 'Enter') handleChat();
};
