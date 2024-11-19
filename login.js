function setCookies(token) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}`;
}

document.getElementById('login-btn').addEventListener('click', function() {
    let res = login();
    if(res){
        setCookies(res);
        window.location.replace("/soundboxBooking.html")
    }else{
        window.alert("network error");
    }
});

async function login(){
    let url = "https://soundbox.v1an.xyz/login";
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        const result = await response.json();
        return result.toString();
    } catch (e) {
        console.error("Error on getting:", e);
        return null;
    }
}