function bindNavHandlers(){
  $( "#popup-overlay .close" ).on( "click", function(){
    $( "#popup-overlay" ).remove();
  });

  $( "nav .close" ).on( "click", function(){
    $( "nav" ).toggleClass( "hidden" );
  });

  $( ".mobile-nav-btn, nav li a" ).on( "click", function(){
    $( "nav" ).toggleClass( "hidden" );
  });

  $( ".memoriam" ).on( "click", function(){
    $( "#memoriam" ).toggleClass( "hidden" );
  });

  $( "#memoriam .close" ).on( "click", function(){
    $( "#memoriam" ).toggleClass( "hidden" );
  });
};

function bindFormHandler(){
  $( "#signup-form" ).submit( function( event ){
    event.preventDefault(); // avoid to execute the actual submit of the form.
    var form = $( this );
    // recpatcha is not filled out
    if( grecaptcha.getResponse().length === 0 ){
      // show the reminder
      $('.recaptcha-title').removeClass('hidden');
    } else {
      request = $.ajax({
        type: "POST",
        url: "includes/php/mailer.php",
        data: form.serialize(), // serializes the form's elements.
        success: function( data, textStatus, jqXHR ){
          form.trigger('reset');
          grecaptcha.reset();
          // console.log( data )
          returnedData = JSON.parse( data );
          console.log( returnedData.notes )
          try {
            if( returnedData.fail === true ){

              $('#fail-msg p').text( returnedData.notes );
              $('#fail-msg').removeClass('hidden');

              setTimeout(function(){
                $('#fail-msg').addClass('hidden');
              }, 5000);
            }
          } catch( err ){
            console.log( "Form invalid" );
          }
          
          try {
            if( returnedData.success === true ){
              $('#success-msg').removeClass('hidden');
              setTimeout(function(){
                $('#success-msg').addClass('hidden');
              }, 5000);
            }
          } catch( err ) {
            console.log( "JSON Parse error from server." )
          }
        },
      });

      request.fail( function( jqXHR, textStatus, errorThrown ){
        console.log( "Request has failed." )
        form.trigger('reset');
        grecaptcha.reset();
      });
    };
  });
};

function smoothScroll(){
  $('a[href*="#"]:not([href="#"])').on( "click", function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
};

function getFirstThursday(){
  var oneDay = 24 * 60 * 60 * 1000;
  var day = 1;
  var today = new Date();
  var prettyToday = today.toLocaleString("en-US", {timeZone: "America/New_York"});
  var prettyTodayMonth = prettyToday.split('/')[0];
  var prettyTodayDate = prettyToday.split('/')[1].split('/')[0];
  var prettyTodayYear = prettyToday.split(',')[0].split('/')[2];

  if( prettyTodayMonth > 8 ){
    year = parseInt(prettyTodayYear) + 1;
  } else {
    year = parseInt(prettyTodayYear);
  };

  while( day < 7 ){
    firstThursday = new Date( year, 7, day );
    if( firstThursday.getDay() !== 4 ){
      day++;
    } else {
      break;
    }
  };

  var prettyFirstThursday = firstThursday.toLocaleString("en-US", {timeZone: "America/New_York"});
  var prettyFirstThursdayMonth = prettyFirstThursday.split('/')[0];
  var prettyFirstThursdayDate = prettyFirstThursday.split('/')[1].split('/')[0];
  var prettyFirstThursdayYear = prettyFirstThursday.split(',')[0].split('/')[2];

  var daysLeft = Math.round( Math.abs( (today.getTime() - firstThursday.getTime() ) / oneDay ) );

  if( prettyTodayMonth == prettyFirstThursdayMonth &&
      (prettyTodayDate >= prettyFirstThursdayDate &&
      prettyTodayDate <= parseInt(prettyFirstThursdayDate)+4) )
  {
    $( ".day-counter .days" ).html( 'CBWT is happening now!' );
  } else {
    $( ".day-counter .days" ).html( daysLeft + ' days until CBWT!' );
  };

  $( ".trip-date .date" ).html( "Aug " + prettyFirstThursdayDate + " - " + (parseInt(prettyFirstThursdayDate)+4) + "" )
};

function _init(){
  bindNavHandlers();
  bindFormHandler();
  smoothScroll();
  getFirstThursday();
};

$( _init );