import '../App.css';

export function setCookie(name: string, val: string, exptime: any) {
    const date = new Date();
    const value = val;

    if(exptime === undefined || exptime === null){
        // Set it expire in 7 days by default
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    }
    else {
        // otherwise specify a user set expiration time
        date.setTime(date.getTime() + (exptime));
    }
    

    // Set it
    document.cookie = name+"="+encodeURIComponent(value)+"; expires="+date.toUTCString()+"; path=/";
}

export function getCookie(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    
    if (parts.length === 2) {
        const ppop = parts.pop();
        if (ppop) {
            const cookieValue = ppop.split(";").shift();
            if(cookieValue != null){
                return decodeURIComponent(cookieValue)
            }
        }
    }
}

export function deleteCookie(name: string) {
    const date = new Date();

    // Set it expire in -1 days
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = name+"=; expires="+date.toUTCString()+"; path=/";
}