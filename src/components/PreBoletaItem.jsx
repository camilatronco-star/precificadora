import React from 'react';
import { designSystem } from '../styles/designSystem';

/**
 * PreBoletaItem Component
 * Renders a single pre-boleta order as a table row.
 */
const PreBoletaItem = ({ boleta }) => {
    const isTriggered = boleta.status === 'disparada';

    // Status color logic based on Design System
    const statusStyle = isTriggered
        ? designSystem.colors.status.success
        : { bg: designSystem.colors.neutral.background, text: designSystem.colors.secondary.informational }; // Observing state

    const styles = {
        td: {
            padding: '16px 24px',
            borderBottom: `1px solid ${designSystem.colors.neutral.border}`,
            color: designSystem.colors.neutral.textPrimary,
            fontSize: designSystem.typography.sizes.body,
        },
        volume: {
            fontFamily: 'monospace',
            fontWeight: designSystem.typography.weights.medium,
        },
        price: {
            fontFamily: 'monospace',
            fontWeight: designSystem.typography.weights.medium,
            color: designSystem.colors.neutral.textPrimary,
        },
        badge: {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: designSystem.typography.sizes.small,
            fontWeight: designSystem.typography.weights.medium,
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
            textTransform: 'capitalize', // "disparada" -> "Disparada"
        }
    };

    return (
        <tr style={{ backgroundColor: designSystem.colors.neutral.surface }}>
            <td style={{ ...styles.td, fontWeight: designSystem.typography.weights.medium }}>
                {boleta.sellerCpf}
            </td>
            <td style={styles.td}>
                <span style={styles.volume}>{boleta.volume} ton</span>
            </td>
            <td style={styles.td}>
                <span style={styles.price}>R$ {boleta.targetPrice.toFixed(2)}</span>
            </td>
            <td style={styles.td}>
                <span style={styles.badge}>
                    {isTriggered ? 'Confirmada' : 'Aguardando'}
                </span>
            </td>
        </tr>
    );
};

export default PreBoletaItem;
