$(function () {

    var roomId;

    $.ajax({
        type: "GET",
        url: "/api/roomlist"
    }).success(function (rooms) {
        roomId = rooms[0].id;
        //getMessages();
        $.each(rooms, function (key, room) {
            console.log(rooms);
            if(room.chat_name == "Mainchat"){
                var a = '<li class="state-default ui-selected"><a data-room-id="' + room._id +
                        '" class="room list-group-item">' + room.chat_name + '</a></li>';
            }else{
                var a = '<li class="state-default"><a data-room-id="' + room._id +
                        '" class="room list-group-item">' + room.chat_name + '</a></li>';
            }

            $("#rooms-sortable").append(a);
        });

    });

    $('body').on('click', 'a.room', function (event) {
        roomId = $(event.target).attr("data-room-id");
        //getMessages();
    });

    $("#post-messages-button").click(function () {
        var message = {text: $("#post-messages-area").val()};

        $.ajax({
            type: "POST",
            url: "/api/roomlist/" + roomId + "/messages",
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
});
