# User Friendship Management 

Simple and lightweight Node.js service that utilizes an SQLite3 in-memory database. The service is designed to provide functionality for managing friendships and n level connections between users.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Task](#task)


## Features

#### Key Features

- Friendship Management: Implement friend and unfriend routes for instant changes to the Add/Remove button and connection badges on the UI
- Search Functionality: A search route allows users to find friends and connections based on their name.


## Prerequisites

- Node version - 20.10.0 (LTS)
- NPM version - 10.2.3
- `1st` Badge means the friend is a direct connection
- `2nd` Badge means the friend is a 2 level connection ie friend-of-friend
- `3rd` Badge means the friend is a 3 level connection ie friend-of-friend-of-friend and so on ..

## Installation

```
  npm install
  npm run start
```

## Usage

Once the seed data is inserted in sqlite database that could take a few mins depending upon the dataset, the html with default userId `1337` should be accessible at [http://localhost:3001]()

## API Routes

- ```/api/search/:userId/:query``` - Search friends and connection to specific userId and filter on friend names with a limit of 20 records 
- ```/api/friend/:userId/:friendId``` - Create record of userId & friendId friendship on Add button action
- ```/api/unfriend/:userId/:friendId``` - Delete record of userId & friendId friendship on Remove button action

## Database Schema 

The service uses a simple SQLite3 database with two tables:

Table Structure

- Users: Contains user information with columns `id` and `name`
- Friends: Represents friendships with columns `id`, `userId`, `friendId`

Constraints: 

- `Users(id)` - Primary key and auto increment
- `Friends(id)` - Primary key and auto increment
- `Friends(userId)` - Foreign key with Reference `Users(id)`
- `Friends(friendId)` - Foreign key with Reference `Users(id)`
- `Friends(userId, friendId)` - Unique

Indexes: 

- `Users(name)`
- `Friends(userId, friendId)`

## Task

1) ✅ Implement the friend and unfriend routes. These should result in an instant change of the Add/Remove button and the (1st) badge if implemented correctly. 
 
2) ✅ Modify the search route to return a 2nd connection result. That is, the field connection should be 2 if the user is a friend-of-a-friend but isn't a direct friend. (Direct friend should still return 1, and any other result should still be 0.) In the frontend, search results who are &quot;your&quot; friend-of-a-friend should show up with a (2nd) badge if this works correctly. Try to keep this route performant, so that the list still updates instantly as you type the search query. Please, document any changes you might need to make to the database (if any).

3) ✅ Can you get this to work for 3rd and 4th connections as well? (So a 3rd connection is someone who is a friend-of-a-friend-of-a-friend, but isn&#39;t your 1st or 2nd connection.) What do you need to modify to keep the performance? If you can&#39;t get reasonable performance, please explain what the limiting factors are.

- Although the recursive function implemented will support n-level but the API response time significantly takes a hit when considering data set of 27k users 
- 2nd level connection search take an average of 30ms (Default case)
- 3rd level connection search take an average of 400ms 
- 4th level connection search take an average of 1.5s
- Adjust the level [here](https://github.com/Ansh-dhingra/user-friendship-management/blob/20cfe0bb7bf4c009c2fdf4ac01a69f135f721450/src/services/searchService.js#L17) to enable 3/4th level connection badges

How to improve the performance?
- If we store the depth of the user-friend and beyond as defined level relationship while adding and handle the same in removal in friends table we could potentially be saving a lot of processing at the database layer by escaping the recursive joins at each incremental level
- Precompute the results of the commonly used  

Drawbacks 
- Increase in storage as this will create all level of friendship at the time of add request
- Way too much time to add/remove high number level connections that would lead to bad UX  
- Also consider adding another column to store the original association of the friend in case of removal only the linked friendId connection should be removed

4) ✅ Do you have any additional recommendations about how this service should be set up that might go beyond constraints set below? 

\
Different SQL Database 
- Using a different database such as PostgreSQL will help us with large dataset, scalability & high number of concurrent user connections
- ORM such as Sequelise can be used for abstraction and to simplify database interactions

Graph Database 

- We can also consider using Graph database such as Neo4j or Amazon Neptune that basically are ideal for complex entity relationship such as managing friends and connections upto n level. 
- Faster response time as compared to our traditional relation databases.
- Although graph database are complex in nature but the query language can help us to easily write and understand queries for friend connections and relationships

General recommendations

- Add a loader to improve UX on Add/Remove button
- Add a slight delay for user to type in what they're searching for or add a search button to only trigger API call when required
