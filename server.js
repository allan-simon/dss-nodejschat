var http = require("http");
var url = require("url");


// global variables used to 
// store the messages of our chat
var globalMessages = [] ;


function main_page_update_js() {

    var js = "function update_chat() {" + 
        "$.ajax({    " +
            "type : 'GET',"+
            "url :  '/update',"+
            "data : { }, "+
            "dataType : 'json', "+
            "success: function(data){" +
                "$('#messages').html('');"+
                "for ( message in data ) {"+
                    "$('#messages').append('<p>'+data[message]+'</p>');"+
                "}"+
            "}," +
            "complete : function() {" +
                "setTimeout('update_chat()',1000);"+
            "}"+
        "});"+
    "}" +
    "update_chat();";
    return "<script type='text/javascript'>"+js+ "</script>";
}


// function that contains the javascript
// used by the main page in order to
// do some AJAX request 
function main_page_js() {

    // javascript used to send the message written
    // by the user when we click on submit

    
    
    var js = "$('#sendForm').submit(function() { " +
            // we take the value contained in the input
            " var text = $('#mes').val(); " +

            "$.ajax({    " +
                "type : 'GET',"+
                "url :  '/send',"+
                "data : { 'message' : text  }, "+
                "success: function(data){}" +
            "});"+

            // we empty the input in order to be able
            // to write a new message 
            " $('#mes').val('');" +
            // we return false in order to not go to an other
            // page, because the form is sent by AJAX
            "return false;" +
        "});";

    
    // javascript executed to get the new messages
    return "<script type='text/javascript'>"+ js + "</script>";
}

// function that return a string being the
// head content of my main page
function main_page_head() {
    // we include jquery 
    head = "<script type='text/javascript' src='http://code.jquery.com/jquery-1.9.1.min.js'></script>";
    return head;
}



// function that return a string being
// the body content of my main page
function main_page_body() {
    var body = 
        //div used to display the messages in
        "<div id='messages'></div>" +
        // form used to send a new message
        "<form id='sendForm'>" +
            "<input id='mes' type='text' value=''>" +
            "<input type='submit' value='Send'>" +
        "</form>" +
        main_page_js()+
        main_page_update_js();
    return body;
}

// function is used to display the main 
// page to the client
function main_page(request,response) {
    response.writeHead(
        200,   // HTTP status code "OK" 
        { "Content-Type" : "text/html" }
    );
    response.write("<!DOCTYPE html>");
    response.write("<html><head>");
    response.write(main_page_head());
    response.write("</head><body>");
    response.write(main_page_body());
    response.write("</body></html>");
    response.end();
}
// function used to save a new message
// sent by the client
function send(request,response) {
    // get the message from the query string
    var message = url.parse(request.url,true).query["message"];
    // add the message in our globalMessages
    globalMessages.push(message)
    // we don't need to send anything back to the client
    // but we finish the response in order to not make it 
    // wait for ever 
    response.end();
}

// function to send the new messages
// to the clien
function update(request,response) {
    
    response.writeHead(
        200,
        {'Content-Type' : 'application/json'}
    );
    response.write(JSON.stringify(globalMessages));
    response.end();
}



var myServer =  http.createServer(function(req,res){

    var page = url.parse(req.url).pathname;
    if (page === '/') {
        // code to display the index page
        main_page(req,res);
    }

    if (page === '/send') {
        // code to save a new message
        send(req,res);
    }

    if (page === '/update') {
        // code to send the new messages 
        // back to the client 
        update(req,res);
    }


});

myServer.listen(8080);
console.log("server started on port 8080");
