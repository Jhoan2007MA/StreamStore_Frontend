# Videos de las plataformas

Al pasar el cursor sobre una tarjeta se reproduce el video de su plataforma (sin sonido, en bucle).
Ponga aquí un archivo por plataforma con estos nombres exactos:

- netflix.mp4
- disney.mp4
- hbomax.mp4 (Max)
- AmazonPrime.mp4 (Prime Video)

Recomendado: MP4 (H.264), sin audio, 10–20 segundos, 720p, menos de 5 MB.
Si falta un archivo, la tarjeta simplemente sigue mostrando el logo.
Use solo videos que tenga permiso de usar (por ejemplo, material oficial de prensa de cada plataforma).

## Videos de YouTube

En vez de un archivo, también puede usar un video de YouTube: en `src/utils/marcas.js`
agregue `youtube: "<id del video>"` a la plataforma (el id es lo que va después de `watch?v=`).
El video debe permitir inserción. Ojo: YouTube siempre muestra sus botones (pausa, anterior, siguiente) y no se pueden ocultar; para un video limpio use MP4.
