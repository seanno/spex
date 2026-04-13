import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import { getSite } from '../lib/storage';

export default function TopBar({ onReset }) {
  const site = getSite();

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <LocalHospitalIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mr: 1 }}>
          SPEX
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, flexGrow: 1 }}>
          {site?.label ?? ''}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {site?.type && (
            <Typography
              variant="caption"
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                px: 1,
                py: 0.25,
                borderRadius: 1,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {site.type}
            </Typography>
          )}
          <Button
            color="inherit"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={onReset}
            sx={{ ml: 1 }}
          >
            Reset
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
