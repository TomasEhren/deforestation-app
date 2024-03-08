import { MAP_TYPES } from '@deck.gl/carto';

const PLOT_CENTROID_SOURCE_ID = 'plotCentroidSource';

const source = {
  id: PLOT_CENTROID_SOURCE_ID,
  type: MAP_TYPES.QUERY,
  connection: 'se-bigquery',
  data: `select st_centroid(geom) as geom from cartodb-gcp-solutions-eng-team.deforestation_app.nkg_plots_clean`,
};

export default source;
