const crypto = require('crypto');
const ba = require('binascii');
const key = '45436c61696d4b6579436865636b696e';
const uri = '';

const oms_decrypt = (data)=>{
    //Replacing Text
    if(typeof data==='string'){
        data = data.replace(/----BEGIN ENCRYPTED DATA----|----END ENCRYPTED DATA----/g,'');
    }else{
        return `Should be String input`;
    }
    //make Key to binary type, stored in Buffer
    let keys = Buffer.from(key, 'utf-8');
    //make data to binary type, stored in Buffer
    let data_decoded = Buffer.from(data);
    //make iv to binary type, stored in Buffer
    let iv = Buffer.from(data_decoded.subarray(10, 26));
    //create Deciper with IV to decode data
    let dec = crypto.createDecipheriv('aes-256-cbc',keys,iv);
    //cutting data that has binary type -- 26 is 10 for char and 16 for IV for aes-256-cbc
    let encoded = Buffer.from(data_decoded.subarray(26))
    //take Signature
    let signature = data_decoded.subarray(0, 10);
    //check if signature is right
    if(!oms_compare(signature, encoded)) {
        return "SIGNATURE_NOT_MATCH"; /// signature doesn't match
    }
    //decrypt data
    let decrypted = Buffer.concat([dec.update(encoded), dec.final()]);
    return decrypted.toString('utf-8');
}

const oms_encrypt = (data)=>{
    //stringify when data os object
    if(typeof data === 'object'){
        data = JSON.stringify(data);
    }

    // let padding_len = 16 - (data.length % 16);
    // var a = new Uint8Array(1);
    // a[0] = padding_len;
    // data = data + (utf8decode(a) * padding_len);
    // console.log(data);

    newKey = ba.unhexlify(key);

    //make Key to binary type, stored in Buffer
    let keys = Buffer.from(newKey,'utf8');
    console.log(keys.length);
    //make data to binary type, stored in Buffer
    let data_encoded = Buffer.from(data, 'utf8');
    //make iv 16 byte of random
    let iv = crypto.randomBytes(16);
    //create cyper for encrypt
    let enc = crypto.createCipheriv('aes-256-cbc',keys,iv);
    // encrypt data
    let encrypt = Buffer.concat([enc.update(data_encoded), enc.final()]);
    //create signature
    let signature = crypto.createHmac('sha256', keys)
    .update(encrypt)
    .digest()
    .subarray(0,10);
    //concat buffer then return in string encode with base64
    return Buffer.concat([signature,iv,encrypt]).toString('base64');
}

const oms_compare = (signature, encrypt) => {
    let keys = Buffer.from(key,'utf-8');
    let calc_signature = crypto.createHmac('sha256', keys)
    .update(encrypt)
    .digest()
    .subarray(0,10);
    if(signature.compare(calc_signature)===0){
        return true;
    }
        return false;
}

const utf8decode = (uint8array) => {
    var codePoints = [],
        i = 0,
        byte, codePoint, len = uint8array.length;
    for (i = 0; i < len; ++i) {
        byte = uint8array[i];

        if ((byte & 0xF8) === 0xF0 && len > i + 3) {

            codePoint = ((byte & 0x7) << 18) | ((uint8array[++i] & 0x3F) << 12) | ((uint8array[++i] & 0x3F) << 6) | (uint8array[++i] & 0x3F);
            if (!(0xFFFF < codePoint && codePoint <= 0x10FFFF)) {
                codePoints.push(0xFFFD, 0xFFFD, 0xFFFD, 0xFFFD);
            } else {
                codePoints.push(codePoint);
            }
        } else if ((byte & 0xF0) === 0xE0 && len > i + 2) {

            codePoint = ((byte & 0xF) << 12) | ((uint8array[++i] & 0x3F) << 6) | (uint8array[++i] & 0x3F);
            if (!(0x7FF < codePoint && codePoint <= 0xFFFF)) {
                codePoints.push(0xFFFD, 0xFFFD, 0xFFFD);
            } else {
                codePoints.push(codePoint);
            }
        } else if ((byte & 0xE0) === 0xC0  && len > i + 1) {

            codePoint = ((byte & 0x1F) << 6) | ((uint8array[++i] & 0x3F));
            if (!(0x7F < codePoint && codePoint <= 0x7FF)) {
                codePoints.push(0xFFFD, 0xFFFD);
            } else {
                codePoints.push(codePoint);
            }
        } else if ((byte & 0x80) === 0x00) {
            codePoints.push(byte & 0x7F);
        } else {
            codePoints.push(0xFFFD);
        }
    }
    return String.fromCharCode.apply(String, codePoints);
}

// do the encryption
const data_password = 'Logswalker@!098765';
const result_encrypt = oms_encrypt(data_password);
console.log(result_encrypt);

// do the decryption
// const data_encrypted = 'tdzTfvkzWYrv8DnOuzVzqb8dN2UemcJ5Mg0sIgLTrzPd3lOzWHAitL56QI4HGandexRQEBpNyuIDUg==';
const result_decrypt = oms_decrypt(result_encrypt);
console.log(result_decrypt);
