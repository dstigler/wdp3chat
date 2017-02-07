
function logoutUser() {
    $.ajax({
       type: "DELETE",
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
