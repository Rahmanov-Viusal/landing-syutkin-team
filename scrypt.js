const googleUrl =
  'https://script.google.com/macros/s/AKfycbwZJR_mXbfT2rK-DBuLXMlbpVoD_eGemOfe2p5-5_vlCAdmmPyxIJaUfatfWz5cN7l_UA/exec';

const modal = document.getElementById('aiModal');
const btn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendMessage');

let step = 0;
let clientName = '';

// Відкрити модальне вікно
if (btn) {
  btn.onclick = function () {
    modal.style.display = 'flex';
  };
}

// Закрити модальне вікно
if (closeBtn) {
  closeBtn.onclick = function () {
    modal.style.display = 'none';
  };
}

// Закриття при кліку поза вікном
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

// Функція додавання повідомлень у чат
function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Відправка даних у Google Таблицю
async function saveToGoogle(name, contact) {
  try {
    await fetch(googleUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, contact: contact }),
    });
    console.log('Дані відправлено');
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
        "Дякую! Передаю дані тренеру. Олексій Сюткін зв'яжеться з тобою найближчим часом. From Human to Ironman! 🚀",
        'ai',
      );

      await saveToGoogle(clientName, clientContact);
      step = 2;
    } else {
      addMessage('Ми вже отримали твій запит, тренер скоро відповість!', 'ai');
    }
  }, 1000);
}

// Обробка натискання кнопки відправити
if (sendBtn) {
  sendBtn.onclick = handleChat;
}

// Відправка по Enter
if (userInput) {
  userInput.onkeypress = function (e) {
    if (e.key === 'Enter') handleChat();
  };
}
