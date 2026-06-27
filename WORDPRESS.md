# Deploy WordPress — SNA Impianti

Questa repo ora può essere usata anche come tema WordPress classico.

Il sito statico originale rimane compatibile: le pagine `.html` restano nella root. WordPress usa i file PHP aggiunti per leggere quelle pagine e riscrivere automaticamente:

- percorsi immagini e asset `assets/...`;
- link interni `.html` verso URL WordPress puliti;
- caricamento di `styles.css`, `partners.css` e `script.js` tramite `functions.php`.

## File WordPress aggiunti

- `style.css` — intestazione tema WordPress.
- `functions.php` — bridge WordPress per asset, link e template statici.
- `index.php` — fallback tema.
- `front-page.php` — homepage WordPress, carica `index.html`.
- `page.php` — carica automaticamente la pagina HTML corrispondente allo slug WordPress.
- `404.php` — fallback per pagine non trovate.
- `build-wordpress-theme.sh` — crea lo zip del tema.

## Slug WordPress richiesti

Crea queste pagine in WordPress con questi slug esatti:

| Titolo pagina | Slug |
|---|---|
| Chi siamo | `chi-siamo` |
| Presentazione aziendale | `presentazione-aziendale` |
| Certificazioni | `certificazioni` |
| Ingegneria | `ingegneria` |
| Prodotti | `prodotti` |
| Galleria | `galleria` |
| Lavora con noi | `posizioni-aperte` |
| Contatti | `contatti` |
| Processi saldatura industriale | `processi-saldatura-industriale` |

Le pagine possono essere vuote: il contenuto viene preso dai file `.html` della repo.

## Creare lo zip del tema

Da terminale, dentro la repo:

```bash
bash build-wordpress-theme.sh
```

Verrà creato:

```txt
snaimpianti.zip
```

## Installazione da dashboard WordPress

Usa questa opzione solo se lo zip non supera il limite upload del tuo hosting.

1. Vai in WordPress.
2. Apri **Aspetto → Temi**.
3. Clicca **Aggiungi nuovo**.
4. Clicca **Carica tema**.
5. Carica `snaimpianti.zip`.
6. Attiva il tema **SNA Impianti**.

## Installazione via FTP/File Manager

Consigliata, perché la repo contiene molte immagini.

1. Crea lo zip con `bash build-wordpress-theme.sh`.
2. Scompatta lo zip sul computer.
3. Carica la cartella `snaimpianti` in:

```txt
public_html/wp-content/themes/snaimpianti/
```

4. Vai in WordPress.
5. Apri **Aspetto → Temi**.
6. Attiva **SNA Impianti**.

## Impostazioni WordPress dopo attivazione

1. Vai su **Impostazioni → Permalink**.
2. Seleziona **Nome articolo**.
3. Salva.
4. Vai su **Pagine → Aggiungi nuova** e crea le pagine con gli slug indicati sopra.
5. Vai su **Impostazioni → Lettura**.
6. Imposta una pagina statica come homepage se necessario. Anche se non la imposti, `front-page.php` e `index.php` caricano comunque `index.html`.

## Note tecniche

Il file `script.js` ora supporta sia il sito statico sia WordPress. In WordPress riceve questi dati da `functions.php`:

```js
window.SNATheme = {
  themeUrl: '...',
  assetsUrl: '...',
  homeUrl: '...',
  currentPage: '...'
}
```

Questo evita che la galleria, i loghi partner e gli asset si rompano quando il sito gira sotto URL WordPress come `/contatti/` o `/galleria/`.
