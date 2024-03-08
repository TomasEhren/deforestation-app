import { MAP_TYPES } from '@deck.gl/carto';

const PLOTS_SOURCE_ID = 'plotsSource';

const source = {
  id: PLOTS_SOURCE_ID,
  type: MAP_TYPES.QUERY,
  connection: 'se-bigquery',
  data: `select geom from cartodb-gcp-solutions-eng-team.deforestation_app.nkg_plots_clean`,
};

export default source;
