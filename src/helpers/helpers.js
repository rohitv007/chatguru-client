import { defaultAvatar } from './constants';

// Return details of the recipient of a chat with the given user
export const getRecipientDetails = (currentUser, chatUsers) => {
  const recipient = chatUsers.find((user) => user._id !== currentUser._id);

  return {
    username: recipient.username,
    avatarImage: recipient.avatarImage ?? defaultAvatar
  };
};

// Group messages by date. Eg - today, yesterday,
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
      dateString = messageDate.toLocaleDateString('default', {
        year: '2-digit'
      });
    } else {
      dateString = messageDate.toLocaleDateString('default', {
        year: 'numeric'
      });
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
