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
  const socketIdRef = useRef();
  const connections = useRef({});
  const videoRef = useRef([]);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenAvailable, setScreenAvailable] = useState(false);

  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [videos, setVideos] = useState([]);

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
    if (videoEnabled && audioEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
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
    if (videoEnabled !== undefined && audioEnabled !== undefined) {
      getUserMedia();
    }
  }, [videoEnabled, audioEnabled]);

  const gotMessageFromServer = (fromId, message) => {
    // To be implemented
  };

  const addMessage = (message) => {
    console.log(message);
  };

  const connectToSocketServer = () => {
    socketRef.current = io(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
        videoRef.current = videoRef.current.filter(
          (video) => video.socketId !== id
        );
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          if (connections.current[socketListId]) return;

          connections.current[socketListId] = new RTCPeerConnection(
            peerConfigConstraints
          );

          connections.current[socketListId].onicecandidate = (event) => {
            if (event.candidate) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          connections.current[socketListId].onaddstream = (event) => {
            const videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );
            if (videoExists) {
              const updatedVideos = videoRef.current.map((video) =>
                video.socketId === socketListId
                  ? { ...video, stream: event.stream }
                  : video
              );
              videoRef.current = updatedVideos;
              setVideos(updatedVideos);
            } else {
              const newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playInline: true,
              };
              const updatedVideos = [...videoRef.current, newVideo];
              videoRef.current = updatedVideos;
              setVideos(updatedVideos);
            }
          };

          // do

          if (window.localStream !== undefined && window.localStream !== null) {
            connections.current[socketListId].addStream(window.localStream);
          } else {
            //TODO BlackSilence
          }
        });
        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 == socketIdRef.current) continue;
            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {
              console.log(e);
            }
            connections[id2].createOffer().then((description) => {
              connections[id2].setLocalDescription(description);
              socketRef.current.emit(
                "signal",
                id2,
                JSON.stringify({ sdp: connections[id2].localDescription })
              );
            });
          }
        }
      });
    });
  };

  const getMedia = () => {
    setVideoEnabled(videoAvailable);
    setAudioEnabled(audioAvailable);
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
          {videos.map((videoObj) => (
            <video
              key={videoObj.socketId}
              autoPlay
              playsInline
              ref={(ref) => {
                if (ref) ref.srcObject = videoObj.stream;
              }}
              style={{
                width: "300px",
                margin: "10px",
                border: "1px solid #ccc",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoMeetComponent;
