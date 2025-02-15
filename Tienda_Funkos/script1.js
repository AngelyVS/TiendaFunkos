//---------------------------------------
const userName = document.getElementById('userName');
const phone = document.getElementById('phone');
const email= document.getElementById('email');
const password= document.getElementById('password');
const veryfiPass= document.getElementById('veryfiPass');
const form= document.getElementById('form');


const phonePattern= /^\d{9}$/;
const emailPattern= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;
const passwordPattern= /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/;

form.addEventListener("submit",e=>{
    e.preventDefault()
    let warnings=2
    if(userName == null || userName.value.length < 3){
        alert( "El nombre no es valido, mínimo 3 caracteres");
    }
    if(!phonePattern.test(phone.value)){
        alert("El teléfono debe contener 9 dígitos");
       
    }

    if(!emailPattern.test(email.value)){
     alert("El correo eléctronico debe contener mínimo 5 caracteres,1 número, 1 mayúscula, 1 minúscula");
        return;
    }
    if(!passwordPattern.test(password.value)){
        alert("La contraseña debe incluir mínimo 5 caracteres, un número y una mayúscula")
    }
    if(veryfiPass.value != password.value){
        alert("verificación incorrecta")
    }else
    alert("El registro se ha realizado con éxito")
})