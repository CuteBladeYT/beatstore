document.addEventListener("DOMContentLoaded", () => {
    let desc = document.body.querySelector("div#body > pre#description");
    document.body.onscroll = (e) => {
        var y = window.scrollY;
        console.log(y);
        if (y < 96) {
            desc.style.top = 96 - y + "px";
        } else {
            desc.style.top = "0px";
        }
    };
});