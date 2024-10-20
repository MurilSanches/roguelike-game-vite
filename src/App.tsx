import React, { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import './App.css';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  playerPosition: Position;
  items: Position[];
  setPlayerPosition: (x: number, y: number) => void;
  setItems: (items: Position[]) => void;
}

const PLAYER_SPEED = 5;
const PLAYER_SIZE = 32;
const ITEM_SIZE = 16;
const POINTS_PER_ITEM = 100;

const useGameStore = create<GameState>((set) => ({
  playerPosition: { x: 64, y: 64 },
  items: [],
  setPlayerPosition: (x, y) => set({ playerPosition: { x, y } }),
  setItems: (items) => set({ items }),
}));

const Player: React.FC = () => {
  const { playerPosition } = useGameStore();

  return (
    <div
      style={{
        position: 'absolute',
        left: playerPosition.x,
        top: playerPosition.y,
        width: `${PLAYER_SIZE}px`,
        height: `${PLAYER_SIZE}px`,
        backgroundColor: 'blue',
        borderRadius: '50%',
      }}
    />
  );
};

interface ItemProps {
  position: Position;
  onCollect: () => void;
}

const Item: React.FC<ItemProps> = ({ position, onCollect }) => {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    if (collected) return;

    const checkCollision = () => {
      const { playerPosition } = useGameStore.getState();

      // Improved collision detection using bounding box method
      const playerLeft = playerPosition.x;
      const playerRight = playerPosition.x + PLAYER_SIZE;
      const playerTop = playerPosition.y;
      const playerBottom = playerPosition.y + PLAYER_SIZE;

      const itemLeft = position.x;
      const itemRight = position.x + ITEM_SIZE;
      const itemTop = position.y;
      const itemBottom = position.y + ITEM_SIZE;

      const isColliding =
        playerRight > itemLeft &&
        playerLeft < itemRight &&
        playerBottom > itemTop &&
        playerTop < itemBottom;

      if (isColliding && !collected) {
        setCollected(true);
        if (itemRef.current) {
          itemRef.current.classList.add('explode');
          itemRef.current.style.transform = 'scale(1.5)';
          itemRef.current.style.opacity = '0';
          setTimeout(() => {
            onCollect();
          }, 300);
        } else {
          onCollect();
        }
      }
    };
    const animationFrame = requestAnimationFrame(checkCollision);
    return () => cancelAnimationFrame(animationFrame);
  }, [position, onCollect, collected]);

  return (
    <div
      ref={itemRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: `${ITEM_SIZE}px`,
        height: `${ITEM_SIZE}px`,
        backgroundColor: collected ? 'transparent' : 'yellow',
        borderRadius: '50%',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        opacity: collected ? 0 : 1,
      }}
      className="item"
    />
  );
};

const keysPressed: Record<string, boolean> = {};

const handleKeyDown = (e: KeyboardEvent) => {
  keysPressed[e.key] = true;
};

const handleKeyUp = (e: KeyboardEvent) => {
  keysPressed[e.key] = false;
};

const updatePlayerPosition = () => {
  const { playerPosition, setPlayerPosition } = useGameStore.getState();
  let { x, y } = playerPosition;

  if (keysPressed['w'] || keysPressed['ArrowUp']) {
    y -= PLAYER_SPEED;
  }
  if (keysPressed['s'] || keysPressed['ArrowDown']) {
    y += PLAYER_SPEED;
  }
  if (keysPressed['a'] || keysPressed['ArrowLeft']) {
    x -= PLAYER_SPEED;
  }
  if (keysPressed['d'] || keysPressed['ArrowRight']) {
    x += PLAYER_SPEED;
  }

  x = Math.max(8, Math.min(256 - PLAYER_SIZE - 8, x));
  y = Math.max(8, Math.min(256 - PLAYER_SIZE - 8, y));

  setPlayerPosition(x, y);
};

const Borders: React.FC<{ levelColor: string }> = ({ levelColor }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '0',
        top: '0',
        width: '256px', height: '256px',
        border: `8px solid ${levelColor}`,
        boxSizing: 'border-box',
      }}
    />
  );
};

const generateNonOverlappingItems = (itemCount: number): Position[] => {
  const newItems: Position[] = [];
  while (newItems.length < itemCount) {
    const newItem = {
      x: 8 + Math.random() * (256 - 40),
      y: 8 + Math.random() * (256 - 40),
    };
    const isOverlapping = newItems.some(item => {
      const itemLeft = item.x;
      const itemRight = item.x + ITEM_SIZE;
      const itemTop = item.y;
      const itemBottom = item.y + ITEM_SIZE;

      const newItemLeft = newItem.x;
      const newItemRight = newItem.x + ITEM_SIZE;
      const newItemTop = newItem.y;
      const newItemBottom = newItem.y + ITEM_SIZE;

      return (
        itemRight > newItemLeft &&
        itemLeft < newItemRight &&
        itemBottom > newItemTop &&
        itemTop < newItemBottom
      );
    });
    if (!isOverlapping) {
      newItems.push(newItem);
    }
  }
  return newItems;
};

const Game: React.FC = () => {
  const { items, setItems } = useGameStore();
  const [itemCount, setItemCount] = useState(5);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [levelColor, setLevelColor] = useState('red');

  useEffect(() => {
    if (gameStarted) {
      const newItems = generateNonOverlappingItems(5);
      setItems(newItems);
      setItemCount(newItems.length);

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      const interval = setInterval(updatePlayerPosition, 16);
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        clearInterval(interval);
        clearInterval(timer);
      };
    }
  }, [setItems, gameStarted]);

  useEffect(() => {
    if (itemCount === 0 && gameStarted) {
      // Level completed, start a new level
      setLevel((prevLevel) => prevLevel + 1);
      setLevelColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`); // Change to a random color
      const newItems = generateNonOverlappingItems(5);
      setItems(newItems);
      setItemCount(newItems.length);
    }
  }, [itemCount, gameStarted, setItems]);

  const handleItemCollect = () => {    
    setItemCount((prevCount) => prevCount - 1);
    setScore((prevScore) => prevScore + POINTS_PER_ITEM);
  };

  const formatTime = (time: number) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const formatScore = (score: number) => {
    return String(score).padStart(12, '0');
  };

  const startGame = () => {
    setGameStarted(true);
    setTime(0);
    setScore(0);
    setLevel(1);
    setLevelColor('red');
    const newItems = generateNonOverlappingItems(5);
    setItems(newItems);
    setItemCount(newItems.length);
  };

  return (
    <div style={{ position: 'relative', width: '256px', height: '256px' }}>
      {!gameStarted && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'red',
          }}
        >
          <h1>ROGUELIKE</h1>
          <button onClick={startGame} style={{ marginTop: '20px' }}>Start Game</button>
        </div>
      )}
      {gameStarted && (
        <>
          <div style={{ position: 'absolute', top: '-100px', left: '0', width: '100%', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>Level: {level}</div>
            <div>Items Remaining: {itemCount}</div>
            <div>Time: {formatTime(time)}</div>
            <div>Score: {formatScore(score)}</div>
          </div>
          <Borders levelColor={levelColor} />
          <Player />
          {items.map((item, index) => (
            <Item key={index} position={item} onCollect={() => handleItemCollect()} />
          ))}
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <Game />
    </div>
  );
};

export default App;
