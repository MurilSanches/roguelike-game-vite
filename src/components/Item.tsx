import { useEffect, useRef, useState } from "react";
import { ITEM_SIZE, PLAYER_SIZE } from "../constants/game";
import { Position } from "../types/game";
import { useGameStore } from "../context/game";
import { checkCollision } from "../utils/checkCollision";

interface ItemProps {
    position: Position;
    onCollect: () => void;
}
  
const Item = ({ position, onCollect }: ItemProps) => {
    const itemRef = useRef<HTMLDivElement | null>(null);
    const [collected, setCollected] = useState(false);

    const { playerPosition } = useGameStore.getState();

    useEffect(() => {
        if (collected) return;
    
        const verifyCollision = () => {
            const { playerPosition } = useGameStore.getState();
            const isColliding = checkCollision(position, ITEM_SIZE, playerPosition, PLAYER_SIZE);

            console.log(isColliding)
    
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

        const animationFrame = requestAnimationFrame(verifyCollision);
        return () => cancelAnimationFrame(animationFrame);
    }, [position, onCollect, collected, playerPosition]);
  
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

export default Item