function validate() {
    var nu = document.getElementById("newname").value;
    var np = document.getElementById("newmail").value;
    var np = document.getElementById("newpwd").value;
    $.ajax({
       type: "POST",
        url: "/login",
        contentType: "application/json",
        dataType: 'json',
       data:JSON.stringify({
           "username":nu,
           "email": ne,
           "password":np
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
    console.log(nu, ne, np);

}

document.getElementById("createBtn").onclick = validate;
