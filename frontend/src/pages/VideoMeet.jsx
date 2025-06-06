import React, { useRef, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { io } from "socket.io-client";
import "../styles/videoComponent.css";

const server_url = "http://localhost:3000";

const peerConfigConstraints = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function VideoMeetComponent() {
  const socketRef = useRef();
  const localVideoRef = useRef();

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [screenAvailable, setScreenAvailable] = useState(false);

  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");

  const getPermissions = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setVideoAvailable(userMediaStream.getVideoTracks().length > 0);
      setAudioAvailable(userMediaStream.getAudioTracks().length > 0);
      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

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

  const getUserMedia = () => {
    if (video && audio) {
      navigator.mediaDevices
        .getUserMedia({ video, audio })
        .then((stream) => {
          window.localStream = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          console.log("Media access successful");
        })
        .catch((err) => {
          console.log("Error accessing media devices:", err);
        });
    } else {
      try {
        const tracks = localVideoRef.current?.srcObject?.getTracks();
        tracks?.forEach((track) => track.stop());
      } catch (err) {
        console.error("Error stopping tracks:", err);
      }
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  const connectToSocketServer = () => {
    socketRef.current = io(server_url, { secure: false });
    socketRef.current.on("connect", () => {
      console.log("Connected to socket server:", socketRef.current.id);
    });
  };

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  const connect = () => {
    if (username.trim() === "") {
      alert("Please enter a username");
      return;
    }
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div className="video-container">
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
          <Button variant="contained" onClick={connect}>
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
          <div>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              style={{ width: "300px", border: "1px solid #ccc" }}
            ></video>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoMeetComponent;
