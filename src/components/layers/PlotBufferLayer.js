import { useSelector } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';

export const PLOT_BUFFER_LAYER_ID = 'plotBufferLayer';

export default function PlotBufferLayer() {
  const { plotBufferLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) => selectSourceById(state, plotBufferLayer?.source));
  const cartoLayerProps = useCartoLayerProps({ source });
  const fillColor = [241, 109, 122, 0];
  const lineColor = [255, 255, 255];

  if (plotBufferLayer && source) {
    return [
      new CartoLayer({
        ...cartoLayerProps,
        id: 'PlanetQ32019_' + PLOT_BUFFER_LAYER_ID,
        getFillColor: fillColor,
        pointRadiusMinPixels: 1,
        getLineColor: lineColor,
        lineWidthMinPixels: 0.5,
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
      new CartoLayer({
        ...cartoLayerProps,
        id: 'PlanetQ32023_' + PLOT_BUFFER_LAYER_ID,
        getFillColor: fillColor,
        pointRadiusMinPixels: 1,
        getLineColor: lineColor,
        lineWidthMinPixels: 0.5,
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
