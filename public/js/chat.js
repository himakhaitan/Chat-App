const socket = io()

// Elements
const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#sendLocation')
const $message = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locatioMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// options
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const autoScroll = () => {
    // New message elemt
    const $newMessage = $message.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    // Visible Height

    const visibleHeight = $message.offsetHeight

    // Height of message container
    const containerHeight = $message.scrollHeight

    // how far have i scrolled
    const scrollOffSet = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffSet) {
        $message.scrollTop = $message.scrollHeight
    }
}

socket.on('message', (message) => {
   

    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
        username: message.username
    })
    $message.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', (message) => {

    const html = Mustache.render(locatioMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a'),
        username: message.username
    })
    $message.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // diable button

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        // enable button

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
           return console.log(error)
        }
        console.log('message delivered')
    })
})

$sendLocationButton.addEventListener('click', (e) =>{
    // disable button
    
    e.preventDefault()

    if(!navigator.geolocation) {
        return alert('Geolocation is not supported with your browser!')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }, (info) => {
                $sendLocationButton.removeAttribute('disabled')
                    console.log('Location Shared to the console!')
            })
    })
    
})

socket.emit('join',{
    username, room
}, (error) =>{
    if(error) {
        alert(error)
        location.href = '/'
    }
})