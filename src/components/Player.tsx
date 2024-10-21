import { PLAYER_SIZE } from '../constants/game';
import { Position } from '../types/game';

interface PlayerProps {
    position: Position;
}

const Player = ({ position }: PlayerProps) => { 
    return(
        <div
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: `${PLAYER_SIZE}px`,
                height: `${PLAYER_SIZE}px`,
                backgroundColor: 'blue',
                borderRadius: '50%',
            }}
        />
    );
}

export default Player;
