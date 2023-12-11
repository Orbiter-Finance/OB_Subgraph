const axios = require('axios');
// const fs = require('fs');
const testAPI =
  'https://api.studio.thegraph.com/query/49058/cabin/version/latest';

const maker = '0x227d76ab1cea2edfc9a62833af1743259c1f055f';
const mdcAddress = '0xaabe9fec8ad02ccf32f1433bc013eb812948498a';
const txTimestamp = '1701761838';

//purose: serach ColumnArray value
axios
  .post(testAPI, {
    query: `
    {
        columnArraySnapshots(
            where: {
                enableTimestamp_lt: "${txTimestamp}",
                mdc_: {
                    id: "${mdcAddress}"
                    owner: "${maker}"
                }
            }
            first: 1
        ) {
            dealers
            ebcs
            chainIds
        }
    }
    `,
  })
  .then((result) => {
    for (const resultGet of result.data.data.columnArraySnapshots) {
      console.log('columnArray:', resultGet);
    }
  })
  .catch((error) => {
    console.log(error);
  });
