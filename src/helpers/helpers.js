import { defaultAvatar } from './constants';

// Return details of the recipient of a chat with the given user
export const getRecipientDetails = (currentUser, chatUsers) => {
  const recipient = chatUsers.find((user) => user._id !== currentUser._id);

  return {
    username: recipient.username,
    avatarImage: recipient.avatarImage ?? defaultAvatar
  };
};

// Group messages by date
// Eg - 'Today', 'Yesterday', 'Sun Jan 01' (if date in current year), 'Sun Jan 01 2XXX' (date not in current year)
export const groupMessagesByDate = (messages) => {
  const currentYear = new Date().getFullYear();
  const messageGroups = {};

  messages.forEach((message) => {
    const messageDate = new Date(message.updatedAt);
    const messageYear = messageDate.getFullYear();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateString;
    if (messageDate.toDateString() === today.toDateString()) {
      dateString = 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      dateString = 'Yesterday';
    } else if (messageYear === currentYear) {
      // Exclude the year
      dateString = messageDate.toDateString().slice(0, -5);
    } else {
      dateString = messageDate.toDateString();
    }

    if (!messageGroups[dateString]) {
      messageGroups[dateString] = [];
    }
    messageGroups[dateString].push(message);
  });

  return messageGroups;
};

export const formatTime = (timeValue) => timeValue.toString().padStart(2, '0');

export const isValidUsername = (username) => {
  const allowedCharsRegex = /^[a-zA-Z0-9@_]*$/;
  return allowedCharsRegex.test(username);
};
