new Vue({
  el: '#app',
  data: {
    totalSalary: 368000,
    personalDiscountYear: 869898,
    pensionPct: IcelandTax.defaults.pensionPct,
    steps: IcelandTax.defaults.steps.map(step => ({ ...step })),
    examples: [350000, 498122, 600000, 800000, 1000000, 1398450, 1500000]
  },
  computed: {
    personalMonth() { return Math.round(this.personalDiscountYear / 12); },
    calculation() {
      try {
        if (this.personalDiscountYear === '' || !Number.isFinite(Number(this.personalDiscountYear)) || Number(this.personalDiscountYear) < 0) {
          throw new Error('Enter a valid non-negative annual personal tax credit.');
        }
        return { result: IcelandTax.calculate(this.totalSalary, this.personalMonth, this.pensionPct, this.steps), error: '' };
      } catch (error) {
        return { result: null, error: error.message };
      }
    }
  },
  methods: {
    money(value) { return new Intl.NumberFormat('en-IS', { maximumFractionDigits: 0 }).format(value); }
  }
});
