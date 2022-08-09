// import
const CryptoJS = require('crypto-js');

// initiate constant
const data = 'Praktis-LNW';
const keyAES = '45436c61696d4b6579436865636b696e';
const blockSize = 16;

// process iv and key
//// for random IV
// let random_iv = CryptoJS.lib.WordArray.random(blockSize)
// let iv = CryptoJS.enc.Utf8.parse(random_iv);
// for fix IV
let fix_iv = 'PTS&LNWkalibrasi'
let iv = CryptoJS.enc.Utf8.parse(fix_iv);
let key = CryptoJS.enc.Utf8.parse(keyAES);

// function reverse
function reverseSentence(sentence){
    // get last two chars '=='
    lastTwoChar = sentence.substring(sentence.length-2);
    // get string for reverse
    before_rev = sentence.slice(0, -2);
    // reverse
    after_rev = before_rev.split('').reverse().join('') + lastTwoChar;
    return after_rev
}

// encryption
let encrypted = CryptoJS.AES.encrypt(data, key, {iv: iv, mode: CryptoJS.mode.CBC});
encrypted = encrypted.toString();
encrypted = reverseSentence(encrypted)
console.log('--- encrypted:', encrypted);

// decryption
encrypted = reverseSentence(encrypted)
let decrypted = CryptoJS.AES.decrypt(encrypted, key, {iv: iv, mode: CryptoJS.mode.CBC});
decrypted = decrypted.toString(CryptoJS.enc.Utf8);
console.log('--- decrypted:', decrypted);
