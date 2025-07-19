# SUTOTOM

Jeu original de JonathanMM : [Github](https://github.com/elparasite/sutom) / [SUTOM](http://sutom.nocle.fr/)

## Développement

### Avec npm

Pour pouvoir travailler en local, il faut commencer par installer ce qu'il faut à node :

```sh
npm i
```

Puis, on lance le serveur :

```sh
npm start
```

### Notes

Avant, TypeScript était configuré pour usiliser l'ancien système de modules de JavaScript, c'est-à-dire la librairie RequireJS pour le navigateur et le standard CommonJS pour Node.
Maintenant dans la config TypeScript `tsconfig.json` on utilise
```
"target": "es2018"
"module": "ESNext"
```
afin que le code compilé utilise le nouveau système import/export de JavaScript et qu'on ait plus besoin de RequireJS côté navigateur.

Ceci affecte aussi la compilation du JavaScript serveur (`server.js`) puisque le code n'est pas séparé, donc on ajoute
```
"type": "module"
```
à la config NodeJS `package.json` car le JavaScript compilé utilise maintenant aussi le système import/export plutôt que l'ancien système CommonJS de Node. Je ne sais pas si tous les modules sont compatibles pas en tout cas ça marche pour Express.