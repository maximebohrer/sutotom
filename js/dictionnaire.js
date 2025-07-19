import { listeMots } from "./listeMots.js";
export default class Dictionnaire {
    constructor() {
        this.motsATrouver = [];
        this.motsATrouver = listeMots.slice(-Dictionnaire.nbMotsATrouver);
    }
    mulberry32(seed, index) {
        let t = (seed + index * 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    getMot(numeroPartie) {
        const index = Math.floor(this.mulberry32(68462987, numeroPartie) * Dictionnaire.nbMotsATrouver);
        return this.motsATrouver[index % this.motsATrouver.length];
    }
    estMotValide(mot) {
        mot = this.nettoyerMot(mot);
        return mot.length >= 6 && mot.length <= 9 && listeMots.includes(mot);
    }
    nettoyerMot(mot) {
        return mot
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase();
    }
}
Dictionnaire.nbMotsATrouver = 406;
//# sourceMappingURL=dictionnaire.js.map