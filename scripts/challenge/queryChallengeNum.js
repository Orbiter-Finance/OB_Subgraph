const axios = require('axios');
// const fs = require('fs');
const testAPI = "https://api.studio.thegraph.com/query/49058/orbiter-dealer/version/latest";
const dataArray = [];
const newChallengeNodeNumber = "0x000000003e6591a0000000000000000500000000001b331c0000000000000000";
const maker = "0xafcfbb382b28dae47b76224f24ee29be2c823648";


// case1 purose: find parent challengeNodeNumber
axios.post(testAPI,{
    query: `
    {
        createChallenges(
            where: {
                challengeNodeNumber_gt: "${newChallengeNodeNumber}", 
                challengeManager_: {owner: "${maker}"}
            }
            orderBy: challengeNodeNumber
            orderDirection: asc
            first: 1
        ) {
            challengeNodeNumber
        }
    }
    `
}).then((result) => {
    for (const resultGet of result.data.data.createChallenges) {
        console.log("parentChallengeNodeNumber:", resultGet);
        dataArray.push(resultGet);
    }
    // const data = JSON.stringify(dataArray, null, 2);
    // fs.writeFile('./scriptsOutput/output.json', data, (err) => {
    //     if (err) throw err;
    // });
}).catch((error) => {
    console.log(error);
});

// case2 purose: query challengeList which is sorted by challengeNumber
axios.post(testAPI,{
    query: `
    {
        createChallenges(
          orderBy: challengeNodeNumber
          orderDirection: desc
          where: {challengeManager_: {challengeStatues: CREATE}}
        ) {
          challengeId
        }
      }
    `
}).then((result) => {
    for (const resultGet of result.data.data.createChallenges) {
        console.log(`challengeList[${result.data.data.createChallenges.indexOf(resultGet)}]: ${resultGet.challengeId}`);
        dataArray.push(resultGet);
    }
    // const data = JSON.stringify(dataArray, null, 2);
    // fs.writeFile('./scriptsOutput/output.json', data, (err) => {
    //     if (err) throw err;
    // });
}).catch((error) => {
    console.log(error);
});