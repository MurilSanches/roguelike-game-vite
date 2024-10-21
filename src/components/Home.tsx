interface HomeProps {
    startGame(): void
}

const Home = ({ startGame }: HomeProps) =>  (
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
)

export default Home