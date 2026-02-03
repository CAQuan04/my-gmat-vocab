// Content script - Detects text selection and shows lookup popup

let popupOverlay = null;
let selectedText = '';

// Listen for Shift key press (single press)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        console.log('🔑 My GMAT Vocab: Shift key detected!');
        handleShiftPress();
    }
});

// Handle Shift press
function handleShiftPress() {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    console.log('📝 My GMAT Vocab: Selected text:', text);

    if (text) {
        selectedText = text;
        console.log('✅ My GMAT Vocab: Showing popup for word:', text);
        showLookupPopup(text);
    } else {
        console.log('⚠️ My GMAT Vocab: No text selected');
    }
}


// Create and show lookup popup with TracAu.vn iframe
function showLookupPopup(word) {
    removeLookupPopup();

    console.log('🎨 My GMAT Vocab: Creating popup with TracAu.vn iframe...');

    // Create overlay
    popupOverlay = document.createElement('div');
    popupOverlay.id = 'my-gmat-vocab-overlay';
    popupOverlay.className = 'mgv-overlay';

    // Build TracAu.vn URL
    const tracauUrl = `https://tracau.vn/?s=${encodeURIComponent(word)}&k=cn`;

    // Create popup container with iframe
    const popup = document.createElement('div');
    popup.className = 'mgv-popup';
    popup.innerHTML = `
    <div class="mgv-popup-header">
      <div class="mgv-word-display">${word}</div>
      <button class="mgv-close-btn" id="mgv-close-btn">&times;</button>
    </div>
    
    <div class="mgv-iframe-container">
      <iframe 
        src="${tracauUrl}" 
        class="mgv-tracau-iframe"
        sandbox="allow-same-origin allow-scripts"
        loading="eager"
      ></iframe>
    </div>
    
    <div class="mgv-popup-footer">
      <div class="mgv-save-section">
        <button class="mgv-btn-primary" id="mgv-save-btn-dropdown">
          💾 Lưu từ vào danh sách
          <span class="mgv-dropdown-arrow">▼</span>
        </button>
        <div class="mgv-dropdown" id="mgv-list-dropdown" style="display:none;">
          <div class="mgv-dropdown-content" id="mgv-list-options"></div>
          <div class="mgv-dropdown-footer">
            <button class="mgv-btn-secondary" id="mgv-new-list-btn">+ Tạo danh sách mới</button>
          </div>
        </div>
      </div>
    </div>
  `;

    popupOverlay.appendChild(popup);
    document.body.appendChild(popupOverlay);

    console.log('✅ My GMAT Vocab: Popup with iframe added to DOM');

    // Event listeners
    document.getElementById('mgv-close-btn').addEventListener('click', removeLookupPopup);
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            removeLookupPopup();
        }
    });

    // Store word data for saving
    window.currentWordData = {
        word: word,
        url: tracauUrl
    };

    // Setup save button
    setupSaveButton();
}

// Setup save button and dropdown
function setupSaveButton() {
    const saveBtn = document.getElementById('mgv-save-btn-dropdown');
    const dropdown = document.getElementById('mgv-list-dropdown');
    const newListBtn = document.getElementById('mgv-new-list-btn');

    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            await loadListOptions();
        });
    }

    if (newListBtn) {
        newListBtn.addEventListener('click', createNewList);
    }
}

// Load list options in dropdown
async function loadListOptions() {
    const container = document.getElementById('mgv-list-options');
    if (!container) return;

    const result = await chrome.storage.local.get('lists');
    const lists = result.lists || {};

    container.innerHTML = '';

    const listArray = Object.values(lists);
    if (listArray.length === 0) {
        container.innerHTML = '<p class="mgv-no-lists">Chưa có danh sách nào. Tạo danh sách mới nhé!</p>';
        return;
    }

    listArray.forEach(list => {
        const option = document.createElement('div');
        option.className = 'mgv-list-option';
        option.textContent = list.name;
        option.addEventListener('click', () => saveToList(list.id, list.name));
        container.appendChild(option);
    });
}

// Create new list
async function createNewList() {
    const listName = prompt('Nhập tên danh sách mới:');
    if (!listName || !listName.trim()) return;

    const result = await chrome.storage.local.get('lists');
    const lists = result.lists || {};

    const listId = 'list-' + Date.now();
    lists[listId] = {
        id: listId,
        name: listName.trim(),
        createdAt: Date.now(),
        words: []
    };

    await chrome.storage.local.set({ lists });

    // Save the current word to the new list
    await saveToList(listId, listName.trim());
}

// Save word to selected list
async function saveToList(listId, listName) {
    if (!window.currentWordData) return;

    const wordData = {
        word: window.currentWordData.word,
        url: window.currentWordData.url,
        addedAt: Date.now()
    };

    const result = await chrome.storage.local.get('lists');
    const lists = result.lists || {};

    if (!lists[listId]) {
        alert('Danh sách không tồn tại!');
        return;
    }

    // Check for duplicate
    const isDuplicate = lists[listId].words.some(w =>
        w.word.toLowerCase() === wordData.word.toLowerCase()
    );

    if (isDuplicate) {
        const confirmSave = confirm('Từ này đã có rồi chị My ạ. Bạn có muốn lưu lại không?');
        if (!confirmSave) return;
    }

    lists[listId].words.unshift(wordData);
    await chrome.storage.local.set({ lists });

    // Removed success alert - just close popup
    console.log('✅ Word saved successfully to:', listName);
    removeLookupPopup();
}

// Remove lookup popup
function removeLookupPopup() {
    if (popupOverlay) {
        popupOverlay.remove();
        popupOverlay = null;
        console.log('🗑️ My GMAT Vocab: Popup removed');
    }
    window.currentWordData = null;
}

// ESC key to close popup
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupOverlay) {
        removeLookupPopup();
    }
});

console.log('✅ My GMAT Vocab: Content script loaded successfully!');
