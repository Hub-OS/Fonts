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
    "ワヲヴー",
  ],

  "katakana-small": ["ァィゥェォ", "ッ", "ャュョ"],
};

const fonts = [
  {
    name: "THICK",
    xStart: 1,
    xStride: 8,
    yStride: 12,
    frameAttributes: "w=7 h=12 originy=1",
  },
  {
    name: "THIN",
    xStart: 1,
    xStride: 8,
    yStride: 13,
    frameAttributes: "w=7 h=13 originy=1",
  },
  {
    name: "MICRO",
    xStart: 1,
    xStride: 8,
    yStride: 6,
    frameAttributes: "w=5 h=6 originy=1",
    frameAttributeMap: [
      // hiragana
      ["w=6 h=6 originy=1", "ふかみれ"],
      [
        "w=7 h=6 originy=1",
        "がぎぐげご ざじずぜぞ だぢづでど ばびぶべぼ ぱぴぷぺぽ",
      ],
      // katakana
      ["w=6 h=6 originy=1", "ルヴ"],
      [
        "w=7 h=6 originy=1",
        "ガギグゲゴ ザジズゼゾ ダヂヅデド バビブベボ パピプペポ",
      ],
      // katakana-small
      ["w=3 h=6 originy=1", "ァィェ"],
      ["w=4 h=6 originy=1", "ゥォュョ"],
    ],
  },
];

for (const font of fonts) {
  const { xStart, xStride, yStride } = font;

  // invert frame attribute map for faster lookup
  const frameAttributeMap = {};

  if (font.frameAttributeMap) {
    for (const [attributes, graphemes] of font.frameAttributeMap) {
      for (const grapheme of graphemes) {
        frameAttributeMap[grapheme] = attributes;
      }
    }
  }

  // create sheets
  for (const sheetSuffix in sheetLayouts) {
    const sheetLayout = sheetLayouts[sheetSuffix];

    const content = sheetLayout
      .flatMap((line, y) =>
        line.split("").map((grapheme, x) => {
          const codePoint = grapheme.codePointAt(0);
          const codePointHex = codePoint.toString(16).toUpperCase();

          const attrs = frameAttributeMap[grapheme] ?? font.frameAttributes;

          return [
            `animation state="${font.name}_U+${codePointHex}"`,
            `frame x=${xStart + x * xStride} y=${y * yStride} ${attrs}`,
          ].join("\n");
        })
      )
      .join("\n\n");

    fs.writeFileSync(`fonts/${font.name}-${sheetSuffix}.animation`, content);
  }
}
