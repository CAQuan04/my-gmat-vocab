// My GMAT Vocab - Vocabulary Review Page - Grid Layout

let currentListId = null;
let currentWordIndex = null;
let allLists = {};

// Flashcard state
let flashcardMode = false;
let flashcardIndex = 0;
let flashcardWords = [];
let isFlipped = false;

// Bulk delete state
let selectedWords = new Set();

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await initStorage();
    await loadLists();
    setupEventListeners();
    setupGlobalKeyboardListener();
});

// Initialize storage if needed
async function initStorage() {
    const data = await chrome.storage.local.get(null);
    if (!data.lists) {
        await chrome.storage.local.set({
            lists: {},
            settings: { shortcutKey: 'Shift' }
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('btn-new-list').addEventListener('click', createNewList);
    document.getElementById('sort-select').addEventListener('change', renderWords);
    document.getElementById('btn-list-actions').addEventListener('click', () => {
        if (currentListId) {
            openModal('list-actions-modal');
        } else {
            alert('Vui lòng chọn một danh sách trước chị nhé');
        }
    });

    // Flashcards button
    document.getElementById('btn-flashcards').addEventListener('click', startFlashcards);


    // List actions modal
    document.getElementById('close-actions-modal').addEventListener('click', () => closeModal('list-actions-modal'));
    document.getElementById('btn-rename-list').addEventListener('click', renameList);
    document.getElementById('btn-delete-list').addEventListener('click', deleteList);

    // Move word modal
    document.getElementById('close-move-modal').addEventListener('click', () => closeModal('move-word-modal'));

    // Word detail modal
    document.getElementById('modal-close-btn').addEventListener('click', closeWordModal);
    document.getElementById('modal-overlay').addEventListener('click', closeWordModal);
    document.getElementById('modal-delete-btn').addEventListener('click', () => {
        if (currentWordIndex !== null) {
            deleteWord(currentWordIndex);
            closeWordModal();
        }
    });

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.lists) {
            loadLists();
        }
    });

    // Bulk delete buttons
    document.getElementById('btn-bulk-delete').addEventListener('click', bulkDeleteWords);
    document.getElementById('btn-cancel-selection').addEventListener('click', cancelSelection);
}

// Load all lists
async function loadLists() {
    const data = await chrome.storage.local.get('lists');
    allLists = data.lists || {};

    renderLists();

    // Re-render current list if it still exists
    if (currentListId && allLists[currentListId]) {
        renderWords();
    } else {
        currentListId = null;
        showWelcomeMessage();
    }
}

// Render lists in sidebar
function renderLists() {
    const container = document.getElementById('lists-container');
    const listsArray = Object.values(allLists);

    if (listsArray.length === 0) {
        container.innerHTML = '<p class="no-lists">Chưa có danh sách nào. Tạo danh sách mới để bắt đầu!</p>';
        return;
    }

    container.innerHTML = '';

    listsArray.forEach(list => {
        const listItem = document.createElement('div');
        listItem.className = 'list-item' + (list.id === currentListId ? ' active' : '');
        listItem.innerHTML = `
      <span class="list-name">${list.name}</span>
      <span class="list-word-count">${list.words.length}</span>
    `;
        listItem.addEventListener('click', () => selectList(list.id));
        container.appendChild(listItem);
    });
}

// Select a list
function selectList(listId) {
    currentListId = listId;
    renderLists();
    renderWords();
}

// Render words in grid layout
function renderWords() {
    const container = document.getElementById('words-container');
    const listNameEl = document.getElementById('current-list-name');
    const wordCountEl = document.getElementById('word-count');

    if (!currentListId || !allLists[currentListId]) {
        showWelcomeMessage();
        return;
    }

    const list = allLists[currentListId];
    listNameEl.textContent = list.name;
    wordCountEl.textContent = `${list.words.length} từ`;

    if (list.words.length === 0) {
        container.innerHTML = `
      <div class="welcome-message">
        <span class="welcome-icon">📝</span>
        <h3>Chị My ơi chưa có từ vựng nào cả</h3>
        <p>Bôi đen từ bất kỳ trên trang web và nhấn Shift để thêm từ vào danh sách này nhé</p>
      </div>
    `;
        return;
    }

    // Sort words
    const sortOption = document.getElementById('sort-select').value;
    const sortedWords = sortWords([...list.words], sortOption);

    // Render grid cards
    container.innerHTML = '';
    sortedWords.forEach((word, index) => {
        const card = createWordGridCard(word, index);
        container.appendChild(card);
    });
}

// Sort words based on option
function sortWords(words, option) {
    switch (option) {
        case 'newest':
            return words; // Already in newest first order
        case 'oldest':
            return words.reverse();
        case 'a-z':
            return words.sort((a, b) => a.word.localeCompare(b.word));
        case 'z-a':
            return words.sort((a, b) => b.word.localeCompare(a.word));
        default:
            return words;
    }
}

// Create compact grid card
function createWordGridCard(word, index) {
    const card = document.createElement('div');
    card.className = `word-grid-card ${selectedWords.has(word.word) ? 'selected' : ''}`;

    // Add checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'word-checkbox';
    checkbox.checked = selectedWords.has(word.word);
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWordSelection(word.word);
    });

    // Add word name
    const wordName = document.createElement('div');
    wordName.className = 'word-grid-card-name';
    wordName.textContent = word.word;

    card.appendChild(checkbox);
    card.appendChild(wordName);

    // Click to open modal (but not checkbox)
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('word-checkbox')) {
            openWordModal(index);
        }
    });

    return card;
}

// Open word detail modal
function openWordModal(wordIndex) {
    const list = allLists[currentListId];
    if (!list || !list.words[wordIndex]) return;

    currentWordIndex = wordIndex;
    const word = list.words[wordIndex];

    // Set title
    document.getElementById('modal-word-title').textContent = word.word;

    // Set iframe src
    const iframe = document.getElementById('modal-iframe');
    iframe.src = word.url || `https://tracau.vn/?s=${encodeURIComponent(word.word)}&k=cn`;

    // Show modal
    document.getElementById('word-modal').style.display = 'flex';
}

// Close word detail modal
function closeWordModal() {
    document.getElementById('word-modal').style.display = 'none';
    document.getElementById('modal-iframe').src = '';
    currentWordIndex = null;
}

// Show welcome message
function showWelcomeMessage() {
    const container = document.getElementById('words-container');
    const listNameEl = document.getElementById('current-list-name');
    const wordCountEl = document.getElementById('word-count');

    listNameEl.textContent = 'Chọn một danh sách nha';
    wordCountEl.textContent = '';

    container.innerHTML = `
    <div class="welcome-message">
      <span class="welcome-icon">📚</span>
      <h3>Chào chị My đến với My GMAT Vocab nha ☺️</h3>
      <p>Chọn hoặc tạo một danh sách từ vựng để bắt đầu chị My nhé.</p>
    </div>
  `;
}

// Create new list
async function createNewList() {
    const listName = prompt('Nhập tên danh sách mới:');
    if (!listName || !listName.trim()) return;

    const listId = 'list-' + Date.now();
    allLists[listId] = {
        id: listId,
        name: listName.trim(),
        createdAt: Date.now(),
        words: []
    };

    await chrome.storage.local.set({ lists: allLists });
    currentListId = listId;
    await loadLists();
}

// Rename list
async function renameList() {
    if (!currentListId) return;

    const currentName = allLists[currentListId].name;
    const newName = prompt('Nhập tên mới cho danh sách:', currentName);

    if (!newName || !newName.trim() || newName.trim() === currentName) return;

    allLists[currentListId].name = newName.trim();
    await chrome.storage.local.set({ lists: allLists });
    closeModal('list-actions-modal');
    await loadLists();
}

// Delete list
async function deleteList() {
    if (!currentListId) return;

    const listName = allLists[currentListId].name;
    const confirmed = confirm(`Chị My có chắc muốn xóa danh sách "${listName}"?\n\nTất cả từ vựng trong danh sách này sẽ bị xóa vĩnh viễn đáy ạ.`);

    if (!confirmed) return;

    delete allLists[currentListId];
    await chrome.storage.local.set({ lists: allLists });
    currentListId = null;
    closeModal('list-actions-modal');
    await loadLists();
}

// Delete word from list
async function deleteWord(wordIndex) {
    if (!currentListId) return;

    const word = allLists[currentListId].words[wordIndex];
    const confirmed = confirm(`Chị My có chắc muốn xóa từ "${word.word}"?`);

    if (!confirmed) return;

    allLists[currentListId].words.splice(wordIndex, 1);
    await chrome.storage.local.set({ lists: allLists });
    await loadLists();
}

// Open move word modal
function openMoveWordModal(wordIndex) {
    if (!currentListId) return;

    currentWordIndex = wordIndex;
    const word = allLists[currentListId].words[wordIndex];

    document.getElementById('move-word-text').textContent = `Chuyển từ "${word.word}" sang danh sách:`;

    // Populate list options
    const optionsContainer = document.getElementById('move-list-options');
    optionsContainer.innerHTML = '';

    const otherLists = Object.values(allLists).filter(list => list.id !== currentListId);

    if (otherLists.length === 0) {
        optionsContainer.innerHTML = '<p style="text-align:center; color:#6b7280;">Không có danh sách khác. Tạo danh sách mới để chuyển từ.</p>';
    } else {
        otherLists.forEach(list => {
            const option = document.createElement('div');
            option.className = 'move-list-option';
            option.textContent = list.name;
            option.addEventListener('click', () => moveWord(list.id));
            optionsContainer.appendChild(option);
        });
    }

    openModal('move-word-modal');
}

// Move word to another list
async function moveWord(toListId) {
    if (!currentListId || currentWordIndex === null) return;

    const word = allLists[currentListId].words[currentWordIndex];

    // Check for duplicate
    const isDuplicate = allLists[toListId].words.some(w =>
        w.word.toLowerCase() === word.word.toLowerCase()
    );

    if (isDuplicate) {
        alert('Từ này đã có trong danh sách rồi chị My ơi!');
        return;
    }

    // Remove from current list
    allLists[currentListId].words.splice(currentWordIndex, 1);

    // Add to target list
    allLists[toListId].words.unshift(word);

    await chrome.storage.local.set({ lists: allLists });
    closeModal('move-word-modal');
    await loadLists();
}

// Modal helpers
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Setup global keyboard listener for flashcards
function setupGlobalKeyboardListener() {
    // Keep this empty - we'll add listener directly to keyboard-catcher
}

// ======================
// FLASHCARD FUNCTIONS
// ======================

function startFlashcards() {
    if (!currentListId || !allLists[currentListId]) {
        alert('Chị My vui lòng chọn một danh sách trước nhé');
        return;
    }

    const list = allLists[currentListId];
    if (list.words.length === 0) {
        alert('Danh sách này chưa có từ nào cả chị My ạ!');
        return;
    }

    // Initialize flashcard mode
    flashcardMode = true;
    flashcardWords = [...list.words];
    flashcardIndex = 0;
    isFlipped = false;

    console.log('🎴 Flashcard mode started! Keyboard should work now.');

    // Show flashcard modal
    document.getElementById('flashcard-modal').style.display = 'flex';

    // Setup flashcard event listeners
    setupFlashcardListeners();

    // Show first flashcard
    showFlashcard();

    // Focus keyboard catcher for immediate keyboard control
    setTimeout(() => {
        const catcher = document.getElementById('keyboard-catcher');
        catcher.focus();
        console.log('🎯 Keyboard catcher focused!');
    }, 100);
}

function setupFlashcardListeners() {
    const catcher = document.getElementById('keyboard-catcher');

    // Click keyboard catcher to flip
    catcher.addEventListener('click', flipCard);

    // Keyboard listener directly on catcher element
    catcher.addEventListener('keydown', handleFlashcardKeyboard);

    // Prevent focus loss when iframe loads
    catcher.addEventListener('blur', (e) => {
        if (flashcardMode) {
            console.log('⚠️ Focus lost, recapturing...');
            setTimeout(() => catcher.focus(), 50);
        }
    });

    // Navigation buttons
    document.getElementById('flashcard-prev').addEventListener('click', previousCard);
    document.getElementById('flashcard-next').addEventListener('click', nextCard);

    // Exit button
    document.getElementById('flashcard-exit').addEventListener('click', exitFlashcards);
}

function handleFlashcardKeyboard(e) {
    console.log('🔑 Key pressed:', e.key, 'Flashcard mode:', flashcardMode);

    if (!flashcardMode) return;

    switch (e.key) {
        case ' ': // Spacebar - flip card
            e.preventDefault();
            console.log('💫 Flipping card');
            flipCard();
            break;
        case 'ArrowLeft': // Left arrow - previous
            e.preventDefault();
            console.log('⬅️ Previous card');
            previousCard();
            break;
        case 'ArrowRight': // Right arrow - next
            e.preventDefault();
            console.log('➡️ Next card');
            nextCard();
            break;
        case 'Escape': // ESC - exit
            e.preventDefault();
            console.log('🚪 Exiting flashcards');
            exitFlashcards();
            break;
    }
}

function showFlashcard() {
    const word = flashcardWords[flashcardIndex];

    // Update progress
    document.getElementById('flashcard-progress').textContent =
        `${flashcardIndex + 1}/${flashcardWords.length} từ`;

    // Update word on front
    document.getElementById('flashcard-word').textContent = word.word;

    // Update iframe on back
    const iframe = document.getElementById('flashcard-iframe');
    iframe.src = word.url || `https://tracau.vn/?s=${encodeURIComponent(word.word)}&k=cn`;

    // Reset flip state
    isFlipped = false;
    document.getElementById('flashcard').classList.remove('flipped');

    // Update navigation buttons
    document.getElementById('flashcard-prev').disabled = flashcardIndex === 0;
    document.getElementById('flashcard-next').disabled = flashcardIndex === flashcardWords.length - 1;

    // Re-focus keyboard catcher after navigation
    setTimeout(() => {
        document.getElementById('keyboard-catcher').focus();
    }, 100);
}

function flipCard() {
    isFlipped = !isFlipped;
    const flashcard = document.getElementById('flashcard');

    if (isFlipped) {
        flashcard.classList.add('flipped');
    } else {
        flashcard.classList.remove('flipped');
    }
}

function nextCard() {
    if (flashcardIndex < flashcardWords.length - 1) {
        flashcardIndex++;
        showFlashcard();
    }
}

function previousCard() {
    if (flashcardIndex > 0) {
        flashcardIndex--;
        showFlashcard();
    }
}

function exitFlashcards() {
    flashcardMode = false;
    document.getElementById('flashcard-modal').style.display = 'none';

    // Clean up iframe
    document.getElementById('flashcard-iframe').src = '';
}
// Bulk Delete Functions

function toggleWordSelection(wordName) {
    if (selectedWords.has(wordName)) {
        selectedWords.delete(wordName);
    } else {
        selectedWords.add(wordName);
    }
    updateBulkActionsBar();
    renderWords(); // Re-render to update selected state
}

function updateBulkActionsBar() {
    const bar = document.getElementById('bulk-actions-bar');
    const count = document.getElementById('selected-count');

    if (selectedWords.size > 0) {
        bar.style.display = 'flex';
        count.textContent = `${selectedWords.size} từ đã chọn`;
    } else {
        bar.style.display = 'none';
    }
}

async function bulkDeleteWords() {
    if (selectedWords.size === 0) return;

    const confirmed = confirm(`Bạn có chắc muốn xóa ${selectedWords.size} từ đã chọn?`);
    if (!confirmed) return;

    const list = allLists[currentListId];
    list.words = list.words.filter(w => !selectedWords.has(w.word));

    allLists[currentListId] = list;
    await chrome.storage.local.set({ lists: allLists });

    selectedWords.clear();
    updateBulkActionsBar();
    renderWords();
    updateWordCount();
}

function cancelSelection() {
    selectedWords.clear();
    updateBulkActionsBar();
    renderWords();
}
