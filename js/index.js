let stendhalFormattedText = '';
import {letters} from './letters.js';

function init() {
    document.getElementById('convertButton').addEventListener('click', convertText);
    document.getElementById('downloadButton').addEventListener('click', downloadFile);
}

init();

function convertToStendhalFormat(inputText, bookTitle) {
    const title = `title: ${bookTitle || 'Untitled'}`;
    const author = "author: CapyLand";
    const standardLetter = 5;
    const space = 4;
    const maxLinesPerParagraph = 13;

    let formattedText = `${title}\n${author}\npages:\n`;
    let paragraph = inputText.replace(/\n/g, ' ◘ ');
    let totalLineCount = 0;

    if (paragraph.trim().length > 0) {
        let words = paragraph.split(' ');
        let line = '#- '
        let linePercent = 0;

        words.forEach(word => {
            console.log()
            let wordPercent = 0;
            word.split('').forEach(letter => {
                if (isDigit(letter)) {
                    wordPercent += 3.6;
                } else if (letter === '◘') {
                    wordPercent = -100;
                } else if (letters[letter]) {
                    wordPercent += letters[letter];
                } else {
                    wordPercent += standardLetter;
                }
            })
            if (linePercent + wordPercent >= 90) {
                formattedText += line.trim() + '\n';
                if (totalLineCount === maxLinesPerParagraph) {
                    totalLineCount = 0;
                    line = '#- ' + word + ' ';

                }else {
                    line = word + ' ';
                }
                linePercent = wordPercent + space;
                totalLineCount++;
            } else if (wordPercent === -100) {
                line += '\n';
                if (totalLineCount === maxLinesPerParagraph) {
                    totalLineCount = 0;
                } else {
                    totalLineCount++;
                }


            }
            else {
                line += word + ' ';
                linePercent += wordPercent + space;
            }

        });

        if (line.trim().length > 0) {
            formattedText += line.trim() + '\n';
        }

    }

    return formattedText.trim();
}

function convertText() {
    let inputText = document.getElementById('inputText').value;
    let bookTitle = document.getElementById('bookTitle').value;
    stendhalFormattedText = convertToStendhalFormat(inputText, bookTitle);
    document.getElementById('output').innerText = stendhalFormattedText;
}

function downloadFile() {
    let bookTitle = document.getElementById('bookTitle').value || 'Untitled';
    let blob = new Blob([stendhalFormattedText], {type: 'text/plain'});
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = bookTitle + '.stendhal';
    link.click();

    // Очищення полів після завантаження файлу
    document.getElementById('bookTitle').value = '';
    document.getElementById('inputText').value = '';
    document.getElementById('output').innerText = '';
}

function isDigit(character) {
    return /\d/.test(character);
}