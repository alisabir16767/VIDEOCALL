import httpStatus from "http-status";
import { Meeting } from "../models/meeting.model.js";

const createMeeting = async (req, res) => {
  const { meetingCode, topic, scheduledTime, password } = req.body;

  try {
    const newMeeting = new Meeting({
      meetingCode,
      topic,
      scheduledTime,
      password,
      hostId: req.user._id,
    });

    await newMeeting.save();
    res.status(httpStatus.CREATED).json({ meetingCode: newMeeting.meetingCode });
  } catch (e) {
    res.status(httpStatus.BAD_REQUEST).json({ message: `Error creating meeting: ${e.message}` });
  }
};

const validateMeeting = async (req, res) => {
  const { code, password } = req.query;

  try {
    const meeting = await Meeting.findOne({ meetingCode: code });

    if (!meeting) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Meeting not found" });
    }

    if (meeting.password && meeting.password !== password) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid password" });
    }
    
    res.status(httpStatus.OK).json({ message: "Meeting valid", meeting });

  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error validating meeting: ${e.message}` });
  }
};

const getMeeting = async (req, res) => {
  const { meetingCode } = req.params;

  try {
    const meeting = await Meeting.findOne({ meetingCode });
    if (!meeting) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Meeting not found" });
    }
    res.status(httpStatus.OK).json(meeting);
  } catch (e) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error fetching meeting: ${e.message}` });
  }
};

const deleteMeeting = async (req, res) => {
    const { meetingCode } = req.params;
    
    try {
        const meeting = await Meeting.findOne({ meetingCode });
        if (!meeting) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Meeting not found" });
        }
        
        // Ensure only host can delete (assuming req.user is set by auth middleware)
        if (meeting.hostId.toString() !== req.user._id.toString()) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Only host can delete meeting" });
        }

        await Meeting.deleteOne({ meetingCode });
        res.status(httpStatus.OK).json({ message: "Meeting deleted" });

    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Error deleting meeting: ${e.message}` });
    }
}

export { createMeeting, validateMeeting, getMeeting, deleteMeeting };
