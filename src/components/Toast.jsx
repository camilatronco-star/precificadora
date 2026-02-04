import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const Toast = ({ message, type = 'success', onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Updated to 2 seconds auto-dismiss
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 2000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        container: {
            position: 'fixed',
            top: '24px',
            right: '24px',
            minWidth: '300px',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 3000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid var(--color-neutral-border)',
            transition: 'opacity 0.3s ease-in-out',
            opacity: isVisible ? 1 : 0,
        },
        icon: {
            width: '24px',
            height: '24px',
            color: type === 'success' ? '#22c55e' : '#ef4444',
            flexShrink: 0
        },
        text: {
            fontSize: '14px',
            fontWeight: 500,
            color: '#111827' // Strict default system text color
        }
    };

    return (
        <div style={styles.container}>
            {type === 'success' ? (
                <CheckCircleIcon style={styles.icon} />
            ) : (
                <XCircleIcon style={styles.icon} />
            )}
            <span style={styles.text}>{message}</span>
        </div>
    );
};

export default Toast;
