// VARS
const note = document.querySelector('#note')
const status = document.querySelector('#status')
const exportBtn = document.querySelector('#export')
const bold = document.querySelector('#bold')
const italic = document.querySelector('#italic')
const underline = document.querySelector('#underline')
const strikethrough = document.querySelector('#strikethrough')
const ol = document.querySelector('#ol')
const ul = document.querySelector('#ul')
const indent = document.querySelector('#indent')
const outdent = document.querySelector('#outdent')
const link = document.querySelector('#link')

const config = {attributes: true, childList: true, characterData: true, subtree: true}
let noteData = {}
let firstLoad = true
let busy;


// FUNCS
const observer = new MutationObserver(() => {
    if (firstLoad === false) {
        busy ? clearTimeout(busy) : ''
        busy = setTimeout(() => save(), 1000)
    }
    firstLoad = false
})

function load() {
    chrome.storage.local.get((data) => {
        data.myNotes ? note.innerHTML = data.myNotes : ''
    })
}

function save() {
    chrome.storage.local.set({'myNotes': note.innerHTML}, () => {
        status.classList.add('show')
        setTimeout(() => status.classList.remove('show'), 2000)
    })
}

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
    makeLinksClickable()
}

function makeLinksClickable() {
    setTimeout(() => {
        const allLinks = document.querySelectorAll('a')
        allLinks.forEach(a => {
            a.addEventListener('mousedown', () => window.open(a.getAttribute('href'), '_blank'))
        })
        clearTimeout()
    }, 0)
}

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


// INVOKE FUNCS
load() // load data
makeLinksClickable() 
observer.observe(note, config) // watch DOM changes

// text formatting
bold.addEventListener('click', () => document.execCommand('bold'))
italic.addEventListener('click', () => document.execCommand('italic'))
underline.addEventListener('click', () => document.execCommand('underline'))
strikethrough.addEventListener('click', () => document.execCommand('strikethrough'))
ol.addEventListener('click', () => document.execCommand('insertOrderedList'))
ul.addEventListener('click', () => document.execCommand('insertUnorderedList'))
indent.addEventListener('click', () => document.execCommand("indent", true, null))
outdent.addEventListener('click', () => document.execCommand("outdent", true, null))
link.addEventListener('click', addLink)

// export content
exportBtn.addEventListener('click', () => exportContent(new Date().toDateString() + '.txt', 'text/plain;charset=utf-8'))
