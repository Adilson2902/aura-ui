---
"aura-ui-core": patch
"aura-ui-components": patch
"aura-ui-effects": patch
"aura-ui-three": patch
"aura-ui-tailwind": patch
"aura": patch
---

Suíte 3D + reutilização + prep npm

- Novos efeitos: LayeredCard, GlassCard, MovingBorder, OrbitingCircles, Meteors, PerspectiveGrid, BentoGrid, AnimatedBeam, HeroParallax, StickyScroll, Float
- Tokens/primitivas 3D: depth scale, scene/layer, glass specular, elevations
- aura-ui-three real: AuraCanvas, FloatingMesh, ParticleField, HeroScene
- Multi-entry exports em aura-ui-effects, metadata npm, Changesets
- Fixes de types em blur-fade e number-ticker (IntersectionObserver)
