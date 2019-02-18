$(document).ready(function() {
    $("#result-list, #result-list-mobile").hide();
    $('#ripple').css("display", "flex");
    changeButtonSelection("all-button");

  $("#all-button, #online-button, #offline-button").on("click", function() {
    var currentButton = $(this).attr("id");
    changeButtonSelection(currentButton);

    if (this.id == "all-button") {
      $("#result-list").fadeOut(200, function() {
        $(this).empty();
        $('#ripple').css("display", "flex");
      });
      $("#all-button").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
      $("#all-button-mobile").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
      $("#online-button").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
      $("#online-button-mobile").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
      $("#offline-button").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
      $("#offline-button-mobile").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
      getStreamerData();

    }
    else if (this.id == "online-button") {
      $(".offline").hide();
      $(".online").show();
    }
    else if (this.id == "offline-button") {
      $(".online").hide();
      $(".offline").show();
    }
  });
  $("#all-button-mobile, #online-button-mobile, #offline-button-mobile").on("click", function() {
    if (this.id == "all-button-mobile") {
      $("#result-list-mobile").fadeOut(function() {
        $(this).empty();
      });
      getStreamerData();
      $("#result-list-mobile").show("slow");
    }
    else if (this.id == "online-button-mobile") {
      $(".offline, .online").hide();
      $(".online").delay(250).fadeIn(500);
    }
    else if (this.id == "offline-button-mobile") {
      $(".online, .offline").hide();
      $(".offline").delay(250).fadeIn(500);
    }
  });
  $("#stream-list-box").on("click", "li", function() {
    var elementLink = $(this).find("a").attr("href");
    window.open(elementLink);
  });
  $("#stream-list-box-mobile").on("click", "li", function() {
    var elementLink = $(this).find("a").attr("href");
    window.open(elementLink);
  });
});

async function getStreamerData() {
  //var streamers = ["ninja", "summit1g", "riotgames", "shroud", "imaqtpie", "nightblue3", "lirik", "maximilian_DOOD", "nl_kripp", "YoDa", "zizaran", "BobRoss", "TheSpeedGamers", "Asmongold", "freecodecamp", "Omgitsfirefoxx", "KindaFunnyGames", "ManvsGame", "Trihex", "dizzy", "Amaz", "AdamKoebel", "pianoimproman", "DomesticDan", "Bennyfits", "darbian", "A_Seagull", "daigothebeastv", "KayPikeFashion", , "gamesdonequick"];
  var streamers = ["ninja", "summit1g", "riotgames", "shroud", "nl_kripp", "YoDa", "zizaran", "BobRoss", "freecodecamp", "gamesdonequick"];
  var apiType = ["users", "streams", "games"];
  let url, response, streamObj, gameObj, userObj;
  let liArray = [];
  let startIndex;
  let arrSize = 0;

  //Iterate though each streamer getting 3 API routes per streamer
  for(const streamer of streamers) {
      for(const type of apiType) {
          //Get data based on username or by game_id for the "games" api route
          if(type === "games") {
              //If user isn't streaming game_id can't be used to get the game API data
              if((streamObj.data).length === 0) {
                  gameObj = {};
              }
              else {
                  url = await generateApiUrl(type, streamObj.data[0].game_id);
                  response = await sendApiRequest(url);
              }
          }
          else {
              url = await generateApiUrl(type, streamer);
              response = await sendApiRequest(url);
          }

          //Store each API's data to a different variable
          if(type === 'streams') {
              streamObj = response;
          }
          else if(type === 'users') {
              userObj = response;
          }
          else if(type === 'games' && (streamObj.data).length !== 0) {
              gameObj = response;
          }
      }

      //Add 'li' element to an array
      const html = await createHtmlElement(streamObj, gameObj, userObj);
      liArray.push(html);

      //Add 5 elements to the dom every 5 iterations
      if(liArray.length % 5 === 0) {
          arrSize = liArray.length;
          startIndex = ((arrSize / 5) * 5) - 5;
          addHtmlToDom(startIndex, liArray);
      }
  }
  //If the remaining elements are less than 5, add them
  if(liArray.length !== arrSize) {
      let finalStartIndex = liArray.length - (liArray.length % 5);
      addHtmlToDom(finalStartIndex, liArray);
  }

  //Enable buttons after loading
  $("#all-button").prop("disabled", false).css("-webkit-filter", "grayscale(0%)");
  $("#all-button-mobile").prop("disabled", false).css("-webkit-filter", "grayscale(0%)");
  $("#online-button").prop("disabled", false).css("-webkit-filter", "grayscale(0%)");
  $("#online-button-mobile").prop("disabled", false).css("-webkit-filter", "grayscale(0%)");
  $("#offline-button").prop("disabled", false).css("-webkit-filter", "grayscale(0%)");
  $("#offline-button-mobile").prop("disabled", false).css("-webkit-filter", "grayscale(0%)");
}

//Creates the API URL based on the type of streamer data
async function generateApiUrl(dataType, data) {
  var urlBase = "https://wind-bow.glitch.me/helix/";
  var url = urlBase + dataType;
  if (dataType == 'streams') {
      url += ("?user_login=" + data);
  }
  else if(dataType == 'users') {
      url += ("?login=" + data);
  }
  else if(dataType == 'games') {
      url += ("?id=" + data);
  }
  return url;
}

//API getter function
async function sendApiRequest(url) {
    const response = await fetch(url)
        .then(res => res.json())
        .catch((error) => {
            console.log('ERROR: ' + url);
            throw error;
        });
    return response;
}

//Create the HTML element to be added to the DOM
function createHtmlElement(streamData, gameData, userData) {
    var channelStatus, htmlClass, currentWatching, description, logo, name, streamUrl, totalViews, partner, html;

    //Check if user is currently streaming
    if((streamData.data).length === 0) {
        channelStatus = 'Offline';
        htmlClass = 'offline';
        currentWatching = '--';
        description = '';
    }
    else {
        channelStatus = gameData.data[0].name;
        htmlClass = 'online';
        currentWatching = (streamData.data[0].viewer_count).toLocaleString();
        description = streamData.data[0].title;
    }
    //Make sure user data exists
    if((userData.data).length > 0) {
        logo = userData.data[0].profile_image_url;
        streamUrl = 'https://www.twitch.tv/' + userData.data[0].login;
        name = userData.data[0].display_name;
        totalViews = (userData.data[0].view_count).toLocaleString();
        partner = (userData.data[0].broadcaster_type === "partner" ? '<i class="far fa-handshake partner" title="Twitch Partner"></i>' : '');
    }

    //Create 'li' html element if all data exists
    if(streamData !== null && userData !== null) {
        html = '<li><div class="row stream-item ' +
          htmlClass + ' id="stream-item"><div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"><img src="' +
          logo + '" class="logo" id="logo"></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"><a href="' +
          streamUrl + '" class="streamer-name" target="_blank">' +
          name + '</a><div class="current-status">' +
          channelStatus + '</div><div class="description">' +
          description + '</div></div><div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"><div><i class="fa fa-users viewers" title="Current Viewers"><span>' +
          currentWatching + '</span></i></div><div><i class="fa fa-eye views" title="Total Views"><span>' +
          totalViews + '</span></i></div><div>' +
          partner + '</div></div></div></li>';

          return html;
    }

}
//Add html elements to DOM in chunks
async function addHtmlToDom(startIndex, array) {
    for(let i = startIndex; i < array.length; i++) {
        //Add element to the DOM
        $("#result-list").append(array[i]);
        $("#result-list-mobile").append(array[i]);
    }
    $('#ripple').css("display", "none");
    $("#result-list").fadeIn(500);
    $("#result-list-mobile").fadeIn(500);
}

function changeButtonSelection(clickedButton) {
  if (clickedButton == "online-button" && !$("#online-button").hasClass("online-button-selected")) {
    $("#online-button").toggleClass("online-button-selected");
    if ($("#all-button").hasClass("all-button-selected")) {
      $("#all-button").toggleClass("all-button-selected");
    }
    if ($("#offline-button").hasClass("offline-button-selected")) {
      $("#offline-button").toggleClass("offline-button-selected");
    }
  }
  else if (clickedButton == "offline-button" && !$("#offline-button").hasClass("offline-button-selected")) {
    $("#offline-button").toggleClass("offline-button-selected");
    if ($("#all-button").hasClass("all-button-selected")) {
      $("#all-button").toggleClass("all-button-selected");
    }
    if ($("#online-button").hasClass("online-button-selected")) {
      $("#online-button").toggleClass("online-button-selected");
    }
  }
  else if (clickedButton == "all-button" && !$("#all-button").hasClass("all-button-selected")) {
    $("#all-button").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
    $("#all-button-mobile").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
    $("#online-button").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
    $("#online-button-mobile").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
    $("#offline-button").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
    $("#offline-button-mobile").prop("disabled", true).css("-webkit-filter", "grayscale(100%)");
    getStreamerData();
    $("#all-button").toggleClass("all-button-selected");
    if ($("#online-button").hasClass("online-button-selected")) {
      $("#online-button").toggleClass("online-button-selected");
    }
    if ($("#offline-button").hasClass("offline-button-selected")) {
      $("#offline-button").toggleClass("offline-button-selected");
    }
  }
}
