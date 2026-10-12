type Point = { label: string; nota: number; title: string };

const WIDTH = 640;
const HEIGHT = 192;
const PAD = { top: 16, right: 16, bottom: 32, left: 28 };

function scoreLabel(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function GradeChart({ data }: { data: Point[] }) {
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const xAt = (index: number) =>
    data.length <= 1 ? PAD.left + innerW / 2 : PAD.left + (index / (data.length - 1)) * innerW;
  const yAt = (nota: number) => PAD.top + ((10 - nota) / 10) * innerH;
  const line = data
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xAt(index).toFixed(1)} ${yAt(point.nota).toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="mt-2 h-48 w-full"
      role="img"
      aria-label="Notas ao longo do ano"
    >
      {[0, 5, 10].map((tick) => (
        <g key={tick}>
          <line
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={yAt(tick)}
            y2={yAt(tick)}
            stroke="var(--color-line)"
          />
          <text x="0" y={yAt(tick) + 4} fontSize="12" fill="var(--color-muted)">
            {tick}
          </text>
        </g>
      ))}
      {line ? <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="2" /> : null}
      {data.map((point, index) => (
        <g key={`${point.title}-${point.label}-${index}`}>
          <title>{`${point.title}: ${scoreLabel(point.nota)}`}</title>
          <circle cx={xAt(index)} cy={yAt(point.nota)} r={4} fill="var(--color-primary)" />
          <text
            x={xAt(index)}
            y={HEIGHT - 8}
            textAnchor="middle"
            fontSize="12"
            fill="var(--color-muted)"
          >
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default GradeChart;
