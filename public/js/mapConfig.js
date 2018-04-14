const mapStyles = [
    {
      "featureType": "administrative",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "lightness": 33
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#f2e5d4"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c5dac6"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "lightness": 20
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "lightness": 20
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c5c6c6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e4d7c6"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fbfaf7"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#acbcc9"
        }
      ]
    }
  ];

  const madapurData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          'marker-color': '#7e7e7e',
          'marker-size': 'medium',
          'marker-symbol': 'clothing-store',
          name: 'DMart'
        },
        geometry: {
          type: 'Point',
          coordinates: [
            78.39536905288695,
            17.438072628642058
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          'marker-color': '#c9c994',
          'marker-size': 'medium',
          'marker-symbol': 'police',
          name: 'Police station'
        },
        geometry: {
          type: 'Point',
          coordinates: [
            78.3960771560669,
            17.439863876771096
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          'marker-color': '#ff0000',
          'marker-size': 'medium',
          'marker-symbol': 'mobilephone',
          name: 'Samsung Service Center'
        },
        geometry: {
          type: 'Point',
          coordinates: [
            78.39604496955872,
            17.44210547107536
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          'marker-color': '#008040',
          'marker-size': 'medium',
          'marker-symbol': 'bank',
          name: 'HDFC Bank'
        },
        geometry: {
          type: 'Point',
          coordinates: [
            78.39736461639404,
            17.44103073751833
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          'marker-color': '#ffffff',
          'marker-size': 'medium',
          'marker-symbol': 'building',
          name: 'Surya\'s Hostel'
        },
        geometry: {
          type: 'Point',
          coordinates: [
            78.39568018913269,
            17.441777933900408
          ]
        }
      },
      {
        type: 'Feature',
        properties: {
          'marker-color': '#c0c0c0',
          'marker-size': 'medium',
          'marker-symbol': 'bus',
          name: 'Bus Stop'
        },
        geometry: {
          type: 'Point',
          coordinates: [
            78.39688181877136,
            17.43909620115554
          ]
        }
      }
    ]
  }