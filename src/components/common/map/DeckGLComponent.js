import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { useSelector } from 'react-redux';
import { useTheme, useMediaQuery } from '@mui/material';
import { BASEMAPS } from '@carto/react-basemaps';
import { Map } from 'react-map-gl/maplibre';
import { useMapHooks } from './useMapHooks';
import Draggable from 'react-draggable';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setViewState } from '@carto/react-redux';
import sliderLogo from '/src/assets/img/left-and-right.png';

export default function DeckGLComponent({ layers }) {
  console.log(layers);
  const dispatch = useDispatch();
  const { viewState } = useSelector((state) => state.carto);
  const basemap = useSelector((state) => BASEMAPS[state.carto.basemap]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    handleCursor,
    handleHover,
    handleSizeChange,
    handleTooltip,
    handleViewStateChange,
  } = useMapHooks();

  const [verticalLineX, setVerticalLineX] = useState(0);
  const [bounds, setBounds] = useState({ left: 175, right: window.innerWidth });
  const [controller, setController] = useState(true);

  const mapContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const leftPercentage =
    verticalLineX == 0 || containerWidth == 0
      ? 50
      : ((containerWidth / 2 + verticalLineX) / containerWidth) * 100;

  const deckRef = useRef();

  useEffect(() => {
    // Update the slider bounds when the component mounts
    if (mapContainerRef.current) {
      const divWidth = mapContainerRef.current.clientWidth;
      setBounds({ left: -divWidth / 2 + 20, right: divWidth / 2 - 20 });
      setContainerWidth(divWidth);
    }
  }, []);

  const views = [
    new MapView({
      id: 'PlanetQ32019',
      x: 0,
      width: `${leftPercentage}%`,
      padding: { left: '100%' },
      controller: controller,
    }),
    new MapView({
      id: 'PlanetQ32023',
      x: `${leftPercentage}%`,
      width: `${100 - leftPercentage}%`,
      padding: { right: '100%' },
      controller: controller,
    }),
  ];

  const slider = (
    <Draggable
      axis='x'
      handle='#logo'
      bounds={bounds}
      onDrag={(e, { deltaX, x }) => {
        setVerticalLineX(x);

        // Calculate new center coordinates
        const viewport = deckRef.current.deck.getViewports()[0];
        const newCenter = viewport.unproject([
          containerWidth / 2 + x,
          viewport.height / 2,
        ]);

        dispatch(
          setViewState({
            ...viewState,
            longitude: newCenter[0],
            latitude: newCenter[1],
          })
        );
      }}
    >
      <div
        style={{
          position: 'absolute',
          background: '#fafafa',
          zIndex: 9000,
          width: '2px',
          height: '100%',
          left: '50%',
        }}
      >
        <img
          src={sliderLogo}
          alt='Logo'
          id='logo'
          draggable={false}
          style={{
            cursor: 'col-resize',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
          }}
        />
      </div>
    </Draggable>
  );

  // const layerFilter = ({ layer, viewport, renderPass }) => {
  //   // console.log(`Rendering layer ${layer.id} for viewport ${viewport.id}. Render pass: ${renderPass}`);
  //   if (layer.id.startsWith(viewport.id)) {
  //     return true;
  //   }
    
  //   return false;
  // }

  // function getTooltip({tile}) {
  //   if (tile) {
  //     const {x, y, z} = tile.index;
  //     return `tile: x: ${x}, y: ${y}, z: ${z}`;
  //   }
  //   return null;
  // }

  return (
    <div ref={mapContainerRef}>
      {slider}
      <DeckGL
        ref={deckRef}
        views={views}
        layerFilter={({ layer, viewport }) => layer.id.startsWith(viewport.id)}
        viewState={{ ...viewState }}
        controller={controller}
        layers={layers}
        onViewStateChange={handleViewStateChange}
        onResize={handleSizeChange}
        onHover={handleHover}
        getCursor={handleCursor}
        getTooltip={handleTooltip}
        // getTooltip={getTooltip}
        pickingRadius={isMobile ? 10 : 0}
      >
        <Map reuseMaps mapStyle={basemap.options.mapStyle} styleDiffing={false} />
        {/* <MapView id="PlanetQ32019">
          <Map reuseMaps mapStyle={basemap.options.mapStyle} styleDiffing={false} />
        </MapView>
        <MapView id="PlanetQ32023">
          <Map reuseMaps mapStyle={basemap.options.mapStyle.replace("voyager", "dark-matter")} styleDiffing={false} />
        </MapView> */}
      </DeckGL>
    </div>
  );
}
