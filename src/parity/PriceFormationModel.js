/**
 * Price Formation Model - Pure Logic (Isolated)
 */

export class PriceFormationModel {
    constructor(id, data) {
        this.id = id || Math.random().toString(36).substr(2, 9);
        this.deliveryStartDate = data.deliveryStartDate || data.deliveryDate;
        this.deliveryEndDate = data.deliveryEndDate || data.deliveryDate;
        this.origin = data.origin || '';
        this.destination = data.destination || '';
        this.manualCosts = data.manualCosts || [];

        this.listeners = [];
        this.marketPrice = 0;
        this.contract = '';
        this.isUpdating = false;

        this._initMarket(data.product, this.deliveryStartDate);
    }

    _initMarket(product, dateStr) {
        const d = new Date(dateStr);
        const month = d.getMonth() + 1;
        const year = d.getFullYear().toString().slice(-2);

        if (product === 'soybean') {
            this.market = 'CBOT';
            const contracts = { 1: 'JAN', 3: 'MAR', 5: 'MAY', 7: 'JUL', 8: 'AUG', 9: 'SEP', 11: 'NOV' };
            const nextMonth = [1, 3, 5, 7, 8, 9, 11].find(m => m >= month) || 1;
            this.contract = `${contracts[nextMonth]}/${year}`;
            this.marketPrice = 1300 + (Math.random() * 50);
        } else {
            this.market = 'B3';
            const contracts = { 3: 'MAR', 5: 'MAY', 7: 'JUL', 9: 'SEP', 11: 'NOV', 1: 'JAN' };
            const nextMonth = [3, 5, 7, 9, 11, 1].find(m => m >= month) || 3;
            this.contract = `${contracts[nextMonth]}${year}`;
            this.marketPrice = 60 + (Math.random() * 10);
        }
    }

    update(newData) {
        this.product = newData.product;
        this.deliveryStartDate = newData.deliveryStartDate;
        this.deliveryEndDate = newData.deliveryEndDate;
        this.origin = newData.origin;
        this.destination = newData.destination;
        this.manualCosts = newData.manualCosts;
        this._initMarket(this.product, this.deliveryStartDate);
        this._notify();
    }

    calculatePrice() {
        const manualTotal = this.manualCosts.reduce((acc, c) => acc + (parseFloat(c.value) || 0), 0);
        const factor = this.product === 'soybean' ? 0.12 : 1.0;
        return (this.marketPrice * factor) + manualTotal;
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => { this.listeners = this.listeners.filter(l => l !== callback); };
    }

    _notify() {
        const price = this.calculatePrice();
        const details = { marketPrice: this.marketPrice, contract: this.contract, market: this.market };
        this.listeners.forEach(cb => cb(price, details));
    }

    updateMarket(newPrice) {
        this.marketPrice = newPrice;
        this._notify();
    }

    simulateUpdates() {
        if (this.isUpdating) return;
        this.isUpdating = true;
        const interval = setInterval(() => {
            const fluctuation = (Math.random() - 0.5) * 1.5;
            this.updateMarket(this.marketPrice + fluctuation);
        }, 3000);
        return () => { clearInterval(interval); this.isUpdating = false; };
    }
}
