# Socialnetwork

### Description

This project is a social network SPA for nature lovers in Berlin. It is the first project I made using React.js, a framework that I love working with.

Users can create an account and connect with other members directly by making friend connections or by chatting on the message board.

### Technology

* Node/Express server
* React.js framework with Redux and Socket.io
* PostgreSQL database
* User files uploaded to AWS
* Testing with Jest and React Testing Library

### Features

**User account**

* Users create an account with their email address, which they use to sign in
* If a user forgets their password they can request a secret code to be emailed to them, which will allow them to create a new password
* Once logged in, users can upload a profile picture and provide a bio

**Friends**

* The profiles of other members can then be viewed and a friend request sent
* Depending upon the relationship between two users, the profile of other users shows a friend button allowing requests to be accepted, rejected or retracted, or for a friendship to be terminated
* Users can see a list of new members, their friends, and friend requests

**Message board**

* There is a message board, made with Socket.io, where all users are free to chat or make posts
* The message board shows the ten most recent messages and is updated with new messages automatically

**Security**

* User information is protected with bcrypt.js and csurf

### Preview


