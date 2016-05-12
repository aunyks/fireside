function generateHeader(txt, link){
    var mLink = $('<a></a>');
    mLink.attr('href', link);
    
    var titleTxt = $('<h3></h3>');
    titleTxt.text(txt);
    
    mLink.append(titleTxt);
    return mLink;
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

$(document).ready(function(){
    
    // Get server info
    $.get( "api", function(responseData) {
        var serverData = responseData;
        
        var data = {
            picture: '/images/pic02.jpg',
            description: 'This is an obj title. Yeet yah yeet yah punjabi on the fire track whip drop nae nae',
            origin: 'instagram',
            username: 'jack',
            link: '#'
        };
        
        $('#trends').html($(trends.html()) + serverData.trend[0] + '<br />' + serverData.trend[1] + '<br />' + serverData.trend[2]);
        for(var i = 0; i < serverData.user.length; i++){
            var data = {
                picture: '/images/pic02.jpg',
                description: (serverData.tweet)[i],
                origin: 'twitter',
                username: (serverData.user)[i],
                link: '#'
            };
            console.log((serverData.tweet)[i]);
            $('#result').append(generateItem(data));
        }
    
    });
});