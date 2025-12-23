import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Creation du composant', () => {
    it('devrait creer le composant', () => {
      expect(component).toBeTruthy();
    });

    it('devrait afficher le titre correct', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain('Liste de Tuples');
    });
  });

  describe('Donnees initiales', () => {
    it('devrait avoir 8 tuples initialement', () => {
      expect(component.tuples().length).toBe(8);
    });

    it('devrait afficher tous les tuples sans filtre', () => {
      expect(component.tuplesFiltres().length).toBe(8);
    });

    it('devrait avoir les proprietes correctes pour chaque tuple', () => {
      const premier = component.tuples()[0];
      expect(premier.id).toBeDefined();
      expect(premier.nom).toBeDefined();
      expect(premier.valeur).toBeDefined();
      expect(['true', 'false']).toContain(premier.valeur);
    });
  });

  describe('Filtre par nom', () => {
    it('devrait filtrer par nom exact', () => {
      component.updateFiltreNom('Mode Debug');
      expect(component.tuplesFiltres().length).toBe(1);
      expect(component.tuplesFiltres()[0].nom).toBe('Mode Debug');
    });

    it('devrait filtrer par nom partiel', () => {
      component.updateFiltreNom('Serveur');
      const resultats = component.tuplesFiltres();
      expect(resultats.length).toBe(3); // Configuration Serveur, Serveur Principal, Serveur Backup
      resultats.forEach(tuple => {
        expect(tuple.nom.toLowerCase()).toContain('serveur');
      });
    });

    it('devrait etre insensible a la casse', () => {
      component.updateFiltreNom('serveur');
      expect(component.tuplesFiltres().length).toBe(3);

      component.updateFiltreNom('SERVEUR');
      expect(component.tuplesFiltres().length).toBe(3);

      component.updateFiltreNom('SeRvEuR');
      expect(component.tuplesFiltres().length).toBe(3);
    });

    it('devrait retourner aucun resultat pour un nom inexistant', () => {
      component.updateFiltreNom('inexistant');
      expect(component.tuplesFiltres().length).toBe(0);
    });

    it('devrait afficher tous les resultats avec une chaine vide', () => {
      component.updateFiltreNom('Serveur');
      expect(component.tuplesFiltres().length).toBe(3);

      component.updateFiltreNom('');
      expect(component.tuplesFiltres().length).toBe(8);
    });
  });

  describe('Filtre par valeur', () => {
    it('devrait filtrer les valeurs true', () => {
      component.updateFiltreValeur('true');
      const resultats = component.tuplesFiltres();

      expect(resultats.length).toBeGreaterThan(0);
      resultats.forEach(tuple => {
        expect(tuple.valeur).toBe('true');
      });
    });

    it('devrait filtrer les valeurs false', () => {
      component.updateFiltreValeur('false');
      const resultats = component.tuplesFiltres();

      expect(resultats.length).toBeGreaterThan(0);
      resultats.forEach(tuple => {
        expect(tuple.valeur).toBe('false');
      });
    });

    it('devrait afficher tous les resultats avec "tous"', () => {
      component.updateFiltreValeur('true');
      expect(component.tuplesFiltres().length).toBeLessThan(8);

      component.updateFiltreValeur('tous');
      expect(component.tuplesFiltres().length).toBe(8);
    });
  });

  describe('Combinaison de filtres', () => {
    it('devrait combiner filtre par nom et par valeur', () => {
      component.updateFiltreNom('Serveur');
      component.updateFiltreValeur('true');

      const resultats = component.tuplesFiltres();
      resultats.forEach(tuple => {
        expect(tuple.nom.toLowerCase()).toContain('serveur');
        expect(tuple.valeur).toBe('true');
      });
    });

    it('devrait retourner aucun resultat si aucune correspondance', () => {
      component.updateFiltreNom('Debug');
      component.updateFiltreValeur('true');

      expect(component.tuplesFiltres().length).toBe(0);
    });

    it('devrait reinitialiser les filtres independamment', () => {
      component.updateFiltreNom('Serveur');
      component.updateFiltreValeur('true');

      component.updateFiltreNom('');
      const resultats = component.tuplesFiltres();
      resultats.forEach(tuple => {
        expect(tuple.valeur).toBe('true');
      });

      component.updateFiltreValeur('tous');
      expect(component.tuplesFiltres().length).toBe(8);
    });
  });

  describe('Rendu du template', () => {
    it('devrait afficher le tableau avec les en-tetes corrects', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const headers = compiled.querySelectorAll('th');

      expect(headers.length).toBe(3);
      expect(headers[0].textContent).toContain('ID');
      expect(headers[1].textContent).toContain('Nom');
      expect(headers[2].textContent).toContain('Valeur');
    });

    it('devrait afficher le nombre correct de lignes', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tbody tr');

      expect(rows.length).toBe(8);
    });

    it('devrait afficher le message "aucun resultat" quand le filtre ne trouve rien', () => {
      component.updateFiltreNom('inexistant');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const message = compiled.querySelector('.aucun-resultat');

      expect(message).toBeTruthy();
      expect(message?.textContent).toContain('Aucun resultat trouve');
    });

    it('devrait appliquer la classe badge-true pour les valeurs true', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const badgesTrue = compiled.querySelectorAll('.badge-true');

      expect(badgesTrue.length).toBeGreaterThan(0);
    });

    it('devrait appliquer la classe badge-false pour les valeurs false', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const badgesFalse = compiled.querySelectorAll('.badge-false');

      expect(badgesFalse.length).toBeGreaterThan(0);
    });

    it('devrait afficher le compteur de resultats', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const info = compiled.querySelector('.info-resultats');

      expect(info).toBeTruthy();
      expect(info?.textContent).toContain('8');
      expect(info?.textContent).toContain('resultat');
    });

    it('devrait mettre a jour le compteur apres filtrage', () => {
      component.updateFiltreNom('Serveur');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const info = compiled.querySelector('.info-resultats');

      expect(info?.textContent).toContain('3');
    });
  });

  describe('Interactions utilisateur', () => {
    it('devrait filtrer quand on tape dans le champ de recherche', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('#filtreNom') as HTMLInputElement;

      input.value = 'Debug';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.tuplesFiltres().length).toBe(1);
    });

    it('devrait filtrer quand on change la selection du menu deroulant', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled.querySelector('#filtreValeur') as HTMLSelectElement;

      select.value = 'true';
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const resultats = component.tuplesFiltres();
      resultats.forEach(tuple => {
        expect(tuple.valeur).toBe('true');
      });
    });
  });
});
