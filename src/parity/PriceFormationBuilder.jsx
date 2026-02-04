import React, { useState, useEffect } from 'react';

const PriceFormationBuilder = ({ onSave, onCancel, initialData = null }) => {
    const [data, setData] = useState({
        product: 'soybean',
        deliveryStartDate: new Date().toISOString().split('T')[0],
        deliveryEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        origin: '',
        destination: '',
        manualCosts: [{ id: 1, label: 'Frete', value: '' }]
    });

    useEffect(() => {
        if (initialData) {
            setData({
                product: initialData.product,
                deliveryStartDate: initialData.deliveryStartDate || initialData.deliveryDate,
                deliveryEndDate: initialData.deliveryEndDate || initialData.deliveryDate,
                origin: initialData.origin,
                destination: initialData.destination,
                manualCosts: initialData.manualCosts.map(c => ({ ...c }))
            });
        }
    }, [initialData]);

    const handleAddCost = () => {
        setData(prev => ({ ...prev, manualCosts: [...prev.manualCosts, { id: Date.now(), label: '', value: '' }] }));
    };

    const handleUpdateCost = (id, field, value) => {
        setData(prev => ({ ...prev, manualCosts: prev.manualCosts.map(c => c.id === id ? { ...c, [field]: value } : c) }));
    };

    const handleRemoveCost = (id) => {
        setData(prev => ({ ...prev, manualCosts: prev.manualCosts.filter(c => c.id !== id) }));
    };

    const isValid = data.origin && data.destination && data.deliveryStartDate && data.deliveryEndDate && data.manualCosts.every(c => c.label && c.value);

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-neutral-border)',
        fontSize: '14px',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'var(--color-neutral-text-secondary)',
        marginBottom: '6px',
        textTransform: 'uppercase'
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-neutral-border)', boxShadow: 'var(--shadow-card)' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '32px', fontWeight: 700, color: 'var(--color-neutral-text-primary)' }}>
                {initialData ? 'Editar Formação de Preço' : 'Nova Formação de Preço'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div>
                    <label style={labelStyle}>Produto</label>
                    <select value={data.product} onChange={e => setData({ ...data, product: e.target.value })} style={inputStyle}>
                        <option value="soybean">Soja (CBOT)</option>
                        <option value="corn">Milho (B3)</option>
                    </select>
                </div>
                <div>
                    <label style={labelStyle}>Início Entrega</label>
                    <input type="date" value={data.deliveryStartDate} onChange={e => setData({ ...data, deliveryStartDate: e.target.value })} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Fim Entrega</label>
                    <input type="date" value={data.deliveryEndDate} onChange={e => setData({ ...data, deliveryEndDate: e.target.value })} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Origem</label>
                    <input placeholder="Cidade de Origem" value={data.origin} onChange={e => setData({ ...data, origin: e.target.value })} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Destino</label>
                    <input placeholder="Ex: Porto de Santos" value={data.destination} onChange={e => setData({ ...data, destination: e.target.value })} style={inputStyle} />
                </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Composição de Custos</h3>
                    <button type="button" onClick={handleAddCost} style={{ background: 'none', border: 'none', color: 'var(--color-brand-primary)', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>+ Adicionar Componente</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.manualCosts.map(cost => (
                        <div key={cost.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 48px', gap: '12px', alignItems: 'center' }}>
                            <input placeholder="Nome do Custo (ex: Frete, Margem)" value={cost.label} onChange={e => handleUpdateCost(cost.id, 'label', e.target.value)} style={inputStyle} />
                            <input type="number" placeholder="Valor" value={cost.value} onChange={e => handleUpdateCost(cost.id, 'value', e.target.value)} style={inputStyle} />
                            <button type="button" onClick={() => handleRemoveCost(cost.id)} style={{ width: '100%', height: '44px', padding: '0', background: 'none', border: '1px solid #fee2e2', color: '#ef4444', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s' }}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '40px' }}>
                <button onClick={onCancel} className="btn" style={{ minWidth: '140px', backgroundColor: '#f9fafb', border: '1px solid var(--color-neutral-border)' }}>Cancelar</button>
                <button
                    disabled={!isValid}
                    onClick={() => onSave(data)}
                    className="btn btn-primary"
                    style={{ minWidth: '200px', opacity: isValid ? 1 : 0.5 }}
                >
                    {initialData ? 'Atualizar Modelo' : 'Confirmar e Salvar'}
                </button>
            </div>
        </div>
    );
};

export default PriceFormationBuilder;
