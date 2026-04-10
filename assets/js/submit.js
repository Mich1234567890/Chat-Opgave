async function loadMessages() {
    const response = await fetch('/chats/1/messages')
    const messages = await response.json()

    const div = document.querySelector('div')

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
        
        const response = await fetch(`/chats/${id}`,{
            metode: 'delete'
        })
        if (response.ok) {
            btn.parentElement.remove()
        }
    })
});