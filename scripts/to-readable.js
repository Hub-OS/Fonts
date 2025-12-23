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
    const start = contents.indexOf("_U+", index);

    if (start < 0) {
      // include remaining
      newContents += contents.slice(index);
      break;
    }

    // include everything up to the start
    newContents += contents.slice(index, start);

    // resolve end
    const end = contents.indexOf('"', start);

    const codePointString = contents.slice(start + 3, end);

    // add our char
    const codePoint = parseInt(codePointString, 16);
    let char = String.fromCodePoint(codePoint);

    if (
      char == '"' ||
      char == "\\" ||
      (codePoint >= 0xe000 && codePoint <= 0xf8ff)
    ) {
      // 1. escaping quotes
      // 2. private use range, these don't show up in editors, so it's easier to stick to unicode
      char = "U" + codePointString.toUpperCase();
    }

    newContents += ":" + char;

    index = end;
  }

  fs.writeFileSync(filePath, newContents);
}
