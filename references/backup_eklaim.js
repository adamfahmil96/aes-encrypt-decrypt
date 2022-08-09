const crypto = require('crypto');
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
    let keys = Buffer.from(key,'hex');
    //make data to binary type, stored in Buffer
    let data_decoded = Buffer.from(data, 'base64');
    //make iv to binary type, stored in Buffer
    let iv = Buffer.from(data_decoded.slice(10, 26));
    //create Deciper with IV to decode data
    let dec = crypto.createDecipheriv('aes-256-cbc',keys,iv);
    //cutting data that has binary type -- 26 is 10 for char and 16 for IV for aes-256-cbc
    let encoded = Buffer.from(data_decoded.slice(26))
    //take Signature
    let signature = data_decoded.slice(0, 10);
    //check if signature is right
    if(!oms_compare(signature, encoded)) {
        return "SIGNATURE_NOT_MATCH"; /// signature doesn't match
    }
    //decrypt data
    let decrypted = Buffer.concat([dec.update(encoded), dec.final()]);
    return decrypted.toString('utf8');
}

const oms_encrypt = (data)=>{
    //stringify when data os object
    if(typeof data === 'object'){
        data = JSON.stringify(data);
    }
    //make Key to binary type, stored in Buffer
    let keys = Buffer.from(key,'hex');
    console.log(keys.length);
    //make data to binary type, stored in Buffer
    let data_encoded = Buffer.from(data);
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
    .slice(0,10);
    //concat buffer then return in string encode with base64
    return Buffer.concat([signature,iv,encrypt]).toString('base64');
}

const oms_compare = (signature, encrypt) => {
    let keys = Buffer.from(key,'hex');
    let calc_signature = crypto.createHmac('sha256', keys)
    .update(encrypt)
    .digest()
    .slice(0,10);
    if(signature.compare(calc_signature)===0){
        return true;
    }
        return false;
}

// do the encryption
const data_password = 'Logswalker@!098765';
const result_encrypt = oms_encrypt(data_password);
console.log(result_encrypt);
