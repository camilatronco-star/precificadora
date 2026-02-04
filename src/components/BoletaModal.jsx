import React, { useState, useEffect } from 'react';

const BoletaModal = ({ isOpen, onClose, onCreate, onUpdate, referencePrice, product, initialData, type = 'ordem' }) => {
    if (!isOpen) return null;

    const isBoleta = type === 'boleta';
    const isEdit = !!initialData;

    const title = isEdit ? 'Detalhes da Boleta' : (isBoleta ? 'Nova Boleta' : 'Nova Ordem');
    const helperText = isEdit
        ? "Visualize e edite os detalhes. As alterações são salvas automaticamente ao confirmar."
        : (isBoleta
            ? "A boleta é enviada imediatamente para aprovação."
            : "A ordem aguarda o preço de referência atingir o valor definido para então gerar uma boleta.");

    const [formData, setFormData] = useState({
        nome: '',
        sellerCpf: '',
        product: product || 'Soja',
        safra: '23/24',
        volume: '',
        precoAlvo: '',
        dataPagamento: '',
        descricao: '',
        descricao_frete: '',
        margem: '0.00',
        localEntrega: '',
        porto: '',
        terminal: '',
        filial: '',
        mes_liquidacao_chicago: '',
        mes_liquidacao_b3: '',
        market_reference: 'CBOT'
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({ ...formData, ...initialData });
            } else {
                setFormData(prev => ({
                    ...prev,
                    product: product || 'Soja',
                    nome: '',
                    sellerCpf: '',
                    volume: '',
                    precoAlvo: '',
                    descricao: '',
                    descricao_frete: '',
                    margem: '0.00',
                    localEntrega: ''
                }));
            }
        }
    }, [isOpen, product, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isPriceValid = !formData.precoAlvo || parseFloat(formData.precoAlvo) <= referencePrice;

    const isFormValid = formData.nome.trim() !== '' &&
        formData.sellerCpf.trim() !== '' &&
        formData.volume !== '' &&
        formData.precoAlvo !== '' &&
        isPriceValid;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        const payload = {
            ...formData,
            volume: parseFloat(formData.volume),
            targetPrice: parseFloat(formData.precoAlvo),
            price_BRL: parseFloat(formData.precoAlvo),
            type: type,
            product_code: formData.product.toUpperCase(),
            amount: parseFloat(formData.volume)
        };

        if (isEdit) {
            onUpdate(initialData.id, payload);
        } else {
            onCreate(payload);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid var(--color-neutral-border)',
        fontSize: '14px',
        marginTop: '6px',
        backgroundColor: '#FFFFFF',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: 'bold',
        color: 'var(--color-neutral-text-primary)',
        marginBottom: '4px'
    };

    const sectionTitleStyle = {
        margin: '0 0 16px 0',
        fontSize: '15px',
        fontWeight: 'bold',
        color: 'var(--color-brand-navy)'
    };

    const groupStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
    };

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
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                width: '680px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '28px 32px 20px 32px', borderBottom: '1px solid var(--color-neutral-border)' }}>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{title}</h2>
                    <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--color-neutral-text-secondary)', lineHeight: '1.5' }}>
                        {helperText}
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
                    <div style={groupStyle}>
                        <div>
                            <label style={labelStyle}>Nome / Produtor <span style={{ color: '#ef4444' }}>*</span></label>
                            <input name="nome" value={formData.nome || ''} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Vendedor CPF/CNPJ <span style={{ color: '#ef4444' }}>*</span></label>
                            <input name="sellerCpf" value={formData.sellerCpf || ''} onChange={handleChange} style={inputStyle} placeholder="000.000.000-00" required />
                        </div>
                    </div>

                    <div style={groupStyle}>
                        <div>
                            <label style={labelStyle}>Produto <span style={{ color: '#ef4444' }}>*</span></label>
                            <select name="product" value={formData.product} onChange={handleChange} style={inputStyle}>
                                <option value="Soja">Soja</option>
                                <option value="Milho">Milho</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Safra <span style={{ color: '#ef4444' }}>*</span></label>
                            <input name="safra" value={formData.safra || ''} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>

                    <div style={groupStyle}>
                        <div>
                            <label style={labelStyle}>Volume (ONLY kg) <span style={{ color: '#ef4444' }}>*</span></label>
                            <input type="number" name="volume" value={formData.volume || ''} onChange={handleChange} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={labelStyle}>PREÇO PRODUTOR (R$/sc) <span style={{ color: '#ef4444' }}>*</span></label>
                            <input type="number" step="0.01" name="precoAlvo" value={formData.precoAlvo || ''} onChange={handleChange} style={inputStyle} required />
                            {!isPriceValid && (
                                <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '6px', fontWeight: 'bold' }}>
                                    Atenção: Acima do preço de referência ({referencePrice?.toFixed(2)})
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={groupStyle}>
                        <div>
                            <label style={labelStyle}>Margem (R$/sc)</label>
                            <input type="number" step="0.01" name="margem" value={formData.margem} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Referência de Mercado</label>
                            <select name="market_reference" value={formData.market_reference} onChange={handleChange} style={inputStyle}>
                                <option value="CBOT">CBOT (Chicago)</option>
                                {formData.product === 'Milho' && <option value="B3">B3 (Brasil)</option>}
                            </select>
                        </div>
                    </div>

                    <div style={groupStyle}>
                        <div>
                            <label style={labelStyle}>Mês Liquidação Chicago</label>
                            <input name="mes_liquidacao_chicago" value={formData.mes_liquidacao_chicago || ''} onChange={handleChange} style={inputStyle} placeholder="Ex: MAR/24" />
                        </div>
                        {formData.market_reference === 'B3' && (
                            <div>
                                <label style={labelStyle}>Mês Liquidação B3</label>
                                <input name="mes_liquidacao_b3" value={formData.mes_liquidacao_b3 || ''} onChange={handleChange} style={inputStyle} placeholder="Ex: CCMH24" />
                            </div>
                        )}
                    </div>

                    <div style={groupStyle}>
                        <div>
                            <label style={labelStyle}>Observação Boleta</label>
                            <textarea name="descricao" value={formData.descricao || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '60px' }} />
                        </div>
                        <div>
                            <label style={labelStyle}>Observação Frete</label>
                            <textarea name="descricao_frete" value={formData.descricao_frete || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '60px' }} />
                        </div>
                    </div>

                    <div style={{ padding: '24px', border: '1px solid var(--color-neutral-border)', borderRadius: '8px', marginBottom: '32px' }}>
                        <h4 style={sectionTitleStyle}>Logística & Detalhes</h4>
                        <div style={groupStyle}>
                            <div>
                                <label style={labelStyle}>Local de Entrega</label>
                                <input name="localEntrega" value={formData.localEntrega || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Data Pagamento</label>
                                <input type="date" name="dataPagamento" value={formData.dataPagamento || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                        <div style={groupStyle}>
                            <div>
                                <label style={labelStyle}>Porto</label>
                                <input name="porto" value={formData.porto || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Filial</label>
                                <input name="filial" value={formData.filial || ''} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button type="button" onClick={onClose} className="btn" style={{ padding: '12px 24px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-neutral-border)', fontWeight: 'bold' }}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={!isFormValid} style={{ padding: '12px 32px', opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>
                            {isEdit ? 'Salvar Alterações' : (isBoleta ? 'Criar Boleta' : 'Criar Ordem')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BoletaModal;
