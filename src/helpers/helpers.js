// comparing 'Chat' users array with currently logged in user
// Return - opposite user

export const getSender = (currUser, users) => {
  //   console.log(users);
  //   console.log(currUser);
  return currUser.id === users[0]._id ? users[1].username : users[0].username;
};

export const groupMessagesByDate = (messages) => {
  const currentYear = new Date().getFullYear();
  const groups = {};

  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt);
    const messageYear = messageDate.getFullYear();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateString;
    if (messageDate.toDateString() === today.toDateString()) {
      dateString = "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      dateString = "Yesterday";
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
