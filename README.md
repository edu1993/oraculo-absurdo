# 🔮 Oráculo de Decisiones Absurdas

## Descripción

El Oráculo de Decisiones Absurdas es una web app interactiva que ayuda a tomar decisiones cotidianas argentas con humor y estilo cyberpunk. Con más de 50 decisiones organizadas en 7 categorías, el Oráculo usa un dado mágico para elegir respuestas al azar.

## Características

- 🎲 **Dado Mágico**: Elige al azar entre 50+ decisiones argentinas
- 🎮 **Gamificación completa**: Sistema de niveles, XP, rachas diarias y logros
- 📸 **Generador de imágenes**: Crea imágenes 1080x1080 listas para Instagram
- 📱 **100% Responsive**: Diseño mobile-first con touch targets optimizados
- 🎨 **Estética Cyberpunk**: Neones, hexágonos y efectos visuales argentinos
- 🧉 **Humor Argentino**: Respuestas ácidas, locales y divertidas

## Tecnologías

- HTML5 semántico
- Tailwind CSS (via CDN)
- JavaScript vanilla (ES6+)
- Canvas API para generación de imágenes
- LocalStorage para persistencia de datos
- GitHub Pages para hosting

## Estructura del Proyecto

```
oraculo-absurdo/
├── index.html              # Estructura principal
├── css/
│   └── styles.css         # Estilos personalizados y efectos
├── js/
│   └── app.js             # Lógica, gamificación y generador de imágenes
├── data/
│   └── decisiones.json    # 50+ decisiones en 7 categorías
└── README.md              # Este archivo
```

## Categorías de Decisiones

| Categoría | Cantidad | Emoji |
|-----------|----------|-------|
| 🍕 Crisis Alimentarias | 14 | Comida argentina |
| 🛌 Dilemas Existenciales | 13 | Vida cotidiana |
| 🎮 Crisis de Ocio | 12 | Entretenimiento |
| 🇦🇷 Modo Argento Puro | 12 | Política, economía, cultura |
| 💼 Laburo y Obligaciones | 6 | Trabajo |
| 👨‍👩‍👧 Drama Familiar | 6 | Familia y relaciones |
| 🛒 Shopping Argentino | 4 | Compras |

## Gamificación

### Sistema de Niveles (1-10)
1. Novicio del Oráculo
2. Aprendiz de Indeciso
3. Caminante del Dilema
4. Maestro de la Duda
5. Oráculo Junior
6. Dictador de Decisiones
7. Señor del Caos Argentino
8. Emperador de la Indecisión
9. Dios del Dado Mágico
10. Leyenda Viva del Oráculo

### Logros Desbloqueables
- 🌟 Primeros Pasos
- 🔥 Constancia (3 días)
- 📅 Adicto (7 días)
- 🎯 Indeciso Profesional
- 👑 Maestro del Caos
- 🏆 Leyenda Argentina
- 🚀 Elevando el Nivel
- 🎲 Jugador
- 📢 Influencer

## Cómo usar

### Local
```bash
python3 server.py
# Abrir http://localhost:8080
```

### Compartir en Instagram
1. Tirá el dado mágico
2. Revelá la respuesta
3. Click en "Compartir decisión"
4. Elegí "Generar imagen para Instagram"
5. La imagen se descarga lista para subir

## Deploy en GitHub Pages

### Paso 1: Crear repositorio
1. Ir a https://github.com/new
2. Nombre: `oraculo-absurdo`
3. Público
4. Crear repositorio

### Paso 2: Subir archivos
```bash
cd oraculo-absurdo
git init
git add .
git commit -m "Initial commit - Oráculo de Decisiones Absurdas"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/oraculo-absurdo.git
git push -u origin main
```

### Paso 3: Activar GitHub Pages
1. Ir al repositorio en GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main / root
5. Save
6. Esperar 2-5 minutos
7. El link aparecerá en la misma página

### URL resultante
`https://TU_USUARIO.github.io/oraculo-absurdo/`

## Créditos

- Desarrollado para TP de Desarrollo Web Full Stack
- UTN - Universidad Tecnológica Nacional
- Tecnologías: HTML5, Tailwind CSS, JavaScript

## Licencia

Proyecto educativo - Libre uso y modificación

---

🔮 *El Oráculo no se hace responsable de las malas decisiones. El universo tiene sentido del humor.*
