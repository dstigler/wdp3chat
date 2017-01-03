$('.tab a').on('click', function (e) {

  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});

function createUser() {
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
       }),

        success: function(data) {
          console.log('Added User');

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
           //console.log(data.token);
           /*$.ajax({
               type: "GET",
               url: '/api/chat',
                success: function(file){
                    //$(window).load("views/index.html");
                    window.location.href = file;
                    //console.log(file);
                    // $(window).html(file);
                },
                dataType: 'html',
                contentType: 'text/html'
            });*/
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
