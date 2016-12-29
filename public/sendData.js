
function validate() {
    var ra = document.getElementById("uname").value;
    var rag = document.getElementById("pwd").value;
    $.ajax({
       type: "POST",
        url: "/login",
        contentType: "application/json",
        dataType: 'json',
       data:JSON.stringify({
           username:ra,
           password:rag
       })
    }).
    success( function() {
      alert('success');

    });
    console.log(ra, rag);

}

document.getElementById("loginBtn").onclick = validate;
