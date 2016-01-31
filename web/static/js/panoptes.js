function add_chat_item(name, msg, time){
    item = '<li><span class="from">' + name + '</span><span class="title">';
    item = item + msg;
    item = item + '</span><span class="date">' + time + '</span></li>';

    $('#bot_chat').prepend(item);
}

function update_mount_status(status){
    $.each(status, function(key, val){
        $('#' + key).html(val);
    });
}

var messageContainer = document.getElementById('messages');
function WebSocketTest(server) {
    if ("WebSocket" in window) {
        var ws = new WebSocket("ws://" + server + "/ws/");
        ws.onopen = function() {
            messageContainer.innerHTML = "Connection open...";
            ws.send("Connection established");
        };
        ws.onmessage = function (evt) {
            var type = evt.data.split(' ', 1)[0];
            console.log(type);
            var received_msg = evt.data.substring(evt.data.indexOf(' ') + 1)

            console.log(received_msg);

            var msg = jQuery.parseJSON(received_msg);

            if (type == 'PAN001'){
                add_chat_item(type, msg.message, msg.timestamp);
            }
            if (type == 'MOUNT'){
                update_mount_status(msg);
            }
            if (type == 'STATE'){
                refresh_images();
            }

        };
        ws.onclose = function() {
            messageContainer.innerHTML = "Connection is closed...";
        };
    } else {
        messageContainer.innerHTML = "WebSocket NOT supported by your Browser!";
    }
}

function refresh_images(){
    console.log("Refreshing images")
    $.each($('.img_refresh img'), function(idx, img){
        reload_img(img);
    });
}

function reload_img(img){
    base = $(img).attr('src').split('?')[0];

    // Hack for others
    if(base.startsWith('http')){
        new_src = $(img).attr('src');
    } else {
        new_src = base + '?' + Math.random()
    }


    $(img).attr('src', new_src);
}

$( document ).ready(function() {
    // Image refresh timer
    second = 1000;

    WebSocketTest(window.location.host);

    // Refresh images
    setInterval(refresh_images, 15 * second);
})