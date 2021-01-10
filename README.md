## Inspiration

We love sharing images on discord, right? How amazing it will be if a bot can tag the photo if you are in it? 
Now your friends will be tagged automatically when you post their photo!

## What it does

TagBot is a discord bot that automatically detects and tags people in the image when it is sent in the server. 
When you post a image in the server, it runs a special algorithm, detects and recognizes the people in that image, Tags them in the server. 
User can opt for this just by sending one picture of them for initial training. After that the bot is ready to notify them when a his/her image is posted.
User can update and delete their photos too. 

## How we built it

We built it using microservice architecture which is supported by GCP. We have two services. One is discord bot service which interacts with discord messages and other one is recognition service which detects and recognizes the faces from the image. Recognition service also maintains the data of face and corresponding discord ids.

#### 1. Face-Recognition
To recognize the face we used face_recognition python library. Face_recognition detects and recognizes faces from the image, It uses the state-of-the-art dlib machine learning models for inference.

#### 2. Firebase Firestore - GCP
Cloud Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud. We have used it to store user's discord id and corresponding facial encodings into firebase.

#### 3.Discord.js
Discord.js is a powerful node.js module that allows you to interact with the Discord API very easily. We used it to communicate with discord.

## Challenges we ran into

Getting the detection and recognition in limited time was a challenge. All of us have no experience in facial recognition. But we searched and learned about it, tried different libararies and API for the same. We are happy that we can lower the inference time to very low time.

## Accomplishments that we're proud of

We are able to successfully build a scalable system where we can also recognize the faces from a image with multiple faces in it. We are able to acheive very low error-rate by adjusting the threshold value.


## What we learned

Learned face-recognition library, cloud firestore for storing user data. Also developed flask application and node js server for calling the service using endpoints. We have successfully configured our way to coordinate with our teammates. We also learned a lot about structuring our code and microservices architecture.

## What's next for TagBot
We plan to add a capability by which tagbot can also recognize faces from video files.
