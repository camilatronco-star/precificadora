import React, { useState, useEffect } from 'react';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    PencilSquareIcon,
    TrashIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';

const PriceFormationCard = ({ model, onEdit, onDelete, onLaunchBoleta }) => {
    const [view, setView] = useState({
        price: model.calculatePrice(),
        marketPrice: model.marketPrice,
        contract: model.contract,
        market: model.market
    });
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const unsubscribe = model.subscribe((price, details) => {
            setView({ price, ...details });
        });
        const stop = model.simulateUpdates();
        return () => { unsubscribe(); stop(); };
    }, [model]);

    const labelStyle = {
        fontSize: '11px',
        color: 'var(--color-neutral-text-secondary)',
        textTransform: 'uppercase',
        fontWeight: 600,
        letterSpacing: '0.02em'
    };

    const valueStyle = {
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--color-neutral-text-primary)'
    };

    const totalManual = model.manualCosts.reduce((acc, c) => acc + (parseFloat(c.value) || 0), 0);

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '1px solid var(--color-neutral-border)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            height: isExpanded ? 'auto' : '130px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header Area */}
            <div style={{ padding: '12px 16px', position: 'relative', flex: isExpanded ? '0 0 auto' : '1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-neutral-text-primary)' }}>
                                {model.product === 'soybean' ? 'Soja' : 'Milho'}
                            </span>
                            <span style={{
                                fontSize: '8px',
                                fontWeight: 'bold',
                                color: 'var(--color-brand-primary)',
                                backgroundColor: 'var(--color-status-success-bg)',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                textTransform: 'uppercase'
                            }}>
                                {view.market}
                            </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                            {model.destination}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2px' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(model); }}
                            style={{ padding: '6px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', borderRadius: '4px' }}
                        >
                            <PencilSquareIcon style={{ width: 14 }} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(model.id); }}
                            style={{ padding: '6px', background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', borderRadius: '4px' }}
                        >
                            <TrashIcon style={{ width: 14 }} />
                        </button>
                    </div>
                </div>

                {/* Bottom Row (Collapsed) */}
                {!isExpanded && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
                        <div>
                            <div style={{ fontSize: '8px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Preço Paridade</div>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-neutral-text-primary)' }}>
                                R$ {view.price.toFixed(2)}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsExpanded(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-neutral-text-secondary)',
                                fontSize: '11px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 0',
                                textDecoration: 'none'
                            }}
                        >
                            Ver detalhes
                            <ChevronDownIcon style={{ width: 12 }} />
                        </button>
                    </div>
                )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                            <div style={{ fontSize: '8px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Preço Paridade</div>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-brand-primary)' }}>
                                R$ {view.price.toFixed(2)}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsExpanded(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-neutral-text-secondary)', cursor: 'pointer' }}
                        >
                            <ChevronUpIcon style={{ width: 14 }} />
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                            <div style={labelStyle}>Contrato</div>
                            <div style={{ ...valueStyle, marginTop: '2px', fontSize: '12px' }}>
                                {view.marketPrice.toFixed(2)} <span style={{ fontSize: '10px', fontWeight: 400, color: '#6b7280' }}>({view.contract})</span>
                            </div>
                        </div>
                        <div>
                            <div style={labelStyle}>Ajustes Totais</div>
                            <div style={{ ...valueStyle, marginTop: '2px', fontSize: '12px' }}>
                                R$ {totalManual.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ ...labelStyle, marginBottom: '6px' }}>Composição de Custos</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {model.manualCosts.map((cost, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                    <span style={{ color: '#6b7280' }}>{cost.label}</span>
                                    <span style={{ fontWeight: 600, color: '#374151' }}>R$ {parseFloat(cost.value).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Período de Entrega</span>
                            <span style={{ color: '#6b7280', fontWeight: 500 }}>{new Date(model.deliveryStartDate).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })} - {new Date(model.deliveryEndDate).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Ponto de Origem</span>
                            <span style={{ color: '#6b7280', fontWeight: 500 }}>{model.origin}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onLaunchBoleta(model)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '10px',
                            backgroundColor: 'var(--color-brand-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <RocketLaunchIcon style={{ width: 14 }} /> Lançar Boleta
                    </button>

                    <button
                        onClick={() => setIsExpanded(false)}
                        style={{ width: '100%', background: 'none', border: 'none', color: '#9ca3af', fontSize: '11px', marginTop: '12px', cursor: 'pointer' }}
                    >
                        Ocultar detalhes
                    </button>
                </div>
            )}
        </div>
    );
};

export default PriceFormationCard;
