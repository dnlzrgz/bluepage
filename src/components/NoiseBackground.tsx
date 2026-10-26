type NoiseProps = { enabled?: boolean };

export function NoiseBackground({ enabled = false }: NoiseProps) {
  if (!enabled) return null;

  return <div aria-hidden className="noise" />;
}
