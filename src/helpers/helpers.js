// comparing 'Chat' users array with currently logged-in user
// Return - opposite user

export const getRecipientDetails = (user, users) => {
  // console.log(user);
  // console.log(users);

  const recipient = user._id === users[0]._id ? users[1] : users[0];
  const username = recipient.username;
  const userImage = recipient.pic;

  return { username, userImage };
};

// Group messages by date. Eg - today, yesterday,
export const setMessagesByDate = (messages) => {
  const currentYear = new Date().getFullYear();
  const groups = {};

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
      dateString = messageDate.toDateString().slice(0, -5); // Exclude the year
    } else {
      dateString = messageDate.toDateString();
    }

    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    groups[dateString].push(message);
  });

  return groups;
};

export const setMessageTimeFormat = (value) => {
  return value.toString().padStart(2, '0');
};

export const validateUsername = (username) => {
  // Only alphanumeric characters, underscores and @
  const regex = /^[a-zA-Z0-9@_]*$/;
  return regex.test(username);
};
