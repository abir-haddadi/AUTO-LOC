export default function CarSVG({ id, style }) {
  const colors = ['#2A2A30','#23232A','#1E2830','#2A2018','#1A2020','#201828','#1C1C24','#221818','#1E1E20','#202820'];
  const c = colors[(id - 1) % colors.length];

  return (
    <svg viewBox="0 0 260 120" width="88%" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M22,78 L22,60 Q26,40 56,30 L90,20 Q118,14 135,16 L195,26 Q218,32 226,46 L234,62 L234,78 Z" fill={c} stroke="#3A3A3A" strokeWidth="1"/>
      <path d="M60,30 L78,16 Q98,8 128,8 Q160,8 178,16 L196,26" fill="#17171C" stroke="#333" strokeWidth="0.8"/>
      <path d="M78,16 L66,30 L132,28 L132,9 Q110,9 78,16Z" fill="#1A2535" opacity="0.85"/>
      <path d="M132,28 L132,9 Q162,8 178,16 L194,27Z" fill="#1A2535" opacity="0.85"/>
      <circle cx="188" cy="80" r="18" fill="#111" stroke="#3A3A3A" strokeWidth="1.5"/>
      <circle cx="188" cy="80" r="11" fill="#1A1A1A" stroke="#555" strokeWidth="1"/>
      <circle cx="188" cy="80" r="4" fill="#C9A84C" opacity="0.8"/>
      <circle cx="70" cy="80" r="18" fill="#111" stroke="#3A3A3A" strokeWidth="1.5"/>
      <circle cx="70" cy="80" r="11" fill="#1A1A1A" stroke="#555" strokeWidth="1"/>
      <circle cx="70" cy="80" r="4" fill="#C9A84C" opacity="0.8"/>
      <ellipse cx="228" cy="56" rx="5" ry="3" fill="#C9A84C" opacity="0.8"/>
      <line x1="22" y1="62" x2="234" y2="62" stroke="#C9A84C" strokeWidth="0.4" opacity="0.25"/>
    </svg>
  );
}
