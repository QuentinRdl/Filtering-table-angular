import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TupleItem } from './models/tuple.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly title = signal('Liste de Tuples');

  // Donnees de test
  readonly tuples = signal<TupleItem[]>([
    { id: '1', nom: 'Configuration Serveur', valeur: 'true' },
    { id: '2', nom: 'Mode Debug', valeur: 'false' },
    { id: '3', nom: 'Activation Cache', valeur: 'true' },
    { id: '4', nom: 'Serveur Principal', valeur: 'true' },
    { id: '5', nom: 'Compression Gzip', valeur: 'false' },
    { id: '6', nom: 'Logs Detailles', valeur: 'true' },
    { id: '7', nom: 'Mode Maintenance', valeur: 'false' },
    { id: '8', nom: 'Serveur Backup', valeur: 'false' },
  ]);

  // Filtres
  readonly filtreNom = signal<string>('');
  readonly filtreValeur = signal<string>('tous');

  // Liste filtree calculee automatiquement
  readonly tuplesFiltres = computed(() => {
    let resultat = this.tuples();

    // Filtre par nom (recherche partielle insensible a la casse)
    const nomRecherche = this.filtreNom().toLowerCase();
    if (nomRecherche) {
      resultat = resultat.filter(tuple =>
        tuple.nom.toLowerCase().includes(nomRecherche)
      );
    }

    // Filtre par valeur
    const valeurFiltre = this.filtreValeur();
    if (valeurFiltre !== 'tous') {
      resultat = resultat.filter(tuple => tuple.valeur === valeurFiltre);
    }

    return resultat;
  });

  // Methodes pour mettre a jour les filtres
  updateFiltreNom(value: string): void {
    this.filtreNom.set(value);
  }

  updateFiltreValeur(value: string): void {
    this.filtreValeur.set(value);
  }
}
