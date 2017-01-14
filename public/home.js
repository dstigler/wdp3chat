var roomId;

$(function () {
    getRooms();
    getMessages();
});

$("#rooms-sortable").click(function (){
    console.log("clicked");
    console.log("Value: "+$(this).children(".ui-selected").attr('id'));
    if (typeof $(this).children(".ui-selected").attr('id') != 'undefined'){
        roomId = $(this).children(".ui-selected").attr('id');
        //getMessages();
    }
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
        //getMessages();
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
            //console.log(data);
            //$("#roomName").text("Messages for " + data.room.name);
            var messages = "";
            $.each(data.messages, function (key, message) {
                messages += message.msg_user_name + ": " + message.msg_text + "\r";//message.text + "\r";
            });
            $("#chat-textarea").val(messages);
            setTimeout(getMessages, 1000);
        });
    };

    function getRooms(){
        $.ajax({
            type: "GET",
            url: "/api/roomlist"
        }).success(function (rooms) {
            //roomId = rooms[0].chat_name;
            //getMessages();
            console.log(rooms);
            var found = false;
            var mainId;
            $("#rooms-sortable").empty();
            $.each(rooms, function (key, room) {
                if(room.chat_name == "Mainchat"){
                    mainId = room._id;
                }
                if(roomId == 'undefined' && room.chat_name == "Mainchat"){
                    var a = '<li class="state-default ui-selected" id="'+room._id+'"><a class="room list-group-item">' + room.chat_name + '</a></li>';
                    roomId = room._id;
                    //getMessages();
                    console.log(roomId);
                    found = true;
                }else{
                    if(roomId == room._id){
                        var a = '<li class="state-default ui-selected" id="'+room._id+'"><a class="room list-group-item">' + room.chat_name + '</a></li>';
                        roomId = room._id;

                        console.log(roomId);
                        found = true;
                    }else{
                        var a = '<li class="state-default" id="'+room._id+'"><a class="room list-group-item">' + room.chat_name + '</a></li>';
                    }
                }
                if(found == false){
                    roomId = mainId;
                    $("#"+roomId).addClass("ui-selected");
                }
                $("#rooms-sortable").append(a);
            });
        });
        setTimeout(getRooms, 10000);
    };

//setTimeout(getMessages, 750);
document.getElementById("postMsgButton").onclick = postMessage;
//document.getElementById("rooms-sortable").onclick = setRoomId;
