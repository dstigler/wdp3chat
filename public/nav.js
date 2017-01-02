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
       type: "GET",
        url: "/api/logout",
       success: function(){
           console.log('Logout');
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
});
