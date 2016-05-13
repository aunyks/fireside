function linkify(str, href){
    return '<a href="' + href + '" target="_blank" style="color: #4099FF">' + str + '</a>';
}

function generateHeader(txt, link){
    var titleTxt = $('<h3></h3>');
    titleTxt.html(txt);
    
    var text = titleTxt.html();
    var words = text.split(' ');
    
    for(var i = 0; i < words.length; i++){
        if(words[i].charAt(0) === '@')
            words[i] = linkify(words[i], 'https://twitter.com/' + words[i].substring(1, words[i].length));
            
        if(words[i].charAt(0) === '#')
            words[i] = linkify(words[i], 'https://twitter.com/search?q=' + encodeURIComponent('#') + words[i].substring(1, words[i].length));
            
        if(words[i].substring(0, 5) === 'https')
            words[i] = linkify(words[i], words[i]);
    }
    
    titleTxt.html(words.join(' '));
    
    return titleTxt;
}

function generateImage(link, src){
    
    var mLink = $('<a></a>');
    mLink.addClass('image');
    mLink.attr('href', link);
    
    var img = $('img');
    img.attr('src', src);
    img.attr('alt', '');
    
    mLink.append(img);
    
    return mLink;
}

function generateDescription(){
    var hr = $('<hr/>');
    return hr;
}

function generateFooter(origin, username, link){
    var mLink = $('<a></a>');
    mLink.attr('href', 'https://' + origin+'.com/' + username);
    mLink.attr('target', '_blank');
    
    var div = $('<div></div>');
    div.css({
        'margin-bottom' : '0px',
        'font-family' : 'Raleway, Helvetica, sans-serif',
        'margin' : '0 0 2em 0'
    });
    
    var icon = $('<i></i>');
    icon.addClass('fa fa-' + origin);
    
    var mUsername = $('<strong></strong>');
    mUsername.css({
        'font-size' : '15px'
    });
    mUsername.text(' '+username);
    
    div.append(icon);
    div.append(mUsername);
    mLink.append(div);
    return mLink;
}

function generateItem(data){
    var picture = data.picture;
    var description = data.description;
    var origin = data.origin;
    var username = data.username;
    var link = data.link;
    
    // Create item
    var item = $('<article></article>');
    
    // Create actual image object
    var img = generateImage(link, picture);
    
    // Generate title
    var title = generateHeader(description, link);
    
    // Generate description
    var partition = generateDescription();
    
    // Generate icon and username
    var footer = generateFooter(origin, username, link);
    
    item.append(img);
    item.append(title);
    item.append(partition);
    item.append(footer);
    
    return item; 
}

function loadToItem(parent, items,  round){
    for(var i = 0; i < 6; i++){
        parent.append(items[i]);
    }
        
}

$(document).ready(function(){
    
    // Get server info
    $.get( "api", function(responseData) {
        var serverData = responseData;
        tweetCount = 1;
        
        $('#trends').html($('#trends').html() + serverData.trend[0] + '<br />' + serverData.trend[1] + '<br />' + serverData.trend[2]);
        for(var i = 0; i < 6; i++){
            var data = {
                picture: '/images/pic02.jpg',
                description: (serverData.tweet)[i],
                origin: 'twitter',
                username: (serverData.user)[i],
                link: '#'
            };
            $('#result').append(generateItem(data));
        }
        
        $('#moreBtn').click(function(){
            for(var i = 6 * i; i < (i + 6); i++){
                var data = {
                    picture: '/images/pic02.jpg',
                    description: (serverData.tweet)[i],
                    origin: 'twitter',
                    username: (serverData.user)[i],
                    link: '#'
                };
                $('#result').append(generateItem(data));
                tweetCount++;
            }
        });
    
    });
});