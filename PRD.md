# PRD — Landing Page Personal de Germán Augusto Orozco Murcia

**Versión:** 1.0  
**Estado:** Borrador para revisión  
**Autor:** Germán Augusto Orozco Murcia  
**Fecha:** 03/08/2026  
**Audiencia:** Equipo de desarrollo y diseño, propietario del producto

---

## 1. Visión General y Objetivos (Overview & Goals)

### 1.1 Resumen del producto

Landing page personal y de una sola vista (single-page) que funciona como **carta de presentación digital** de Germán Augusto Orozco Murcia. Actúa como la puerta de entrada a tres destinos principales:

1. **La página estrella** del proyecto OmniPlay.
2. **El portafolio general** de proyectos (petsalud, Zancada Running, y otros).
3. **El canal de contacto directo** con el profesional.

### 1.2 Propósito

Reducir al mínimo la fricción entre un visitante (reclutador, cliente o colaborador) y la evidencia del trabajo del profesional. La página no busca competir por tráfico masivo, sino **convertir una visita en una acción**: evaluar un proyecto, revisar el portafolio o establecer contacto.

### 1.3 Objetivos

| # | Objetivo | Tipo |
|---|----------|------|
| G1 | Posicionar a Germán como desarrollador senior en Web, Móvil e IA | Cualitativo |
| G2 | Dirigir visitantes hacia la **Página Estrella (OmniPlay)** como demostración principal de calidad técnica | Cuantitativo |
| G3 | Derivar tráfico hacia el **Portfolio general** | Cuantitativo |
| G4 | Facilitar el contacto directo (correo) para oportunidades laborales o de servicio | Cuantitativo |
| G5 | Transmitir coherencia de marca: minimalista, moderno y con front-end cuidado (reflejar el propio stack del profesional) | Cualitativo |

### 1.4 Alcance

- **Dentro del alcance:** Hero, CTAs duales, Sobre mí/Trayectoria, Contacto, diseño responsivo, accesibilidad y rendimiento.
- **Fuera del alcance:** Blog, multiidioma, e-commerce, panel de administración, formularios con backend (contacto es por enlace `mailto:`) en v1.

---

## 2. Público Objetivo (Target Audience)

| Segmento | Necesidad principal |
|----------|---------------------|
| **Reclutadores / technical recruiters** | Evaluar rápido la calidad técnica y arquitectura a través del proyecto estrella |
| **CTOs / Líderes técnicos** | Ver el livello de código, stack y decisiones de arquitectura |
| **Clientes potenciales** (autónomos / estudio) | Contratar desarrollo web, móvil o soluciones de IA |
| **Colegas / red de contacto** | Conocer trayectoria y proyectos |
| **Persona principal (Germán)** | Validar y controlar su marca personal |

**Persona prioritaria:** *Recruiter técnico* — visitantes con poco tiempo, que deciden en los primeros 5–10 segundos si vale la pena profundizar. La landing debe entregar la evidencia en ese lapso.

---

## 3. Historias de Usuario (User Stories)

Formato: `Como [rol], quiero [acción] para [beneficio].`

### Prioridad: Esencial (v1)

- **US-01 (Rc):** Como reclutador, **quiero** ir directamente a la página estrella **para** evaluar la calidad del código y la arquitectura del proyecto OmniPlay.
- **US-02 (Rc):** Como reclutador, **quiero** revisar el portfolio completo **para** reconocer la amplitud de skills (Web + Móvil + IA) del candidato.
- **US-03 (Cl):** Como cliente potencial, **quiero** ver un resumen de trayectoria y habilidades **para** confiar en la contratación del servicio.
- **US-04 (TU):** Como visitante, **quiero** un diseño que cargue rápido y se vea impecable en móvil **para** no perder el interés.
- **US-05 (PR):** Como visitante, **quiero** acceder al email de contacto en un solo toque **para** comunicarme inmediatamente.

### Que (Backlog v2)

- **US-06:** Como visitante, **quiero** ver íconos de redes / enlaces a perfiles profesionales.
- **US-07:** Como visitante, **quiero** descargar una versión en PDF del CV.

---

## 4. Requisitos Funcionales (Functional Requirements)

Cada requisito tiene criterio de aceptación (CA).

### FR-01 — Hero Section con propuesta de valor
- **Descripción:** Bloque hero a pantalla completa (100vh) con nombre, titulo profesional y una síntesis de propuesta de valor.
- ✍ Free text propuesto: *"Desarrollador de software — Web, Móvil e Inteligencia Artificial."*
- **CA-FR01:** En el primer viewport se muestra nombre y rol sin scroll.
- **CA-FR02:** El título la propuesta de valor es visible al instante y con jerarquía tipográfica clara.

### FR-02 — CTAs duales
- **Descripción:** Dos llamados de acción: uno **destacado** hacia la **página estrella (OmniPlay)** y otro **secundario** hacia el **Portfolio general**.
- **CTA-Primario:** *"Ver Proyecto Estrella →"* (botón destacado, color de acento).
- **CTA-Secundario:** *"Explorar el Portfolio"* (botón con estilo outline/secondario).
- **CA-FR03:** Ambos CTAs visibles dentro del hero, sin requiere scroll.
- **CA-FR04:** El CTA primario es el que mayor contraste visual / jerarquía para dirigir la atención hacia OmniPlay (objetivo O2).
- **CA-FR05:** Enlazan a las URL reales (OmniPlay y portfolio) y se abren correctamente.

### FR-03 — Sección Sobre Mí / Trayectoria
- **Descripción:** Biografía concisa orientada a logros, talón del stack y resumen de trayectoria profesional.
- **Contenido requerido:**
  - Nombre completo.
  - Sectores de experiencia: Web, Móvil, IA.
  - Stack: PHP, JavaScript, Kotlin, Swift, MySQL, arquitecturas MVC.
- **CA-FR06:** Sección accesible por scroll y responda a un anclaje (anchor) del menú de navegación heredado.
- **CA-FR07:** Al menos un bloque de cada skill central (web / móvil / IA) visible de forma simplificada.

### FR-04 — Sección de Contacto
- **Descripción:** Bloque de contacto con correo (mailto) y ubicación.
- **Datos:**
  - Correo: `joanpabloorozco@gmail.com`
  - Ubicación: *Calle Francisco Grande Covián 62*, españole.
- **CA-FR08:** El correo es un enlace `mailto:` funcionamiento con `subject` predefinido por defecto.
- **CA-FR09:** La ubicación se muestra como texto y, si procede, enlace a servicio de mapas externo.
- **CA-FR10:** Información de contacto presente y legible en el mismo viewport que el contenido final sin requerir scroll lateral.

### FR-05 — Navegación suave (anclas)
- **Descripción:** Enlaces ancla dentro de la misma página (Hero / Sobre mí / Contacto) y enlaces externos a proyectos.
- **CA-FR11:** `scroll-behavior: smooth` para navegación interna.
- **CA-FR12:** Todos los enlaces externos abren en pestaña nueva con `target="_blank"`, `rel="noopener noreferrer"`.

---

## 5. Requisitos No Funcionales (Non-Functional Requirements)

### NFR-R-01 Rendimiento
- **CA:** La landing debe alcanzar **Lighthouse Performance ≥ 90** en móvil.
- **CA:** Tiempo de carga inicial (`First Contentful Paint`) ≤ 1.5s en red 4G simulado.
- **CA:** Cero recursos bloqueantes innecesarios; el CSS/JS cargan de forma eficiente y con `loading="lazy"` para medios pesados.
- **CA:** `Total Blocking Time` (TBT) < 200 ms.

### NFR-ACC-02 Accesibilidad
- **CA:** Cumplir al menos **WCAG 2.1 AA** (con contraste de color a verificación, etiquetado de voz alt, etiquetado correcto).
- **CA:** Navegación completa por teclado, focus visible.
- **CA:** Contenido estructurado semánticamente (`<header>`, `<main>`, `<section>`, `<footer>`, `<h1>` solo una vez).
- **CA:** Ratio de contraste texto/fondo que cumpla AA (≥ 4.5:1 para texto normal).

### NFR-R-03 Diseño responsivo (Mobile-First)
- **Descripción:** La maqueta se diseña y desarrolla primero para móvil y se amplía hacia tablet/desktop.
- **CA:** Breakpoints estándar: móvil (< 640px), tablet (≥ 640px), desktop (≥ 1024px).
- **CA:** Sin scroll horizontal en ningún viewport.
- **CA:** CTAs y hit areas con tamaño táctil de al menos 44×44px en móvil.
- **CA:** Tipografía fluida con unidades relativas (rem).

### NFR-UI-04 Lineamientos de UI/UX
- **Estilo:** minimalista, moderno, logotipo/lista limpia y maquetación front-end cuidada.
- **CA:** Sistema de diseño con tokens CSS (variables de color, espaciados, radios, tipografía) reutilizables.
- **CA:** Consistencia tipográfica (carga selectiva de fuentes, p.ej. system-ui o una tipografía variable).
- **CA:** Micro-interacciones sutiles (hover, transiciones) pero sin recargar la página.
- **CA:** No uso de frameworks de UI genéricos; **CSS personalizado**.

---

## 6. Requisitos Técnicos (Technical Requirements)

| Área | Decisión |
|------|----------|
| **Propósito del editor:** | Landpage desarrollada en **HTML5 + CSS3 + JavaScript moderno** sin framework de front-end pesado |
| **CSS:** | CSS3 con variables (custom properties), **metodología BEM** (Bloque-Elemento-Modificador) para estructura de clase |
| **Layout:** | Flexbox / CSS Grid, diseño mobile-first |
| **Fonts:** | Sistema o variable, superstición ligera, sin depencia de CDN pesada (o auto-host) |
| **SEO:** | Meta tags base, Open Graph, favicon |
| **Hosting (obligatorio):** | **GitHub Pages (100% compatible)** — sitio 100% estático sin dependencias de servidor |
| **Construcción:** | Sin compilador ni build step; se entrega HTML/CSS/JS nativo servido por GitHub Pages sin backend |
| **Paths de recursos:** | Uso de **rutas relativas** (no absolutas `/assets/...`) para que el sitio funcione bajo cualquier sub-ruta del repo de Pages (`https://usuario.github.io/repo/` o `custom domain`) |
| **Config repo:** | Rama `main` o `gh-pages` como fuente de Pages; favicon, meta y OG con rutas relativas |

** stack de interés del profesional (PHP, Kotlin, Swift, MySQL, MVC) está destinado a los **proyectos del portfolio**, no necesariamente a la propia landing (que permanece ligeras y estática por rendimiento). Si se desea, el CV/contacto podría apuntarse a un mínimo backend PHP, pero no es requerido en v1.

---

## 7. Métricas de Éxito (Success Metrics)

### 7.1 North Star Metric
**Tasa de conversión de CTA primario (OmniPlay):** % de visitantes que hacen clic en "Ver Proyecto Estrella".

### 7.2 Métricas de indicador (KPI)

| Métrica | Objetivo |
|---------|----------|
| CTR CTA primario → OmniPlay (hero) | ≥ 20% de visitas |
| CTR CTA secundario → Portfolio | ≥ 10% de visitas |
| Tasa de clics en email de contacto | ≥ 5% |
| Segmento por vista (Sobre mi / Hero) | Empezar a realizarse de forma visibilidad |
| Tiempo en página | ≥ 30s promedio (señal de interés) |
| Bounce / resalta de página | Complejidad del objetivo (el visitante logran el propósito) |

### 7.3 Métricas de salud (guardab)

- LCP ≤ 1.5s en móvil.
- CLS < 0.1.
- Lighthouse accesibilidad ≥ 90.
- Error de navegación (CTAs no funcionales) = 0.

### 7.4 Metodologías de medición

- **Analítica:** Google Analytics 4 / Plausible configurado con eventos para los CTAs (click en "Ver Proyecto Jardín", "Explorar Portfolio", contacto).
- **UTM tracking** en los enlaces a proyectos para análisis de origen.
- **Periodicidad:** revisión semanal durante el primer mes; mensual después.

---

## 8. Alcance y Priorización (Backlog ordenado)

**Prioridad:** [P0] Bloqueado en v1 | [P1] Incluido en v1 si tiempo | [P2] Futura

| ID | Elemento | Impacto | Esfuerzo | Prioridad |
|----|----------|---------|----------|-----------|
| FR-01 | Hero + propuesta de valor | Alto | Bajo | P0 |
| FR-02 | CTAs duales (OmniPlay / Portfolio) | Alto | Bajo | P0 |
| FR-03 | Sobre mi / Trayectoria | Alto | Medio | P0 |
| FR-04 | Contacto (mailto + ubicación) | Alto | Bajo | P0 |
| NFR-Rend | Optimización rendimiento | Alto | Medio | P0 |
| NFR-Respon | Responsive mobile-first | Alto | Medio | P0 |
| FR-05 | Navegación por anclas | Medio | Bajo | P1 |
| US-06 | Enlaces redes / perfiles | Medio | Bajo | P1 |
| US-07 | CV en PDF | Bajo | Medio | P2 |

---

## 9. Criterios de Aceptación Final (Definition of Done)

La landing se considera lista cuando:

1. Hero con propuesta de valor y CTAs duales funcionantes (fr201).
2. Secciones Sobre mi y Contacto completas y accesibles.
3. Pasa Lighthouse móvil: Performance ≥ 90, Accesibilidad ≥ 90, Best Practices ≥ 90, SEO ≥ 90.
4. Cumpli segundo WCAG 2.1 AA.
5. Sin desagua horizontal en ningún breakpoint (375px, 768px, 1440px).
6. Todos los enlaces externes con `noopener noreferrer`.
7. Código y CSS denso, sin dependencia de bibliotecas innecesarias, con naming (BEM).

---

## 10. Anexos / Notas de Diseño (Orientación)

- **Paleta sugerida (minimalista):** blanco/casi blanco (fondo), un acento (recomendado: tono azul-Índigo o un verde, a definir con marca personal), texto en gris oscuro de alto contraste. Opcionalmente modo oscuro.
- **Jerarquía tipográfica:** nombre (hero) > titulo profesional > cuerpo; sizes con `clamp()`.
- **Plantilla de estructura pages:**

```
<header>        <!-- logo / nombre + nav anclas -->
<main>
  <section hero>    <!-- título + CTA dual -->
  <section sobre>   <!-- biography + stack -->
  <section contacto> <!-- correo + ubicación -->
</main>
<footer>            <!-- legal / republica -->
```

---

## 10. Historial de revisión

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 03/08/2026 | Documento inicial con todas las secciones |