/**refresh the supply and demand canvas
*/
update_sdgraph_canvas:function(){

    var el = $('#sd_graph');
    el.attr('width', parseInt(el.css('width')));
    el.attr('height', parseInt(el.css('height')));

    period = app.$data.session.parameter_set.periods[app.$data.current_visible_period-1];  //parameter set period
    period_result = app.$data.session.session_periods[app.$data.current_visible_period-1]; //session results period

    value_list = period.demand;
    cost_list = period.supply;

    y_max = period.y_scale_max;
    x_max = period.x_scale_max;

    var marginY=45;    //margin between left side of canvas and Y axis
    var marginX=40;    //margin between bottom of canvas and X axis
    var marginTopAndRight=10;    // margin between top and right sides of canvas and graph

    app.draw_axis("sd_graph", marginY, marginX, marginTopAndRight, 0, y_max, y_max, 0, x_max, x_max, "Price ($)", "Units Traded");

    if (app.$data.show_supply_demand_graph)
    {
        //supply
        app.draw_sd_line("sd_graph", marginY, marginX, marginTopAndRight, 0, y_max, 0, x_max, 3, value_list, "cornflowerblue");

        //demand
        app.draw_sd_line("sd_graph", marginY, marginX, marginTopAndRight, 0, y_max, 0, x_max, 3, cost_list, "crimson");
    }

    //equilibrium
    if (app.$data.show_equilibrium_price_graph)
    {
        app.draw_eq_lines("sd_graph", marginY, marginX, marginTopAndRight, 0, y_max, 0, x_max, period);
    }

    //bids and offers
    if (app.$data.session.started && app.$data.show_bids_offers_graph)
    {
        app.draw_bids_and_offers("sd_graph", marginY, marginX, marginTopAndRight, 0, y_max, 0, x_max, period_result);
    }

    //trade line
    if (app.$data.show_trade_line_graph)
    {
        app.draw_trade_line("sd_graph", marginY, marginX, marginTopAndRight, 0, y_max, 0, x_max, period_result);
    }

    //key
    if (app.$data.session.started)
    {
        app.draw_key("sd_graph", marginTopAndRight);
    }

    //price cap
    app.draw_price_cap("sd_graph", marginY, marginX, marginTopAndRight, 0, y_max, 0, x_max, period);
},

/**draw an x-y axis on a canvas
 * @param chartID {string} dom ID name of canvas
 * @param marginY {int} margin between Y axis and vertial edge of graph
 * @param marginX {int} margin between X axis and horizontal edge of graph
 * @param marginTopAndRight {int} margin between top and rights side of canvas and graph
 * @param yMin {int} starting value on Y axis
 * @param yMax {int} ending value on Y axis
 * @param yTickCount {int} number of ticks along Y axis
 * @param xMin {int} starting value on X axis
 * @param xMax {int} ending value on X axis
 * @param xTickCount {int} number of ticks along X axis
 * @param yLabel {string} label on Y axis
 * @param XLabel {string} label on X axis
*/
draw_axis: function (chartID, marginY, marginX, marginTopAndRight, yMin, yMax, yTickCount, xMin, xMax, xTickCount, yLabel, xLabel){
    
    if(document.getElementById(chartID) == null)
    {
        return;
    }

    var canvas = document.getElementById(chartID),
        ctx = canvas.getContext('2d');    

    ctx.save();

    var xScale = xMax-xMin;
    var yScale = yMax-yMin;

    var w = ctx.canvas.width;
    var h = ctx.canvas.height;

    var tickLength=3;
    
    var xTickValue=xScale/parseFloat(xTickCount);
    var yTickValue=yScale/parseFloat(yTickCount);

    ctx.moveTo(0,0);

    //clear screen
    // ctx.fillStyle = "white";
    // ctx.fillRect(0,0,w,h);
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle="black";
    ctx.lineWidth=3;

    //axis
    ctx.beginPath();
    ctx.moveTo(marginY, marginTopAndRight);
    ctx.lineTo(marginY, h-marginX);
    ctx.lineTo(w-marginTopAndRight, h-marginX);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();

    //y ticks
    ctx.beginPath();                                                               
    ctx.font="12px Georgia";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";

    var tempY = h-marginX;     
    var tempYValue = yMin;

    for(var i=0;i<=yTickCount;i++)
    {                                       
        ctx.moveTo(marginY, tempY);                                   
        ctx.lineTo(marginY-5, tempY);
        ctx.fillText(tempYValue,marginY-8,tempY+4);

        tempY -= ((h-marginX-marginTopAndRight)/ (yTickCount));
        tempYValue += yTickValue;
    }

    ctx.stroke();

    //x ticks
    ctx.beginPath();                                                               
    ctx.textAlign = "center";

    var tempX = marginY;
    var tempXValue=xMin;                                
    for(var i=0;i<=xTickCount;i++)
    {                                       
        ctx.moveTo(tempX, h-marginX);                                   
        ctx.lineTo(tempX,  h-marginX+5);
        ctx.fillText(Math.round(tempXValue).toString(),tempX,h-marginX+18);

        tempX += ((w-marginY-marginTopAndRight)/ (xTickCount));
        tempXValue += xTickValue;
    }

    ctx.stroke();

    ctx.restore();

    //labels
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "DimGray";
    ctx.font="bold 14px Arial"; 

    ctx.translate(14, h/2);
    ctx.rotate(-Math.PI/2);                                                              
    ctx.fillText(yLabel,0,0);
    ctx.restore();

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "DimGray";
    ctx.font="bold 14px Georgia";
    ctx.fillText(xLabel,w/2,h-4);
    ctx.restore();                       
},

/** draw either the supply or demand line
 * @param chartID {string} dom ID name of canvas
 * @param marginY {int} margin between Y axis and vertial edge of graph
 * @param marginX {int} margin between X axis and horizontal edge of graph
 * @param marginTopAndRight {int} margin between top and rights side of canvas and grap
 * @param yMin {int} starting value on Y axis
 * @param yMax {int} ending value on Y axis
 * @param xMin {int} starting value on X axis
 * @param xMax {int} ending value on X axis
 * @param lineWidth {int} width of the line
 * @param valueList[] {int} sorted values of line
 * @param lineColor {string, hex} color of line
*/
draw_sd_line: function(chartID, marginY, marginX, marginTopAndRight, yMin, yMax, xMin, xMax, lineWidth, valueList, lineColor){
    var canvas = document.getElementById(chartID),
        ctx = canvas.getContext('2d');

    var w =  ctx.canvas.width;
    var h = ctx.canvas.height;
    
    ctx.save();

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.font="12px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    ctx.translate(marginY, h-marginX);

    for(i=0; i<valueList.length; i++)
    {
        xStart = app.convertToX(i, xMax, xMin, w-marginY-marginTopAndRight, lineWidth);
        xEnd = app.convertToX(i+1, xMax, xMin, w-marginY-marginTopAndRight, lineWidth);
        y1 = app.convertToY(parseFloat(valueList[i].value_cost), yMax, yMin, h-marginX-marginTopAndRight, lineWidth);

        //horizontal line
        ctx.beginPath();
        ctx.moveTo(xStart, y1);
        ctx.lineTo(xEnd, y1);        

        //vertical line
        if(i<valueList.length-1)
        {
            y2 = app.convertToY(parseFloat(valueList[i+1].value_cost), yMax, yMin, h-marginX-marginTopAndRight, lineWidth);
            ctx.lineTo(xEnd, y2);
        }

        ctx.stroke();

        //label
        ctx.fillText(valueList[i].label,(xEnd-xStart)/2 + xStart, y1-3);

    }

    ctx.restore(); 
},

/**draw the equilibrium price and quantity lines
 * @param chartID {string} dom ID name of canvas
 * @param marginY {int} margin between Y axis and vertial edge of graph
 * @param marginX {int} margin between X axis and horizontal edge of graph
 * @param marginTopAndRight {int} margin between top and rights side of canvas and grap
 * @param yMin {int} starting value on Y axis
 * @param yMax {int} ending value on Y axis
 * @param xMin {int} starting value on X axis
 * @param xMax {int} ending value on X axis
 * @param period {int} period from 1 to N of which equilibrium lines will be drawn
*/
draw_eq_lines: function(chartID, marginY, marginX, marginTopAndRight, yMin, yMax, xMin, xMax, period){

    if(period.eq_price == null) return;

    var canvas = document.getElementById(chartID),
        ctx = canvas.getContext('2d');

    var w =  ctx.canvas.width;
    var h = ctx.canvas.height;
    
    ctx.save();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.setLineDash([5, 5]);
    ctx.font="18px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";

    ctx.translate(marginY, h-marginX);

    ctx.beginPath();

    y1 = app.convertToY(period.eq_price, yMax, yMin, h-marginX-marginTopAndRight, 1);
    x1 = app.convertToX(0, xMax, xMin, w-marginY-marginTopAndRight, 1);

    y2 = app.convertToY(0, yMax, yMin, h-marginX-marginTopAndRight, 1);
    x2 = app.convertToX(period.eq_quantity, xMax, xMin, w-marginY-marginTopAndRight, 1);

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1); 
    ctx.lineTo(x2, y2); 

    ctx.stroke();

    ctx.fillText("Equilibrium Price: " + period.eq_price, x1+5, y1-5);

    ctx.restore(); 
},

/**draw bids and offers
 * @param chartID {string} dom ID name of canvas
 * @param marginY {int} margin between Y axis and vertial edge of graph
 * @param marginX {int} margin between X axis and horizontal edge of graph
 * @param marginTopAndRight {int} margin between top and rights side of canvas and grap
 * @param yMin {int} starting value on Y axis
 * @param yMax {int} ending value on Y axis
 * @param xMin {int} starting value on X axis
 * @param xMax {int} ending value on X axis
 * @param period {int} period from 1 to N of which bids will be drawn
*/
draw_bids_and_offers:function(chartID, marginY, marginX, marginTopAndRight, yMin, yMax, xMin, xMax, period_result){
    //if(period.eq_price == null) return;

    var canvas = document.getElementById(chartID),
        ctx = canvas.getContext('2d');

    var w =  ctx.canvas.width;
    var h = ctx.canvas.height;
    
    ctx.save();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    //ctx.setLineDash([5, 5]);
    ctx.font="14px Arial";
    ctx.textAlign = "left";

    ctx.translate(marginY, h-marginX);

    //current_period = app.$data.session.current_period;
    bids = period_result.bid_list;
    offers = period_result.offer_list;

    max_carrot_width = w / 20;  //max width carrot can be

    //offers
    for(i=0; i<offers.length; i++)
    {
        x1 = app.convertToX(offers[i].session_period_trade__trade_number, xMax, xMin, w-marginY-marginTopAndRight, 0);
        x2 = app.convertToX(offers[i].session_period_trade__trade_number-1, xMax, xMin, w-marginY-marginTopAndRight, 0);
        
        width = (x1-x2) * 0.6;
        width = Math.min(width, max_carrot_width);

        centerX=(x1+x2)/2

        y1 = app.convertToY(offers[i].amount, yMax, yMin, h-marginX-marginTopAndRight, 0);

        app.draw_offer_carrot(ctx, centerX, y1, width);               
    }

    //bids
    for(i=0; i<bids.length; i++)
    {
        x1 = app.convertToX(bids[i].session_period_trade__trade_number, xMax, xMin, w-marginY-marginTopAndRight, 0);
        x2 = app.convertToX(bids[i].session_period_trade__trade_number-1, xMax, xMin, w-marginY-marginTopAndRight, 0);
        
        width = (x1 - x2) * 0.6;
        width = Math.min(width, max_carrot_width);

        centerX=(x1 + x2) / 2;

        y1 = app.convertToY(bids[i].amount, yMax, yMin, h-marginX-marginTopAndRight, 0);

        app.draw_bid_carrot(ctx, centerX, y1, width);
    }

    ctx.restore(); 
},

/**draw a bid carrot at the specified location
    @param ctx {canvas} canvas to draw on
    @param x {double} x location of bid
    @param y {double} y location of bid
    @param width {double} width of bid in pixels
*/
draw_bid_carrot:function(ctx, x, y, width){
    ctx.fillStyle = "cornflowerblue";

    ctx.beginPath();        
        
    ctx.moveTo(x, y);
    ctx.lineTo(x - width/2, y + width);
    ctx.lineTo(x - width/2, y + width);   

    ctx.lineTo(x + width/2, y + width);
    ctx.lineTo(x, y);        

    ctx.fill();
    ctx.stroke();
},

/**draw a offer carrot at the specified location
    @param ctx {canvas} canvas to draw on
    @param x {double} x location of offer
    @param y {double} y location of offer
    @param width {double} width of offer in pixels
*/
draw_offer_carrot:function(ctx, x, y, width){
    ctx.fillStyle = "crimson";

    ctx.beginPath();        
        
    ctx.moveTo(x, y);
    ctx.lineTo(x - width/2, y - width);
    ctx.lineTo(x - width/2, y - width);   

    ctx.lineTo(x + width/2, y - width);
    ctx.lineTo(x, y);        

    ctx.fill();
    ctx.stroke(); 
},

/**draw key with bid ask spread
 * @param chartID {string} dom ID name of canvas
 */
draw_key:function(chartID, marginTopAndRight){
    var canvas = document.getElementById(chartID),
        ctx = canvas.getContext('2d');

    var w = 230;
    var h = 100;

    session_period = app.$data.session.session_periods[app.$data.session.current_period-1];

    base_width = 1369;
    base_height = 600;

    w_fraction = ctx.canvas.width / base_width;
    h_fraction = ctx.canvas.height / base_height;
    
    ctx.save();

    ctx.translate(1129 * w_fraction, marginTopAndRight);

    ctx.beginPath();
    //ctx.rect(width*4, 10, width, height);
    ctx.rect(0, 0, w * w_fraction, h * h_fraction);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.fill();    

    x =  30 * w_fraction;
    y = h * h_fraction * 1 / 2;

    app.draw_bid_carrot(ctx, x, y, 40 * w_fraction);
    app.draw_offer_carrot(ctx, x, y, 40 * w_fraction);

    font_size = 25 * w_fraction;

    ctx.font= font_size + "px Georgia";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";

    x =  115 * w_fraction;

    ctx.textBaseline = "bottom";
    ctx.fillText("Offer: ", x, y - 2);
    ctx.textAlign = "left";
    ctx.fillText(session_period.current_best_offer, x, y - 2);

    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("Bid: ", x, y + 2);
    ctx.textAlign = "left";
    ctx.fillText(session_period.current_best_bid, x, y + 2);
    
    ctx.restore();
},

/**draw line connecting all the trades
 * @param chartID {string} dom ID name of canvas
 * @param marginY {int} margin between Y axis and vertial edge of graph
 * @param marginX {int} margin between X axis and horizontal edge of graph
 * @param marginTopAndRight {int} margin between top and rights side of canvas and grap
 * @param yMin {int} starting value on Y axis
 * @param yMax {int} ending value on Y axis
 * @param xMin {int} starting value on X axis
 * @param xMax {int} ending value on X axis
 * @param period {int} period from 1 to N of which equilibrium lines will be drawn
*/
draw_trade_line:function(chartID, marginY, marginX, marginTopAndRight, yMin, yMax, xMin, xMax, period)
{
    if (period == null)
        return;

    var canvas = document.getElementById(chartID),
        ctx = canvas.getContext('2d');

    var w =  ctx.canvas.width;
    var h = ctx.canvas.height;
    
    lineWidth = 3;

    ctx.save();

    ctx.strokeStyle = "dimgrey";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.font="12px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    ctx.translate(marginY, h-marginX);

    for(i=1; i< period.trade_list.length; i++)
    {
        trade1 = period.trade_list[i-1];
        trade2 = period.trade_list[i];

        x1 = app.convertToX(i-1, xMax, xMin, w-marginY-marginTopAndRight, lineWidth);
        y1 = app.convertToY(parseFloat(trade1.trade_price), yMax, yMin, h-marginX-marginTopAndRight, lineWidth);

        x2 = app.convertToX(i, xMax, xMin, w-marginY-marginTopAndRight, lineWidth);
        y2 = app.convertToY(parseFloat(trade2.trade_price), yMax, yMin, h-marginX-marginTopAndRight, lineWidth);

        x3 = app.convertToX(i+1, xMax, xMin, w-marginY-marginTopAndRight, lineWidth);

        ctx.beginPath();
        ctx.moveTo((x1+x2)/2, y1);
        ctx.lineTo((x2+x3)/2, y2);

        ctx.stroke();
    }

    ctx.restore();
},

/**if price cap is active draw line
 * @param chartID {string} dom ID name of canvas
 * @param marginY {int} margin between Y axis and vertial edge of graph
 * @param marginX {int} margin between X axis and horizontal edge of graph
 * @param marginTopAndRight {int} margin between top and rights side of canvas and grap
 * @param yMin {int} starting value on Y axis
 * @param yMax {int} ending value on Y axis
 * @param xMin {int} starting value on X axis
 * @param xMax {int} ending value on X axis
 * @param period {int} period from 1 to N of which equilibrium lines will be drawn
*/
draw_price_cap:function(chartID, marginY, marginX, marginTopAndRight, yMin, yMax, xMin, xMax, period)
{
    if(period.price_cap_enabled == "False") return;

    var canvas = document.getElementById(chartID),
        ctx = canvas.getContext('2d');

    var w =  ctx.canvas.width;
    var h = ctx.canvas.height;
    
    ctx.save();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.setLineDash([15, 3, 3, 3]);
    ctx.font="18px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";

    ctx.translate(marginY, h-marginX);

    ctx.beginPath();

    y1 = app.convertToY(period.price_cap, yMax, yMin, h-marginX-marginTopAndRight, 1);
    x1 = app.convertToX(0, xMax, xMin, w-marginY-marginTopAndRight, 1);

    x2 = app.convertToX(period.x_scale_max, xMax, xMin, w-marginY-marginTopAndRight, 1);

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1); 
    ctx.lineTo(x2, y1); 

    ctx.stroke();

    ctx.fillText("Max Bid/Offer: " + period.price_cap, x2, y1-7);

    ctx.restore();
},

/**convert value to X cordinate on the graph
 * @param value {float} value to be converted to X cordinate
 * @param maxValue {float} ceiling of value on graph
 * @param minValue {float} floor of value to be shown on graph
 * @param canvasWidth {int} width of the canvas in pixels
 * @param markerWidth {int} width of the marker or line in pixels
 */
convertToX:function(value, maxValue, minValue, canvasWidth, markerWidth){
    markerWidth=0;

    tempT = canvasWidth / (maxValue-minValue);

    value-=minValue;

    if(value>maxValue) value=maxValue;

    return (tempT * value - markerWidth/2);
},

/**convert value to Y cordinate on the graph
 * @param value {float} value to be converted to Y cordinate
 * @param maxValue {float} ceiling of value on graph
 * @param minValue {float} floor of value to be shown on graph
 * @param canvasHeight {int} height of the canvas in pixels
 * @param markerHeight {int} height of the marker or line in pixels
 */
convertToY:function(value, maxValue, minValue, canvasHeight, markerHeight){
    markerHeight=0;
    
    tempT = canvasHeight / (maxValue-minValue);

    if(value > maxValue) value=maxValue;
    if(value < minValue) value=minValue;

    value-=minValue;

    if(value>maxValue) value=maxValue;

    return(-1 * tempT * value - markerHeight/2)
},

/**refresh graph when display toggles are pressed
 */
graph_options_changed:function()
{
    app.update_sdgraph_canvas();
},