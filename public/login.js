(
    function(){
        var k=CryptoJS,
            b=k.lib,
            m=b.WordArray,
            l=b.Hasher,
            d=[],
            b=k.algo.SHA1=l.extend({
                _doReset:function(){
                    this._hash=new m.init([1732584193,4023233417,2562383102,271733878,3285377520])
                },
                _doProcessBlock:function(n,p){
                    for(var a=this._hash.words,e=a[0],f=a[1],h=a[2],j=a[3],b=a[4],c=0;80>c;c++){
                        if(16>c)d[c]=n[p+c]|0;
                        else{
                            var g=d[c-3]^d[c-8]^d[c-14]^d[c-16];
                            d[c]=g<<1|g>>>31
                        }
                        g=(e<<5|e>>>27)+b+d[c];
                        g=20>c?g+((f&h|~f&j)+1518500249):40>c?g+((f^h^j)+1859775393):60>c?g+((f&h|f&j|h&j)-1894007588):g+((f^h^j)-899497514);
                        b=j;
                        j=h;
                        h=f<<30|f>>>2;
                        f=e;
                        e=g
                    }
                    a[0]=a[0]+e|0;
                    a[1]=a[1]+f|0;
                    a[2]=a[2]+h|0;
                    a[3]=a[3]+j|0;
                    a[4]=a[4]+b|0
                },_doFinalize:function(){
                var b=this._data,d=b.words,a=8*this._nDataBytes,e=8*b.sigBytes;
                d[e>>>5]|=128<<24-e%32;
                d[(e+64>>>9<<4)+14]=Math.floor(a/4294967296);
                d[(e+64>>>9<<4)+15]=a;b.sigBytes=4*d.length;
                this._process();
                return this._hash},clone:function(){
                    var b=l.clone.call(this);
                    b._hash=this._hash.clone();
                    return b
                }
            });
            k.SHA1=l._createHelper(b);
            k.HmacSHA1=l._createHmacHelper(b)
        })();


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
    var cryptedPwd = CryptoJS.SHA1(password);
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
    var cryptedPwd = CryptoJS.SHA256(password);
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
