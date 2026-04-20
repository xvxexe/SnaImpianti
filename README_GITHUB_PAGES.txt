SITO S.N.A. IMPIANTI - VERSIONE GITHUB PAGES

COME PUBBLICARLO
1. Apri la tua repository GitHub.
2. Carica TUTTO il contenuto di questa cartella nella root della repository.
3. Vai su Settings > Pages.
4. In Source seleziona "GitHub Actions".
5. Assicurati che il branch principale sia "main".
6. Dopo il push, GitHub eseguirà automaticamente il file:
   .github/workflows/deploy.yml
7. Quando il deploy finisce, il sito sarà online su:
   https://TUO-USERNAME.github.io/NOME-REPOSITORY/

NOTE
- I link sono già relativi, quindi funzionano correttamente anche su GitHub Pages.
- Non serve npm, non serve build, non serve package-lock.json.
- Il sito è statico HTML/CSS/JS.
- Il file 404.html reindirizza visivamente alla home in caso di pagina non trovata.

SE VUOI SOLO IL FILE WORKFLOW
Il file da copiare è:
.github/workflows/deploy.yml
