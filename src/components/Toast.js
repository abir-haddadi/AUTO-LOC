'use client';
import { useEffect, useState } from 'react';

let toastHandler = null;

export function showToast(message, icon = '✓') {
  if (toastHandler) toastHandler(message, icon);
}

export default function Toast() {
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [icon, setIcon] = useState('✓');

  useEffect(() => {
    toastHandler = (message, ic) => {
      setMsg(message);
      setIcon(ic);
      setVisible(true);
      setTimeout(() => setVisible(false), 3200);
    };
    return () => { toastHandler = null; };
  }, []);

  return (
    <div className={`toast ${visible ? '' : 'hidden'}`}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span>{msg}</span>
    </div>
  );
}
