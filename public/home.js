var roomId;

$(function () {
    getRooms();
    document.getElementById("userAlias").innerHTML += localStorage.getItem("uname");


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
    var message = $("#btn-input").val();
    console.log(message);
    $.ajax({
        type: "POST",
        url: "/api/roomlist/messages"+roomId,
        data: JSON.stringify({
            "msg": message,
            "room": roomId}),
        contentType : "application/json"
    }).success(function () {
        $("#btn-input").val("");
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
            if (message.msg_user_name == localStorage.getItem("uname")){
                messages = messages + "<li class='right'><a><h2><pre>" + message.msg_user_name + "</pre></h2><p><pre>" + message.msg_text + "</pre></p></a></li>";
            } else {   // "<li style='clear:both; float: right;' ><a class='right pull-right'><div class='header'><strong class='unameFont'><xmp>" + message.msg_user_name + "</xmp></strong></div><p style='word-break: break-all; text-align: right;'><xmp>" + message.msg_text + "</xmp></p></a></li>" + messages;
                messages = messages + "<li class='left'><a><h2><pre>" + message.msg_user_name + "</pre></h2><p><pre>" + message.msg_text + "</pre></p></a></li>";
            }
        });
        if ( ! $(".chat-textarea li").length ){
            //$("#panel-body").mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
            console.log($("#panel-body").scrollTop());
        }

        $(".chat").empty();
        $(".chat").append(messages);
        setTimeout(getMessages, 500);
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
            var found = "nok";
            var mainId;
            console.log("Selected RoomId: "+roomId);
            $("#rooms-sortable").empty();
            $.each(rooms, function (key, room) {
                if(room.chat_name == "Mainchat"){
                    mainId = room._id;

                }
                if(roomId === undefined && room.chat_name == "Mainchat"){
                    var a = '<li class="ui-selected" id="'+room._id+'"><a class="room">' + room.chat_name + '</a></li>';
                    roomId = room._id;
                    getMessages();
                    console.log(roomId);
                    found = "ok";
                }else{
                    if(roomId == room._id){
                        var a = '<li class="ui-selected" id="'+room._id+'"><a class="room">' + room.chat_name + '</a></li>';
                        roomId = room._id;
                        found = "ok";
                    }else{
                        var a = '<li class="" id="'+room._id+'"><a class="room">' + room.chat_name + '</a></li>';
                    }

                }
                $("#rooms-sortable").append(a);
            });
            console.log(found);
            if(found == "nok"){
                roomId = mainId;
                $("#"+roomId).addClass("ui-selected");
            }
        });
        console.log("Saved: "+roomId);
        setTimeout(getRooms, 10000);
    };

//setTimeout(getMessages, 750);
document.getElementById("btn-chat").onclick = postMessage;
//document.getElementById("rooms-sortable").onclick = setRoomId;

document.getElementById("btn-input").addEventListener("keypress", function(e) {
        var key = e.which || e.keyCode;

        if(key == 13){
            postMessage();
        }
    });
