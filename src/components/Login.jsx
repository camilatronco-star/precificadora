import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import logoMerx from '../assets/logo_merx_real.png';

const cornBg = "https://images.unsplash.com/photo-1552423158-95e278121f67?auto=format&fit=crop&q=80&w=2000";

const Login = () => {
    const { loginWithRedirect } = useAuth0();

    const handleGoogleLogin = () => {
        loginWithRedirect({
            authorizationParams: {
                connection: 'google-oauth2'
            }
        });
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Left Panel: Login Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                padding: '40px',
                position: 'relative'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center'
                }}>
                    {/* Logo */}
                    <div style={{ marginBottom: '40px' }}>
                        <img
                            src={logoMerx}
                            alt="Logo MERX"
                            style={{ height: '40px' }}
                        />
                    </div>

                    {/* Title & Subtitle */}
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#111827',
                        margin: '0 0 12px 0'
                    }}>
                        Seja Bem-vindo(a)!
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: '0 0 48px 0'
                    }}>
                        Por favor, autentique-se para continuar.
                    </p>

                    {/* Google Authentication Button (Primary Style) */}
                    <button
                        onClick={handleGoogleLogin}
                        style={{
                            width: '100%',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            backgroundColor: '#00C287',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            padding: '0 24px',
                            transition: 'opacity 0.2s',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#ffffff',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <div style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '4px',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        </div>
                        Continuar com o Google
                    </button>
                </div>

                {/* Footer info */}
                <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '40px',
                    fontSize: '12px',
                    color: '#6b7280'
                }}>
                    © MerX 2026
                </div>
            </div>

            {/* Right Panel: Background Image */}
            <div style={{
                flex: 1,
                height: '100%',
                backgroundColor: '#f3f4f6'
            }}>
                <img
                    src={cornBg}
                    alt="Plantação de milho"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
        </div>
    );
};

export default Login;
