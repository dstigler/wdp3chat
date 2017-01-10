var roomId;

$(function () {
    $.ajax({
        type: "GET",
        url: "/api/roomlist"
    }).success(function (rooms) {
        //roomId = rooms[0].chat_name;
        //getMessages();
        console.log(rooms);
        $.each(rooms, function (key, room) {

            if(room.chat_name == "Mainchat"){
                var a = '<li class="state-default ui-selected"><a data-room-id="' + room._id +
                        '" class="room list-group-item">' + room.chat_name + '</a></li>';
                roomId = room.chat_name;
                getMessages();
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
/*function changeRoomId(){
    roomId = $('li.ui-selected').next('a').find('data-room-id').val();
    console.log(roomId);
};


$('ul#rooms-sortable').on('click','li.state-default',function() {
    console.log('testing');
});
*/
//$("#post-messages-button").click(
function postMessage() {
    var message = $("#post-messages-area").val();
    $.ajax({
        type: "POST",
        url: "/api/roomlist/messages"+roomId,
        data: JSON.stringify({
            "msg": message,
            "room": roomId}),
        contentType : "application/json"
    }).success(function () {
        $("#post-messages-area").val("");
        getMessages();
    });
};//);

/*    $('body').on('click', 'a.room', function (event) {
        roomId = $(event.target).attr("data-room-id");
        getMessages();
    });
*/
    function getMessages() {
        $.ajax({
            type: "GET",
            url: "/api/roomlist/messages"+roomId,

            contentType : "application/json"
        }).success(function (data) {
            console.log(data);
            //$("#roomName").text("Messages for " + data.room.name);
            var messages = "";
            $.each(data.messages, function (key, message) {
                messages += message.msg_user_name + ": " + message.msg_text + "\r";//message.text + "\r";
            });
            $("#chat-textarea").val(messages);
        });
    };


setTimeout(getMessages, 500);
document.getElementById("postMsgButton").onclick = postMessage;
