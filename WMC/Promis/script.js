console.log(1);
const p = new Promise((resolve, reject) => {
    console.log(2);
    setTimeout(() => {
        console.log(3);
        return resolve("Promise resolved!");
    }, 2000);
});
console.log(4);
p.then((result) => { console.log(`5: ${result}`); });
console.log(6);
console.log(p);
console.log(7);

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
