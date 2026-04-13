import { useState, useEffect } from 'react';
import FHIR from 'fhirclient';
import { CssBaseline, ThemeProvider, createTheme, Box, CircularProgress, Typography } from '@mui/material';
import SelectSite from './pages/SelectSite';
import Explorer from './pages/Explorer';
import { getSite, getSession, setSession } from './lib/storage';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function Root() {
  const [session, setSessionState] = useState(getSession);
  const site = getSite();
  const hasCode = new URLSearchParams(window.location.search).has('code');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return;

    // Guard against React Strict Mode double-invocation
    if (code === window.__lastFhirCode) return;
    window.__lastFhirCode = code;

    FHIR.oauth2.ready()
      .then((client) => {
        const token = client.state.tokenResponse;
        const sess = {
          accessToken: token.access_token,
          serverUrl: client.state.serverUrl,
          patient: token.patient ?? null,
          expiresAt: token.expires_in
            ? Date.now() + token.expires_in * 1000
            : null,
        };
        setSession(sess);
        setSessionState(sess);
        window.history.replaceState({}, '', '/');
      })
      .catch(console.error);
  }, []);

  if (hasCode && !session) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress />
        <Typography color="text.secondary">Completing sign-in…</Typography>
      </Box>
    );
  }

  if (site && session) return <Explorer />;
  return <SelectSite />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root />
    </ThemeProvider>
  );
}
