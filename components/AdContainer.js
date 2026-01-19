"use client";

export default function AdContainer({ position }) {
    return (
        <div className={`ad-container ${position}`} style={{
            padding: '1rem',
            margin: '2rem auto',
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.1)',
            textAlign: 'center',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#444',
            fontSize: '0.8rem',
            maxWidth: '1200px'
        }}>
            <div>
                <p>Ad Placeholder ({position})</p>
                <span style={{ fontSize: '0.6rem' }}>Add your Adsterra script here</span>
            </div>
        </div>
    );
}
