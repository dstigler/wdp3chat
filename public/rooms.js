$(function(){
    $.ajax({
        type: "GET",
        url: "/api/roomlist"
    }).success(function (rooms) {
        $.each(rooms, function (key, room) {
            console.log(room.deleteable);
            if(room.deleteable == 'true'){
                var a = '<li><a class="room">' + room.chat_name + '</a><input type="submit" id="' + room._id + '" onclick="deleteRoom()" value="Delete" ></li>';
            }else{
                var a = '<li><a class="room">' + room.chat_name + '</a></li>';
            }
            $(".roomList").append(a);
        });
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
