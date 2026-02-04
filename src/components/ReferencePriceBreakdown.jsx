import React from 'react';
import { designSystem } from '../styles/designSystem';

/**
 * ReferencePriceBreakdown Component
 * Details the formation of the price (Market Data + Configs).
 * Styled as a secondary information card.
 */
const ReferencePriceBreakdown = ({ marketData, configs }) => {
    const styles = {
        container: {
            padding: '24px',
            border: `1px solid ${designSystem.colors.neutral.border}`,
            borderRadius: designSystem.borderRadius.lg,
            backgroundColor: designSystem.colors.neutral.surface,
            boxShadow: designSystem.shadows.card,
        },
        title: {
            fontSize: designSystem.typography.sizes.body, // Reduced from h3
            fontWeight: designSystem.typography.weights.semibold,
            marginBottom: '20px',
            color: designSystem.colors.neutral.textPrimary,
        },
        section: {
            marginBottom: '24px',
        },
        sectionLabel: {
            fontSize: '10px', // Reduced from small
            fontWeight: designSystem.typography.weights.semibold,
            color: designSystem.colors.secondary.informational,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'block',
            marginBottom: '12px',
            borderBottom: `2px solid ${designSystem.colors.neutral.border}`,
            paddingBottom: '4px',
        },
        item: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: `1px solid ${designSystem.colors.neutral.background}`, // subtle separator
        },
        label: {
            fontSize: '12px', // Reduced from body
            color: designSystem.colors.neutral.textPrimary,
        },
        value: {
            fontSize: '12px', // Reduced from body
            fontWeight: designSystem.typography.weights.medium,
            fontFamily: 'monospace',
            color: designSystem.colors.neutral.textPrimary,
        },
        source: {
            fontSize: '10px', // Reduced from small
            color: designSystem.colors.neutral.textSecondary,
            fontStyle: 'italic',
            marginLeft: '8px',
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Composição do Preço</h2>

            <div style={styles.section}>
                <span style={styles.sectionLabel}>Mercado Internacional</span>
                <div style={styles.item}>
                    <div>
                        <span style={styles.label}>Chicago (Soja)</span>
                        <span style={styles.source}>(via CBOT)</span>
                    </div>
                    <span style={styles.value}>{marketData.chicagoPrice.toFixed(2)} ¢/bu</span>
                </div>
                <div style={styles.item}>
                    <div>
                        <span style={styles.label}>Câmbio BRL/USD</span>
                        <span style={styles.source}>(PTAX)</span>
                    </div>
                    <span style={styles.value}>{marketData.fxRate.toFixed(4)}</span>
                </div>
            </div>

            <div style={{ ...styles.section, marginBottom: 0 }}>
                <span style={styles.sectionLabel}>Custos e Margens</span>
                <div style={styles.item}>
                    <span style={styles.label}>Custo Operacional Fixo</span>
                    <span style={styles.value}>R$ {configs.fixedCosts.toFixed(2)}</span>
                </div>
                <div style={styles.item}>
                    <span style={styles.label}>Logística e Frete</span>
                    <span style={styles.value}>R$ {configs.logisticsCosts.toFixed(2)}</span>
                </div>
                <div style={styles.item}>
                    <span style={styles.label}>Spread (Custo Financeiro)</span>
                    <span style={styles.value}>{configs.interestRate}%</span>
                </div>
            </div>
        </div>
    );
};

export default ReferencePriceBreakdown;
