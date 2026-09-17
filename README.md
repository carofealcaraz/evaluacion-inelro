# Evaluación Academia Inelro — cómo ponerla online

Dos piezas, en este orden:

1. **El Google Sheet** guarda los resultados. Hay que armarlo **primero**, porque
   la página necesita su dirección.
2. **Vercel** publica la página y te da el link para repartir.

Si hacés Vercel primero, la página va a funcionar pero no va a guardar nada.

---

## Parte 1 — El Google Sheet que recibe los resultados (15 minutos)

### 1. Crear la planilla
Entrá a [sheets.new](https://sheets.new) y ponele de nombre
**Evaluación Inelro — Resultados**. Dejala vacía: las columnas se crean solas.

### 2. Pegar el código
En esa planilla: menú **Extensiones → Apps Script**.

Se abre una pestaña nueva con un archivo `Código.gs` que trae unas pocas líneas.
Borrá todo lo que haya y pegá el contenido completo del archivo **`apps-script.gs`**
que está en esta misma carpeta. Guardá con el ícono del disquete (o Ctrl+S).

### 3. Implementar como aplicación web
Arriba a la derecha: botón azul **Implementar → Nueva implementación**.

- Hacé clic en el engranaje ⚙ al lado de "Seleccionar tipo" y elegí
  **Aplicación web**.
- **Descripción:** Evaluación Inelro
- **Ejecutar como:** Yo (tu cuenta)
- **Quién tiene acceso:** **Cualquier usuario** ← *este es el paso clave. Si
  queda en "Solo yo", los vendedores no van a poder registrar nada.*
- **Implementar**.

### 4. Autorizar
Google te va a pedir permiso. Aparece una pantalla que dice
"Google no verificó esta aplicación": es normal, la app la estás haciendo vos.

- **Configuración avanzada** → **Ir a Evaluación Inelro (no seguro)** → **Permitir**.

### 5. Copiar la dirección
Al terminar te muestra una **URL de la aplicación web** que termina en `/exec`.
Algo así:

```
https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxx/exec
```

**Copiala.** Es lo único que necesitás de esta parte.

> Para comprobar que quedó bien: pegá esa URL en el navegador. Tiene que
> responder *"El registro de la evaluación Inelro está activo."*

### 6. Pegarla en la página
Abrí el archivo **`index.html`** de esta carpeta con el Bloc de notas
(clic derecho → Abrir con → Bloc de notas). Buscá esta línea, cerca del principio
del bloque de código:

```js
var URL_REGISTRO = "";
```

Y pegá tu dirección entre las comillas:

```js
var URL_REGISTRO = "https://script.google.com/macros/s/AKfycb.../exec";
```

Guardá el archivo. **Listo: ya registra en la planilla.**

---

## Parte 2 — Publicar en Vercel (10 minutos)

Vercel necesita que los archivos estén en GitHub. Todo se hace desde el
navegador, no hay que instalar nada.

### 1. Crear la cuenta de GitHub
Si no tenés: [github.com/signup](https://github.com/signup). Es gratis.

### 2. Crear el repositorio
En GitHub: botón **+** arriba a la derecha → **New repository**.

- **Repository name:** `evaluacion-inelro`
- Dejalo en **Public** (o Private, funciona igual)
- **Create repository**

### 3. Subir el archivo
En la pantalla que aparece: **uploading an existing file**.

Arrastrá **únicamente `index.html`** (no hace falta subir el `apps-script.gs`
ni este instructivo). Abajo, **Commit changes**.

### 4. Conectar Vercel
Entrá a [vercel.com](https://vercel.com) y registrate con **Continue with GitHub**.

- **Add New… → Project**
- Te lista tus repositorios: al lado de `evaluacion-inelro`, **Import**
- No toques ninguna configuración. **Deploy**.

En menos de un minuto te da el link, algo así:

```
https://evaluacion-inelro.vercel.app
```

**Ese es el link que repartís.** Funciona en el celular igual que en la
computadora.

---

## Si después querés cambiar algo

Para corregir una pregunta o agregar una sucursal: editás `index.html` en
GitHub (entrás al archivo y hacés clic en el lápiz ✏), guardás con
**Commit changes**, y Vercel actualiza el sitio solo en unos segundos.
El link sigue siendo el mismo.

---

## Cómo queda la planilla

Cada intento agrega una fila:

| Fecha | Hora | Nombre y apellido | DNI | Sucursal | Intento | Nota | Estado | Minutos | Temas que falló |
|---|---|---|---|---|---|---|---|---|---|

Con eso podés filtrar por sucursal, ver quién aprobó y en qué intento, y
—mirando la columna "Temas que falló"— detectar qué tema conviene reforzar
con todo el equipo.

---

## Cosas para tener en cuenta

- **El DNI es la identificación.** Con eso se cuentan los intentos y se evita
  que alguien rinda cuatro veces. Se le avisa en pantalla para qué se usa.
- **Tres intentos, o hasta aprobar.** Quien aprueba no puede volver a rendir;
  quien agota los tres queda bloqueado y ve un mensaje para hablar con su
  responsable.
- **Las preguntas y las opciones se mezclan** en cada intento, así que no sirve
  memorizar "siempre es la b".
- **Al desaprobar no se muestran las respuestas correctas**, solo los temas
  fallados y la página del material. Si mostráramos las respuestas, el intento
  siguiente sería copiar y pegar. Al aprobar sí se muestra el repaso completo.
- **Si falla la conexión con la planilla**, la página igual toma la evaluación y
  le avisa a la persona que saque una foto de la pantalla. La nota no se pierde
  de vista.
