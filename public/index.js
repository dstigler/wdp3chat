var roomId;
var newMessage = false;
//var escape = require('escape-html');

$(function () {
    getRooms();
    document.getElementById("userAlias").innerHTML += localStorage.getItem("uname");


});

$("#rooms-sortable").click(function (){
    console.log("clicked");
    console.log("Value: "+$(this).children(".ui-selected").attr('id'));
    if (typeof $(this).children(".ui-selected").attr('id') != 'undefined'){
        roomId = $(this).children(".ui-selected").attr('id');
    }
});

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
        var element = document.getElementById("panel-body");
        element.scrollTop = element.scrollHeight;
        newMessage = true;
    });
};

function getMessages() {
    $.ajax({
        type: "GET",
        url: "/api/roomlist/messages"+roomId,

        contentType : "application/json"
    }).success(function (data) {
        var messages = "";
        $.each(data.messages, function (key, message) {
            console.log(message);
            if (message.msg_user_name == localStorage.getItem("uname")){

                messages = messages + "<li class='right'><a><h4>" + message.msg_user_name + "</h4><p>" + message.msg_text + "</p></a></li>";
            } else {
                messages = messages + "<li class='left'><a><h4>" + message.msg_user_name + "</h4><p>" + message.msg_text + "</p></a></li>";
            }
        });
        if ( ! $(".chat-textarea li").length ){

            $(".chat").append(messages);
            var element = document.getElementById("panel-body");
            element.scrollTop = element.scrollHeight;
        }else{
            $(".chat").empty();
            $(".chat").append(messages);
            if (newMessage){
                var element = document.getElementById("panel-body");
                element.scrollTop = element.scrollHeight;
            }
            newMessage = false;
        }
        setTimeout(getMessages, 500);
    });
};

    function getRooms(){
        $.ajax({
            type: "GET",
            url: "/api/roomlist"
        }).success(function (rooms) {
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

document.getElementById("btn-chat").onclick = postMessage;
document.getElementById("btn-input").addEventListener("keypress", function(e) {
        var key = e.which || e.keyCode;
        if (key == 13){
            postMessage();
        }

    });

