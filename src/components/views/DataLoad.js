import {
  Grid,
  Typography,
  TextField,
  Button,
  Container,
  Box,
  CircularProgress,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorIcon from '@mui/icons-material/Error';
import { useState, useRef } from 'react';
import deforestationQuadbinSource from 'data/sources/deforestationQuadbinSource';
import { DEFORESTATION_QUADBIN_LAYER_ID } from 'components/layers/DeforestationQuadbinLayer';
import plotBufferSource from 'data/sources/plotBufferSource';
import { PLOT_BUFFER_LAYER_ID } from 'components/layers/PlotBufferLayer';
import plotCentroidSource from 'data/sources/plotCentroidSource';
import { PLOT_CENTROID_LAYER_ID } from 'components/layers/PlotCentroidLayer';
import { useEffect } from 'react';
import plotsSource from 'data/sources/plotsSource';
import { PLOTS_LAYER_ID } from 'components/layers/PlotsLayer';
import { useDispatch } from 'react-redux';
import { addLayer, removeLayer, addSource, removeSource } from '@carto/react-redux';

export default function DataLoad() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(addSource(plotsSource));

    dispatch(
      addLayer({
        id: PLOTS_LAYER_ID,
        source: plotsSource.id,
      })
    );

    return () => {
      dispatch(removeLayer(PLOTS_LAYER_ID));
      dispatch(removeSource(plotsSource.id));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(addSource(plotCentroidSource));

    dispatch(
      addLayer({
        id: PLOT_CENTROID_LAYER_ID,
        source: plotCentroidSource.id,
      })
    );

    return () => {
      dispatch(removeLayer(PLOT_CENTROID_LAYER_ID));
      dispatch(removeSource(plotCentroidSource.id));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(addSource(plotBufferSource));

    dispatch(
      addLayer({
        id: PLOT_BUFFER_LAYER_ID,
        source: plotBufferSource.id,
      }),
    );

    return () => {
      dispatch(removeLayer(PLOT_BUFFER_LAYER_ID));
      dispatch(removeSource(plotBufferSource.id));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(addSource(deforestationQuadbinSource));

    dispatch(
      addLayer({
        id: DEFORESTATION_QUADBIN_LAYER_ID,
        source: deforestationQuadbinSource.id,
      }),
    );

    return () => {
      dispatch(removeLayer(DEFORESTATION_QUADBIN_LAYER_ID));
      dispatch(removeSource(deforestationQuadbinSource.id));
    };
  }, [dispatch]);

  // [hygen] Add useEffect

  const allowedFileTypes = ['csv', 'json', 'kmz', 'kml', 'zip', 'geojson', 'parquet'];
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisName, setAnalysisName] = useState('');
  const [step, setStep] = useState({ step: null, status: null });
  const [running, setRunning] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setStep({ step: null, status: null });
    setRunning(false);
    setAnalysisName('');
  };

  const handleAnalysisNameChange = (event) => {
    setAnalysisName(event.target.value);
  };

  const uploadData = async () => {
    return new Promise(async (resolve, reject) => {
      setStep({ step: 'upload', status: 'running' });

      try {
        const apiUrl =
          'https://us-central1-cartodb-gcp-solutions-eng-team.cloudfunctions.net/deforestation_app_file_import';
        const fileName = selectedFile.name;
        const fileType = selectedFile.name.split('.').pop().toLowerCase();

        const reader = new FileReader();

        reader.onload = async (event) => {
          const fileData = event.target.result;

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName,
              fileType,
              analysisName,
              fileData: fileData.split(',')[1], // Extract base64 data
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('File uploaded successfully', data);
            setStep({ step: 'upload', status: 'done' });
            resolve(data);
          } else {
            console.error('Error uploading file');
            setStep({ step: 'upload', status: 'error' });
            reject('Error uploading file');
          }
        };

        reader.readAsDataURL(selectedFile);
      } catch (error) {
        setStep({ step: 'upload', status: 'error' });
        console.error('Error:', error);
        reject('Error uploading file');
      }
    });
  };

  const runAnalysis = async () => {
    return new Promise(async (resolve, reject) => {
      // Simulate analysis running delay (replace this with your actual analysis logic)
      setStep({ step: 'analysis', status: 'running' });
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/ditto`);
        if (!response.ok) {
          //throw new Error('Network response was not ok.');
          reject('Network response was not ok.');
        }
        const data = await response.json();
        console.log('analysis', data);
        setStep({ step: 'analysis', status: 'done' });
        resolve(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setStep({ step: 'analysis', status: 'error' });
        reject('Failed to fetch data');
        // throw new Error('Failed to fetch data');
      }
    });
  };

  const loadResults = async () => {
    return new Promise(async (resolve, reject) => {
      // Simulate analysis running delay (replace this with your actual analysis logic)
      setStep({ step: 'load', status: 'running' });
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/ditto`);
        if (!response.ok) {
          //throw new Error('Network response was not ok.');
          reject('Network response was not ok.');
        }
        const data = await response.json();
        console.log('load', data);
        setStep({ step: 'load', status: 'done' });
        resolve(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setStep({ step: 'load', status: 'error' });
        reject('Failed to fetch data');
        // throw new Error('Failed to fetch data');
      }
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }
    setRunning(true);
    const tableId = await uploadData();
    const analysisStatus = await runAnalysis();
    const resultStatus = await loadResults();
    setRunning(false);
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };
  return (
    <Grid container direction='column' alignItems='center' spacing={2}>
      <Grid item>
        <Container>
          {/* File input */}
          <br />
          <Typography>Select a geospatial file to perform an analysis.</Typography>
          <Box mt={2} mb={2}>
            <Input
              type='file'
              onChange={handleFileChange}
              style={{ display: 'none' }}
              inputProps={{
                ref: fileInputRef,
                style: { fontSize: '16px' },
                accept: allowedFileTypes.map((type) => `.${type}`).join(','),
              }}
            />
          </Box>
          <Box mb={2}>
            <Button
              variant='contained'
              color='primary'
              onClick={openFileInput}
              style={{ fontSize: '16px' }}
              disabled={running}
            >
              Choose File
            </Button>
          </Box>

          <Box mb={2}>
            {selectedFile && (
              <Typography variant='subtitle1'>
                Selected File: {selectedFile.name}
              </Typography>
            )}
          </Box>
          {/* End file input */}
          {/* File description */}
          <Box mb={2}>
            <Typography variant='subtitle1'>
              Include a description for this analysis:
            </Typography>
            <TextField
              multiline
              placeholder='Analysis description'
              value={analysisName}
              onChange={handleAnalysisNameChange}
              disabled={!selectedFile || running}
              style={{ fontSize: '16px', width: '100%' }}
            />
          </Box>
          {/* End file description */}
          {/* File upload */}
          <Box mb={2}>
            <Button
              variant='contained'
              color='primary'
              onClick={handleUpload}
              disabled={!selectedFile || running}
              style={{ fontSize: '16px' }}
            >
              Run analysis
            </Button>
          </Box>
          {/* End file upload */}
          {running && (
            <List>
              <ListItem alignItems='flex-start'>
                <ListItemIcon>
                  {step.status === 'running' && <CircularProgress size={20} />}
                  {step.status === 'done' && <CheckCircleIcon color='success' />}
                  {step.status === 'error' && <ErrorIcon color='error' />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    step.step === 'upload'
                      ? 'Uploading data'
                      : step.step === 'analysis'
                      ? 'Performing Analysis'
                      : 'Loading results'
                  }
                />
              </ListItem>
            </List>
          )}
        </Container>
      </Grid>
    </Grid>
  );
}
