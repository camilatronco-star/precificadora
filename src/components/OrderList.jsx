import React from 'react';

const OrderList = ({ orders, title, emptyMessage }) => {
    if (!orders || orders.length === 0) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-neutral-text-secondary)', fontStyle: 'italic', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--color-neutral-border)' }}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--color-neutral-border)', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-neutral-border)', backgroundColor: 'var(--color-neutral-background)', fontWeight: 600 }}>
                {title} <span style={{ fontSize: '12px', color: 'var(--color-neutral-text-secondary)', marginLeft: '8px' }}>({orders.length})</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-neutral-border)' }}>
                        <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '12px', color: 'var(--color-neutral-text-secondary)' }}>PRODUTOR</th>
                        <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '12px', color: 'var(--color-neutral-text-secondary)' }}>PRODUTO</th>
                        <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '12px', color: 'var(--color-neutral-text-secondary)' }}>VOLUME</th>
                        <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '12px', color: 'var(--color-neutral-text-secondary)' }}>PREÇO ALVO</th>
                        <th style={{ textAlign: 'right', padding: '12px 24px', fontSize: '12px', color: 'var(--color-neutral-text-secondary)' }}>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid var(--color-neutral-border)' }}>
                            <td style={{ padding: '12px 24px', fontWeight: 500 }}>{order.nome || order.sellerCpf || 'N/A'}</td>
                            <td style={{ padding: '12px 24px' }}>{order.product}</td>
                            <td style={{ padding: '12px 24px' }}>{order.volume} tons</td>
                            <td style={{ padding: '12px 24px', fontWeight: 600 }}>R$ {order.targetPrice?.toFixed(2)}</td>
                            <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    backgroundColor: order.status === 'disparada' ? 'var(--color-warning-bg)' : 'var(--color-neutral-background)',
                                    color: order.status === 'disparada' ? 'var(--color-warning-text)' : 'var(--color-neutral-text-secondary)'
                                }}>
                                    {order.status === 'disparada' ? 'Aguardando Aprovação' : 'Aguardando Preço'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
