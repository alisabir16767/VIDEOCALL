import React, { useRef, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../styles/videoComponent.css"; // Make sure this file has styles for the video

const server_url = "http://localhost:5000";
var connections = {};
const peerConfigConstraints = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

function VideoMeetComponent() {
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoRef = useRef();

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [screen, setScreen] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState([]);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");

  const videoRef = useRef([]);
  const [videos, setVideos] = useState([]);

  const getPermissions = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (userMediaStream.getVideoTracks().length > 0) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      if (userMediaStream.getAudioTracks().length > 0) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      window.localStream = userMediaStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = userMediaStream;
      }
    } catch (e) {
      console.error("Error getting permissions: ", e);
      setVideoAvailable(false);
      setAudioAvailable(false);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Video Meet</h1>
      {askForUsername ? (
        <div>
          <h2>Enter into Lobby</h2>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <br />
          <Button
            variant="contained"
            onClick={() => {
              setAskForUsername(false);
            }}
          >
            Connect
          </Button>
          <div style={{ marginTop: "20px" }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              style={{ width: "300px", border: "1px solid #ccc" }}
            ></video>
          </div>
        </div>
      ) : (
        <div>
          <h2>Welcome to the room, {username}</h2>
        </div>
      )}
    </div>
  );
}

export default VideoMeetComponent;
