import { useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
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
  const savedCustom = (() => { try { return JSON.parse(localStorage.getItem('spex_custom')) ?? {}; } catch { return {}; } })();
  const [customClientId, setCustomClientId] = useState(savedCustom.clientId ?? '');
  const [customIss, setCustomIss] = useState(savedCustom.iss ?? '');
  const [customScope, setCustomScope] = useState(savedCustom.scope ?? 'patient/*.read patient/*.search');

  function authorize(site) {
    setAuthorizing(true);
    setError(null);
    setSite(site);
    let url =
      '/launch.html?client=' + encodeURIComponent(site.clientId) +
      '&iss=' + encodeURIComponent(site.iss);
    if (site.type) url += '&type=' + encodeURIComponent(site.type);
    if (site.scope) url += '&scope=' + encodeURIComponent(site.scope);
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

        <Divider>
          <Typography variant="body2" color="text.secondary">or use a custom server</Typography>
        </Divider>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Client ID"
            size="small"
            value={customClientId}
            onChange={(e) => setCustomClientId(e.target.value)}
            disabled={authorizing}
            fullWidth
          />
          <TextField
            label="ISS URL"
            size="small"
            placeholder="https://fhir.example.com/r4"
            value={customIss}
            onChange={(e) => setCustomIss(e.target.value)}
            disabled={authorizing}
            fullWidth
          />
          <TextField
            label="Scopes"
            size="small"
            value={customScope}
            onChange={(e) => setCustomScope(e.target.value)}
            disabled={authorizing}
            fullWidth
            helperText="openid launch/patient profile are always included"
          />
          <Button
            variant="outlined"
            size="large"
            disabled={!customClientId.trim() || !customIss.trim() || authorizing}
            onClick={() => {
              const clientId = customClientId.trim();
              const iss = customIss.trim();
              const scope = customScope.trim();
              localStorage.setItem('spex_custom', JSON.stringify({ clientId, iss, scope }));
              const label = (() => { try { return new URL(iss).hostname; } catch { return iss; } })();
              authorize({ clientId, iss, label, scope });
            }}
            startIcon={authorizing ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {authorizing ? 'Redirecting to login…' : 'Connect to custom server'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
