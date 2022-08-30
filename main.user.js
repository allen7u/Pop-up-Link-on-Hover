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

    function copy_links_on_this_page(){

        // get queryselector from playlist_queryselector input value
        // var playlist_queryselector = document.getElementById("playlist_queryselector").value;
        var links = document.querySelectorAll( 'ul li a.title' );
        // var links_text = '';
        // var links_with_title = '';
        for(var i=0;i<links.length;i++){

            console.log(links[i].href);
            links[i].addEventListener('mouseenter', function(e) {
                // get the link href
                var href = e.target.href;
                // create a new div
                var div = document.createElement('div');
                // set the div content to the link href
                div.innerHTML = href;
                // set the div style
                div.style.position = 'fixed';
                div.style.top = e.clientY + 'px';
                div.style.left = e.clientX + 'px';
                div.style.backgroundColor = '#fff';
                div.style.border = '1px solid #000';
                div.style.padding = '5px';
                div.style.zIndex = '9999';
                // add the div to the body
                document.body.appendChild(div);

                var timer
                timer = setTimeout(function(){
                    document.body.removeChild(div);
                }
                ,1000);

                // delete timer on mouseenter the div
                div.addEventListener('mouseenter', function(e) {
                    clearTimeout(timer);
                } , false);

                // reset timer on mouseleave the div
                div.addEventListener('mouseleave', function(e) {
                    timer = setTimeout(function(){
                        document.body.removeChild(div);
                    }
                    ,1000);
                } , false);

                // copy the link href to clipboard on click the div 
                // and remove the div after
                div.addEventListener('click', function(e) {
                    copyToClipboard(href);
                    document.body.removeChild(div);
                } , false);                

            } , false);

            // links_text += links[i].href + '\n';
            // links_with_title += '# '+links[i].innerText + '\n' + links[i].href + '\n';
        }

        if(false){
            var combined_playlist = '\n#combined_playlist\n' + links_text + '\n' + links_with_title;

        
            var combined_playlist_and_search_results = 
            title + '\n' + combined_playlist + '\n' + combined_search_results;
            console.log(combined_playlist_and_search_results);
    
            // copy to clipboard
            var copyText = document.createElement('textarea')
            
            copyText.value = combined_playlist_and_search_results
            document.body.appendChild(copyText)
            copyText.select()
            document.execCommand('copy')
            document.body.removeChild(copyText)
    
    
            // show pop up message
            if (links.length > 0 || search_results.length > 0) {
            var innerHTML =    'Copied to clipboard.<br><br>' +
                    combined_playlist_and_search_results;
            var res = pop_up_div( innerHTML, 3000 );
            set_pop_up_div_style( res );
            }
        }

    }

    if(false){
        // set default search results queryselector
        var search_results_queryselector = '.bili-video-card__info > div > a';
        var search_results_queryselector_input = createInput( '93%','30%','search_results_queryselector', search_results_queryselector);
            // show tips on hover, and delete tips on mouseout
        var tip_div_1
        search_results_queryselector_input.addEventListener('mouseenter', function(){
            tip_div_1 = pop_up_div( 'search_results_queryselector' )    
            set_tip_div_style( tip_div_1 )    
        });
        search_results_queryselector_input.onmouseout = function(){
            tip_div_1.remove();
        }

        // set default playlist queryselector
        var playlist_queryselector = 'ul li a.title';
        var playlist_queryselector_input = createInput( '93%','50%','playlist_queryselector', playlist_queryselector);
            // show tips on hover, and delete tips on mouseout
        var tip_div_2
        playlist_queryselector_input.addEventListener('mouseenter', function(){
            tip_div_2 = pop_up_div( 'playlist_queryselector' )    
            set_tip_div_style( tip_div_2 )    
        });
        playlist_queryselector_input.onmouseout = function(){
            tip_div_2.remove();
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


    function createInput( left,top,id,value ){
        var input = document.createElement('textarea');
        // default value
        input.value = value ? value : '';
        input.id = id;
        input.style.position = 'fixed';
        input.style.zIndex = '9999';
        input.draggable = 'true';
        input.style.top = top;
        input.style.left = left;
        input.style.width = '90px';
        input.style.height = '90px';
        input.style.border = '1px solid #000';
        input.style.borderRadius = '5px';
        input.style.padding = '5px';
        input.style.fontSize = '12px';
        input.style.backgroundColor = '#fff';

        document.body.appendChild(input);

        var offSetX, offSetY
        input.ondragstart = function(e){
            let rect = e.target.getBoundingClientRect()
            offSetX = e.clientX - rect.left
            offSetY = e.clientY - rect.top
        }
        input.ondragend = function(e){
            input.style.left = parseInt(e.clientX - offSetX)+'px'
            input.style.top = parseInt(e.clientY	- offSetY)+'px'
            console.log(e.clientX)
            console.log(e.clientY)
            console.log(parseInt(e.clientX - offSetX))
            console.log(e.clientY - offSetY)
        }

        return input;
    }



    createButton('URL on Hover','93%','90%',copy_links_on_this_page)


    function createButton( innerHTML,left,top,eventHandler ){
        var btn = document.createElement('button')
        btn.addEventListener('click', eventHandler);
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



    function pop_up_div( innerHTML, duration) {
        var container = document.createElement('div');
        var message = document.createElement('div');
        message.innerHTML = innerHTML
        // add br to separate lines
        message.innerHTML = message.innerHTML.replace(/\n/g, '<br>');
        // add class
        // message.className = class_ ? class_ : 'message';
        // message.style.position = 'fixed';
        // message.style.top = '25vh';
        // message.style.left = '25vw';
        // message.style.width = '50vw';
        // message.style.height = '75vh';
        message.style.zIndex = '9000';
        message.style.backgroundColor = '#fff';
        message.style.borderRadius = '5px';
        message.style.padding = '10px';
        message.style.boxShadow = '0px 0px 10px #ccc';
        message.style.fontSize = '16px';
        message.style.overflow = 'auto';


        container.appendChild(message);
        document.body.appendChild(container);

        if (duration) {
        setTimeout(function () {
            document.body.removeChild(container);
        }, duration);
        }

        return container;
    }

    function set_tip_div_style(ele, style) {
        ele.style.display = 'flex';
        ele.style.position = 'fixed';
        ele.style.top = '0vh';
        ele.style.left = '0vw';
        ele.style.width = '100vw';
        ele.style.height = '100vh';
        ele.style.zIndex = '9000';
        ele.style.backgroundColor = 'rgba(0,0,0,0.1)';
        ele.style.borderRadius = '5px';
        ele.style.padding = '10px';
        ele.style.boxShadow = '0px 0px 10px #ccc';
        ele.style.fontSize = '16px';
        ele.style.overflow = 'auto';
        ele.style.justifyContent = 'center';
        ele.style.alignItems = 'center';
      }
    
    function set_pop_up_div_style(ele, style) {
        ele.style.display = 'flex';
        ele.style.flexDirection = 'column';
        ele.style.position = 'fixed';
        ele.style.top = '25vh';
        ele.style.left = '25vw';
        ele.style.width = '50vw';
        ele.style.height = '75vh';
        ele.style.zIndex = '9000';
        ele.style.backgroundColor = 'rgba(0,0,0,0.1)';
        ele.style.borderRadius = '5px';
        ele.style.padding = '10px';
        ele.style.boxShadow = '0px 0px 10px #ccc';
        ele.style.fontSize = '16px';
        ele.style.overflow = 'auto';
        ele.style.justifyContent = 'start';
        ele.style.alignItems = 'center';
    }
      
        // {
        //     position: fixed;
        //     top: 0;
        //     left: 0;
        //     width: 100%;
        //     height: 100%;
        //     z-index: 9999;
        //     background-color: rgba(0,0,0,0.5);
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
        // }



})();












