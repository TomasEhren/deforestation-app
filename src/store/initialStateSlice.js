import { VOYAGER } from '@carto/react-basemaps';
import { API_VERSIONS } from '@deck.gl/carto';

export const initialState = {
  viewState: {
    //longitude: 32.03833,
    //latitude: 0.47374,
    longitude: 31.95435,
    latitude: 0.247478,
    zoom: 14.5,
    pitch: 0,
    bearing: 0,
    dragRotate: false,
  },
  basemap: VOYAGER,
  credentials: {
    apiVersion: API_VERSIONS.V3,
    apiBaseUrl: 'https://gcp-us-east1.api.carto.com',
  },
  googleApiKey: '', // only required when using a Google Basemap
  googleMapId: '', // only required when using a Google Custom Basemap
  accountsUrl: 'http://app.carto.com/',
  oauth: {
    namespace: 'http://app.carto.com/',
    domain: 'auth.carto.com',
    clientId: 'ytrfhBXwAv9zsW5PK55uHca4Qp2psGPg', // type here your application clientId
    organizationId: '', // organizationId is required for SSO
    scopes: [
      'read:current_user',
      'update:current_user',
      'read:connections',
      'write:connections',
      'read:maps',
      'write:maps',
      'read:account',
      'admin:account',
    ],
    audience: 'carto-cloud-native-api',
    authorizeEndPoint: 'https://carto.com/oauth2/authorize', // only valid if keeping https://localhost:3000/oauthCallback
  },
};
