import React, { useState, useEffect } from 'react';
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
import './styles/designSystem.css';

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

    const contentMargin = isSidebarOpen ? '280px' : '0px';

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
                </header>

                <main style={{ padding: '32px 40px', maxWidth: '1600px', width: '100%', margin: '0 auto', backgroundColor: '#FFFFFF' }}>
                    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: 'var(--color-neutral-text-primary)' }}>Precificadora</h1>
                            <div style={{ fontSize: '14px', color: 'var(--color-neutral-text-secondary)' }}>Início {'>'} Precificadora</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'white', padding: '4px', borderRadius: '8px', border: '1px solid var(--color-neutral-border)', height: 'fit-content' }}>
                            {['Soja', 'Milho'].map(p => (
                                <button key={p} onClick={() => setSelectedProduct(p)} style={{ border: 'none', padding: '6px 16px', borderRadius: '6px', backgroundColor: selectedProduct === p ? 'var(--color-brand-primary)' : 'transparent', color: selectedProduct === p ? 'white' : 'var(--color-neutral-text-secondary)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>{p}</button>
                            ))}
                        </div>
                    </div>

                    <section style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '12px' }}>
                            <ReferencePriceDisplay priceBrl={referencePrice} priceUsd={referencePriceUsd} unit="sc" label="Preço Spot (Referência)" />
                            <MarketDataCard cbotPrice={marketData.chicagoPrice} fxRate={marketData.fxRate} />
                            <PriceCompositionCard fixedCosts={configs.fixedCosts} logisticsCosts={configs.logisticsCosts} interestRate={configs.interestRate} />
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-neutral-text-secondary)' }}>Última atualização: {lastUpdate}</div>
                    </section>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', justifyContent: 'flex-end' }}>
                        <button className="btn" onClick={() => { setEditingItem(null); setModalType('ordem'); setIsModalOpen(true); }} style={{ backgroundColor: 'transparent', border: '2px solid var(--color-brand-primary)', color: 'var(--color-brand-primary)', padding: '12px 24px', fontSize: '15px' }}>Nova Ordem</button>
                        <button className="btn btn-primary" onClick={() => { setEditingItem(null); setModalType('boleta'); setIsModalOpen(true); }} style={{ padding: '12px 24px', fontSize: '15px' }}>Nova Boleta</button>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Ordens <span style={{ fontWeight: 400, color: 'var(--color-neutral-text-secondary)', fontSize: '16px' }}>(Aguardando Preço Alvo)</span></h2>
                        {awaitingPrice.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                {awaitingPrice.map(item => <OrderCard key={item.id} order={item} onDelete={setConfirmDeleteId} onEdit={(i) => { setEditingItem(i); setIsModalOpen(true); }} />)}
                            </div>
                        ) : <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '8px', border: '1px dashed var(--color-neutral-border)', textAlign: 'center', color: 'var(--color-neutral-text-secondary)' }}>Nenhuma ordem monitorando o mercado.</div>}
                    </div>

                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Boletas Disparadas</h2>
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
                        ) : <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '8px', border: '1px dashed var(--color-neutral-border)', textAlign: 'center', color: 'var(--color-neutral-text-secondary)' }}>Nenhuma boleta gerada ainda.</div>}
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
