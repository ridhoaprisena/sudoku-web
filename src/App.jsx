import { ThemeProvider } from './contexts/ThemeContext';
import { GameProvider, useGame } from './contexts/GameContext';
import MenuScreen from './screens/MenuScreen';
import GameScreen from './screens/GameScreen';
import './index.css';

function AppContent() {
  const { screen, goToMenu } = useGame();
  return (
    <>
      {screen === 'menu' && <MenuScreen />}
      {screen === 'game' && <GameScreen onMenu={goToMenu} />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ThemeProvider>
  );
}
