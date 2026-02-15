import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
  Link,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  PersonOutline as PersonIcon,
  LockOutline as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  HowToReg as RegisterIcon,
  CheckCircle as CheckCircleIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterForm({
  name,
  setName,
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
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && name && username && password && agreeTerms) {
      onSubmit();
    }
  };

  // Simple password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  
  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return theme.palette.grey[300];
      case 1: return theme.palette.error.main;
      case 2: return theme.palette.warning.main;
      case 3: return theme.palette.info.main;
      case 4: return theme.palette.success.main;
      default: return theme.palette.grey[300];
    }
  };

  const getStrengthText = () => {
    switch(passwordStrength) {
      case 0: return "Enter password";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  return (
    <Box>
      {/* Main Container div */}
      <div>
        {/* Header Section div */}
        <div>
          <Zoom in={true}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  <RegisterIcon sx={{ fontSize: 40, color: "white" }} />
                </Box>
              </motion.div>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join our community today
              </Typography>
            </Box>
          </Zoom>

        </div>

        {/* Form Fields Section div */}
        <div>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Fade in={true} timeout={500}>
              <div>
                {/* Full Name Field */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    value={name}
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                        "&.Mui-focused": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                        },
                      },
                    }}
                  />
                </motion.div>

                {/* Username Field */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                        "&.Mui-focused": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                        },
                      },
                    }}
                  />
                </motion.div>

                {/* Password Field with Strength Indicator */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    value={password}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    id="password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: theme.palette.primary.main }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                        "&.Mui-focused": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                        },
                      },
                    }}
                  />
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Box sx={{ flex: 1, display: "flex", gap: 0.5 }}>
                          {[1, 2, 3, 4].map((level) => (
                            <Box
                              key={level}
                              sx={{
                                height: 4,
                                flex: 1,
                                borderRadius: 2,
                                bgcolor: level <= passwordStrength ? getStrengthColor() : alpha(theme.palette.grey[500], 0.2),
                                transition: "all 0.3s",
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="caption" sx={{ color: getStrengthColor(), fontWeight: 600 }}>
                          {getStrengthText()}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Use at least 8 characters with uppercase, numbers & symbols
                      </Typography>
                    </Box>
                  )}
                </motion.div>

                {/* Terms and Conditions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        I agree to the{" "}
                        <Link
                          href="#"
                          sx={{
                            color: theme.palette.primary.main,
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="#"
                          sx={{
                            color: theme.palette.primary.main,
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                  />
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 2,
                          p: 1.5,
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                          animation: "shake 0.5s",
                          "@keyframes shake": {
                            "0%, 100%": { transform: "translateX(0)" },
                            "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
                            "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.error.main, textAlign: "center" }}
                        >
                          {error}
                        </Typography>
                      </Paper>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Register Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    disabled={loading || !name || !username || !password || !agreeTerms}
                    onClick={() => {
                      onSubmit();
                    }}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                      boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      "&:disabled": {
                        background: alpha(theme.palette.action.disabled, 0.5),
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </motion.div>

                {/* Login Link */}
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
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
                      Sign in
                    </Link>
                  </Typography>
                </Box>

                {/* Success Chip - Shows when all fields are filled */}
                {name && username && password && agreeTerms && (
                  <Fade in={true}>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="All set! Ready to register"
                        color="success"
                        size="small"
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  </Fade>
                )}
              </div>
            </Fade>
          </Box>
        </div>
      </div>
    </Box>
  );
}
