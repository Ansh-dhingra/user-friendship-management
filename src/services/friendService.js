const db = require('../db/sqlite');

const addFriend = async (userId, friendId) => {
  const sqlQuery = `INSERT INTO Friends (userId, friendId) 
  VALUES 
    (${userId}, ${friendId}),
    (${friendId}, ${userId});`
  await db.run(sqlQuery);
}

const removeFriend = async (userId, friendId) => {
  const sqlQuery = `DELETE from Friends WHERE (userId = ${userId} AND friendId = ${friendId}) OR (userId = ${friendId} AND friendId = ${userId})`;
  await db.run(sqlQuery);
}

module.exports = {
  addFriend,
  removeFriend
}; 

/* Took more than expected time to fill in the depth time */
// const addFriend = async (userId, friendId) => {
//   const sqlQuery = `
//     -- Update 1st level friends for user and friend
//     INSERT INTO Friends (userId, friendId, depth, associationId)
//     VALUES (${userId}, ${friendId}, 1, ${friendId}), (${friendId}, ${userId}, 1, ${userId});

//     -- Update 2nd level friends-of-friends for user
//     INSERT INTO Friends (userId, friendId, depth, associationId)
//       SELECT F1.userId, F2.friendId, 2, ${friendId}
//       FROM Friends F1
//       JOIN Friends F2 ON F1.friendId = F2.userId
//       WHERE F1.userId = ${userId}
//       AND F2.friendId = ${friendId};

//     -- Update 2nd level friends-of-friends for friend
//     INSERT INTO Friends (userId, friendId, depth, associationId)
//       SELECT F1.userId, F2.friendId, 2, ${userId}
//       FROM Friends F1
//       JOIN Friends F2 ON F1.friendId = F2.userId
//       WHERE F1.userId = ${friendId}
//       AND F2.friendId = ${userId};
//   `;
//   await db.run(sqlQuery);
// }

/* To keep the unfriend and then search response quick can't use this */
// const removeFriend = async (userId, friendId) => {
//   const sqlQuery = `
//     DELETE from Friends 
//     WHERE 
//       (userId = ${userId} AND friendId = ${friendId} AND depth = 1)
//       OR (userId = ${friendId} AND friendId = ${userId} AND depth = 1)
//       OR (userId = ${userId} AND associationId = ${friendId} AND friendId IN (SELECT friendId FROM friends WHERE depth = 1 AND userId = ${friendId}))
//       OR (userId = ${friendId} AND associationId = ${userId} AND friendId IN (SELECT friendId FROM friends WHERE depth = 1 AND userId = ${userId}));
//   `;
//   await db.run(sqlQuery);
// }