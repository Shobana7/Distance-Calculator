// AJAX for posting
function create_post() {
    $.ajax({
        url : "", // the endpoint
        type : "POST", // http method
        data : { pointA : $('#pointA').val(), pointB : $('#pointB').val()  }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            console.log(json); // log the returned json to the console
            $('#result').css("display","block");
            $('#outputext').html("Distance: "+ json['distance'] + " km");
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};

ptA = "";
ptB = "";

function geocoding1(address) {
    API_KEY = '11a973074fcb48aca1c4eb9faaf72b70';
    address = address.replace(/ /g,"%20").replace(/,/g,"%2C");
    return $.ajax({
        url : "https://api.geoapify.com/v1/geocode/search?text="+address+"&apiKey="+ API_KEY, // the endpoint
        type : "GET", // http method
        // handle a successful response
        success : function(json) {
            ptA = String(json['features'][0]['bbox'][1]) + "," + String(json['features'][0]['bbox'][0]);
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });
};
function geocoding2(address) {
    API_KEY = '11a973074fcb48aca1c4eb9faaf72b70';
    address = address.replace(/ /g,"%20").replace(/,/g,"%2C");
    return $.ajax({
        url : "https://api.geoapify.com/v1/geocode/search?text="+address+"&apiKey="+ API_KEY, // the endpoint
        type : "GET", // http method
        // handle a successful response
        success : function(json) {
            ptB =  String(json['features'][0]['bbox'][1]) + "," + String(json['features'][0]['bbox'][0]);
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });
};


$('#post-form').on('submit', function(event){
    event.preventDefault();
    if ($('#typeOfSearch').prop('checked')){
    $.when(geocoding1($('#pointA').val()), geocoding2($('#pointB').val())).done(function(){
        console.log(ptA, ptB);
        $.ajax({
            url : "", // the endpoint
            type : "POST", // http method
            data : { pointA : ptA, pointB : ptB }, // data sent with the post request
    
            // handle a successful response
            success : function(json) {
                $('#result').css("display","block");
                $('#outputext').html("Distance: "+ json['distance'] + " km");
            },
    
            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    });
    }
    else{
        create_post();
    }
});

$("#reset").click(function(event){
    event.preventDefault();
    $('#pointA').val('')
    $('#pointB').val('')
    $('#typeOfSearch').prop('checked', false);
    $('#result').css("display","none");
  });

$(function() {


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});