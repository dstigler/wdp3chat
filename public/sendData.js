
function validate() {
    var ra = document.getElementById("uname").value;
    var rag = document.getElementById("pwd").value;
    $.ajax({
       type: "POST",
        url: "/login",
        contentType: "application/json",
        dataType: 'json',
       data:JSON.stringify({
           "username":ra,
           "password":rag
       })
    }).
    success( function(req, res) {
      console.log(req.body);
      console.log(res.body);
      /*
      localStorage.setItem('token', 'asY-x34SfYPk'); // write
      console.log(localStorage.getItem('token'));
      */
    });
    console.log(ra, rag);

}

document.getElementById("loginBtn").onclick = validate;
