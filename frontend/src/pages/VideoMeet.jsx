import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Box, Snackbar, Alert } from "@mui/material";
import server from "../environment";
import LobbyScreen from "../components/video-meet/LobbyScreen";
import MeetingScreen from "../components/video-meet/MeetingScreen";

const server_url = server;

var connections = {};

const peerConfigConnections = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoref = useRef();
  let screenStreamRef = useRef(null);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [screen, setScreen] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(0);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [videos, setVideos] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [meetingInfo, setMeetingInfo] = useState({
    code: "",
    startedAt: new Date(),
  });

  const videoRef = useRef([]);

  // Get permissions on mount
  useEffect(() => {
    getPermissions();
  }, []);

  // Handle media changes
  useEffect(() => {
    if (!askForUsername) {
      getUserMedia();
    }
  }, [video, audio, askForUsername]);

  // Handle screen sharing
  useEffect(() => {
    if (!askForUsername) {
      if (screen) {
        startScreenShare();
      } else {
        stopScreenShare();
      }
    }
  }, [screen, askForUsername]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllTracks();
      socketRef.current?.disconnect();
      Object.values(connections).forEach((conn) => conn.close());
    };
  }, []);

  const stopAllTracks = () => {
    if (window.localStream) {
      window.localStream.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const getPermissions = async () => {
    try {
      // Check video permission
      try {
        const videoPermission = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setVideoAvailable(true);
        videoPermission.getTracks().forEach((track) => track.stop());
      } catch {
        setVideoAvailable(false);
      }

      // Check audio permission
      try {
        const audioPermission = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setAudioAvailable(true);
        audioPermission.getTracks().forEach((track) => track.stop());
      } catch {
        setAudioAvailable(false);
      }

      // Check screen sharing availability
      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);
    } catch (error) {
      console.log("Permission error:", error);
    }
  };

  const getUserMedia = async () => {
    try {
      stopAllTracks();

      if (!videoAvailable && !audioAvailable) {
        createBlackSilenceStream();
        return;
      }

      const constraints = {
        video: video && videoAvailable,
        audio: audio && audioAvailable,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleNewStream(stream);
    } catch (error) {
      console.log("Failed to get user media:", error);
      showSnackbar("Failed to access camera/microphone", "error");
      createBlackSilenceStream();
    }
  };

  const createBlackSilenceStream = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.fillText("Camera Off", 200, 240);

    const videoStream = canvas.captureStream(30);
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const destination = audioContext.createMediaStreamDestination();
    oscillator.connect(destination);
    oscillator.start();

    const audioTrack = destination.stream.getAudioTracks()[0];
    audioTrack.enabled = false;

    const combinedStream = new MediaStream([
      videoStream.getVideoTracks()[0],
      audioTrack,
    ]);

    handleNewStream(combinedStream);
  };

  const handleNewStream = (stream) => {
    window.localStream = stream;

    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
    }

    // Update all peer connections with new stream
    Object.entries(connections).forEach(([id, connection]) => {
      if (id === socketIdRef.current) return;

      const senders = connection.getSenders();
      stream.getTracks().forEach((track) => {
        const sender = senders.find((s) => s.track?.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track);
        } else {
          connection.addTrack(track, stream);
        }
      });

      renegotiatePeer(connection, id);
    });
  };

  const renegotiatePeer = async (connection, peerId) => {
    try {
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      socketRef.current.emit(
        "signal",
        peerId,
        JSON.stringify({ sdp: connection.localDescription })
      );
    } catch (error) {
      console.log("Renegotiation error:", error);
    }
  };

  const startScreenShare = async () => {
    try {
      if (!navigator.mediaDevices.getDisplayMedia) {
        showSnackbar("Screen sharing not supported", "error");
        setScreen(false);
        return;
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      screenStreamRef.current = stream;

      // Handle when user stops sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        setScreen(false);
      };

      // Replace video track in local stream
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      const newStream = new MediaStream();
      if (videoTrack) newStream.addTrack(videoTrack);
      if (audioTrack) {
        newStream.addTrack(audioTrack);
      } else if (window.localStream?.getAudioTracks()[0]) {
        newStream.addTrack(window.localStream.getAudioTracks()[0]);
      }

      window.localStream = newStream;
      localVideoref.current.srcObject = newStream;

      // Update all peers
      Object.entries(connections).forEach(([id, connection]) => {
        if (id === socketIdRef.current) return;

        const sender = connection
          .getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(videoTrack);
        }

        renegotiatePeer(connection, id);
      });

      showSnackbar("Screen sharing started", "success");
    } catch (error) {
      console.log("Screen share error:", error);
      setScreen(false);
      showSnackbar("Failed to start screen sharing", "error");
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    // Revert to camera
    getUserMedia();
    showSnackbar("Screen sharing stopped", "info");
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, {
      secure: false,
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      setConnectionStatus("connected");
      socketRef.current.emit("join-call", window.location.href, username);
      socketIdRef.current = socketRef.current.id;

      // Extract meeting code from URL
      const code = window.location.href.split("/").pop();
      setMeetingInfo((prev) => ({ ...prev, code, startedAt: new Date() }));
    });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("chat-message", (data, sender, socketIdSender) => {
      setMessages((prev) => [
        ...prev,
        { sender, data, socketId: socketIdSender },
      ]);
      if (socketIdSender !== socketIdRef.current && !showChat) {
        setNewMessages((prev) => prev + 1);
      }
    });

    socketRef.current.on("user-left", (id) => {
      setVideos((prev) => prev.filter((video) => video.socketId !== id));
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      delete connections[id];
    });

    socketRef.current.on("user-joined", (id, clients) => {
      setParticipants((prev) => [
        ...prev,
        { id, name: `User ${id.slice(0, 4)}` },
      ]);

      clients.forEach((socketListId) => {
        if (connections[socketListId] || socketListId === socketIdRef.current)
          return;

        createPeerConnection(socketListId);
      });
    });

    socketRef.current.on("disconnect", () => {
      setConnectionStatus("disconnected");
      showSnackbar("Disconnected from server", "error");
    });
  };

  const createPeerConnection = (peerId) => {
    const peer = new RTCPeerConnection(peerConfigConnections);
    connections[peerId] = peer;

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit(
          "signal",
          peerId,
          JSON.stringify({ ice: event.candidate })
        );
      }
    };

    peer.ontrack = (event) => {
      setVideos((prev) => {
        const existing = prev.find((v) => v.socketId === peerId);
        if (existing) {
          return prev.map((v) =>
            v.socketId === peerId ? { ...v, stream: event.streams[0] } : v
          );
        }
        return [...prev, { socketId: peerId, stream: event.streams[0] }];
      });
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "failed") {
        delete connections[peerId];
      }
    };

    // Add local stream
    if (window.localStream) {
      window.localStream.getTracks().forEach((track) => {
        peer.addTrack(track, window.localStream);
      });
    }

    return peer;
  };

  const gotMessageFromServer = (fromId, message) => {
    const signal = JSON.parse(message);

    if (!connections[fromId]) {
      createPeerConnection(fromId);
    }

    const peer = connections[fromId];

    if (signal.sdp) {
      peer
        .setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(() => {
          if (signal.sdp.type === "offer") {
            return peer
              .createAnswer()
              .then((description) => peer.setLocalDescription(description))
              .then(() => {
                socketRef.current.emit(
                  "signal",
                  fromId,
                  JSON.stringify({ sdp: peer.localDescription })
                );
              });
          }
        })
        .catch((e) => console.log("SDP error:", e));
    }

    if (signal.ice) {
      peer
        .addIceCandidate(new RTCIceCandidate(signal.ice))
        .catch((e) => console.log("ICE error:", e));
    }
  };

  const connect = () => {
    if (!username.trim()) {
      showSnackbar("Please enter a username", "warning");
      return;
    }
    setAskForUsername(false);
    connectToSocketServer();
    getMedia();
  };

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const copyMeetingCode = () => {
    navigator.clipboard.writeText(meetingInfo.code);
    showSnackbar("Meeting code copied!", "success");
  };

  return (
    <Box sx={{ height: "100vh", bgcolor: "#1a1a1a", overflow: "hidden" }}>
      {askForUsername ? (
        <LobbyScreen
          username={username}
          setUsername={setUsername}
          localVideoRef={localVideoref}
          onConnect={connect}
          videoAvailable={videoAvailable}
          audioAvailable={audioAvailable}
        />
      ) : (
        <MeetingScreen
          localVideoRef={localVideoref}
          videos={videos}
          participants={participants}
          video={video}
          audio={audio}
          screen={screen}
          screenAvailable={screenAvailable}
          showChat={showChat}
          setShowChat={setShowChat}
          messages={messages.map((m) => ({
            ...m,
            isLocal: m.socketId === socketIdRef.current,
          }))}
          newMessages={newMessages}
          message={message}
          setMessage={setMessage}
          sendMessage={() => {
            if (message.trim()) {
              socketRef.current.emit("chat-message", message, username);
              setMessage("");
            }
          }}
          onVideoToggle={() => setVideo(!video)}
          onAudioToggle={() => setAudio(!audio)}
          onScreenToggle={() => setScreen(!screen)}
          onEndCall={() => {
            stopAllTracks();
            window.location.href = "/";
          }}
          meetingInfo={meetingInfo}
          onCopyCode={copyMeetingCode}
          connectionStatus={connectionStatus}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
