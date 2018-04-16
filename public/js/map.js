const map = (function() {
  const apiKey = "AIzaSyDAaOdd7xBOpJ1gKK7_fqInnCAmP3Ayl-M";//google project id : flawless-agency-158215(My Project 1)
  let map;
  let markers = [];
  let mapDiv = document.getElementById("map");
  let currentLocationMarker;
  let shapes = [];//mostly circles
  let markerPos;
  let posMarker;

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

  function getPosMarker(){
    return posMarker;
  }

  //takes two values and returns latlng object
  function latLngObj(lat,lng){
    // if a single object with lat and lng properties are given
    if(typeof lat == 'object'){
      lat = lat.lat,
      lng = lat.lng
    }
    return new google.maps.LatLng(lat,lng)
  }

  function autoCenterWithMarkers(mapParam,mrkrs){
    // let map = mapParam || map;
    let _markers = mrkrs || markers;
    let bounds = new google.maps.LatLngBounds();
    _markers.forEach(m=>{bounds.extend(latLngObj(m.position.lat(),m.position.lng()))});
    map.fitBounds(bounds);
  }

  function showMapAndData(center, centerTitle, zoom,func) {
    markerPos = center;
    map = new google.maps.Map(mapDiv, {
      zoom: zoom || map.getZoom(),
      center: markerPos,
      styles:mapStyles
    });
    console.log('map initialized')

    posMarker = new google.maps.Marker({
      position: center,
      map: map,
      title: centerTitle
    });
    //onclick set a marker 
    map.addListener('click',e => {
      markers.map(m=>m.setMap(null));
      markers = [];
      // setMapPosByPoints(e.latLng);
      console.log(getPosMarker(),e.latLng)
      getPosMarker().setPosition(e.latLng)
      map.panTo(e.latLng);
      func({lat:e.latLng.lat(),lng:e.latLng.lng()})
    })

    // markers.push(
    //   new google.maps.Marker({
    //     position: center,
    //     map: map,
    //     title: centerTitle
    //   })
    // );



    //madapurData - global variable defined in mapConfig.js {geoJson Object}
    //addDataFromGeojsonObject(madapurData)

    // hyderabad pincode areas shapes
    // addDataFromGeojsonFile(map,"/js/boundary.geojson",markers)
  }

  function drawCircle(radius){
    if(shapes.length) {//if there are shapes prior
    shapes[0].setMap(null)
    shapes.pop();//remove previous shapes
    }
    shapes.push(
      new google.maps.Circle({
        strokeColor:'white',
        storkeOpacity:0.8,
        fillColor:'gray',
        fillOpacity:0.4,
        map:map,
        center:markerPos,
        radius:radius
      })
    )
  }

  function initInfoWindow(obj) {
    let { name,center} = obj
    //info window
    const infoWindow = new google.maps.InfoWindow({maxWidth:320});
    infoWindow.setOptions({
      pixelOffset: new google.maps.Size(0, -30)
    });
      let content = sanitizeHTML`
              <img style="float:left; width:100px; margin-top:30px" src="img/logo_cafe.png">
              <div style="margin-left:120px; margin-bottom:20px;">
                <h2 style="margin-bottom:0.75rem;color:var(--primaryColor);font-size:1.25rem">${name}</h2>
                <p><img src="https://maps.googleapis.com/maps/api/streetview?size=200x120&location=${center.lat},${center.lng}&key=${apiKey}"></p>
              </div>
            `;


    infoWindow.setContent(content);
    infoWindow.setPosition(center);
    infoWindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
    infoWindow.open(map);
    // mapObj.data.addListener("click", event => {
    //   console.log(event.feature)
    //   let category = event.feature.getProperty("category");
    //   let name = event.feature.getProperty("name");
    //   let description = event.feature.getProperty("description");
    //   let hours = event.feature.getProperty("hours");
    //   let phone = event.feature.getProperty("phone");
    //   let position = event.feature.getGeometry().get();
    //   let content = sanitizeHTML`
    //           <img style="float:left; width:200px; margin-top:30px" src="img/logo_${category}.png">
    //           <div style="margin-left:220px; margin-bottom:20px;">
    //             <h2>${name}</h2><p>${description}</p>
    //             <p><b>Open:</b> ${hours}<br/><b>Phone:</b> ${phone}</p>
    //             <p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=${apiKey}"></p>
    //           </div>
    //         `;
    //   infoWindow.setContent(content);
    //   infoWindow.setPosition(position);
    //   infoWindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
    //   infoWindow.open(mapObj);
    // });
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

    let bounds = new google.maps.LatLngBounds();
    //include the current position
    bounds.extend(new google.maps.LatLng(markerPos.lat,markerPos.lng))
    places.forEach(feature => {
      let l = feature.geometry || feature.location;
      let center = {
        lat: l.coordinates[1],
        lng: l.coordinates[0]
      };
      console.log(center);
      //include this marker into the bounds
      bounds.extend(new google.maps.LatLng(center.lat,center.lng));
      markers.push(
        new google.maps.Marker({
          position: center,
          map: map,
          title: feature.name || feature.properties.name,
          // fillColor: feature.properties["marker-color"] || 'red',
          optimized: false,
          icon: {
            url: "/img/icon_cafe.png",
            scaledSize: new google.maps.Size(32, 32)
          },
          click:()=>{initInfoWindow({center,name:(feature.name || feature.properties.name)})}
          // label: { text: feature.properties.name, color: "red" }
        })
      );
      
    });
    markers.forEach(marker=>{marker.addListener('click',marker.click)});
    if(places.length){
    // set dimension level to show all markers in the viewport
    map.fitBounds(bounds)
  }
    // markers = markers.concat(nearbyMarkers); //concat is non-mutating

    console.log(markers);
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
    markerPos = center
    map.setOptions({
      center: markerPos,
      zoom: map.getZoom() || 10
    });
    markerOptions = Object.assign(
      {
        position: center,
        map: map
      },
      markerOptions
    );

    posMarker.setOptions(markerOptions)
  }

  /*
  ====================================    Public Functions   =====================================
  */
  function emptyMarkers() {
    markers = [];
  }

  return {
    getMarkers: () => {
      return markers;
    },
    getMap: () => {
      return map;
    },
    setMapPosByPoints: setMapPosByPoints,
    addDataFromGeojsonObject: addDataFromGeojsonObject,
    emptyMarkers,
    initInfoWindow,
    showMapAndData,
    drawCircle,
    getPosMarker,
    autoCenterWithMarkers
  };
})();
