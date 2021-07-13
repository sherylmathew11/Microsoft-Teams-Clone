# Microsoft-Teams-Clone

This is a video chat application which provides a seamless video chat experience between 2 or more users. The main frameworks used to build this web app are **WebRTC**, **PeerJS**, **Socket.io**, **NodeJS**, **ExpressJS**.

## Frameworks used
- **NodeJS**
- **ExpressJS**
- **EJS**
- **Socket.io**
- **WebRTC and PeerJS**

For authentication:
- **Bcrypt**
- **Mongoose**
- **MongoDB (as local database) and MongoDB Atlas (as cloud database)**
- **UUID**
  
## Features

This video chat web application allows multiple meetings to take place at the same time. Each meeting can have mutiple users. The main features of the app are listed below:

![image](https://user-images.githubusercontent.com/66864714/125486886-843ef0ea-cd87-4e68-ad05-02f5520d20ee.png)

### Start Meeting and Join Meeting
You can click on **Start a Meeting** to create a meeting with an auto-generated room ID. Each time you start a meeting, a new unique room ID is automatically generated using UUID (Universally Unique Identifier). Else, if someone has already started a meeting and you want to join that meeting, then you can click on **Join a Meeting** and paste the meeting link and join!

![image](https://user-images.githubusercontent.com/66864714/125482226-c109fc2d-7973-46df-8773-a39239fce1c9.png)

![image](https://user-images.githubusercontent.com/66864714/125482876-429a65f5-aedd-41ba-a010-ead9c6110285.png)


### Mute/Unmute Audio and Stop/Play Video
You can toggle audio stream and video stream with these buttons

![image](https://user-images.githubusercontent.com/66864714/125480487-ba245b89-a687-4a0d-a245-dd17d36ab2bb.png)

### Text Chat
You can also use the text chat feature inside meeting to chat with your friends!

![image](https://user-images.githubusercontent.com/66864714/125480300-d1bacd83-6c8d-4655-8b3d-269aab663fd3.png)

### Leave Meeting
You can use the **Leave** button at the bottom left of the meeting screen to leave the call.

![image](https://user-images.githubusercontent.com/66864714/125480815-ccfc9c7c-5026-4043-9dc2-eb840a9d3541.png)

### Signup
If can create an account by creating a **username** and a **password** and signing up.

![image](https://user-images.githubusercontent.com/66864714/125481220-83259e84-8668-491b-b01a-150a425adb37.png)

### Login
If you've already created an account, you can enter the valid username and password and login.

![image](https://user-images.githubusercontent.com/66864714/125482689-16c7614a-8a36-49f5-8a5d-8ea33ddeb108.png)

### Logout
To logout from the session, you can click on **Logout**

![image](https://user-images.githubusercontent.com/66864714/125482400-f2a67037-fafb-4cdc-bfd3-982ae9ab8eca.png)

To run the project locally,
  - install the dependencies using node package manager (npm)
  - in script.js, change the port for PeerJS from '443' to '3000'
  - run with "node index.js"
