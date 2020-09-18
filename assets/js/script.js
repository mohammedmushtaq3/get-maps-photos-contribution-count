var contents, name, image, level, points, values, cached;

var fields = {};
//id = "117116754524622833006";
id = "103474235754339879446";
contents = getResponseText("https://www.google.com/maps/contrib/" + id);

fillFields(contents);
console.table(fields);

$("#fields").text(JSON.stringify(fields, undefined, 2));

$('#submit').on('click',function(){
    contents = getResponseText($('#new-link').val());
    fillFields(contents);
    $("#new-fields").text(JSON.stringify(fields, undefined, 2));
});


function fillFields(contents){
    name = simple_match('<meta content="Contributions by ([^"]*)" itemprop="name">',contents);
    fields.name = name;
    fields.profile_image = simple_match('\\[\\\\"' + name + '\\\\",\\[null,4,null,null,null,null,\\[\\\\"([^\\\\]*)\\\\"]', contents);
    fields.contributions = simple_match(',\\\\\\"(([\\d]{1,3},)?([\\d]{3},)*([\\d]{3})|([\\d]{1-3})) contributions\\\\\\"',contents);
    fields.photo_view = photo_view_match('(\\d+),\\\\"(C[\\w-]{34,40})\\\\",(\\d+)', contents);
    
    fields.points = simple_match('(([\\d]{1,3},)?([\\d]{3},)*([\\d]{3})|([\\d]{1-3})) Points" itemprop="description"', contents);
    if (fields.points !== null) {
      fields.level = simple_match('<meta content="Level (\\d+) Local Guide', contents);
    } else {
        fields.points = simple_match('(([\\d]{1,3},)?([\\d]{3},)*([\\d]{3})|([\\d]{1-3})) Contributions" itemprop="description"', contents);
    }
    
    var contributions_type = [
      "ratings",
      "reviews",
      "photos",
      "videos",
      "answers",
      "edits",
      "places added",
      "road added",
      "roads added",
      "facts checked",
      "Q\\\\u0026A",
      "Q\\\\u0026As",
      "published lists",
    ];
    
    contributions_type.forEach(function (item) {
      // var value = contribution_match("\\\\\"(\\d+) " + item + "\\\\\"]", contents);
      var value = contribution_match(
        '\\\\"(https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*))\\\\",((\\d+)),\\\\"[\\d,]+ ' +
          item +
          '\\\\"]',
        contents
      );
      if (value !== null) {
        //console.log(Object.entries(value).length);
        if (Object.entries(value).length > 0) {
          fields[item] = value;
        }
      }
    });
}

function contribution_match(pattern, contents) {
  var matches = [...contents.matchAll(pattern)];
  var arr = {};
  if (matches !== null && matches.length > 0) {
    matches.forEach(function (arrayItem) {
      arr.icon = arrayItem[1];
      arr.value = arrayItem[4];
      // arrayItem.forEach(function(item){
      //   console.log(item);
      // });
    });
  }
  return arr;
}

function getResponseText(link) {
  var cors = "https://cors-anywhere.herokuapp.com/";
  // return $.ajax({
  //     type: "GET",
  //     url: cors + link,
  //     async: false
  // }).responseText;
  var response;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      response = xhttp.responseText;
    }
  };
  xhttp.open("GET", cors + link, false);
  xhttp.send();
  return response;
}

function photo_view_match(pattern, contents) {
  var matches = [...contents.matchAll(pattern)];
  //console.log(matches[0].length);
  var arr = {};
  if (matches !== null && matches.length > 0) {
    matches.forEach(function (arrayItem) {
      arr.photos = arrayItem[1];
      arr.views = arrayItem[3];
      // console.log(arrayItem[0] + " - "+ arrayItem[1] + " - " + arrayItem[2]+" - "+arrayItem[3] );
    });
  }
  return arr;
}

function simple_match(pattern, contents) {
  //console.log(pattern);
  // console.log(contents.match(pattern));
  var matches = contents.match(pattern);
  if (matches !== null) {
    return matches.length > 0 ? matches[1] : "";
  }
  return null;
}
