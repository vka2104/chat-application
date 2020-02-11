//the below codes for client side desing
//the below function for toggle between  sign up and login page
$("#signupform").hide();
$("#login").hide();
$(".loginText").hide();
$(".left").css({"box-shadow":"10px 10px 10px 10px rgb(182, 180, 180)","transition": "ease all 1s"});
$(".right").css({"box-shadow":"1px 1px 1px 1px rgb(182, 180, 180)","transition": "ease all 1s"});
//the below function will hide the sign up form and show only the login form
$('#login').click(function(){
    $("#signupform").hide();
    $('#forgetPasswordLink').show();
    $("#loginform").show();
    $("#login").hide();
    $(".loginText").hide();
    $(".signUpText").show();
    $("#signup").show();
    $(".right").css({"box-shadow":"10px 10px 10px 10px rgb(182, 180, 180)","transition": "ease all 1s"});
    $(".left").css({"box-shadow":"3px 3px 3px 3px rgb(182, 180, 180)","transition": "ease all 1s"});
 });
 //the below function will hide the login form and show only the sign up form
$('#signup').click(function(){
   $("#loginform").hide();
   $("#signupform").show();
   $('#forgetPasswordLink').hide();
   $("#signup").hide();
   $("#login").show();
   $(".loginText").show();
   $(".signUpText").hide();
   $(".left").css({"box-shadow":"10px 10px 10px 10px rgb(182, 180, 180)","transition": "ease all 1s"});
   $(".right").css({"box-shadow":"3px 3px 3px 3px rgb(182, 180, 180)","transition": "ease all 1s"});
});





// the below code for functionalities
const socket = io()

const form = document.querySelector('.chatfrom')
const messageField = document.querySelector('#message')
const locationButton = document.querySelector('#sharelocation')
const messages = document.querySelector('.messageContainer')
const sidebaruserslist = document.querySelector('.sidebaruserslist')
//templates
const messageTemplate = document.querySelector('#message-temlate').innerHTML
const replyTemplate = document.querySelector('#reply-temlate').innerHTML
const broadcastTemplate = document.querySelector('#broadcast-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-temlate').innerHTML
const locationReplyTemplate = document.querySelector('#location-reply-temlate').innerHTML
const sidebarTemplate = document.querySelector('#Users-list-temlate').innerHTML
//query string values
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

// //auto scroll 
// const autoscroll = () => {
//     //new message element
//     const newMessage = messages.lastElementChild
//     //height of the new message
//     const newMessageStyles = getComputedStyle(newMessage)
//     const newMessageMargin = parseInt(newMessageStyles.marginBottom)
//     const newMessageHeight = newMessage.offsetHeight + newMessageMargin
//     //visible height
//     const visibleHeight = messages.offsetHeight
//     //height of message container
//     const containerHeight = messages.scrollHeight

//     //How far i scrolled..?
//     const scrollOffset = messages.scrollTop + visibleHeight

//     if(containerHeight - newMessageHeight <= scrollOffset) {
//         messages.scrollTop = messages.scrollHeight
//     }
// }
//client litens the server's message and console it
socket.on('message', (message) => {
    console.log(message)
    //the below will render the template we given in the bottom 
    const html = Mustache.render(messageTemplate, {
        //this is a object we pass to the template to render a dynamic content
        //we can access this object by calling his key name to render it
        username: message.username,
        message: message.text,
        CreatedAt: moment(message.CreatedAt).format('h:mm a')
    })
    //the below method will insert our template and render the output in a window
    messages.insertAdjacentHTML('beforeend', html)
    // autoscroll()
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    locationButton.setAttribute('disabled','disabled')
    let message = messageField.value
    //then the client sent the return message to the client
    socket.emit('return',message, (error) => {
        locationButton.removeAttribute('disabled')
        messageField.value = ''
        messageField.focus()
        if(error)  return console.log(error) 
        console.log('Message Delivered Successfully...!')
    })
})

socket.on('reply', (reply) => {
     //the below will render the template we given in the bottom 
     const html = Mustache.render(replyTemplate, {
        //this is a object we pass to the template to render a dynamic content
        //we can access this object by calling his key name to render it
        username: reply.username,
        reply: reply.text,
        CreatedAt: moment(message.CreatedAt).format('h:mm a')
    })
    //the below method will insert our template and render the output in a window
    messages.insertAdjacentHTML('beforeend', html)
    // autoscroll()
})
socket.on('broadcast', (broadcastmessage) => {
    //the below will render the template we given in the bottom 
    const html = Mustache.render(broadcastTemplate, {
        //this is a object we pass to the template to render a dynamic content
        //we can access this object by calling his key name to render it
        username: broadcastmessage.username,
        broadcastmessage: broadcastmessage.text,
        CreatedAt: moment(message.CreatedAt).format('h:mm a')
    })
    //the below method will insert our template and render the output in a window
    messages.insertAdjacentHTML('beforeend', html)
    // autoscroll()
})

locationButton.addEventListener('click', () => {

    if(!navigator.geolocation) return alert('geolocation is not supported by your browser..!')

    locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition( (position) => {
        socket.emit('sendlocation', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }, () => {
        locationButton.removeAttribute('disabled')
        console.log('Location Shares successfully..!')
    })
    })
   
})
//the below two listners will render the location at the browser window
socket.on('locationmessage' , (url) => {
     //the below will render the template we given in the bottom 
     const html = Mustache.render(locationMessageTemplate, {
        //this is a object we pass to the template to render a dynamic content
        //we can access this object by calling his key name to render it
        username: url.username,
        url: url.text,
        CreatedAt: moment(message.CreatedAt).format('h:mm a')
    })
    //the below method will insert our template and render the output in a window
    messages.insertAdjacentHTML('beforeend', html)
    // autoscroll()
})

socket.on('locationreply', (url) => {
    //the below will render the template we given in the bottom 
    const html = Mustache.render(locationReplyTemplate, {
       //this is a object we pass to the template to render a dynamic content
       //we can access this object by calling his key name to render it
       username: url.username,
       url: url.text,
       CreatedAt: moment(message.CreatedAt).format('h:mm a')
   })
   //the below method will insert our template and render the output in a window
   messages.insertAdjacentHTML('beforeend', html)
//    autoscroll()
})

//the below will emit the user details to the server
socket.emit('join', {username, room}, error => {
    if(error) {
        alert(error)
        location.href = '/'
    }
    
})

//the below listner will send the user's list in a single room to the client for render it.
socket.on('userslist', ({ room, users }) => {
    //the below will render the template we given in the bottom 
    const html = Mustache.render(sidebarTemplate, {
        //this is a object we pass to the template to render a dynamic content
        //we can access this object by calling his key name to render it
        room,
        users
    })
    //the below method will insert our template and render the output in a window
    document.querySelector('.sidebaruserslist').innerHTML = html
    // autoscroll()
})
