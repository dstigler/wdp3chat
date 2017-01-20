

$('.tab a').on('click', function (e) {
//function changeTab(){
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

    //target = $('#logintab').attr('href');

    $('#signup').hide();

    $('#login').fadeIn(600);
    $('#loginBtn').focus();

}

function createUser() {
    var nu = document.getElementById("newname").value;
    var ne = document.getElementById("newmail").value;
    var np = document.getElementById("newpwd").value;
    var cryptedPwd = CryptoJS.SHA1(password, "supersafe");
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
         /* e.preventDefault();

          $(this).parent().addClass('active');
          $(this).parent().siblings().removeClass('active');

          target = $(this).attr('href');

          $('.tab-content > div').not(target).hide();

          $(target).fadeIn(600);*/

          //TODO: set content of login
        },
        error: function(data){
            console.log('Invalid input');
        }
          /*
      localStorage.setItem('token', 'asY-x34SfYPk'); // write
      console.log(localStorage.getItem('token'));
      */
    });
    //console.log(nu, ne, np);
};

//var hash = require('./pass').hash;

function validateUser() {
    var ra = document.getElementById("uname").value;
    var rag = document.getElementById("pwd").value;
    var cryptedPwd = CryptoJS.SHA1(password, "supersafe");
    $.ajax({
       type: "PUT",
        url: "/login",
        contentType: "application/json", //text/html
        dataType: 'json',
       data:JSON.stringify({
           "username":ra,
           "password":cryptedPwd
          // "token":"empty"
       }),
       success: function(data){
           console.log('login success');
            window.location.href = "/api/chat";
       },
       error: function(){
           console.log('error');
           //console.log(data);
       }
   });

    /*function(data) {
      console.log(data.body);
      /*
      localStorage.setItem('token', 'asY-x34SfYPk'); // write
      console.log(localStorage.getItem('token'));
      */
    //};
    //console.log(ra, rag);

};

document.getElementById("pwd").addEventListener('keypress', function(e){
    var key = e.which || e.keyCode;
    if (key == 13){
        validateUser();
    }
});

document.getElementById("loginBtn").onclick = validateUser;

document.getElementById("createBtn").onclick = createUser;
