var app3 = new Vue({
  el: '#app3',
  data: {
    step1: 37.13,
    step2: 38.35,
    step3: 46.25,
    step1_limit: 336035,
    step2_limit: 836990,

    totalSalary:655000,
    personalDiscountYear:623042,
  },
  computed: {
    stepCalc1: function(){
      // Af ollu undir 336.035
      if (this.totalSalary <= this.step1_limit) {
        return this.step1 / 100 * (this.totalSalary) ;
      } else {
        return this.step1 / 100 * this.step1_limit;
      }
    },
    stepCalc2: function(){
      // af ollu fra 336.036 til 836.990
      if (this.totalSalary > this.step1_limit) {
        if (this.totalSalary < this.step2_limit){
          return this.step2 / 100 * (this.totalSalary - this.step1_limit);
        } else {
          return this.step2 / 100 * (this.step2_limit - this.step1_limit);
        }
      } else {
        return 0;
      }
    },
    stepCalc3: function(){
      // af ollu yfir 836.990
      if (this.totalSalary > this.step2_limit) {
        return this.step3 / 100 * (this.totalSalary - this.step2_limit);
      } else {
        return 0;
      }
    },
    totalTax: function(){
      return this.stepCalc1 + this.stepCalc2 + this.stepCalc3;
    },
    totalLeft: function(){
      return this.totalSalary - this.totalTax;
    }
  },
  methods: {
    toggleBool: function() {
      this.seen = !this.seen;
    }
  }
})
