import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { usePricingEngine } from './hooks/usePricingEngine';
import Sidebar from './components/Sidebar';
import ReferencePriceDisplay from './components/ReferencePriceDisplay';
import MarketDataCard from './components/MarketDataCard';
import PriceCompositionCard from './components/PriceCompositionCard';
import OrderCard from './components/OrderCard';
import BoletaModal from './components/BoletaModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import { PRICING_STATES } from './logic/constants';
import logoMerx from './assets/logo_merx_real.png';
import { PlusIcon } from '@heroicons/react/24/outline';
import Login from './components/Login';
import './styles/designSystem.css';

// --- ADDITIVE PRICE FORMATION IMPORTS ---
import { PriceFormationModel } from './parity/PriceFormationModel';
import PriceFormationSection from './parity/PriceFormationSection';

const INITIAL_MARKET_DATA = { chicagoPrice: 1320.75, fxRate: 5.8240 };
const INITIAL_CONFIGS = { fixedCosts: 120.00, logisticsCosts: 350.00, interestRate: 2.1, freightType: 'sem frete' };

const App = () => {
    const {
        referencePrice, marketData, configs, items, createItem, deleteItem, updateItem,
        handleApproval, handleRejection, notifications, clearNotification, setMarketData
    } = usePricingEngine(INITIAL_MARKET_DATA, INITIAL_CONFIGS);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState('Soja');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('ordem');
    const [editingItem, setEditingItem] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
    const [toasts, setToasts] = useState([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // --- ADDITIVE PRICE FORMATION STATE ---
    const [formationModels, setFormationModels] = useState([]);
    const [activeTab, setActiveTab] = useState('formation');
    const { isAuthenticated, isLoading, user, logout } = useAuth0();
    const [formationFilters, setFormationFilters] = useState({
        product: 'all',
        destination: '',
        origin: ''
    });

    useEffect(() => {
        if (notifications.length > 0) {
            notifications.forEach(n => {
                setToasts(prev => [...prev, { id: n.id, message: n.message, type: n.type }]);
                clearNotification(n.id);
            });
        }
    }, [notifications, clearNotification]);

    const addToast = (message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    useEffect(() => {
        const interval = setInterval(() => {
            const fluctuation = (Math.random() - 0.5) * 5;
            setMarketData(prev => ({
                ...prev,
                chicagoPrice: prev.chicagoPrice + fluctuation,
                fxRate: prev.fxRate + (fluctuation * 0.001),
            }));
            setLastUpdate(new Date().toLocaleTimeString());
        }, 3000);
        return () => clearInterval(interval);
    }, [setMarketData]);

    const referencePriceUsd = referencePrice / marketData.fxRate;
    const filteredItems = items.filter(i => i.product === selectedProduct);

    // Ordens (Aguardando Preço Alvo)
    const awaitingPrice = filteredItems.filter(i => i.status === PRICING_STATES.ORDER_WAITING_PRICE);

    // Boletas Disparadas (Include all boleta statuses for visibility)
    const boletasDisparadas = filteredItems.filter(i =>
    (i.status === PRICING_STATES.BOLETA_DISPARADA ||
        i.status === PRICING_STATES.BOLETA_AGUARDANDO_APROVACAO ||
        i.status === PRICING_STATES.BOLETA_APROVADA ||
        i.status === PRICING_STATES.BOLETA_RECUSADA ||
        i.status === PRICING_STATES.PRE_COMMITMENT_CREATED)
    );

    const handleApproveAction = (id) => {
        handleApproval(
            id,
            () => addToast("Boleta aprovada com sucesso", "success"),
            (err) => addToast(`${err}`, "error")
        );
    };

    const handleRejectAction = (id) => {
        handleRejection(id);
        addToast("Boleta negada com sucesso", "success");
    };

    const handleCreate = (data) => {
        // PERMITTED FLOW
        createItem(data);
        setIsModalOpen(false);

        // SUCCESS TOAST PATTERN
        const componentName = data.type === 'boleta' ? 'Boleta' : 'Ordem';
        addToast(`${componentName} criada com sucesso`, "success");
    };

    // --- ADDITIVE PRICE FORMATION HANDLERS ---
    const handleSaveFormation = (data, id) => {
        if (id) {
            setFormationModels(prev => prev.map(m => {
                if (m.id === id) {
                    m.update(data);
                    return m;
                }
                return m;
            }));
            addToast("Modelo de formação atualizado", "success");
        } else {
            const newModel = new PriceFormationModel(null, data);
            setFormationModels(prev => [...prev, newModel]);
            addToast("Modelo de formação criado com sucesso", "success");
        }
    };

    const handleDeleteFormation = (id) => {
        setFormationModels(prev => prev.filter(m => m.id !== id));
        addToast("Modelo removido", "success");
    };

    const handleLaunchFromFormation = (model) => {
        const preFilledData = {
            product: model.product === 'soybean' ? 'Soja' : 'Milho',
            precoAlvo: model.calculatePrice().toFixed(2),
            localEntrega: model.origin,
            porto: model.destination,
            market_reference: model.market,
            deliveryStartDate: model.deliveryStartDate,
            deliveryEndDate: model.deliveryEndDate,
            isContextual: true
        };
        setEditingItem(preFilledData);
        setModalType('boleta');
        setIsModalOpen(true);
    };

    const contentMargin = isSidebarOpen ? '280px' : '0px';

    if (isLoading) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--color-brand-primary)', fontWeight: 600 }}>Carregando...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
            <Sidebar isOpen={isSidebarOpen} />
            <div style={{ flex: 1, marginLeft: contentMargin, transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#FFFFFF' }}>
                <header style={{ height: '64px', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--color-neutral-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 90 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-text-secondary)', padding: 0, display: 'flex' }}>
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <img
                            src={logoMerx}
                            alt="MERX"
                            style={{ height: '22px', border: 'none', background: 'transparent' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {user && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--color-neutral-border)', paddingRight: '16px' }}>
                                <img src={user.picture} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-text-primary)' }}>{user.name}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--color-neutral-text-secondary)' }}>{user.email}</div>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                            style={{
                                background: 'none',
                                border: '1px solid var(--color-neutral-border)',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                color: 'var(--color-neutral-text-secondary)'
                            }}
                        >
                            Sair
                        </button>
                    </div>
                </header>

                <main style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
                    <div style={{ padding: '24px 40px 16px 40px', borderBottom: '1px solid var(--color-neutral-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--color-neutral-text-primary)' }}>Precificadora</h1>
                                <div style={{ fontSize: '13px', color: 'var(--color-neutral-text-secondary)' }}>Início {'>'} Precificadora</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', backgroundColor: 'white', padding: '4px', borderRadius: '8px', border: '1px solid var(--color-neutral-border)', height: 'fit-content' }}>
                                {['Soja', 'Milho'].map(p => (
                                    <button key={p} onClick={() => setSelectedProduct(p)} style={{ border: 'none', padding: '4px 12px', borderRadius: '6px', backgroundColor: selectedProduct === p ? 'var(--color-brand-primary)' : 'transparent', color: selectedProduct === p ? 'white' : 'var(--color-neutral-text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>{p}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            <ReferencePriceDisplay priceBrl={referencePrice} priceUsd={referencePriceUsd} unit="sc" label="Preço Spot (Referência)" />
                            <MarketDataCard cbotPrice={marketData.chicagoPrice} fxRate={marketData.fxRate} />
                            <PriceCompositionCard fixedCosts={configs.fixedCosts} logisticsCosts={configs.logisticsCosts} interestRate={configs.interestRate} />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        {/* Tab Headers */}
                        <div style={{ padding: '0 40px', borderBottom: '1px solid var(--color-neutral-border)', backgroundColor: '#FFFFFF', display: 'flex', gap: '32px' }}>
                            {[
                                { id: 'formation', label: 'Formação de Preço', count: formationModels.length },
                                { id: 'orders', label: 'Ordens', count: awaitingPrice.length },
                                { id: 'boletas', label: 'Boletas Disparadas', count: boletasDisparadas.length }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: '16px 0',
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: activeTab === tab.id ? '2px solid var(--color-brand-primary)' : '2px solid transparent',
                                        color: activeTab === tab.id ? '#003366' : 'var(--color-neutral-text-secondary)',
                                        fontSize: '14px',
                                        fontWeight: 400,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                        marginBottom: '-1px'
                                    }}
                                >
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span style={{
                                            backgroundColor: '#f3f4f6',
                                            color: '#6b7280',
                                            fontSize: '11px',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontWeight: 700
                                        }}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Area */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
                            {activeTab === 'formation' && (
                                <PriceFormationSection
                                    models={formationModels}
                                    onSave={handleSaveFormation}
                                    onDelete={handleDeleteFormation}
                                    onLaunchBoleta={handleLaunchFromFormation}
                                    filters={formationFilters}
                                    setFilters={setFormationFilters}
                                />
                            )}

                            {activeTab === 'orders' && (
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px' }}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => { setEditingItem(null); setModalType('ordem'); setIsModalOpen(true); }}
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
                                            Nova Ordem
                                        </button>
                                    </div>

                                    {awaitingPrice.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                            {awaitingPrice.map(item => <OrderCard key={item.id} order={item} onDelete={setConfirmDeleteId} onEdit={(i) => { setEditingItem(i); setIsModalOpen(true); }} />)}
                                        </div>
                                    ) : (
                                        <div style={{ padding: '64px', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed var(--color-neutral-border)', textAlign: 'center', color: 'var(--color-neutral-text-secondary)', width: '100%' }}>
                                            Nenhuma ordem ativa.
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'boletas' && (
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '24px' }}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => { setEditingItem(null); setModalType('boleta'); setIsModalOpen(true); }}
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
                                            Nova Boleta
                                        </button>
                                    </div>
                                    {boletasDisparadas.length > 0 ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                            {boletasDisparadas.map(item => (
                                                <OrderCard
                                                    key={item.id}
                                                    order={item}
                                                    onDelete={setConfirmDeleteId}
                                                    onEdit={(i) => { setEditingItem(i); setIsModalOpen(true); }}
                                                    onApprove={handleApproveAction}
                                                    onReject={handleRejectAction}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ padding: '64px', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed var(--color-neutral-border)', textAlign: 'center', color: 'var(--color-neutral-text-secondary)', width: '100%' }}>
                                            Nenhuma boleta enviada.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <BoletaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} referencePrice={referencePrice} product={selectedProduct} initialData={editingItem} type={modalType}
                onCreate={handleCreate}
                onUpdate={(id, data) => { updateItem(id, data); setIsModalOpen(false); }}
            />
            <ConfirmModal isOpen={!!confirmDeleteId} title="Excluir item" message="Tem certeza que deseja excluir este item?" onConfirm={() => { deleteItem(confirmDeleteId); setConfirmDeleteId(null); }} onCancel={() => setConfirmDeleteId(null)} />
            <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 3000, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />)}
            </div>
        </div>
    );
};

export default App;
