$('.tab a').on('click', function (e) {

  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});

function sendData(){
        //get the input value
        $name = $('#uname').val();
        $pwd = $('#pwd').val();
        $.ajax({
            //the url to send the data to
            url: "/login",
            //the data to send to
            data: {name : $name, pwd: $pwd},
            //type. for eg: GET, POST
            type: "POST",
            //datatype expected to get in reply form server
            dataType: "json",
            //on success
            success: function(data){
                console.log("success");//do something after something is recieved from php
            },
            //on error
            error: function(){
                //bad request
                console.log("error");
            }
        });
    }

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
       });
    }).
    success( function() {
      alert('success');

    });
    console.log(ra, rag);

};
