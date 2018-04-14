const map = (function() {
  const apiKey = "AIzaSyBvePY2blJGcGgxftR467aWVB6QESjtFUQ";
  let map;
  let marker;
  let markers = [];
  let mapDiv = document.getElementById("map");
  let currentLocationMarker;

  // Escapes HTML characters in a template literal string, to prevent XSS.
  // See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
  function sanitizeHTML(strings) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    let result = strings[0];
    for (let i = 1; i < arguments.length; i++) {
      result += String(arguments[i]).replace(/[&<>'"]/g, char => {
        return entities[char];
      });
      result += strings[i];
    }
    return result;
  }

  function showMapAndData(center, centerTitle,zoom) {
    map = new google.maps.Map(mapDiv, {
      zoom: zoom || 15,
      center: center
      // styles:mapStyles
    });
    
     
    markers.push(new google.maps.Marker({
      position: center,
      map: map,
      title: centerTitle
    }));
    console.log('1',markers)

    //madapurData - global variable defined in mapConfig.js {geoJson Object}
    //addDataFromGeojsonObject(madapurData)

    // hyderabad pincode areas shapes
    // addDataFromGeojsonFile(map,"/js/boundary.geojson",markers)

    //initInfoWindow(map)
  }

  // function removeMarker(marker){
  //   marker = marker || currentLocationMarker;
  //   marker.setMap(null)
  // }

  function initInfoWindow(mapObj) {
    //info window
    const infoWindow = new google.maps.InfoWindow();
    infoWindow.setOptions({
      pixelOffset: new google.maps.Size(0, -30)
    });
    mapObj.data.addListener("click", event => {
      let category = event.feature.getProperty("category");
      let name = event.feature.getProperty("name");
      let description = event.feature.getProperty("description");
      let hours = event.feature.getProperty("hours");
      let phone = event.feature.getProperty("phone");
      let position = event.feature.getGeometry().get();
      let content = sanitizeHTML`
              <img style="float:left; width:200px; margin-top:30px" src="img/logo_${category}.png">
              <div style="margin-left:220px; margin-bottom:20px;">
                <h2>${name}</h2><p>${description}</p>
                <p><b>Open:</b> ${hours}<br/><b>Phone:</b> ${phone}</p>
                <p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=${apiKey}"></p>
              </div>
            `;
      infoWindow.setContent(content);
      infoWindow.setPosition(position);
      infoWindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
      infoWindow.open(mapObj);
    });
  }

  /**
   * @description adds markers/shapes to map and if provided with, adds these markers to global markers array for working with them
   * @param {map} map
   * @param {geojsonObject} geojsonObject Geojsonobject
   * @param {Array} markers array of global marker objects
   */
  function addDataFromGeojsonObject(map, geojsonObject) {
    
    let places = geojsonObject.features || geojsonObject;
    console.log(places.length);

    places.forEach(feature => {
      let l = feature.geometry || feature.location
      let center = {
        lat: l.coordinates[1],
        lng: l.coordinates[0]
      };
      console.log(center);
      markers.push(new google.maps.Marker({
        position: center,
        map: map,
        title: feature.name || feature.properties.name,
        // fillColor: feature.properties["marker-color"] || 'red',
        optimized: false,
        icon: {
          url: "/img/icon_cafe.png",
          scaledSize: new google.maps.Size(32, 32)
        },
        // label: { text: feature.properties.name, color: "red" }
      }))
    });

    // markers = markers.concat(nearbyMarkers); //concat is non-mutating 
     
    console.log(markers)
  }

  /**
   * @description adds markers/shapes to map
   * @param {map} map
   * @param {path to file} geojsonObject Geojson file
   */
  function addDataFromGeojsonFile(map, filepath) {
    map.data.loadGeoJson(filepath);
    let madapurMarkers = [];
    // seems like by default maps over an array of data
    map.data.setStyle(feature => {
      console.log(feature.getProperty("name"));
      return {
        icon: {
          fillColor: feature.getProperty("marker-color"),
          //   url: `img/icon_${feature.getProperty("marker-symbol")}.png`,
          url: `img/icon_cafe.png`,
          scaledSize: new google.maps.Size(32, 32)
        },
        title: feature.getProperty("name"),
        fillColor: "green",
        strokeWeight: 1,
        mouseover: () => {
          console.log(feature.getProperty("name"));
        }
      };
    });
  }

  function setMapPosByPoints(center) {
    center = center || {
      lat: Number(lat.value),
      lng: Number(lng.value)
    };
    setMapPos(center);
  }
  function setMapPos(center, markerOptions) {
    
    console.log(center);
    map.setOptions({
      center: center,
      zoom: 10
    });
    markerOptions = Object.assign(
      {
        position: center,
        map: map
      },
      markerOptions
    );
    
    markers.push(new google.maps.Marker(markerOptions))
  }

  /*
  ====================================    Public Functions   =====================================
  */
  function initMap(loc,zoom) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        console.log("position acquired");
        let center = loc || {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        // c = { lat: 52.632469, lng: -1.689423 };
        showMapAndData(center, "Current Location",zoom);
      },
      err => {
        console.log(err); // {code:1,message:"User denied Geolocation"}
        center = {
          lat: 17.4427192,
          lng: 78.3973183
        };
        console.log(err.message);
        showMapAndData(center, "Some Location",zoom);
      }
    );
  }

  function emptyMarkers(){
    markers = [];
  }

  return {
    initMap: initMap,
    getMarkers: () => {
      return markers;
    },
    getMap: () => {
      return map;
    },
    setMapPosByPoints: setMapPosByPoints,addDataFromGeojsonObject:addDataFromGeojsonObject,emptyMarkers
  };
})();
