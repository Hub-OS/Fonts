// execute from project root:
// `node scripts/generate-kana-anim.js`

const fs = require("fs");

const sheetLayouts = {
  hiragana: [
    "あいうえお",
    "かきくけこ",
    "がぎぐげご",
    "さしすせそ",
    "ざじずぜぞ",
    "たちつてと",
    "だぢづでど",
    "なにぬねの",
    "はひふへほ",
    "ばびぶべぼ",
    "ぱぴぷぺぽ",
    "まみむめも",
    "やゆよ",
    "らりるれろ",
    "わをんゔ",
  ],

  "hiragana-small": ["ぁぃぅぇぉ", "っ", "ゃゅょ"],

  katakana: [
    "アイウエオ",
    "カキクケコ",
    "ガギグゲゴ",
    "サシスセソ",
    "ザジズゼゾ",
    "タチツテト",
    "ダヂヅデド",
    "ナニヌネノ",
    "ハヒフヘホ",
    "バビブベボ",
    "パピプペポ",
    "マミムメモ",
    "ヤユヨ",
    "ラリルレロ",
    "ワヲヴ",
  ],

  "katakana-small": ["ァィゥェォ", "ッ", "ャュョ"],
};

const fonts = [
  {
    name: "THICK",
    xStart: 1,
    xStride: 8,
    yStride: 12,
    frameDetails: "w=7 h=12 originy=1",
  },
  {
    name: "THIN",
    xStart: 1,
    xStride: 8,
    yStride: 13,
    frameDetails: "w=7 h=13 originy=1",
  },
];

for (const font of fonts) {
  const { xStart, xStride, yStride, frameDetails } = font;

  for (const sheetSuffix in sheetLayouts) {
    const sheetLayout = sheetLayouts[sheetSuffix];

    const content = sheetLayout
      .flatMap((line, y) =>
        line.split("").map((grapheme, x) => {
          const codePoint = grapheme.codePointAt(0);
          const codePointHex = codePoint.toString(16).toUpperCase();

          return [
            `animation state="${font.name}_U+${codePointHex}"`,
            `frame x=${xStart + x * xStride} y=${y * yStride} ${frameDetails}`,
          ].join("\n");
        })
      )
      .join("\n\n");

    fs.writeFileSync(`fonts/${font.name}-${sheetSuffix}.animation`, content);
  }
}
