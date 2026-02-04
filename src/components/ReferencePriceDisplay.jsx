import React from 'react';

const ReferencePriceDisplay = ({ priceBrl, priceUsd, unit = 'sc', label = 'Preço de Referência' }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
            <span className="text-secondary" style={{ fontSize: 'var(--font-size-small)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label} (BRL / {unit})
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-neutral-text-secondary)' }}>R$</span>
                <span style={{ fontSize: 'var(--font-size-price)', fontWeight: 'bold', lineHeight: 1, color: 'var(--color-brand-primary)' }}>
                    {priceBrl?.toFixed(2)}
                </span>
            </div>
            {priceUsd && (
                <div style={{ marginTop: '8px', fontSize: 'var(--font-size-body)', color: 'var(--color-neutral-text-secondary)' }}>
                    ~ USD {priceUsd?.toFixed(2)} / bu
                </div>
            )}
        </div>
    );
};

export default ReferencePriceDisplay;
