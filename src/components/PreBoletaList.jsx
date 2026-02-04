import React from 'react';
import { designSystem } from '../styles/designSystem';
import PreBoletaItem from './PreBoletaItem';

/**
 * PreBoletaList Component
 * Displays the list of active pre-boletas as a Data Table.
 */
const PreBoletaList = ({ boletas }) => {
    const styles = {
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: designSystem.typography.fontFamily,
        },
        th: {
            textAlign: 'left',
            padding: '16px 24px',
            fontSize: designSystem.typography.sizes.small,
            fontWeight: designSystem.typography.weights.semibold,
            color: designSystem.colors.neutral.textSecondary,
            borderBottom: `1px solid ${designSystem.colors.neutral.border}`,
            textTransform: 'uppercase',
            backgroundColor: designSystem.colors.neutral.surface, // Sticky header bg if needed
        },
        emptyState: {
            padding: '40px',
            textAlign: 'center',
            color: designSystem.colors.neutral.textSecondary,
            fontStyle: 'italic',
        }
    };

    if (!boletas || boletas.length === 0) {
        return <div style={styles.emptyState}>Nenhuma ordem ativa no momento.</div>;
    }

    return (
        <table style={styles.table}>
            <thead>
                <tr>
                    <th style={styles.th}>Produtor</th>
                    <th style={styles.th}>Volume</th>
                    <th style={styles.th}>Preço Alvo</th>
                    <th style={styles.th}>Status</th>
                </tr>
            </thead>
            <tbody>
                {boletas.map(boleta => (
                    <PreBoletaItem key={boleta.id} boleta={boleta} />
                ))}
            </tbody>
        </table>
    );
};

export default PreBoletaList;
