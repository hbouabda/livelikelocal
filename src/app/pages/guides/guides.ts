import { Component, signal, inject, computed } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guides-list',
  standalone: true,
  imports: [RouterLink, MatIconModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8" id="guides-catalog-container">
      
      <!-- Breadcrumbs and header -->
      <div class="space-y-2 select-none" id="guides-breadcrumb-wrapper">
        <div class="flex items-center gap-1.5 text-xs text-slate-400">
          <a [routerLink]="['/']" class="hover:text-primary transition-colors">Accueil</a>
          <mat-icon class="text-xs">chevron_right</mat-icon>
          <span class="text-slate-600 font-medium">Explorer les Guides</span>
        </div>
        <h1 class="text-3xl font-serif font-bold text-slate-900" id="guides-title-heading">
          @if (activeCityName()) {
            Guides d'exception à <span class="text-primary">{{ activeCityName() }}</span>
          } @else if (selectedCategory()) {
            Expériences locales : <span class="text-primary">{{ selectedCategory() }}</span>
          } @else {
            Tous nos Guides Locaux Certifiés
          }
        </h1>
        <p class="text-slate-500 text-sm">Réservez une visite authentique sans intermédiaires et vivez la ville comme un habitant.</p>
      </div>

      <!-- Filters Ribbon & Search Panel -->
      <div class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4" id="filters-ribbon">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <!-- Live Text search -->
          <div class="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all">
            <mat-icon class="text-slate-400 text-md">search</mat-icon>
            <input type="text"
                   [(ngModel)]="searchQuery"
                   placeholder="Rechercher par prénom, langue, mot-clé..."
                   class="w-full bg-transparent py-3 text-sm focus:outline-none text-slate-800 placeholder-slate-400"
                   id="filter-txt-search" />
          </div>

          <!-- City filter dropdown -->
          <div class="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all">
            <mat-icon class="text-slate-400 text-md">place</mat-icon>
            <select [(ngModel)]="selectedCity"
                    class="w-full bg-transparent py-3 text-sm focus:outline-none text-slate-800 capitalize"
                    id="filter-city-dropdown">
              <option value="">Toutes les Villes</option>
              @for (city of citiesList(); track city.id) {
                <option [value]="city.id">{{ city.name }} ({{ city.country }})</option>
              }
            </select>
          </div>

          <!-- Category filter dropdown -->
          <div class="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all">
            <mat-icon class="text-slate-400 text-md">restaurant</mat-icon>
            <select [(ngModel)]="selectedCategory"
                    class="w-full bg-transparent py-3 text-sm focus:outline-none text-slate-800"
                    id="filter-category-dropdown">
              <option value="">Tous les Thèmes</option>
              @for (cat of categories; track cat.name) {
                <option [value]="cat.name">{{ cat.label }}</option>
              }
            </select>
          </div>

          <!-- Price Max Filter -->
          <div class="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all">
            <mat-icon class="text-slate-400 text-md">payments</mat-icon>
            <select [(ngModel)]="maxPrice"
                    class="w-full bg-transparent py-3 text-sm focus:outline-none text-slate-800"
                    id="filter-price-dropdown">
              <option [value]="999">Tous les Budgets</option>
              <option [value]="40">Moins de 40€/h</option>
              <option [value]="50">Moins de 50€/h</option>
              <option [value]="60">Moins de 60€/h</option>
            </select>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-50 select-none">
          <div class="text-xs text-slate-400 font-medium">
            <span class="text-slate-700 font-semibold">{{ filteredGuides().length }}</span> guide(s) correspondant à vos critères
          </div>
          <button (click)="resetFilters()"
                  class="text-xs text-secondary font-semibold hover:text-primary flex items-center gap-1.5 hover:underline decoration-primary"
                  id="btn-reset-filters">
            <mat-icon class="text-base">refresh</mat-icon>
            <span>Réinitialiser les filtres</span>
          </button>
        </div>
      </div>

      <!-- Main Columns: Guides catalog layout with GetYourGuide details -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8" id="guides-catalog-grid">
        <!-- Sidebar filters and hints (GetYourGuide Inspired layout) -->
        <div class="lg:col-span-3 space-y-6 hidden lg:block" id="guides-sidebar-help">
          <div class="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-150 space-y-4">
            <div class="flex items-center gap-2">
              <mat-icon class="text-primary">verified</mat-icon>
              <h3 class="font-bold text-slate-900 text-sm uppercase tracking-wide">La Garantie d'Hôte</h3>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed font-light">
              Tous nos guides font l'objet d'un entretien physique rigoureux et de tests de connaissances historiques avant toute activation de profil.
            </p>
            <ul class="space-y-2 text-xs text-slate-700 font-semibold">
              <li class="flex items-center gap-1.5"><mat-icon class="text-emerald-500 text-sm">check_circle</mat-icon> Tarifs transparents</li>
              <li class="flex items-center gap-1.5"><mat-icon class="text-emerald-500 text-sm">check_circle</mat-icon> Messagerie directe P2P</li>
              <li class="flex items-center gap-1.5"><mat-icon class="text-emerald-500 text-sm">check_circle</mat-icon> Réservation instantanée</li>
            </ul>
          </div>

          <!-- Beautiful visual banner for custom applet attraction -->
          <div class="bg-brand-dark text-white rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <span class="bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Fonctionnalité IA
            </span>
            <h4 class="font-serif font-bold text-base leading-tight">Chattez gratuitement avec le jumeau virtuel de votre Guide !</h4>
            <p class="text-[11px] text-slate-300 font-light leading-relaxed">
              Obtenez instantanément des conseils sur-mesure de nos guides générés par l'intelligence artificielle Gemini avant même d'effectuer votre réservation réelle.
            </p>
          </div>
        </div>

        <!-- Guides List Grid (cards style GetYourGuide) -->
        <div class="lg:col-span-9 space-y-6" id="guides-list-cards-wrapper">
          @if (filteredGuides().length === 0) {
            <!-- Empty state -->
            <div class="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4 shadow-sm" id="empty-state-guides">
              <div class="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto select-none">
                <mat-icon class="text-4xl text-slate-300">mood_bad</mat-icon>
              </div>
              <div class="space-y-1">
                <h3 class="font-bold text-slate-800 text-lg">Aucun guide ne correspond exactement</h3>
                <p class="text-slate-400 text-xs font-light max-w-sm mx-auto">
                  Essayez d'élargir vos options tarifaires ou d'enlever le filtre du thème pour trouver votre hôte idéal de vacances !
                </p>
              </div>
              <button (click)="resetFilters()" 
                      class="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-6 rounded-xl smooth-hover shadow-md shadow-primary/20"
                      id="btn-reinit-empty">
                Voir toutes les visites
              </button>
            </div>
          } @else {
            @for (guide of filteredGuides(); track guide.id) {
              <div [routerLink]="['/guides', guide.id]"
                   class="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row gap-6 group relative"
                   [id]="'guide-item-card-' + guide.id">
                
                <!-- Pictures left side slider simulation -->
                <div class="w-full md:w-64 h-48 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 relative">
                  <img [src]="guide.experiences[0]?.image || 'https://picsum.photos/seed/experience/600/400'" 
                       alt="Expérience" 
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                       referrerpolicy="no-referrer" />
                  
                  <div class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 select-none">
                    <mat-icon class="text-primary text-xs">local_activity</mat-icon>
                    <span>{{ guide.experiences.length }} expérience(s)</span>
                  </div>
                </div>

                <!-- Main Details Middle -->
                <div class="flex-1 flex flex-col gap-3 justify-between">
                  <div class="space-y-2">
                    <!-- City badge -->
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-primary font-bold uppercase tracking-wide flex items-center gap-1">
                        <mat-icon class="text-xs">place</mat-icon>{{ guide.cityName }}
                      </span>
                      <span class="flex items-center gap-0.5 select-none text-xs font-bold text-slate-850">
                        <mat-icon class="text-amber-400 text-sm">star</mat-icon>
                        <span>{{ guide.rating }}</span>
                        <span class="text-slate-400 font-normal">({{ guide.reviewCount }})</span>
                      </span>
                    </div>

                    <!-- Guide Title (Name + Tagline/Intro) -->
                    <h3 class="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">
                      {{ guide.firstName }} {{ guide.lastName }}
                    </h3>

                    <p class="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">
                      {{ guide.bio }}
                    </p>
                  </div>

                  <!-- Badges / Tags -->
                  <div class="flex flex-wrap gap-1.5 select-none text-[10px] font-medium my-1" id="skills-list">
                    @for (skill of guide.skills; track skill) {
                      <span class="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100">
                        {{ skill }}
                      </span>
                    }
                  </div>

                  <!-- Footer indicators -->
                  <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-50 text-xs text-slate-500 select-none">
                    <span class="flex items-center gap-1"><mat-icon class="text-slate-400 text-base">translate</mat-icon> {{ guide.languages.join(' & ') }}</span>
                    <span class="flex items-center gap-1 text-emerald-600"><mat-icon class="text-base">flash_on</mat-icon> {{ guide.responseRate }}</span>
                  </div>
                </div>

                <!-- Price and CTA block Right side -->
                <div class="w-full md:w-44 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-stretch text-center gap-3">
                  <div class="space-y-1 text-left md:text-center">
                    <span class="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">Tarif moyen</span>
                    <div class="text-2xl font-extrabold text-slate-800" id="guide-price">
                      {{ guide.pricePerHour }}€ <span class="text-xs font-normal text-slate-450 font-sans">/h</span>
                    </div>
                    <span class="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block font-semibold">
                      Annulation gratuite
                    </span>
                  </div>

                  <button class="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-4 rounded-xl w-full sm:w-auto md:w-full smooth-hover shadow-md shadow-primary/10 select-none"
                          [id]="'btn-see-profile-catalog-' + guide.firstName">
                    Voir les activités
                  </button>
                </div>

              </div>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class GuidesComponent {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  // Filter signals and models
  public searchQuery = signal('');
  public selectedCity = signal('');
  public selectedCategory = signal('');
  public maxPrice = signal(999);

  // Expose cities for the dropdown filter lists
  public citiesList = computed(() => this.dataService.cities());

  // Set categories mapping
  public categories = [
    { name: 'Gastronomy', label: 'Gastronomie', icon: 'restaurant' },
    { name: 'Culture', label: 'Culture & Histoire', icon: 'auto_stories' },
    { name: 'Adventure', label: 'Aventure', icon: 'hiking' },
    { name: 'Art & Craft', label: 'Artisanat', icon: 'palette' },
    { name: 'Nightlife', label: 'Vie Nocturne', icon: 'nightlife' }
  ];

  // Selected city descriptive text
  public activeCityName = computed(() => {
    const cityId = this.selectedCity();
    if (!cityId) return '';
    const city = this.citiesList().find(c => c.id === cityId);
    return city ? city.name : '';
  });

  // Main Computing Signal for filter combinations
  public filteredGuides = computed(() => {
    const list = this.dataService.guides();
    const query = this.searchQuery().toLowerCase().trim();
    const city = this.selectedCity();
    const category = this.selectedCategory();
    const priceCap = this.maxPrice();

    return list.filter(guide => {
      // 1. City query logic
      if (city && guide.cityId !== city) return false;

      // 2. Category logic : If specified, search in the categories of the guide's experiences
      if (category) {
        const hasCategory = guide.experiences.some(exp => exp.category === category);
        if (!hasCategory) return false;
      }

      // 3. Price Hour cap filter
      if (guide.pricePerHour > priceCap) return false;

      // 4. Live text search logic matching first name, last name, city or languages
      if (query) {
        const nameMatch = `${guide.firstName} ${guide.lastName}`.toLowerCase().includes(query);
        const cityMatch = guide.cityName.toLowerCase().includes(query);
        const langMatch = guide.languages.some(l => l.toLowerCase().includes(query));
        const bioMatch = guide.bio.toLowerCase().includes(query);
        const skillMatch = guide.skills.some(s => s.toLowerCase().includes(query));
        const expMatch = guide.experiences.some(ex => ex.title.toLowerCase().includes(query) || ex.description.toLowerCase().includes(query));

        if (!nameMatch && !cityMatch && !langMatch && !bioMatch && !skillMatch && !expMatch) return false;
      }

      return true;
    });
  });

  constructor() {
    // Listen to query parameters from routing side for instant deep-linking
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery.set(params['q']);
      }
      if (params['city']) {
        this.selectedCity.set(params['city']);
      }
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
    });
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCity.set('');
    this.selectedCategory.set('');
    this.maxPrice.set(999);
  }
}
