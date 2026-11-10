import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      <div className="theme-toggle-thumb">
        {theme === 'dark' ? '🌙' : '☀️'}
      </div>
    </button>
  );
};

export default ThemeToggle;
