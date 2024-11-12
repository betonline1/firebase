function logIn() {
  if (phone_status == 1 || passport_status == 1) {
    $("#step_1").addClass("dnone");
    $("#step_2").removeClass("dnone");
    phone_status = 0;
    passport_status = 0;
  } else {
    $.ajax({
      type: "POST",
      url: "../request.php?q=login",
      data: $("#form").serialize(),
      success: (response) => {
        if (locate == 0) {
          window.location.reload();
        } else {
          window.location.href = "/tr/deposit";
        }
      },
    });
  }
}

function signUp() {
  $.ajax({
    type: "POST",
    url: "../request.php?q=signup",
    data: $("#form").serialize(),
    success: (response) => {
      if (response == "error") {
        Swal.fire("Hata!", "Bilgileri doğru girdiğinizden emin olun", "error");
      } else {
        if (locate == 0) {
          window.location.reload();
        } else {
          window.location.href = "/tr/deposit";
        }
      }
    },
  });
}

function logout() {
  $.ajax({
    type: "POST",
    url: "../request.php?q=logout",
    success: () => {
      window.location.href = "/tr";
    },
  });
}

function loginorpay() {
  if (logged) {
    window.location.href = "/tr/deposit";
  } else {
    window.location.href = "/tr/login";
  }
}



function openzopim() {
  $zopim.livechat.window.openPopout();
}
