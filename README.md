# PedIA — Compañero digital

> Tu compañero digital inteligente con interfaz de V-Pet estilo Digimon.

![PedIA](https://img.shields.io/badge/version-2.0-00d4f5?style=flat-square) ![Groq](https://img.shields.io/badge/AI-Groq-orange?style=flat-square) ![Vercel](https://img.shields.io/badge/hosted-Vercel-black?style=flat-square) ![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)

---

## ¿Qué es PedIA?

PedIA es un asistente de inteligencia artificial con interfaz visual de mascota digital (V-Pet), inspirado en los dispositivos Digimon y Tamagotchi de los años 90. Combiná la utilidad de un asistente conversacional con la experiencia visual de un compañero digital animado en pixel art.

No es solo un chatbot — es un personaje vivo que reacciona, se mueve, piensa, duerme y expresa emociones según el contexto de la conversación.

---

## Características principales

### 🧠 Asistente IA
- Motor de inteligencia artificial con **Groq API** (modelo LLaMA 3.3 70B)
- Personalidad definida: cercano, directo, estratégico
- Responde en español rioplatense
- Capaz de manejar estrategia, tecnología, negocios y conversación general
- Historial de conversación persistente durante la sesión

### 🎮 Interfaz V-Pet
- Dispositivo virtual con diseño inspirado en consolas portátiles de los 90
- Pantalla LCD oscura con efecto scanline animado
- Tres botones físicos: INICIO, ENVIAR, CHAT
- Barra de estado con indicador de humor en tiempo real
- Efectos de iluminación y partículas

### 🐾 Criatura Pixel Art
- Slime animado completamente en pixel art (sprites 16×12 píxeles)
- Animaciones fluidas con squish y stretch al moverse
- Se desplaza de lado a lado de forma autónoma

---

## Estados y animaciones

PedIA tiene **7 estados emocionales** con sprites y animaciones únicos:

| Estado | Trigger | Animación |
|--------|---------|-----------|
| **STANDBY** | Inicio / reposo | Bob suave arriba-abajo, ojos abiertos |
| **MOVIENDO** | Autónomo cada 6-12s | Desplazamiento lateral con squish |
| **PENSANDO** | Al enviar un mensaje | Ojo asimétrico, puntos flotantes crecientes |
| **RESPONDIENDO** | Al recibir respuesta neutral | Boca que se abre y cierra alternando frames |
| **FELIZ** | Respuesta positiva detectada | Salto con arco, ojos `^^`, sparkles y rubor |
| **ABURRIDO** | 18 segundos sin interacción | Ojos semicerrados, boca plana |
| **DURMIENDO** | 22 segundos sin interacción | Ojos cerrados, ZZZ flotando en pantalla |

### Comportamiento autónomo
- Camina solo hacia la izquierda o derecha de forma aleatoria
- Se aburre si no hay interacción por 18 segundos
- Se duerme a los 22 segundos de inactividad
- Despierta automáticamente al tocar el input o escribir

### Detección de sentimiento
La criatura reacciona según el contenido de las respuestas de la IA:
- Palabras positivas → estado **FELIZ** con sparkles y salto
- Palabras de error o problema → estado **TRISTE** con lágrimas
- Respuesta neutral → estado **RESPONDIENDO**

---

## Stack tecnológico

```
Frontend:   React 18 + Vite
Estilos:    CSS-in-JS inline (sin dependencias externas)
Gráficos:   SVG con pixel art generado por arrays de colores
IA:         Groq API — LLaMA 3.3 70B Versatile
Backend:    Vercel Serverless Functions (proxy seguro)
Deploy:     Vercel (CI/CD automático desde GitHub)
Repo:       GitHub
```

---

## Estructura del proyecto

```
pedia/
├── index.html              # Entry point HTML
├── package.json            # Dependencias
├── vite.config.js          # Configuración de Vite
├── .gitignore
├── api/
│   └── chat.js             # Serverless function — proxy seguro para Groq
└── src/
    ├── main.jsx            # Entry point React
    └── App.jsx             # Componente principal — toda la lógica y UI
```

---

## Cómo funciona la arquitectura

```
Usuario → React (frontend)
             ↓
         /api/chat (Vercel Serverless)
             ↓
         Groq API (LLaMA 3.3 70B)
             ↓
         Respuesta → detectSentiment()
             ↓
         Animación del slime + texto en pantalla
```

La API key de Groq **nunca llega al navegador** — vive solo en las variables de entorno de Vercel y se usa exclusivamente desde la función serverless.

---

## Deploy en Vercel

### Requisitos
- Cuenta en [GitHub](https://github.com)
- Cuenta en [Vercel](https://vercel.com)
- API key de [Groq](https://console.groq.com) (gratuita)

### Pasos

1. **Cloná o forkéa** este repositorio en GitHub

2. **Importá en Vercel:**
   - Entrá a `vercel.com` → Add New Project
   - Seleccioná el repo
   - En **Environment Variables** agregá:
     ```
     GROQ_API_KEY = tu_api_key_de_groq
     ```
   - Click en **Deploy**

3. **Listo** — Vercel te da una URL pública en minutos

Cada `git push` a la rama principal redeploya automáticamente.

---

## Desarrollo local

```bash
# Clonar el repo
git clone https://github.com/tu-usuario/pedia.git
cd pedia

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
echo "GROQ_API_KEY=tu_api_key_aqui" > .env

# Iniciar servidor de desarrollo
npm run dev
```

---

## Personalización

### Cambiar el system prompt
Editá la constante `SYSTEM_PROMPT` en `src/App.jsx` para darle otra personalidad, contexto o especialidad al asistente.

### Cambiar el modelo de IA
En `api/chat.js`, cambiá el valor de `model`:
```javascript
model: 'llama-3.3-70b-versatile'  // rápido y gratuito
model: 'mixtral-8x7b-32768'       // alternativa
```

### Cambiar colores del slime
En `src/App.jsx`, editá la paleta al inicio del archivo:
```javascript
const cL = '#3ccef5'  // color principal del slime
const cM = '#18a8d8'  // color medio
const cD = '#0e72a0'  // color oscuro
```

---

## Ideas futuras

- [ ] Integración con bases de datos para contexto de negocio en tiempo real
- [ ] Modo pantalla grande con monólogos automáticos basados en datos
- [ ] Múltiples skins de criatura seleccionables
- [ ] Persistencia de historial entre sesiones
- [ ] Migración a Claude API para respuestas más precisas
- [ ] Versión mobile como PWA instalable

---

## Licencia

MIT — libre para usar, modificar y distribuir.


---
## 📬 Contacto

- 📱 Telefono: +595994392370
- 📧 Email: pedrovera123@gmail.com  
- 💼 LinkedIn: [Pedvera](https://www.linkedin.com/in/pedro-vera-66580a371/)  

*Construido con curiosidad, pixel art y demasiado café.* ☕
