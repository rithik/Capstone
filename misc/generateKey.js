function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

async function exportCryptoPublicKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        "spki",
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    console.log(pemExported);
    return pemExported;
}

async function exportCryptoPrivateKey(key) {
    const exported = await window.crypto.subtle.exportKey(
        "pkcs8",
        key
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = window.btoa(exportedAsString);
    const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
    console.log(pemExported);
    return pemExported;
}

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
    var crypt = new JSEncrypt();
    crypt.setPublicKey(publicKey);
    var enc = crypt.encrypt("TEST123t");

    var crypt2 = new JSEncrypt();
    crypt2.setPrivateKey(privateKey);
    var dec = crypt2.decrypt(enc.toString());
    console.log(dec);
});