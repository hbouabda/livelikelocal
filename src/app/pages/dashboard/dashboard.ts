import { Component, signal, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guide-dashboard',
  standalone: true,
  imports: [RouterLink, MatIconModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-8" id="guide-dashboard-root">
      
      <!-- Welcome message and state header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6" id="dashboard-header-block">
        <div class="space-y-1.5 animate-heading">
          <div class="flex items-center gap-2">
            <span class="bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider select-none">
              Console Pro
            </span>
            <span class="text-xs text-slate-400 font-medium">Tableau de bord de gestion</span>
          </div>
          <h1 class="text-3xl font-serif font-bold text-slate-900" id="dash-greeting">
            Heureux de vous revoir, <span class="text-primary">{{ dataService.currentUser().name }}</span> !
          </h1>
          <p class="text-slate-500 text-sm">Gérez facilement vos réservations, échangez avec vos voyageurs et suivez vos statistiques d'impact local.</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Back to traveler view trigger -->
          <button (click)="dataService.switchUserRole('traveler')"
                  class="bg-slate-150 hover:bg-slate-200 border border-slate-250 text-slate-700 font-semibold py-3 px-5 rounded-xl text-xs smooth-hover flex items-center gap-2 select-none"
                  id="btn-return-traveler-view">
            <mat-icon class="text-base text-slate-500">swap_horiz</mat-icon>
            <span>Retourner en mode voyageur</span>
          </button>
        </div>
      </div>

      <!-- Quick statistics bento grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-stats-bento">
        <!-- Capital earnings stat card -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-50 rounded-full group-hover:scale-110 smooth-hover"></div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center select-none shadow-sm flex-shrink-0 z-10">
            <mat-icon>payments</mat-icon>
          </div>
          <div class="z-10">
            <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Gains Cumulés</span>
            <h3 class="text-2xl font-extrabold text-slate-800 mt-1">{{ totalEarnings() }}€</h3>
            <span class="text-[10px] text-emerald-600 font-medium block">100% transféré vers votre compte</span>
          </div>
        </div>

        <!-- Total bookings counts -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-orange-50 rounded-full group-hover:scale-110 smooth-hover"></div>
          <div class="w-12 h-12 rounded-xl bg-orange-50 text-primary flex items-center justify-center select-none shadow-sm flex-shrink-0 z-10">
            <mat-icon>event_available</mat-icon>
          </div>
          <div class="z-10">
            <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Réservations Totales</span>
            <h3 class="text-2xl font-extrabold text-slate-800 mt-1">{{ bookingsList().length }}</h3>
            <span class="text-[10px] text-slate-400 font-light block">Dont {{ activeBookingsCount() }} à venir</span>
          </div>
        </div>

        <!-- Rating feedback score -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-50 rounded-full group-hover:scale-110 smooth-hover"></div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center select-none shadow-sm flex-shrink-0 z-10">
            <mat-icon>star</mat-icon>
          </div>
          <div class="z-10">
            <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Score d'Évaluation</span>
            <h3 class="text-2xl font-extrabold text-slate-800 mt-1">4.92 / 5</h3>
            <span class="text-[10px] text-emerald-600 font-medium block flex items-center gap-0.5">⭐ Top Guide d'exception</span>
          </div>
        </div>

        <!-- Local responses efficiency rates -->
        <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-blue-50 rounded-full group-hover:scale-110 smooth-hover"></div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-secondary flex items-center justify-center select-none shadow-sm flex-shrink-0 z-10">
            <mat-icon>flash_on</mat-icon>
          </div>
          <div class="z-10">
            <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Taux de réponse</span>
            <h3 class="text-2xl font-extrabold text-slate-800 mt-1">100%</h3>
            <span class="text-[10px] text-blue-600 font-medium block">Réponse moyenne en 15 min</span>
          </div>
        </div>
      </div>

      <!-- Main Columns splits (Bookings list Left, Messages center Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="dashboard-cols">
        
        <!-- Left Column: Bookings list (8 Grid Cols) -->
        <div class="lg:col-span-8 space-y-6" id="dashboard-bookings-panel">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-serif font-bold text-slate-900 select-none">Demandes de visites reçues</h3>
            <span class="text-xs text-slate-400 font-medium">Revenus garantis sécurisés</span>
          </div>

          <div class="space-y-4" id="incoming-bookings-list">
            @if (bookingsList().length === 0) {
              <!-- Empty state dashboard for rookie guide -->
              <div class="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4 shadow-sm" id="empty-dash-bookings">
                <mat-icon class="text-slate-300 text-5xl select-none">calendar_today</mat-icon>
                <div class="space-y-1">
                  <h4 class="font-bold text-slate-800 text-sm">Aucune réservation pour le moment</h4>
                  <p class="text-xs text-slate-400 font-light max-w-sm mx-auto">
                    Repassez en mode voyageur et simulez une réservation sur votre profil pour voir immédiatement vos gains et vos détails de visites se mettre à jour ici !
                  </p>
                </div>
              </div>
            } @else {
              @for (bk of bookingsList(); track bk.id) {
                <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                     [id]="'dash-bk-row-' + bk.id">
                  
                  <div class="flex items-center gap-4">
                    <!-- Experience thumbnail minor -->
                    <div class="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 relative select-none">
                      <img [src]="bk.experienceImage" alt="Exp thumbnail" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                    </div>

                    <div class="space-y-1.5">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-150 select-none">
                          {{ bk.id }}
                        </span>
                        <span class="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full select-none flex items-center gap-0.5">
                          <mat-icon class="text-xs">done_all</mat-icon> Confirmé
                        </span>
                      </div>

                      <h4 class="text-sm font-bold text-slate-800 leading-tight">
                        {{ bk.experienceTitle }}
                      </h4>

                      <p class="text-[11px] text-slate-500 font-light">
                        Voyageur : <strong class="text-slate-700 font-semibold">{{ bk.travelerName }}</strong> • Date programmée : <strong class="text-slate-700 font-semibold">{{ bk.date }}</strong> • Places : {{ bk.spots }}
                      </p>
                    </div>
                  </div>

                  <!-- Price & Action Right side -->
                  <div class="text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end gap-2">
                    <div class="space-y-0.5">
                      <span class="text-[9px] text-slate-400 uppercase tracking-widest block font-medium">Gains net d'activité</span>
                      <div class="text-lg font-extrabold text-primary">
                        +{{ bk.totalPrice }}€
                      </div>
                    </div>
                    
                    <button (click)="selectActiveChatRecipient(bk.guideId)" 
                            class="text-[11px] text-secondary hover:text-primary font-bold hover:underline flex items-center gap-1 select-none"
                            [id]="'btn-chat-with-traveler-' + bk.id">
                      <mat-icon class="text-sm">chat_bubble_outline</mat-icon>
                      <span>Contacter</span>
                    </button>
                  </div>

                </div>
              }
            }
          </div>
        </div>

        <!-- Right Column: Micro direct response chats manager (4 Grid Cols) -->
        <div class="lg:col-span-4 space-y-6" id="dashboard-chat-sidebar">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-serif font-bold text-slate-900 select-none font-sans">Répondre aux Voyageurs</h3>
            <span class="text-xs text-primary font-semibold select-none flex items-center gap-0.5"><mat-icon class="text-sm">forum</mat-icon> Live P2P</span>
          </div>

          <div class="bg-white rounded-3xl border border-slate-150 shadow-md overflow-hidden flex flex-col" id="dash-chat-pnl">
            
            <!-- Chat Partner selection tabs horizontal -->
            <div class="bg-slate-50 border-b border-slate-100 p-3 flex flex-wrap gap-2 select-none" id="chats-tabs-row">
              @for (chat of dataService.directChats(); track chat.guideId) {
                <button (click)="activeGuidSelected.set(chat.guideId)"
                        class="px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all duration-300"
                        [class.bg-primary]="activeGuidSelected() === chat.guideId"
                        [class.text-white]="activeGuidSelected() === chat.guideId"
                        [class.border-primary]="activeGuidSelected() === chat.guideId"
                        [class.bg-white]="activeGuidSelected() !== chat.guideId"
                        [class.text-slate-600]="activeGuidSelected() !== chat.guideId"
                        [class.border-slate-200]="activeGuidSelected() !== chat.guideId">
                  {{ chat.guideName }}
                </button>
              }
            </div>

            <!-- Message view zone -->
            <div class="h-64 overflow-y-auto p-4 space-y-3 bg-slate-50/20" id="dash-chat-messages">
              @if (!activeChatObj()) {
                <div class="text-center py-10 text-xs text-slate-400 font-light select-none">
                  Sélectionnez un historique ci-dessus pour écrire une réponse personnalisée.
                </div>
              } @else {
                @for (msg of activeChatObj()!.messages; track msg.id) {
                  <div class="space-y-1 max-w-[85%] rounded-2xl p-3 text-xs shadow-sm"
                       [class.bg-white]="msg.sender === 'user'"
                       [class.border]="msg.sender === 'user'"
                       [class.border-slate-150]="msg.sender === 'user'"
                       [class.bg-slate-800]="msg.sender === 'guide'"
                       [class.text-white]="msg.sender === 'guide'"
                       [class.self-end]="msg.sender === 'guide'"
                       [class.ml-auto]="msg.sender === 'guide'">
                    <span class="block text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                      {{ msg.sender === 'user' ? 'Voyageur' : 'Vous (Guide)' }}
                    </span>
                    <p class="font-light leading-relaxed">{{ msg.text }}</p>
                    <span class="block text-[8px] text-slate-400 text-right mt-1 select-none">{{ msg.timestamp }}</span>
                  </div>
                }
              }
            </div>

            <!-- Dashboard Composer form -->
            <div class="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input type="text"
                     [(ngModel)]="composeReplyText"
                     (keydown.enter)="submitReplyFromGuide()"
                     [disabled]="!activeGuidSelected()"
                     placeholder="Écrivez un message chaleureux au voyageur..."
                     class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 disabled:opacity-50"
                     id="dash-chat-reply-input" />
              
              <button (click)="submitReplyFromGuide()"
                      [disabled]="!activeGuidSelected() || !composeReplyText().trim()"
                      class="bg-primary hover:bg-primary-hover disabled:bg-slate-250 text-white p-2.5 rounded-xl flex items-center justify-center smooth-hover select-none shadow-md shadow-primary/20"
                      id="dash-chat-reply-btn">
                <mat-icon class="text-sm">send</mat-icon>
              </button>
            </div>

          </div>

          <!-- Availability & Schedules Manager calendar UI design -->
          <div class="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4" id="sched-pnl">
            <h4 class="font-bold text-xs text-slate-400 uppercase tracking-widest block select-none">Gestion des disponibilités</h4>
            <div class="grid grid-cols-7 gap-1 text-center text-[10px]" id="mini-calendar">
              @for (day of weekDays; track day) {
                <div class="font-semibold text-slate-400 py-1">{{ day }}</div>
              }
              @for (dateNum of [24,25,26,27,28,29,30]; track dateNum) {
                <button class="py-2 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 flex flex-col justify-center items-center select-none"
                        [id]="'calendar-day-' + dateNum">
                  <span>{{ dateNum }}</span>
                  <span class="w-1 h-1 bg-emerald-600 rounded-full mt-0.5"></span>
                </button>
              }
            </div>
            <p class="text-[10px] text-slate-400 font-light text-center leading-relaxed">
              Vos créneaux ouverts sont automatiquement synchronisés en temps réel. Les voyageurs peuvent réserver instantanément.
            </p>
          </div>
        </div>

      </div>
    </div>
  `
})
export class GuideDashboardComponent {
  public dataService = inject(DataService);

  public composeReplyText = signal('');
  public activeGuidSelected = signal<string>('');

  public weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Total bookings lists computed directly from data state
  public bookingsList = computed(() => {
    return this.dataService.guideBookings();
  });

  public activeBookingsCount = computed(() => {
    return this.bookingsList().filter(b => b.status === 'confirmed').length;
  });

  public totalEarnings = computed(() => {
    return this.bookingsList()
      .filter(b => b.status === 'confirmed')
      .reduce((sum, current) => sum + current.totalPrice, 0);
  });

  public activeChatObj = computed(() => {
    const activeId = this.activeGuidSelected();
    if (!activeId) return null;
    return this.dataService.directChats().find(c => c.guideId === activeId) || null;
  });

  constructor() {
    // Select first active direct conversations if any exists by default
    const list = this.dataService.directChats();
    if (list.length > 0) {
      this.activeGuidSelected.set(list[0].guideId);
    }
  }

  selectActiveChatRecipient(guideId: string) {
    this.activeGuidSelected.set(guideId);
  }

  submitReplyFromGuide() {
    const textStr = this.composeReplyText().trim();
    const activeId = this.activeGuidSelected();
    if (!textStr || !activeId) return;

    this.dataService.sendMessageToTraveler(activeId, textStr);
    this.composeReplyText.set('');
  }
}
