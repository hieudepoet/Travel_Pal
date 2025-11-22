import React from 'react';
import Loader from './Loading';

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = "Đang xử lý..." }) => {
    if (!isLoading) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px'
        }}>
            <Loader />
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginTop: '16px',
                textAlign: 'center'
            }}>
                {message}
            </h3>
        </div>
    );
};
