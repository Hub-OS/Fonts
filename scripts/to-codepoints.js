const fs = require("fs");

for (const fileName of fs.readdirSync("fonts")) {
  if (!fileName.endsWith(".animation")) {
    continue;
  }

  const filePath = "fonts/" + fileName;
  const contents = fs.readFileSync(filePath, "utf8");

  let index = 0;
  let newContents = "";

  while (true) {
    const start = contents.indexOf(":", index);

    if (start < 0) {
      // include remaining
      newContents += contents.slice(index);
      break;
    }

    // include everything up to the start
    newContents += contents.slice(index, start);

    // resolve end
    const end = contents.indexOf('"', start);

    const grapheme = contents.slice(start + 1, end);

    // add code points
    newContents += "_U+";

    if (grapheme.startsWith("U") && grapheme.length > 1) {
      newContents += grapheme.slice(1);
    } else {
      for (let i = 0; true; i++) {
        const codePoint = grapheme.codePointAt(i);

        if (codePoint == undefined) {
          break;
        }

        if (i > 0) {
          newContents += "_";
        }

        newContents += codePoint.toString(16).toUpperCase().padStart(4, "0");
      }
    }

    index = end;
  }

  fs.writeFileSync(filePath, newContents);
}
