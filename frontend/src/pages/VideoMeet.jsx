import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Box, Snackbar, Alert } from "@mui/material";
import server from "../environment";
import LobbyScreen from "../components/video-meet/LobbyScreen";
import MeetingScreen from "../components/video-meet/MeetingScreen";
import WaitingRoomView from "../components/video-meet/WaitingRoomView";

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
  let lobbyStreamRef = useRef(null);

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
  const [waitingParticipants, setWaitingParticipants] = useState([]);
  const [polls, setPolls] = useState([]);
  const [inWaitingRoom, setInWaitingRoom] = useState(false);
  const [isMeetingLocked, setIsMeetingLocked] = useState(false);
  const [showParticipantsPanel, setShowParticipantsPanel] = useState(false);
  const [showWaitingRoomPanel, setShowWaitingRoomPanel] = useState(false);
  const [showPollsPanel, setShowPollsPanel] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const videoRef = useRef([]);

  // Get permissions on mount
  useEffect(() => {
    getPermissions();
  }, []);

  // Handle media changes
  useEffect(() => {
    if (!askForUsername && window.localStream) {
      const videoTrack = window.localStream.getVideoTracks()[0];
      if (videoTrack) {
        if (screen) {
          videoTrack.enabled = true;
        } else {
          videoTrack.enabled = video;
        }
      }
      const audioTrack = window.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = audio;
      }
      
      // Update peer connections when audio/video state changes
      Object.entries(connections).forEach(([id, connection]) => {
        if (id === socketIdRef.current) return;
        
        // For audio changes, we need to update the sender
        if (audioTrack) {
          const sender = connection.getSenders().find(s => s.track?.kind === 'audio');
          if (sender) {
            sender.replaceTrack(audioTrack);
          }
        }
        
        // For video changes, we need to update the sender
        if (videoTrack) {
          const sender = connection.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        }
      });
    }
  }, [video, audio, askForUsername, screen]);

  // Initial media setup when joining
  useEffect(() => {
    if (!askForUsername) {
      getUserMedia();
    }
  }, [askForUsername]);

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
    if (lobbyStreamRef.current) {
      lobbyStreamRef.current.getTracks().forEach((track) => track.stop());
      lobbyStreamRef.current = null;
    }
    if (window.localStream) {
      window.localStream.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const getPermissions = async () => {
    try {
      let canVideo = false;
      let canAudio = false;

      try {
        const videoPermission = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        canVideo = true;
        setVideoAvailable(true);
        videoPermission.getTracks().forEach((track) => track.stop());
      } catch {
        setVideoAvailable(false);
      }

      try {
        const audioPermission = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        canAudio = true;
        setAudioAvailable(true);
        audioPermission.getTracks().forEach((track) => track.stop());
      } catch {
        setAudioAvailable(false);
      }

      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

      if (canVideo || canAudio) {
        startLobbyPreview(canVideo, canAudio);
      }
    } catch (error) {
      console.log("Permission error:", error);
    }
  };

  const startLobbyPreview = async (useVideo, useAudio) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }
      const constraints = {
        video: useVideo,
        audio: useAudio,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      lobbyStreamRef.current = stream;
      if (localVideoref.current) {
        localVideoref.current.srcObject = stream;
      }
    } catch (error) {
      console.log("Lobby preview error:", error);
    }
  };

  const getUserMedia = async () => {
    try {
      // Don't stop all tracks if we are just re-acquiring, but here we are initializing.
      // But wait, getUserMedia is now only called on mount (effectively).
      stopAllTracks();

      if (!videoAvailable && !audioAvailable) {
        createBlackSilenceStream();
        return;
      }

      const constraints = {
        video: videoAvailable,
        audio: audioAvailable,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Apply initial state
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = video;
      
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = audio;

      // Log for debugging
      console.log("User media tracks:", {
        video: stream.getVideoTracks().length,
        audio: stream.getAudioTracks().length,
        videoEnabled: video,
        audioEnabled: audio
      });

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

    // Log stream details for debugging
    console.log("New stream created:", {
      videoTracks: stream.getVideoTracks().length,
      audioTracks: stream.getAudioTracks().length,
      trackKinds: stream.getTracks().map(t => ({kind: t.kind, enabled: t.enabled, muted: t.muted}))
    });

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

      // Renegotiate only if we replaced tracks
      if (senders.length > 0) {
        renegotiatePeer(connection, id);
      }
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
      const code = window.location.pathname.split("/").filter(Boolean).pop();
      socketRef.current.emit("join-call", code, username);
      socketIdRef.current = socketRef.current.id;
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
      setParticipants((prev) =>
        prev.filter((p) => (p.socketId || p.id) !== id)
      );
      delete connections[id];
    });

    socketRef.current.on("user-joined", (id, clients) => {
      clients.forEach((socketListId) => {
        if (connections[socketListId] || socketListId === socketIdRef.current)
          return;

        createPeerConnection(socketListId);
      });
    });

    socketRef.current.on("participant-list", (list) => {
      setParticipants(list);
      if (socketIdRef.current && list.length > 0) {
        const hostSocketId = list[0].socketId;
        setIsHost(hostSocketId === socketIdRef.current);
      } else {
        setIsHost(false);
      }
    });

    socketRef.current.on("waiting-participant", (socketId, name) => {
      setWaitingParticipants((prev) => {
        if (prev.some((p) => p.socketId === socketId)) {
          return prev;
        }
        return [...prev, { socketId, username: name }];
      });
    });

    socketRef.current.on("status", (status) => {
      if (status === "waiting-room") {
        setInWaitingRoom(true);
        showSnackbar("You are in the waiting room", "info");
      } else {
        setInWaitingRoom(false);
      }
    });

    socketRef.current.on("admitted", () => {
      setInWaitingRoom(false);
      showSnackbar("You have been admitted to the meeting", "success");
    });

    socketRef.current.on("denied", () => {
      showSnackbar("You were denied entry to the meeting", "error");
      stopAllTracks();
      socketRef.current.disconnect();
      window.location.href = "/";
    });

    socketRef.current.on("muted", () => {
      setAudio(false);
      if (window.localStream) {
        window.localStream.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }
      showSnackbar("You have been muted by the host", "info");
    });

    socketRef.current.on("kicked", () => {
      showSnackbar("You have been removed from the meeting", "error");
      stopAllTracks();
      socketRef.current.disconnect();
      window.location.href = "/";
    });

    socketRef.current.on("meeting-locked", () => {
      setIsMeetingLocked(true);
      showSnackbar(
        "Meeting locked. New participants will wait for approval",
        "info"
      );
    });

    socketRef.current.on("meeting-unlocked", () => {
      setIsMeetingLocked(false);
      showSnackbar(
        "Meeting unlocked. New participants can join directly",
        "info"
      );
    });

    socketRef.current.on("poll-created", (poll) => {
      setPolls((prev) => {
        const id = poll._id || poll.id;
        const index = prev.findIndex((p) => (p._id || p.id) === id);
        if (index !== -1) {
          const next = [...prev];
          next[index] = { ...next[index], ...poll };
          return next;
        }
        return [...prev, poll];
      });
    });

    socketRef.current.on("poll-updated", ({ pollId, votes }) => {
      setPolls((prev) =>
        prev.map((poll) =>
          (poll._id || poll.id) === pollId ? { ...poll, votes } : poll
        )
      );
    });

    socketRef.current.on("poll-ended", (pollId) => {
      setPolls((prev) =>
        prev.map((poll) =>
          (poll._id || poll.id) === pollId ? { ...poll, isActive: false } : poll
        )
      );
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

    // Add local stream - ensure we add both audio and video tracks
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
    if (lobbyStreamRef.current) {
      lobbyStreamRef.current.getTracks().forEach((track) => track.stop());
      lobbyStreamRef.current = null;
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

  const handleMuteParticipant = (targetSocketId) => {
    if (!socketRef.current) return;
    socketRef.current.emit("mute-participant", targetSocketId);
  };

  const handleRemoveParticipant = (targetSocketId) => {
    if (!socketRef.current) return;
    socketRef.current.emit("remove-participant", targetSocketId);
  };

  const handleAdmitParticipant = (targetSocketId) => {
    if (!socketRef.current) return;
    socketRef.current.emit("admit-participant", targetSocketId);
    setWaitingParticipants((prev) =>
      prev.filter((p) => p.socketId !== targetSocketId)
    );
  };

  const handleDenyParticipant = (targetSocketId) => {
    if (!socketRef.current) return;
    socketRef.current.emit("deny-participant", targetSocketId);
    setWaitingParticipants((prev) =>
      prev.filter((p) => p.socketId !== targetSocketId)
    );
  };

  const handleCreatePoll = (pollData) => {
    if (!socketRef.current || !meetingInfo.code) return;
    socketRef.current.emit("create-poll", meetingInfo.code, pollData);
  };

  const handleVotePoll = (pollId, optionIndex) => {
    if (!socketRef.current) return;
    socketRef.current.emit("submit-vote", pollId, optionIndex);
  };

  const handleEndPoll = (pollId) => {
    if (!socketRef.current) return;
    socketRef.current.emit("end-poll", pollId);
  };

  const handleToggleMeetingLock = () => {
    if (!socketRef.current || !meetingInfo.code) return;
    socketRef.current.emit("meeting-lock", meetingInfo.code, !isMeetingLocked);
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
      ) : inWaitingRoom ? (
        <WaitingRoomView
          onLeave={() => {
            stopAllTracks();
            socketRef.current?.disconnect();
            window.location.href = "/";
          }}
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
          waitingParticipants={waitingParticipants}
          onMuteParticipant={handleMuteParticipant}
          onRemoveParticipant={handleRemoveParticipant}
          onAdmitParticipant={handleAdmitParticipant}
          onDenyParticipant={handleDenyParticipant}
          polls={polls}
          onCreatePoll={handleCreatePoll}
          onVotePoll={handleVotePoll}
          onEndPoll={handleEndPoll}
          isHost={isHost}
          isMeetingLocked={isMeetingLocked}
          onToggleMeetingLock={handleToggleMeetingLock}
          showParticipantsPanel={showParticipantsPanel}
          setShowParticipantsPanel={setShowParticipantsPanel}
          showWaitingRoomPanel={showWaitingRoomPanel}
          setShowWaitingRoomPanel={setShowWaitingRoomPanel}
          showPollsPanel={showPollsPanel}
          setShowPollsPanel={setShowPollsPanel}
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
