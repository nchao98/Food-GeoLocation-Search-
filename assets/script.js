$(document).ready(function () {
  getCity();
  load();

  $("#favBtn").on("click", function () {
    document.location.replace("./favorites.html");
  });

  function getCity() {
    var requestURL = "https://ipapi.co/json/";
    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var requestURL = `https://api.openbrewerydb.org/breweries?by_dist=${data.latitude},${data.longitude}&per_page=10`;
        getBrewery(requestURL);
        filter(data.latitude, data.longitude);
      });
  }

  function filter(lat, lon) {
    $("#sbmt").on("click", function () {
      var zip = $("#zip").val();
      var number1 = $("#number1").val();
      var requestURL = `https://api.openbrewerydb.org/breweries?&by_dist=${lat},${lon}&by_postal=${zip}&per_page=${number1}`;
      $(".brewery-list").empty();
      updateFilters();
      getBrewery(requestURL);
    });
  }

  var micro1;
  var nano1;
  var regional1;
  var brewpub1;
  var userAnswer;
  updateFilters();

  function updateFilters() {
    micro1 = $("#brewery1").is(":checked") ? true : false;
    nano1 = $("#brewery2").is(":checked") ? true : false;
    regional1 = $("#brewery3").is(":checked") ? true : false;
    brewpub1 = $("#brewery4").is(":checked") ? true : false;
    userAnswer = {
      brewPub: brewpub1,
      micro: micro1,
      nano: nano1,
      regional: regional1,
    };
  }
  $("#btn").on("click", function () {
    updateFilters();
    $(".brewery-list").empty();
    getCity();
  });

  function getBrewery(requestURL) {
    fetch(requestURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var results = [];
        if (userAnswer.brewPub === true) {
          var pubArray = data.filter(
            (brewery) => brewery.brewery_type === "brewpub"
          );
          results = results.concat(pubArray);
        }

        if (userAnswer.micro === true) {
          var microArray = data.filter(
            (brewery) => brewery.brewery_type === "micro"
          );
          results = results.concat(microArray);
        }

        if (userAnswer.nano === true) {
          var nanoArray = data.filter(
            (brewery) => brewery.brewery_type === "nano"
          );
          results = results.concat(nanoArray);
        }

        if (userAnswer.regional === true) {
          var regionalArray = data.filter(
            (brewery) => brewery.brewery_type === "regional"
          );
          results = results.concat(regionalArray);
        }
        var filteredForWebsite = results.filter(
          (result) => result.website_url !== null
        );
        for (var i = 0; i < filteredForWebsite.length; i++) {
          var listItem = $("<div>")
            .addClass("brew")
            .attr("id", "brewery" + filteredForWebsite[i].id);
          var name = $("<h2>")
            .addClass("name")
            .text(filteredForWebsite[i].name);
          var street = $("<h3>")
            .addClass("street")
            .text(filteredForWebsite[i].street);
          var state = $("<h3>")
            .addClass("state")
            .text(filteredForWebsite[i].state);
          var city = $("<h3>")
            .addClass("city")
            .text(filteredForWebsite[i].city);
          var zip = $("<h3>")
            .addClass("zip")
            .text(parseInt(filteredForWebsite[i].postal_code.split("-")[0]));
          var url = $("<a>")
            .attr("target", "_blank")
            .attr("href", filteredForWebsite[i].website_url)
            .addClass("url")
            .text(filteredForWebsite[i].website_url);
          var phone = $("<a>")
            .attr("href", "tel:" + filteredForWebsite[i].phone)
            .addClass("phone")
            .text(filteredForWebsite[i].phone);
          var button = $("<button>")
            .text("Add to Favorites")
            .addClass("saveButton success button");
          $(".brewery-list").append(
            listItem.append(
              name,
              street,
              city,
              state,
              zip,
              url,
              "</br>",
              phone,
              "</br>",
              button
            )
          );
        }
        saveFavs();
      });
  }

  $(".brewery-list").on("click", ".saveButton", function () {
    var info = $(this).parent().attr("id");
    var content = {
      brewName: $(this).parent().children(".name").html(),
      brewStreet: $(this).parent().children(".street").html(),
      brewState: $(this).parent().children(".state").html(),
      brewCity: $(this).parent().children(".city").html(),
      brewZip: $(this).parent().children(".zip").html(),
      brewUrl: $(this).parent().children(".url").html(),
      brewPhone: $(this).parent().children(".phone").html(),
      brewId: parseInt($(this).parent().attr("id").split("y")[1]),
    };
    save(info, content);
  });

  function saveFavs() {}

  function save(infoP, contentP) {
    localStorage.setItem(infoP, JSON.stringify(contentP));
  }

  function load() {
    var content = [];
    for (var i = 0, len = localStorage.length; i < len; ++i) {
      content.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
    showFavs(content);
  }

  function showFavs(favorites) {
    for (var i = 0; i < favorites.length; i++) {
      var listItem = $("<div>")
        .addClass("brew")
        .attr("id", "brewery" + favorites[i].brewId);
      var name = $("<h2>").addClass("name").text(favorites[i].brewName);
      var street = $("<h3>").addClass("street").text(favorites[i].brewStreet);
      var state = $("<h3>").addClass("state").text(favorites[i].brewState);
      var city = $("<h3>").addClass("city").text(favorites[i].brewCity);
      var zip = $("<h3>")
        .addClass("zip")
        .text(parseInt(favorites[i].brewZip.split("-")[0]));
      var url = $("<a>")
        .addClass("url")
        .attr("target", "_blank")
        .attr("href", favorites[i].brewUrl)
        .text(favorites[i].brewUrl);
      var phone = $("<a>")
        .attr("href", "tel:" + favorites[i].brewPhone)
        .addClass("phone")
        .text(favorites[i].brewPhone);
      var key = "brewery" + favorites[i].brewId;
      var button = $("<button>")
        .text("Remove from Favorites")
        .addClass("deleteButton button alert");
      $(".saved-list").append(
        listItem.append(
          name,
          street,
          city,
          state,
          zip,
          url,
          "</br>",
          phone,
          "</br>",
          button
        )
      );
    }

    $(".saved-list").on("click", ".deleteButton", function () {
      window.localStorage.removeItem(key);
      location.reload();
    });
  }

  $("#clear").on("click", function () {
    localStorage.clear();
    location.reload();
  });

  $("#return").on("click", function () {
    document.location.replace("./index.html");
  });
});
$(document).foundation();