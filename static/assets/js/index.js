function generateHeader(txt){
    var titleTxt = $('<h3></h3>');
    titleTxt.text(txt);
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

function generateDescription(txt){
    var descTxt = $('<p></p>');
    descTxt.text(txt);
    return descTxt;
}

function generateFooter(origin, username){
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
    return div;
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
    var title = generateHeader(title);
    
    // Generate description
    var description = generateDescription(description);
    
    // Generate icon and username
    var footer = generateFooter(origin, username);
    
    item.append(img);
    item.append(title);
    item.append(description);
    item.append(footer);
    
    return item; 
}

$(document).ready(function(){
    
    // Get server info
    
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