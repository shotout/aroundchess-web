interface CircularProgressProps {
  percentage: number;
  label?: string;
}

const CircularProgress = ({
  percentage,
  label = "Uploading...",
}: CircularProgressProps) => {
  const radius = 16;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-1">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#221AE9" />
            <stop offset="50%" stopColor="#8783FF" />
            <stop offset="100%" stopColor="#8783FF" />
          </linearGradient>
        </defs>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-[#221AE9] font-normal text-[8px]"
        >
          {percentage}%
        </text>
      </svg>
      <p className="text-black text-[14px] --10px font-normal">{label}</p>
    </div>
  );
};

export default CircularProgress;
