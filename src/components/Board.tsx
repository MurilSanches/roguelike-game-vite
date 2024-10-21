interface BoardProps {
    level: number
    itemCount: number
    time: number
    score: number
}

const Board = ({ level, itemCount, time, score }: BoardProps) => {
    const formatTime = (time: number) => {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };
    
    const formatScore = (score: number) => String(score).padStart(12, '0');
    
    return (
        <div style={{ position: 'absolute', top: '-100px', left: '0', width: '100%', textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>Level: {level}</div>
            <div>Items Remaining: {itemCount}</div>
            <div>Time: {formatTime(time)}</div>
            <div>Score: {formatScore(score)}</div>
        </div>
    )
}

export default Board