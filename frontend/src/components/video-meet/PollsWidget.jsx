import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  useTheme,
  alpha,
} from "@mui/material";
import PollIcon from "@mui/icons-material/Poll";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PollsWidget({
  polls,
  onCreatePoll,
  onVote,
  onEndPoll,
  isHost,
}) {
  const theme = useTheme();
  const [openCreate, setOpenCreate] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (question.trim() && options.every((opt) => opt.trim())) {
      onCreatePoll({ question, options });
      setOpenCreate(false);
      setQuestion("");
      setOptions(["", ""]);
    }
  };

  const calculatePercentage = (poll, optionIndex) => {
    const totalVotes = poll.votes.length;
    if (totalVotes === 0) return 0;
    const optionVotes = poll.votes.filter(
      (v) => v.optionIndex === optionIndex
    ).length;
    return Math.round((optionVotes / totalVotes) * 100);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Polls</Typography>
        {isHost && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
          >
            Create
          </Button>
        )}
      </Box>

      <List sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {polls.length === 0 ? (
          <Box sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}>
            <PollIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography>No active polls</Typography>
          </Box>
        ) : (
          polls.map((poll) => (
            <ListItem key={poll._id || poll.id} disablePadding sx={{ mb: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  width: "100%",
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {poll.question}
                  </Typography>
                  {isHost && poll.isActive && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onEndPoll(poll._id || poll.id)}
                    >
                      End Poll
                    </Button>
                  )}
                </Box>

                {!poll.isActive && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Poll Ended
                  </Typography>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {poll.options.map((option, index) => {
                    const percentage = calculatePercentage(poll, index);
                    return (
                      <Box
                        key={index}
                        onClick={() =>
                          poll.isActive && onVote(poll._id || poll.id, index)
                        }
                        sx={{
                          position: "relative",
                          p: 1,
                          borderRadius: 1,
                          border: `1px solid ${alpha(
                            theme.palette.divider,
                            0.2
                          )}`,
                          cursor: poll.isActive ? "pointer" : "default",
                          "&:hover": {
                            bgcolor: poll.isActive
                              ? alpha(theme.palette.action.hover, 0.1)
                              : "transparent",
                          },
                        }}
                      >
                        {/* Progress Bar Background */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: `${percentage}%`,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: 1,
                            transition: "width 0.5s ease",
                          }}
                        />
                        
                        <Box
                          sx={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "space-between",
                            zIndex: 1,
                          }}
                        >
                          <Typography variant="body2">{option}</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {percentage}%
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", textAlign: "right" }}>
                    {poll.votes.length} votes
                </Typography>
              </Paper>
            </ListItem>
          ))
        )}
      </List>

      {/* Create Poll Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create a Poll</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            fullWidth
            variant="outlined"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{ mb: 2 }}
          />
          {options.map((option, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                label={`Option ${index + 1}`}
                fullWidth
                size="small"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              {options.length > 2 && (
                <IconButton onClick={() => handleRemoveOption(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddOption} size="small">
            Add Option
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!question || options.some(o => !o.trim())}>
            Launch
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
