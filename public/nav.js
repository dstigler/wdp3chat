$("#homeBtn").click(function() {
    /*$.ajax({
       type: "GET",
        url: "/api/chat",
       success: function(){
           console.log('Chat');
           window.location.href = "/api/chat";
           //console.log(data.token);
       },
       error: function(){
           console.log('error');
           //console.log(data);
       }
   });*/
   window.location.href = "/api/chat";
});

$("#usersBtn").click(function() {
    /*$.ajax({
       type: "GET",
        url: "/api/users",
       success: function(){
           console.log('users');
           //console.log(data.token);
       },
       error: function(){
           console.log('error');
           //console.log(data);
       }
   });*/
   window.location.href = "/api/users";
});

$("#roomsBtn").click(function() {
    /*$.ajax({
       type: "GET",
        url: "/api/rooms",
       success: function(){
           console.log('rooms');
           //console.log(data.token);
       },
       error: function(){
           console.log('error');
           //console.log(data);
       }
   });*/
   window.location.href = "/api/rooms";
});

$("#logoutBtn").click(logoutUser);

function logoutUser() {
    $.ajax({
       type: "GET",
        url: "/api/logout",
       success: function(){
           console.log('Logout');
           window.location.href = "/";
          /* $.ajax({
              type: "GET",
               url: "/",
              success: function(){
                  console.log('Ok');
                  //console.log(data.token);
              },
              error: function(){
                  console.log('error');
                  //console.log(data);
              }
          });*/

       },
       error: function(){
           console.log('error');
           //console.log(data);
       }
   });
   $.get('login.html')
     .success(function(data){
         $(window).html(data);
     });
};
