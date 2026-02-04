import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const MarketItem = ({ label, value, unit, trend }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{
            fontSize: 'var(--font-size-small)',
            color: 'var(--color-neutral-text-secondary)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        }}>
            {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{
                fontSize: 'var(--font-size-price)',
                fontWeight: 'bold',
                color: 'var(--color-neutral-text-primary)',
                lineHeight: 1
            }}>
                {value}
            </span>
            {trend && (
                trend === 'up' ?
                    <ArrowTrendingUpIcon style={{ width: 18, color: '#22c55e', alignSelf: 'center' }} /> :
                    <ArrowTrendingDownIcon style={{ width: 18, color: '#ef4444', alignSelf: 'center' }} />
            )}
        </div>
        {unit && <span style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-neutral-text-secondary)' }}>{unit}</span>}
    </div>
);

const MarketDataCard = ({ cbotPrice, fxRate, trend = 'up' }) => {
    return (
        <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '40px'
            }}>
                <MarketItem
                    label="Chicago CBOT"
                    value={cbotPrice?.toFixed(2)}
                    unit="USD / bu"
                    trend={trend}
                />

                <div style={{ width: '1px', height: '48px', backgroundColor: 'var(--color-neutral-border)', alignSelf: 'center' }}></div>

                <MarketItem
                    label="Dólar PTAX"
                    value={fxRate?.toFixed(4)}
                    unit="BRL / USD"
                />
            </div>
        </div>
    );
};

export default MarketDataCard;
