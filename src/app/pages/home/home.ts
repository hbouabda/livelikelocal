import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <!-- Hero Section with Background image and search -->
    <section class="relative min-h-[500px] flex items-center justify-center text-white px-4 py-16 overflow-hidden">
      <!-- Dark overlay with high-contrast background -->
      <div class="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-neutral-900/50 z-10"></div>
      <img src="https://picsum.photos/seed/travel-hero/1600/900" 
           alt="Authentic Travel" 
           class="absolute inset-0 w-full h-full object-cover select-none animate-[pulse_6s_infinite_alternate]"
           referrerpolicy="no-referrer" />

      <!-- Hero contents -->
      <div class="relative z-20 text-center max-w-3xl mx-auto space-y-8 px-4" id="home-hero-content">
        <div class="space-y-4">
          <span class="inline-block bg-primary/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full tracking-wider uppercase animate-bounce" id="hero-tag">
            Nouveau : Expériences 100% Locales
          </span>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight" id="hero-title">
            Ne visitez pas une ville.<br>
            <span class="text-primary">Vivez-la avec un Local.</span>
          </h1>
          <p class="text-lg sm:text-xl text-slate-200 font-light max-w-2xl mx-auto" id="hero-subtitle">
            Oubliez les bus de touristes et les itinéraires en carton. Louez un guide local passionné et découvrez des secrets gardés jalousement.
          </p>
        </div>

        <!-- GetYourGuide Inspired Search Box -->
        <div class="bg-white p-2.5 sm:p-4 rounded-2xl shadow-2xl text-slate-800 max-w-2xl mx-auto flex flex-col md:flex-row items-stretch gap-2.5 border border-white/20" id="search-box-home">
          <div class="flex-1 flex items-center gap-3 px-3 bg-slate-50 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <mat-icon class="text-slate-400 select-none">place</mat-icon>
            <input type="text" 
                   [value]="searchVal()" 
                   (input)="onSearchInput($event)"
                   placeholder="Quelle ville voulez-vous explorer ?" 
                   class="w-full bg-transparent py-4 text-sm font-medium focus:outline-none placeholder-slate-400 text-slate-800"
                   id="search-input-paris" />
          </div>
          
          <button (click)="executeSearch()" 
                  class="bg-primary hover:bg-primary-hover text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 smooth-hover shadow-lg shadow-primary/20"
                  id="btn-search-guide">
            <mat-icon>search</mat-icon>
            <span>Rechercher</span>
          </button>
        </div>

        <!-- Quick Info tags -->
        <div class="flex flex-wrap justify-center gap-6 text-sm text-slate-200 font-medium pt-2 select-none" id="quick-trust-tags">
          <span class="flex items-center gap-1.5"><mat-icon class="text-primary text-base">verified</mat-icon> Guides 100% certifiés</span>
          <span class="flex items-center gap-1.5"><mat-icon class="text-primary text-base">chat_bubble</mat-icon> Chat IA d'aperçu direct</span>
          <span class="flex items-center gap-1.5"><mat-icon class="text-primary text-base">event_available</mat-icon> Annulation gratuite up to 24h</span>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="max-w-7xl mx-auto px-4 py-16" id="home-categories">
      <div class="text-center max-w-xl mx-auto mb-12 space-y-2">
        <h2 class="text-3xl font-serif font-bold tracking-tight text-slate-900" id="cat-title">Explorez par centres d'intérêt</h2>
        <p class="text-slate-500 text-sm">Des activités authentiques pour tous les goûts, menées par des hôtes passionnés.</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-4" id="categories-grid">
        @for (cat of categories; track cat.name) {
          <button (click)="filterByCategory(cat.name)"
                  class="bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 flex flex-col items-center justify-center text-center gap-3 group smooth-hover cursor-pointer"
                  [id]="'cat-button-' + cat.name">
            <div class="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center smooth-hover select-none shadow-sm">
              <mat-icon class="text-2xl">{{ cat.icon }}</mat-icon>
            </div>
            <span class="font-semibold text-slate-800 text-sm tracking-tight group-hover:text-primary transition-colors">
              {{ cat.label }}
            </span>
          </button>
        }
      </div>
    </section>

    <!-- Popular Cities Section -->
    <section class="bg-white py-16 border-y border-slate-100" id="home-destinations">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <div class="space-y-2">
            <span class="text-xs text-primary font-bold uppercase tracking-widest">Destinations phares</span>
            <h2 class="text-3xl font-serif font-bold tracking-tight text-slate-900" id="cities-title">Où s'évader avec un local ?</h2>
            <p class="text-slate-500 text-sm">Découvrez nos villes coup de cœur et le meilleur de l'authenticité locale.</p>
          </div>
          <button [routerLink]="['/guides']" 
                  class="text-secondary font-semibold hover:text-primary flex items-center gap-1.5 text-sm uppercase tracking-wider smooth-hover"
                  id="btn-all-cities">
            <span>Toutes les destinations</span>
            <mat-icon class="text-lg">arrow_forward</mat-icon>
          </button>
        </div>

        <!-- Horizontal scroll of popular cities -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" id="cities-grid">
          @for (city of citiesList(); track city.id) {
            <button (click)="filterByCity(city.id)" 
                 class="relative h-80 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-all duration-300 w-full text-left"
                 [id]="'city-card-' + city.id">
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 transition-opacity duration-300"></div>
              <img [src]="city.image" 
                   [alt]="city.name" 
                   class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                   referrerpolicy="no-referrer" />
              
              <div class="absolute bottom-0 left-0 right-0 p-5 z-20 space-y-1">
                <span class="text-[10px] bg-white/20 backdrop-blur-md text-white font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                  {{ city.country }}
                </span>
                <h3 class="text-xl font-bold text-white">{{ city.name }}</h3>
                <p class="text-[11px] text-slate-300 line-clamp-2 font-light">
                  {{ city.tagline }}
                </p>
              </div>
            </button>
          }
        </div>
      </div>
    </section>

    <!-- Popular Local Guides Carousel / Grid -->
    <section class="max-w-7xl mx-auto px-4 py-16" id="home-featured-guides">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
        <div class="space-y-2">
          <span class="text-xs text-primary font-bold uppercase tracking-widest">Experts de terrain</span>
          <h2 class="text-3xl font-serif font-bold tracking-tight text-slate-900" id="guides-section-title">Rencontrez nos guides stars</h2>
          <p class="text-slate-500 text-sm">Ils partagent leur passion, leur histoire et leurs adresses secrètes.</p>
        </div>
        <button [routerLink]="['/guides']" 
                class="text-secondary font-semibold hover:text-primary flex items-center gap-1.5 text-sm uppercase tracking-wider smooth-hover"
                id="btn-all-guides">
          <span>Tous les guides</span>
          <mat-icon class="text-lg">arrow_forward</mat-icon>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8" id="featured-guides-grid">
        @for (guide of featuredGuides(); track guide.id) {
          <div [routerLink]="['/guides', guide.id]"
               class="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group hover:-translate-y-1"
               [id]="'featured-guide-card-' + guide.id">
            <!-- Header Image of first experience -->
            <div class="relative h-48 bg-slate-100 overflow-hidden">
              <img [src]="guide.experiences[0]?.image || 'https://picsum.photos/seed/experience/600/400'" 
                   alt="Tours" 
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                   referrerpolicy="no-referrer" />
              <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm select-none">
                <mat-icon class="text-primary text-sm">place</mat-icon>
                <span>{{ guide.cityName }}</span>
              </div>
              <div class="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {{ guide.pricePerHour }}€ <span class="font-normal text-[10px]/none">/h</span>
              </div>
            </div>

            <!-- Profile & Details -->
            <div class="p-6 space-y-4 flex-1 flex flex-col relative">
              <!-- Avatar -->
              <div class="absolute -top-10 left-6 w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-md bg-white select-none">
                <img [src]="guide.avatar" alt="Avatar" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
              </div>

              <div class="pt-6 space-y-2">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
                    {{ guide.firstName }} {{ guide.lastName }}
                  </h3>
                  <!-- Badge Verified -->
                  <div class="flex items-center gap-0.5 text-primary">
                    <mat-icon class="text-base">verified</mat-icon>
                    <span class="text-[10px] font-bold tracking-wider uppercase">Certifié</span>
                  </div>
                </div>

                <!-- Rating -->
                <div class="flex items-center gap-1 select-none">
                  <mat-icon class="text-amber-400 text-sm">star</mat-icon>
                  <span class="text-xs font-bold text-slate-850">{{ guide.rating }}</span>
                  <span class="text-xs text-slate-400">({{ guide.reviewCount }} avis)</span>
                </div>

                <!-- Bio excerpt -->
                <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed font-light">
                  {{ guide.bio }}
                </p>
              </div>

              <!-- Languages & Specialty -->
              <div class="space-y-2 pt-2 border-t border-slate-50 flex-1 flex flex-col justify-end">
                <div class="flex flex-wrap gap-1.5 select-none text-[10px] font-medium" id="skills-pill">
                  @for (skill of guide.skills.slice(0, 2); track skill) {
                    <span class="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100">
                      {{ skill }}
                    </span>
                  }
                </div>
                
                <div class="flex items-center justify-between text-[11px] text-slate-500 select-none">
                  <span class="flex items-center gap-1"><mat-icon class="text-slate-400 text-xs">translate</mat-icon> {{ guide.languages.join(', ') }}</span>
                  <span class="text-secondary font-semibold group-hover:underline flex items-center gap-0.5">
                    Voir l'offre <mat-icon class="text-sm">chevron_right</mat-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Creative Trust & Value Section -->
    <section class="bg-brand-dark text-white py-16" id="home-trust-banners">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <span class="text-primary font-bold text-sm tracking-widest uppercase block">L'ADN LiveLikeLocal</span>
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight" id="why-ll-title">
            Nous bousculons les codes du voyage traditionnel.
          </h2>
          <p class="text-slate-300 leading-relaxed font-light text-sm">
            Il n'y a rien de pire que d'arriver dans une métropole mondialisée et de simplement cocher les monuments d'un prospectus classique. Nos guides locaux sont soigneusement formés et accrédités pour vous donner accès à de véritables pans de vie culturels : ateliers cachés, clubs secrets et banquets conviviaux en petit comité.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4" id="trust-bullets">
            <div class="flex gap-3">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 select-none">
                <mat-icon>payments</mat-icon>
              </div>
              <div>
                <h4 class="font-bold text-white text-sm">Tarification Directe</h4>
                <p class="text-xs text-slate-400 font-light mt-0.5">Aucun intermédiaire fantôme. Votre argent rémunère directement le savoir des locaux.</p>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 select-none">
                <mat-icon>forum</mat-icon>
              </div>
              <div>
                <h4 class="font-bold text-white text-sm">Chat IA de prévisualisation</h4>
                <p class="text-xs text-slate-400 font-light mt-0.5">Explorez instantanément et discutez gratuitement avec le jumeau IA du guide de votre choix.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Simulated beautiful interface graphic or mockup generated -->
        <div class="relative bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6" id="mockup-home">
          <!-- Decorative UI mock -->
          <div class="flex items-center gap-3 border-b border-slate-700 pb-4">
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white select-none">
              <mat-icon>chat_bubble</mat-icon>
            </div>
            <div>
              <h3 class="text-sm font-bold">Ask-a-Local Guide Simulator</h3>
              <p class="text-[10px] text-slate-400">Converser virtuellement avec Chloé de Paris</p>
            </div>
          </div>

          <div class="space-y-4 text-xs font-light">
            <div class="bg-slate-700/50 p-4 rounded-2xl max-w-[85%] border border-slate-600/50">
              <p class="text-slate-300">"Chloé, je viens à Paris le week-end prochain avec mes enfants. Quel itinéraire gourmand à Montmartre me conseilles-tu ?"</p>
            </div>
            <div class="bg-primary/10 p-4 rounded-2xl max-w-[85%] self-end ml-auto border border-primary/20 text-slate-205">
              <p class="text-slate-200">
                <strong class="font-semibold text-primary block text-[10px] mb-1">Chloé :</strong>
                "Bonjour ! 🥖 Je conseille d'éviter l'avenue principale de la butte ! Commençons par la charmante rue Lepic pour déguster des chouquettes magiques, puis descendons par la Villa Léandre pour de magnifiques photos à l'abri des voitures !"
              </p>
            </div>
          </div>
          <div class="text-[11px] text-slate-400 text-center border-t border-slate-700 pt-4 font-medium">
            Testez en direct en visitant le profil de n'importe quel de nos guides !
          </div>
        </div>
      </div>
    </section>

    <!-- Easy Customer Testimonials & Newsletter -->
    <section class="max-w-7xl mx-auto px-4 py-16 space-y-16" id="home-community">
      <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 sm:p-12 border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-8" id="newsletter-card">
        <div class="space-y-4 max-w-lg">
          <span class="text-primary font-bold text-xs uppercase tracking-widest block">Rejoignez-nous</span>
          <h2 class="text-3xl font-serif font-bold text-slate-900 tracking-tight" id="news-title">Profitez d'adresses secrètes gratuites</h2>
          <p class="text-slate-600 font-light text-sm leading-relaxed">
            Abonnez-vous à notre lettre d'information hebdomadaire. Recevez directement l'adresse des meilleurs restaurants confidentiels secrets et conseils pratiques rédigés directement par nos guides locaux.
          </p>
        </div>

        <div class="w-full max-w-sm space-y-3">
          @if (subscribed()) {
            <div class="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 text-center text-sm font-medium animation-pulse" id="news-success">
              🎉 Félicitations ! Vous êtes inscrit à nos lettres secrètes locales.
            </div>
          } @else {
            <div class="flex flex-col sm:flex-row gap-2">
              <input type="email" 
                     placeholder="Votre adresse e-mail" 
                     class="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800"
                     #newsEmail />
              <button (click)="subscribeUser(newsEmail.value)" 
                      class="bg-primary hover:bg-primary-hover text-white font-semibold py-3.5 px-6 rounded-xl text-sm smooth-hover shadow-md shadow-primary/20"
                      id="news-btn">
                M'abonner
              </button>
            </div>
            <p class="text-[10px] text-slate-400 text-center sm:text-left">Désinscription à tout moment. Nous détestons les spams.</p>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  private dataService = inject(DataService);
  private router = inject(Router);

  public searchVal = signal('');
  public subscribed = signal(false);

  // Expose signal lists
  public citiesList = computed(() => this.dataService.cities());
  public featuredGuides = computed(() => this.dataService.guides().slice(0, 3));

  public categories = [
    { name: 'Gastronomy', label: 'Gastronomie', icon: 'restaurant' },
    { name: 'Culture', label: 'Culture & Histoire', icon: 'auto_stories' },
    { name: 'Adventure', label: 'Aventure & Balades', icon: 'hiking' },
    { name: 'Art & Craft', label: 'Artisanat & Arts', icon: 'palette' },
    { name: 'Nightlife', label: 'Vie Nocturne', icon: 'nightlife' }
  ];

  onSearchInput(event: Event) {
    const el = event.target as HTMLInputElement;
    this.searchVal.set(el.value);
  }

  executeSearch() {
    const val = this.searchVal().trim();
    if (val) {
      this.router.navigate(['/guides'], { queryParams: { q: val } });
    } else {
      this.router.navigate(['/guides']);
    }
  }

  filterByCity(cityId: string) {
    this.router.navigate(['/guides'], { queryParams: { city: cityId } });
  }

  filterByCategory(category: string) {
    this.router.navigate(['/guides'], { queryParams: { category: category } });
  }

  subscribeUser(email: string) {
    if (email && email.includes('@')) {
      this.subscribed.set(true);
    }
  }
}
