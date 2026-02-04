import { mapBoletaToPreCommitmentPayload } from './constants';

const API_CONFIG = {
    URL: 'https://api.merx.tech/api/v1/pre-commitment',
    KEY: 'NYjNUWqMcEggYygJfxxEYhlsyNss1yKxCLsihMla57IzXSx8VJPEcVulEc43r20z'
};

export const commitmentService = {
    createPreCommitment: async (boleta, referenceSpotPrice) => {
        // Validation: Preço above reference
        const informedPrice = parseFloat(boleta.price_BRL || boleta.targetPrice || 0);
        if (informedPrice > referenceSpotPrice) {
            throw new Error("O preço informado está acima do preço de referência.");
        }

        const payload = mapBoletaToPreCommitmentPayload(boleta);

        // Required fields validation
        const baseRequired = [
            'price_BRL', 'amount', 'payday', 'product_code',
            'producer_social_identity', 'harvest_name'
        ];

        for (const field of baseRequired) {
            if (!payload[field]) {
                throw new Error(`Campo obrigatório ausente: ${field}`);
            }
        }

        try {
            const response = await fetch(API_CONFIG.URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': API_CONFIG.KEY,
                    'Access-Control-Request-Headers': '*'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro na API: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};
