//var hash = require('./pass').hash;

function validate() {
    var ra = document.getElementById("uname").value;
    var rag = document.getElementById("pwd").value;
    $.ajax({
       type: "PUT",
        url: "/login",
        contentType: "application/json",
        dataType: 'json',
       data:JSON.stringify({
           "username":ra,
           "password":rag
       })
   }),
    function(data) {
      console.log(data.body);
      /*
      localStorage.setItem('token', 'asY-x34SfYPk'); // write
      console.log(localStorage.getItem('token'));
      */
    };
    console.log(ra, rag);

}
$.get('/login').done(function(data){ alert(data); });
document.getElementById("loginBtn").onclick = validate;
