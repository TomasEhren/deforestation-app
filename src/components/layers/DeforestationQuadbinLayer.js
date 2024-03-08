import { useSelector } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';

export const DEFORESTATION_QUADBIN_LAYER_ID = 'deforestationQuadbinLayer';

export default function DeforestationQuadbinLayer() {
  const { deforestationQuadbinLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) =>
    selectSourceById(state, deforestationQuadbinLayer?.source)
  );
  const cartoLayerProps = useCartoLayerProps({ source });

  if (deforestationQuadbinLayer && source) {
    return [
      new CartoLayer({
        ...cartoLayerProps,
        id: 'PlanetQ32019_' + DEFORESTATION_QUADBIN_LAYER_ID,
        geoColumn: 'quadbin',
        getFillColor: [250, 255, 158, 255 * 0.4],
        pointRadiusMinPixels: 2,
        getLineColor: [255, 0, 0, 0],
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
        id: 'PlanetQ32023_' + DEFORESTATION_QUADBIN_LAYER_ID,
        geoColumn: 'quadbin',
        getFillColor: [250, 255, 158, 255 * 0.4],
        pointRadiusMinPixels: 2,
        getLineColor: [255, 0, 0, 0],
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
