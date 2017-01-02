$("#homeBtn").click(function() {
    $.ajax({
       type: "GET",
        url: "/api/chat",
       success: function(){
           console.log('Chat');
           //console.log(data.token);
       },
       error: function(){
           console.log('error');
           //console.log(data);
       }
   });
});

$("#usersBtn").click(function() {
    $.ajax({
       type: "GET",
        url: "/api/users",
       success: function(){
           console.log('Chat');
           //console.log(data.token);
       },
       error: function(){
           console.log('error');
           //console.log(data);
       }
   });
});

$("#roomsBtn").click(function() {
    $.ajax({
       type: "GET",
        url: "/api/rooms",
       success: function(){
           console.log('Chat');
           //console.log(data.token);
       },
       error: function(){
           console.log('error');
           //console.log(data);
       }
   });
});

$("#logoutBtn").click(function logoutUser() {
    $.ajax({
       type: "DELETE",
        url: "/api/logout",
       success: function(){
           console.log('Logout');
           //console.log(data.token);
       },
       error: function(){
           console.log('error');
           //console.log(data);
       }
   });
});
