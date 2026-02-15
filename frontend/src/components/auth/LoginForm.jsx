import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  alpha,
  Paper,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
} from "@mui/material";
import {
  PersonOutline as PersonIcon,
  LockOutline as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

export default function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  error,
  onSubmit,
  loading = false,
}) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && username && password) {
      onSubmit();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Username Field */}
      <TextField
        margin="dense"  // Changed from "normal" to "dense" to reduce spacing
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        value={username}
        autoFocus
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={handleKeyPress}
        size="small"  // Added size="small" to reduce height
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      {/* Password Field */}
      <TextField
        margin="dense"  // Changed from "normal" to "dense"
        required
        fullWidth
        name="password"
        label="Password"
        value={password}
        type={showPassword ? "text" : "password"}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        id="password"
        size="small"  // Added size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      {/* Remember Me & Forgot Password */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,  // Reduced from 2 to 1
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
              size="small"
              sx={{ py: 0 }}  // Remove vertical padding
            />
          }
          label={
            <Typography variant="body2" color="text.secondary">
              Remember me
            </Typography>
          }
          sx={{ ml: 0 }}  // Remove left margin
        />
        <Link
          href="#"
          variant="body2"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Forgot password?
        </Link>
      </Box>

      {/* Error Message */}
      {error && (
        <Fade in={!!error}>
          <Paper
            elevation={0}
            sx={{
              mt: 1.5,  // Reduced from 2 to 1.5
              p: 1,  // Reduced from 1.5 to 1
              bgcolor: alpha(theme.palette.error.main, 0.1),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: theme.palette.error.main, textAlign: "center" }}
            >
              {error}
            </Typography>
          </Paper>
        </Fade>
      )}

      {/* Login Button */}
      <Button
        type="button"
        fullWidth
        variant="contained"
        disabled={loading || !username || !password}
        onClick={onSubmit}
        sx={{
          mt: 2,  // Reduced from 3 to 2
          mb: 1,  // Reduced from 2 to 1
          py: 1.2,  // Slightly reduced from 1.5
          borderRadius: 2,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        }}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
      </Button>

      {/* Sign Up Link */}
      <Box sx={{ textAlign: "center", mt: 0.5 }}>  {/* Reduced from 2 to 0.5 */}
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{" "}
          <Link
            href="#"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}