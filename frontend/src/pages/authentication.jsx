import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import { Snackbar, Alert, alpha, Typography } from "@mui/material";
import theme from "../theme";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LandingNavbar from "../components/landing/LandingNavbar";

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  let handleAuth = async () => {
    setLoading(true);
    setError("");
    
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        console.log(result);
        setUsername("");
        setMessage("Registration successful! Please sign in.");
        setOpen(true);
        setError("");
        setFormState(0);
        setPassword("");
        setName("");
      }
    } catch (err) {
      console.log(err);
      let message = err.response?.data?.message || err.message || "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <LandingNavbar />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        
        {/* Left side - Image side with overlay */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: "relative",
            backgroundImage: "url(/background.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: { xs: 'none', sm: 'block' },
            '&::before': {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.85)} 0%, ${alpha(theme.palette.secondary.main, 0.75)} 100%)`,
            },
          }}
        >
          {/* Content overlay */}
          <Box
            sx={{
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              p: 4,
              textAlign: "center",
              zIndex: 1,
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "rgba(255,255,255,0.2)",
                mb: 3,
                backdropFilter: "blur(5px)",
              }}
            >
              <VideoCallIcon sx={{ fontSize: 50 }} />
            </Avatar>
            
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                textShadow: "0 4px 10px rgba(0,0,0,0.2)",
                letterSpacing: "-0.02em",
              }}
            >
              Face Call
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                maxWidth: "500px",
                opacity: 0.95,
                lineHeight: 1.6,
                fontWeight: 400,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Connect with your loved ones through high-quality video calls
            </Typography>
          </Box>
        </Grid>

        {/* Right side - Form side */}
        <Grid 
          item 
          xs={12} 
          sm={8} 
          md={5} 
          component={Paper} 
          elevation={6} 
          square
          sx={{
            display: "flex",
            alignItems: "flex-start", // Changed from center to flex-start
            justifyContent: "center",
            background: "#ffffff",
            overflow: "auto", // Add scroll if content overflows
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "450px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 4, // Add padding top and bottom only
              px: 3, // Add padding left and right
            }}
          >
            {/* Mobile logo (visible only on mobile) */}
            <Box sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  margin: "0 auto 8px",
                }}
              >
                <VideoCallIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Face Call
              </Typography>
            </Box>

            {/* Lock Icon */}
            <Avatar
              sx={{
                m: 1,
                width: 56,
                height: 56,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              <LockOutlinedIcon />
            </Avatar>

            {/* Toggle Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
                mb: 3,
                p: 0.5,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 4,
              }}
            >
              <Button
                variant={formState === 0 ? "contained" : "text"}
                onClick={() => {
                  setFormState(0);
                  setError("");
                }}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  minWidth: 100,
                  ...(formState === 0 && {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                  }),
                }}
              >
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? "contained" : "text"}
                onClick={() => {
                  setFormState(1);
                  setError("");
                }}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  minWidth: 100,
                  ...(formState === 1 && {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                  }),
                }}
              >
                Sign Up
              </Button>
            </Box>

            {/* Form Title - REMOVED because it's already in the form components */}

            {/* Forms - No extra wrapper needed */}
            {formState === 1 ? (
              <RegisterForm
                name={name}
                setName={setName}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                error={error}
                onSubmit={handleAuth}
                loading={loading}
              />
            ) : (
              <LoginForm
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                error={error}
                onSubmit={handleAuth}
                loading={loading}
              />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: `0 8px 16px ${alpha(theme.palette.success.main, 0.2)}`,
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
