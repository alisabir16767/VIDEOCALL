import { Server } from "socket.io";
import { Meeting } from "../models/meeting.model.js";
import { ChatMessage } from "../models/chatMessage.model.js";
import { Poll } from "../models/poll.model.js";

let connections = {};
let messages = {};
let timeOnline = {};
let waitingRooms = {}; // { meetingCode: [socketId] }
let participants = {}; // { socketId: { username, muted } }

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("SOMETHING CONNECTED");

    socket.on("join-call", async (path, username) => {
      // Validate meeting existence
      let meeting;
      try {
        meeting = await Meeting.findOne({ meetingCode: path });
        if (!meeting) {
            socket.emit("error", { message: "Meeting not found" });
            return;
        }
      } catch (e) {
        console.error("Error validating meeting:", e);
        socket.emit("error", { message: "Internal server error" });
        return;
      }

      // Handle Waiting Room
      if (meeting.isLocked) {
         if (!waitingRooms[path]) waitingRooms[path] = [];
         waitingRooms[path].push(socket.id);
         participants[socket.id] = { username, muted: false, inWaitingRoom: true };
         
         // Notify host (assuming host is in connections[path]) - logic needs refinement to identify host
         // For now, emit to all in meeting that someone is waiting
         if (connections[path]) {
             connections[path].forEach(sid => io.to(sid).emit("waiting-participant", socket.id, username));
         }
         socket.emit("status", "waiting-room");
         return;
      }

      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);
      participants[socket.id] = { username, muted: false, inWaitingRoom: false };

      timeOnline[socket.id] = new Date();

      // connections[path].forEach(elem => {
      //     io.to(elem)
      // })

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path]
        );
      }
      
      // Emit full participant list
      const meetingParticipants = connections[path].map(sid => ({
          socketId: sid,
          ...participants[sid]
      }));
      io.to(path).emit("participant-list", meetingParticipants); // Need to join socket to room 'path'
      socket.join(path);
      io.to(path).emit("participant-list", meetingParticipants);


      // Fetch last 50 messages from DB
      try {
        const dbMessages = await ChatMessage.find({ meetingCode: path })
          .sort({ timestamp: 1 })
          .limit(50);
        
        dbMessages.forEach(msg => {
             io.to(socket.id).emit(
                "chat-message",
                msg.message,
                msg.sender,
                msg.socketIdSender
              );
        });
      } catch (e) {
        console.error("Error fetching messages:", e);
      }
      
      // Fetch Active Polls
      try {
          const activePolls = await Poll.find({ meetingCode: path, isActive: true });
          activePolls.forEach(poll => {
              io.to(socket.id).emit("poll-created", poll);
          });
      } catch (e) {
          console.error("Error fetching polls:", e);
      }

      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"]
          );
        }
      }
    });
    
    // Moderator Controls
    socket.on("mute-participant", (targetSocketId) => {
        // Verification that sender is host should be added here
        if (participants[targetSocketId]) {
            participants[targetSocketId].muted = true;
            io.to(targetSocketId).emit("muted");
            
            // Also notify the host that this participant is muted
            const [matchingRoom] = Object.entries(connections).find(([_, sids]) => sids.includes(targetSocketId)) || [];
            if (matchingRoom) {
                const meetingParticipants = connections[matchingRoom].map(sid => ({
                    socketId: sid,
                    ...participants[sid]
                }));
                io.to(matchingRoom).emit("participant-list", meetingParticipants);
            }
        }
    });

    socket.on("remove-participant", (targetSocketId) => {
         // Verification that sender is host should be added here
         io.to(targetSocketId).emit("kicked");
         io.sockets.sockets.get(targetSocketId)?.disconnect();
    });
    
    // Waiting Room Controls
    socket.on("admit-participant", (targetSocketId) => {
        // Logic to move from waitingRooms to connections
        const [roomCode] = Object.entries(waitingRooms).find(([_, sids]) => sids.includes(targetSocketId)) || [];
        if (roomCode) {
            waitingRooms[roomCode] = waitingRooms[roomCode].filter(id => id !== targetSocketId);
            
            if (connections[roomCode] === undefined) connections[roomCode] = [];
            connections[roomCode].push(targetSocketId);
            if (participants[targetSocketId]) participants[targetSocketId].inWaitingRoom = false;
            
            const socketToAdmit = io.sockets.sockets.get(targetSocketId);
            if (socketToAdmit) {
                socketToAdmit.join(roomCode);
                socketToAdmit.emit("admitted");
                
                // Trigger join logic manually or refactor join-call to be reusable
                // For simplicity, emit user-joined
                 for (let a = 0; a < connections[roomCode].length; a++) {
                    io.to(connections[roomCode][a]).emit(
                      "user-joined",
                      targetSocketId,
                      connections[roomCode]
                    );
                  }
            }
        }
    });
    
    socket.on("deny-participant", (targetSocketId) => {
        const [roomCode] = Object.entries(waitingRooms).find(([_, sids]) => sids.includes(targetSocketId)) || [];
         if (roomCode) {
            waitingRooms[roomCode] = waitingRooms[roomCode].filter(id => id !== targetSocketId);
            io.to(targetSocketId).emit("denied");
            io.sockets.sockets.get(targetSocketId)?.disconnect();
         }
    });

    socket.on("meeting-lock", async (path, isLocked) => {
         // Verification that sender is host should be added here
         try {
             await Meeting.updateOne({ meetingCode: path }, { isLocked: isLocked });
             io.to(path).emit(isLocked ? "meeting-locked" : "meeting-unlocked");
         } catch(e) {
             console.error("Error locking meeting:", e);
         }
    });
    
    // Polls
    socket.on("create-poll", async (path, pollData) => { // pollData: { question, options }
        try {
            const newPoll = new Poll({
                meetingCode: path,
                question: pollData.question,
                options: pollData.options
            });
            await newPoll.save();
            io.to(path).emit("poll-created", newPoll);
        } catch (e) {
            console.error("Error creating poll:", e);
        }
    });
    
    socket.on("submit-vote", async (pollId, optionIndex) => {
        try {
            const poll = await Poll.findById(pollId);
            if (poll && poll.isActive) {
                // Check if user already voted (simple check by socketId/userId if available)
                const existingVote = poll.votes.find(v => v.userId === socket.id); // Using socket.id for now
                if (!existingVote) {
                     poll.votes.push({ userId: socket.id, optionIndex });
                     await poll.save();
                     
                     // Broadcast updated results to everyone in the meeting
                     io.to(poll.meetingCode).emit("poll-updated", { pollId, votes: poll.votes });
                }
            }
        } catch (e) {
            console.error("Error submitting vote:", e);
        }
    });
    
    socket.on("end-poll", async (pollId) => {
        try {
             const poll = await Poll.findByIdAndUpdate(pollId, { isActive: false }, { new: true });
             if (poll) {
                 io.to(poll.meetingCode).emit("poll-ended", pollId);
             }
        } catch (e) {
            console.error("Error ending poll:", e);
        }
    });


    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", async (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }

          return [room, isFound];
        },
        ["", false]
      );

      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        console.log("message", matchingRoom, ":", sender, data);
        
        // Save message to DB
        try {
            const newMessage = new ChatMessage({
                meetingCode: matchingRoom,
                sender: sender,
                socketIdSender: socket.id,
                message: data
            });
            await newMessage.save();
        } catch (e) {
            console.error("Error saving message:", e);
        }

        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });


    socket.on("disconnect", () => {
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());

      var key;

      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connections))
      )) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;

            for (let a = 0; a < connections[key].length; ++a) {
              io.to(connections[key][a]).emit("user-left", socket.id);
            }

            var index = connections[key].indexOf(socket.id);

            connections[key].splice(index, 1);

            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }
      
      delete participants[socket.id];
      // Cleanup waiting room
      for (const room in waitingRooms) {
          waitingRooms[room] = waitingRooms[room].filter(id => id !== socket.id);
      }
    });
  });

  return io;
};
