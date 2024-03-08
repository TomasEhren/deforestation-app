import PlanetQ32023 from './PlanetQ32023';
import PlanetQ32019 from './PlanetQ32019';
import PlotsLayer from './PlotsLayer';
import PlotCentroidLayer from './PlotCentroidLayer';
import PlotBufferLayer from './PlotBufferLayer';
import DeforestationQuadbinLayer from './DeforestationQuadbinLayer';
// [hygen] Import layers

export const getLayers = () => {
  return [
    PlanetQ32023(),
    PlanetQ32019(),
    PlotsLayer(),
    // PlotCentroidLayer(),
    PlotBufferLayer(),
    DeforestationQuadbinLayer(),
    // [hygen] Add layer
  ].flat();
};
