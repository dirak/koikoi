const writeEvent = (text) => {
	const parent = document.querySelector("#debug_events")
	const el = document.createElement("li")

	el.innerHTML = text
	parent.appendChild(el)
}

writeEvent("Listening to Server")

const socket = io()
socket.on('message', writeEvent)

document.querySelector("#knock_button").addEventListener('click',() => {
	socket.emit('message', 'knock-knock')
})