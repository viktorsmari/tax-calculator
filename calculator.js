// Monthly withholding estimate. Sources and assumptions are documented in index.html.
(function (root) {
  const defaults = {
    credit: 72492,
    pensionPct: 4,
    steps: [
      { taxPct: 31.49, limit: 498122 },
      { taxPct: 37.99, limit: 1398450 },
      { taxPct: 46.29, limit: 0 }
    ]
  };

  function number(value, name, max = Number.MAX_SAFE_INTEGER) {
    if (value === '' || value === null || value === undefined ||
        !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > max) {
      throw new Error(`Enter a valid ${name} between 0 and ${max}.`);
    }
    return Number(value);
  }

  function calculate(salary, credit = defaults.credit, pensionPct = defaults.pensionPct, steps = defaults.steps) {
    const gross = number(salary, 'monthly salary');
    credit = number(credit, 'monthly tax credit');
    pensionPct = number(pensionPct, 'employee pension percentage', 8);
    const limits = steps.slice(0, 2).map(s => number(s.limit, 'tax threshold'));
    const rates = steps.map(s => number(s.taxPct, 'tax percentage', 100));
    if (limits[1] < limits[0]) throw new Error('Second tax threshold must be at least the first.');
    const pension = Math.round(gross * pensionPct / 100);
    const taxable = Math.max(0, gross - pension);
    const bands = [Math.min(taxable, limits[0]), Math.max(0, Math.min(taxable, limits[1]) - limits[0]), Math.max(0, taxable - limits[1])];
    const taxes = bands.map((amount, i) => Math.round(amount * rates[i] / 100));
    const tax = Math.max(0, taxes.reduce((sum, amount) => sum + amount, 0) - credit);
    return { gross, pension, taxable, taxes, tax, net: gross - pension - tax, effectiveRate: gross ? tax / gross * 100 : 0 };
  }

  const api = { defaults, calculate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.IcelandTax = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
