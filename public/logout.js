function logoutUser() {
    $.ajax({
       type: "DELETE",
        url: "api/logout",
       success: function(){
           console.log('Logout');
           //console.log(data.token);
       },
       error: function(){
           console.log('error');
           //console.log(data);
       }
   });
}

document.getElementById("logoutBtn").onclick = logoutUser;
