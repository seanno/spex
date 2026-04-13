import { useState } from 'react';
import { Box } from '@mui/material';
import TopBar from '../components/TopBar';
import QueryPane from '../components/QueryPane';
import ResultsPane from '../components/ResultsPane';
import { clearAll } from '../lib/storage';

export default function Explorer() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleReset() {
    clearAll();
    window.location.assign('/');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar onReset={handleReset} />
      <QueryPane onResult={setResult} onError={setError} />
      <ResultsPane result={result} error={error} />
    </Box>
  );
}
