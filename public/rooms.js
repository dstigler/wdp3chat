$(function{
    $.ajax({
        type: "GET",
        url: "/api/roomlist"
    }).success(function (rooms) {
        $.each(rooms, function (key, room) {
            if(room.editable == 'true'){
                var a = '<li><a class="room">' + room.chat_name + '</a><button id="deleteRoomBtn" value="'+room._id+'">Delete</button></li>';
            }else{
                var a = '<li><a class="room">' + room.chat_name + '</a></li>';
            }
            $("#roomList").append(a);
        });
});

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

function deleteRoom() {
    var rId = $(this).value();

    $.ajax({
       type: "DELETE",
        url: "/api/roomlist",
        contentType: "application/json",
        dataType: 'json',
       data:JSON.stringify({
           "roomId":rId,
       }),

        success: function(data) {
          console.log(data);
        },
        error: function(data){
            console.log(data);
        }
    });
};
document.getElementById("createRoomBtn").onclick = createRoom;
document.getElementById("deleteRoomBtn").onclick = deleteRoom;
