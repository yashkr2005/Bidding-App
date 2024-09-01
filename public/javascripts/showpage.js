
const socket = io();

    document.getElementById("whatsapp").href  = "https://web.whatsapp.com/send?text=" + window.location.href;
    document.getElementById("telegram").href  = "https://telegram.me/share/url?url=" + window.location.href;
    document.getElementById("twitter").href  = "https://twitter.com/share?url=" + window.location.href;
    var present = Date.now();
    var end = Date.parse( endTime)
    if(present <= end )
    {
        var countDownDate =  Date.parse( startTime);
        if(present >= countDownDate)
        {
            countDownDate = end;
        }
        // Update the count down every 1 second
        var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

          // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
            
          var hr = Math.floor((distance) / (1000 * 60 * 60));
         var min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
         var sec = Math.floor((distance % (1000 * 60)) / 1000);


        var hrs="";
        var mins="";
        var secs="";
         if(hr<=9) hrs =  "0";
         if(min<=9) mins = "0";
        if(sec<=9) secs = "0";
        // Display the result in the element with id="demo"
         document.getElementById("hour").innerHTML = hrs + hr;
         document.getElementById("mint").innerHTML = mins + min;
         document.getElementById("secs").innerHTML = secs + sec;

        // If the count down is finished, write some text
        if (distance < 0)
         {
            clearInterval(x);
            location.reload();
         }
        }, 1000);
    }



const _inputForm = document.querySelector('#input-form')
const _inputButton = document.querySelector('#inputButton')
const _table = document.querySelector('#table-body')
const _notifications = document.querySelector('.notifications')

//templates
const infoTemplateWarning = document.querySelector('#infoTemplateWarning').innerHTML
const infoTemplateLight = document.querySelector('#infoTemplateLight').innerHTML
const errorTemplate = document.querySelector('#errorTemplate').innerHTML


//sockets
socket.on('value', (info) =>{
   
    if( info.username === username )
    {
        const html = Mustache.render(infoTemplateWarning, {
            username: info.username,
            price: info.price
           
        })
        document.querySelector('#table-body').insertAdjacentHTML('afterbegin', html)

    }
    else
    {
        const html = Mustache.render(infoTemplateLight, {
            username: info.username,
            price: info.price
            
        })
        document.querySelector('#table-body').insertAdjacentHTML('afterbegin', html)
    }
    
    document.querySelector('#BidValue').setAttribute('min',parseInt(info.price)+1)

})

socket.on('roomdata', (count)=>{
    document.querySelector('#activeusers').innerHTML = count
})

_inputForm.addEventListener('submit', (e)=>{
    
         
        if (!_inputForm.checkValidity()) {
          e.preventDefault()
          e.stopPropagation()
          _inputForm.classList.add('was-validated')
          return;
        }
  
    _inputForm.classList.add('was-validated')
    e.preventDefault()

    _inputButton.setAttribute('disabled', 'disabled')

    let data ={
        currentuser: {
            _id: currentUser,
            wallet:wallet },
        pro_id,
        price: document.querySelector('#BidValue').value

    }
    socket.emit('sendValue', data, (call)=>{
        _inputForm.classList.remove('was-validated')
        _inputButton.removeAttribute('disabled')
        _inputForm.reset()

        if(call){
            const html = Mustache.render(errorTemplate, { call })
            _notifications.insertAdjacentHTML('afterbegin', html)
            
        }
    })
})
const room = pro_id
    
socket.emit('join', {username, room}, ()=>{
    console.log('joined')
})

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})