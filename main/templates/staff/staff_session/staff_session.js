
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

//vue app
var app = Vue.createApp({
    delimiters: ["[[", "]]"],

    data() {return {chatSocket : "",
                    helpText : "Loading ...",
                    reconnecting : true,
                    working : false,
                    first_load_done : false,          //true after software is loaded for the first time
                    sessionID : {{session.id}},
                    session : {
                        current_period : 1,
                        started : false,
                        locked : true,
                        session_periods : [{trade_list : []},
                                          ],
                        parameter_set : {
                            number_of_buyers : 0,
                            number_of_sellers : 0,
                            number_of_periods : 1,
                            periods : [ {
                                period_number : 1,
                                price_cap : "0.00",
                                y_scale_max: "",
                                x_scale_max: "",
                                price_cap_type: "ceiling",
                                price_cap_enabled : "False",
                                sellers : [],
                                buyers : [],
                                demand : [],
                                supply : [],
                             }]
                         },
                     },
                    current_visible_period : 1,                //period visible on screen
                    downloadParametersetButtonText:'Download <i class="fas fa-download"></i>',
                    downloadDatasetButtonText:'Download <i class="fas fa-download"></i>',
                    valuecost_modal_label:'Edit Value or Cost',
                    current_valuecost:{                       //json attached to value/cost edit modal
                        id:0,
                        valuecost:0,
                        enabled:false,
                    },
                    valuecost_form_ids: {{valuecost_form_ids|safe}},
                    period_form_ids: {{period_form_ids|safe}},
                    upload_file: null,
                    upload_file_name:'Choose File',
                    uploadParametersetButtonText:'Upload  <i class="fas fa-upload"></i>',
                    uploadParametersetMessaage:'',
                    show_parameters:false,
                    bid_offer_id:"",
                    bid_offer_amount:"",
                    bid_offer_message:"",              //message shown in input card under bid/offer input
                    show_bids_offers_graph : false,     //elements of graph to be shown
                    show_supply_demand_graph : false,
                    show_equilibrium_price_graph : false,
                    show_trade_line_graph : false,
                    show_gains_from_trade_graph : false,
                    move_to_next_period_text : '---',
                    add_to_value_amount : 0,
                    add_to_cost_amount : 0,
                    import_parameters_message : "",
                    playback_enabled : false,
                    playback_trade : 0,
                    import_parameters_session : null,

                    // modals
                    editSessionModal : null,
                    valuecostModal : null,           
                    editPeriodModal : null,
                    importParametersModal : null,
                    parameterSetModal : null,
                }},
    methods: {

        /** fire when websocket connects to server
        */
        handleSocketConnected(){            
            app.sendGetSession();
            app.sendGetSession();
        },

        /** take websocket message from server
        *    @param data {json} incoming data from server, contains message and message type
        */
        takeMessage(data) {
            
            //console.log(data);

            messageType = data.message.messageType;
            messageData = data.message.messageData;

            switch(messageType) {         
                case "help_doc":
                    app.takeLoadHelpDoc(messageData);
                    break;       
                case "get_session":
                    app.takeGetSession(messageData);
                    break;
                case "update_session":
                    app.takeUpdateSession(messageData);
                    break;
                case "update_valuecost":
                    app.takeUpdateValuecost(messageData);
                    break;
                case "update_period":
                    app.takeUpdatePeriod(messageData);
                    break;   
                case "import_parameters":
                    app.takeImportParameters(messageData);
                    break;
                case "download_parameters":
                    app.takeDownloadParameters(messageData);
                    break;
                case "start_experiment":
                    app.takeStartExperiment(messageData);
                    break;
                case "reset_experiment":
                    app.takeResetExperiment(messageData);
                    break;
                case "next_period":
                    app.takeNextPeriod(messageData);
                    break;   
                case "submit_bid_offer":
                    app.take_submit_bid_offer(messageData); 
                    break;       
                case "undo_bid_offer":
                    app.take_undo_bid_offer(messageData);
                    break;
                case "download_dataset":
                    app.takeDownloadDataset(messageData);
                    break;
            }

            this.working = false;
            this.first_load_done = true;
            Vue.nextTick(app.update_sdgraph_canvas());
        },

        /** send websocket message to server
        *    @param messageType {string} type of message sent to server
        *    @param messageText {json} body of message being sent to server
        */
        sendMessage(messageType, messageText) {            

            app.chatSocket.send(JSON.stringify({
                    'messageType': messageType,
                    'messageText': messageText,
                }));
        },

        /**
         * do after session has loaded
         */
         doFirstLoad()
         {            
            app.editSessionModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editSessionModal'), {keyboard: false});
            app.valuecostModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('valuecostModal'), {keyboard: false});            
            app.editPeriodModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editPeriodModal'), {keyboard: false});            
            app.importParametersModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('importParametersModal'), {keyboard: false});
            app.parameterSetModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('parameterSetModal'), {keyboard: false}); 

            document.getElementById('editSessionModal').addEventListener('hidden.bs.modal', app.hideEditSession);
            document.getElementById('valuecostModal').addEventListener('hidden.bs.modal', app.hideEditValuecost);
            document.getElementById('editPeriodModal').addEventListener('hidden.bs.modal', app.hideEditPeriod);
            document.getElementById('importParametersModal').addEventListener('hidden.bs.modal', app.hideImportParameters);
            document.getElementById('parameterSetModal').addEventListener('hidden.bs.modal', app.hideUploadParameters);
         }, 

        /** take create new session
        *    @param messageData {json} session day in json format
        */
        takeGetSession(messageData){
            
            app.session = messageData.session;

            if(app.session.started)
            {
                app.show_parameters = false;

                app.show_bids_offers_graph = true;
                app.show_supply_demand_graph = false;
                app.show_equilibrium_price_graph = false;
                app.show_trade_line_graph = false;
                app.show_gains_from_trade_graph = false;

                if(app.session.finished)
                {
                    app.current_visible_period = 1;
                    app.session.current_period = 1;
                }
                else
                {
                    app.current_visible_period = app.session.current_period;
                }
            }
            else
            {
                app.show_parameters = true;

                app.show_bids_offers_graph = false;
                app.show_supply_demand_graph = true;
                app.show_equilibrium_price_graph = true;
                app.show_trade_line_graph = false;
                app.show_gains_from_trade_graph = false;
            }

            app.updateMoveOnButtonText();

            if(!app.first_load_done)
            {
                setTimeout(app.doFirstLoad, 500);
            }
        },

        /**update text of move on button based on current state
         */
        updateMoveOnButtonText(){
            if(app.session.finished)
            {
                app.move_to_next_period_text = '** Experiment complete **';
            }
            else if(app.session.started)
            {
                if(app.session.current_period == app.session.parameter_set.number_of_periods)
                {
                    app.move_to_next_period_text = 'Complete experiment <i class="fas fa-flag-checkered"></i>';
                }
                else
                {
                    app.move_to_next_period_text = 'Move to next period <i class="fas fa-fast-forward"></i>';
                }
            }
        },

        /** send winsock request to get session info
        */
        sendGetSession(){
            app.sendMessage("get_session",{"sessionID" : app.sessionID});
        },

        /** send session update form   
        */
        sendUpdateSession(){
            app.cancelModal = false;
            app.working = true;
            app.sendMessage("update_session",{"formData" : {id:app.session.id, title:app.session.title},
                                              "sessionID" : app.sessionID});
        },

        /** take update session reponse
         * @param messageData {json} result of update, either sucess or fail with errors
        */
        takeUpdateSession(messageData){
            app.clearMainFormErrors();

            if(messageData.status == "success")
            {
                app.takeGetSession(messageData);       
                app.editSessionModal.hide(); 
            } 
            else
            {
                app.cancelModal=true;                           
                app.displayErrors(messageData.errors);
            } 
        },

        //do nothing on when enter pressed for post
        onSubmit(){
            //do nothing
        },

        {%include "staff/staff_session/parameters_card.js"%}
        {%include "staff/staff_session/graph_card.js"%}
        {%include "staff/staff_session/control_card.js"%}
        {%include "staff/staff_session/input_card.js"%}
        {%include "staff/staff_session/replay_card.js"%}
        {%include "js/help_doc.js"%}
        
        /** clear form error messages
        */
        clearMainFormErrors(){
            
            for(var item in app.session)
            {
                e = document.getElementById("id_errors_" + item);
                if(e){
                    document.getElementById("div_id_" + item).removeAttribute("class");
                    e.remove();
                }
            }

            s = app.valuecost_form_ids;
            for(var i in s)
            {
                e = document.getElementById("id_errors_" + s[i]);
                if(e){
                    document.getElementById("div_id_" + s[i]).removeAttribute("class");
                    e.remove();
                }
            }

            s = app.period_form_ids;
            for(var i in s)
            {
                e = document.getElementById("id_errors_" + s[i]);
                if(e){
                    document.getElementById("div_id_" + s[i]).removeAttribute("class");
                    e.remove();
                }
            }
        },

        displayErrors(errors){
            for(var e in errors)
                {
                    //e = document.getElementById("id_" + e).getAttribute("class", "form-control is-invalid")
                    var str='<span id=id_errors_'+ e +' class="text-danger">';
                    
                    for(var i in errors[e])
                    {
                        str +=errors[e][i] + '<br>';
                    }

                    str+='</span>';

                    document.getElementById("div_id_" + e).insertAdjacentHTML('beforeend', str);
                    document.getElementById("div_id_" + e).setAttribute("class","form-control is-invalid");

                    document.getElementById("div_id_" + e).scrollIntoView(); 
                
                }
        },



    },

    mounted(){

    },

}).mount('#app');

{%include "js/web_sockets.js"%}

  