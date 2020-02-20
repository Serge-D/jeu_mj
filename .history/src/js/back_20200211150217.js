window.addEventListener("DOMContentLoaded", function(){
    var webSocketClient = io("http://localhost:8080");

    webSocketClient.on("connect", function(){
        console.log("Connecté au serveur")
    })
})