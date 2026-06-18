'use strict';

// ===== 1. DOM-REFERENZEN =====
const pokemonInput    = document.getElementById('pokemon-input');       // Suchfeld
const suchenBtn       = document.getElementById('suchen-btn');          // Suchen-Button
const zufallBtn       = document.getElementById('zufall-btn');          // Zufalls-Button
const datalistElement = document.getElementById('pokemon-vorschlaege'); // Autocomplete-Liste
const pokemonKarte    = document.getElementById('pokemon-karte');       // Karten-Container
const favoritenListe  = document.getElementById('favoriten-liste');     // Favoriten-Container
const typSelect       = document.getElementById('typ-select');         // Typ-Auswahl
const typSuchBtn      = document.getElementById('typ-such-btn');       // Typ-Suchen-Button
const typErgebnisListe = document.getElementById('typ-ergebnis-liste'); // Container für Typ-Ergebnisse
const vergleichInhalt  = document.getElementById('vergleich-inhalt');   // Container für Vergleichstabelle
const vergleichResetBtn = document.getElementById('vergleich-reset-btn'); // Vergleich-Reset-Button

// ===== 2. STATE-OBJEKT =====
const state = {
    favoriten: [],           // Array von gespeicherten Pokémon: [{id, name, bild, typen}]
    aktuellerPokemon: null,  // Das aktuell angezeigte Pokémon (oder null)
    vergleich: []            // Bis zu 2 Pokémon, die verglichen werden
};

// ===== 3. KONSTANTEN =====
const STORAGE_KEY    = 'pokedex-favoriten';               // Schlüssel für LocalStorage
const API_URL        = 'https://pokeapi.co/api/v2/pokemon/'; // Basis-URL der PokéAPI
const TYP_API_URL     = 'https://pokeapi.co/api/v2/type/';   // API für Typ-Suche
const POKEMON_ANZAHL = 1025;                              // Gesamtanzahl der Pokémon (Gen 1–9)

// ===== 4. LOCALSTORAGE-FUNKTIONEN =====
// Favoriten im LocalStorage speichern
function saveState() {
    // JSON.stringify wandelt das Array in einen Text um
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favoriten));
}

// Favoriten aus dem LocalStorage laden
function loadState() {
    const gespeichert = localStorage.getItem(STORAGE_KEY);
    // Nur laden wenn etwas gespeichert ist
    if (gespeichert !== null) {
        // JSON.parse wandelt den Text zurück in ein Array
        state.favoriten = JSON.parse(gespeichert);
    }
}

// ===== 5. RENDER-FUNKTIONEN =====
// Alle Pokémon-Namen von der API laden und als Autocomplete-Optionen einfügen
async function ladeAllePokemonNamen() {
    try {
        // API gibt eine Liste aller Pokémon zurück (Name + URL)
        const antwort = await fetch(API_URL + '?limit=' + POKEMON_ANZAHL);
        const daten = await antwort.json();

        // Für jeden Pokémon eine <option> im <datalist> erstellen (DOM-Modifikation)
        daten.results.forEach(function(pokemon) {
            const option = document.createElement('option');
            option.value = pokemon.name; // z.B. "pikachu"
            datalistElement.appendChild(option);
        });
    } catch (fehler) {
        // Kein Autocomplete verfügbar — App funktioniert trotzdem normal
        console.log('Autocomplete konnte nicht geladen werden:', fehler.message);
    }
}

// Pokémon-Karte anzeigen
function renderPokemonKarte(pokemon) {
    // Karte komplett leeren
    pokemonKarte.innerHTML = '';

    // Wenn kein Pokémon geladen: Hinweistext
    if (pokemon === null) {
        const hinweis = document.createElement('p');
        hinweis.classList.add('hinweis');
        hinweis.textContent = 'Gib einen Pokémon-Namen ein und klicke auf Suchen.';
        pokemonKarte.appendChild(hinweis);
        return;
    }

    // Äußerer Container: zweispaltig (Bild links, Info rechts)
    const container = document.createElement('div');
    container.classList.add('pokemon-karte-inhalt');

    // --- LINKE SPALTE: Pokémon-Bild ---
    const bildSpalte = document.createElement('div');
    bildSpalte.classList.add('pokemon-bild-spalte');

    const bild = document.createElement('img');
    bild.src = pokemon.bild;
    bild.alt = pokemon.name;
    bild.classList.add('pokemon-bild');

    bildSpalte.appendChild(bild);

    // --- RECHTE SPALTE: Name, Typen, Stats, Button ---
    const infoSpalte = document.createElement('div');
    infoSpalte.classList.add('pokemon-info-spalte');

    // Name und Nummer
    const name = document.createElement('h3');
    name.classList.add('pokemon-name');
    name.textContent = `#${pokemon.id} ${pokemon.name}`;

    // Typen als bunte Badges (DOM-Modifikation)
    const typenDiv = document.createElement('div');
    typenDiv.classList.add('typen');
    pokemon.typen.forEach(function(typ) {
        const badge = document.createElement('span');
        badge.classList.add('typ', 'typ-' + typ); // z.B. "typ-fire" → rote Farbe per CSS
        badge.textContent = typ;
        typenDiv.appendChild(badge);
    });

    // Stats als Grid (Größe, Gewicht, HP)
    const statsDiv = document.createElement('div');
    statsDiv.classList.add('stats');

    const groesse = document.createElement('p');
    groesse.textContent = `Größe: ${pokemon.groesse / 10} m`;  // API gibt Dezimeter, wir zeigen Meter

    const gewicht = document.createElement('p');
    gewicht.textContent = `Gewicht: ${pokemon.gewicht / 10} kg`; // API gibt Hectogramm, wir zeigen kg

    const hp = document.createElement('p');
    hp.textContent = `HP: ${pokemon.hp}`;

    statsDiv.appendChild(groesse);
    statsDiv.appendChild(gewicht);
    statsDiv.appendChild(hp);

    // Favorit-Button — Text ändert sich je nach Status
    const istFavorit = state.favoriten.some(function(f) { return f.id === pokemon.id; });
    const favBtn = document.createElement('button');
    favBtn.classList.add('btn-favorit');
    favBtn.textContent = istFavorit ? '★ Aus Favoriten entfernen' : '☆ Zu Favoriten hinzufügen';

    // Vergleich-Button — fügt das Pokémon zum Vergleich hinzu
    const vergleichBtn = document.createElement('button');
    vergleichBtn.classList.add('btn-vergleich');
    vergleichBtn.textContent = '+ Vergleich';

    // Rechte Spalte zusammenbauen
    infoSpalte.appendChild(name);
    infoSpalte.appendChild(typenDiv);
    infoSpalte.appendChild(statsDiv);
    infoSpalte.appendChild(favBtn);
    infoSpalte.appendChild(vergleichBtn);

    // Beide Spalten in den Container
    container.appendChild(bildSpalte);
    container.appendChild(infoSpalte);
    pokemonKarte.appendChild(container);
}

// Favoriten-Liste anzeigen
function renderFavoriten() {
    // Liste leeren
    favoritenListe.innerHTML = '';

    // Wenn keine Favoriten: Hinweistext anzeigen
    if (state.favoriten.length === 0) {
        const hinweis = document.createElement('p');
        hinweis.classList.add('hinweis');
        hinweis.textContent = 'Noch keine Favoriten gespeichert.';
        favoritenListe.appendChild(hinweis);
        return;
    }

    // Für jeden Favoriten einen Eintrag erstellen
    state.favoriten.forEach(function(pokemon) {
        const item = document.createElement('div');
        item.classList.add('favorit-item');

        // Kleines Bild
        const bild = document.createElement('img');
        bild.src = pokemon.bild;
        bild.alt = pokemon.name;
        bild.classList.add('favorit-bild');

        // Name
        const nameSpan = document.createElement('span');
        nameSpan.classList.add('favorit-name');
        nameSpan.textContent = `#${pokemon.id} ${pokemon.name}`;

        // Entfernen-Button mit data-id, damit wir wissen welcher Pokémon gemeint ist
        const btnLoeschen = document.createElement('button');
        btnLoeschen.classList.add('btn-loeschen');
        btnLoeschen.textContent = 'Entfernen';
        btnLoeschen.dataset.id = pokemon.id; // ID wird im Click-Handler ausgelesen

        item.appendChild(bild);
        item.appendChild(nameSpan);
        item.appendChild(btnLoeschen);
        favoritenListe.appendChild(item);
    });
}

// Ergebnisliste der Typ-Suche anzeigen (klickbare Namen)
function renderTypErgebnis(namenListe, typ) {
    // Liste leeren, bevor neue Namen eingefügt werden
    typErgebnisListe.innerHTML = '';

    // Für jeden Namen ein kleines klickbares Element (Chip) erstellen
    namenListe.forEach(function(name) {
        const chip = document.createElement('span');
        chip.classList.add('typ-chip', 'typ-' + typ); // gleiche Farbe wie die Typ-Badges
        chip.textContent = name;
        typErgebnisListe.appendChild(chip);
    });
}

// Vergleichstabelle anzeigen
function renderVergleich() {
    // Inhalt leeren, bevor neu gerendert wird
    vergleichInhalt.innerHTML = '';

    // Weniger als 2 Pokémon ausgewählt: Hinweistext zeigen statt Tabelle
    if (state.vergleich.length < 2) {
        const hinweis = document.createElement('p');
        hinweis.classList.add('hinweis');
        hinweis.textContent = 'Wähle bei zwei Pokémon "+ Vergleich" aus, um sie hier nebeneinander zu sehen.';
        vergleichInhalt.appendChild(hinweis);
        return;
    }

    // Die zwei Pokémon aus dem Array holen (a = erstes, b = zweites)
    const [a, b] = state.vergleich;
    const tabelle = document.createElement('table');
    tabelle.classList.add('vergleich-tabelle');

    // Hilfsfunktion: erzeugt eine Tabellenzeile mit Beschriftung + zwei Werten
    // vergleichbar = true bedeutet: der größere Wert bekommt die Farbe 'vergleich-besser'
    function zeileErstellen(label, wertA, wertB, vergleichbar) {
        const zeile = document.createElement('tr');

        // Erste Spalte: Beschriftung (z.B. "HP")
        const labelZelle = document.createElement('th');
        labelZelle.textContent = label;

        // Zweite Spalte: Wert von Pokémon A
        const zelleA = document.createElement('td');
        zelleA.textContent = wertA;

        // Dritte Spalte: Wert von Pokémon B
        const zelleB = document.createElement('td');
        zelleB.textContent = wertB;

        // Höheren Wert farblich hervorheben (nur bei Zahlen, nicht bei Text)
        if (vergleichbar) {
            if (wertA > wertB) zelleA.classList.add('vergleich-besser');
            if (wertB > wertA) zelleB.classList.add('vergleich-besser');
        }

        zeile.appendChild(labelZelle);
        zeile.appendChild(zelleA);
        zeile.appendChild(zelleB);
        return zeile;
    }

    // Eine Zeile pro Eigenschaft erstellen und in die Tabelle einfügen
    tabelle.appendChild(zeileErstellen('Name', a.name, b.name, false));
    tabelle.appendChild(zeileErstellen('Typen', a.typen.join(', '), b.typen.join(', '), false));
    tabelle.appendChild(zeileErstellen('Größe (m)', a.groesse / 10, b.groesse / 10, true));
    tabelle.appendChild(zeileErstellen('Gewicht (kg)', a.gewicht / 10, b.gewicht / 10, true));
    tabelle.appendChild(zeileErstellen('HP', a.hp, b.hp, true));

    vergleichInhalt.appendChild(tabelle);
}

// ===== 6. EVENT-HANDLER-FUNKTIONEN =====
// Pokémon-Suche — async/await weil wir auf die API warten müssen
async function handleSuchen() {
    const suchbegriff = pokemonInput.value.trim().toLowerCase(); // Eingabe lesen und bereinigen

    // Abbrechen wenn Feld leer
    if (suchbegriff === '') {
        alert('Bitte einen Pokémon-Namen oder eine Nummer eingeben!');
        return;
    }

    // Ladeanzeige einblenden (DOM-Modifikation)
    pokemonKarte.innerHTML = '';
    const ladenText = document.createElement('p');
    ladenText.classList.add('laden');
    ladenText.textContent = 'Lade Pokémon-Daten...';
    pokemonKarte.appendChild(ladenText);

    try {
        // API-Aufruf: fetch gibt ein Promise zurück, await wartet auf das Ergebnis
        const antwort = await fetch(API_URL + suchbegriff);

        // Wenn die API einen Fehler zurückgibt (z.B. 404 = nicht gefunden)
        if (!antwort.ok) {
            throw new Error('Pokémon "' + suchbegriff + '" nicht gefunden!');
        }

        // Antwort als JSON lesen (auch das ist async)
        const daten = await antwort.json();

        // Nur die Felder aus der API-Antwort nehmen, die wir brauchen
        const pokemon = {
            id:      daten.id,
            name:    daten.name.charAt(0).toUpperCase() + daten.name.slice(1), // Erster Buchstabe groß
            bild:    daten.sprites.other['official-artwork'].front_default      // Offizielles Artwork
                     || daten.sprites.front_default,                            // Fallback: normales Sprite
            typen:   daten.types.map(function(t) { return t.type.name; }),     // z.B. ["fire", "flying"]
            groesse: daten.height,   // in Dezimeter (API-Format)
            gewicht: daten.weight,   // in Hectogramm (API-Format)
            hp:      daten.stats[0].base_stat // Erster Stat ist immer HP
        };

        // State aktualisieren
        state.aktuellerPokemon = pokemon;

        // Karte neu rendern (DOM-Modifikation)
        renderPokemonKarte(pokemon);

    } catch (fehler) {
        // Fehlermeldung anzeigen (DOM-Modifikation)
        pokemonKarte.innerHTML = '';
        const fehlerText = document.createElement('p');
        fehlerText.classList.add('fehler');
        fehlerText.textContent = fehler.message;
        pokemonKarte.appendChild(fehlerText);
        state.aktuellerPokemon = null;
    }
}

// Favorit hinzufügen oder entfernen (Toggle)
function handleFavoritToggle() {
    // Kein Pokémon geladen: nichts tun
    if (state.aktuellerPokemon === null) return;

    const pokemon = state.aktuellerPokemon;

    // Prüfen ob das Pokémon schon in den Favoriten ist
    const istFavorit = state.favoriten.some(function(f) { return f.id === pokemon.id; });

    if (istFavorit) {
        // Aus Favoriten entfernen: alle außer diesem behalten
        state.favoriten = state.favoriten.filter(function(f) { return f.id !== pokemon.id; });
    } else {
        // Zu Favoriten hinzufügen: nur die nötigen Felder speichern
        state.favoriten.push({
            id:    pokemon.id,
            name:  pokemon.name,
            bild:  pokemon.bild,
            typen: pokemon.typen
        });
    }

    // State speichern und Anzeige aktualisieren
    saveState();
    renderPokemonKarte(pokemon); // Button-Text aktualisieren
    renderFavoriten();           // Favoritenliste aktualisieren
}

// Favorit aus der Liste entfernen
function handleFavoritEntfernen(id) {
    // Pokémon mit dieser ID aus den Favoriten löschen
    state.favoriten = state.favoriten.filter(function(f) { return f.id !== id; });

    // State speichern und Anzeige aktualisieren
    saveState();
    renderFavoriten();

    // Wenn das gerade angezeigte Pokémon entfernt wurde: Button-Text aktualisieren
    if (state.aktuellerPokemon && state.aktuellerPokemon.id === id) {
        renderPokemonKarte(state.aktuellerPokemon);
    }
}

// Zufälliges Pokémon laden
function handleZufall() {
    // Math.random() gibt eine Zahl zwischen 0 und 1 zurück
    // Mal POKEMON_ANZAHL + 1 → zufällige ID zwischen 1 und 1025
    const zufallsId = Math.floor(Math.random() * POKEMON_ANZAHL) + 1;

    // ID ins Suchfeld schreiben (PokéAPI akzeptiert auch Nummern)
    pokemonInput.value = zufallsId;

    // Normale Suche auslösen
    handleSuchen();
}

// Enter-Taste im Suchfeld auslösen
function handleEnterTaste(event) {
    // Prüfen ob die Enter-Taste gedrückt wurde
    if (event.key === 'Enter') {
        handleSuchen();
    }
}

// Pokémon eines Typs von der API laden — async/await wie bei handleSuchen
async function handleTypSuche() {
    const typ = typSelect.value; // ausgewählter Typ, z.B. "fire"

    // Ladeanzeige einblenden (DOM-Modifikation)
    typErgebnisListe.innerHTML = '';
    const ladenText = document.createElement('p');
    ladenText.classList.add('laden');
    ladenText.textContent = 'Lade Liste...';
    typErgebnisListe.appendChild(ladenText);

    try {
        // API-Aufruf: liefert alle Pokémon, die diesen Typ haben
        const antwort = await fetch(TYP_API_URL + typ);
        const daten = await antwort.json();

        // daten.pokemon ist ein Array von {pokemon: {name, url}, slot}
        // Nur die ersten 30 Namen anzeigen, damit die Liste übersichtlich bleibt
        const namen = daten.pokemon.slice(0, 30).map(function(eintrag) {
            return eintrag.pokemon.name;
        });

        // Ergebnis anzeigen (DOM-Modifikation)
        renderTypErgebnis(namen, typ);
    } catch (fehler) {
        // Fehlermeldung anzeigen (DOM-Modifikation)
        typErgebnisListe.innerHTML = '';
        const fehlerText = document.createElement('p');
        fehlerText.classList.add('fehler');
        fehlerText.textContent = 'Liste konnte nicht geladen werden.';
        typErgebnisListe.appendChild(fehlerText);
    }
}

// Aktuelles Pokémon zum Vergleich hinzufügen
function handleVergleichHinzufuegen() {
    // Kein Pokémon geladen: nichts tun
    if (state.aktuellerPokemon === null) return;

    const pokemon = state.aktuellerPokemon;

    // Prüfen ob das Pokémon schon im Vergleich ist
    const istSchonDrin = state.vergleich.some(function(p) { return p.id === pokemon.id; });

    // Schon drin oder schon 2 Pokémon im Vergleich: abbrechen
    if (istSchonDrin || state.vergleich.length >= 2) {
        alert('Vergleich ist voll oder Pokémon bereits drin. Erst zurücksetzen.');
        return;
    }

    // Pokémon zum State hinzufügen und Tabelle neu anzeigen (DOM-Modifikation)
    state.vergleich.push(pokemon);
    renderVergleich();
}

// Vergleich zurücksetzen
function handleVergleichReset() {
    // State leeren und Anzeige aktualisieren (DOM-Modifikation)
    state.vergleich = [];
    renderVergleich();
}

// ===== 7. EVENT-LISTENER =====
// Klick auf Suchen-Button → Pokémon laden
suchenBtn.addEventListener('click', handleSuchen);

// Klick auf Zufalls-Button → zufälliges Pokémon laden
zufallBtn.addEventListener('click', handleZufall);

// Enter im Eingabefeld → Pokémon laden (Ereignisbehandlung)
pokemonInput.addEventListener('keydown', handleEnterTaste);

// Klick auf Favorit- oder Vergleich-Button innerhalb der Karte (Event Delegation)
// Event Delegation: ein Listener für den Container statt für jeden Button einzeln
pokemonKarte.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-favorit')) {
        handleFavoritToggle();
    }
    if (event.target.classList.contains('btn-vergleich')) {
        handleVergleichHinzufuegen();
    }
});

// Klick auf Entfernen-Button in der Favoriten-Liste (Event Delegation)
favoritenListe.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-loeschen')) {
        const id = Number(event.target.dataset.id); // data-id als Zahl lesen
        handleFavoritEntfernen(id);
    }
});

// Klick auf Anzeigen-Button → Pokémon eines Typs laden
typSuchBtn.addEventListener('click', handleTypSuche);

// Klick auf einen Namen in der Typ-Ergebnisliste → Pokémon suchen (Event Delegation)
typErgebnisListe.addEventListener('click', function(event) {
    if (event.target.classList.contains('typ-chip')) {
        pokemonInput.value = event.target.textContent;
        handleSuchen();
    }
});

// Klick auf Vergleich-zurücksetzen-Button
vergleichResetBtn.addEventListener('click', handleVergleichReset);

// ===== 8. INITIALISIERUNG =====
function init() {
    loadState();              // Gespeicherte Favoriten laden
    renderFavoriten();        // Favoriten anzeigen
    ladeAllePokemonNamen();   // Alle Namen für Autocomplete laden
}

// App starten
init();
