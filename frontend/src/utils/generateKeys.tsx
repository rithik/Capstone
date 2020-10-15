import '../App.css';
import {setCookie, getCookie, deleteCookie} from './cookieManager'

function ab2str(buf: any) {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

async function exportCryptoPublicKey(key: any) {
    const exported = await window.crypto.subtle.exportKey(
        "spki",
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    return pemExported;
}

async function exportCryptoPrivateKey(key: any) {
    const exported = await window.crypto.subtle.exportKey(
        "pkcs8",
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
    return pemExported;
}


function generateKeys(username: string, e: any){
	e.preventDefault()
	console.log("Register Button Clicked")
	window.crypto.subtle.generateKey({
	        name: "RSA-OAEP",
	        modulusLength: 4096,
	        publicExponent: new Uint8Array([1, 0, 1]),
	        hash: "SHA-256",
	    },
	    true,
	    ["encrypt", "decrypt"]
	).then(async (keyPair) => {
	    const publicKey = await exportCryptoPublicKey(keyPair.publicKey);
	    const privateKey = await exportCryptoPrivateKey(keyPair.privateKey);
	    console.log(publicKey)


	    setCookie('privateKey', privateKey, null)
	    console.log(username)
	    console.log(getCookie('privateKey'))
	});
}

export default generateKeys;