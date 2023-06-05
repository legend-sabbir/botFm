const express = require('express');
const axios = require("axios")
const cors = require('cors');
const app = express();
app.use(cors());

const token = process.env.TOKEN
const challenges = []
let users = []
let followings = []
const load = process.env.LOAD
const sleep = (ms) =>  new Promise(resolve => setTimeout(resolve, ms)) 

async function getSolutions(i) {
  try {
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Authorization': token,
      'If-None-Match': 'W/"3723c-+p5Fh0fkEzuSdIi81Sj4OlsdxdA"',
      'Origin': 'https://www.frontendmentor.io',
      'Referer': 'https://www.frontendmentor.io/',
      'Sec-Ch-Ua': '"Not:A-Brand";v="99", "Chromium";v="112"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 9; JKM-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
    };
    const response = await axios.get(`https://backend.frontendmentor.io/rest/v2/solutions?page=${i}`, null, {
      headers
    });
    
    const responseData = response.data.data
    
    for (let i = 0, len = responseData.length; i < len; i++) {
      const challenge = responseData[i]
      if (!challenge.likes.includes("6427d32faa082d10e4063c82")) {
        challenges.push(challenge.id)
      }
      
      users.push(challenge.user)
    }
  } catch (error) {
    console.log("fail load:" + i);
  }
}

async function loadSolutions() {
  for (let i = 1; i <= load; i++) {
    await getSolutions(i)
  }
}

async function likeSolution(id) {
  try {
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Authorization': token,
      'Content-Length': '0',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://www.frontendmentor.io',
      'Referer': 'https://www.frontendmentor.io/',
      'Sec-Ch-Ua': '"Not:A-Brand";v="99", "Chromium";v="112"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 9; JKM-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
    };
    const response = await axios.post(`https://backend.frontendmentor.io/rest/v2/solutions/${id}/like`, null, {
      headers
    });
  } catch (error) {
    console.log("fail like: " + id);
  }
}

async function likeSolutions() {
  for (let i = 0, len = challenges.length; i < len; i++) {
    await likeSolution(challenges[i])
    await sleep(1000)
  }
}

async function followUser(user) {
  try {
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Authorization': token,
      'Content-Length': '0',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://www.frontendmentor.io',
      'Referer': 'https://www.frontendmentor.io/',
      'Sec-Ch-Ua': '"Not:A-Brand";v="99", "Chromium";v="112"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 9; JKM-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
    };
    const response = await axios.post(`https://backend.frontendmentor.io/rest/v2/auth/profile/follow/users/${user}`, null, {
      headers
    });
  } catch (error) {
    console.log("fail follow: " + user);
  }
}

async function getFollowings() {
  try {
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Authorization': token,
      "If-None-Match": 'W/"3002-3pepCvJ2nGOjrvkiMuV5kgGE45s"',
      'Origin': 'https://www.frontendmentor.io',
      'Referer': 'https://www.frontendmentor.io/',
      'Sec-Ch-Ua': '"Not:A-Brand";v="99", "Chromium";v="112"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 9; JKM-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
    };
    
    const response = await axios.get(`https://backend.frontendmentor.io/rest/v2/auth/profile/following`, {
      headers
    });
    followings = response.data.data.map(item => item.id)
  } catch (error) {
    console.log("fail load following");
  }
}

async function followUsers() {
  users = [...new Set(users)]
  for (let i = 0, len = users.length; i < len; i++) {
    const user = users[i]
    if (followings.includes(user)) continue;
    await followUser(user)
    await sleep(1500)
  }
}

async function unfollowUsers() {
  for (let i = 0, len = followings.length; i < len; i++) {
    const user = followings[i]
    await followUser(user)
    await sleep(1500)
  }
}


app.get("/get", (req, res) => {
  res.send("hello")
})

app.get("/start", (req, res) => {
  res.send("Started")
  loadSolutions()
    .then(() => console.log("loadedSolutions"))
    .then(likeSolutions)
    .then(() => console.log("likedSolutions"))
    .then(getFollowings)
    .then(() => console.log("loadedFollowers"))
    .then(followUsers)
    .then(() => console.log("done"))
    .catch(console.error)
})

app.get("/unfollow", (req, res) => {
  res.send("unfollow")
  getFollowings()
    .then(unfollowUsers)
    .then(() => console.log("done"))
    .catch(console.error)
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});