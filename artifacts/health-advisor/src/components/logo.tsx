interface LogoMarkProps {
  className?: string;
  size?: number;
}

export function LogoMark({ className = "", size = 28 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="currentColor" fillOpacity="0.12" />
      <rect x="13.5" y="6" width="5" height="20" rx="2.5" fill="currentColor" />
      <rect x="6" y="13.5" width="20" height="5" rx="2.5" fill="currentColor" />
    </svg>
  );
}
