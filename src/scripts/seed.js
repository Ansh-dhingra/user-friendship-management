const db = require('../db/sqlite');

const init = async () => {
  await db.run(`
    CREATE TABLE Users (
      id INTEGER PRIMARY KEY, 
      name varchar(32)
    );
    CREATE INDEX idx_users_name ON Users(name);
  `);
  await db.run(`
    CREATE TABLE Friends (
      id INTEGER PRIMARY KEY, 
      userId int, 
      friendId int, 
      FOREIGN KEY (userId) REFERENCES Users(id), 
      FOREIGN KEY (friendId) REFERENCES Users(id),
      UNIQUE (userId, friendId)
    );
    CREATE INDEX idx_friends_uf ON Friends(userId, friendId);
  `);
  const users = [];
  const names = ['foo', 'bar', 'baz'];
  /* Change value back to 27000 */
  for (i = 0; i < 27000; ++i) {
    let n = i;
    let name = '';
    for (j = 0; j < 3; ++j) {
      name += names[n % 3];
      n = Math.floor(n / 3);
      name += n % 10;
      n = Math.floor(n / 10);
    }
    users.push(name);
  }
  const friends = users.map(() => []);
  for (i = 0; i < friends.length; ++i) {
    const n = 10 + Math.floor(90 * Math.random());
    const list = [...Array(n)].map(() => Math.floor(friends.length * Math.random()));
    list.forEach((j) => {
      if (i === j) {
        return;
      }
      if (friends[i].indexOf(j) >= 0 || friends[j].indexOf(i) >= 0) {
        return;
      }
      friends[i].push(j);
      friends[j].push(i);
    });
  }
  console.log("Init Users Table...");
  await Promise.all(users.map((un) => db.run(`INSERT INTO Users (name) VALUES ('${un}');`)));
  console.log("Init Friends Table...");
  await Promise.all(friends.map((list, i) => {
    return Promise.all(list.map((j) => db.run(`INSERT INTO Friends (userId, friendId) VALUES (${i + 1}, ${j + 1});`)));
  }));
  console.log("Ready.");
}
module.exports = {
  init
};
