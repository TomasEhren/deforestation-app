import DeckGL from '@deck.gl/react';
import { BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import { useSelector, useDispatch } from 'react-redux';
import { selectSourceById, updateLayer } from '@carto/react-redux';

export const PlanetQ32019_ID = 'PlanetQ32019';
const layerConfig = {
  title: 'Planet Global Mosaic Q3 2019',
  visible: true,
  legend: {},
};

let url =
  'https://tiles.planet.com/basemaps/v1/planet-tiles/global_quarterly_2019q3_mosaic/gmap/{z}/{x}/{y}.png?api_key=PLAK6679039df83f414faf798ba4ad4530db';

export default function PlanetQ32019() {
  const { PlanetQ32019Layer } = useSelector((state) => state.carto.layers);
  let visible;
  if (PlanetQ32019Layer) {
    visible = PlanetQ32019Layer.visible;
  } else {
    visible = true;
  }

  const dispatch = useDispatch();
  return new TileLayer({
    id: PlanetQ32019_ID,
    data: url,
    minZoom: 0,
    maxZoom: 20,
    tileSize: 256,
    visible: visible,
    onTileLoad: (data) => {
      dispatch(
        updateLayer({
          id: PlanetQ32019_ID,
          layerAttributes: { ...layerConfig },
        })
      );
      //cartoLayerProps.onDataLoad(data);
    },
    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });
}
