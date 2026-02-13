document.addEventListener("DOMContentLoaded", ()=>{

  // ================= LOADER =================
  setTimeout(()=>{
    const loader = document.getElementById("loaderOverlay");
    if(loader){
      loader.classList.add("zoomOut");
      setTimeout(()=> loader.remove(),1000);
    }
  },1500);

  // ================= CONTROL ENVÍO ÚNICO =================
  if(localStorage.getItem("mdo_encuesta_enviada")){
    showAlreadyDone();
    return;
  }

  loadQuestion();
});


// ================= PREGUNTAS =================
const questions = [
  {
    scale: "1. ¿Qué tan satisfecho(a) se encuentra con el diplomado de Ortodoncia en MDO?",
    text: "¿Cuáles fueron los principales factores que influyeron en su calificación?"
  },
  {
    scale: "2. ¿Qué tan probable es que califique como excelente la calidad de la enseñanza recibida (docentes, metodología y contenidos)?",
    text: "¿Qué aspectos considera que se deberían fortalecer o mejorar?"
  },
  {
    scale: "3. ¿Qué tanto considera que el diplomado ha cumplido con sus expectativas iniciales como profesional odontólogo?",
    text: "¿Por qué? (Respuesta breve)"
  },
  {
    scale: "4. ¿Qué tan satisfecho(a) está con las instalaciones, equipamiento y recursos clínicos (Limpieza, Unidades y Tecnología) de MDO?",
    text: "¿Qué mejoras considera necesarias?"
  },
  {
    scale: "5. ¿Qué tan probable es que recomiende MDO a un colega o amigo?",
    text: "¿Cuál es la razón principal de su respuesta?"
  }
];


// ================= VARIABLES =================
let current = 0;
let answers = [];
let selected = null;

const scale = document.getElementById("scale");
const value = document.getElementById("value");
const questionText = document.getElementById("questionText");
const textQuestion = document.getElementById("textQuestion");
const textAnswer = document.getElementById("textAnswer");
const circles = document.querySelectorAll(".circle");
const nextBtn = document.getElementById("nextBtn");


// ================= CARGAR PREGUNTA =================
function loadQuestion(){

  questionText.innerText = questions[current].scale;
  textQuestion.innerHTML = `${questions[current].text}
  <span class="opcional">(Opcional)</span>
`;
  textAnswer.value = "";
  selected = null;

  scale.innerHTML = "";

  for(let n=0;n<=10;n++){
    scale.innerHTML += `
      <input type="radio" name="nps" id="nps_${n}" value="${n}">
      <label for="nps_${n}">${n}</label>
    `;
  }

  value.innerText = "Seleccionado: -";

  scale.onchange = e=>{
    selected = e.target.value;
    value.innerText = "Seleccionado: " + selected;
  }
}


// ================= BOTÓN SIGUIENTE =================
nextBtn.onclick = ()=>{

  if(selected === null){
    alert("Seleccione una opción");
    return;
  }

  answers.push({
    question: questions[current].scale,
    scale: selected,
    text: textAnswer.value || ""
  });

  current++;

  if(current < questions.length){

    circles[current-1].classList.add("done");
    loadQuestion();

  } else {

    document.querySelector(".right").innerHTML = `
      <div class="agradecimiento">
        <h1>¡¡Gracias por confiar en MDO!!</h1>

        <p class="mensaje-final">
          Tu opinión nos ayuda a seguir mejorando y ofrecerte una formación de excelencia.
          Síguenos en nuestras redes para estar al día con contenido, novedades y experiencias,
          y no olvides compartir MDO con tus colegas para que también formen parte de nuestra comunidad.
        </p>

        <button class="send-btn" onclick="sendData()">
          Enviar Resultados
        </button>
      </div>
    `;
  }
};


// ================= ENVIAR DATOS =================
function sendData(){

  if(localStorage.getItem("mdo_encuesta_enviada")){
    return;
  }

  let params = new URLSearchParams();
  params.append("fecha", new Date().toLocaleString());

  answers.forEach((ans, index)=>{
    params.append("p"+(index+1)+"_escala", ans.scale);
    params.append("p"+(index+1)+"_texto", ans.text);
  });

  fetch("https://script.google.com/macros/s/AKfycbxN4Gjt3IHTDN6AVZnjJOBraM5h0XOUo49yGixxKe06LykZ3o-kEqwNuGIltDjPZItl/exec", {
    method:"POST",
    body:params
  })
  .then(res=>res.text())
  .then(()=>{

    localStorage.setItem("mdo_encuesta_enviada","true");

    activarAnimacionEnvio();

  })
  .catch(err=>{
    alert("Error al enviar datos");
    console.error(err);
  });
}


// ================= ANIMACIÓN ENVÍO =================
function activarAnimacionEnvio(){

  const contenedor = document.querySelector(".agradecimiento");

  contenedor.classList.add("subir-agradecimiento");

  const boton = document.querySelector(".send-btn");
  boton.style.display = "none";

  const mensaje = document.createElement("div");
  mensaje.classList.add("mensaje-exito");

  mensaje.innerHTML = `
    <div class="check-container">
      <svg viewBox="0 0 52 52" class="checkmark">
        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
        <path class="checkmark__check" fill="none" d="M14 27l7 7 16-16"/>
      </svg>
    </div>
    <h2>Resultados enviados</h2>
  `;

  contenedor.appendChild(mensaje);
}


// ================= PANTALLA BLOQUEADO (SOLO AL REFRESCAR) =================
function showAlreadyDone(){

  document.querySelector(".right").innerHTML = `
    <div class="agradecimiento">
      <h1>Usted ya realizó el cuestionario</h1>

      <p class="mensaje-final">
        Nuestro sistema registra una única participación por usuario. Gracias por confiar en MDO Dental Training Center.
      </p>
    </div>
  `;
}