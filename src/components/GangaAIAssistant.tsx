import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Send, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Square,
  Play,
  Pause,
  RotateCcw,
  Loader2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Phone,
  CheckCircle2,
  Check,
  MapPin,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { CLINIC_CONTACT, DOCTORS, aiAssistantAvatar } from '../config/clinicData';
import { 
  playPCM, 
  pauseAudio, 
  resumeAudio, 
  stopAllAudio, 
  createStreamAudioPlayer, 
  getOrCreateAudioContext,
  unlockAudioContext
} from '../utils/audioUtils';

export interface InChatBookingData {
  patientName: string;
  doctor: string;
  service: string;
  date: string;
  time: string;
  phone: string;
}

export interface BookingConfirmationData {
  bookingId: string;
  patientName: string;
  doctorName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  lang?: 'hi' | 'hinglish' | 'en';
  quickActions?: { label: string; action: string }[];
  bookingWidget?: {
    initialName?: string;
    initialDoctor?: string;
    initialService?: string;
    initialDate?: string;
    initialTime?: string;
    initialPhone?: string;
  };
  bookingConfirmation?: BookingConfirmationData;
}

interface AIAssistantProps {
  onOpenBooking: (serviceName?: string) => void;
}

/**
 * Interactive In-Chat Booking Form
 * Lets client choose Doctor, Treatment, Date, Time, Name, Phone right inside the chat window
 */
const InChatBookingForm: React.FC<{
  initialData?: {
    initialName?: string;
    initialDoctor?: string;
    initialService?: string;
    initialDate?: string;
    initialTime?: string;
    initialPhone?: string;
  };
  onSubmit: (data: InChatBookingData) => void;
}> = ({ initialData, onSubmit }) => {
  // Format tomorrow as default date string YYYY-MM-DD
  const getDefaultDate = (offsetDays = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const [patientName, setPatientName] = useState(initialData?.initialName || '');
  const [selectedDoctor, setSelectedDoctor] = useState(initialData?.initialDoctor || DOCTORS[0].name);
  const [selectedService, setSelectedService] = useState(initialData?.initialService || 'General Consultation');
  const [selectedDate, setSelectedDate] = useState(initialData?.initialDate || getDefaultDate(1));
  const [selectedTime, setSelectedTime] = useState(initialData?.initialTime || '11:00 AM');
  const [phone, setPhone] = useState(initialData?.initialPhone || '');
  const [errorMsg, setErrorMsg] = useState('');

  const timeSlots = [
    '10:00 AM',
    '11:00 AM',
    '12:30 PM',
    '02:00 PM',
    '04:30 PM',
    '06:00 PM',
    '07:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setErrorMsg('Please enter patient name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number');
      return;
    }

    setErrorMsg('');
    onSubmit({
      patientName: patientName.trim(),
      doctor: selectedDoctor,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      phone: phone.trim()
    });
  };

  return (
    <div className="mt-2.5 p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-cyan-50/90 to-white border border-cyan-200 shadow-sm text-left">
      <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-cyan-100">
        <div className="w-7 h-7 rounded-lg bg-[#005f73] text-white flex items-center justify-center shrink-0">
          <Calendar className="w-3.5 h-3.5" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-[#0a2540]">
            Direct Appointment Booking
          </h4>
          <p className="text-[10px] text-cyan-800 font-medium">
            Schedule your visit directly with our dental specialists
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* 1. Patient Name */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
            <User className="w-3 h-3 text-[#005f73]" />
            <span>Patient Full Name *</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Rahul Sharma / John Doe"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-cyan-500 text-xs text-slate-800 shadow-2xs"
          />
        </div>

        {/* 2. Doctor Preference */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
            <Stethoscope className="w-3 h-3 text-[#005f73]" />
            <span>Select Specialist Doctor *</span>
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-cyan-500 text-xs text-slate-800 font-medium shadow-2xs"
          >
            {DOCTORS.map((doc) => (
              <option key={doc.id} value={doc.name}>
                {doc.name} – {doc.specialization} ({doc.experience})
              </option>
            ))}
            <option value="Any Specialist Doctor">Any Available Specialist (First available slot)</option>
          </select>
        </div>

        {/* 3. Treatment / Service */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#005f73]" />
            <span>Treatment / Dental Concern</span>
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-cyan-500 text-xs text-slate-800 shadow-2xs"
          >
            <option value="General Dental Consultation">General Dental Checkup & Consultation</option>
            <option value="Toothache / Root Canal (RCT)">Severe Toothache / Root Canal Treatment (RCT)</option>
            <option value="Teeth Whitening & Cleaning">Professional Teeth Whitening & Cleaning</option>
            <option value="Braces & Clear Aligners">Braces & Invisible Clear Aligners</option>
            <option value="Dental Implants">Single / Full Mouth Dental Implants</option>
            <option value="Pediatric Dental Care">Kids & Pediatric Dental Care</option>
            <option value="Emergency Tooth Repair">Emergency Broken Tooth & Trauma Care</option>
          </select>
        </div>

        {/* 4. Date Selection with Quick Chips */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-[#005f73]" />
            <span>Preferred Date *</span>
          </label>
          <div className="flex items-center space-x-1.5 mb-1.5">
            <button
              type="button"
              onClick={() => setSelectedDate(getDefaultDate(0))}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                selectedDate === getDefaultDate(0)
                  ? 'bg-[#005f73] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(getDefaultDate(1))}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                selectedDate === getDefaultDate(1)
                  ? 'bg-[#005f73] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(getDefaultDate(2))}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                selectedDate === getDefaultDate(2)
                  ? 'bg-[#005f73] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Day After
            </button>
          </div>
          <input
            type="date"
            value={selectedDate}
            min={getDefaultDate(0)}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-cyan-500 text-xs text-slate-800 shadow-2xs"
          />
        </div>

        {/* 5. Time Slot Chips */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-[#005f73]" />
            <span>Preferred Time Slot *</span>
          </label>
          <div className="grid grid-cols-3 xs:grid-cols-4 gap-1">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                className={`px-1.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all text-center ${
                  selectedTime === slot
                    ? 'bg-[#005f73] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Phone Number */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
            <Phone className="w-3 h-3 text-[#005f73]" />
            <span>Contact Phone (Mobile / WhatsApp) *</span>
          </label>
          <input
            type="tel"
            required
            placeholder="e.g., 9006513247"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-cyan-500 text-xs text-slate-800 shadow-2xs"
          />
        </div>

        {errorMsg && (
          <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200">
            {errorMsg}
          </p>
        )}

        {/* Submit Booking Button */}
        <button
          type="submit"
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#005f73] to-[#0a9396] hover:from-[#084957] hover:to-[#005f73] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Confirm & Schedule Appointment</span>
        </button>
      </form>
    </div>
  );
};

export const GangaAIAssistant: React.FC<AIAssistantProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // Auto Voice feature: persists user preference, defaults to enabled (true)
  const [autoVoice, setAutoVoice] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ganga_auto_voice');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Audio Playback State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // In-memory cache of generated PCM base64 audio by message ID
  const pcmCacheRef = useRef<Map<string, string>>(new Map());
  // AbortController for in-flight requests when interrupted by new user question
  const abortControllerRef = useRef<AbortController | null>(null);
  const speechRequestIdRef = useRef<number>(0);

  const initialWelcomeText = 'Hello! I am Ganga, your virtual dental assistant at Ganga Dental Clinic. How may I assist you with your dental care or appointment booking today?';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: initialWelcomeText,
      timestamp: 'Just now',
      lang: 'en',
      quickActions: [
        { label: '📅 Book Appointment', action: 'book' },
        { label: '🦷 Toothache & Relief', action: 'toothache' },
        { label: '⏰ Clinic Timings', action: 'timings' },
        { label: '💰 Treatment Costs', action: 'costs' },
        { label: '🚨 Emergency Dental Care', action: 'emergency' }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Clean up any ongoing Web Audio API playback on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Clean raw message text for speech synthesis
  const cleanTextForSpeech = (text: string) => {
    return text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[*_~`#>]/g, '')
      .replace(/[•\-\+]/g, ', ')
      .replace(/(\d+):00\s*(am|pm)/gi, '$1 $2')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Stop active speaking completely
  const stopSpeaking = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopAllAudio();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsLoadingAudio(false);
    setCurrentlySpeakingId(null);
  }, []);

  // Pause active speaking
  const pauseSpeaking = useCallback(async () => {
    const paused = await pauseAudio();
    if (paused) {
      setIsPaused(true);
    }
  }, []);

  // Resume active speaking
  const resumeSpeaking = useCallback(async () => {
    const resumed = await resumeAudio();
    if (resumed) {
      setIsPaused(false);
      setIsSpeaking(true);
    }
  }, []);

  // Play genuine natural female Gemini Live voice (Aoede) using Web Audio API PCM pipeline
  const speakText = useCallback(async (text: string, messageId: string, _lang?: string) => {
    unlockAudioContext();
    stopSpeaking();

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const cachedPcm = pcmCacheRef.current.get(messageId);
    if (cachedPcm) {
      setCurrentlySpeakingId(messageId);
      setIsSpeaking(true);
      setIsPaused(false);
      try {
        await playPCM(cachedPcm, {
          onStart: () => {
            setIsLoadingAudio(false);
            setIsSpeaking(true);
            setIsPaused(false);
          },
          onEnded: () => {
            setIsSpeaking(false);
            setIsPaused(false);
            setCurrentlySpeakingId(null);
          },
          onError: () => {
            setIsSpeaking(false);
            setIsPaused(false);
            setIsLoadingAudio(false);
            setCurrentlySpeakingId(null);
          },
        });
      } catch (e) {
        console.warn("[Voice] Playback error:", e);
      }
      return;
    }

    setIsLoadingAudio(true);
    setCurrentlySpeakingId(messageId);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const streamPlayer = createStreamAudioPlayer({
      onStart: () => {
        setIsLoadingAudio(false);
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onEnded: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentlySpeakingId(null);
      },
      onError: (err) => {
        console.warn("[Voice] Streaming playback error:", err);
        setIsSpeaking(false);
        setIsPaused(false);
        setIsLoadingAudio(false);
        setCurrentlySpeakingId(null);
      }
    });

    try {
      const response = await fetch('/api/voice-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: cleanText }),
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Voice stream error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const chunks: string[] = [];
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        if (abortController.signal.aborted) {
          streamPlayer.stop();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.pcmChunk) {
                chunks.push(data.pcmChunk);
                streamPlayer.pushChunk(data.pcmChunk);
              }
              if (data.done) {
                streamPlayer.finishStream();
              }
            } catch (_) {}
          }
        }
      }

      if (chunks.length > 0) {
        pcmCacheRef.current.set(messageId, chunks.join(""));
      } else {
        const fallbackResp = await fetch('/api/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText }),
          signal: abortController.signal,
        });

        if (fallbackResp.ok) {
          const data = await fallbackResp.json();
          if (data.pcm) {
            pcmCacheRef.current.set(messageId, data.pcm);
            await playPCM(data.pcm, {
              onStart: () => {
                setIsLoadingAudio(false);
                setIsSpeaking(true);
                setIsPaused(false);
              },
              onEnded: () => {
                setIsSpeaking(false);
                setIsPaused(false);
                setCurrentlySpeakingId(null);
              },
              onError: () => {
                setIsSpeaking(false);
                setIsPaused(false);
                setIsLoadingAudio(false);
                setCurrentlySpeakingId(null);
              },
            });
            return;
          }
        }
        setIsLoadingAudio(false);
        setIsSpeaking(false);
        setCurrentlySpeakingId(null);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.warn('[Voice] Stream audio generation error:', err?.message || err);
      streamPlayer.stop();
      setIsLoadingAudio(false);
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
    }
  }, [stopSpeaking]);

  // Toggle Auto Voice On/Off
  const toggleAutoVoice = () => {
    const nextVal = !autoVoice;
    setAutoVoice(nextVal);
    try {
      localStorage.setItem('ganga_auto_voice', JSON.stringify(nextVal));
    } catch {}

    if (!nextVal) {
      pauseSpeaking();
    } else if (isPaused && currentlySpeakingId) {
      resumeSpeaking();
    }
  };

  // Reset Chat feature
  const resetChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: initialWelcomeText,
        timestamp: 'Just now',
        lang: 'en',
        quickActions: [
          { label: '📅 Book Appointment', action: 'book' },
          { label: '🦷 Toothache & Relief', action: 'toothache' },
          { label: '⏰ Clinic Timings', action: 'timings' },
          { label: '💰 Treatment Costs', action: 'costs' },
          { label: '🚨 Emergency Dental Care', action: 'emergency' }
        ]
      }
    ]);
    setIsTyping(false);
    setInputText('');
  };

  // Detect user's language: Strictly English by default; switch to Hindi ONLY if client explicitly types in Hindi or asks in Hindi
  const detectLanguage = (text: string): 'hi' | 'hinglish' | 'en' => {
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    if (hasDevanagari) return 'hi';

    const lower = text.toLowerCase();
    const explicitHindiMarkers = [
      'hindi me', 'hindi mein', 'hindi me baat', 'daant dard', 'mujhe dard', 
      'kya aap', 'kaise kare', 'kitna kharch', 'kitna lagega', 'kab aana hai',
      'peele daant', 'khoon nikal', 'masuda dard', 'batao', 'bataiye', 'kripya'
    ];
    
    const matchesHindi = explicitHindiMarkers.some(marker => lower.includes(marker));
    if (matchesHindi) return 'hi';

    return 'en';
  };

  // Handle appointment confirmed from in-chat widget
  const handleInChatBookingConfirmed = (data: InChatBookingData) => {
    stopSpeaking();
    const bookingId = `GDC-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmationData: BookingConfirmationData = {
      bookingId,
      patientName: data.patientName,
      doctorName: data.doctor,
      service: data.service,
      date: data.date,
      time: data.time,
      phone: data.phone
    };

    const confirmText = `Congratulations ${data.patientName}! Your appointment with ${data.doctor} for ${data.service} has been successfully scheduled for ${data.date} at ${data.time}. Your Booking ID is ${bookingId}. All booking details have been registered with our clinic helpline at ${CLINIC_CONTACT.phone}.`;

    const assistantConfirmMsg: Message = {
      id: `confirm-${Date.now()}`,
      sender: 'assistant',
      text: confirmText,
      timestamp: 'Just now',
      lang: 'en',
      bookingConfirmation: confirmationData,
      quickActions: [
        { label: `💬 Send Details via WhatsApp (${CLINIC_CONTACT.phone})`, action: `wa-booking-${bookingId}` },
        { label: `📞 Call Clinic (${CLINIC_CONTACT.phone})`, action: 'call' },
        { label: '📅 Book Another Slot', action: 'book' }
      ]
    };

    setMessages((prev) => [...prev, assistantConfirmMsg]);

    // Speak confirmation
    if (autoVoice) {
      speakText(confirmText, assistantConfirmMsg.id, 'en');
    }

    // Direct WhatsApp notification link to 9006513247 (Professional Dental Slip)
    const autoWaMessage = 
`🦷 *GANGA DENTAL CLINIC — APPOINTMENT RESERVATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 *Clinic:* Ganga Dental Clinic, New Delhi
📍 *Address:* B-12 Green Park, New Delhi – 110016
📞 *Reception Helpline:* ${CLINIC_CONTACT.phone}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *PATIENT APPOINTMENT SLIP:*
• *Booking ID:* #${bookingId}
• *Patient Name:* ${data.patientName}
• *Mobile Number:* ${data.phone}
• *Consulting Doctor:* ${data.doctor}
• *Selected Treatment:* ${data.service}
• *Scheduled Date:* ${data.date}
• *Scheduled Time Slot:* ${data.time}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ *Status:* Priority Online Reservation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Dear Ganga Dental Team, please confirm my appointment schedule. Thank you!_`;

    setTimeout(() => {
      window.open(CLINIC_CONTACT.getWhatsAppUrl(autoWaMessage), '_blank');

      // Professional Congratulatory Follow-up from Ganga Assistant
      const congratsText = `🎉 Congratulations ${data.patientName}! Your appointment request has been successfully submitted to Ganga Dental Clinic via WhatsApp. Our clinic reception team will contact you shortly at ${data.phone} to confirm your slot with ${data.doctor}. If you have any immediate questions or need directions, feel free to call our reception at ${CLINIC_CONTACT.phone}. We look forward to giving you a healthier, brighter smile!`;

      const followUpCongratsMsg: Message = {
        id: `congrats-${Date.now()}`,
        sender: 'assistant',
        text: congratsText,
        timestamp: 'Just now',
        lang: 'en'
      };

      setMessages((prev) => [...prev, followUpCongratsMsg]);

      if (autoVoice) {
        speakText(congratsText, followUpCongratsMsg.id, 'en');
      }
    }, 1200);

    // Sync in background with main site
    onOpenBooking(data.service);
  };

  // Generate Dental Response matching the user's language & intent
  const handleBotResponse = (userInput: string) => {
    stopSpeaking();
    const currentRequestId = ++speechRequestIdRef.current;
    setIsTyping(true);
    const lang = detectLanguage(userInput);
    const lower = userInput.toLowerCase();

    setTimeout(() => {
      if (currentRequestId !== speechRequestIdRef.current) return;

      let replyText = '';
      let actions: { label: string; action: string }[] | undefined;
      let bookingWidgetData: Message['bookingWidget'] | undefined;

      // Extract if user mentioned a specific doctor or service
      let initialDoc = DOCTORS[0].name;
      if (lower.includes('rajesh')) initialDoc = 'Dr. Rajesh Mehta';
      else if (lower.includes('priya') || lower.includes('brace') || lower.includes('align')) initialDoc = 'Dr. Priya Sharma';
      else if (lower.includes('amit') || lower.includes('root canal') || lower.includes('rct') || lower.includes('dard')) initialDoc = 'Dr. Amit Verma';
      else if (lower.includes('neha') || lower.includes('kid') || lower.includes('bachh')) initialDoc = 'Dr. Neha Kapoor';

      let initialSvc = 'General Consultation';
      if (lower.includes('rct') || lower.includes('root canal') || lower.includes('dard')) initialSvc = 'Toothache / Root Canal (RCT)';
      else if (lower.includes('whitening') || lower.includes('safai') || lower.includes('peele')) initialSvc = 'Teeth Whitening & Cleaning';
      else if (lower.includes('brace') || lower.includes('align')) initialSvc = 'Braces & Clear Aligners';
      else if (lower.includes('implant')) initialSvc = 'Dental Implants';

      // Check if phone number was typed in message
      const phoneMatch = userInput.match(/[6-9]\d{9}/);
      const extractedPhone = phoneMatch ? phoneMatch[0] : '';

      // Check if name was provided: "mera naam [X]" or "name is [X]"
      const nameMatch = userInput.match(/(?:naam|name is|i am)\s+([A-Za-z\u0900-\u097F]+)/i);
      const extractedName = nameMatch ? nameMatch[1] : '';

      // Check for Appointment Booking Intent (Including voice typos like "payment book", "apartment book")
      const isBookingIntent = 
        lower.includes('appoint') || 
        lower.includes('book') || 
        lower.includes('payment') || 
        lower.includes('apartment') || 
        lower.includes('slot') || 
        lower.includes('milna') || 
        lower.includes('doctor se') || 
        lower.includes('अपॉइंटमेंट') || 
        lower.includes('बुक') || 
        lower.includes('परामर्श');

      // 0. APPOINTMENT BOOKING DIRECT IN-AGENT FLOW
      if (isBookingIntent) {
        if (lang === 'hi') {
          replyText = `नमस्ते! मैं आपका अपॉइंटमेंट यहीं से सीधे बुक कर देती हूँ।\nकृपया मुझे अपना नाम, किस डॉक्टर से परामर्श करना चाहते हैं, और पसंदीदा समय बताएं या नीचे दिए गए फॉर्म में सीधे कन्फर्म करें:`;
        } else if (lang === 'hinglish') {
          replyText = `Namaste! Mai aapka appointment abhi yahin se direct book kar deti hu.\nKripya apna naam, doctor preference, date aur time batayein ya neeche form me confirm karein:`;
        } else {
          replyText = `Hello! I will book your appointment right here directly.\nPlease review your details below and confirm your preferred doctor and time slot:`;
        }

        bookingWidgetData = {
          initialName: extractedName,
          initialDoctor: initialDoc,
          initialService: initialSvc,
          initialPhone: extractedPhone
        };
      }
      // 1. TOOTHACHE / PAIN / DARD
      else if (lower.includes('pain') || lower.includes('toothache') || lower.includes('dard') || lower.includes('dant') || lower.includes('daant') || lower.includes('दर्द')) {
        if (lang === 'hi') {
          replyText = 'अचानक दांत दर्द के लिए:\n1. गुनगुने पानी में थोड़ा नमक मिलाकर कुल्ला करें।\n2. मसूड़े पर सीधे एस्पिरिन न रखें।\n3. सूजन हो तो गाल के बाहर बर्फ लगाएं।\n\nदर्द से तुरंत और सुरक्षित राहत के लिए आज ही गंगा डेंटल क्लिनिक में डॉ. अमित वर्मा से परामर्श लें।';
          actions = [
            { label: '📅 आज का अपॉइंटमेंट बुक करें', action: 'book-rct' },
            { label: '📞 क्लिनिक पर कॉल करें', action: 'call' }
          ];
        } else if (lang === 'hinglish') {
          replyText = 'Achanak daant dard ke liye immediate relief:\n1. Halke gungune paani me namak daalkar kulla karein.\n2. Dard wale masude par direct koi tablet na rakhein.\n3. Sujan ho toh gaal ke bahar se thandi patti lagayein.\n\nSurakshit ilaj ke liye Ganga Dental Clinic me Dr. Amit Verma se turant checkup karwayein.';
          actions = [
            { label: '📅 Same-Day Slot Book Karein', action: 'book-rct' },
            { label: '📞 Abhi Call Karein', action: 'call' }
          ];
        } else {
          replyText = 'For sudden tooth pain relief:\n1. Gently rinse your mouth with warm salt water.\n2. Avoid placing aspirin directly on your gums.\n3. Apply a cold compress to your cheek if swelling is present.\n\nPlease visit Ganga Dental Clinic for a gentle evaluation with Dr. Amit Verma.';
          actions = [
            { label: '📅 Book Same-Day Slot', action: 'book-rct' },
            { label: '📞 Call Clinic Now', action: 'call' }
          ];
        }
      } 
      // 2. TIMINGS / HOURS / SAMAY
      else if (lower.includes('timing') || lower.includes('hour') || lower.includes('open') || lower.includes('samay') || lower.includes('kab') || lower.includes('समय') || lower.includes('खुला')) {
        if (lang === 'hi') {
          replyText = `गंगा डेंटल क्लिनिक का समय:\n• सोमवार से शनिवार: सुबह 9:00 बजे से रात 8:00 बजे तक\n• रविवार: सुबह 10:00 बजे से दोपहर 2:00 बजे तक (इमरजेंसी व अपॉइंटमेंट)\nपता: ${CLINIC_CONTACT.address}`;
          actions = [
            { label: '📅 अपॉइंटमेंट बुक करें', action: 'book' }
          ];
        } else if (lang === 'hinglish') {
          replyText = `Ganga Dental Clinic ka samay:\n• Somwar se Shanivar: Subah 9:00 AM se Raat 8:00 PM\n• Ravivar: Subah 10:00 AM se Dopahar 2:00 PM (Emergency & Appointments)\nPata: ${CLINIC_CONTACT.address}`;
          actions = [
            { label: '📅 Visit Slot Book Karein', action: 'book' }
          ];
        } else {
          replyText = `Our Clinic Timings:\n• Monday to Saturday: 9:00 AM – 8:00 PM\n• Sunday: 10:00 AM – 2:00 PM (Emergency & Appointments)\nLocation: ${CLINIC_CONTACT.address}`;
          actions = [
            { label: '📅 Book My Visit', action: 'book' }
          ];
        }
      } 
      // 3. COST / FEES / KHARCH / PRICE
      else if (lower.includes('cost') || lower.includes('price') || lower.includes('charge') || lower.includes('fee') || lower.includes('kharch') || lower.includes('kitna') || lower.includes('खर्च') || lower.includes('फीस')) {
        if (lang === 'hi') {
          replyText = 'गंगा डेंटल क्लिनिक में हम 100% पारदर्शी और उचित शुल्क रखते हैं। इलाज शुरू करने से पहले आपको लिखित अनुमान दिया जाता है। बड़े उपचारों के लिए 0% ईएमआई की सुविधा भी उपलब्ध है।';
          actions = [
            { label: '📅 परामर्श बुक करें', action: 'book' },
            { label: '💬 व्हाट्सएप पर पूछें', action: 'whatsapp' }
          ];
        } else if (lang === 'hinglish') {
          replyText = 'Ganga Dental Clinic me hum 100% transparent aur fair pricing follow karte hain. Treatment shuru karne se pehle written estimate diya jata hai. Major treatments ke liye 0% EMI option bhi available hai.';
          actions = [
            { label: '📅 Consultation Book Karein', action: 'book' },
            { label: '💬 WhatsApp Par Poochein', action: 'whatsapp' }
          ];
        } else {
          replyText = 'At Ganga Dental Clinic, we maintain 100% transparent pricing with a written estimate before any procedure. We also provide convenient 0% interest EMI options for major treatments.';
          actions = [
            { label: '📅 Book Consultation', action: 'book' },
            { label: '💬 Ask on WhatsApp', action: 'whatsapp' }
          ];
        }
      } 
      // 4. EMERGENCY / ACCIDENT / BLEEDING / TOOTA DAANT
      else if (lower.includes('emergency') || lower.includes('broken') || lower.includes('bleed') || lower.includes('accident') || lower.includes('khoon') || lower.includes('toot') || lower.includes('इमरजेंसी') || lower.includes('टूटा')) {
        if (lang === 'hi') {
          replyText = `🚨 इमरजेंसी अलर्ट: कृपया तुरंत हमारी प्राथमिकता हेल्पलाइन ${CLINIC_CONTACT.phone} पर कॉल करें। यदि कोई दांत टूट या गिर गया है, तो उसे ठंडे दूध में रखें और 60 मिनट के भीतर क्लिनिक पहुँचें।`;
          actions = [
            { label: '📞 तुरंत कॉल करें', action: 'call' }
          ];
        } else if (lang === 'hinglish') {
          replyText = `🚨 EMERGENCY ALERT: Kripya turant hamari priority emergency helpline ${CLINIC_CONTACT.phone} par call karein. Agar daant toota ya bahar aa gaya hai, toh use thande doodh me rakhkar 60 minute me clinic pahuchein.`;
          actions = [
            { label: '📞 Turant Call Karein', action: 'call' }
          ];
        } else {
          replyText = `🚨 DENTAL EMERGENCY: Please contact our priority dental emergency line immediately at ${CLINIC_CONTACT.phone}. If a tooth was knocked out, preserve it in cold milk and reach our clinic within 60 minutes.`;
          actions = [
            { label: '📞 Call Emergency Immediately', action: 'call' }
          ];
        }
      } 
      // 5. ROOT CANAL / RCT
      else if (lower.includes('root canal') || lower.includes('rct') || lower.includes('रूट कैनाल')) {
        if (lang === 'hi') {
          replyText = 'हमारा रूट कैनाल ट्रीटमेंट विशेषज्ञ एंडोडॉन्टिस्ट डॉ. अमित वर्मा द्वारा दर्द-रहित रोटरी टाइटेनियम तकनीक से किया जाता है। अधिकांश मामलों में यह केवल एक ही सिटिंग में पूरा हो जाता है।';
          actions = [
            { label: '📅 रूट कैनाल अपॉइंटमेंट बुक करें', action: 'book-rct' }
          ];
        } else if (lang === 'hinglish') {
          replyText = 'Hamara Root Canal Treatment specialist Endodontist Dr. Amit Verma dwara pain-free rotary technology se kiya jata hai, jo aksar single sitting me aaram se complete ho jata hai.';
          actions = [
            { label: '📅 RCT Appointment Book Karein', action: 'book-rct' }
          ];
        } else {
          replyText = 'Our Root Canal Treatments are performed by specialist Endodontist Dr. Amit Verma using rotary titanium instruments. It is completely painless and can often be completed in a single comfortable visit.';
          actions = [
            { label: '📅 Book Root Canal Consult', action: 'book-rct' }
          ];
        }
      } 
      // 6. BRACES / ALIGNERS / TEETH STRAIGHTENING
      else if (lower.includes('brace') || lower.includes('aligner') || lower.includes('invisalign') || lower.includes('tedhe') || lower.includes('तार') || lower.includes('ब्रेस')) {
        if (lang === 'hi') {
          replyText = 'हम आधुनिक मेटल ब्रेसेस, सेरामिक ब्रैकेट्स और इनविजिबल क्लियर अलाइनर्स की सुविधा प्रदान करते हैं, जिसका नेतृत्व ऑर्थोडॉन्टिस्ट डॉ. प्रिया शर्मा करती हैं।';
          actions = [
            { label: '📅 अलाइनर अपॉइंटमेंट बुक करें', action: 'book-braces' }
          ];
        } else if (lang === 'hinglish') {
          replyText = 'Hum modern metal braces, ceramic brackets aur invisible clear aligners offer karte hain, jiska treatment hamari Orthodontist Dr. Priya Sharma dwara kiya jata hai.';
          actions = [
            { label: '📅 Braces Slot Book Karein', action: 'book-braces' }
          ];
        } else {
          replyText = 'We provide modern metal braces, aesthetic ceramic brackets, and clear invisible aligners led by our specialist Orthodontist Dr. Priya Sharma.';
          actions = [
            { label: '📅 Book Orthodontic Consult', action: 'book-braces' }
          ];
        }
      } 
      // 7. WHITENING / CLEANING / SAFAI
      else if (lower.includes('whitening') || lower.includes('cleaning') || lower.includes('safai') || lower.includes('peele') || lower.includes('सफाई') || lower.includes('सफेद')) {
        if (lang === 'hi') {
          replyText = 'हमारा इन-क्लिनिक लेज़र टीथ व्हाइटनिंग सिर्फ 45 मिनट में आपके दांतों को 8 शेड्स तक चमकदार बनाता है, जो इनेमल के लिए 100% सुरक्षित है।';
          actions = [
            { label: '📅 टीथ वाइटनिंग बुक करें', action: 'book-whitening' }
          ];
        } else if (lang === 'hinglish') {
          replyText = 'Hamara in-clinic laser teeth whitening sirf 45 minutes me daanto ko 8 shades tak brighter banata hai, aur enamel ke liye 100% safe hai.';
          actions = [
            { label: '📅 Whitening Session Book Karein', action: 'book-whitening' }
          ];
        } else {
          replyText = 'Our in-clinic LED laser teeth whitening can make your teeth up to 8 shades brighter in just 45 minutes with complete safety for your natural enamel.';
          actions = [
            { label: '📅 Book Teeth Whitening', action: 'book-whitening' }
          ];
        }
      } 
      // 8. IMPLANTS
      else if (lower.includes('implant') || lower.includes('impalnt') || lower.includes('इम्प्लांट')) {
        if (lang === 'hi') {
          replyText = 'डेंटल इम्प्लांट्स खोए हुए दांतों को बदलने का सबसे मजबूत और स्थायी उपाय है, जो असली दांतों की तरह प्राकृतिक चबाने की ताकत और जीवनभर की मजबूती देता है।';
          actions = [
            { label: '📅 इम्प्लांट जांच बुक करें', action: 'book-implant' }
          ];
        } else if (lang === 'hinglish') {
          replyText = 'Dental Implants missing teeth ko replace karne ka permanent aur sabse mazboot solution hai, jo lifetime durability aur natural biting strength deta hai.';
          actions = [
            { label: '📅 Implant Checkup Book Karein', action: 'book-implant' }
          ];
        } else {
          replyText = 'Dental implants are the permanent gold standard for replacing missing teeth with lifetime durability and natural biting strength.';
          actions = [
            { label: '📅 Book Implant Evaluation', action: 'book-implant' }
          ];
        }
      } 
      // 9. GENERAL / CONVERSATIONAL
      else {
        if (lang === 'hi') {
          replyText = 'गंगा डेंटल क्लिनिक से संपर्क करने के लिए धन्यवाद! हमारी अनुभवी डॉक्टरों की टीम आपकी मुस्कान की देखभाल के लिए हमेशा तत्पर है। क्या आप डॉक्टर से परामर्श का समय तय करना चाहते हैं?';
          actions = [
            { label: '📅 अपॉइंटमेंट बुक करें', action: 'book' },
            { label: '💬 व्हाट्सएप पर चैट करें', action: 'whatsapp' },
            { label: '📞 क्लिनिक पर कॉल करें', action: 'call' }
          ];
        } else if (lang === 'hinglish') {
          replyText = 'Ganga Dental Clinic me sampark karne ke liye dhanyawad! Hamari experienced doctors ki team aapki smile ki care ke liye taiyar hai. Kya aap appointment schedule karna chahte hain?';
          actions = [
            { label: '📅 Appointment Book Karein', action: 'book' },
            { label: '💬 WhatsApp Par Baat Karein', action: 'whatsapp' },
            { label: '📞 Direct Call Karein', action: 'call' }
          ];
        } else {
          replyText = 'Thank you for reaching out! Our team at Ganga Dental Clinic is here to care for your smile. Would you like to schedule a consultation with our experienced dentists?';
          actions = [
            { label: '📅 Book Appointment', action: 'book' },
            { label: '💬 WhatsApp Us', action: 'whatsapp' },
            { label: '📞 Call Clinic', action: 'call' }
          ];
        }
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: 'Just now',
        lang: lang,
        quickActions: actions,
        bookingWidget: bookingWidgetData
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (autoVoice) {
        speakText(replyText, botMsg.id, lang);
      }
    }, 80);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    stopSpeaking();
    try {
      getOrCreateAudioContext();
    } catch (_) {}

    const query = inputText.trim();
    const lang = detectLanguage(query);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
      lang: lang
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    handleBotResponse(query);
  };

  const handleActionClick = (action: string) => {
    stopSpeaking();
    try {
      getOrCreateAudioContext();
    } catch (_) {}

    // In-Agent Appointment Booking Actions (Keep chat open & show form directly on screen!)
    if (action === 'book' || action === 'book-rct' || action === 'book-braces' || action === 'book-whitening' || action === 'book-implant') {
      let service = 'General Consultation';
      let doctor = DOCTORS[0].name;

      if (action === 'book-rct') {
        service = 'Toothache / Root Canal (RCT)';
        doctor = 'Dr. Amit Verma';
      } else if (action === 'book-braces') {
        service = 'Braces & Clear Aligners';
        doctor = 'Dr. Priya Sharma';
      } else if (action === 'book-whitening') {
        service = 'Teeth Whitening & Cleaning';
        doctor = 'Dr. Rajesh Mehta';
      } else if (action === 'book-implant') {
        service = 'Dental Implants';
        doctor = 'Dr. Rajesh Mehta';
      }

      const bookingPromptText = `I would be happy to schedule your appointment with ${doctor} for ${service}. Please choose your preferred date and time slot below:`;

      const botBookingMsg: Message = {
        id: `booking-widget-${Date.now()}`,
        sender: 'assistant',
        text: bookingPromptText,
        timestamp: 'Just now',
        lang: 'en',
        bookingWidget: {
          initialDoctor: doctor,
          initialService: service
        }
      };

      setMessages((prev) => [...prev, botBookingMsg]);

      if (autoVoice) {
        speakText(bookingPromptText, botBookingMsg.id, 'en');
      }
    } else if (action.startsWith('wa-booking-')) {
      const waText = 
`🦷 *GANGA DENTAL CLINIC — APPOINTMENT RESERVATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 *Clinic:* Ganga Dental Clinic, New Delhi
📍 *Address:* B-12 Green Park, New Delhi – 110016
📞 *Reception Helpline:* ${CLINIC_CONTACT.phone}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Dear Ganga Dental Team, my appointment has been requested via your AI Assistant. Kindly confirm my slot. Thank you!_`;
      window.open(CLINIC_CONTACT.getWhatsAppUrl(waText), '_blank');

      const congratsReply = `🎉 Congratulations! Your appointment request has been forwarded to our clinic on WhatsApp. Our reception team will contact you shortly to confirm your consultation time. We look forward to giving you a healthy, radiant smile!`;
      const confirmReplyMsg: Message = {
        id: `wa-congrats-${Date.now()}`,
        sender: 'assistant',
        text: congratsReply,
        timestamp: 'Just now',
        lang: 'en'
      };
      setMessages((prev) => [...prev, confirmReplyMsg]);
      if (autoVoice) {
        speakText(congratsReply, confirmReplyMsg.id, 'en');
      }
    } else if (action === 'call') {
      window.location.href = CLINIC_CONTACT.telLink;
    } else if (action === 'whatsapp') {
      window.open(CLINIC_CONTACT.getWhatsAppUrl('Hello Ganga Dental Clinic, I need dental advice.'), '_blank');
    } else if (action === 'toothache') {
      handleBotResponse('toothache dental pain');
    } else if (action === 'timings') {
      handleBotResponse('clinic timings hours');
    } else if (action === 'costs') {
      handleBotResponse('treatment costs pricing');
    } else if (action === 'emergency') {
      handleBotResponse('emergency dental care');
    }
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom Right) */}
      <div className="fixed bottom-8 right-4 sm:bottom-10 sm:right-6 z-40">
        <button
          onClick={() => {
            const willOpen = !isOpen;
            setIsOpen(willOpen);
            if (willOpen) {
              try {
                getOrCreateAudioContext();
              } catch (_) {}
            } else {
              pauseSpeaking();
            }
          }}
          className="relative group p-3 sm:p-4 rounded-full bg-[#005f73] hover:bg-[#074755] text-white shadow-xl hover:shadow-cyan-900/40 transition-all duration-300 flex items-center justify-center active:scale-95 border-2 border-white cursor-pointer min-w-[48px] min-h-[48px]"
          aria-label="Open Ganga Dental AI Assistant"
        >
          {/* Avatar */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-cyan-200">
            <img 
              src={aiAssistantAvatar} 
              alt="Ganga AI Assistant" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Glowing pulse ring */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />

          {/* Hover Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Chat with Ganga AI Assistant
          </span>
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-22 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[420px] rounded-3xl bg-white shadow-2xl border border-cyan-200 overflow-hidden flex flex-col h-[560px] max-h-[calc(100dvh-6.5rem)] animate-in fade-in slide-in-from-bottom-6 duration-200 text-left">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#005f73] to-[#087f8c] p-2.5 sm:p-3.5 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-cyan-200 bg-white/20 shrink-0">
                <img 
                  src={aiAssistantAvatar} 
                  alt="Ganga Assistant Avatar" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 truncate">
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-extrabold text-xs sm:text-sm leading-tight truncate">Ganga AI Assistant</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-cyan-100 font-medium truncate">
                  Appointment Booking & Dental Care
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
              {/* Reset Chat Button */}
              <button
                type="button"
                onClick={resetChat}
                className="p-1 sm:p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-100 hover:text-white transition-colors cursor-pointer"
                title="Reset Chat / Nayi shuruat karein"
                aria-label="Reset Chat"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Auto Voice On/Off Toggle Button */}
              <button
                type="button"
                onClick={toggleAutoVoice}
                className={`px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold flex items-center space-x-1 sm:space-x-1.5 transition-all border shadow-2xs cursor-pointer ${
                  autoVoice
                    ? 'bg-emerald-400/25 text-emerald-200 border-emerald-300/40 hover:bg-emerald-400/35'
                    : 'bg-white/10 text-cyan-100/70 border-white/20 hover:bg-white/20'
                }`}
                title={autoVoice ? 'Auto Voice: ON' : 'Auto Voice: OFF'}
              >
                {autoVoice ? (
                  <>
                    <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300 animate-pulse" />
                    <span className="hidden xs:inline">Voice ON</span>
                    <span className="xs:hidden">ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-200/60" />
                    <span className="hidden xs:inline">Voice OFF</span>
                    <span className="xs:hidden">OFF</span>
                  </>
                )}
              </button>

              {/* Header Pause / Resume / Stop Controls */}
              {(isSpeaking || isPaused) && currentlySpeakingId && (
                <div className="flex items-center space-x-1">
                  {isPaused ? (
                    <button
                      type="button"
                      onClick={resumeSpeaking}
                      className="px-2 py-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/45 text-emerald-100 border border-emerald-400/40 text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                      title="Resume"
                    >
                      <Play className="w-2.5 h-2.5 fill-emerald-200 text-emerald-200" />
                      <span>Resume</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={pauseSpeaking}
                      className="px-2 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/45 text-amber-100 border border-amber-400/40 text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                      title="Pause"
                    >
                      <Pause className="w-2.5 h-2.5 fill-amber-200 text-amber-200" />
                      <span>Pause</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="p-1 rounded-lg bg-rose-500/25 hover:bg-rose-500/40 text-rose-200 border border-rose-400/40 text-[10px] transition-colors cursor-pointer"
                    title="Stop"
                  >
                    <Square className="w-2.5 h-2.5 fill-rose-300 text-rose-300" />
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  pauseSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Safety Disclaimer Strip */}
          <div className="bg-amber-50 border-b border-amber-100 px-3 py-1.5 flex items-center space-x-2 text-[10px] text-amber-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>24/7 Virtual Dental Assistant & Instant Appointment Booking</span>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#f8fdfe]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-[#005f73] text-white rounded-br-none shadow-xs'
                      : 'bg-white text-slate-800 rounded-bl-none border border-cyan-100 shadow-2xs'
                  }`}
                >
                  {msg.text}

                  {/* Embedded In-Chat Appointment Booking Widget */}
                  {msg.bookingWidget && (
                    <InChatBookingForm
                      initialData={msg.bookingWidget}
                      onSubmit={handleInChatBookingConfirmed}
                    />
                  )}

                  {/* Embedded In-Chat Booking Confirmation Card */}
                  {msg.bookingConfirmation && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-slate-800 shadow-xs">
                      <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-emerald-200/80">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-emerald-950 text-xs sm:text-sm">
                            Appointment Confirmed!
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                            Booking ID: {msg.bookingConfirmation.bookingId}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-[11px] text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold">Patient:</span>
                          <span className="font-extrabold text-slate-900">{msg.bookingConfirmation.patientName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold">Specialist:</span>
                          <span className="font-extrabold text-[#005f73]">{msg.bookingConfirmation.doctorName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold">Treatment:</span>
                          <span className="font-bold text-slate-800">{msg.bookingConfirmation.service}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold">Date & Time:</span>
                          <span className="font-extrabold text-emerald-800">
                            {msg.bookingConfirmation.date} at {msg.bookingConfirmation.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold">Contact:</span>
                          <span className="font-semibold text-slate-800">{msg.bookingConfirmation.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold">Clinic Helpline:</span>
                          <span className="font-bold text-[#005f73]">{CLINIC_CONTACT.phone}</span>
                        </div>
                        <div className="pt-2 border-t border-emerald-200/60 flex items-start space-x-1.5 text-[10px] text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-cyan-800 shrink-0 mt-0.5" />
                          <span>Ganga Dental Clinic, B-12 Green Park, New Delhi – 110016</span>
                        </div>
                      </div>

                      {/* Instant WhatsApp & Call Buttons */}
                      <div className="mt-3 pt-2.5 border-t border-emerald-200/80 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            const details = 
`🦷 *GANGA DENTAL CLINIC — APPOINTMENT RESERVATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 *Clinic:* Ganga Dental Clinic, New Delhi
📍 *Address:* B-12 Green Park, New Delhi – 110016
📞 *Reception Helpline:* ${CLINIC_CONTACT.phone}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *PATIENT APPOINTMENT SLIP:*
• *Booking ID:* #${msg.bookingConfirmation?.bookingId}
• *Patient Name:* ${msg.bookingConfirmation?.patientName}
• *Mobile Number:* ${msg.bookingConfirmation?.phone}
• *Consulting Doctor:* ${msg.bookingConfirmation?.doctorName}
• *Selected Treatment:* ${msg.bookingConfirmation?.service}
• *Scheduled Date:* ${msg.bookingConfirmation?.date}
• *Scheduled Time Slot:* ${msg.bookingConfirmation?.time}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ *Status:* Verified Slot Booking
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Dear Ganga Dental Team, please confirm my appointment schedule. Thank you!_`;
                            window.open(CLINIC_CONTACT.getWhatsAppUrl(details), '_blank');
                          }}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Send to WhatsApp ({CLINIC_CONTACT.phone})</span>
                        </button>
                        <a
                          href={CLINIC_CONTACT.telLink}
                          className="py-2 px-3 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white font-bold text-[11px] flex items-center justify-center space-x-1 shadow-2xs transition-colors"
                          title="Call clinic reception"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Assistant Voice Playback Button */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center space-x-1.5 mt-1.5 ml-1">
                    {currentlySpeakingId === msg.id && (isSpeaking || isPaused || isLoadingAudio) ? (
                      <div className="flex items-center space-x-1">
                        {isLoadingAudio ? (
                          <div className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center space-x-1.5 bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-2xs">
                            <Loader2 className="w-3 h-3 text-cyan-600 animate-spin" />
                            <span>Loading Voice...</span>
                          </div>
                        ) : isPaused ? (
                          <button
                            type="button"
                            onClick={resumeSpeaking}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs cursor-pointer hover:bg-emerald-100 transition-colors"
                            title="Wahi se dubara shuru karein"
                          >
                            <Play className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                            <span>Resume</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={pauseSpeaking}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 bg-cyan-100 text-cyan-900 border border-cyan-300 shadow-2xs cursor-pointer hover:bg-cyan-200 transition-colors animate-pulse"
                            title="Rokein (Pause)"
                          >
                            <Pause className="w-2.5 h-2.5 fill-cyan-700 text-cyan-700" />
                            <span>Pause</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={stopSpeaking}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer shadow-2xs"
                          title="Stop completely"
                        >
                          <Square className="w-2 h-2 fill-rose-600 text-rose-600" />
                          <span>Stop</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          unlockAudioContext();
                          speakText(msg.text, msg.id, msg.lang || 'hinglish');
                        }}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center space-x-1.5 bg-white hover:bg-cyan-50 text-slate-600 hover:text-cyan-800 border border-slate-200/80 shadow-2xs transition-all cursor-pointer"
                        title="Listen in ultra-realistic female voice"
                      >
                        <Volume2 className="w-3 h-3 text-cyan-600" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Quick Action Buttons */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(action.action)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-cyan-50 border border-cyan-200 text-cyan-900 text-[11px] font-bold shadow-2xs transition-all active:scale-95 text-left cursor-pointer"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-1.5 p-3 rounded-2xl bg-white border border-cyan-100 w-20">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-cyan-100 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask a question or request an appointment..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-cyan-500 text-xs text-slate-800"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#005f73] hover:bg-[#074755] text-white shadow-xs transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
