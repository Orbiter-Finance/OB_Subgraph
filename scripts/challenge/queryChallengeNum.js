const axios = require('axios');
// const fs = require('fs');
const testAPI =
  'https://api.studio.thegraph.com/proxy/49058/cabin/version/latest/';
const dataArray = [];
const newChallengeNodeNumber =
  '0x00000000657bd48c000000000000000500000000009bdcc20000000000000000';
const maker = '0x227d76ab1cea2edfc9a62833af1743259c1f055f';
const mdcAddr = '0xea077bfa948421a6ba2fdce5fb5497b9f9f9836b';

// case1 purose: find parent challengeNodeNumber
axios
  .post(testAPI, {
    query: `
    {
      createChallenges(
          where: {
              challengeNodeNumber_gt: "${newChallengeNodeNumber}"
              challengeManager_: {
                  owner: "${maker}"
                  mdcAddr: "${mdcAddr}"
              }
          }
          orderBy: challengeNodeNumber
          orderDirection: asc
          first: 1
      ) {
          challengeNodeNumber
      }
  }
    `,
  })
  .then((result) => {
    for (const resultGet of result.data.data.createChallenges) {
      console.log('parentChallengeNodeNumber:', resultGet);
      dataArray.push(resultGet);
    }
    // const data = JSON.stringify(dataArray, null, 2);
    // fs.writeFile('./scriptsOutput/output.json', data, (err) => {
    //     if (err) throw err;
    // });
  })
  .catch((error) => {
    console.log(error);
  });

// case2 purose: query challengeList which is sorted by challengeNumber
axios
  .post(testAPI, {
    query: `
    {
        createChallenges(
          orderBy: challengeNodeNumber
          orderDirection: desc
          where: {challengeManager_: {challengeStatuses: CREATE}}
        ) {
          challengeId
        }
      }
    `,
  })
  .then((result) => {
    for (const resultGet of result.data.data.createChallenges) {
      console.log(
        `challengeList[${result.data.data.createChallenges.indexOf(
          resultGet,
        )}]: ${resultGet.challengeId}`,
      );
      dataArray.push(resultGet);
    }
    // const data = JSON.stringify(dataArray, null, 2);
    // fs.writeFile('./scriptsOutput/output.json', data, (err) => {
    //     if (err) throw err;
    // });
  })
  .catch((error) => {
    console.log(error);
  });
