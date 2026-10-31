# aura-ui-three

Cenas **WebGL** opcionais do Aura UI (React Three Fiber). Use quando precisar de 3D real; o resto da lib roda em CSS 3D.

## Instalação

```bash
npm install aura-ui-core aura-ui-three three @react-three/fiber
```

## Uso

### Hero pronto

```tsx
import { HeroScene } from "aura-ui-three";

<HeroScene height="480px">
  <h1>Seu título sobre a cena</h1>
</HeroScene>;
```

### Canvas custom

```tsx
import { AuraCanvas, FloatingMesh, ParticleField, useAuraPointer } from "aura-ui-three";

<AuraCanvas camera={{ position: [0, 0, 6], fov: 45 }}>
  <ambientLight intensity={0.5} />
  <directionalLight position={[4, 6, 8]} />
  <FloatingMesh shape="icosahedron" color="#7857FF" />
  <ParticleField count={300} />
</AuraCanvas>;
```

## Componentes

| API | Descrição |
| --- | --- |
| `AuraCanvas` | Canvas R3F com dpr limitado + fallback se sem WebGL |
| `FloatingMesh` | Mesh flutuante (box/sphere/torus/icosahedron) |
| `ParticleField` | Nuvem de pontos |
| `HeroScene` | Cena hero (meshes + lights + partículas + pointer) |
| `useAuraPointer` | Ponteiro -1..1 para câmera/tilt |

## Notas

- Peer deps: `three`, `@react-three/fiber`, `react`
- Com Tailwind v4: `@import "aura-ui-three/tailwind.css";` no CSS do app
- Respeita `prefers-reduced-motion` (fallback estático)
- SSR-safe: WebGL só no client

[Repositório e documentação](https://github.com/Adilson2902/aura-ui)

**MIT**
