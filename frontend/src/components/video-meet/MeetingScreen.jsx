import React, { useEffect, useRef } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  CircularProgress,
  Paper,
  TextField,
  Badge,
  useTheme,
  alpha,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import CallEndIcon from "@mui/icons-material/CallEnd";
import PeopleIcon from "@mui/icons-material/People";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { motion, AnimatePresence } from "framer-motion";

export default function MeetingScreen({
  localVideoRef,
  videos,
  participants,
  video,
  audio,
  screen,
  screenAvailable,
  showChat,
  setShowChat,
  messages,
  newMessages,
  message,
  setMessage,
  sendMessage,
  onVideoToggle,
  onAudioToggle,
  onScreenToggle,
  onEndCall,
  meetingInfo,
  onCopyCode,
  connectionStatus,
}) {
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  const socketIdRef = useRef(); // This might need to be passed as prop if used for styling chat messages

  // Wait, socketIdRef.current is used in the original code to style chat messages (mine vs others).
  // But it's a ref from the parent component.
  // I should check if socketIdRef is available in MeetingScreen props.
  // Looking at VideoMeet.jsx: socketIdRef.current is used in `messages.map`.
  // The original code passed `socketIdRef` implicitly? No, it was in the closure.
  // I need to pass `socketId` as a prop to MeetingScreen.

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Top Bar */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ bgcolor: "#2a2a2a" }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <VideocamIcon />
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ color: "white", fontWeight: 600 }}
              >
                {meetingInfo.code}
              </Typography>
              <Typography variant="caption" sx={{ color: alpha("#fff", 0.7) }}>
                Started at {formatTime(meetingInfo.startedAt)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              icon={<PeopleIcon />}
              label={`${participants.length + 1} participants`}
              sx={{ color: "white", borderColor: alpha("#fff", 0.3) }}
              variant="outlined"
            />

            <Tooltip title="Copy meeting code">
              <IconButton onClick={onCopyCode} sx={{ color: "white" }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>

            {connectionStatus === "connected" ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="Connected"
                color="success"
                size="small"
              />
            ) : (
              <Chip
                icon={<CircularProgress size={16} />}
                label="Connecting..."
                color="warning"
                size="small"
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Video Grid */}
        <Box sx={{ flex: 1, p: 2, position: "relative", overflow: "auto" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${
                videos.length > 2 ? "300px" : "400px"
              }, 1fr))`,
              gap: 2,
              height: "100%",
            }}
          >
            {/* Local Video */}
            <Paper
              elevation={4}
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "#2a2a2a",
                aspectRatio: "16/9",
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scaleX(-1)",
                }}
              />

              {/* Username overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  bgcolor: alpha("#000", 0.6),
                  color: "white",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: "0.875rem",
                }}
              >
                You {!video && "(Camera Off)"} {!audio && "(Muted)"}
              </Box>

              {/* Status badges */}
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 1,
                }}
              >
                {!video && (
                  <Chip
                    icon={<VideocamOffIcon />}
                    label=""
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.9),
                      color: "white",
                    }}
                  />
                )}
                {!audio && (
                  <Chip
                    icon={<MicOffIcon />}
                    label=""
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.9),
                      color: "white",
                    }}
                  />
                )}
                {screen && (
                  <Chip
                    icon={<ScreenShareIcon />}
                    label="Screen"
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.9),
                      color: "white",
                    }}
                  />
                )}
              </Box>
            </Paper>

            {/* Remote Videos */}
            {videos.map((video) => (
              <Paper
                key={video.socketId}
                elevation={4}
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  bgcolor: "#2a2a2a",
                  aspectRatio: "16/9",
                }}
              >
                <video
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    bgcolor: alpha("#000", 0.6),
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: "0.875rem",
                  }}
                >
                  {participants.find((p) => p.id === video.socketId)?.name ||
                    "Participant"}
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Chat Drawer */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                    borderBottom: `1px solid ${alpha(
                      theme.palette.divider,
                      0.1
                    )}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">Chat</Typography>
                    <IconButton onClick={() => setShowChat(false)} size="small">
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
                  {messages.map((msg, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        display: "flex",
                        justifyContent:
                          // Check if msg.socketId is the same as the current user's socketId
                          // Wait, I need to know the current user's socketId to distinguish sent messages.
                          // msg.socketId === socketIdRef.current ? "flex-end" : "flex-start"
                          // I'll need to pass the current socketId as a prop.
                          msg.isLocal ? "flex-end" : "flex-start",
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          maxWidth: "80%",
                          bgcolor: msg.isLocal
                            ? theme.palette.primary.main
                            : alpha(theme.palette.primary.main, 0.1),
                          color: msg.isLocal ? "white" : "text.primary",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, display: "block" }}
                        >
                          {msg.sender}
                        </Typography>
                        <Typography variant="body2">{msg.data}</Typography>
                      </Paper>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <IconButton
                      color="primary"
                      onClick={sendMessage}
                      disabled={!message.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Bottom Controls */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#2a2a2a",
          display: "flex",
          justifyContent: "center",
          gap: 2,
          position: "relative",
        }}
      >
        <Tooltip title={video ? "Turn off camera" : "Turn on camera"}>
          <IconButton
            onClick={onVideoToggle}
            sx={{
              bgcolor: video ? alpha("#fff", 0.1) : theme.palette.error.main,
              color: "white",
              "&:hover": {
                bgcolor: video ? alpha("#fff", 0.2) : theme.palette.error.dark,
              },
              width: 56,
              height: 56,
            }}
          >
            {video ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title={audio ? "Mute" : "Unmute"}>
          <IconButton
            onClick={onAudioToggle}
            sx={{
              bgcolor: audio ? alpha("#fff", 0.1) : theme.palette.error.main,
              color: "white",
              "&:hover": {
                bgcolor: audio ? alpha("#fff", 0.2) : theme.palette.error.dark,
              },
              width: 56,
              height: 56,
            }}
          >
            {audio ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
        </Tooltip>

        {screenAvailable && (
          <Tooltip title={screen ? "Stop sharing" : "Share screen"}>
            <IconButton
              onClick={onScreenToggle}
              sx={{
                bgcolor: screen
                  ? theme.palette.success.main
                  : alpha("#fff", 0.1),
                color: "white",
                "&:hover": {
                  bgcolor: screen
                    ? theme.palette.success.dark
                    : alpha("#fff", 0.2),
                },
                width: 56,
                height: 56,
              }}
            >
              {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={showChat ? "Close chat" : "Open chat"}>
          <Badge badgeContent={newMessages} color="error">
            <IconButton
              onClick={() => setShowChat(!showChat)}
              sx={{
                bgcolor: showChat
                  ? theme.palette.primary.main
                  : alpha("#fff", 0.1),
                color: "white",
                "&:hover": {
                  bgcolor: showChat
                    ? theme.palette.primary.dark
                    : alpha("#fff", 0.2),
                },
                width: 56,
                height: 56,
              }}
            >
              <ChatIcon />
            </IconButton>
          </Badge>
        </Tooltip>

        <Tooltip title="End call">
          <IconButton
            onClick={onEndCall}
            sx={{
              bgcolor: theme.palette.error.main,
              color: "white",
              "&:hover": { bgcolor: theme.palette.error.dark },
              width: 56,
              height: 56,
            }}
          >
            <CallEndIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
