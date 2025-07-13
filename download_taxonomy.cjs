var ebird = require("ebird-js");
var fs = require("fs");

var params = {
  locale: "en_UK",
  version: "2024",
};

ebird.ref
  .taxa(params)
  .then((data) => {
    // An array of observations
    console.log(`✅ Fetched ${data.length} taxa from eBird API.`);
    fs.writeFileSync("./data/ebird_taxonomy.json", JSON.stringify(data, null, 2));
  })
  .catch((error) => {
    console.log(error);
  });
