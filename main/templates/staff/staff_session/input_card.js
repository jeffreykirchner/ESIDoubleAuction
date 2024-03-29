
/**submit bid or offer
*/
submit_bid_offer:function(){
    app.working = true;
    app.sendMessage("submit_bid_offer",{"bid_offer_id" : app.bid_offer_id,
                                        "bid_offer_amount" : app.bid_offer_amount,
                                        "sessionID" : app.sessionID});
},

/**take result of submiting bid or offer
 * @param messageData {json} result of bid or offer
*/
take_submit_bid_offer:function(messageData){
    
    if(messageData.result.status == "success")
    {

        current_period = app.session.current_period - 1;

        if (messageData.result.bid_list != null)
        {
            app.session.session_periods[current_period].bid_list = messageData.result.bid_list;
        }
        else if(messageData.result.offer_list != null)
        {
            app.session.session_periods[current_period].offer_list = messageData.result.offer_list;
        }

        app.session.session_periods[current_period].current_best_offer = messageData.result.current_best_offer;
        app.session.session_periods[current_period].current_best_bid = messageData.result.current_best_bid;
        app.session.session_periods[current_period].trade_list = messageData.result.trade_list;

        if(messageData.result.realized_gains_from_trade != -1)
        {
            app.session.session_periods[current_period].realized_gains_from_trade = messageData.result.realized_gains_from_trade;
            app.session.session_periods[current_period].efficiency = messageData.result.efficiency;
        }

        app.bid_offer_id = "";
        app.bid_offer_amount = "";

        app.$refs.bid_offer_id.focus();
    }
    else
    {

    }

    app.bid_offer_message = messageData.result.message;
},


/**undo last bid or offer
*/
undo_bid_offer:function(){
    app.working = true;
    app.sendMessage("undo_bid_offer",{"sessionID" : app.sessionID});
},

/**take result of undoing bid or offer
 * @param messageData {json} result of bid or offer
*/
take_undo_bid_offer:function(messageData){

    current_period = app.session.current_period - 1;

    app.session.session_periods[current_period].bid_list = messageData.result.bid_list;
    app.session.session_periods[current_period].offer_list = messageData.result.offer_list;
    app.session.session_periods[current_period].current_best_offer = messageData.result.current_best_offer;
    app.session.session_periods[current_period].current_best_bid = messageData.result.current_best_bid;
    app.session.session_periods[current_period].trade_list = messageData.result.trade_list;
    app.bid_offer_message = messageData.result.message;
},
