import { useSelector } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';

export const PLOTS_LAYER_ID = 'plotsLayer';

export default function PlotsLayer() {
  const { plotsLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) => selectSourceById(state, plotsLayer?.source));
  const cartoLayerProps = useCartoLayerProps({ source });

  const fillColor = [241, 109, 122, 0];
  const lineColor = [255, 255, 255];
  if (plotsLayer && source) {
    return [
      new CartoLayer({
        ...cartoLayerProps,
        id: 'PlanetQ32019_' + PLOTS_LAYER_ID,
        getFillColor: fillColor,
        pointRadiusMinPixels: 2,
        getLineColor: lineColor,
        lineWidthMinPixels: 2,
        pickable: true,
        // onTileLoad: (tile) => {
        //   if (tile) {
        //     const {x, y, z} = tile.index;
        //     console.log(`Loading tile: x: ${x}, y: ${y}, z: ${z}`);
        //   }
        //   return null;
        // },
        onHover: (info) => {
          if (info?.object) {
            info.object = {
              html: htmlForFeature({ feature: info.object }),
              style: {},
            };
          }
        },
      }),
      new CartoLayer({
        ...cartoLayerProps,
        id: 'PlanetQ32023_' + PLOTS_LAYER_ID,
        getFillColor: fillColor,
        pointRadiusMinPixels: 2,
        getLineColor: lineColor,
        lineWidthMinPixels: 2,
        pickable: true,
        onHover: (info) => {
          if (info?.object) {
            info.object = {
              html: htmlForFeature({ feature: info.object }),
              style: {},
            };
          }
        },
      }),
    ];
  }
}
