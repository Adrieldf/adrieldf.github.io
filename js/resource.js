var dataReload = document.querySelectorAll("[data-reload]");

var language = {
    eng: {
        welcome: "Welcome",
        iam: "I'm Adriel Izoton",
        webdev: "Web Developer",
        gamedev: "Indie Game Developer",
    },
    ptbr: {
        welcome: "Seja bem-vindo",
        iam: "Eu sou o Adriel Izoton",
        webdev: "Desenvolvedor Web",
        gamedev: "Desenvolvedor de Jogos independente",
    }
};

$(window).load(function () {

    if (window.location.hash) {
        
        if (window.location.hash == "#ptbr") {
            welcome.textContent = language.ptbr.welcome;
            iam.textContent = language.ptbr.iam;
            webdev.textContent = language.ptbr.webdev;
            gamedev.textContent = language.ptbr.gamedev;
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

