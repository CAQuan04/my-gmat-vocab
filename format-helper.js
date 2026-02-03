// Format TracAu.vn data for display - CLEAN VERSION
function formatTracAuData(word, data) {
    let html = '';

    // Check if we have dictionary data
    if (data && data.dict) {
        // Parse and clean TracAu.vn HTML
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.dict, 'text/html');
            const body = doc.body;

            // Get all text content and rebuild with proper structure
            const textContent = body.textContent || body.innerText || '';

            if (textContent.trim()) {
                // Split by newlines and create structured output
                const lines = textContent.split('\n').map(l => l.trim()).filter(l => l);

                lines.forEach(line => {
                    if (line.match(/^[•▪■\-\*]/)) {
                        // Bullet point
                        html += `<div class="mgv-meaning-item">${line.replace(/^[•▪■\-\*]\s*/, '')}</div>`;
                    } else if (line.length > 0) {
                        //Regular line
                        html += `<div class="mgv-meaning-line">${line}</div>`;
                    }
                });
            } else {
                // Fallback: use innerHTML but wrap safely
                html = `<div class="mgv-raw-content">${data.dict}</div>`;
            }
        } catch (e) {
            console.error('Error parsing TracAu HTML:', e);
            html = '<div class="mgv-error">Lỗi hiển thị. Vui lòng thử lại.</div>';
        }
    } else if (data && data.sentences && data.sentences.length > 0) {
        // Show example sentences with clean formatting
        html += '<div class="mgv-sentences-section">';
        html += '<div class="mgv-section-title">Ví dụ câu sử dụng:</div>';
        html += '<div class="mgv-sentence-list">';

        data.sentences.slice(0, 5).forEach((sent, idx) => {
            if (sent.fields && sent.fields.en && sent.fields.vi) {
                html += `<div class="mgv-sentence-item">`;
                html += `<div class="mgv-en-text">${sent.fields.en[0]}</div>`;
                html += `<div class="mgv-vi-text">${sent.fields.vi[0]}</div>`;
                html += `</div>`;
            }
        });

        html += '</div></div>';
    } else {
        html += '<div class="mgv-error">❌ Không tìm thấy nghĩa của từ này.<br><small>Hãy thử tìm từ khác hoặc kiểm tra chính tả.</small></div>';
    }

    return html;
}
