import Gestionnaire from "./gestionnaire.js";
import LettreResultat from "./lettreResultat.js";
import { LettreStatut } from "./lettreStatut.js";
import { sync_blink } from "./utils.js";

export default class Grille {
  private readonly _grille: HTMLElement;
  private cellules: Array<Array<HTMLElement>> = [];
  private readonly gest: Gestionnaire;
  private _indice: Array<string | undefined>;
  private _motSaisi: string;

  public constructor(gestionnaire: Gestionnaire) {
    this.gest = gestionnaire;
    this._grille = document.getElementById("grille") as HTMLElement;
    this._indice = new Array<string | undefined>(this.gest.longueurMot);
    this._indice[0] = this.gest.premiereLettre;
    for (let resultat of this.gest.resultats) {
      this.mettreAJourIndice(resultat);
    }
    this._motSaisi = "";
    this.creerGrille();
  }

  private creerGrille() {
    this._grille.innerHTML = "";
    this.cellules = [];
    for (let nbMot = 0; nbMot < this.gest.maxNbPropositions; nbMot++) {
      let ligne = document.createElement("div");
      ligne.classList.add("grille-ligne");
      this.cellules.push([]);
      let mot = this.gest.propositions.length <= nbMot ? "" : this.gest.propositions[nbMot];
      for (let nbLettre = 0; nbLettre < this.gest.longueurMot; nbLettre++) {
        let cellule = document.createElement("span");
        cellule.classList.add("grille-lettre");
        ligne.appendChild(cellule);
        this.cellules[nbMot].push(cellule);
        let contenuCellule: string = "";
        if (nbMot < this.gest.motActuel) { // affichage des propositions précédentes
          contenuCellule = mot[nbLettre].toUpperCase();
        } else if (nbMot === this.gest.motActuel && this._motSaisi.length !== 0) { // affichage du mot saisi en cours
          if (this._motSaisi.length <= nbLettre) {
            contenuCellule = ".";
          } else {
            contenuCellule = this._motSaisi[nbLettre].toUpperCase();
          }
        } else if (nbMot === this.gest.motActuel && !this.gest.victoire) { // affichage des indices si le mot saisi est vide
          let lettreIndice = this._indice[nbLettre];
          if (lettreIndice !== undefined) contenuCellule = lettreIndice;
          else contenuCellule = ".";
        }
        if (nbMot < this.gest.resultats.length && this.gest.resultats[nbMot][nbLettre]) {
          let resultat = this.gest.resultats[nbMot][nbLettre];
          switch (resultat.statut) {
            case LettreStatut.BienPlace:
              cellule.classList.add("rouge");
              break;
            case LettreStatut.MalPlace:
              cellule.classList.add("jaune");
              sync_blink(cellule);
              break;
            default:
              cellule.classList.add("gris");
          }
        }
        cellule.innerText = contenuCellule;
      }
      this._grille.appendChild(ligne);
    }
  }

  private updateMotEnCours() {
    for (let nbLettre = 0; nbLettre < this.gest.longueurMot; nbLettre++) {
      if (this._motSaisi.length > 0) { // affichage du mot saisi en cours
        if (nbLettre >= this._motSaisi.length) {
          this.cellules[this.gest.motActuel][nbLettre].innerText = ".";
        } else {
          this.cellules[this.gest.motActuel][nbLettre].innerText = this._motSaisi[nbLettre].toUpperCase();
        }
      } else if (!this.gest.victoire && !this.gest.perdu) { // affichage des indices si le mot saisi est vide
        let lettreIndice = this._indice[nbLettre];
        if (lettreIndice !== undefined) this.cellules[this.gest.motActuel][nbLettre].innerText = lettreIndice;
        else this.cellules[this.gest.motActuel][nbLettre].innerText = ".";
      }
    }
  }

  public actualiserAffichageMotSaisi(mot: string) {
    this._motSaisi = mot;
    this.updateMotEnCours();
  }

  public validerMot(resultat: Array<LettreResultat>, endCallback?: () => void): void {
    this._motSaisi = "";
    this.mettreAJourIndice(resultat);
    let ligne = this.cellules[this.gest.motActuel - 1];
    this.animerLettre(ligne, resultat, 0, endCallback);
  }

  private animerLettre(ligne: Array<HTMLElement>, resultats: Array<LettreResultat>, numLettre: number, endCallback?: () => void): void {
    if (numLettre >= ligne.length) {
      this.updateMotEnCours();
      if (endCallback) endCallback();
      return;
    }
    let cellule = ligne[numLettre];
    let resultat = resultats[numLettre];
    cellule.innerHTML = resultat.lettre; // Inutile ?
    switch (resultat.statut) {
      case LettreStatut.BienPlace:
        cellule.classList.add("rouge");
        break;
      case LettreStatut.MalPlace:
        cellule.classList.add("jaune");
        sync_blink(cellule);
        break;
      default:
        cellule.classList.add("gris");
    }
    setTimeout((() => this.animerLettre(ligne, resultats, numLettre + 1, endCallback)).bind(this), 220);
  }

  private mettreAJourIndice(resultat: Array<LettreResultat>): void {
    for (let i = 0; i < this._indice.length; i++) {
      if (!this._indice[i]) {
        this._indice[i] = resultat[i].statut === LettreStatut.BienPlace ? resultat[i].lettre : undefined;
      }
    }
  }
}
