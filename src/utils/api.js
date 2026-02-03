// TracAu.vn API wrapper

const TracAuAPI = {
    API_KEY: 'WBBcwnwQpV89',
    BASE_URL: 'https://api.tracau.vn',

    // Fetch word definition
    async lookupWord(word) {
        const url = `${this.BASE_URL}/${this.API_KEY}/s/${encodeURIComponent(word)}/en`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return this.parseResponse(data, word);
        } catch (error) {
            console.error('Error fetching word:', error);
            throw error;
        }
    },

    // Parse TracAu.vn response to extract definitions
    parseResponse(data, word) {
        // TracAu.vn response structure varies
        // We'll extract the dictionary data

        if (!data || !data.dict) {
            return {
                word: word,
                phonetic: '',
                definitions: [],
                examples: []
            };
        }

        const dictData = data.dict;
        const result = {
            word: word,
            phonetic: '',
            definitions: [],
            examples: [],
            rawData: dictData // Keep raw data for full display
        };

        // Try to extract phonetic
        if (dictData.pronunciation) {
            result.phonetic = dictData.pronunciation;
        }

        // Extract definitions by part of speech
        if (dictData.definitions && Array.isArray(dictData.definitions)) {
            result.definitions = dictData.definitions;
        }

        // Extract examples
        if (dictData.examples && Array.isArray(dictData.examples)) {
            result.examples = dictData.examples;
        }

        return result;
    },

    // Format definition for display (HTML)
    formatDefinitionHTML(wordData) {
        if (!wordData.rawData) {
            return '<p>Không tìm thấy nghĩa của từ này.</p>';
        }

        let html = '';

        // Word and phonetic
        html += `<div class="word-header">`;
        html += `<h2 class="word-title">${wordData.word}</h2>`;
        if (wordData.phonetic) {
            html += `<span class="word-phonetic">${wordData.phonetic}</span>`;
        }
        html += `</div>`;

        // Definitions - Just show the raw HTML from TracAu
        // Since TracAu structure can vary, we'll display whatever we get
        const raw = wordData.rawData;

        if (typeof raw === 'string') {
            html += raw;
        } else if (raw.content) {
            html += raw.content;
        } else {
            // Fallback: try to format definitions array
            if (wordData.definitions && wordData.definitions.length > 0) {
                html += '<div class="definitions">';
                wordData.definitions.forEach(def => {
                    html += `<div class="definition-item">`;
                    if (def.partOfSpeech) {
                        html += `<span class="pos">${def.partOfSpeech}</span>`;
                    }
                    if (def.meaning) {
                        html += `<p class="meaning">${def.meaning}</p>`;
                    }
                    if (def.examples && def.examples.length > 0) {
                        html += '<ul class="examples">';
                        def.examples.forEach(ex => {
                            html += `<li>${ex}</li>`;
                        });
                        html += '</ul>';
                    }
                    html += `</div>`;
                });
                html += '</div>';
            }
        }

        return html;
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.TracAuAPI = TracAuAPI;
}
