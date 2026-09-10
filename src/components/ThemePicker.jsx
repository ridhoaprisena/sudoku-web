import { useTheme, THEMES } from '../contexts/ThemeContext';
import './ThemePicker.css';

export default function ThemePicker() {
  const { themeId, setThemeId } = useTheme();

  return (
    <div className="theme-picker" role="group" aria-label="Pilihan tema warna">
      {THEMES.map(theme => (
        <button
          key={theme.id}
          id={`theme-${theme.id}`}
          className={`theme-dot ${themeId === theme.id ? 'theme-dot-active' : ''}`}
          style={{ '--dot-color': theme.primary }}
          onClick={() => setThemeId(theme.id)}
          aria-pressed={themeId === theme.id}
          aria-label={`Tema ${theme.label}`}
          title={theme.label}
        >
          <span className="dot-inner" />
          {themeId === theme.id && (
            <span className="material-icons-round dot-check">check</span>
          )}
        </button>
      ))}
    </div>
  );
}
