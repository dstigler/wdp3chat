var roomId;

$(function () {



    $.ajax({
        type: "GET",
        url: "/api/roomlist"
    }).success(function (rooms) {
        //roomId = rooms[0].id;
        //getMessages();
        console.log(rooms);
        $.each(rooms, function (key, room) {

            if(room.chat_name == "Mainchat"){
                var a = '<li class="state-default ui-selected"><a data-room-id="' + room._id +
                        '" class="room list-group-item">' + room.chat_name + '</a></li>';
                roomId = room._id;
                console.log(roomId);
            }else{
                var a = '<li class="state-default"><a data-room-id="' + room._id +
                        '" class="room list-group-item">' + room.chat_name + '</a></li>';
            }

            $("#rooms-sortable").append(a);
        });

    });
});

/*    $(document).on('click', 'a.room', function (event) {
        roomId = $(event.target).attr("data-room-id");
        console.log(roomId);
        //getMessages();
    });*/
function changeRoomId(){
    var roomId = $('li.ui-selected').next('a').find('data-room-id').val();
    console.log(roomId);
};
    $("#post-messages-button").click(function () {
        console.log($("#post-messages-area").val());
        var message = {text: $("#post-messages-area").val()};
        console.log("post-button pressed");
        $.ajax({
            type: "POST",
            url: "/api/messages/" + roomId,
            data: JSON.stringify(message),
            contentType : "application/json"
        }).success(function () {
            $("#post-messages-area").val("");
            //getMessages();
        });
    });

/*    $('body').on('click', 'a.room', function (event) {
        roomId = $(event.target).attr("data-room-id");
        getMessages();
    });

    function getMessages() {
        $.ajax({
            type: "GET",
            url: "/api/rooms/" + roomId + "/messages",
        }).success(function (data) {
            $("#roomName").text("Messages for " + data.room.name);
            var messages = "";
            $.each(data.messages, function (key, message) {
                messages += message.text + "\r";
            });
            $("#messages").val(messages);
        });
    }


*/
