const axios = require('axios');
const fs = require('fs');

const dataArray = [];

axios.post('https://api.studio.thegraph.com/query/49058/cabin/version/latest',{
    query: `
    {
      historyBlocksRootSaveds {
        id
        blocksRoot
      }
    }`
}).then((result) => {
    for (const resultGet of result.data.data.historyBlocksRootSaveds) {
        console.log(resultGet);
        dataArray.push(resultGet);
    }
    const data = JSON.stringify(dataArray, null, 2);
    // fs.writeFile('./scriptsOutput/output.json', data, (err) => {
    //     if (err) throw err;
    // });
}).catch((error) => {
    console.log(error);
});