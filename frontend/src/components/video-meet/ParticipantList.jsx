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
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

export default function ParticipantList({
  participants,
  onMute,
  onRemove,
  onClose,
  isHost = false, // Assuming we'll pass this prop later
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
          <Typography variant="h6">Participants</Typography>
          <Badge
            badgeContent={participants.length}
            color="primary"
            sx={{ ml: 1 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ flex: 1, overflow: "auto", p: 0 }}>
        {participants.map((participant) => (
          <ListItem
            key={participant.socketId || participant.id}
            secondaryAction={
              isHost && ( // Only show controls if host (logic to be refined)
                <Box>
                  <Tooltip title={participant.muted ? "Unmute" : "Mute"}>
                    <IconButton
                      edge="end"
                      aria-label="mute"
                      onClick={() => onMute(participant.socketId || participant.id)}
                      size="small"
                      color={participant.muted ? "error" : "default"}
                    >
                      {participant.muted ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove">
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => onRemove(participant.socketId || participant.id)}
                      size="small"
                      color="error"
                    >
                      <RemoveCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            }
            sx={{
              "&:hover": {
                bgcolor: alpha(theme.palette.action.hover, 0.1),
              },
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={600}>
                  {participant.username || participant.name || "Guest"}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {participant.inWaitingRoom ? "Waiting..." : "Active"}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
