const CryptoJS = require('crypto-js');  //引用AES源码js

//解密方法
function Decrypt(word, key, iv) {
    
    return CryptoJS.enc.Base64.parse(word).toString(CryptoJS.enc.Utf8)
}

//加密方法
function Encrypt(word, key, iv) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

export default {
    Decrypt,
    Encrypt
}