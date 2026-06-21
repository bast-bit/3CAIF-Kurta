function holeBrief(inhalt) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(inhalt);
        }, 1000);
    });
}

function stempelBrief(brief) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(brief + " [Gestempelt]");
        }, 1000);
    });
}

function versendeBrief(brief) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(brief + " -> Versendet!");
        }, 1000);
    });
}

holeBrief("Das ist dein Briefinhalt")
    .then(stempelBrief)
    .then(versendeBrief)
    .then((fertigerBrief) => {
        console.log(fertigerBrief);
    });
