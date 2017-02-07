

$('.tab a').on('click', function (e) {
  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});


function changeSignupToLogin(){

    $('#logintab').addClass('active');
    $('#signuptab').removeClass('active');

    $('#signup').hide();

    $('#login').fadeIn(600);
    $('#loginBtn').focus();

}

function createUser() {
    var nu = document.getElementById("newname").value;
    var ne = document.getElementById("newmail").value;
    var np = document.getElementById("newpwd").value;
    var cryptedPwd = CryptoJS.SHA1(np, "supersafe").toString();
    $.ajax({
       type: "POST",
        url: "/login",
        contentType: "application/json",
        dataType: 'json',
       data:JSON.stringify({
           "username":nu,
           "email": ne,
           "password":cryptedPwd
       }),

        success: function(data) {
          console.log('Added User');

          $('#uname').val(nu);
          $('#pwd').val(np);
         changeSignupToLogin();
        },
        error: function(data){
            $('#newname').val('');
            $('#newpwd').val('');
            $('#ErrorMsgSignup').val('Username already exists');
            console.log(data);
        }
    });
};


function validateUser() {
    var ra = document.getElementById("uname").value;
    var rag = document.getElementById("pwd").value;
    var cryptedPwd = CryptoJS.SHA1(rag, "supersafe").toString();
    $.ajax({
       type: "PUT",
        url: "/login",
        contentType: "application/json",
        dataType: 'json',
       data:JSON.stringify({
           "username":ra,
           "password":cryptedPwd
       }),
       success: function(data){
           console.log('login success');
            window.location.href = "/api/chat";

            localStorage.setItem("uname", data.username);
            console.log(localStorage.getItem("uname"));
       },
       error: function(data){
           $('#uname').val('');
           $('#pwd').val('');
           $('#ErrorMsgLogin').text('Username or password incorrect');
           console.log(data);
       }
   });

};

document.getElementById("pwd").addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key == 13){
        validateUser();
    }
});

document.getElementById("newpwd").addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key == 13){
        createUser();
    }
});

document.getElementById("loginBtn").onclick = validateUser;

document.getElementById("createBtn").onclick = createUser;
