import React, { useState } from 'react';
import { designSystem } from '../styles/designSystem';

/**
 * PreBoletaForm Component
 * Allows creation of pre-boletas.
 * Styled with MERX inputs and buttons.
 */
const PreBoletaForm = ({ referencePrice, onCreate }) => {
    const [formData, setFormData] = useState({
        sellerCpf: '',
        volume: '',
        targetPrice: '',
    });

    const styles = {
        form: {
            padding: '24px 32px',
            backgroundColor: designSystem.colors.neutral.surface,
            borderRadius: designSystem.borderRadius.lg,
            border: `1px solid ${designSystem.colors.neutral.border}`,
            boxShadow: designSystem.shadows.card,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
        },
        title: {
            fontSize: designSystem.typography.sizes.h2,
            fontWeight: designSystem.typography.weights.semibold,
            color: designSystem.colors.neutral.textPrimary,
            margin: 0,
        },
        row: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        label: {
            fontSize: designSystem.typography.sizes.body,
            fontWeight: designSystem.typography.weights.medium,
            color: designSystem.colors.neutral.textPrimary,
        },
        input: {
            padding: '10px 12px',
            border: `1px solid ${designSystem.colors.neutral.border}`,
            borderRadius: designSystem.borderRadius.md,
            fontSize: designSystem.typography.sizes.body,
            outline: 'none',
            fontFamily: designSystem.typography.fontFamily,
            color: designSystem.colors.neutral.textPrimary,
            transition: 'border-color 0.2s',
        },
        button: {
            padding: '12px 24px',
            backgroundColor: designSystem.colors.brand.primary,
            color: designSystem.colors.primary.textOnPrimary,
            border: 'none',
            borderRadius: designSystem.borderRadius.md,
            fontSize: designSystem.typography.sizes.body,
            fontWeight: designSystem.typography.weights.medium,
            cursor: 'pointer',
            marginTop: '8px',
            alignSelf: 'flex-start',
            minWidth: '160px',
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.targetPrice > 0 && formData.volume > 0) {
            onCreate(formData);
            setFormData({ sellerCpf: '', volume: '', targetPrice: '' });
        }
    };

    return (
        <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.header}>
                <h2 style={styles.title}>Nova Pré-Boleta</h2>
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>CPF / Produtor</label>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Buscar produtor..."
                    value={formData.sellerCpf}
                    onChange={(e) => setFormData({ ...formData, sellerCpf: e.target.value })}
                    required
                />
            </div>

            <div style={styles.row}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Volume (ton)</label>
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="0"
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Preço Alvo (R$)</label>
                    <input
                        style={styles.input}
                        type="number" // Removed isInvalid style logic as logic allows higher prices now
                        placeholder="0,00"
                        value={formData.targetPrice}
                        onChange={(e) => setFormData({ ...formData, targetPrice: parseFloat(e.target.value) || '' })}
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                style={styles.button}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = designSystem.colors.primary.hover}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = designSystem.colors.brand.primary}
            >
                Adicionar
            </button>
        </form>
    );
};

export default PreBoletaForm;
