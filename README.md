# Juego de Límites

Este proyecto es un juego de preguntas sobre límites (matemática), construido con React, TypeScript, Tailwind CSS y Framer Motion. Permite:

- Crear preguntas y respuestas.

- Mostrar un listado de preguntas con blur en las respuestas y opción de mostrar/ocultar.

- Jugar y ver puntajes finales con pantallas personalizadas.

- Personaje con mensajes motivacionales.

# Tecnologías

- React + TypeScript

- Tailwind CSS

- Framer Motion para animaciones

- Lucide React para íconos

- LocalStorage para guardar preguntas

# Instalación

Clonar el repositorio:
``` bash
git clone https://github.com/HaiWeiss/math-limit-game.git
```
``` bash
cd math-limit-game
```

Instalar dependencias:

``` bash
npm install
```

Iniciar el proyecto en modo desarrollo:

``` bash
npm run dev
```

Abrir en tu navegador:

http://localhost:5173

# Estructura del proyecto

```
src/
├─ components/
│  ├─ Character.tsx
│  ├─ Curtain.tsx
│  ├─ Game.tsx
│  ├─ Menu.tsx
│  └─ QuestionForm.tsx
├─ types/
│  └─ question.ts
├─ App.tsx
└─ main.tsx
public/
├─ char.png
├─ stickers/
│  ├─ lose.png
│  ├─ win.png
│  └─ neutral.png
```
# Funcionalidades

### Crear preguntas:

Puedes agregar preguntas con varias respuestas y marcar la correcta.

### Listar preguntas:

Las respuestas están desenfocadas (blur) y se pueden mostrar/ocultar con un ícono de ojo.

### Jugar:

Selecciona “Jugar” para empezar.

Avanza pregunta por pregunta y el sistema calcula el puntaje.

Pantalla final:
Muestra tu puntaje final según tu desempeño.

# Notas

1. El juego guarda automáticamente las preguntas en LocalStorage.

2. Puedes eliminar preguntas con el botón ❌.

3. El código no es perfecto, lo hice en un dia con ayuda de la IA.