import { listeMots } from "./listeMots.js";

export default class Dictionnaire {
  motsATrouver: string[] = [];
  private static readonly nbMotsATrouver = 406;

  public constructor() {
    this.motsATrouver = listeMots.slice(-Dictionnaire.nbMotsATrouver);
  }

  private mulberry32(seed: number, index: number): number {
    let t = (seed + index * 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

  public getMot(numeroPartie: number): string {
    const index = Math.floor(this.mulberry32(68462987, numeroPartie) * Dictionnaire.nbMotsATrouver);
    return this.motsATrouver[index % this.motsATrouver.length];
  }

  public estMotValide(mot: string): boolean {
    mot = this.nettoyerMot(mot);
    return mot.length >= 6 && mot.length <= 9 && listeMots.includes(mot);
  }

  public nettoyerMot(mot: string): string {
    return mot
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }
}
