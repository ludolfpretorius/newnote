
const note = document.querySelector('#note')
// const font = document.querySelector('#fontSize')
const status = document.querySelector('#status')
const exportBtn = document.querySelector('#export')

const bold = document.querySelector('#bold')
const italic = document.querySelector('#italic')
const underline = document.querySelector('#underline')
const strikethrough = document.querySelector('#strikethrough')
const ol = document.querySelector('#ol')
const ul = document.querySelector('#ul')
const link = document.querySelector('#link')

let noteData = {}
let firstLoad = true

load()

bold.addEventListener('click', () => document.execCommand('bold'))
italic.addEventListener('click', () => document.execCommand('italic'))
underline.addEventListener('click', () => document.execCommand('underline'))
strikethrough.addEventListener('click', () => document.execCommand('strikethrough'))
ol.addEventListener('click', () => document.execCommand('insertOrderedList'))
ul.addEventListener('click', () => document.execCommand('insertUnorderedList'))
exportBtn.addEventListener('click', () => exportContent(new Date().toDateString() + '.txt', 'text/plain;charset=utf-8'))
function addLink() {
    if (window.getSelection().anchorNode.parentNode.nodeName === 'DIV' || window.getSelection().anchorNode.parentNode.nodeName === 'LI' || window.getSelection().anchorNode.parentNode.nodeName === 'B' || window.getSelection().anchorNode.parentNode.nodeName === 'I' || window.getSelection().anchorNode.parentNode.nodeName === 'U' || window.getSelection().anchorNode.parentNode.nodeName === 'STRIKE') {
        const linkURL = prompt('Enter a URL:', 'http://');
        if (linkURL) {
            document.execCommand('createlink', false, linkURL)
        }
    } else {
        const node = window.getSelection().anchorNode.parentNode
        node.replaceWith(...node.childNodes)
    }
}
link.addEventListener('click', addLink)

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
const observer = new MutationObserver((mutations, observer) => {
    if (firstLoad === false) {
        busy ? clearTimeout(busy) : ''
        busy = setTimeout(() => save(), 1000)
    }
    firstLoad = false
})
const config = { attributes: true, childList: true, characterData: true, subtree: true }
observer.observe(note, config)
note.addEventListener('input',() => {
    const allLinks = document.querySelectorAll('a')
    allLinks.forEach(a => {
        a.setAttribute('onclick', "window.open('" + a.getAttribute('href') + "', '_blank')")
    })
})

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






// String.prototype.splice = function(start, delCount, newSubStr) {
//     return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
// }

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
