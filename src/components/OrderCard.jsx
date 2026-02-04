import React from 'react';
import {
    TrashIcon,
    PencilSquareIcon,
    EyeIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { PRICING_STATES } from '../logic/constants';

const OrderCard = ({ order, onDelete, onEdit, onApprove, onReject }) => {
    const isBoleta = order.type === 'boleta';

    const cardStyle = {
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-neutral-border)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    };

    const titleStyle = {
        fontSize: '14px',
        fontWeight: 600,
        color: 'var(--color-neutral-text-primary)',
        margin: 0,
        maxWidth: '55%'
    };

    const subtitleStyle = {
        fontSize: '12px',
        color: 'var(--color-neutral-text-secondary)',
        marginTop: '2px'
    };

    const priceStyle = {
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--color-brand-primary)'
    };

    const getStatusBadge = () => {
        switch (order.status) {
            case PRICING_STATES.ORDER_WAITING_PRICE:
                return { text: 'Aguardando Preço', bg: '#fef3c7', color: '#92400e' };
            case PRICING_STATES.BOLETA_AGUARDANDO_APROVACAO:
                return { text: 'Aguardando Aprovação', bg: '#E5E7EB', color: '#374151' };
            case PRICING_STATES.BOLETA_APROVADA:
                return { text: 'Aprovada', bg: 'var(--color-success-bg)', color: 'var(--color-success-text)' };
            case PRICING_STATES.BOLETA_RECUSADA:
                return { text: 'Negada', bg: '#FEE2E2', color: '#B91C1C' };
            case PRICING_STATES.PRE_COMMITMENT_CREATED:
                return { text: 'Integrada', bg: '#DBEAFE', color: '#1E40AF' };
            default:
                return { text: 'Pendente', bg: '#f3f4f6', color: '#6b7280' };
        }
    };

    const badge = getStatusBadge();
    const formattedDate = new Date(order.timestamp).toLocaleDateString('pt-BR');

    const actionButtonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        color: '#6B7280'
    };

    const canApprove = isBoleta && (order.status === PRICING_STATES.BOLETA_AGUARDANDO_APROVACAO || order.status === PRICING_STATES.BOLETA_DISPARADA);

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <div>
                    <h3 style={titleStyle}>{order.nome || 'Produtor Desconhecido'}</h3>
                    <div style={subtitleStyle}>
                        {order.product} • {order.safra || 'Safra Atual'}
                        {order.sellerCpf && <span style={{ display: 'block', fontSize: '10px' }}>CPF/CNPJ: {order.sellerCpf}</span>}
                    </div>
                </div>

                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px' }}>
                    {/* 1. View (Eye) */}
                    <button onClick={() => onEdit(order)} style={actionButtonStyle} title="Visualizar">
                        <EyeIcon style={{ width: '18px' }} />
                    </button>

                    {/* 2. Edit (Pencil) */}
                    <button onClick={() => onEdit(order)} style={actionButtonStyle} title="Editar">
                        <PencilSquareIcon style={{ width: '18px' }} />
                    </button>

                    {/* 3. Approve (Check) */}
                    {canApprove && (
                        <button onClick={() => onApprove(order.id)} style={{ ...actionButtonStyle, color: '#059669' }} title="Aprovar">
                            <CheckIcon style={{ width: '18px' }} />
                        </button>
                    )}

                    {/* 4. Deny (X) */}
                    {canApprove && (
                        <button onClick={() => onReject(order.id)} style={{ ...actionButtonStyle, color: '#DC2626' }} title="Negar">
                            <XMarkIcon style={{ width: '18px' }} />
                        </button>
                    )}

                    {/* 5. Delete (Trash) */}
                    <button onClick={() => onDelete(order.id)} style={actionButtonStyle} title="Excluir">
                        <TrashIcon style={{ width: '18px' }} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
                <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: badge.bg,
                    color: badge.color,
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase'
                }}>
                    {badge.text}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--color-neutral-text-secondary)' }}>
                    {formattedDate}
                </span>
            </div>

            <div style={{ borderTop: '1px solid var(--color-neutral-border)', margin: '4px 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-neutral-text-secondary)' }}>VOLUME</span>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{order.volume} kg</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-neutral-text-secondary)' }}>{isBoleta ? 'PREÇO' : 'PREÇO ALVO'}</span>
                    <span style={priceStyle}>R$ {order.targetPrice?.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
