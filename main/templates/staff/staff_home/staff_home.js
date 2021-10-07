
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

//vue app
var app = Vue.createApp({
    delimiters: ["[[", "]]"],

    data() {return {chatSocket : "",
                    reconnecting : true,
                    working : false,
                    sessions : [],
                    sessions_full_admin : [],
                    sessions_full_admin_visible : false,
                }},
    methods: {
        handleSocketConnected(){
            //fire when socket connects
            app.sendGetSessions();
        },

        takeMessage(data) {
           //process socket message from server

           console.log(data);

           messageType = data.message.messageType;
           messageData = data.message.messageData;

            switch(messageType) {
                case "create_session":
                    app.takeCreateSession(messageData);
                    break;
                case "get_sessions":
                    app.takeGetSessions(messageData);
                    break;
                case "get_sessions_admin":
                    app.takeGetSessionsAdmin(messageData);
                    break;
    
            }

            app.working = false;
        },

        sendMessage(messageType,messageText) {
            //send socket message to server

            app.$data.chatSocket.send(JSON.stringify({
                    'messageType': messageType,
                    'messageText': messageText,
                }));
        },

        sendGetSessions(){
            //get list of sessions
            app.sendMessage("get_sessions",{});
        },

        takeGetSessions(messageData){
            //process list of sessions created by user
            app.sessions = messageData.sessions;           

            if(app.$data.sessions_full_admin_visible)
            {
                app.sendGetSessionsAdmin()
            }
        },

        sendDeleteSession(id){
            if (!confirm('Delete session? This is not reversible.')) {
                return;
            }

            //delete specified session
            app.working = true;
            app.sendMessage("delete_session",{"id" : id});
        },

        formatDate: function(value){
            if (value) {        
                //console.log(value);                    
                return moment(String(value)).local().format('MM/DD/YYYY');
            }
            else{
                return "date format error";
            }
        },

        {%include "staff/staff_home/sessions_card_full_admin.js"%}
        {%include "staff/staff_home/sessions_card.js"%}
        
    },

    mounted(){
        
    },

}).mount('#app');

{%include "js/web_sockets.js"%}
