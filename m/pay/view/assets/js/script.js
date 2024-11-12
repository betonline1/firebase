class Route {
  static push(path){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `view/${path}.php`);
    xhr.onload = function(){
      if (this.status == 200) {
        document.querySelector("#app").innerHTML = this.responseText;
      }
    };
    xhr.send();
    let loader  = document.createElement("div")
    loader.classList.add("spinner-border","spinner-border-sm","text-warning")
    loader.setAttribute("role", "status")
    let span = document.createElement("span")
    span.classList.add("sr-only")
    loader.append(span)
    if (document.querySelector(".payment-card")) {
      document.querySelector(".payment-card .card-header").append(loader);
    }
    if(event){
      event.preventDefault()
    }
  }
}

let currentRoute = location.pathname.split('/')[location.pathname.split('/').length - 1];
Route.push(currentRoute.length > 0 ? currentRoute : 'main');

function setPayment(type, redirect = 0){
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    let data = new FormData(event.target);
    data.append("type", type);
    xhr.open("POST","request.php?q=payment");
    xhr.onload = function(){
      let res = this.responseText ? JSON.parse(this.responseText) : false;
      if (res.success) {
        if (redirect != 1) {
          Swal.fire("Yatırım başarılı!","","success")
          .then(result => {
            if(result.value){
               window.open("../main");
window.close();
            }
          })
        }else{
          resolve(res.message);
        }
      }else{
        Swal.fire("Hata!","Bilgileri doğru doldurduğunuza emin olun.","error")
      }
    }
    xhr.send(data);
    event.preventDefault();
  })
}

function putPayment(id, message){
  const xhr = new XMLHttpRequest;
  let data = new FormData(event.target);
  data.append("id", id);
  xhr.open("POST","request.php?q=update-payment");
  xhr.onload = function(){
    let res = JSON.parse(this.responseText);
    if (res.success) {
      Swal.fire("Yatırım başarılı!",message,"success")
      .then(result => {
        if(result.value){
           window.open("../main");
window.close();
        }
      })
    }else{
      Swal.fire("Hata!","Bilgileri doğru doldurduğunuza emin olun.","error")
    }
  }
  xhr.send(data);
  event.preventDefault();
}

let paparaStep = 0;
let paparaId=0;
let paparaCounter=120;
async function payPapara(){
  event.preventDefault()
  if (paparaStep == 0) {
    paparaId = await setPayment('aninda-papara', 1)
    paparaStep = 1;
    document.querySelector("#step_1").classList.add("d-none");
    document.querySelector("#papara_info").classList.add("d-none");
    document.querySelector("#step_2").classList.remove("d-none");

    if (document.querySelector("#countdown")) {
      document.querySelector("#countdown").innerText=paparaCounter;
      setInterval(() => {
        if(paparaCounter > 0){
          paparaCounter--;
          document.querySelector("#countdown").innerText=paparaCounter;
        }
      }, 1000);
    }

  }else if(paparaStep == 1){
    putPayment(paparaId, 'Lütfen sayfadan çıkmadan bekleyiniz!');
    paparaStep = 0;
    document.querySelector("#step_1").classList.remove("d-none");
    document.querySelector("#papara_info").classList.remove("d-none");
    document.querySelector("#step_2").classList.add("d-none");
  }
}

function numExp(){
  var x=document.getElementById("mtutar").value;
  event.target.value = event.target.value.replace(/[^\d.]/g, "");
    document.getElementById("miktar").innerHTML = x+".00 TL";
}

function checkBank(){
  const data = new FormData();
  data.append("id", parseInt(event.target.value));
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "request.php?q=get-bank");
  xhr.onload = function(){
    if (this.status == 200) {
      let response = JSON.parse(this.responseText);
      document.querySelector("#bank-info").classList.remove("d-none");
      document.querySelector("#account-holder").innerText = response.account_holder;
      document.querySelector("#account-number").innerText = response.account_number;
      document.querySelector("#branch-code").innerText = response.branch_code;
      document.querySelector("#iban").innerText = response.iban;
    }
  }
  xhr.send(data);
}
