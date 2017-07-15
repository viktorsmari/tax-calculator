var myapp = new Vue({
  el: '#app',
  data: {
    totalSalary:336035,
    personalDiscountYear:623042,
    steps: [
      { taxPct: 37.13, limit: 336035},
      { taxPct: 38.35, limit: 836990},
      { taxPct: 46.25, limit: 0},
    ],

    examples: [
      { price: 250000},
      { price: 300000},
      { price: 350000},
      { price: 400000},
      { price: 650000},
      { price: 900000},
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
      // af ollu fra 336.036 til 836.990
      if (this.totalSalary > this.steps[0].limit) {

        //if upphaed er meira en 836, borga allt skattthrepid
        if (this.totalSalary < this.steps[1].limit){
        // borga skatt2 af upphaed a thessu bili
           return Math.round(this.steps[1].taxPct / 100 * (this.totalSalary - this.steps[0].limit));
        } else {
          return Math.round(this.steps[1].taxPct / 100 * (this.steps[1].limit - this.steps[0].limit));
        }
      } else {
        return 0;
      }
    },
    taxFromStep3: function(){
      // af ollu yfir 836.990
      if (this.totalSalary > this.steps[1].limit) {
        return Math.round(this.steps[2].taxPct / 100 * (this.totalSalary - this.steps[1].limit));
      } else {
        return 0;
      }
    },
    totalTax: function(){
      // All tax steps combined - personal tax discount
      return this.taxFromStep1 + this.taxFromStep2 + this.taxFromStep3 - this.personalMonth;
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
