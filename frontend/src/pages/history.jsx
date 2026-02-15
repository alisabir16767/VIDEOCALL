import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Container,
  Paper,
  Fade,
  Skeleton,
  Alert,
  Snackbar,
  Chip,
  Stack,
  Avatar,
  useTheme,
  alpha,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HistoryIcon from "@mui/icons-material/History";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PeopleIcon from "@mui/icons-material/People";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const routeTo = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (error) {
        setSnackbarMessage("Failed to load meeting history");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getHistoryOfUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setSnackbarMessage("Meeting code copied to clipboard!");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      <Navbar />
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Fade in={true} timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative circles */}
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -40,
                  left: -40,
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />

              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <HistoryIcon sx={{ fontSize: 40 }} />
                    Meeting History
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                    View all your past meetings and recordings
                  </Typography>
                </Box>

                <Chip
                  label={`${meetings.length} Meetings`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1rem",
                    px: 2,
                  }}
                />
              </Box>
            </Paper>
          </Fade>

          {/* Loading Skeletons */}
          {loading && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 3,
              }}
            >
              {[1, 2, 3, 4].map((item) => (
                <Skeleton
                  key={item}
                  variant="rounded"
                  height={200}
                  sx={{ borderRadius: 4 }}
                  animation="wave"
                />
              ))}
            </Box>
          )}

          {/* Meetings Grid */}
          {!loading && (
            <AnimatePresence>
              {meetings.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "24px",
                  }}
                >
                  {meetings.map((meeting, index) => (
                    <motion.div
                      key={meeting.meetingCode}
                      variants={itemVariants}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: 4,
                          transition: "all 0.3s",
                          position: "relative",
                          overflow: "visible",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: `0 20px 30px -10px ${alpha(
                              theme.palette.primary.main,
                              0.3
                            )}`,
                            "& .copy-button": {
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        {/* Colored top bar */}
                        <Box
                          sx={{
                            height: 8,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                          }}
                        />

                        <CardContent sx={{ p: 3 }}>
                          {/* Meeting Icon and Code */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 3,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                width: 56,
                                height: 56,
                              }}
                            >
                              <VideocamIcon />
                            </Avatar>

                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <PeopleIcon sx={{ fontSize: 14 }} />
                                Meeting Code
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {meeting.meetingCode}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    copyToClipboard(meeting.meetingCode)
                                  }
                                  className="copy-button"
                                  sx={{
                                    opacity: { xs: 1, sm: 0 },
                                    transition: "opacity 0.2s",
                                    color: theme.palette.primary.main,
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>

                          {/* Date and Time */}
                          <Stack spacing={2}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <CalendarTodayIcon
                                  sx={{
                                    color: theme.palette.primary.main,
                                    fontSize: 20,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Date:
                                </Typography>
                              </Box>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {formatDate(meeting.date)}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <AccessTimeIcon
                                  sx={{
                                    color: theme.palette.secondary.main,
                                    fontSize: 20,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Time:
                                </Typography>
                              </Box>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {formatTime(meeting.date)}
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Status Chip */}
                          <Box
                            sx={{
                              mt: 3,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Chip
                              label="Completed"
                              size="small"
                              sx={{
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: theme.palette.success.main,
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                // Empty State
                <Fade in={true}>
                  <Paper
                    sx={{
                      gridColumn: "1 / -1",
                      p: 8,
                      textAlign: "center",
                      borderRadius: 4,
                      bgcolor: "background.paper",
                    }}
                  >
                    <HistoryIcon
                      sx={{
                        fontSize: 80,
                        color: alpha(theme.palette.primary.main, 0.2),
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      No Meeting History
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      You haven't joined any meetings yet. Start a meeting to
                      see your history here.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => routeTo("/home")}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      }}
                    >
                      Go to Home
                    </Button>
                  </Paper>
                </Fade>
              )}
            </AnimatePresence>
          )}

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: `0 8px 16px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
              }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
}
