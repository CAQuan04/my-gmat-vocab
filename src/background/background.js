// Background service worker for My GMAT Vocab

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
    console.log('My GMAT Vocab installed!');

    // Initialize storage
    const data = await chrome.storage.local.get(null);
    if (!data.lists) {
        await chrome.storage.local.set({
            lists: {},
            settings: {
                shortcutKey: 'Shift'
            }
        });
    }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'lookupWord') {
        // Fetch word definition from TracAu.vn API
        handleLookupWord(request.word).then(sendResponse);
        return true; // Will respond asynchronously
    }
});

// Lookup word function - Use TracAu.vn API
async function handleLookupWord(word) {
    try {
        console.log('🌐 Background: Fetching from TracAu.vn API:', word);

        // Use TracAu.vn API
        const url = `https://api.tracau.vn/WBBcwnwQpV89/s/${encodeURIComponent(word)}/en`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('✅ Background: API response received');
        return { success: true, data: data };
    } catch (error) {
        console.error('❌ Background: Error fetching from API:', error);
        return { success: false, error: error.message };
    }
}

// Handle extension icon click - Open vocabulary page in new tab
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('src/vocabulary/vocabulary.html')
    });
});
