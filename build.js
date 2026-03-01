// build.js — minify HTML + obfuscate inline JS (lean, no size bloat)
const fs   = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');
const JavaScriptObfuscator = require('javascript-obfuscator');

const PUBLIC = path.join(__dirname, 'public');
const files  = ['index.html', 'login.html', 'app.html', 'privacy.html', 'terms.html'];

// Lean obfuscation — makes code unreadable without bloating file size
const OBFUSCATE_OPTS = {
  compact: true,
  controlFlowFlattening: false,    // skip — major bloat
  deadCodeInjection: false,        // skip — bloat
  debugProtection: true,           // breaks DevTools debugger
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,      // console.log → noop
  identifierNamesGenerator: 'hexadecimal',  // vars become _0x1a2b etc
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: false,
  shuffleStringArray: true,
  splitStrings: false,             // skip — bloat
  stringArray: true,               // moves all strings to encoded array
  stringArrayCallsTransform: false,
  stringArrayEncoding: ['none'],   // no base64 wrapping = no bloat
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersType: 'variable',
  unicodeEscapeSequence: false,
};

const MINIFY_OPTS = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: { level: 2 },
  minifyJS: (code) => {
    if (code.trim().length < 200) return code; // skip tiny snippets
    try {
      return JavaScriptObfuscator.obfuscate(code, OBFUSCATE_OPTS).getObfuscatedCode();
    } catch(e) {
      console.warn('  ⚠ obfuscation failed, using raw:', e.message);
      return code;
    }
  },
  sortAttributes: true,
  sortClassName: true,
};

(async () => {
  console.log('\n🔒 Building obfuscated production files...\n');
  let tb = 0, ta = 0;

  for (const file of files) {
    const fp = path.join(PUBLIC, file);
    if (!fs.existsSync(fp)) continue;
    const src    = fs.readFileSync(fp, 'utf8');
    const before = Buffer.byteLength(src);
    tb += before;
    try {
      const out   = await minify(src, MINIFY_OPTS);
      fs.writeFileSync(fp, out);
      const after = Buffer.byteLength(out);
      ta += after;
      const pct = (((before-after)/before)*100).toFixed(1);
      const arrow = after <= before ? '✅' : '⚠️';
      console.log(`  ${arrow} ${file.padEnd(20)} ${kb(before)} → ${kb(after)}  (${pct}%)`);
    } catch(e) {
      console.error(`  ❌ ${file}: ${e.message}`);
    }
  }

  const pct = (((tb-ta)/tb)*100).toFixed(1);
  console.log(`\n  Total: ${kb(tb)} → ${kb(ta)}  (${pct}%)\n`);
  console.log('✨ Done.\n');
})();

function kb(b){ return (b/1024).toFixed(1)+'kb'; }
