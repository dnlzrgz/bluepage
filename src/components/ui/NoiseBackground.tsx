type NoiseProps = { enabled?: boolean };

export function NoiseBackground({ enabled = false }: NoiseProps) {
  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 bg-noise opacity-[0.25] mix-blend-overlay"
    />
  );
}
