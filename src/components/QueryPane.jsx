import { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getSession } from '../lib/storage';

export default function QueryPane({ onResult, onError }) {
  const session = getSession();
  const [query, setQuery] = useState(
    session?.patient ? `Patient/${session.patient}` : ''
  );
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  async function runQuery() {
    if (!query.trim()) return;
    setLoading(true);
    onError(null);
    onResult(null);

    const url = session.serverUrl.replace(/\/?$/, '/') + query.trimStart().replace(/^\//, '');

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: 'application/fhir+json, application/json',
        },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { _raw: text };
      }

      if (!response.ok) {
        onError(`HTTP ${response.status} ${response.statusText}`);
      }
      onResult(data);
    } catch (err) {
      onError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) runQuery();
  }

  function insertPatientId() {
    const insert = session.patient;
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? query.length;
    const end = el.selectionEnd ?? query.length;
    const next = query.slice(0, start) + insert + query.slice(end);
    setQuery(next);
    // Restore focus and place cursor after inserted text
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + insert.length, start + insert.length);
    });
  }

  const baseUrl = session?.serverUrl ?? '';

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', gap: 4, mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Base URL: {baseUrl}
        </Typography>
        {session?.patient && (
          <Typography
            variant="caption"
            color="text.secondary"
            onClick={insertPatientId}
            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          >
            Patient ID: {session.patient}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Patient/123  or  Observation?patient=123"
          disabled={loading}
          inputRef={inputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={runQuery}
          disabled={!query.trim() || loading}
          sx={{ minWidth: 90, whiteSpace: 'nowrap' }}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Running…' : 'Query'}
        </Button>
      </Box>
    </Box>
  );
}
