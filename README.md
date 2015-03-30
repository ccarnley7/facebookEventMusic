# facebookEventMusic
byu cs462 final project.
This project will solve the problem of creating a custom music playlist that best suites a group of people.
  ##Event Architecture
  -when someone creates a party event on facebook this will triger a event that is raised to a node.js server. the server will then create a custom music playlist on spotify. When ever a new guest accepts the party event this will raise an event to the server which will then retrieve information about all the current poeple attending the party and update spotify's playlist accordingly.
  ##APIs
  -Facebook
  -Spotify
  -Costom created server API
  ![design idea](https://raw.githubusercontent.com/ccarnley7/facebookEventMusic/master/Slide1.jpg)
