const csv = require("csv-parser");
const fs = require("fs");
const ObjectToCsv = require("objects-to-csv");
const csvWriter = require("csv-write-stream");
const writer = csvWriter();

// Creating the parsed csv file
fs.closeSync(fs.openSync("./parsed.csv", "w"));

writer.pipe(fs.createWriteStream("parsed.csv"));

const results = [];
const parameters = [];

const getSubStr = (str, i, j) => {
  return str.substring(i, j).replace("mm", "");
};

fs.createReadStream("data.csv")
  .pipe(csv({}))
  .on("headers", (headers) => {
    headers.shift();

    for (let head of headers) {
      let temp = [];
      temp.push(getSubStr(head, 19, 22));
      temp.push(getSubStr(head, 29, 32));
      temp.push(getSubStr(head, 39, 42));
      temp.push(getSubStr(head, 49, 52));
      temp.push(getSubStr(head, 61, 64));

      parameters.push(temp);
    }
  })
  .on("data", (data) => {
    if (results.length > 10) return;

    data = Object.values(data);
    const freq = data[0];
    data.shift();

    data.forEach((val, index) => {
      const params = parameters[index];

      writer.write({
        freq,
        A: params[0],
        B: params[1],
        D: params[2],
        h: params[3],
        rad: params[4],
        S11: val,
      });
    });
  })
  .on("end", async () => {
    writer.end();
  });
