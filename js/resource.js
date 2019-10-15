var dataReload = document.querySelectorAll("[data-reload]");

var language = {
    eng: {
        welcome: "Welcome",
        iam: "I'm Adriel Izoton",
    },
    ptbr: {
        welcome: "Seja bem-vindo",
        iam: "Eu sou o Adriel Izoton",
    }
};

$(window).load(function () {

    if (window.location.hash) {
        
        if (window.location.hash == "#ptbr") {
            welcome.textContent = language.ptbr.welcome;
            iam.textContent = language.ptbr.iam;
        }
    }
    for (i = 0; i <= dataReload.length; i++) {
     //   if (dataReload[i]) {
            dataReload[i].onclick = function () {
                location.reload(true);
            };
      //  }
    }
})

