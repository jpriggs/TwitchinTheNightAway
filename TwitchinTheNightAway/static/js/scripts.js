$(document).ready(function() {

  changeButtonSelection("all-button");
  $("#result-list, #result-list-mobile").hide();
  getStreamerData();
  if ($(window).width() > 576) {
    $("#result-list").show("slow");
  }
  else {
    $("#result-list-mobile").show("slow");
  }

  $("#all-button, #online-button, #offline-button").on("click", function() {
    var currentButton = $(this).attr("id");
    changeButtonSelection(currentButton);

    if (this.id == "all-button") {
      $("#result-list").fadeOut(function() {
        $(this).empty();
      });
      getStreamerData();
      $("#result-list").show("slow");
    }
    else if (this.id == "online-button") {
      $(".offline, .online").hide();
      $(".online").delay(250).fadeIn(500);
    }
    else if (this.id == "offline-button") {
      $(".online, .offline").hide();
      $(".offline").delay(250).fadeIn(500);
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

function getStreamerData() {
  var streamers = ["ninja", "summit1g", "riotgames", "shroud", "imaqtpie", "nightblue3", "lirik", "maximilian_DOOD", "nl_kripp", "YoDa", "zizaran", "BobRoss", "TheSpeedGamers", "Asmongold", "freecodecamp", "Omgitsfirefoxx", "KindaFunnyGames", "ManvsGame", "Trihex", "TeamSp00ky", "deadmau5", "AmazHS", "AdamKoebel", "pianoimproman", "DomesticDan", "Bennyfits", "darbian", "A_Seagull", "daigothebeastv", "KayPikeFashion"];
  $.each(streamers, function(key, value) {
     fetchApiData(value);
  });
}
function generateApiUrl(dataType, streamer) {
  var urlBase = "https://wind-bow.gomix.me/twitch-api/";
  var url = urlBase + dataType + "/" + streamer + "?callback=?";
  return url;
}
function fetchApiData(channel) {

  $.getJSON(generateApiUrl("streams", channel), function(data) {
    var channelStatus, htmlClass, currentWatching;
    if (data.stream === null) {
      channelStatus = "Offline";
      htmlClass = "offline";
      currentWatching = "--";
    }
    else {
      channelStatus = data.stream.game;
      htmlClass = "online";
      currentWatching = (data.stream.viewers).toLocaleString();
    }
    $.getJSON(generateApiUrl("channels", channel), function(data) {
      var logo, name, description, streamUrl, totalViews, mature, partner, html;
      logo = data.logo;
      streamUrl = data.url;
      name = data.display_name;
      description = data.status != null ? data.status : "";
      totalViews = (data.views).toLocaleString();
      mature = JSON.stringify(data.mature) == "true" ? '<i class="fab fa-medium mature" title="Mature Stream"></i>' : '';
      partner = JSON.stringify(data.partner) == "true" ? '<i class="far fa-handshake partner" title="Twitch Partner"></i>' : '';
      html = '<li><div class="row stream-item ' +
        htmlClass + ' id="stream-item"><div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2"><img src="' +
        logo + '" class="logo" id="logo"></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"><a href="' +
        streamUrl + '" class="streamer-name" target="_blank">' +
        name + '</a><div class="current-status">' +
        channelStatus + '</div><div class="description">' +
        description + '</div></div><div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"><div><i class="fa fa-users viewers" title="Current Viewers"><span>' +
        currentWatching + '</span></i></div><div><i class="fa fa-eye views" title="Total Views"><span>' +
        totalViews + '</span></i></div><div>' +
        mature + '<span>' + partner + '</span></div></div></div></li>';

      if ($(window).width() > 576) {
        $("#result-list").append(html);
      }
      else {
        $("#result-list-mobile").append(html);
      }
    });
  });
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
    $("#all-button").toggleClass("all-button-selected");
    if ($("#online-button").hasClass("online-button-selected")) {
      $("#online-button").toggleClass("online-button-selected");
    }
    if ($("#offline-button").hasClass("offline-button-selected")) {
      $("#offline-button").toggleClass("offline-button-selected");
    }
  }
}
