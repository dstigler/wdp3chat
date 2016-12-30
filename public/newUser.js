function validate() {
    var nu = document.getElementById("newname").value;
    var ne = document.getElementById("newmail").value;
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
   }),
    function(data) {
      console.log(data.body);
      /*
      localStorage.setItem('token', 'asY-x34SfYPk'); // write
      console.log(localStorage.getItem('token'));
      */
    };
    console.log(nu, ne, np);

}

document.getElementById("createBtn").onclick = validate;
