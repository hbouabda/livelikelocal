import { Component, signal, inject, computed, ElementRef, ViewChild, effect } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data';
import { Guide, Experience } from '../../services/mock-data';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guide-detail',
  standalone: true,
  imports: [RouterLink, MatIconModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8" id="guide-detail-root">
      
      <!-- Back and Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-slate-400 select-none">
        <a [routerLink]="['/guides']" class="hover:text-primary flex items-center gap-0.5 font-medium transition-colors">
          <mat-icon class="text-sm">arrow_back</mat-icon> Retour aux guides
        </a>
        <span>/</span>
        <span class="text-slate-600 font-semibold">{{ guide()?.firstName }} {{ guide()?.lastName }}</span>
      </div>

      @if (!guide()) {
        <!-- Guide not found warning state -->
        <div class="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4 shadow-sm" id="guide-not-found">
          <mat-icon class="text-slate-300 text-5xl">person_off</mat-icon>
          <div class="space-y-1">
            <h3 class="font-bold text-slate-800 text-lg">Guide indisponible</h3>
            <p class="text-slate-400 text-xs font-light">Le guide local sélectionné semble introuvable ou son accréditation est momentanément suspendue.</p>
          </div>
          <button [routerLink]="['/guides']" class="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-6 rounded-xl smooth-hover shadow-md shadow-primary/20">
            Explorer d'autres profils
          </button>
        </div>
      } @else {
        <!-- Main Layout Split Grid (Details left, Sticky Booking Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Outer Left Detail Panel (8 Grid Cols) -->
          <div class="lg:col-span-8 space-y-8" id="guide-main-area">
            
            <!-- Guide Profile Introduction Header Banner -->
            <div class="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden" id="guide-intro-card">
              <div class="absolute -right-16 -top-16 w-36 h-36 bg-orange-50 rounded-full blur-2xl"></div>

              <!-- Avatar large -->
              <div class="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white bg-slate-100 flex-shrink-0 relative select-none">
                <img [src]="guide()!.avatar" alt="Avatar large" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
              </div>

              <!-- Main name, trust markers and responses -->
              <div class="space-y-3 flex-1">
                <div class="flex flex-wrap items-center gap-2.5">
                  <h1 class="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 leading-none">
                    {{ guide()!.firstName }} {{ guide()!.lastName }}
                  </h1>
                  <span class="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase select-none tracking-wider">
                    <mat-icon class="text-sm">verified</mat-icon> Guide Certifié
                  </span>
                </div>

                <p class="text-xs text-slate-500 font-light max-w-lg leading-relaxed">
                  Basé à <strong class="text-slate-700 font-semibold">{{ guide()!.cityName }}</strong> • Actif depuis {{ guide()!.activeSince }}
                </p>

                <!-- Rating line with real count -->
                <div class="flex flex-wrap items-center gap-4 text-xs select-none">
                  <div class="flex items-center gap-1 font-bold text-slate-800">
                    <mat-icon class="text-amber-400 text-base">star</mat-icon>
                    <span>{{ guide()!.rating }} / 5</span>
                    <span class="text-slate-400 font-normal">({{ guide()!.reviewCount }} avis)</span>
                  </div>
                  <div class="text-slate-300">|</div>
                  <div class="flex items-center gap-1 text-emerald-600 font-semibold">
                    <mat-icon class="text-base text-emerald-500">flash_on</mat-icon>
                    <span>S'engage à répondre en moins d'une heure</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Photos Carousel / Grid -->
            <div class="space-y-3" id="guide-photo-gallery">
              <h3 class="text-lg font-serif font-bold text-slate-900">Portfolio de terrain et moments partagés</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4" id="gallery-grid">
                @for (photo of guide()!.photos; track $index) {
                  <div class="h-44 rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer border border-slate-100">
                    <img [src]="photo" 
                         [alt]="'Photo gallery ' + $index" 
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                         referrerpolicy="no-referrer" />
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                }
              </div>
            </div>

            <!-- About Guide Biography -->
            <div class="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4" id="guide-about-bio">
              <h3 class="text-lg font-serif font-bold text-slate-900">À propos de votre Guide</h3>
              <p class="text-slate-600 text-sm font-light leading-relaxed whitespace-pre-line">
                {{ guide()!.bio }}
              </p>

              <!-- Language details and skills list -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-50 select-none">
                <div class="space-y-1.5">
                  <span class="text-xs text-slate-400 uppercase tracking-widest font-semibold block">Langues parlées</span>
                  <div class="flex flex-wrap gap-1.5 text-xs font-semibold text-slate-700">
                    @for (lang of guide()!.languages; track lang) {
                      <span class="bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-slate-205">
                        <mat-icon class="text-slate-400 text-sm">translate</mat-icon>
                        {{ lang }}
                      </span>
                    }
                  </div>
                </div>

                <div class="space-y-1.5">
                  <span class="text-xs text-slate-400 uppercase tracking-widest font-semibold block">Spécialités de visite</span>
                  <div class="flex flex-wrap gap-1.5 text-xs font-semibold text-slate-700">
                    @for (skill of guide()!.skills; track skill) {
                      <span class="bg-orange-50/70 text-primary-hover px-2.5 py-1 rounded-md border border-orange-100/50">
                        {{ skill }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Experiences Catalog from this guide (GYG Inspired layout) -->
            <div class="space-y-5" id="guide-experiences-section">
              <div class="space-y-1">
                <h3 class="text-xl font-serif font-bold text-slate-900">Expériences mémorables disponibles</h3>
                <p class="text-xs text-slate-500 font-light">Sélectionnez une des activités d'exception de {{ guide()!.firstName }} pour faire votre réservation.</p>
              </div>

              <div class="space-y-4" id="exp-offers-wrapper">
                @for (exp of guide()!.experiences; track exp.id) {
                  <div class="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row gap-5 p-4 transition-all duration-300 relative group"
                       [class.ring-2]="selectedExperience()?.id === exp.id"
                       [class.ring-primary]="selectedExperience()?.id === exp.id">
                    
                    <!-- Exp visual thumbnail -->
                    <div class="w-full md:w-56 h-36 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 relative">
                      <img [src]="exp.image" alt="Experience preview" class="w-full h-full object-cover group-hover:scale-103 transition-transform" referrerpolicy="no-referrer" />
                      <span class="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                        {{ exp.category }}
                      </span>
                    </div>

                    <!-- Details of specific experience -->
                    <div class="flex-1 flex flex-col justify-between space-y-3">
                      <div class="space-y-1.5">
                        <div class="flex items-center justify-between gap-2">
                          <h4 class="text-base font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors">
                            {{ exp.title }}
                          </h4>
                        </div>
                        <p class="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">
                          {{ exp.description }}
                        </p>
                      </div>

                      <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium select-none">
                        <span class="flex items-center gap-1"><mat-icon class="text-slate-400 text-sm">schedule</mat-icon> {{ exp.duration }} heures</span>
                        <span class="flex items-center gap-1"><mat-icon class="text-slate-400 text-sm">people</mat-icon> Jusqu'à {{ exp.maxParticipants }} participants</span>
                        <span class="flex items-center gap-1 text-emerald-600"><mat-icon class="text-emerald-500 text-sm">verified_user</mat-icon> Confirmé à 100%</span>
                      </div>

                      <!-- Sub-inclusion list summary -->
                      <div class="text-[10px] text-slate-500 flex flex-wrap gap-2 pt-2 border-t border-slate-50 font-medium">
                        <span class="text-slate-400 uppercase font-semibold">Inclus :</span>
                        @for (inc of exp.included.slice(0, 2); track inc) {
                          <span class="flex items-center gap-0.5"><mat-icon class="text-emerald-600 text-xs">done</mat-icon> {{ inc }}</span>
                        }
                      </div>
                    </div>

                    <!-- Price action box with bullet select -->
                    <div class="w-full md:w-36 flex flex-row md:flex-col justify-between md:justify-center items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                      <div class="text-left md:text-center space-y-0.5">
                        <span class="text-[9px] text-slate-400 uppercase tracking-wider block">Prix par personne</span>
                        <div class="text-xl font-extrabold text-slate-800">{{ exp.price }}€</div>
                      </div>

                      <button (click)="selectExperienceOffer(exp)" 
                              class="text-xs font-bold py-2.5 px-4 rounded-lg smooth-hover select-none"
                              [class.bg-primary]="selectedExperience()?.id === exp.id"
                              [class.text-white]="selectedExperience()?.id === exp.id"
                              [class.bg-slate-50]="selectedExperience()?.id !== exp.id"
                              [class.text-slate-700]="selectedExperience()?.id !== exp.id"
                              [class.border]="selectedExperience()?.id !== exp.id"
                              [class.border-slate-200]="selectedExperience()?.id !== exp.id"
                              [id]="'btn-select-exp-pkg-' + exp.id">
                        {{ selectedExperience()?.id === exp.id ? 'Sélectionné' : 'Choisir' }}
                      </button>
                    </div>

                  </div>
                }
              </div>
            </div>

            <!-- Live Direct Chat and Gemini Virtual AI Guide -->
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col" id="guide-chats-container">
              <!-- Custom attractive banner introducing AI assistant -->
              <div class="bg-gradient-to-r from-secondary to-accent text-white p-5 sm:p-6 space-y-2 select-none">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary select-none animate-pulse">
                      <mat-icon>model_training</mat-icon>
                    </div>
                    <div>
                      <h3 class="font-bold text-sm sm:text-base">Moteur de dialogue virtuel de {{ guide()!.firstName }}</h3>
                      <p class="text-[10px] text-slate-200">Alimenté par Google Gemini 3.5 Flash</p>
                    </div>
                  </div>
                  <!-- Status beacon -->
                  <div class="flex items-center gap-1.5 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/20">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span class="text-[9px] font-bold tracking-wider uppercase text-emerald-200">Double IA Actif</span>
                  </div>
                </div>
                <p class="text-xs text-slate-200 font-light max-w-2xl leading-relaxed pt-1">
                  Besoin de conseils personnalisés, de recommander un restaurant, d'ajuster l'itinéraire ou de vérifier un détail de rendez-vous ? Demandez directement à mon double virtuel ci-dessous !
                </p>
              </div>

              <!-- Message listing zone -->
              <div class="h-80 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-4" #chatContainer id="live-chat-panel">
                @if (messages().length === 0) {
                  <!-- Warm introduction dialogue box state -->
                  <div class="text-center py-10 space-y-3 px-4 max-w-sm mx-auto select-none" id="empty-chats">
                    <mat-icon class="text-slate-300 text-4xl">chat</mat-icon>
                    <div class="space-y-1">
                      <h4 class="font-bold text-slate-700 text-xs uppercase tracking-wide">Débuter la conversation</h4>
                      <p class="text-[11px] text-slate-400 font-light">
                        Posez une question sur son parcours d'hôte, ou demandez ses secrets privilégiés à {{ guide()!.firstName }} !
                      </p>
                    </div>
                  </div>
                } @else {
                  @for (msg of messages(); track msg.id) {
                    <div class="flex gap-3" 
                         [class.justify-end]="msg.sender === 'user'" 
                         [class.flex-row-reverse]="msg.sender === 'user'">
                      
                      <!-- Minor Avatar thumbnail -->
                      <div class="w-7 h-7 rounded-full overflow-hidden select-none bg-slate-200 flex-shrink-0">
                        <img [src]="msg.sender === 'user' ? dataService.currentUser().avatar : guide()!.avatar" 
                             alt="Chat avatar" 
                             class="w-full h-full object-cover" 
                             referrerpolicy="no-referrer" />
                      </div>

                      <div class="space-y-1 max-w-[80%]">
                        <div class="rounded-2xl p-3.5 text-xs text-slate-800 shadow-sm font-light leading-relaxed"
                             [class.bg-white]="msg.sender !== 'user'"
                             [class.border]="msg.sender !== 'user'"
                             [class.border-slate-100]="msg.sender !== 'user'"
                             [class.bg-primary]="msg.sender === 'user'"
                             [class.text-white]="msg.sender === 'user'">
                          {{ msg.text }}
                        </div>
                        <span class="block text-[9px] text-slate-400 text-right font-medium pr-1 select-none">
                          {{ msg.timestamp }}
                        </span>
                      </div>
                    </div>
                  }
                }

                @if (aiLoading()) {
                  <!-- Fancy loader for virtual response generating -->
                  <div class="flex gap-3">
                    <div class="w-7 h-7 rounded-full overflow-hidden select-none bg-slate-100 flex-shrink-0 animate-pulse">
                      <img [src]="guide()!.avatar" alt="Avatar loading" class="w-full h-full object-cover opacity-60" />
                    </div>
                    <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-1.5 min-w-[120px]">
                      <span class="block text-[10px] text-primary font-semibold tracking-wider uppercase animate-pulse">
                        {{ guide()!.firstName }} rédige...
                      </span>
                      <div class="flex gap-1 select-none py-1.5" id="ai-dots">
                        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 animate-[bounce_1s_infinite_100ms]"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 animate-[bounce_1s_infinite_300ms]"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 animate-[bounce_1s_infinite_500ms]"></span>
                      </div>
                    </div>
                  </div>
                }
              </div>

              <!-- Message Composer Bottom Area -->
              <div class="p-3 bg-white border-t border-slate-100 flex items-center gap-2" id="composer-chat">
                <input type="text"
                       [(ngModel)]="chatText"
                       (keydown.enter)="sendChatMessage()"
                       [disabled]="aiLoading()"
                       placeholder="Posez votre question à Chloé ou un autre guide d'exception..."
                       class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 disabled:opacity-60"
                       id="chat-typed-question" />
                
                <button (click)="sendChatMessage()"
                        [disabled]="aiLoading() || !chatText().trim()"
                        class="bg-primary hover:bg-primary-hover disabled:bg-slate-250 text-white p-3 rounded-xl flex items-center justify-center smooth-hover select-none shadow-md shadow-primary/20"
                        id="chat-submit-btn">
                  <mat-icon class="text-md">send</mat-icon>
                </button>
              </div>
            </div>

            <!-- Traveler Reviews listing (Trust Building section) -->
            <div class="space-y-4" id="guide-reviews-list">
              <h3 class="text-lg font-serif font-bold text-slate-900 select-none">Quelques avis sincères</h3>
              <div class="space-y-3" id="reviews-grid-wrapper">
                @for (rev of guide()!.reviews; track rev.id) {
                  <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3" [id]="'review-item-' + rev.id">
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full overflow-hidden bg-slate-100 select-none">
                          <img [src]="rev.userAvatar" alt="Revew avatar" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                        </div>
                        <div>
                          <h4 class="font-bold text-xs text-slate-800 leading-none">{{ rev.userName }}</h4>
                          <span class="text-[10px] text-slate-400 font-light mt-1 block select-none">Visité en {{ rev.date }}</span>
                        </div>
                      </div>

                      <!-- Rating stars display -->
                      <div class="flex items-center gap-0.5 select-none bg-orange-50 px-2.5 py-1 rounded-full text-xs font-semibold text-primary">
                        <mat-icon class="text-sm">star</mat-icon>
                        <span>{{ rev.rating }} / 5</span>
                      </div>
                    </div>

                    <p class="text-xs text-slate-500 font-light leading-relaxed">
                      " {{ rev.comment }} "
                    </p>
                  </div>
                }
              </div>
            </div>

          </div>

          <!-- Outer Right Sticky Booking Panel (4 Grid Cols) -->
          <div class="lg:col-span-4 lg:sticky lg:top-24 space-y-4" id="booking-sidebar">
            <div class="bg-white rounded-3xl border border-slate-150 p-6 shadow-xl space-y-6" id="booking-box-panel">
              
              <!-- Selected Product Brief -->
              <div class="space-y-1.5 border-b border-slate-100 pb-4">
                <span class="text-[10px] text-primary font-bold uppercase tracking-widest block select-none">Votre Activité</span>
                <h3 class="font-bold text-slate-900 text-sm leading-snug">
                  {{ selectedExperience() ? selectedExperience()!.title : 'Sélectionnez une expérience' }}
                </h3>
                @if (selectedExperience()) {
                  <div class="text-xs font-extrabold text-slate-800 pt-1 select-none flex items-center justify-between">
                    <span>Tarif unitaire :</span>
                    <span class="text-primary text-sm">{{ selectedExperience()!.price }}€</span>
                  </div>
                }
              </div>

              <!-- Select Date & Spots selection -->
              <div class="space-y-4">
                <div class="space-y-1">
                  <label for="book-date-picker" class="text-xs text-slate-400 font-bold uppercase tracking-wider block">Date souhaitée</label>
                  <div class="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <mat-icon class="text-slate-400 text-sm select-none">calendar_today</mat-icon>
                    <input type="date"
                           [(ngModel)]="bookDate"
                           class="w-full bg-transparent py-3 text-xs focus:outline-none text-slate-800"
                           id="book-date-picker" />
                  </div>
                </div>

                <div class="space-y-1">
                  <label for="book-spots-selector" class="text-xs text-slate-400 font-bold uppercase tracking-wider block">Nombre de spectateurs / participants</label>
                  <div class="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <mat-icon class="text-slate-400 text-sm select-none">group</mat-icon>
                    <select [(ngModel)]="bookSpots"
                            class="w-full bg-transparent py-3 text-xs focus:outline-none text-slate-800"
                            id="book-spots-selector">
                      <option [value]="1">1 Personne</option>
                      <option [value]="2">2 Personnes</option>
                      <option [value]="3">3 Personnes</option>
                      <option [value]="4">4 Personnes</option>
                      <option [value]="5">5 Personnes</option>
                      <option [value]="6">6 Personnes</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Price recap display -->
              <div class="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100" id="price-recap">
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span>{{ bookSpots() }} x {{ selectedExperience() ? selectedExperience()!.price : 0 }}€</span>
                  <span>{{ totalPriceRecomputed() }}€</span>
                </div>
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span>Frais de réservation</span>
                  <span class="text-emerald-600 font-semibold select-none">Gratuit</span>
                </div>
                <div class="flex items-center justify-between text-sm font-bold text-slate-800 pt-2 border-t border-slate-200 select-none">
                  <span>Total à payer</span>
                  <span class="text-xl text-primary font-extrabold">{{ totalPriceRecomputed() }}€</span>
                </div>
              </div>

              <!-- Dynamic confirmation message if success -->
              @if (bookingSuccessText()) {
                <div class="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 text-center text-xs font-semibold animate-[bounce_1s]" id="bk-success">
                  🎉 {{ bookingSuccessText() }}
                  <p class="text-[10px] font-light text-slate-600 mt-1">Vous recevez un message instantané de confirmation sur votre chat ! </p>
                </div>
              }

              <!-- Booking CTA block -->
              <button (click)="submitBookingPayment()"
                      [disabled]="!selectedExperience() || !bookDate() || bookingSuccessText() !== ''"
                      class="bg-primary hover:bg-primary-hover disabled:bg-slate-200 text-white font-bold py-4 px-6 rounded-xl w-full smooth-hover shadow-lg shadow-primary/20 flex items-center justify-center gap-2 select-none"
                      id="btn-confirm-booking-sidebar">
                <mat-icon>credit_card</mat-icon>
                <span>Confirmer et Réserver</span>
              </button>

              <div class="text-[10px] text-slate-400 text-center leading-relaxed font-light py-1 border-t border-slate-50 select-none">
                Garantie du meilleur prix sans frais cachés. Annulation 24h avant le départ pour remboursement intégral.
              </div>
            </div>
          </div>

        </div>
      }
    </div>
  `
})
export class GuideDetailComponent {
  public dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  public guide = signal<Guide | undefined>(undefined);
  public selectedExperience = signal<Experience | undefined>(undefined);

  // Form selections
  public bookDate = signal('2026-06-10');
  public bookSpots = signal(1);
  public bookingSuccessText = signal('');

  // Chat inputs & states
  public chatText = signal('');
  public aiLoading = signal(false);

  // Return specific active chats with this guide
  public messages = computed(() => {
    const activeG = this.guide();
    if (!activeG) return [];
    const chatObj = this.dataService.directChats().find(c => c.guideId === activeG.id);
    return chatObj ? chatObj.messages : [];
  });

  // Calculate total price based on choices
  public totalPriceRecomputed = computed(() => {
    const exp = this.selectedExperience();
    if (!exp) return 0;
    return exp.price * this.bookSpots();
  });

  constructor() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        const matchingGuide = this.dataService.guides().find(g => g.id === id);
        if (matchingGuide) {
          this.guide.set(matchingGuide);
          // Auto select first experience
          if (matchingGuide.experiences && matchingGuide.experiences.length > 0) {
            this.selectedExperience.set(matchingGuide.experiences[0]);
          }
        }
      }
    });

    // Automatically scroll chat container to bottom on message change
    effect(() => {
      if (this.messages().length > 0 || this.aiLoading()) {
        setTimeout(() => this.scrollChatToBottom(), 50);
      }
    });
  }

  selectExperienceOffer(exp: Experience) {
    this.selectedExperience.set(exp);
    this.bookingSuccessText.set(''); // Clear previous purchase confirmations if choice changes
  }

  submitBookingPayment() {
    const g = this.guide();
    const exp = this.selectedExperience();
    if (g && exp) {
      this.dataService.createNewBooking(g, exp, this.bookDate(), this.bookSpots());
      this.bookingSuccessText.set(`Réservation effectuée avec succès ! (Code Référence : LiveLocal-${Math.floor(Math.random() * 900)})`);
      
      // Clear success feedback banner after 6 seconds
      setTimeout(() => {
        this.bookingSuccessText.set('');
      }, 7000);
    }
  }

  async sendChatMessage() {
    const textStr = this.chatText().trim();
    const g = this.guide();
    if (!textStr || !g) return;

    this.chatText.set('');
    this.aiLoading.set(true);

    try {
      await this.dataService.askLocalGuideAI(g, textStr);
    } catch (e) {
      console.error(e);
    } finally {
      this.aiLoading.set(false);
    }
  }

  private scrollChatToBottom() {
    try {
      if (this.chatContainer) {
        const el = this.chatContainer.nativeElement as HTMLElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch {
      // ignore
    }
  }
}
