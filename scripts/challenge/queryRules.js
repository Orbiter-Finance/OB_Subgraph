const axios = require('axios');
// const fs = require('fs');
const testAPI =
  'https://api.studio.thegraph.com/query/49058/cabin/version/latest';
const dataArray = [];
const ebcAddr = '0x503d1ac0dd87c66168e795f136ec28e3e83d7641';
const maker = '0xafcfbb382b28dae47b76224f24ee29be2c823648';
const mdcAddr = '0xcb02bede9ba25b63b49b47a157d15df21a2dc032';

// purose: find all rule
axios
  .post(testAPI, {
    query: `
    {
        latestRuleSnapshots(
          where: {
            owner: "${maker}", 
            mdcAddr: "${mdcAddr}", 
            ebcAddr: "${ebcAddr}"
            }
        orderBy: ruleRelSnapshot__version 
        orderDirection : asc
        ) {
          ruleRelSnapshot {
            root
            version
          }
          chain0
          chain1
          chain0Status
          chain1Status
          chain0Token
          chain1Token
          chain0minPrice
          chain1minPrice
          chain0maxPrice
          chain1maxPrice
          chain0WithholdingFee
          chain1WithholdingFee
          chain0TradeFee
          chain1TradeFee
          chain0ResponseTime
          chain1ResponseTime
          chain0CompensationRatio
          chain1CompensationRatio
          enableTimestamp
          latestUpdateBlockNumber
        }
      }
    `,
  })
  .then((result) => {
    for (const resultGet of result.data.data.latestRuleSnapshots) {
      console.log('latestRuleSnapshots:', resultGet);
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
