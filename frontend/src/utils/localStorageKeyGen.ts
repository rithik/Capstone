import CryptoJS from "crypto-js";

export function encryptLocalStorage() {
    const localStorageString = JSON.stringify(localStorage);
    const hashedPassword: string = localStorage.getItem('password') || '';
    const encrypted = CryptoJS.AES.encrypt(localStorageString, hashedPassword).toString();
    return encrypted;
}

export function setLocalStorage(localStorageString: string, hashedPassword: string) {
    const decrypt = CryptoJS.AES.decrypt(localStorageString, hashedPassword);
    try{
        const localStorageDict = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
        for (const [key, value] of Object.entries(localStorageDict)) {
            localStorage.setItem(key, (value as string));
        }
    }
    catch(e){
        console.error(e);
        return false;
    }
    return true;
}