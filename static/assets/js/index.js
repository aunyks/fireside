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

function generateDescription(txt){
    var descTxt = $('<p></p>');
    descTxt.text(txt);
    return descTxt;
}

function generateFooter(origin, username, link){
    var mLink = $('<a></a>');
    mLink.attr('href', link);
    
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
    var title = data.title;
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
    var title = generateHeader(title, link);
    
    // Generate description
    var description = generateDescription(description);
    
    // Generate icon and username
    var footer = generateFooter(origin, username, link);
    
    item.append(img);
    item.append(title);
    item.append(description);
    item.append(footer);
    
    return item; 
}

function getFire(){
    response = '';
    $.get( "api", function(responseData) {
        response = responseData;
    });
    
    return response;
}

$(document).ready(function(){
    
    // Get server info
    //var serverData = getFire();
    
    var data = {
        title: 'This is an obj title',
        picture: '/images/pic02.jpg',
        description: 'This is an obj desc',
        origin: 'instagram',
        username: 'jack',
        link: '#'
    };
    
    $('#result').append(generateItem(data));
});