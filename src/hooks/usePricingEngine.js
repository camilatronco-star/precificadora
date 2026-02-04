import { useState, useMemo, useEffect } from 'react';
import { calculateReferencePrice } from '../logic/pricing';
import { PRICING_STATES } from '../logic/constants';
import { commitmentService } from '../logic/commitmentService';

export const usePricingEngine = (initialMarketData, initialConfigs) => {
    const [marketData, setMarketData] = useState(initialMarketData);
    const [configs, setConfigs] = useState(initialConfigs);
    const [items, setItems] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const referencePrice = useMemo(() => {
        return calculateReferencePrice({
            chicagoPrice: marketData.chicagoPrice,
            fxRate: marketData.fxRate,
            fixedCosts: configs.fixedCosts,
            freightType: configs.freightType || 'sem frete',
        });
    }, [marketData, configs]);

    const createItem = (data) => {
        const { type } = data;
        const initialState = type === 'boleta'
            ? PRICING_STATES.BOLETA_AGUARDANDO_APROVACAO
            : PRICING_STATES.ORDER_WAITING_PRICE;

        const newItem = {
            id: Date.now() + Math.random(),
            ...data,
            timestamp: new Date().toISOString(),
            status: initialState,
            type: type
        };

        setItems((prev) => [newItem, ...prev]);
        return newItem;
    };

    const deleteItem = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleApproval = async (id, onSuccess, onError) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        // 1. Update status to Approved (LOCAL)
        setItems(prev => prev.map(i =>
            i.id === id ? { ...i, status: PRICING_STATES.BOLETA_APROVADA } : i
        ));

        if (onSuccess) onSuccess();

        try {
            // 2. Call API only AFTER status is Approved
            await commitmentService.createPreCommitment(item, referencePrice);

            // 3. Update status to Integrated
            setItems(prev => prev.map(i =>
                i.id === id ? { ...i, status: PRICING_STATES.PRE_COMMITMENT_CREATED } : i
            ));
        } catch (error) {
            // 4. Rollback on failure
            setItems(prev => prev.map(i =>
                i.id === id ? { ...i, status: PRICING_STATES.BOLETA_AGUARDANDO_APROVACAO } : i
            ));
            if (onError) onError(error.message);
        }
    };

    const handleRejection = (id) => {
        setItems(prev => prev.map(i =>
            i.id === id ? { ...i, status: PRICING_STATES.BOLETA_RECUSADA } : i
        ));
    };

    const updateItem = (id, data) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    };

    useEffect(() => {
        const monitorInterval = setInterval(() => {
            setItems((currentItems) => {
                let hasChanges = false;
                const newNotifications = [];

                const updatedItems = currentItems.map((item) => {
                    if (item.status === PRICING_STATES.ORDER_WAITING_PRICE && referencePrice >= item.targetPrice) {
                        hasChanges = true;
                        newNotifications.push({
                            id: Date.now() + Math.random(),
                            message: "Preço atingido. Boleta gerada com sucesso.",
                            type: 'success'
                        });

                        return {
                            ...item,
                            status: PRICING_STATES.BOLETA_AGUARDANDO_APROVACAO,
                            type: 'boleta',
                            convertedFromOrder: true
                        };
                    }
                    return item;
                });

                if (newNotifications.length > 0) {
                    setNotifications(prev => [...prev, ...newNotifications]);
                }

                return hasChanges ? updatedItems : currentItems;
            });
        }, 5000);

        return () => clearInterval(monitorInterval);
    }, [referencePrice]);

    const clearNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return {
        marketData,
        setMarketData,
        configs,
        setConfigs,
        items,
        referencePrice,
        createItem,
        deleteItem,
        updateItem,
        handleApproval,
        handleRejection,
        notifications,
        clearNotification,
        updateConfigs: (newConfigs) => setConfigs((prev) => ({ ...prev, ...newConfigs })),
    };
};
