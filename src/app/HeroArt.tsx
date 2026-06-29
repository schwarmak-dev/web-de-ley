// Ilustración del héroe: un escudo que protege los datos dispersos
// (planilla, chat, cuaderno) que menciona el título. Pensada para fondo oscuro.
export default function HeroArt() {
  return (
    <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Escudo protegiendo los datos de tu negocio">
      <defs>
        <radialGradient id="glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#0b5c4f" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0b5c4f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#123a33" />
          <stop offset="100%" stopColor="#0c241f" />
        </linearGradient>
      </defs>

      {/* resplandor */}
      <circle cx="210" cy="180" r="170" fill="url(#glow)" />

      {/* líneas punteadas que conectan los datos con el escudo */}
      <g stroke="#5f7d74" strokeWidth="1.4" strokeDasharray="3 5" opacity="0.7">
        <path d="M120 96 C160 130 180 140 196 150" />
        <path d="M324 104 C280 130 250 145 232 156" />
        <path d="M118 300 C160 270 185 250 200 232" />
      </g>

      {/* escudo */}
      <path
        d="M210 64 L300 96 V196 C300 258 260 300 210 320 C160 300 120 258 120 196 V96 Z"
        fill="url(#shield)" stroke="#5fbfa9" strokeWidth="2.5" strokeLinejoin="round"
      />
      {/* check */}
      <path d="M174 192 l24 24 l46 -56" fill="none" stroke="#5fbfa9" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />

      {/* chip planilla (Excel) arriba-izquierda */}
      <g>
        <rect x="42" y="60" width="92" height="66" rx="9" fill="#221d16" stroke="#b9b1a1" strokeWidth="1.6" />
        <line x1="42" y1="82" x2="134" y2="82" stroke="#b9b1a1" strokeWidth="1.4" />
        <line x1="73" y1="60" x2="73" y2="126" stroke="#7a7468" strokeWidth="1.2" />
        <line x1="104" y1="60" x2="104" y2="126" stroke="#7a7468" strokeWidth="1.2" />
        <line x1="42" y1="104" x2="134" y2="104" stroke="#7a7468" strokeWidth="1.2" />
      </g>

      {/* chip chat (WhatsApp) arriba-derecha — acento ámbar */}
      <g>
        <rect x="296" y="62" width="86" height="60" rx="14" fill="#221d16" stroke="#e0a458" strokeWidth="1.8" />
        <path d="M312 122 l-6 14 16 -10 Z" fill="#221d16" stroke="#e0a458" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="312" y1="84" x2="366" y2="84" stroke="#e0a458" strokeWidth="2" strokeLinecap="round" />
        <line x1="312" y1="98" x2="352" y2="98" stroke="#e0a458" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* chip cuaderno abajo-izquierda */}
      <g>
        <rect x="44" y="276" width="80" height="74" rx="7" fill="#221d16" stroke="#b9b1a1" strokeWidth="1.6" />
        <line x1="60" y1="276" x2="60" y2="350" stroke="#7a7468" strokeWidth="1.2" />
        <line x1="70" y1="296" x2="112" y2="296" stroke="#b9b1a1" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="70" y1="312" x2="112" y2="312" stroke="#7a7468" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="70" y1="328" x2="100" y2="328" stroke="#7a7468" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* candado pequeño sobre el escudo */}
      <g transform="translate(196 250)">
        <rect x="0" y="10" width="28" height="20" rx="4" fill="#0c241f" stroke="#5fbfa9" strokeWidth="2" />
        <path d="M6 10 V6 a8 8 0 0 1 16 0 v4" fill="none" stroke="#5fbfa9" strokeWidth="2" />
      </g>
    </svg>
  );
}
