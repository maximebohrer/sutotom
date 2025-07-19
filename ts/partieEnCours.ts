import LettreResultat from "./lettreResultat";

export default class PartieEnCours {
  public propositions: Array<string> = [];
  public resultats: Array<Array<LettreResultat>> = [];
  public datePartie: Date = new Date();
}
