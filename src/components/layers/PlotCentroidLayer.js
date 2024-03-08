import { useSelector } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';

export const PLOT_CENTROID_LAYER_ID = 'plotCentroidLayer';

export default function PlotCentroidLayer() {
  const { plotCentroidLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) => selectSourceById(state, plotCentroidLayer?.source));
  const cartoLayerProps = useCartoLayerProps({ source });

  if (plotCentroidLayer && source) {
    return [
      new CartoLayer({
        ...cartoLayerProps,
        id: 'PlanetQ32019_' + PLOT_CENTROID_LAYER_ID,
        getFillColor: [241, 109, 122],
        pointRadiusMinPixels: 2,
        getLineColor: [255, 0, 0],
        lineWidthMinPixels: 1,
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
        id: 'PlanetQ32023_' + PLOT_CENTROID_LAYER_ID,
        getFillColor: [241, 109, 122],
        pointRadiusMinPixels: 2,
        getLineColor: [255, 0, 0],
        lineWidthMinPixels: 1,
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
