import React from 'react';
import { designSystem } from '../styles/designSystem';

/**
 * ReferencePriceEngine Component
 * Displays the main reference price output by the engine.
 * Styled as a primary KPI card.
 */
const ReferencePriceEngine = ({ price, dataSource }) => {
    const styles = {
        container: {
            padding: '16px 20px',
            backgroundColor: designSystem.colors.neutral.surface,
            borderRadius: designSystem.borderRadius.lg,
            boxShadow: designSystem.shadows.card,
            border: `1px solid ${designSystem.colors.neutral.border}`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        },
        label: {
            fontSize: '11px', // Smaller, secondary
            fontWeight: designSystem.typography.weights.medium,
            color: designSystem.colors.neutral.textSecondary,
            marginBottom: '0px', // Attached to value
            lineHeight: '1.2',
            textTransform: 'uppercase', // distinct visual style
            letterSpacing: '0.05em',
        },
        priceValue: {
            fontSize: '20px', // Compact primary
            fontWeight: designSystem.typography.weights.bold,
            color: designSystem.colors.brand.primary,
            letterSpacing: '-0.5px',
            marginBottom: '0px',
            lineHeight: '1.1',
        },
        currency: {
            fontSize: '12px',
            fontWeight: designSystem.typography.weights.medium,
            color: designSystem.colors.neutral.textSecondary,
            marginRight: '2px', // Tighter
            verticalAlign: 'baseline',
        },
        sourceTag: {
            fontSize: '10px',
            color: designSystem.colors.neutral.textSecondary,
            marginTop: '4px', // Minimal separation
        }
    };

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);

    return (
        <div style={styles.container}>
            <div style={styles.label}>Preço de Referência</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={styles.priceValue}>
                    <span style={styles.currency}>R$</span>
                    {formattedPrice}
                </div>
            </div>
            <span style={styles.sourceTag}>Fonte: {dataSource || 'Chicago / FX'}</span>
        </div>
    );
};

export default ReferencePriceEngine;
