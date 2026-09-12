# Kanban

A simple Kanban project built with **Vue.js**, **Node.js**, and **MongoDB**.

## Frontend – Vue.js

Go to the frontend project folder and run:

```bash
npm install
npm run serve
```

Then open:

**http://localhost:8081/**

## Backend – Node.js

Open a terminal in the `kanban/backend_node` folder:

```bash
npm install
npm start
```

The backend runs on **port 8082**.

---

## MongoDB Atlas

You can use MongoDB Atlas as the online database.

### 1. Create a MongoDB Atlas account

Go to:

https://www.mongodb.com/cloud/atlas

Then:

1. Create a free cluster.
2. Configure the network access and allow `0.0.0.0/0` if you want to allow connections from any IP.
3. Create a database user and password.
4. Go to **Database → Connect → Connect your application** and copy the connection string.

### 2. Configure the project

In the `backend_node` folder, install `dotenv`:

```bash
npm install dotenv
```

Create a `.env` file inside `backend_node`:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/kanban?retryWrites=true&w=majority
PORT=8082
```

Replace:

* `YOUR_USERNAME` with your MongoDB username
* `YOUR_PASSWORD` with your MongoDB password
* `YOUR_CLUSTER` with your MongoDB cluster address

Then start the backend:

```bash
node server.js
```

> Keep your `.env` file private and do not commit it to GitHub.

---

## MongoDB Local (Optional)

If you prefer to use MongoDB locally:

1. Install MongoDB.
2. Make sure MongoDB is running on port `27017`.
3. Create a database named `kanban`.
4. Update your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/kanban
PORT=8082
```

Then start the backend:

```bash
node server.js
```

---

## Tech Stack

* Vue.js
* Node.js
* MongoDB / MongoDB Atlas
* Express.js
