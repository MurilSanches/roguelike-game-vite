const Borders = ({ levelColor }: { levelColor: string }) => (
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

export default Borders