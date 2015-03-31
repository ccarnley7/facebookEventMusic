# facebookEventMusic
BYU CS462 Final Project.
This project will solve the problem of creating a custom music playlist that best suites a group of people for a specific event.
## Event Architecture
  -When someone creates a party event on Facebook an event will be triggered that is raised to a node.js server. The server will then create a custom music playlist on Spotify through the Spotify API. Whenever a new guest accepts the Facebook party event  an event will be raised on our node.js server which will retrieve information about the guest that added the event from their Spotify information and then add some of their music onto the Spotify playlist for the Facebook event. Thus, for any party or event you can have the perfect music based off of the tastes and interests of those who are attending.
## APIs
-Facebook
-Spotify
-Custom created server API
  ![design idea](https://raw.githubusercontent.com/ccarnley7/facebookEventMusic/master/Slide1.jpg)
  
-Group Members
Adam Burdett and Christian Carnley
