$('.tab a').on('click', changeTab);


function changeTab(){

  $('.tab a').parent().addClass('active');
  $('.tab a').parent().siblings().removeClass('active');

  target = $('.tab a').attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

};

function createUser() {
    var nu = document.getElementById("newname").value;
    var ne = document.getElementById("newmail").value;
    var np = document.getElementById("newpwd").value;
    //var bla = $('#txt_name').val();
    $.ajax({
       type: "POST",
        url: "/login",
        contentType: "application/json",
        dataType: 'json',
       data:JSON.stringify({
           "username":nu,
           "email": ne,
           "password":np
       }),

        success: function(data) {
          console.log('Added User');
          changeTab();
          $('#uname').val(nu);
          $('#pwd').val(np);

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
    $.ajax({
       type: "PUT",
        url: "/login",
        contentType: "application/json", //text/html
        dataType: 'json',
       data:JSON.stringify({
           "username":ra,
           "password":rag
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


document.getElementById("loginBtn").onclick = validateUser;

document.getElementById("createBtn").onclick = createUser;
