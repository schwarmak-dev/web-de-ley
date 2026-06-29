type P = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconAlert = ({ className }: P) => (
  <svg {...base} className={className}><path d="M12 3 2 20h20z" /><path d="M12 10v4M12 17h.01" /></svg>
);
export const IconMail = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const IconClock = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const IconDoc = ({ className }: P) => (
  <svg {...base} className={className}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></svg>
);
export const IconLink = ({ className }: P) => (
  <svg {...base} className={className}><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 1 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 1 0 7 7l1-1" /></svg>
);
export const IconSearch = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>
);
export const IconWrench = ({ className }: P) => (
  <svg {...base} className={className}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3.8 17.2 6.8 20.2l5.7-5.5a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-2.3 2.3-2.6Z" /></svg>
);
export const IconBook = ({ className }: P) => (
  <svg {...base} className={className}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" /><path d="M18 3v18" /><path d="M8 7h6" /></svg>
);
export const IconCheck = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="m8.3 12 2.5 2.5 4.9-5" /></svg>
);
