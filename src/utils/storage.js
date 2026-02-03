// Storage utility functions for My GMAT Vocab

const StorageUtils = {
  // Initialize default data structure
  async init() {
    const data = await this.getAllData();
    if (!data.lists) {
      await chrome.storage.local.set({
        lists: {},
        settings: {
          shortcutKey: 'Shift'
        }
      });
    }
  },

  // Get all data
  async getAllData() {
    return await chrome.storage.local.get(null);
  },

  // Get all lists
  async getLists() {
    const data = await chrome.storage.local.get('lists');
    return data.lists || {};
  },

  // Create a new list
  async createList(name) {
    const lists = await this.getLists();
    const listId = 'list-' + Date.now();
    lists[listId] = {
      id: listId,
      name: name,
      createdAt: Date.now(),
      words: []
    };
    await chrome.storage.local.set({ lists });
    return listId;
  },

  // Rename a list
  async renameList(listId, newName) {
    const lists = await this.getLists();
    if (lists[listId]) {
      lists[listId].name = newName;
      await chrome.storage.local.set({ lists });
      return true;
    }
    return false;
  },

  // Delete a list
  async deleteList(listId) {
    const lists = await this.getLists();
    delete lists[listId];
    await chrome.storage.local.set({ lists });
  },

  // Check if word already exists in list
  async checkDuplicate(listId, word) {
    const lists = await this.getLists();
    if (!lists[listId]) return false;
    
    return lists[listId].words.some(w => 
      w.word.toLowerCase() === word.toLowerCase()
    );
  },

  // Add word to list
  async addWordToList(listId, wordData) {
    const lists = await this.getLists();
    if (!lists[listId]) {
      throw new Error('List not found');
    }

    // Check for duplicate
    const isDuplicate = await this.checkDuplicate(listId, wordData.word);
    if (isDuplicate) {
      return { success: false, message: 'Từ này đã có rồi chị My ạ' };
    }

    lists[listId].words.unshift({
      ...wordData,
      addedAt: Date.now()
    });

    await chrome.storage.local.set({ lists });
    return { success: true, message: 'Đã lưu từ thành công!' };
  },

  // Remove word from list
  async removeWordFromList(listId, wordIndex) {
    const lists = await this.getLists();
    if (lists[listId] && lists[listId].words[wordIndex]) {
      lists[listId].words.splice(wordIndex, 1);
      await chrome.storage.local.set({ lists });
      return true;
    }
    return false;
  },

  // Move word from one list to another
  async moveWord(fromListId, toListId, wordIndex) {
    const lists = await this.getLists();
    
    if (!lists[fromListId] || !lists[toListId] || !lists[fromListId].words[wordIndex]) {
      return false;
    }

    const word = lists[fromListId].words[wordIndex];
    
    // Check duplicate in target list
    const isDuplicate = lists[toListId].words.some(w => 
      w.word.toLowerCase() === word.word.toLowerCase()
    );
    
    if (isDuplicate) {
      return { success: false, message: 'Từ này đã có trong danh sách đích' };
    }

    // Remove from source list
    lists[fromListId].words.splice(wordIndex, 1);
    
    // Add to target list
    lists[toListId].words.unshift(word);
    
    await chrome.storage.local.set({ lists });
    return { success: true };
  },

  // Get settings
  async getSettings() {
    const data = await chrome.storage.local.get('settings');
    return data.settings || { shortcutKey: 'Shift' };
  },

  // Update settings
  async updateSettings(settings) {
    await chrome.storage.local.set({ settings });
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  window.StorageUtils = StorageUtils;
}
