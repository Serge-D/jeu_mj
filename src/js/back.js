window.addEventListener("DOMContentLoaded", function(){
    var webSocketClient = io("http://localhost:8080");

    function sendData() {
        var XHR = new XMLHttpRequest();
    
        // Liez l'objet FormData et l'élément form
        console.log(form)
        var FD = new FormData(form);
        console.log(FD)
      }
    var form = document.getElementById("tarace")
    webSocketClient.on("connect", function(){
        console.log("Connecté au serveur");
    })

    webSocketClient.on("updaterooms", function(rooms){
        console.log(rooms);
    })

    document.getElementById("tarace").addEventListener("submit", (event)=>{
        var formData = new FormData(event.target)
        sendData()
        formData = {room: "partie 1"}
        console.log(event, formData)
        event.preventDefault()
        webSocketClient.emit('create_room', {room: formData})
    })
       
})