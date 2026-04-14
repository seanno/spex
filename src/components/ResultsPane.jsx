import { Box, Typography, Alert, Paper, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function downloadJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fhir-result.json';
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResultsPane({ result, error }) {
  if (!result && !error) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Typography color="text.disabled" variant="body2">
          Enter a FHIR query above and press Query to see results.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, position: 'relative' }}>
      {result && (
        <Tooltip title="Download JSON">
          <IconButton
            size="small"
            onClick={() => downloadJson(result)}
            sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, bgcolor: '#2d2d2d', color: '#d4d4d4', '&:hover': { bgcolor: '#3d3d3d' } }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {result && (
        <Paper
          variant="outlined"
          component="pre"
          sx={{
            m: 0,
            p: 2,
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowX: 'auto',
            bgcolor: '#1e1e1e',
            color: '#d4d4d4',
            borderColor: '#333',
          }}
        >
          {JSON.stringify(result, null, 2)}
        </Paper>
      )}
    </Box>
  );
}
