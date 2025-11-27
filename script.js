// -------------------------------
// Configuración de Firebase
// -------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0XwAGFWJEFs6_bpPLQGSVeBPyTkymk6I",
  authDomain: "shantybarber-b7b8c.firebaseapp.com",
  databaseURL: "https://shantybarber-b7b8c-default-rtdb.firebaseio.com",
  projectId: "shantybarber-b7b8c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// -------------------------------
// Referencias a elementos
// -------------------------------
const horaSelect = document.getElementById("hora");
const fechaInput = document.getElementById("fecha");
const form = document.getElementById("formCita");
const mensajeExito = document.getElementById("mensajeExito");

// -------------------------------
// GENERAR HORAS 10:00 AM A 7:00 PM
// -------------------------------
function generarHoras() {
  const horas = [];
  let hora = 10;
  let minuto = 0;

  while (hora < 19) {
    const h = hora.toString().padStart(2, "0");
    const m = minuto.toString().padStart(2, "0");
    horas.push(`${h}:${m}`);

    minuto += 40;
    if (minuto >= 60) {
      minuto -= 60;
      hora++;
    }
  }

  horaSelect.innerHTML = horas.map(h => `<option value="${h}">${h}</option>`).join("");
}

// -------------------------------
// ESCUCHAR HORAS OCUPADAS EN TIEMPO REAL
// -------------------------------
fechaInput.addEventListener("change", () => {
  const fecha = fechaInput.value;
  if (!fecha) return;

  const citasRef = ref(db, `citas/${fecha}`);

  onValue(citasRef, (snapshot) => {
    generarHoras();
    const ocupadas = snapshot.val() || [];
    for (let option of horaSelect.options) {
      if (ocupadas.includes(option.value)) {
        option.disabled = true;
        option.textContent = `${option.value} (Ocupada)`;
      }
    }
  });
});

// -------------------------------
// ENVÍO DEL FORMULARIO
// -------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fecha = fechaInput.value;
  const hora = horaSelect.value;

  // Guardar cita en Firebase
  const citaRef = ref(db, `citas/${fecha}`);
  const snapshot = await get(citaRef);
  const ocupadas = snapshot.val() || [];
  ocupadas.push(hora);
  await set(citaRef, ocupadas);

  // Mostrar mensaje de éxito
  mensajeExito.style.display = "block";
  setTimeout(() => mensajeExito.style.display = "none", 6000);

  // Enviar formulario a Basin
  form.submit();
});

// -------------------------------
// Inicializar
// -------------------------------
fechaInput.min = new Date().toISOString().split("T")[0];
generarHoras();