import { MAP_TYPES } from '@deck.gl/carto';

const PLOT_BUFFER_SOURCE_ID = 'plotBufferSource';

const source = {
  id: PLOT_BUFFER_SOURCE_ID,
  type: MAP_TYPES.QUERY,
  connection: 'se-bigquery',
  data: `select * from cartodb-gcp-solutions-eng-team.deforestation_app.nkg_plots_clean_extracted`,
};

export default source;
