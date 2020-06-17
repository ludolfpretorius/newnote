const note = document.querySelector('#note')
const font = document.querySelector('#fontSize')

let bold
let italic
let underline
let strikethrough

let noteData = {}

String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
}

function getSelectedText() {
    if (window.getSelection()) {
        bold = document.querySelector('strong')
        italic = document.querySelector('em')
        underline = document.querySelector('u')
        strikethrough = document.querySelector('s')

        noteData.selection = window.getSelection().getRangeAt(0)
        noteData.text = window.getSelection().toString()
        noteData.element = window.getSelection().anchorNode.parentNode
        noteData.rangeStart = window.getSelection().anchorOffset
        noteData.before = note.innerHTML.slice(0, window.getSelection().anchorOffset)
        noteData.after = note.innerHTML.slice(window.getSelection().focusOffset, -1)
    }
}

note.onmouseup = getSelectedText
note.onkeyup = getSelectedText
note.onclick = () => {
    font.classList.remove('show')
    document.querySelector('#focus') ? document.querySelector('#focus').id = '' : ''
    font.querySelector('input').value = 14
}


function formatText() {
    const target = event.currentTarget
    try {
        if (noteData.element === bold || noteData.element === italic || noteData.element === underline || noteData.element === strikethrough || noteData.element === noteData.lastFormat) {
            const el = noteData.element
            const parent = el.parentNode
            while (el.firstChild) parent.insertBefore(el.firstChild, el)
            el ? parent.removeChild(el) : ''
            noteData.lastFormat = ''
        } else if (noteData.element === note) {
            const el = document.createElement(target.getAttribute('data-tag'))
            noteData.selection.surroundContents(el)
            if (noteData.selection) {
                sel = window.getSelection()
                sel.removeAllRanges()
                sel.addRange(noteData.selection)
                noteData.element = el
            }
        }
    } catch(e) {
        alert('Formatting mixed content e.g. a selection of both bold and regular text, doesn\'t work yet. Updates are coming, but for now, please try and avoid formatting mixed content 😅')
        console.error('Formatting mixed content e.g. a selection of both bold and regular text, doesn\'t work yet. Updates are coming, but for now, please try and avoid formatting mixed content 😅')
    }
}

function spanForFontSize() {
    try {
        event.currentTarget.classList.add('show')
        if (!document.querySelector('#focus')) {
            const el = document.createElement('span')
            el.id = 'focus'
            noteData.selection.surroundContents(el)
        }
    } catch(e) {
        alert('Formatting mixed content e.g. a selection of both bold and regular text, doesn\'t work yet. Updates are coming, but for now, please try and avoid formatting mixed content 😅')
        console.error('Formatting mixed content e.g. a selection of both bold and regular text, doesn\'t work yet. Updates are coming, but for now, please try and avoid formatting mixed content 😅')
        font.classList.remove('show')
    }
}

function fontSize() {
    const focus = document.querySelector('#focus')
    focus.style.fontSize = event.currentTarget.value + 'px'
}

function exportContent(filename, type) {
    const data = note.innerText.replace(/\n\s*\n/g, '\n\n')
    const file = new Blob([data], {type: type});
    const a = document.createElement("a"),
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}