
const note = document.querySelector('#note')
const font = document.querySelector('#fontSize')
const status = document.querySelector('#status')

const bold = document.querySelector('#bold')
const italic = document.querySelector('#italic')
const underline = document.querySelector('#underline')
const strikethrough = document.querySelector('#strikethrough')

let noteData = {}

String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
}

load()

bold.addEventListener('click', () => document.execCommand('bold'))
italic.addEventListener('click', () => document.execCommand('italic'))
underline.addEventListener('click', () => document.execCommand('underline'))
strikethrough.addEventListener('click', () => document.execCommand('strikethrough'))

function exportContent(filename, type) {
    const data = note.innerText.replace(/\n\s*\n/g, '\n\n')
    const file = new Blob([data], {type: type})
    const a = document.createElement("a")
    const url = URL.createObjectURL(file)
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url) 
    }, 0)
}

let busy
const observer = new MutationObserver(function(mutations, observer) {
    busy ? clearTimeout(busy) : ''
    busy = setTimeout(() => save(), 1000) 
});
const config = { attributes: true, childList: true, characterData: true, subtree: true };
observer.observe(note, config);

function save() {
    chrome.storage.local.set({'myNotes': note.innerHTML}, () => {
        status.classList.add('show')
        setTimeout(() => status.classList.remove('show'), 2000)
    })
}

function load() {
    chrome.storage.local.get((data) => {
        data.myNotes ? note.innerHTML = data.myNotes : ''
    })
}








// function getSelectedText() {
//     if (window.getSelection() && window.getSelection().anchorOffset < window.getSelection().focusOffset) {
//         bold = document.querySelector('b')
//         italic = document.querySelector('i')
//         underline = document.querySelector('u')
//         strikethrough = document.querySelector('s')

//         noteData.selection = window.getSelection().getRangeAt(0)
//         noteData.text = window.getSelection().toString()
//         noteData.element = window.getSelection().anchorNode.parentNode
//         noteData.rangeStart = window.getSelection().anchorOffset
//         noteData.rangeEnd = window.getSelection().focusOffset
//         noteData.before = note.innerHTML.slice(0, window.getSelection().anchorOffset)
//         noteData.after = note.innerHTML.slice(window.getSelection().focusOffset, -1)
//         noteData.lastFormat === null
//         noteData.fromOldSelection = false
//     } else if (window.getSelection() && window.getSelection().anchorOffset < window.getSelection().focusOffset) {
//         console.log(window.getSelection().anchorOffset)
//         console.log(window.getSelection().focusOffset)
//         window.getSelection().empty()
//     }
// }

// note.onmouseup = getSelectedText
// note.onkeyup = getSelectedText

// function spanForFontSize() {
//     try {
//         event.currentTarget.classList.add('show')
//         if (!document.querySelector('#focus')) {
//             const el = document.createElement('span')
//             el.id = 'focus'
//             noteData.selection.surroundContents(el)
//             if (noteData.selection) {
//                 sel = window.getSelection()
//                 sel.removeAllRanges()
//                 sel.addRange(noteData.selection)
//                 noteData.element = el
//             }
//         }
//     } catch(e) {
//         alert('Formatting mixed content e.g. a selection of both bold and regular text, doesn\'t work yet. Updates are coming, but for now, please try and avoid formatting mixed content 😅')
//         console.error('Formatting mixed content e.g. a selection of both bold and regular text, doesn\'t work yet. Updates are coming, but for now, please try and avoid formatting mixed content 😅')
//         font.classList.remove('show')
//     }
// }

// function fontSize() {
//     const focus = document.querySelector('#focus')
//     focus.style.fontSize = event.currentTarget.value + 'px'
//     if (noteData.selection) {
//         sel = window.getSelection()
//         sel.removeAllRanges()
//         sel.addRange(noteData.selection)
//         noteData.element = el
//     }
// }
