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
  let $formEl = undefined;
  let $formName = undefined;
  let $formEmail = undefined;
  let $formSubmit = undefined;
  let $formDummyPost = undefined;
  let $formOverlayEl = undefined;
  let $formOverlayElText = undefined;

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
    $formEl = document.querySelector("#signup-form");
    $formName = document.querySelector("#signup-form--name");
    $formEmail = document.querySelector("#signup-form--email");
    $formSubmit = document.querySelector("#signup-form--submit");
    $formDummyPost = document.querySelector("#signup-form--dummy");
    $formOverlayEl = document.querySelector("#signup-form--overlay");
    $formOverlayElText = document.querySelector("#signup-form--overlay .overlay-text");
  };

  const _listen = () => {
    $memoriumLink.addEventListener("click", _toggleMemoriumView);
    $memoriumCloseBtn.addEventListener("click", _toggleMemoriumView);
    $mobileNavBtn.addEventListener("click", _toggleMobileNavView);
    $mobileNavCloseBtn.addEventListener("click", _toggleMobileNavView);
    $formSubmit.addEventListener("click", _submitContactForm);
  };

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

  const _submitContactForm = () => {
    // Try to avoid bots
    if ($formDummyPost.value.length > 0) {
      return;
    }
    // Form is invalid
    if (!$formEl.checkValidity()) {
      //
    } else {
      fetch("/api/mailer", {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: $formName.value,
          email: $formEmail.value
        })
      })
        .then(res => res.json())
        .then(res => {
          const { formDidFail } = res;

          if( formDidFail ){
            $formOverlayElText.innerHTML = "Sorry, there was a problem. Please try again later."
            $formOverlayElText.classList.remove('success');
            $formOverlayElText.classList.add('error');
          } else {
            $formOverlayElText.innerHTML = "Thanks for signing up!"
            $formOverlayElText.classList.remove('error');
            $formOverlayElText.classList.add('success');
            $formEl.reset();
          }

          $formOverlayEl.classList.remove("hidden");
          $formOverlayEl.classList.add('fade');

          window.setTimeout( () => {
            $formOverlayEl.classList.add("hidden");
          }, 5999);
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const _init = () => {
    _bind();
    _listen();
    _setYearDate();
    _getFirstThursday();
  };

  document.addEventListener("DOMContentLoaded", _init);
})(document);
