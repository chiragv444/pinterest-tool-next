const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sourcePath = path.join(__dirname, '..', 'src', 'lib', 'pinterestSecurity.js');
const source = fs.readFileSync(sourcePath, 'utf8')
  .replace("import crypto from 'crypto';", "const crypto = require('crypto');")
  .replace(/export const /g, 'const ')
  .replace(/export /g, '');

const sandbox = {
  require,
  console,
  module: { exports: {} },
  exports: {},
  process,
};
sandbox.global = sandbox;
vm.runInNewContext(`${source}\nmodule.exports = { validatePinterestUrl, generatePinterestSignature, verifyPinterestSignature, normalizePinterestResponse };`, sandbox);

const { validatePinterestUrl } = sandbox.module.exports;

assert.equal(
  validatePinterestUrl('https://in.pinterest.com/pin/543739355036137725/'),
  true,
  'should accept Pinterest country-subdomain URLs'
);

assert.equal(
  validatePinterestUrl('https://www.pinterest.com/pin/543739355036137725/'),
  true,
  'should still accept www Pinterest URLs'
);

console.log('Pinterest URL validation tests passed');
