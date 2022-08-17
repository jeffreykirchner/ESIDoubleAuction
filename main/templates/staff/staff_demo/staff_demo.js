
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

//vue app
var app = Vue.createApp({
    delimiters: ["[[", "]]"],

    data() {return {values:[],
                    helpText : "Loading ...",
                    values_prices:[],
                    values_profits:[],
                    buyer:{{buyer_json|safe}},
                    buyer_profit:"0.00",
                    costs:[],
                    costs_prices:[],
                    costs_profits:[],
                    seller:{{seller_json|safe}},
                    seller_profit:"0.00",
                }},
    methods: {
        //update buyer profit when price changes
        update_buyer(index){
            if  (app.$data.values_prices[index] == "")
            {
                app.$data.values_profits[index]="";
            }
            else
            {
                app.$data.values_profits[index] = parseFloat(app.$data.buyer.periods[0].value_list[index-1].value_cost) - app.$data.values_prices[index];
                app.$data.values_profits[index] = app.$data.values_profits[index].toFixed(2);
                app.$data.values_prices[index] = parseFloat(app.$data.values_prices[index]).toFixed(2);
            }

            total=0;
            for(i=0;i<app.$data.values_profits.length;i++)
            {
                value = parseFloat(app.$data.values_profits[i]);
                
                if(value) total += value;
            }

            app.$data.buyer_profit=total.toFixed(2);
            
        },  
        
        //update seller profit when price changes
        update_seller(index){
            if  (app.$data.costs_prices[index] == "")
            {
                app.$data.costs_profits[index]="";
            }
            else
            {
                app.$data.costs_profits[index] =  app.$data.costs_prices[index] - parseFloat(app.$data.seller.periods[0].cost_list[index-1].value_cost);
                app.$data.costs_profits[index] = app.$data.costs_profits[index].toFixed(2);
                app.$data.costs_prices[index] = parseFloat(app.$data.costs_prices[index]).toFixed(2);
            }

            total=0;
            for(i=0;i<app.$data.costs_profits.length;i++)
            {
                value = parseFloat(app.$data.costs_profits[i]);
                
                if(value) total += value;
            }

            app.$data.seller_profit=total.toFixed(2);
            
        }, 

        {%include "js/help_doc.js"%}
    },

    mounted(){
        
    },

}).mount('#app');

