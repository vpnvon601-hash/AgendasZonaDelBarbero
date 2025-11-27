// -------------------------
//  Backend para WhatsApp ZONA DEL BARBERO
// -------------------------

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import twilio from "twilio";

// -------------------------
//  VARIABLES DE ENTORNO (Railway las cargará)
// -------------------------
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM,
  WHATSAPP_TO
} = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// -------------------------
const app = express();
app.use(cors());
app.use(bodyParser.json());

// -------------------------
//  ENDPOINT PARA RECIBIR LA CITA
// -------------------------
app.post("/send", async (req, res) => {
  const { nombre, apellidos, telefono, fecha, hora } = req.body;

  const mensaje = `
📢 *NUEVA CITA - LA ZONA DEL BARBERO* 💈

👤 Cliente: ${nombre} ${apellidos}
📞 Teléfono: ${telefono}
📅 Fecha: ${fecha}
⏰ Hora: ${hora}

✔ Revisar y confirmar.
  `;

  try {
    await client.messages.create({
      from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${WHATSAPP_TO}`,
      body: mensaje
    });

    res.json({ ok: true, message: "WhatsApp enviado correctamente" });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// -------------------------
app.get("/", (req, res) => {
  res.send("Backend activo ✓");
});

// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🔥 Backend corriendo en Railway:", PORT));