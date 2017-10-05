$("#email-body").keyup(function(){
  if($("#email-body").val().length < 30){
    $('.count').text("Characters until send: " + (30 - $("#email-body").val().length));      
  } else {
    $('.count').text("Characters left: " + (500 - $("#email-body").val().length));      
  }
});

$(".submit-button").click(function(){
  sendMail()
});

$(".clear").click(function(){
  clear()
});

function clear(){
  $("#name").val("")
  $("#number").val("")
  $("#email").val("")
  $("#subject").val("")
  $("#email-body").val("")
}

$( "#close-message-sent-modal" ).click(function(e) {
  e.preventDefault()
  $("#message-sent-modal").hide()
});

function sendMail() {
  // $('.email-button').attr('disabled','disabled');
  var name = escape(document.getElementById('name').value);
  var number = escape(document.getElementById('number').value);
  var email = escape(document.getElementById('email').value);
  var subject = escape(document.getElementById('subject').value);
  var body = escape(document.getElementById('email-body').value);

  var url = "https://arcane-anchorage-33274.herokuapp.com/pbkEmail?name="+name+"&subject="+subject+"&email="+email+"&number="+number+"&body="+body;
  var canSend = validateForm(name, number, email, subject, body);
  callAPI(canSend, url, body);
}

var initAPI = function(){
  $.ajax({
    url: "https://arcane-anchorage-33274.herokuapp.com",
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(xhr.status, thrownError);
    }
  });
}

initAPI()

var run = false;
var display = function(){
    if(run){
      $('#message-sent-modal').show()
      run = false;
    }
    else {
      run = true;      
      setTimeout(display, 1000); // check again in a second
    }
}


var callAPI = function(canSend, url, body){
  if(canSend){
    display();
    $.ajax({
      url: url, 
      success: function(result){
        alert("Your message has been sent. We aim to reply within 48 hours.")
        $('.submit-button').removeAttr('disabled');
        clear()
      }, 
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.status, thrownError);
        alert("There has been an error sending this message. Please try again later!")
        $('.submit-button').removeAttr('disabled');
      }
    });
  } else {
    $('.submit-button').removeAttr('disabled'); 
  }
}

var validateForm = function(name, number, email, subject, body){
  var canSend = true;
  if(name == ""){
    $('#name').addClass('animated shake');
    canSend = false;
    $('#name').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $('#name').removeClass('shake');
    });
  }
  if(!validateEmail(email)){
    $('#email').addClass('animated shake');
    canSend = false;
    $('#email').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $('#email').removeClass('shake');
    });
  }
  if(subject == ""){
    $('#subject').addClass('animated shake');
    canSend = false;
    $('#subject').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $('#subject').removeClass('shake');
    });
  }
  if(body == "" || body.length < 30){
    canSend = false;
    $('#email-body').addClass('animated shake');
    $('#email-body').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $('#email-body').removeClass('shake');
    });
  }
  return canSend;
}

var validateEmail = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}