import { useEffect, useRef } from 'react';

const ProgressRing = ({ value = 0, max = 100, size = 120, strokeWidth = 10, label = '' }) => {
  const radius   = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct     = Math.min(100, Math.max(0, (value / max) * 100));
  const offset  = circumference - (pct / 100) * circumference;
  const id = `ring-gradient-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="progress-ring-wrapper">
      <svg width={size} height={size} className="progress-ring">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle
          className="progress-ring-track"
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring-fill"
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth}
          stroke={`url(#${id})`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="progress-ring-label">
        <span className="progress-ring-value">{Math.round(pct)}</span>
        <span className="progress-ring-unit">{label || '%'}</span>
      </div>
    </div>
  );
};

export default ProgressRing;
