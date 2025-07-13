var axios = require("axios");
var fs = require("fs");

const regionCode = ["DE", "PL", "LT", "LV", "EE", "FI", "SE", "NO"];

return axios
  .get(`https://api.ebird.org/v2/ref/hotspot/${regionCode}`, {
    params: {
      fmt: "json",
      key: "vcs68p4j67pt",
    },
  })
  .then((res) => {
    console.log(`✅ Fetched ${res.data.length} hotspots from eBird API.`);
    fs.writeFileSync("./data/hotspots.json", JSON.stringify(res.data, null, 2));
  })
  .catch((error) => {
    console.log(error);
  });
