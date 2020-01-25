var photo_count=0;
var view_count=0;
var cors = "https://cors-anywhere.herokuapp.com/";
link = "https://www.google.com/maps/contrib/103474235754339879446/photos/@17.3689202,78.4850018,14z/data=!4m3!8m2!3m1!1e1";
unicode = "CInT9ekFGLsBKBgwuwFCDAiJ0_XpBRDy5Kq6Ag";

getCount( getResponse(link), unicode);

$("#photos").html(photo_count);
$("#views").html(view_count);

$(document).ready(function () {
    $("#submit").click(function () {
        var link = $("#new-link").val();
        var unicode = $("#new-unicode").val();
        getCount( getResponse(link), unicode);
        $("#new-photos").html(photo_count);
        $("#new-views").html(view_count);
        
    });
});

function getCount(responseText,unicode){
    // console.log(responseText);
    var pieces = getRemainingString(responseText, unicode, 0).split(',');
    photo_count = pieces[pieces.length - 2];
    pieces = getRemainingString(responseText, unicode, 1).split(',');
    view_count = pieces[1];    
}

function getResponse(link){
    return $.ajax({
            type: "GET",
            url: cors + link,
            async: false
        }).responseText;
}

function getRemainingString(str, contains, index) {
    return str.split(contains)[index];
}

//https://www.google.com/maps/contrib/112229672882478638212/photos/@17.3625018,78.4794044,16z/data=!3m1!4b1!4m3!8m2!3m1!1e1
// CLjO4OoFGJQBKBYwlAFCDAi4zuDqBRCCo_vKAw