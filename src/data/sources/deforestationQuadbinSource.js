import { MAP_TYPES } from '@deck.gl/carto';

const DEFORESTATION_QUADBIN_SOURCE_ID = 'deforestationQuadbinSource';

const source = {
  id: DEFORESTATION_QUADBIN_SOURCE_ID,
  type: MAP_TYPES.QUERY,
  connection: 'se-bigquery',
  data: `select pixel as quadbin, band_1 as lossyear from cartodb-gcp-solutions-eng-team.deforestation_app.nkg_plots_deforestation_related_pixels_v2 where band_1 >= 20`,
};

export default source;
