const logout = document.getElementById("logout")

logout.addEventListener("click", () => {
    fetch("/api/sessions/logout", {
        method: "POST"
    })
    .then(response => {
        if(response.status === 200){
            window.location.replace("/login")
        }
    })
})