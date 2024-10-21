import { useEffect, useState, useRef } from "react";
import { PLAYER_SIZE, PLAYER_SPEED, POINTS_PER_ITEM } from "../constants/game";
import Borders from "./Border";
import Player from "./Player";
import Item from "./Item";
import { useGameStore } from "../context/game";
import Home from "./Home";
import Board from "./Board";
import { generateNonOverlappingItems } from "../utils/generateNonOverlappingitems";

const Game = () => {
    const { items, setItems, playerPosition } = useGameStore();

    const [itemCount, setItemCount] = useState(5);
    const [time, setTime] = useState(0);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameStarted, setGameStarted] = useState(false);
    const [levelColor, setLevelColor] = useState('red');

    const keysPressed = useRef<Record<string, boolean>>({});

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressed.current[e.key] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const updatePlayerPosition = () => {
        const { playerPosition, setPlayerPosition } = useGameStore.getState()
        let { x, y } = playerPosition;

        if (keysPressed.current['w'] || keysPressed.current['ArrowUp']) {
            y -= PLAYER_SPEED;
        }
        if (keysPressed.current['s'] || keysPressed.current['ArrowDown']) {
            y += PLAYER_SPEED;
        }
        if (keysPressed.current['a'] || keysPressed.current['ArrowLeft']) {
            x -= PLAYER_SPEED;
        }
        if (keysPressed.current['d'] || keysPressed.current['ArrowRight']) {
            x += PLAYER_SPEED;
        }

        // Limita a posição do jogador dentro dos limites da tela
        x = Math.max(8, Math.min(256 - PLAYER_SIZE - 8, x));
        y = Math.max(8, Math.min(256 - PLAYER_SIZE - 8, y));

        setPlayerPosition(x, y);       
    }

    useEffect(() => {
        if (gameStarted) {
            // Inicia a movimentação do jogador
            const newItems = generateNonOverlappingItems(5);
            setItems(newItems);
            setItemCount(newItems.length);

            const interval = setInterval(updatePlayerPosition, 16);
            const timer = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);

            return () => {
                clearInterval(timer);
                clearInterval(interval);
            };
        }
    }, [gameStarted, setItems]);

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
            {gameStarted === false ? (
                <Home startGame={startGame} />
            ): (
                <>
                    <Board level={level} score={score} itemCount={itemCount} time={time} />
                    <Borders levelColor={levelColor} />
                    <Player position={playerPosition} />
                    {items.map((item, index) => (
                        <Item key={index} position={item} onCollect={() => handleItemCollect()} />
                    ))}
                </>
            )}
        </div>
    );
};

export default Game;
