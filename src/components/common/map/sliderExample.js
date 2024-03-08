const { Deck, MapView, WebMercatorViewport, ScatterplotLayer } = deck;
const data =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json';

const layerSettings = {
  data,
  getPosition: (d) => d.coordinates,
  getRadius: (d) => Math.sqrt(d.exits),
  lineWidthUnits: 'pixels',
  radiusScale: 6,
  stroked: true,
};

const deckgl = new Deck({
  // views= views (variable de estado)
  views: getViews(),
  viewState: {
    longitude: -122.4,
    latitude: 37.78,
    zoom: 11,
  },
  // seguramente no se necesite
  onViewStateChange: ({ viewState }) => deckgl.setProps({ viewState }),
  // --------------------
  layerFilter: ({ layer, viewport }) => viewport.id.startsWith(layer.id),
  layers: [
    new ScatterplotLayer({
      id: 'light',
      ...layerSettings,
      getFillColor: [255, 140, 0],
      getLineColor: [0, 0, 0],
    }),

    new ScatterplotLayer({
      id: 'dark',
      ...layerSettings,
      getFillColor: [0, 115, 255],
      getLineColor: [255, 255, 255],
    }),
  ],
});

new Draggable(document.getElementById('handle'), {
  limit: {
    y: [0, 0],
  },
  onDrag: (_, x) => updateSplitLocation(x),
});

function updateSplitLocation(x) {
  const leftPercentage = (x * 100) / window.innerWidth;

  // Resize background divs
  //
  document.getElementById('bg-light').style.width = `${leftPercentage}%`;
  document.getElementById('bg-dark').style.left = `${leftPercentage}%`;

  // Calculate new view state
  const viewport = deckgl.getViewports()[0];
  const newCenter = viewport.unproject([x, viewport.height / 2]);

  // dispatch(setViewState(...))
  deckgl.setProps({
    viewState: {
      longitude: newCenter[0],
      latitude: newCenter[1],
      zoom: viewport.zoom,
      pitch: viewport.pitch,
      bearing: viewport.bearing,
    },
    views: getViews(leftPercentage),
  });
}

// views deberia usar useState
function getViews(leftPercentage = 50) {
  return [
    new MapView({
      id: 'light-view',
      x: 0,
      width: `${leftPercentage}%`,
      padding: { left: '100%' },
      controller: true,
    }),
    new MapView({
      id: 'dark-view',
      x: `${leftPercentage}%`,
      width: `${100 - leftPercentage}%`,
      padding: { right: '100%' },
      controller: true,
    }),
  ];
}
