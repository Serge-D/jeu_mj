
window.addEventListener("DOMContentLoaded", function(){
    var ioClient = io("http://localhost:8080");

    function sendData() {
        var XHR = new XMLHttpRequest();
    
        // Liez l'objet FormData et l'élément form
        console.log(form)
        var FD = new FormData(form);
        console.log(FD)
    }

    var formRoom = document.getElementById("createRoom")
    
    
    ioClient.on("connect", function(){
        console.log("Connecté au serveur");
    })

    ioClient.on("updaterooms", function(rooms){
        console.log(rooms);
    })

    formRoom.addEventListener("submit", (event)=>{
        var formData = new FormData(event.target)
        sendData()
        formData = {room: formRoom.elements[0].value}
        console.log(event, formData)
        ioClient.emit('create_room', {room: formData})
    })
    
    // function switchRoom(room){
    //     socket.emit("switchRoom", room)
    // }
    
    
})


/*
changer mon pug room avec un form pour la creation d'une room (lui donner un nom)
la room la configurer avec un uuid le nom et minimunjoueur et maxjoueur 
afficher la liste des rooms deja existantes et donner la possibilité de la rejoindre  

ensuite dans chaque room emit la page jeu et faire fonctions pour afficher les questions et reponses 
*/