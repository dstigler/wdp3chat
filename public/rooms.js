function createRoom() {
    var nr = document.getElementById("newRoomName").value;

    $.ajax({
       type: "POST",
        url: "/api/roomlist",
        contentType: "application/json",
        dataType: 'json',
       data:JSON.stringify({
           "roomName":nr,
       }),

        success: function(data) {
          console.log(data);
          $("#newRoomName").val("");
        },
        error: function(data){
            console.log(data);
        }
    });
};

document.getElementById("createRoomBtn").onclick = postMessage;
