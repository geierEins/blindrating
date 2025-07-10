let mode = 'edit';
let cards = [];
let shuffledCards = [];
let currentCardIndex = 0;
let placed = [];
let history = [];
let itemCount = 10;

function toggleMode() {
  if (mode === 'edit') {
    mode = 'play';
    document.getElementById('edit-mode').style.display = 'none';
    document.getElementById('play-mode').style.display = 'block';
    prepareGameBoard();
  } else {
    mode = 'edit';
    document.getElementById('edit-mode').style.display = 'flex';
    document.getElementById('play-mode').style.display = 'none';
  }
}

function updateItemCount(value) {
  itemCount = parseInt(value);
  document.getElementById('item-count-display').textContent = itemCount;
  generateInputFields(false); // false: Felder nicht löschen, nur anpassen
}

// Neues Argument: resetFields (default true)
function generateInputFields(resetFields = true) {
  const container = document.getElementById('input-fields');

  // Wenn resetFields true, alles löschen & neu erstellen
  if (resetFields) {
    container.innerHTML = '';
    for (let i = 0; i < itemCount; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Begriff ${i + 1}`;
      input.id = `input-${i}`;
      input.className = 'term-input';
      container.appendChild(input);
    }
  } else {
    // Felder anpassen: Wenn mehr, neue hinzufügen, wenn weniger, entfernen
    const existingInputs = container.querySelectorAll('input.term-input');
    const existingCount = existingInputs.length;

    if (itemCount > existingCount) {
      for (let i = existingCount; i < itemCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Begriff ${i + 1}`;
        input.id = `input-${i}`;
        input.className = 'term-input';
        container.appendChild(input);
      }
    } else if (itemCount < existingCount) {
      for (let i = existingCount - 1; i >= itemCount; i--) {
        const inputToRemove = document.getElementById(`input-${i}`);
        if (inputToRemove) {
          container.removeChild(inputToRemove);
        }
      }
    }

    // Update Platzhalter & IDs
    const inputs = container.querySelectorAll('input.term-input');
    inputs.forEach((input, idx) => {
      input.placeholder = `Begriff ${idx + 1}`;
      input.id = `input-${idx}`;
    });
  }
}

function clearAllInputs() {
  const container = document.getElementById('input-fields');
  const inputs = container.querySelectorAll('input.term-input');
  inputs.forEach(input => (input.value = ''));
}

function startGame() {
  cards = [];
  for (let i = 0; i < itemCount; i++) {
    const value = document.getElementById(`input-${i}`).value.trim();
    if (value === '') {
      alert('Bitte alle Begriffe ausfüllen.');
      return;
    }
    cards.push(value);
  }

  shuffledCards = shuffleArray([...cards]);
  currentCardIndex = 0;
  placed = new Array(itemCount).fill(null);
  history = [];
  clearBoard();
  showNextCard();
  toggleMode();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function prepareGameBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  for (let i = 1; i <= itemCount; i++) {
    const li = document.createElement('li');
    li.id = 'slot-' + i;
    li.textContent = i;
    li.addEventListener('click', () => placeCard(i));
    board.appendChild(li);
  }
}

function showNextCard() {
  if (currentCardIndex >= shuffledCards.length) {
    document.getElementById('card').textContent = 'Fertig! Dein Ranking steht.';
    return;
  }
  document.getElementById('card').textContent = shuffledCards[currentCardIndex];
}

function placeCard(position) {
  if (placed[position - 1] !== null) {
    alert('Dieser Platz ist schon vergeben!');
    return;
  }

  const currentCard = shuffledCards[currentCardIndex];
  placed[position - 1] = currentCard;

  history.push({ position: position - 1, card: currentCard });

  const slot = document.getElementById('slot-' + position);
  slot.textContent = currentCard;
  slot.classList.add('filled');

  currentCardIndex++;
  showNextCard();
}

function clearBoard() {
  for (let i = 1; i <= itemCount; i++) {
    const slot = document.getElementById('slot-' + i);
    if (slot) {
      slot.textContent = i;
      slot.classList.remove('filled');
    }
  }
}

function undoLast() {
  if (history.length === 0 || currentCardIndex === 0) {
    alert('Nichts rückgängig zu machen.');
    return;
  }

  currentCardIndex--;
  const lastMove = history.pop();
  placed[lastMove.position] = null;

  const slot = document.getElementById('slot-' + (lastMove.position + 1));
  slot.textContent = lastMove.position + 1;
  slot.classList.remove('filled');

  showNextCard();
}

// Initial setup: Set slider value & synchronisiere Anzeige + Felder
window.onload = () => {
  document.getElementById('item-count-slider').value = itemCount;
  document.getElementById('item-count-display').textContent = itemCount;
  generateInputFields();
};
