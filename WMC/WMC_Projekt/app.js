'use strict';

const pokemonInput   = document.getElementById('pokemon-input');       // Suchfeld
const suchenBtn      = document.getElementById('suchen-btn');          // Suchen-Button
const zufallBtn      = document.getElementById('zufall-btn');          // Zufalls-Button
const datalistElement = document.getElementById('pokemon-vorschlaege'); // Autocomplete-Liste
const pokemonKarte   = document.getElementById('pokemon-karte');       // Karten-Container
const favoritenListe = document.getElementById('favoriten-liste');     // Favoriten-Container


const state = {
    favoriten: [],           // Array von gespeicherten Pokémon: [{id, name, bild, typen}]
    aktuellerPokemon: null   // Das aktuell angezeigte Pokémon (oder null)
};


const STORAGE_KEY    = 'pokedex-favoriten';               // Schlüssel für LocalStorage
const API_URL        = 'https://pokeapi.co/api/v2/pokemon/'; // Basis-URL der PokéAPI
const POKEMON_ANZAHL = 1025;                              // Gesamtanzahl der Pokémon (Gen 1–9)

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

function init() {
    loadState();              // Gespeicherte Favoriten laden
    renderFavoriten();        // Favoriten anzeigen
    ladeAllePokemonNamen();   // Alle Namen für Autocomplete laden
}


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

    // Rechte Spalte zusammenbauen
    infoSpalte.appendChild(name);
    infoSpalte.appendChild(typenDiv);
    infoSpalte.appendChild(statsDiv);
    infoSpalte.appendChild(favBtn);

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

// Klick auf Suchen-Button → Pokémon laden
suchenBtn.addEventListener('click', handleSuchen);

// Klick auf Zufalls-Button → zufälliges Pokémon laden
zufallBtn.addEventListener('click', handleZufall);

// Enter im Eingabefeld → Pokémon laden (Ereignisbehandlung)
pokemonInput.addEventListener('keydown', handleEnterTaste);

// Klick auf Favorit-Button innerhalb der Karte (Event Delegation)
// Event Delegation: ein Listener für den Container statt für jeden Button einzeln
pokemonKarte.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-favorit')) {
        handleFavoritToggle();
    }
});

// Klick auf Entfernen-Button in der Favoriten-Liste (Event Delegation)
favoritenListe.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-loeschen')) {
        const id = Number(event.target.dataset.id); // data-id als Zahl lesen
        handleFavoritEntfernen(id);
    }
});

// App starten
init();
