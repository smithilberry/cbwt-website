void (() => {
  let $memoriumLink = undefined;
  let $memoriumCloseBtn = undefined;
  let $memoriumEl = undefined;
  let $mobileNavBtn = undefined;
  let $mobileNavCloseBtn = undefined;
  let $mobileNavEl = undefined;
  let $daysEl = undefined;
  let $dateEl = undefined;
  let $yearDate = undefined;
  let $formName = undefined;
  let $formEmail = undefined;
  let $formSubmit = undefined;

  const _toggleMemoriumView = () => {
    $memoriumEl.classList.toggle("hidden");
  };

  const _toggleMobileNavView = () => {
    $mobileNavEl.classList.toggle("hidden");
  };

  const _setYearDate = () => {
    $yearDate.forEach($el => {
      $el.innerHTML = new Date().getFullYear();
    });
  };

  const _getFirstThursday = () => {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    let day = 1;
    let year = "";
    let firstThursday = undefined;
    let prettyToday = today.toLocaleString("en-US", { timeZone: "America/New_York" });
    let prettyTodayMonth = prettyToday.split("/")[0];
    let prettyTodayDate = prettyToday.split("/")[1].split("/")[0];
    let prettyTodayYear = prettyToday.split(",")[0].split("/")[2];

    if (prettyTodayMonth > 8) {
      year = parseInt(prettyTodayYear) + 1;
    } else {
      year = parseInt(prettyTodayYear);
    }

    for (let day = 1; day < 7; day++) {
      firstThursday = new Date(year, 7, day);

      if (firstThursday.getDay() === 4) {
        break;
      }
    }

    const prettyFirstThursday = firstThursday.toLocaleString("en-US", {
      timeZone: "America/New_York"
    });
    const prettyFirstThursdayMonth = prettyFirstThursday.split("/")[0];
    const prettyFirstThursdayDate = prettyFirstThursday.split("/")[1].split("/")[0];
    // var prettyFirstThursdayYear = prettyFirstThursday.split(",")[0].split("/")[2];

    var daysLeft = Math.round(Math.abs((today.getTime() - firstThursday.getTime()) / oneDay));

    if (
      prettyTodayMonth == prettyFirstThursdayMonth &&
      prettyTodayDate >= prettyFirstThursdayDate &&
      prettyTodayDate <= parseInt(prettyFirstThursdayDate) + 4
    ) {
      $daysEl.innerHTML = "CBWT is happening now!";
    } else {
      $daysEl.innerHTML = `${daysLeft} days until CBWT!`;
    }

    $dateEl.innerHTML = `Aug ${prettyFirstThursdayDate} - ${parseInt(prettyFirstThursdayDate) + 4}`;
  };

  const _sendEmail = () => {
    const formName = $formName.value;
    const formEmail = $formEmail.value;
    const canSubmit = formName.length > 0 && formEmail.length > 0;
    const emailMsg = {
      Host: "smtp.gmail.com",
      Username: process.env.EMAIL_ADDRESS,
      Password: process.env.EMAIL_PASSWORD,
      To: process.env.EMAIL_ADDRESS,
      From: process.env.EMAIL_ADDRESS,
      Subject: "A new sign-up from campbikewinetour.com!",
      Body: `Someone has signed up to get notified about CBWT updates. Here is their info:

      Name: ${formName}
      Email: ${formEmail}`
    };

    console.log(process.env.EMAIL_ADDRESS);

    if (canSubmit && window.Email) {
      window.Email.send(emailMsg)
        .then(msg => {
          alert("success");
        })
        .catch(err => {
          alert("faiure");
        });
    } else {
      // alert("mail did not send");
    }
  };

  const _bind = () => {
    $memoriumLink = document.querySelector(".memorium-link");
    $memoriumCloseBtn = document.querySelector(".memorium-close-btn");
    $memoriumEl = document.querySelector("#memoriam");
    $mobileNavBtn = document.querySelector(".mobile-nav-btn");
    $mobileNavCloseBtn = document.querySelector(".nav-bar--close");
    $mobileNavEl = document.querySelector(".nav-bar--nav");
    $daysEl = document.querySelector(".day-counter .days");
    $dateEl = document.querySelector(".trip-date .date");
    $yearDate = Array.from(document.querySelectorAll(".year-date"));
    $formName = document.querySelector("#signup-form--name");
    $formEmail = document.querySelector("#signup-form--email");
    $formSubmit = document.querySelector("#signup-form--submit");
  };

  const _listen = () => {
    $memoriumLink.addEventListener("click", _toggleMemoriumView);
    $memoriumCloseBtn.addEventListener("click", _toggleMemoriumView);
    $mobileNavBtn.addEventListener("click", _toggleMobileNavView);
    $mobileNavCloseBtn.addEventListener("click", _toggleMobileNavView);
    $formSubmit.addEventListener("click", _sendEmail);
  };

  const _init = () => {
    _bind();
    _listen();
    _setYearDate();
    _getFirstThursday();
    // _bindFormHandler();
  };

  document.addEventListener("DOMContentLoaded", _init);
})(document);

// function bindFormHandler(){
//   $( "#signup-form" ).submit( function( event ){
//     event.preventDefault(); // avoid to execute the actual submit of the form.
//     var form = $( this );
//     // recpatcha is not filled out
//     if( grecaptcha.getResponse().length === 0 ){
//       // show the reminder
//       $('.recaptcha-title').removeClass('hidden');
//     } else {
//       request = $.ajax({
//         type: "POST",
//         url: "includes/php/mailer.php",
//         data: form.serialize(), // serializes the form's elements.
//         success: function( data, textStatus, jqXHR ){
//           form.trigger('reset');
//           grecaptcha.reset();
//           // console.log( data )
//           returnedData = JSON.parse( data );
//           console.log( returnedData.notes )
//           try {
//             if( returnedData.fail === true ){

//               $('#fail-msg p').text( returnedData.notes );
//               $('#fail-msg').removeClass('hidden');

//               setTimeout(function(){
//                 $('#fail-msg').addClass('hidden');
//               }, 5000);
//             }
//           } catch( err ){
//             console.log( "Form invalid" );
//           }

//           try {
//             if( returnedData.success === true ){
//               $('#success-msg').removeClass('hidden');
//               setTimeout(function(){
//                 $('#success-msg').addClass('hidden');
//               }, 5000);
//             }
//           } catch( err ) {
//             console.log( "JSON Parse error from server." )
//           }
//         },
//       });

//       request.fail( function( jqXHR, textStatus, errorThrown ){
//         console.log( "Request has failed." )
//         form.trigger('reset');
//         grecaptcha.reset();
//       });
//     };
//   });
// };
