import JSEncrypt from 'jsencrypt';
import CryptoJS from "crypto-js";

export function encryptMessage(message, type, groupId){
    var messageJSON = {"message": message, "type":type}
    var messageString = JSON.stringify(messageJSON);
    const groupPrivateKey = localStorage.getItem(`${groupId}-privateKey`);
    const encrypted = CryptoJS.AES.encrypt(messageString, groupPrivateKey).toString();
    return encrypted;
}

export function decryptMessage(message, groupId){
    const groupPrivateKey = localStorage.getItem(`${groupId}-privateKey`);
    const decrypt = CryptoJS.AES.decrypt(message, groupPrivateKey);
    return JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
}

export function encryptMessageForPrivateKey(message, user){
    var crypt = new JSEncrypt();
    crypt.setPublicKey(user.publicKey);
    const encrypted = crypt.encrypt(message);
    return encrypted;
}

export function decryptMessageForPrivateKey(message){
    var crypt = new JSEncrypt();
    crypt.setPrivateKey(localStorage.getItem('user-privateKey'));
    const decrypted = crypt.decrypt(message);
    return decrypted;
}
