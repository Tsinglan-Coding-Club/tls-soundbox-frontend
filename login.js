function setCookies(token) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}`;
}

document.getElementById('login-btn').addEventListener('click', function() {
    let url = "https://soundbox.v1an.xyz/login";
    window.location.replace(url);
});
