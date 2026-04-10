async function loadMessages() {
    const response = await fetch('/chats/1/messages')
    const messages = await response.json()

    const div = document.querySelector('div')

    if(!div) return

    div.innerHTML = ""

    messages.forEach(m => {
        const p = document.createElement('p')
        p.textContent = `${m.username}: ${m.text}`
        div.appendChild(p)
    })
}

loadMessages()

const buttons = document.querySelectorAll('.delete-btn')

buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
        console.log("Klik")
        const id = btn.dataset.id

        console.log("før fetch")
        
        const response = await fetch(`http://localhost:8000/chats/${id}`, {
    method: 'DELETE'
})

        console.log("efter fetch", response.status)
        if (response.ok) {
            btn.parentElement.remove()
        }
    })
});