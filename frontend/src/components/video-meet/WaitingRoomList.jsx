import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  Paper,
  Tooltip,
  Badge,
  alpha,
  useTheme,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";

export default function WaitingRoomList({
  waitingParticipants,
  onAdmit,
  onDeny,
  onClose,
}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={8}
      sx={{
        height: "100%",
        width: 320,
        display: "flex",
        flexDirection: "column",
        borderRadius: 0,
        borderLeft: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6">Waiting Room</Typography>
          <Badge
            badgeContent={waitingParticipants.length}
            color="warning"
            sx={{ ml: 1 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ flex: 1, overflow: "auto", p: 0 }}>
        {waitingParticipants.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">No one is waiting.</Typography>
          </Box>
        ) : (
          waitingParticipants.map((participant) => (
            <ListItem
              key={participant.socketId}
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                p: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600}>
                      {participant.username || "Guest"}
                    </Typography>
                  }
                  secondary="Wants to join..."
                />
              </Box>
              
              <Box sx={{ display: "flex", gap: 1, width: "100%", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={() => onDeny(participant.socketId)}
                >
                  Deny
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => onAdmit(participant.socketId)}
                >
                  Admit
                </Button>
              </Box>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
}
