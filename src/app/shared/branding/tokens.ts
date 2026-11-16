// GOLMET — tokens canônicos da marca (RN-014, RN-016-2)
// Espelho TypeScript dos tokens CSS (src/styles.scss) — use em canvas/SVG.
// Troca rápida de branding em caso de veto (charter §8): mude aqui + styles.scss.

export const BRAND = {
  /** Fundo/primário — obsidiana */
  obsidiana: '#1A1D21',
  /** Acento da arkhē (placa, losango, selo) — ouro */
  ouro: '#E8B44A',
  /** Sinal de divergência (olhos do Arki, flags stale) — laranja-âmbar */
  amber: '#FF6B35',
} as const;

export type BrandColor = keyof typeof BRAND;
