# Comment Forest

This is the POC for my learning

## Online demos

Visit `http://staydan.xyz:3001/list`, but it looks like the new remote server needs more modifications. 
- nginx configurations update
- merge two spider into one, so that the comment spider doesn't need to wait for the shop spider finished.
- because of the limitation of dianping.com, needs more ways to get shops.

## Techs

- Use [node-spider-man](https://github.com/DanielZhu/node-spider-man) to fetch data from the internet
- Use Mongodb to store all the formated data
- Use nodejs / Express to setup the backend
- Use websocket to setup the live-time communication between server and client
- Use Angularjs / Pug / Stylus to build the front-end pages

## How to use

#### Start the server

`DEBUG=comment-forest:* npm start` 

Visit `http://localhost:3001/list`

## Previews

<img width="480px" src="https://github.com/DanielZhu/comment-forest/blob/master/extra_previews/list.png">

<img width="480px" src="https://github.com/DanielZhu/comment-forest/blob/master/extra_previews/preview-anim2-scroll-clear.gif">

<img width="480px" src="https://github.com/DanielZhu/comment-forest/blob/master/extra_previews/preview-anim1.gif">


Copyright to @2012-2016 [Staydan.com](http://staydan.com)



