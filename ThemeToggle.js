import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => !!localStorage.getItem('theme') && localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button className="theme-toggle" onClick={() => setDark(d => !d)}>
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
