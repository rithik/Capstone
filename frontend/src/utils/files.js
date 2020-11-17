// convert file to base64
// base64 to encrypted
// return base64

/**
 * {
 *  content: xyz,
 *  filename: app.pdf
 * }
 * 
 */

// https://github.com/Detaysoft/react-chat-elements
// https://stackoverflow.com/questions/46119987/upload-and-read-a-file-in-react

import CryptoJS from "crypto-js";
import { saveAs } from 'file-saver';

export const convertFileToBase64 = (event, groupId, createMessage, username) => {
    if (event.target.files == null){
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = function(e) {
        const cType =  (event.target.files[0].type.includes("image/")) ? 'photo' : 'file';
        var rawLog = reader.result;
        const message = encryptFile(rawLog, event.target.files[0].name, groupId);   
        createMessage({ variables: { username, gid: groupId, content: message, cType } }); 
    };
}

export function encryptFile(message, filename, groupId){
    var messageJSON = {"content": message, "filename": filename};
    var messageString = JSON.stringify(messageJSON);
    const groupPrivateKey = localStorage.getItem(`${groupId}-privateKey`);
    const encrypted = CryptoJS.AES.encrypt(messageString, groupPrivateKey).toString();
    return encrypted;
}

export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], filename, {type:mime});
    saveAs(file, filename);
}
