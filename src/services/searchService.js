const db = require('../db/sqlite');

const search = async (query, userId, level = 2) => {
  const sqlQuery = `
    WITH RECURSIVE FriendConnections AS (
      -- Direct friends
      SELECT friendId, 1 AS depth
      FROM Friends 
      WHERE userId = ${userId}
    
      UNION
    
      -- Friends-of-friends
      SELECT F.friendId, FC.depth + 1
      FROM Friends F
      JOIN FriendConnections FC ON F.userId = FC.friendId
      WHERE FC.depth < ${level} -- Limited to 2nd level connections by default
    )
  
    SELECT U.id, U.name, COALESCE(MIN(FC.depth), 0) AS connection
    FROM (
      SELECT id, name FROM Users WHERE id != ${userId} AND name LIKE '${query}%' LIMIT 20
    ) U
    LEFT JOIN FriendConnections FC ON U.id = FC.friendId
    GROUP BY U.id;
  `;
  const result = await db.all(sqlQuery);
  return result;
}

module.exports = {
  search,
}; 

/* Previously tried approaches but were not consistent with the search performance when tried with 27k users */

// const searchWithJoins = async (query, userId, all = 0) => {
//   if(all) {
//     const res = await searchAllDirectFriends(query, userId);
//     return res;
//   }
//   const sqlQuery = `
//   WITH UserFriends AS (
//       SELECT friendId FROM Friends WHERE userId = ${userId}
//     ),
//     FriendOfFriend AS (
//       SELECT DISTINCT F.userId AS friendId
//       FROM Friends F
//       JOIN UserFriends UF ON F.friendId = UF.friendId
//     )
//     SELECT U.id,
//       U.name,
//       CASE
//         WHEN UF.friendId IS NOT NULL THEN 1  -- Friend
//         WHEN FOF.friendId IS NOT NULL THEN 2 -- Friend of Friend
//         ELSE 0 -- No Connection
//       END AS connection
//     FROM Users U
//     LEFT JOIN UserFriends UF ON U.id = UF.friendId
//     LEFT JOIN FriendOfFriend FOF ON U.id = FOF.friendId
//     WHERE U.name LIKE '${query}%' AND U.id != ${userId}
//     LIMIT 20;
//   `;
//   const result = await db.all(sqlQuery);
//   return result;
// }

// const searchWithDepth = async (query, userId, all = 0) => {
//   const sqlQuery = `
//     SELECT 
//       U.id,
//       U.name,
//       CASE
//         WHEN F.depth IS NOT NULL THEN F.depth  -- Direct Connection
//         ELSE 0                  -- No Connection
//       END AS connection
//     FROM Users U
//     LEFT JOIN Friends F ON U.id = F.friendId AND F.userId = ${userId}
//     WHERE U.name LIKE '${query}%' AND U.id != ${userId}
//     GROUP BY U.id, U.name
//     LIMIT 20;
//   `;
//   const result = await db.all(sqlQuery);
//   return result;
// }
