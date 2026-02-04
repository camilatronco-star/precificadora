import React, { useState, useMemo } from 'react';
import PriceFormationCard from './PriceFormationCard';
import PriceFormationBuilder from './PriceFormationBuilder';
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const PriceFormationSection = ({ models, onSave, onDelete, onEdit, onLaunchBoleta, filters, setFilters }) => {
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [editingModel, setEditingModel] = useState(null);

    const filteredModels = useMemo(() => {
        return models.filter(m => {
            const matchProduct = filters.product === 'all' || m.product === filters.product;
            const matchDest = !filters.destination || m.destination.toLowerCase().includes(filters.destination.toLowerCase());
            const matchOrigin = !filters.origin || m.origin.toLowerCase().includes(filters.origin.toLowerCase());
            return matchProduct && matchDest && matchOrigin;
        });
    }, [models, filters]);

    const handleOpenBuilder = (model = null) => {
        setEditingModel(model);
        setIsBuilderOpen(true);
    };

    const handleCloseBuilder = () => {
        setEditingModel(null);
        setIsBuilderOpen(false);
    };

    const handleSave = (data) => {
        onSave(data, editingModel?.id);
        handleCloseBuilder();
    };

    const filterInputStyle = {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid var(--color-neutral-border)',
        fontSize: '14px',
        width: '100%',
        backgroundColor: '#f9fafb',
        height: '42px',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#6b7280',
        marginBottom: '6px',
        display: 'block',
        textTransform: 'uppercase'
    };

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '24px' }}>
                {!isBuilderOpen && (
                    <button
                        className="btn btn-primary"
                        onClick={() => handleOpenBuilder()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: 700,
                            borderRadius: '6px'
                        }}
                    >
                        <PlusIcon style={{ width: '16px', height: '16px', strokeWidth: 2 }} />
                        Novo Modelo
                    </button>
                )}
            </div>

            {isBuilderOpen && (
                <div style={{ marginBottom: '32px' }}>
                    <PriceFormationBuilder
                        initialData={editingModel}
                        onSave={handleSave}
                        onCancel={handleCloseBuilder}
                    />
                </div>
            )}

            {/* Filters */}
            {!isBuilderOpen && (
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-neutral-text-secondary)', marginBottom: '10px' }}>Filtrar por:</div>
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: '1px solid var(--color-neutral-border)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '16px',
                        alignItems: 'end'
                    }}>
                        <div>
                            <label style={labelStyle}>Produto</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={filters.product}
                                    onChange={e => setFilters({ ...filters, product: e.target.value })}
                                    style={{
                                        ...filterInputStyle,
                                        paddingLeft: '12px',
                                        paddingRight: '36px',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 10px center',
                                        backgroundSize: '14px'
                                    }}
                                >
                                    <option value="all">Todos os Produtos</option>
                                    <option value="soybean">Soja</option>
                                    <option value="corn">Milho</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <label style={labelStyle}>Destino</label>
                            <div style={{ position: 'relative' }}>
                                <MagnifyingGlassIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', color: '#9ca3af', pointerEvents: 'none' }} />
                                <input
                                    placeholder="Filtrar destino..."
                                    value={filters.destination}
                                    onChange={e => setFilters({ ...filters, destination: e.target.value })}
                                    style={{ ...filterInputStyle, paddingLeft: '34px' }}
                                />
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <label style={labelStyle}>Origem</label>
                            <div style={{ position: 'relative' }}>
                                <MagnifyingGlassIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', color: '#9ca3af', pointerEvents: 'none' }} />
                                <input
                                    placeholder="Filtrar origem..."
                                    value={filters.origin}
                                    onChange={e => setFilters({ ...filters, origin: e.target.value })}
                                    style={{ ...filterInputStyle, paddingLeft: '34px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cards Grid */}
            {!isBuilderOpen && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredModels.map(model => (
                        <PriceFormationCard
                            key={model.id}
                            model={model}
                            onEdit={handleOpenBuilder}
                            onDelete={onDelete}
                            onLaunchBoleta={onLaunchBoleta}
                        />
                    ))}
                    {filteredModels.length === 0 && (
                        <div style={{
                            gridColumn: '1 / -1',
                            padding: '64px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '12px',
                            border: '1px dashed #d1d5db',
                            textAlign: 'center'
                        }}>
                            <FunnelIcon style={{ width: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#6b7280' }}>Nenhuma formação de preço encontrada</div>
                            <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Crie um novo modelo para começar.</div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default PriceFormationSection;
