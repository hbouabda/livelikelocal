import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GUIDES, Guide, Experience, CITIES, City } from './mock-data';
import { firstValueFrom } from 'rxjs';

export interface Booking {
  id: string;
  guideId: string;
  guideName: string;
  guideAvatar: string;
  experienceId: string;
  experienceTitle: string;
  experienceImage: string;
  experienceCategory: string;
  date: string;
  spots: number;
  totalPrice: number;
  travelerName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'guide';
  text: string;
  timestamp: string;
}

export interface DirectChat {
  guideId: string;
  guideName: string;
  guideAvatar: string;
  messages: ChatMessage[];
  lastMessageText: string;
  lastMessageTime: string;
}

export interface UserSession {
  role: 'traveler' | 'guide';
  name: string;
  avatar: string;
  guideId?: string; // If role is guide, links to a mock guide ID (e.g., 'g-chloe')
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);

  // Lists
  public cities = signal<City[]>(CITIES);
  public guides = signal<Guide[]>(GUIDES);

  // Active User State
  public currentUser = signal<UserSession>({
    role: 'traveler',
    name: 'Jean-Pierre',
    avatar: 'https://picsum.photos/seed/jp/100/100'
  });

  // Active Bookings Signal
  public bookings = signal<Booking[]>([
    {
      id: 'BK-001',
      guideId: 'g-amina',
      guideName: 'Amina Bensaid',
      guideAvatar: 'https://picsum.photos/seed/amina/150/150',
      experienceId: 'exp-marrakech1',
      experienceTitle: 'Les Artisans Cachés du Souk et Initiation à l\'Herboristerie locale',
      experienceImage: 'https://picsum.photos/seed/marrakech-exp-souk/800/500',
      experienceCategory: 'Art & Craft',
      date: '2026-06-15',
      spots: 2,
      totalPrice: 60,
      travelerName: 'Jean-Pierre',
      status: 'confirmed',
      bookedAt: '2026-05-23T14:30:00Z'
    }
  ]);

  // Direct Chats Signal
  public directChats = signal<DirectChat[]>([
    {
      guideId: 'g-chloe',
      guideName: 'Chloé Laurent',
      guideAvatar: 'https://picsum.photos/seed/chloe/150/150',
      lastMessageText: 'Bonjour Jean-Pierre ! J\'ai hâte d\'organiser notre dégustation à Montmartre.',
      lastMessageTime: '10:15',
      messages: [
        {
          id: 'm1',
          sender: 'guide',
          text: 'Bonjour Jean-Pierre ! J\'ai hâte d\'organiser notre dégustation à Montmartre.',
          timestamp: '10:15'
        }
      ]
    }
  ]);

  // Derived state
  public travelerBookings = computed(() => {
    return this.bookings().filter(b => b.travelerName === this.currentUser().name);
  });

  public guideBookings = computed(() => {
    const user = this.currentUser();
    if (user.role !== 'guide' || !user.guideId) return [];
    return this.bookings().filter(b => b.guideId === user.guideId);
  });

  // Actions
  public switchUserRole(role: 'traveler' | 'guide', guideId?: string) {
    if (role === 'guide') {
      const selectedGuideId = guideId || 'g-chloe';
      const actualGuide = this.guides().find(g => g.id === selectedGuideId);
      this.currentUser.set({
        role: 'guide',
        name: actualGuide ? `${actualGuide.firstName} ${actualGuide.lastName}` : 'Chloé Laurent',
        avatar: actualGuide ? actualGuide.avatar : 'https://picsum.photos/seed/chloe/150/150',
        guideId: selectedGuideId
      });
    } else {
      this.currentUser.set({
        role: 'traveler',
        name: 'Jean-Pierre',
        avatar: 'https://picsum.photos/seed/jp/100/100'
      });
    }
  }

  // Create booking
  public createNewBooking(guide: Guide, experience: Experience, date: string, spots: number) {
    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guideId: guide.id,
      guideName: `${guide.firstName} ${guide.lastName}`,
      guideAvatar: guide.avatar,
      experienceId: experience.id,
      experienceTitle: experience.title,
      experienceImage: experience.image,
      experienceCategory: experience.category,
      date: date,
      spots: spots,
      totalPrice: experience.price * spots,
      travelerName: this.currentUser().name,
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    };

    // Update state
    this.bookings.update(prev => [newBooking, ...prev]);

    // Send automated first chat from guide to traveler as trust signal
    this.addOrUpdateDirectChat(guide.id, `${guide.firstName} ${guide.lastName}`, guide.avatar, {
      id: `m-auto-${Date.now()}`,
      sender: 'guide',
      text: `Merci pour votre réservation ! J'ai bien reçu votre demande pour l'expérience "${experience.title}" le ${date} pour ${spots} personne(s). Avez-vous des restrictions alimentaires ou des envies particulières ?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    return newBooking;
  }

  // Handle live messaging
  public sendMessageToGuide(guideId: string, text: string) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `mu-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: timeStr
    };

    const guideObj = this.guides().find(g => g.id === guideId);
    const guideName = guideObj ? `${guideObj.firstName} ${guideObj.lastName}` : 'Guide';
    const guideAvatar = guideObj ? guideObj.avatar : 'https://picsum.photos/seed/chloe/150/150';

    this.addOrUpdateDirectChat(guideId, guideName, guideAvatar, userMsg);
  }

  private addOrUpdateDirectChat(guideId: string, name: string, avatar: string, message: ChatMessage) {
    this.directChats.update(prevChats => {
      const existingIdx = prevChats.findIndex(c => c.guideId === guideId);
      if (existingIdx > -1) {
        const updated = [...prevChats];
        const oldChat = updated[existingIdx];
        updated[existingIdx] = {
          ...oldChat,
          messages: [...oldChat.messages, message],
          lastMessageText: message.text,
          lastMessageTime: message.timestamp
        };
        // Move to top
        const chat = updated.splice(existingIdx, 1)[0];
        return [chat, ...updated];
      } else {
        return [
          {
            guideId,
            guideName: name,
            guideAvatar: avatar,
            lastMessageText: message.text,
            lastMessageTime: message.timestamp,
            messages: [message]
          },
          ...prevChats
        ];
      }
    });
  }

  // Answer traveler as guide (Dashboard interface simulation)
  public sendMessageToTraveler(guideId: string, text: string) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const guideMsg: ChatMessage = {
      id: `mg-${Date.now()}`,
      sender: 'guide',
      text: text,
      timestamp: timeStr
    };

    this.directChats.update(prevChats => {
      const existingIdx = prevChats.findIndex(c => c.guideId === guideId);
      if (existingIdx > -1) {
        const updated = [...prevChats];
        const oldChat = updated[existingIdx];
        updated[existingIdx] = {
          ...oldChat,
          messages: [...oldChat.messages, guideMsg],
          lastMessageText: text,
          lastMessageTime: timeStr
        };
        return updated;
      }
      return prevChats;
    });
  }

  // Call the server-side AI guide chatbot
  public async askLocalGuideAI(guide: Guide, userQuery: string): Promise<string> {
    try {
      // Find relative chat message history or empty array
      const chatObj = this.directChats().find(c => c.guideId === guide.id);
      const conversationHistory = chatObj 
        ? chatObj.messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text }))
        : [];

      const payload = {
        guideId: guide.id,
        firstName: guide.firstName,
        lastName: guide.lastName,
        cityName: guide.cityName,
        bio: guide.bio,
        skills: guide.skills,
        languages: guide.languages,
        message: userQuery,
        history: conversationHistory
      };

      const response = await firstValueFrom(
        this.http.post<{ answer: string }>('/api/ask-guide', payload)
      );

      const aiAnswerText = response?.answer || `Désolé, j'ai eu une petite interférence dans mon réseau local. Que préférez-vous faire à ${guide.cityName} ?`;

      // Save user message
      this.sendMessageToGuide(guide.id, userQuery);

      // Save AI Guide response to conversation signal log so traveler can read it instantly!
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const guideMsg: ChatMessage = {
        id: `mai-${Date.now()}`,
        sender: 'guide',
        text: aiAnswerText,
        timestamp: timeStr
      };
      this.addOrUpdateDirectChat(guide.id, `${guide.firstName} ${guide.lastName}`, guide.avatar, guideMsg);

      return aiAnswerText;
    } catch (err) {
      console.error('Error calling AI Guide Chat:', err);
      // Fallback response with simulated local guide greeting
      const fallback = `Bonjour ! Je suis ravi de recevoir votre message ! Je rencontre actuellement un léger contretemps de connexion mais restez connecté. À ${guide.cityName}, nous devons absolument tester nos spécialités locales ! Quel genre d'expériences préférez-vous ?`;
      this.sendMessageToGuide(guide.id, userQuery);
      
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.addOrUpdateDirectChat(guide.id, `${guide.firstName} ${guide.lastName}`, guide.avatar, {
        id: `mai-err-${Date.now()}`,
        sender: 'guide',
        text: fallback,
        timestamp: timeStr
      });
      return fallback;
    }
  }
}
