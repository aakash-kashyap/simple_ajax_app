
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    var $street = $('#street');
    var $city = $('#city');
    var street_url = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location= " ;
    var imgtag = '<img  class="bgimg" src="' 

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    street_url += $street.val();
    street_url += " , ";
    street_url += $city.val();

    // alert(street_url);
    imgtag += street_url;
    imgtag += ' " >';
    // alert(imgtag);

    $greeting.text('So you want to live at ' + $street.val() + ', '+ $city.val().toUpperCase() + '?');
    $body.append(imgtag);


    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "126d0b54ca7d43a79366a0e520953e89",
      'q': "new york"
    });

    // alert(url);
//===================================================================================

    $nytElem.text('About ' + $city.val().toUpperCase() + ' city');
    

    $.ajax({
      url: url,
      method: 'GET',
    }).done(function(result) {
      // console.log(result.response.docs[0].web_url);
      result.response.docs.forEach(function(doc){
        var data = '<li class="article"> <a href= " ' + doc.web_url  ;
        data +='" >' + doc.headline.main + '</a> <p>' + doc.snippet + '</p> </li>';
        // console.log(data); 
        $nytElem.append(data);

      });
      
    }).error(function(){
        $nytHeaderElem.text("NewYork Times Articles colud not be loaded !");
    });


//====================================================================================

//Error Handeling using timeout function
    var wikiReqTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia resources.");
    }, 8000);



    var wiki_url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + $city.val() + '&format=json&callback=wikiCallback'; 
    console.log(wiki_url);

    
    $.ajax({
        url: wiki_url,
        dataType: 'jsonp',
        success: function(results) {
           // do something with data
           results[1].forEach(function(result){
                $wikiElem.append('<li> <a href=" ' + 'https://en.wikipedia.org/wiki/' + result +'"> '+result + '</a></li>');
                console.log(result);
           });
           
           clearTimeout(wikiReqTimeout);
        }
    } ); 



    return false;
};

$('#form-container').submit(loadData);
