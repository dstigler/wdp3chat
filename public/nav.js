$("#homeBtn").click(function() {
   window.location.href = "/api/chat";
});

$("#usersBtn").click(function() {
   window.location.href = "/api/users";
});

$("#roomsBtn").click(function() {
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
