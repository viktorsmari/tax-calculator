var myapp = new Vue({
  el: '#app',
  data: {
    totalSalary: 368000,
    personalDiscountYear: 779112,
    steps: [
      { taxPct: 31.48, limit: 446136},
      { taxPct: 37.98, limit: 1252501},
      { taxPct: 46.28, limit: 0}
    ],

    examples: [
      { price: 250000},
      { price: 300000},
      { price: 350000},
      { price: 400000},
      { price: 446136},
      { price: 800000},
      { price: 900000},
      { price: 1252501},
      { price: 1200000},
    ]
  },
  computed: {
    personalMonth: function(){
      return Math.round(this.personalDiscountYear / 12);
    },
    taxFromStep1: function(){
      // Af ollu undir 336.035
      if (this.totalSalary <= this.steps[0].limit) {
        return Math.round(this.steps[0].taxPct / 100 * (this.totalSalary)) ;
      } else {
        return Math.round(this.steps[0].taxPct / 100 * (this.steps[0].limit));
      }
    },
    taxFromStep2: function(){
      // if below first limit, return 0
      // if above second limit return full
      // if in the middle, return the full amount - first limit
      if (this.totalSalary < this.steps[0].limit) {
        return 0
      } else if (this.totalSalary > this.steps[1].limit) {
        return Math.round(this.steps[1].taxPct / 100 * (this.steps[1].limit - this.steps[0].limit));
      } else {
        return Math.round(this.steps[1].taxPct / 100 * (this.totalSalary - this.steps[0].limit));
      }
    },
     taxFromStep3: function(){
      // of everything above the step2
      if (this.totalSalary > this.steps[1].limit) {
        return Math.round(this.steps[2].taxPct / 100 * (this.totalSalary - this.steps[1].limit));
      } else {
        return 0;
      }
    },
    totalTax: function(){
      // All tax steps combined - personal tax discount
      return this.taxFromStep1 + this.taxFromStep2 + this.taxFromStep3 + - this.personalMonth;
    },
    totalLeft: function(){
      return this.totalSalary - this.totalTax;
    },
    realTax: function(){
      return Math.round(10000 * ( this.totalTax / this.totalSalary )) / 100 ;
    }
  },
  methods: {
    updateTotalSal: function(number){
      this.totalSalary = number;
    },
  }
})
