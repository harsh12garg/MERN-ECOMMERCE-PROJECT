import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete, Devices, Computer, PhoneAndroid, Tablet } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/auth/sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await api.delete(`/auth/sessions/${sessionId}`);
      toast.success('Session revoked successfully');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to revoke session');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await api.post('/auth/logout-all');
      toast.success('Logged out from all devices');
      window.location.href = '/login';
    } catch (error) {
      toast.error('Failed to logout from all devices');
    }
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Mobile':
        return <PhoneAndroid />;
      case 'Tablet':
        return <Tablet />;
      default:
        return <Computer />;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Active Sessions</Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setOpenDialog(true)}
        >
          Logout All Devices
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Manage your active sessions across different devices. You can revoke access from any device.
      </Alert>

      <Paper>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>Loading...</Box>
        ) : sessions.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No active sessions</Typography>
          </Box>
        ) : (
          <List>
            {sessions.map((session, index) => (
              <ListItem
                key={session._id}
                divider={index < sessions.length - 1}
                sx={{ py: 2 }}
              >
                <Box sx={{ mr: 2 }}>
                  {getDeviceIcon(session.deviceInfo.device)}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {session.deviceInfo.browser} on {session.deviceInfo.os}
                      </Typography>
                      <Chip
                        label={session.deviceInfo.device}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        IP: {session.deviceInfo.ip}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last active: {new Date(session.lastActivity).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleRevokeSession(session._id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Logout from All Devices?</DialogTitle>
        <DialogContent>
          <Typography>
            This will log you out from all devices including this one. You'll need to login again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleLogoutAll} color="error" variant="contained">
            Logout All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SessionsPage;
