import { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import endpoints from '../endpoints.json';
import { getSite, setSite } from '../lib/storage';

export default function SelectSite() {
  const existingSite = getSite();
  const [selected, setSelected] = useState(null);
  const [authorizing, setAuthorizing] = useState(false);
  const [error, setError] = useState(null);

  function authorize(site) {
    setAuthorizing(true);
    setError(null);
    setSite(site);
    const url =
      '/launch.html?client=' + encodeURIComponent(site.clientId) +
      '&iss=' + encodeURIComponent(site.iss);
    window.location.assign(url);
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalHospitalIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h4" component="h1" fontWeight={500}>
            SPEX
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          SMART FHIR Explorer — select your institution to get started.
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {existingSite && !authorizing && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Previously selected:
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => authorize(existingSite)}
              sx={{ justifyContent: 'flex-start', textTransform: 'none', py: 1.5 }}
            >
              Reconnect to {existingSite.label}
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5, mb: 0.5 }}
            >
              Or search for a different site:
            </Typography>
          </Box>
        )}

        <Autocomplete
          options={endpoints}
          getOptionLabel={(opt) => opt.label}
          filterOptions={(opts, { inputValue }) =>
            opts.filter((o) =>
              o.label.toLowerCase().includes(inputValue.toLowerCase())
            )
          }
          value={selected}
          onChange={(_, val) => setSelected(val)}
          disabled={authorizing}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for your institution"
              placeholder="Type to search..."
              variant="outlined"
            />
          )}
        />

        <Button
          variant="contained"
          size="large"
          disabled={!selected || authorizing}
          onClick={() => authorize(selected)}
          startIcon={authorizing ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {authorizing ? 'Redirecting to login…' : 'Connect'}
        </Button>
      </Box>
    </Container>
  );
}
