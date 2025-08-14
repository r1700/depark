import React from 'react';
import { Box, Button, Switch, Typography } from '@mui/material';

interface ControlWithToggleProps {
  title: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  onOpenPanel: () => void;
  sx?: object;
}

const ControlWithToggle: React.FC<ControlWithToggleProps> = ({ title, enabled, setEnabled, onOpenPanel, sx }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...sx }}>
      <Button variant="contained" fullWidth onClick={onOpenPanel} sx={{ mb: 1 }}>
        {title}
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography>{enabled ? `${title} Enabled` : `${title} Disabled`}</Typography>
        <Switch checked={enabled} onChange={() => setEnabled(!enabled)} color="primary" />
      </Box>
    </Box>
  );
};

export default ControlWithToggle;