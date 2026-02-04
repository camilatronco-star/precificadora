import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '400px',
                padding: '24px',
                boxShadow: 'var(--shadow-hover)'
            }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>{title}</h3>
                <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--color-neutral-text-secondary)' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                        onClick={onCancel}
                        className="btn"
                        style={{ backgroundColor: 'transparent', border: '1px solid var(--color-neutral-border)' }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn"
                        style={{
                            backgroundColor: '#fee2e2', // Light red/pink
                            color: '#991b1b', // Darker red text for contrast
                            border: '1px solid #f87171' // Lighter red border
                        }}
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
