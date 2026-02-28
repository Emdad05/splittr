#!/usr/bin/env node
// build.js — assemble, minify, and obfuscate app.html from src/ files
const fs   = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const src  = path.join(__dirname,'src');
const out  = path.join(__dirname,'public');
fs.mkdirSync(out,{recursive:true});

const css  = fs.readFileSync(path.join(src,'app.css'),'utf8');
const js   = fs.readFileSync(path.join(src,'app.js'),'utf8');
const body = fs.readFileSync(path.join(src,'body.html'),'utf8');

// Minify CSS
function minCSS(s){
  return s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*([{};:,>+~])\s*/g,'$1').replace(/\s+/g,' ').replace(/;\}/g,'}').trim();
}
// Strip block comments from JS before obfuscation
function stripComments(s){
  return s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\n{3,}/g,'\n').trim();
}
// Minify HTML
function minHTML(s){
  return s.replace(/<!--[\s\S]*?-->/g,'').replace(/\s{2,}/g,' ').replace(/>\s+</g,'><').trim();
}

// Obfuscate JS with javascript-obfuscator
function obfuscateJS(s){
  const result = JavaScriptObfuscator.obfuscate(s, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.5,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.2,
    debugProtection: true,
    debugProtectionInterval: 2000,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,       // keep false so DOM IDs still work
    selfDefending: true,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.75,
    stringArrayEncoding: ['rc4'],
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    splitStrings: true,
    splitStringsChunkLength: 8,
  });
  return result.getObfuscatedCode();
}

console.log('⏳ Building…');
const cleanJS   = stripComments(js);
console.log('⏳ Obfuscating JS (this takes ~10s)…');
const finalJS   = obfuscateJS(cleanJS);
const finalCSS  = minCSS(css);
const finalBody = minHTML(body);

const appHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
<meta name="googlebot" content="noindex, nofollow">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Splittr</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap">
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"><\/script>
<script>(function(){try{if(!document.cookie.includes('splittr_has_session=1')&&localStorage.getItem('splittr_guest')!=='1'){window.location.replace('/');}else{document.documentElement.classList.add('splittr-authed');}}catch(e){}})()</script>
<style>${finalCSS}</style>
</head>
${finalBody}
<script>${finalJS}</script>
</body>
</html>`;

fs.writeFileSync(path.join(out,'app.html'), appHTML);
fs.copyFileSync(path.join(src,'login.html'), path.join(out,'login.html'));
console.log('✅ Build complete');
console.log(`   app.html   ${(appHTML.length/1024).toFixed(1)} KB`);
console.log(`   login.html ${(fs.statSync(path.join(out,'login.html')).size/1024).toFixed(1)} KB`);
