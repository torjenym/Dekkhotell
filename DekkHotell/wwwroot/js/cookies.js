var MytokenInMemory = null;

function setAuthCookie(username, token) {
    let myDate = new Date();
    myDate.setTime(myDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
    let expires = "; expires=" + myDate.toUTCString();
    document.cookie = "dekkhotell_username" + "=" + (username || "") + expires + "; path=/";
    document.cookie = "dekkhotell_token" + "=" + (token || "") + expires + "; path=/";
    localStorage.setItem('dekkhotell_token', token);
    MytokenInMemory = token;
}

function removeAuthCookie() {
    document.cookie = "dekkhotell_username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "dekkhotell_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('dekkhotell_token');
    MytokenInMemory = null;
}

function readAuthCookie(cookie) {
    return getCookie(cookie);
}

function getCookie(name) { // for now only get token
    if (MytokenInMemory) {
        // fastest way to get the token
        return MytokenInMemory;
    }

    if (localStorage.getItem('dekkhotell_token')) {
        // second fastest way to get the token
        return localStorage.getItem('dekkhotell_token');
    }

    // fallback to the slowest way to get the token
    var cookieArr = document.cookie.split(";");

    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        if (name == cookiePair[0].trim()) {
            MytokenInMemory = decodeURIComponent(cookiePair[1]);
            localStorage.setItem('dekkhotell_token', MytokenInMemory);
            return MytokenInMemory;
        }
    }
    return null;
}