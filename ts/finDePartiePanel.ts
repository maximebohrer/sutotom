import LettreResultat from "./lettreResultat.js";
import { LettreStatut } from "./lettreStatut.js";
import NotificationMessage from "./notificationMessage.js";

export default class FinDePartiePanel {
  private readonly _finDePartiePanel: HTMLElement;
  private readonly _victoirePanel: HTMLElement;
  private readonly _defaitePanel: HTMLElement;
  private readonly _defaitePanelMot: HTMLElement;
  private readonly _resume: HTMLPreElement;
  private readonly _resumeBouton: HTMLElement;
  private readonly _title: HTMLElement = document.getElementById("fin-de-partie-panel-title") as HTMLElement;
  private readonly _datePartie: Date;

  private _resumeTexte: string = "";

  public constructor(datePartie: Date) {
    this._finDePartiePanel = document.getElementById("fin-de-partie-panel") as HTMLElement;
    this._victoirePanel = document.getElementById("victoire-panel") as HTMLElement;
    this._defaitePanel = document.getElementById("defaite-panel") as HTMLElement;
    this._defaitePanelMot = document.getElementById("defaite-panel-mot") as HTMLElement;
    this._resume = document.getElementById("fin-de-partie-panel-resume") as HTMLPreElement;
    this._resumeBouton = document.getElementById("fin-de-partie-panel-resume-bouton") as HTMLElement;

    this._datePartie = datePartie;

    document.getElementById("fin-de-partie-panel-ok")!.addEventListener("click", (event) => {
      event.stopPropagation();
      this._finDePartiePanel.style.display = "none";
      this._defaitePanel.style.display = "none";
      this._victoirePanel.style.display = "none";
    });

    document.getElementById("fin-de-partie-panel-close")!.addEventListener("click", (event) => {
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

  public genererResume(estBonneReponse: boolean, resultats: Array<Array<LettreResultat>>, numeroPartie: number): void {
    let resultatsEmojis = resultats.map((mot) =>
      mot
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
        }, "")
    );

    this._resumeTexte = "SUTOTOM #" + numeroPartie + " " + (estBonneReponse ? resultats.length : "-") + "/6\n\n" + resultatsEmojis.join("\n");
    this._resume.innerText = this._resumeTexte;
  }

  public afficher(estVictoire: boolean, motATrouver: string): void {
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
