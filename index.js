var myapp = new Vue({
  el: '#app',
  data: {
    test: "testing",
    numb: 1,
    step1: 37.13,
    step2: 38.35,
    step3: 46.25,
    step1_limit: 336035,
    step2_limit: 836990,

    totalSalary:336035,
    personalDiscountYear:623042,
    examples: [
      { price:250000},
      { price:300000},
      { price:350000},
      { price:400000},
      { price:650000},
      { price:900000},
      { price:1200000},
    ]
  },
  computed: {
    personalMonth: function(){
      return Math.round(this.personalDiscountYear / 12);
    },
    taxFromStep1: function(){
      // Af ollu undir 336.035
      if (this.totalSalary <= this.step1_limit) {
        return Math.round(this.step1 / 100 * (this.totalSalary - this.personalMonth)) ;
      } else {
        return Math.round(this.step1 / 100 * (this.step1_limit - this.personalMonth));
      }
    },
    taxFromStep2: function(){
      // af ollu fra 336.036 til 836.990
      if (this.totalSalary > this.step1_limit) {

        //if upphaed er meira en 836, borga allt skattthrepid
        if (this.totalSalary < this.step2_limit){
        // borga skatt2 af upphaed a thessu bili
          return Math.round(this.step2 / 100 * (this.totalSalary - this.step1_limit));
        } else {
          return Math.round(this.step2 / 100 * (this.step2_limit - this.step1_limit));
        }
      } else {
        return 0;
      }
    },
    taxFromStep3: function(){
      // af ollu yfir 836.990
      if (this.totalSalary > this.step2_limit) {
        return Math.round(this.step3 / 100 * (this.totalSalary - this.step2_limit));
      } else {
        return 0;
      }
    },
    totalTax: function(){
      return this.taxFromStep1 + this.taxFromStep2 + this.taxFromStep3;
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
    toggleBool: function() {
      this.seen = !this.seen;
    },
  }
})
