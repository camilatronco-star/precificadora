import React from 'react';

const CostItem = ({ label, value, isNegative }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '4px 0' }}>
        <span className="text-secondary">{label}</span>
        <span style={{ fontWeight: 500, color: isNegative ? 'var(--color-error-text)' : 'inherit' }}>
            {isNegative ? '-' : ''} R$ {value?.toFixed(2)}
        </span>
    </div>
);

const PriceCompositionCard = ({ fixedCosts, logisticsCosts, interestRate }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '16px', fontWeight: 600, color: 'var(--color-brand-navy)' }}>
                Composição
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <CostItem label="Custos Fixos" value={fixedCosts} isNegative />
                <CostItem label="Logística" value={logisticsCosts} isNegative />
                <div style={{ margin: '8px 0', borderTop: '1px solid var(--color-neutral-border)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span className="text-secondary">Spread / Juros</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-brand-primary)' }}>
                        {interestRate}% a.m.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PriceCompositionCard;
