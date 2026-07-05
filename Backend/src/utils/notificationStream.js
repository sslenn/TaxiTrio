const connections = new Map(); // userId -> Set of res objects

const addConnection = (userId, res) => {
  if (!connections.has(userId)) {
    connections.set(userId, new Set());
  }
  connections.get(userId).add(res);
};

const removeConnection = (userId, res) => {
  const userConnections = connections.get(userId);
  if (userConnections) {
    userConnections.delete(res);
    if (userConnections.size === 0) {
      connections.delete(userId);
    }
  }
};

const sendToUser = (userId, notification) => {
  const userConnections = connections.get(userId);
  if (userConnections) {
    const data = JSON.stringify(notification);
    userConnections.forEach((res) => {
      try {
        res.write(`data: ${data}\n\n`);
      } catch (err) {
        console.error(`Failed to write SSE to user ${userId}:`, err.message);
      }
    });
  }
};

module.exports = {
  addConnection,
  removeConnection,
  sendToUser
};
