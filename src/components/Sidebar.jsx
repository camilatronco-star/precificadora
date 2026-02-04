import React from 'react';
import {
    Squares2X2Icon,
    ChartBarIcon,
    UserGroupIcon,
    WalletIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    BanknotesIcon,
    ClipboardDocumentCheckIcon,
    CubeIcon,
    MapIcon,
    TruckIcon,
    DocumentIcon,
    GlobeAmericasIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
    MapPinIcon,
    CalculatorIcon,
    PlusCircleIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const SIDEBAR_ITEMS = [
    { label: 'Início', icon: Squares2X2Icon },
    { label: 'Dashboard', hasSubmenu: true, icon: ChartBarIcon },
    { label: 'Gestão de Contrapartes', icon: UserGroupIcon },
    { label: 'Gestão de Carteiras', icon: WalletIcon },
    { label: 'Saldos', icon: CurrencyDollarIcon },
    { label: 'Negociações', icon: DocumentTextIcon },
    { label: 'Antecipação de Recebíveis', hasSubmenu: true, icon: BanknotesIcon },
    { label: 'Aprovações', hasSubmenu: true, icon: ClipboardDocumentCheckIcon },
    { label: 'Armazéns e Caixas Logísticas', icon: CubeIcon },
    { label: 'Rastreabilidade', hasSubmenu: true, icon: MapIcon },
    { label: 'Gestão de Lotes', icon: TruckIcon },
    { label: 'Documentos', hasSubmenu: true, icon: DocumentIcon },
    { label: 'Socioambiental', hasSubmenu: true, icon: GlobeAmericasIcon },
    { label: 'CBIOS', hasSubmenu: true, icon: GlobeAmericasIcon },
    { label: '2BSVS', hasSubmenu: true, icon: ShieldCheckIcon },
    { label: 'Normativa Europeia', icon: GlobeAltIcon },
    { label: 'Mapas', icon: MapPinIcon },
    { label: 'Precificadora', icon: CalculatorIcon },
    { label: 'Cadastro de CAR', icon: PlusCircleIcon },
    { label: 'Consulta SCR', icon: MagnifyingGlassIcon },
];

const Sidebar = ({ isOpen, activeMenu = 'Precificadora' }) => {
    return (
        <aside style={{
            width: isOpen ? '280px' : '0px',
            backgroundColor: 'var(--color-brand-navy)',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: '16px' }}>
                <div style={{
                    padding: '0 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    overflowY: 'auto',
                    flex: 1,
                }}>
                    {SIDEBAR_ITEMS.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = item.label === activeMenu;

                        return (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: isActive ? 'var(--color-brand-navy-light)' : 'transparent',
                                color: '#FFFFFF',
                                fontSize: '14px',
                                fontWeight: isActive ? 600 : 400,
                                opacity: isOpen ? 1 : 0,
                                transition: 'opacity 0.2s',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Icon style={{ width: '20px', height: '20px' }} />
                                    <span>{item.label}</span>
                                </div>
                                {item.hasSubmenu && (
                                    <svg style={{ width: '16px', height: '16px', opacity: 0.7 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
