/**
 * Explicit State Machine Constants
 */
export const PRICING_STATES = {
    // Orders
    ORDER_WAITING_PRICE: 'ORDER_WAITING_PRICE',
    ORDER_TRIGGERED: 'ORDER_TRIGGERED',

    // Boletas
    BOLETA_DISPARADA: 'BOLETA_DISPARADA',
    BOLETA_AGUARDANDO_APROVACAO: 'BOLETA_AGUARDANDO_APROVACAO',
    BOLETA_APROVADA: 'BOLETA_APROVADA',
    BOLETA_RECUSADA: 'BOLETA_RECUSADA',

    // Final
    PRE_COMMITMENT_CREATED: 'PRE_COMMITMENT_CREATED'
};

/**
 * Date Formatter (dd/MM/yyyy)
 */
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Production Payload Mapping
 * Derived from Google Apps Script logic
 */
export const mapBoletaToPreCommitmentPayload = (boleta) => {
    const isSoja = boleta.product_code === 'SOJA' || boleta.product === 'Soja';
    const isMilho = boleta.product_code === 'MILHO' || boleta.product === 'Milho';
    const isB3 = boleta.market_reference === 'B3';

    // Base common fields
    const payload = {
        price_BRL: boleta.price_BRL || boleta.targetPrice,
        price_USD: boleta.price_USD,
        price: boleta.price || boleta.targetPrice,
        amount: boleta.amount || boleta.volume,
        price_unit_of_measurement_code: 'sc',
        issuer_social_identity: isSoja ? '92484623089' : (isB3 ? '92484623089' : '42543724850'),
        payday: formatDate(boleta.dataPagamento || boleta.payday),
        description: boleta.descricao || boleta.description,
        order_type: boleta.order_type || 'Compra',
        product_code: isSoja ? 'SOJA' : 'MILHO',
        currency_code: boleta.moeda || 'BRL',
        unit_of_measurement_code: 'kg',
        harvest_name: boleta.safra || boleta.harvest_name,
        shipping_name: boleta.shipping_name || boleta.porto,
        shipping_state: boleta.shipping_state || boleta.estado,
        shipping_city: boleta.shipping_city || boleta.cidade,
        shipping_price: '0,00',
        shipping_description: boleta.shipping_description || boleta.descricao_frete,
        modality_name: boleta.modalidade || 'Spot',
        payment_type_name: boleta.tipoPagamento || 'DOC',
        producer_social_identity: boleta.sellerCpf || boleta.producer_social_identity,
        cooperative_social_identity: isSoja ? '91160119000187' : (isB3 ? '91160119000187' : '30255102000119'),
        initial_delivery_date: formatDate(boleta.initial_delivery_date || new Date()),
        end_delivery_date: formatDate(boleta.end_delivery_date || new Date()),
        datafeed_horario: boleta.datafeed_horario || new Date().toLocaleTimeString(),
        data_compra: formatDate(new Date()),
        porto: boleta.porto || '',
        terminal: boleta.terminal || '',
        filial: boleta.filial || '',
        dolar_pmt: boleta.dolar_pmt || '0,00',
        dolar_spot: boleta.dolar_spot || '0,00',
        preco_futuro_usd: boleta.preco_futuro_usd || '0,00',
        premio: boleta.premio || '0,00',
        fob_custos_us: boleta.fob_custos_us || '0,00',
        fob_custos_br: boleta.fob_custos_br || '0,00',
        fob_custos: boleta.fob_custos || '0,00',
        frete_porto: boleta.frete_porto || '0,00',
        custo_execucao: boleta.custo_execucao || '0,00',
        frete_curto: boleta.frete_curto || '0,00'
    };

    if (isSoja) {
        payload.mes_liquidacao_chicago = boleta.mes_liquidacao_chicago || '';
        payload.margem = boleta.margem || '0,00';
        payload.logistics_box_name = boleta.localEntrega || boleta.logistics_box_name;
    } else if (isMilho) {
        if (isB3) {
            payload.mes_liquidacao_b3 = boleta.mes_liquidacao_b3 || '';
            payload.diferenca_fechado_referencia = boleta.diferenca_fechado_referencia || '0,00';
            payload.delivery_place_name = boleta.localEntrega || boleta.delivery_place_name;
            payload.preco = boleta.preco || boleta.targetPrice;
        } else {
            payload.mes_liquidacao_chicago = boleta.mes_liquidacao_chicago || '';
            payload.margem = boleta.margem || '0,00';
            payload.premio_cents_bu = boleta.premio || '0,00';
            payload.delivery_place_name = boleta.localEntrega || boleta.delivery_place_name;
            payload.preco = boleta.preco || boleta.targetPrice;
        }
    }

    return payload;
};
