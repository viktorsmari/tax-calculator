const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { calculate, defaults } = require('../calculator');

test('verified 2026 defaults', () => {
  assert.equal(defaults.credit, 72492);
  assert.deepEqual(defaults.steps.map(s => s.limit), [498122, 1398450, 0]);
});

test('zero and low salaries never create a negative tax or extra pay', () => {
  for (const salary of [0, 1, 100000, 200000]) {
    const result = calculate(salary);
    assert.equal(result.tax, 0);
    assert.equal(result.net, salary - result.pension);
    assert.ok(Number.isFinite(result.effectiveRate));
  }
});

test('each bracket boundary, without credit or pension', () => {
  for (const salary of [498121, 498122, 498123, 1398449, 1398450, 1398451, 2000000]) {
    const expected = Math.round(Math.min(salary, 498122) * .3149)
      + Math.round(Math.max(0, Math.min(salary, 1398450) - 498122) * .3799)
      + Math.round(Math.max(0, salary - 1398450) * .4629);
    assert.equal(calculate(salary, 0, 0).tax, expected);
  }
});

test('static salary examples match calculation', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const format = n => n.toLocaleString('en-US');
  for (const [salary, expected] of [[600000, 462047], [800000, 581106], [1000000, 700166]]) {
    const r = calculate(salary);
    assert.equal(r.net, expected);
    assert.ok(html.includes(`<tr><th scope="row">${format(salary)}</th><td>${format(r.pension)}</td><td>${format(r.tax)}</td><td>${format(r.net)}</td></tr>`));
  }
});

test('pension reduces taxable salary and take-home pay', () => {
  const r = calculate('600000', '72492', '8');
  assert.equal(r.pension, 48000);
  assert.equal(r.taxable, 552000);
  assert.equal(r.net, r.gross - r.pension - r.tax);
  assert.equal(calculate(600000, 999999).tax, 0);
});

test('invalid inputs and reversed thresholds rejected', () => {
  for (const value of ['', null, undefined, 'abc', -1, Infinity, NaN]) assert.throws(() => calculate(value));
  assert.throws(() => calculate(600000, -1));
  assert.throws(() => calculate(600000, 72492, 9));
  assert.throws(() => calculate(600000, 0, 0, [{limit: 10, taxPct: 30}, {limit: 5, taxPct: 40}, {limit: 0, taxPct: 50}]));
});

test('HTML loads calculation module before Vue app and mount exists', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.indexOf('src="calculator.js"') < html.indexOf('src="index.js"'));
  assert.ok(html.includes('id="app"'));
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  assert.ok(html.includes('bootstrap@6.0.0-alpha.1'));
  let app;
  const context = vm.createContext({ Vue: function(config) { app = config; } });
  vm.runInContext(fs.readFileSync('calculator.js', 'utf8'), context);
  vm.runInContext(fs.readFileSync('index.js', 'utf8'), context);
  assert.equal(app.el, '#app');
  const data = { ...app.data, personalMonth: app.computed.personalMonth.call(app.data) };
  assert.equal(data.personalMonth, 72492);
  assert.equal(app.computed.calculation.call(data).result.net, calculate(368000).net);
  assert.ok(app.computed.calculation.call({ ...data, personalDiscountYear: '' }).error);
  assert.ok(app.computed.calculation.call({ ...app.data, totalSalary: '' }).error);
});
