# Guía paso a paso — Crear un proyecto React + Backend

---

## 1. Crear el proyecto con Vite

```bash
npm create vite@latest nombre-proyecto
```

Te pregunta el framework → elegís **React**, luego **JavaScript**.

```bash
cd nombre-proyecto
npm install
npm run dev
```

Esto levanta el servidor en `http://localhost:5173`.

---

## 2. Instalar Tailwind CSS (v4)

```bash
npm install tailwindcss @tailwindcss/vite
```

En `vite.config.js`:

```js
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [tailwindcss()]
}
```

En `src/index.css`:

```css
@import "tailwindcss";
```

---

## 3. Estructura de carpetas recomendada

```
src/
├── pages/          ← páginas completas (una por vista)
├── components/     ← piezas de UI reutilizables
├── hooks/          ← lógica de estado (custom hooks)
├── services/       ← llamadas al backend
└── main.jsx        ← punto de entrada
```

Esta separación se llama **arquitectura por capas**. Cada capa tiene una sola responsabilidad.

---

## 4. Entender `fetch` — qué es y para qué sirve

`fetch` es una función nativa del navegador que permite **hacer peticiones HTTP** a un servidor.

```js
fetch("http://localhost:5000/api/players")
```

Esto es equivalente a lo que hace el navegador cuando entrás a una URL, pero desde código JavaScript.

### Tipos de petición (métodos HTTP)

| Método | Para qué se usa |
|---|---|
| `GET` | Obtener datos del servidor |
| `POST` | Enviar datos nuevos al servidor |
| `PUT` | Actualizar un dato completo |
| `PATCH` | Actualizar un dato parcialmente |
| `DELETE` | Eliminar un dato |

Por defecto, `fetch` usa `GET`. Para otros métodos hay que configurarlo.

---

## 5. Entender `async` y `await`

### El problema: las peticiones son asíncronas

Cuando hacés `fetch(...)`, el navegador sale a buscar los datos por la red. Eso **tarda tiempo**. JavaScript no puede simplemente pausar y esperar — tiene que seguir ejecutando otras cosas.

La solución son las **Promesas** (`Promise`). Una promesa es un objeto que dice: _"te prometo que en algún momento voy a tener un resultado"_.

### `async` / `await` — la forma moderna de manejar promesas

```js
// Sin async/await (difícil de leer)
fetch("http://localhost:5000/api/players")
    .then((resp) => resp.json())
    .then((data) => console.log(data))

// Con async/await (mucho más claro)
const getPlayers = async () => {
    const resp = await fetch("http://localhost:5000/api/players")
    const data = await resp.json()
    console.log(data)
}
```

- **`async`** marca una función como asíncrona. Siempre retorna una Promesa.
- **`await`** pausa la ejecución **dentro de esa función** hasta que la promesa se resuelva. El resto del programa sigue corriendo normalmente.

### Regla clave

> Solo podés usar `await` dentro de una función marcada con `async`.

```js
// ✅ Correcto
const getPlayers = async () => {
    const resp = await fetch(...)
}

// ❌ Error — await fuera de async
const getPlayers = () => {
    const resp = await fetch(...)  // SyntaxError
}
```

---

## 6. Entender `resp` — la respuesta del servidor

`resp` (o `response`) es lo que devuelve `fetch`. Es un objeto con información sobre la respuesta HTTP:

```js
const resp = await fetch("http://localhost:5000/api/players")

resp.ok        // true si el status es 200-299, false si hay error
resp.status    // número: 200, 404, 500, etc.
resp.headers   // los headers de la respuesta
```

### Por qué hay que hacer `resp.json()`

`resp` no es directamente los datos. Es un **stream** (flujo de bytes). Para convertirlo a un objeto JavaScript usamos `.json()`:

```js
const resp = await fetch("http://localhost:5000/api/players")
const data = await resp.json()  // ← convierte el JSON del servidor a objeto JS
```

`.json()` también es asíncrono (por eso necesita `await`).

### Otros métodos de resp según el tipo de dato

```js
await resp.json()   // para JSON (el más común en APIs)
await resp.text()   // para texto plano o HTML
await resp.blob()   // para archivos, imágenes
```

---

## 7. Hacer una petición GET (obtener datos)

```js
const getPlayers = async () => {
    const resp = await fetch("http://localhost:5000/api/players")
    const data = await resp.json()
    return data
}
```

GET es el método por defecto, no necesita configuración extra.

---

## 8. Hacer una petición POST (enviar datos)

Para POST hay que configurar `fetch` con un segundo argumento:

```js
const addPlayer = async (player) => {
    const resp = await fetch("http://localhost:5000/api/players", {
        method: "POST",
        body: JSON.stringify(player),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await resp.json()
    return data
}
```

### Qué es cada parte

#### `method: "POST"`
Le dice al servidor que esta petición quiere **crear** algo, no solo leer.

#### `body: JSON.stringify(player)`
El `body` es el **cuerpo de la petición** — los datos que le mandás al servidor.

`player` es un objeto JavaScript, por ejemplo:
```js
{ name: "Messi", age: 36, position: "Delantero" }
```

Pero HTTP no entiende objetos JavaScript. Hay que convertirlo a texto JSON:

```js
JSON.stringify({ name: "Messi", age: 36 })
// resultado: '{"name":"Messi","age":36}'
```

#### `headers` — qué son los headers

Los **headers** son metadatos que viajan junto con la petición. Le dicen al servidor información extra sobre lo que le estás mandando.

Son pares clave-valor:

```js
headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123",
    // ...
}
```

#### `"Content-Type": "application/json"`

Este header específicamente le dice al servidor:
> _"El cuerpo (body) que te estoy mandando está en formato JSON"_

Sin este header, el servidor puede no saber cómo interpretar los datos que recibe y tirar error.

| Content-Type | Cuándo usarlo |
|---|---|
| `application/json` | Cuando mandás un objeto JSON (el más común en APIs REST) |
| `multipart/form-data` | Cuando mandás archivos o formularios con archivos |
| `application/x-www-form-urlencoded` | Formularios HTML clásicos |
| `text/plain` | Texto plano |

---

## 9. Manejar errores en fetch

`fetch` **no lanza error** cuando el servidor responde con 404 o 500. Solo lanza error si hay un problema de red (sin internet, servidor caído del todo).

Por eso hay que verificar `resp.ok` manualmente:

```js
const addPlayer = async (player) => {
    const resp = await fetch("http://localhost:5000/api/players", {
        method: "POST",
        body: JSON.stringify(player),
        headers: { "Content-Type": "application/json" }
    })

    if (!resp.ok) {
        // El servidor respondió con error (400, 500, etc.)
        const error = await resp.json()
        console.error("Error del servidor:", error)
        return error
    }

    return await resp.json()  // todo bien, retornar datos
}
```

---

## 10. Crear el Service

El service es una función factory que agrupa todas las llamadas al backend relacionadas:

```js
// src/services/playerService.js

const RUTA_BACKEND = "http://localhost:5000"

const playerService = () => {
    const getPlayers = async () => {
        const resp = await fetch(`${RUTA_BACKEND}/api/players`)
        const data = await resp.json()
        return data
    }

    const addPlayer = async (player) => {
        const resp = await fetch(`${RUTA_BACKEND}/api/players`, {
            method: "POST",
            body: JSON.stringify(player),
            headers: { "Content-Type": "application/json" }
        })
        if (!resp.ok) return await resp.json()
        return await resp.json()
    }

    return { getPlayers, addPlayer }
}

export default playerService
```

Tener la URL base en una constante (`RUTA_BACKEND`) evita repetirla en cada función.

---

## 11. Crear el Custom Hook

El hook maneja el **estado** de React y usa el service para obtener o modificar datos:

```js
// src/hooks/usePlayers.js

import { useState } from "react"
import playerService from "../services/playerService"

const usePlayers = () => {
    const [players, setPlayers] = useState([])  // lista vacía al inicio

    const getPlayers = async () => {
        const service = playerService()
        const data = await service.getPlayers()
        setPlayers(data)  // ← actualiza el estado → React re-renderiza
    }

    const addPlayer = async (player) => {
        const service = playerService()
        const data = await service.addPlayer(player)
        if (data.error) {
            console.error("Error:", data.error)
        }
    }

    return { players, getPlayers, addPlayer }
}

export default usePlayers
```

### Por qué `useState` en el hook y no en el service

- El **service** solo sabe hablar HTTP. No sabe nada de React.
- El **hook** vive en React y puede usar `useState`, `useEffect`, etc.
- Esta separación hace que el service sea reutilizable fuera de React si fuera necesario.

---

## 12. Crear la Página

```jsx
// src/pages/CRUDJugadoresPage.jsx

import { useEffect } from "react"
import usePlayers from "../hooks/usePlayers"
import PlayerTable from "../components/PlayerTable"

const CRUDJugadoresPage = () => {
    const viewmodel = usePlayers()

    useEffect(() => {
        viewmodel.getPlayers()  // cargar jugadores al montar
    }, [])  // ← [] significa "solo al montar, no al actualizar"

    return (
        <div>
            <PlayerTable players={viewmodel.players} />
        </div>
    )
}

export default CRUDJugadoresPage
```

### Por qué se llama `viewmodel`

Es una convención. El hook devuelve datos y funciones, como un "modelo de la vista". No es un nombre obligatorio, es solo descriptivo.

---

## 13. Resumen visual del flujo

```
Usuario hace clic en "Guardar"
        ↓
PlayerModal llama a addPlayer(player)   [prop recibida de la página]
        ↓
usePlayers.addPlayer(player)            [custom hook]
        ↓
playerService().addPlayer(player)       [service]
        ↓
fetch("POST /api/players", body: JSON)  [HTTP]
        ↓
Backend recibe, guarda, responde JSON
        ↓
resp.json() → data regresa al hook
        ↓
(opcional) getPlayers() para refrescar la lista
        ↓
setPlayers(data) → React re-renderiza la tabla
```

---

## 15. Errores comunes y cómo solucionarlos

### Error: `tailwindcss is not defined` al correr `npm run dev`

**Mensaje completo:**
```
ReferenceError: tailwindcss is not defined
    at vite.config.js...
```

**Causa:** El `vite.config.js` usa `tailwindcss()` como plugin pero no lo importa, o falta instalar el paquete `@tailwindcss/vite`.

En Tailwind CSS v4, el plugin de Vite viene en un paquete separado llamado `@tailwindcss/vite`. No alcanza con instalar solo `tailwindcss`.

**Solución:**

1. Instalar el paquete que falta:
```bash
npm install @tailwindcss/vite --save-dev
```

2. Agregar el import en `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'   // ← este import faltaba

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Regla para recordar:** En Tailwind v4, siempre instalar los dos paquetes juntos:
```bash
npm install tailwindcss @tailwindcss/vite --save-dev
```

---

## 14. Conceptos clave — resumen rápido

| Concepto | Qué es |
|---|---|
| `fetch` | Función nativa para hacer peticiones HTTP desde el navegador |
| `async` | Marca una función como asíncrona (puede usar `await`) |
| `await` | Pausa la función hasta que la promesa se resuelva |
| `resp` | La respuesta HTTP — contiene status, headers y el cuerpo |
| `resp.json()` | Convierte el cuerpo de la respuesta de texto JSON a objeto JS |
| `JSON.stringify()` | Convierte un objeto JS a texto JSON para mandarlo en el body |
| `body` | Los datos que se envían en la petición POST/PUT |
| `headers` | Metadatos de la petición (tipo de contenido, autenticación, etc.) |
| `Content-Type` | Header que le dice al servidor en qué formato van los datos del body |
| `useState` | Hook de React para guardar y actualizar datos en memoria |
| `useEffect` | Hook de React para ejecutar código en momentos específicos del ciclo de vida |
| Custom Hook | Función que empieza con `use` y agrupa lógica reutilizable con hooks |
| Service | Módulo que agrupa las llamadas HTTP, separado de React |
