import { LettreStatut } from "./lettreStatut.js";
import { sync_blink } from "./utils.js";
export default class Input {
    constructor(gestionnaire) {
        this.statutLettres = {};
        this.gest = gestionnaire;
        this._inputArea = document.getElementById("input-area");
        this._premiereLettre = this.gest.premiereLettre;
        this._longueurMot = this.gest.longueurMot;
        this._motSaisi = "";
        for (let resultat of this.gest.resultats) {
            this.updateClavier(resultat);
        }
        document.addEventListener("keypress", ((event) => {
            event.stopPropagation();
            let touche = event.key;
            if (touche === "Enter") {
                this.validerMot();
            }
            else if (touche !== "Backspace") {
                this.saisirLettre(touche);
            }
        }).bind(this));
        // Le retour arrière n'est détecté que par keydown
        document.addEventListener("keydown", ((event) => {
            event.stopPropagation();
            let touche = event.key;
            if (touche === "Backspace") {
                this.effacerLettre();
            }
        }).bind(this));
        this._inputArea.querySelectorAll(".input-lettre").forEach((lettreDiv) => lettreDiv.addEventListener("click", (event) => {
            event.stopPropagation();
            let div = event.currentTarget;
            if (!div)
                return;
            let lettre = div.dataset["lettre"];
            if (lettre === undefined) {
                return;
            }
            else if (lettre === "_effacer") {
                this.effacerLettre();
            }
            else if (lettre === "_entree") {
                this.validerMot();
            }
            else {
                this.saisirLettre(lettre);
            }
        }));
    }
    effacerLettre() {
        if (this.gest.victoire || this.gest.perdu)
            return;
        if (this._motSaisi.length !== 0) {
            this._motSaisi = this._motSaisi.substring(0, this._motSaisi.length - 1);
        }
        this.gest.actualiserAffichageMotSaisi(this._motSaisi);
    }
    validerMot() {
        if (this.gest.victoire || this.gest.perdu)
            return;
        let mot = this._motSaisi;
        if (this.gest.verifierMot(mot)) {
            this._motSaisi = "";
        }
    }
    saisirLettre(lettre) {
        if (this.gest.victoire || this.gest.perdu)
            return;
        if (this._motSaisi.length >= this._longueurMot)
            return;
        if (this._motSaisi.length === 0 && lettre.toUpperCase() !== this._premiereLettre)
            this._motSaisi += this._premiereLettre;
        this._motSaisi += lettre;
        this.gest.actualiserAffichageMotSaisi(this._motSaisi);
    }
    updateClavier(resultat) {
        for (let lettreResultat of resultat) {
            if (!this.statutLettres[lettreResultat.lettre]) {
                this.statutLettres[lettreResultat.lettre] = lettreResultat.statut;
                this.updateTouche(lettreResultat);
            }
            else if (lettreResultat.statut === LettreStatut.BienPlace && this.statutLettres[lettreResultat.lettre] !== LettreStatut.BienPlace) {
                this.statutLettres[lettreResultat.lettre] = LettreStatut.BienPlace;
                this.updateTouche(lettreResultat);
            }
            else if (lettreResultat.statut === LettreStatut.MalPlace && this.statutLettres[lettreResultat.lettre] !== LettreStatut.BienPlace && this.statutLettres[lettreResultat.lettre] !== LettreStatut.MalPlace) {
                this.statutLettres[lettreResultat.lettre] = LettreStatut.MalPlace;
                this.updateTouche(lettreResultat);
            }
        }
    }
    updateTouche(lettreResultat) {
        let touche = this._inputArea.querySelector(`.input-lettre[data-lettre="${lettreResultat.lettre}"]`);
        if (touche) {
            switch (lettreResultat.statut) {
                case LettreStatut.BienPlace:
                    touche.className = "input-lettre rouge";
                    break;
                case LettreStatut.MalPlace:
                    touche.className = "input-lettre jaune";
                    sync_blink(touche);
                    break;
                default:
                    touche.className = "input-lettre gris";
                    break;
            }
        }
    }
}
//# sourceMappingURL=input.js.map