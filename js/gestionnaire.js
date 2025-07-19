import Dictionnaire from "./dictionnaire.js";
import Grille from "./grille.js";
import Input from "./input.js";
import LettreResultat from "./lettreResultat.js";
import { LettreStatut } from "./lettreStatut.js";
import FinDePartiePanel from "./finDePartiePanel.js";
import NotificationMessage from "./notificationMessage.js";
import PartieEnCours from "./partieEnCours.js";
export default class Gestionnaire {
    constructor() {
        this.propositions = [];
        this.resultats = [];
        this.datePartie = new Date(); // Date par défaut, sera remplacée par la date de la sauvegarde si elle existe
        this.numeroPartie = 0;
        this.maxNbPropositions = 6;
        this.victoire = false;
        this.perdu = false;
        this.longueurMot = 0;
        this.premiereLettre = "";
        this.motActuel = 0;
        this.chargerPartieEnCours();
        this.numeroPartie = this.calculerNumeroPartie(this.datePartie);
        this.motActuel = this.propositions.length;
        this.victoire = this.resultats.length > 0 && this.resultats[this.resultats.length - 1].every((item) => item.statut === LettreStatut.BienPlace);
        this.perdu = !this.victoire && this.propositions.length === this.maxNbPropositions;
        this._dictionnaire = new Dictionnaire();
        this._motATrouver = this.choisirMot(this.numeroPartie);
        this.longueurMot = this._motATrouver.length;
        this.premiereLettre = this._motATrouver[0];
        this._grille = new Grille(this);
        this._input = new Input(this);
        this._compositionMotATrouver = this.decompose(this._motATrouver);
        this._victoirePanel = new FinDePartiePanel(this.datePartie);
        document.getElementById("version").innerText = `SUTOTOM v${this.datePartie.getFullYear() % 100}.${this.datePartie.getMonth() + 1}.${this.datePartie.getDate()}`;
        NotificationMessage.initialiser();
        if (this.victoire || this.perdu) {
            this._victoirePanel.genererResume(this.victoire, this.resultats, this.numeroPartie);
            this._victoirePanel.afficher(this.victoire, this._motATrouver);
        }
    }
    chargerPartieEnCours() {
        let dataPartieEnCours = localStorage.getItem("partieEnCours");
        if (!dataPartieEnCours)
            return; // Utiliser les valeurs par défaut
        let partieEnCours = JSON.parse(dataPartieEnCours);
        let aujourdhui = new Date();
        let dateSauvegarde = new Date(partieEnCours.datePartie);
        if (aujourdhui.getDate() !== dateSauvegarde.getDate() ||
            aujourdhui.getMonth() !== dateSauvegarde.getMonth() ||
            aujourdhui.getFullYear() !== dateSauvegarde.getFullYear())
            return; // Utiliser les valeurs par défaut
        // Remplacement par les valeurs de la sauvegarde
        this.datePartie = dateSauvegarde;
        this.propositions = partieEnCours.propositions || [];
        this.resultats = partieEnCours.resultats || [];
    }
    calculerNumeroPartie(date) {
        const origine = new Date(2025, 6, 15); // 1er jour du jeu
        const dateMinuit = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return Math.floor((dateMinuit.getTime() - origine.getTime()) / (1000 * 60 * 60 * 24));
    }
    sauvegarderPartieEnCours() {
        const partie = new PartieEnCours();
        partie.datePartie = this.datePartie;
        partie.propositions = this.propositions;
        partie.resultats = this.resultats;
        localStorage.setItem("partieEnCours", JSON.stringify(partie));
    }
    choisirMot(numeroPartie) {
        return this._dictionnaire.nettoyerMot(this._dictionnaire.getMot(numeroPartie));
    }
    decompose(mot) {
        let composition = {};
        for (let position = 0; position < mot.length; position++) {
            let lettre = mot[position];
            if (composition[lettre])
                composition[lettre]++;
            else
                composition[lettre] = 1;
        }
        return composition;
    }
    verifierMot(mot) {
        mot = this._dictionnaire.nettoyerMot(mot);
        if (mot.length !== this._motATrouver.length) {
            NotificationMessage.ajouterNotification("Le mot proposé est trop court");
            return false;
        }
        if (mot[0] !== this._motATrouver[0]) {
            NotificationMessage.ajouterNotification("Le mot proposé doit commencer par la même lettre que le mot recherché");
            return false;
        }
        if (!this._dictionnaire.estMotValide(mot)) {
            NotificationMessage.ajouterNotification("Ce mot n'est pas dans notre dictionnaire");
            return false;
        }
        let resultat = this.analyserMot(mot);
        this.propositions.push(mot);
        this.resultats.push(resultat);
        this.motActuel++;
        this.victoire = resultat.every((item) => item.statut === LettreStatut.BienPlace);
        this.perdu = !this.victoire && this.propositions.length === this.maxNbPropositions;
        this._grille.validerMot(resultat, () => {
            this._input.updateClavier(resultat);
            if (this.victoire || this.perdu) {
                this._victoirePanel.afficher(this.victoire, this._motATrouver);
            }
        });
        if (this.victoire || this.perdu) {
            this._victoirePanel.genererResume(this.victoire, this.resultats, this.numeroPartie);
        }
        this.sauvegarderPartieEnCours();
        return true;
    }
    actualiserAffichageMotSaisi(mot) {
        this._grille.actualiserAffichageMotSaisi(this._dictionnaire.nettoyerMot(mot));
    }
    analyserMot(mot) {
        let resultats = new Array();
        mot = mot.toUpperCase();
        let composition = { ...this._compositionMotATrouver };
        for (let position = 0; position < this._motATrouver.length; position++) {
            let lettreATrouve = this._motATrouver[position];
            let lettreProposee = mot[position];
            if (lettreATrouve === lettreProposee) {
                composition[lettreProposee]--;
            }
        }
        for (let position = 0; position < this._motATrouver.length; position++) {
            let lettreATrouve = this._motATrouver[position];
            let lettreProposee = mot[position];
            let resultat = new LettreResultat();
            resultat.lettre = lettreProposee;
            if (lettreATrouve === lettreProposee) {
                resultat.statut = LettreStatut.BienPlace;
            }
            else if (this._motATrouver.includes(lettreProposee)) {
                if (composition[lettreProposee] > 0) {
                    resultat.statut = LettreStatut.MalPlace;
                    composition[lettreProposee]--;
                }
                else {
                    resultat.statut = LettreStatut.NonTrouve;
                }
            }
            else {
                resultat.statut = LettreStatut.NonTrouve;
            }
            resultats.push(resultat);
        }
        return resultats;
    }
}
//# sourceMappingURL=gestionnaire.js.map