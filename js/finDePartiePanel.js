import { LettreStatut } from "./lettreStatut.js";
import NotificationMessage from "./notificationMessage.js";
export default class FinDePartiePanel {
    constructor(datePartie) {
        this._title = document.getElementById("fin-de-partie-panel-title");
        this._resumeTexte = "";
        this._finDePartiePanel = document.getElementById("fin-de-partie-panel");
        this._victoirePanel = document.getElementById("victoire-panel");
        this._defaitePanel = document.getElementById("defaite-panel");
        this._defaitePanelMot = document.getElementById("defaite-panel-mot");
        this._resume = document.getElementById("fin-de-partie-panel-resume");
        this._resumeBouton = document.getElementById("fin-de-partie-panel-resume-bouton");
        this._datePartie = datePartie;
        document.getElementById("fin-de-partie-panel-ok").addEventListener("click", (event) => {
            event.stopPropagation();
            this._finDePartiePanel.style.display = "none";
            this._defaitePanel.style.display = "none";
            this._victoirePanel.style.display = "none";
        });
        document.getElementById("fin-de-partie-panel-close").addEventListener("click", (event) => {
            event.stopPropagation();
            this._finDePartiePanel.style.display = "none";
        });
        this._resumeBouton.addEventListener("click", (event) => {
            event.stopPropagation();
            if (!navigator.clipboard) {
                NotificationMessage.ajouterNotification("Votre navigateur n'est pas compatible");
            }
            navigator.clipboard
                .writeText(this._resumeTexte + "\n\n" + window.location.href)
                .then(() => {
                NotificationMessage.ajouterNotification("Résumé copié dans le presse papier");
            })
                .catch((raison) => {
                NotificationMessage.ajouterNotification("Votre navigateur n'est pas compatible");
            });
        });
    }
    genererResume(estBonneReponse, resultats, numeroPartie) {
        let resultatsEmojis = resultats.map((mot) => mot
            .map((resultat) => resultat.statut)
            .reduce((ligne, statut) => {
            switch (statut) {
                case LettreStatut.BienPlace:
                    return ligne + "🟥";
                case LettreStatut.MalPlace:
                    return ligne + "🟡";
                default:
                    return ligne + "🟦";
            }
        }, ""));
        this._resumeTexte = "SUTOTOM #" + numeroPartie + " " + (estBonneReponse ? resultats.length : "-") + "/6\n\n" + resultatsEmojis.join("\n");
        this._resume.innerText = this._resumeTexte;
    }
    afficher(estVictoire, motATrouver) {
        this._finDePartiePanel.style.display = "block";
        if (estVictoire) {
            this._title.innerText = "Félicitations !";
            this._victoirePanel.style.display = "block";
            this._defaitePanel.style.display = "none";
        }
        else {
            this._title.innerText = "Perdu !";
            this._defaitePanelMot.innerText = motATrouver;
            this._defaitePanel.style.display = "block";
            this._victoirePanel.style.display = "none";
        }
    }
}
//# sourceMappingURL=finDePartiePanel.js.map