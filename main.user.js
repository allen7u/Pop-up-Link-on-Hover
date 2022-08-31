// ==UserScript==
// @name         Pop URL on Hover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function() {

    'use strict';

    var query_patterns_list =  [ 
    'div div a',
    'ul li a.title',
    '.bili-video-card__info > div > a' 
    ];
    
    createButton('URL on Hover','93%','90%',on_button_click)

    function on_button_click(e){
        for ( var i = 0; i < query_patterns_list.length; i++ ) {
            copy_links_on_this_page( query_patterns_list[i] );
        }
    }

    function copy_links_on_this_page( query ){
        // bilibili playlist 
        var link_node_list = document.querySelectorAll( query );
        if( link_node_list.length == 0 ){
            return;
        }

        var mouseX, mouseY;
        // track mouse position for div creation 
        document.addEventListener('mousemove', function(e) {                
            mouseX = e.clientX
            mouseY = e.clientY
        }
        , false);
        for(var i=0;i<link_node_list.length;i++){

            let div 
            let div_creation_timer
            let div_destory_timer
            link_node_list[i].addEventListener('mouseenter', function(e) {
                // get the link href
                var href = e.target.href;
                // create a new div
                // create a new div 1s after the mouse enter the link
                div_creation_timer = setTimeout(function(){
                    if(div){
                        div.remove();
                    }
                    div = document.createElement('div');                    
                    // set the div content to the link href
                    div.innerHTML = href;
                    // set the div style
                    div.style.position = 'fixed';
                    div.style.top = mouseY+ 5 +'px';
                    div.style.left = mouseX+ 5 +'px';
                    div.style.backgroundColor = '#fff';
                    div.style.border = '1px solid #000';
                    div.style.padding = '5px';
                    div.style.zIndex = '99999';
                    document.body.appendChild(div);
                    // destroy the div after 1s, not recommanded since it's be there mouseleave the link
                    // however, if you don't want the div to clutter some default popup, uncomment the following line
                    // div_destory_timer = setTimeout(function(){
                    //     document.body.removeChild(div);
                    // },1000);
                    // delete div_destory_timer on mouseenter the div
                    div.addEventListener('mouseenter', function(e) {
                        clearTimeout(div_destory_timer);
                    } , false);
                    // reset div_destory_timer on mouseleave the div
                    div.addEventListener('mouseleave', function(e) {
                        div_destory_timer = setTimeout(function(){
                            document.body.removeChild(div);
                        }
                        ,300);
                    } , false);
                    // copy the link href to clipboard on click the div 
                    // and remove the div after
                    div.addEventListener('click', function(e) {
                        copyToClipboard(href);
                        // document.body.removeChild(div);
                        div.remove();
                    } , false); 
                }, 300);
            } , false);
            
            link_node_list[i].addEventListener('mouseleave', function(e) {                
                if(div==undefined){
                    // cancel div_creation_timer if it was not created yet
                    clearTimeout(div_creation_timer);                    
                }else{
                    // or set div_destory_timer if it has been created, to allow mouseenter the div to cancel the timer
                    div_destory_timer = setTimeout(function(){
                        div.remove();
                        },300);
                }                
            } , false);
        }
    }

    

    function copyToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
        document.body.removeChild(textArea);
    }


    
    function createButton( innerHTML,left, top, on_button_click ){
        var btn = document.createElement('button')
        btn.addEventListener('click', on_button_click);
        btn.innerHTML = innerHTML;
        btn.draggable = 'true'
        btn.style.position = 'fixed';
        btn.style.top = top;
        btn.style.left = left;
        btn.style.zIndex = '9999';
        btn.style.backgroundColor = '#fff';
        btn.style.color = '#000';
        btn.style.fontSize = '20px';
        btn.style.padding = '10px';
        btn.style.borderRadius = '5px';
        btn.style.border = '1px solid #000';
        btn.style.cursor = 'pointer';
        btn.id = 'notes-dl-btn'

        var offSetX, offSetY
        btn.ondragstart = function(e){
            let rect = e.target.getBoundingClientRect()
            offSetX = e.clientX - rect.left
            offSetY = e.clientY - rect.top
        }
        btn.ondragend = function(e){
            btn.style.left = parseInt(e.clientX - offSetX)+'px'
            btn.style.top = parseInt(e.clientY	- offSetY)+'px'
            console.log(e.clientX)
            console.log(e.clientY)
            console.log(parseInt(e.clientX - offSetX))
            console.log(e.clientY - offSetY)
        }

        document.body.appendChild(btn);
    }

})();












