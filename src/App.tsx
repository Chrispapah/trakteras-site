import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import {
  Mic,
  Globe,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  BrainCircuit,
  CalendarDays,
  AlertCircle,
  Bell,
  Tractor,
  LayoutDashboard,
  Receipt,
  Calendar,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { db, OperationType, handleFirestoreError } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import logoTrakteras from './assets/Trakteras Logo No Sub-01.png';
import heroImageEng from './assets/trakteras_hero_image_ENG.png';
import heroImageGr from './assets/trakteras_hero_image_GR.png';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<any, any> {
  state = { hasError: false, error: null };
  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-error/10 text-center">
            <AlertCircle className="w-16 h-16 text-error mx-auto mb-6" />
            <h2 className="text-2xl font-headline font-bold text-primary mb-4">Something went wrong</h2>
            <p className="text-on-surface-variant mb-8">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-gradient text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

type Language = 'en' | 'gr';

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [lang, setLang] = useState<Language>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'el';
  }, [lang]);

  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = (en: string, gr: string) => (lang === 'en' ? en : gr);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'gr' : 'en');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const path = 'waitlist';
    try {
      await addDoc(collection(db, path), {
        email: email,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const motionEase = reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div id="top" className="min-h-screen bg-surface selection:bg-primary-fixed-dim selection:text-on-primary-fixed">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-all duration-300 ${scrolled ? 'glass-nav border-b border-primary/5 py-3' : 'bg-transparent py-4 sm:py-6'}`}
        aria-label={t('Primary navigation', 'Κύρια πλοήγηση')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <a
              href="#top"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface tap-highlight-transparent"
              aria-label={t('Trakteras - back to top', 'Trakteras - αρχική')}
            >
              <img
                src={logoTrakteras}
                alt=""
                className="h-14 sm:h-20 md:h-24 w-auto max-w-[min(100%,260px)] sm:max-w-[min(100%,280px)] object-contain object-left"
                referrerPolicy="no-referrer"
                width={280}
                height={96}
                decoding="async"
              />
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
            <a href="#features" className="text-on-surface-variant font-medium hover:text-primary transition-colors py-2">
              {t('Features', 'Χαρακτηριστικά')}
            </a>
            <a href="#how-it-works" className="text-on-surface-variant font-medium hover:text-primary transition-colors py-2">
              {t('How it works', 'Πώς λειτουργεί')}
            </a>
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg border border-outline/20 hover:bg-surface-container transition-colors font-semibold text-sm"
            >
              <Globe className="w-4 h-4 shrink-0" aria-hidden />
              <span>{t('ENG / GR', 'GR / ENG')}</span>
            </button>
            <a href="#waitlist" className="bg-primary-gradient text-white px-6 py-2.5 min-h-[44px] inline-flex items-center rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/10">
              {t('Join Waitlist', 'Λίστα Αναμονής')}
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={toggleLang}
              className="text-primary min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-surface-container/80 tap-highlight-transparent"
              aria-label={t('Switch language', 'Αλλαγή γλώσσας')}
            >
              <Globe className="w-6 h-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-surface-container/80 tap-highlight-transparent"
              aria-expanded={isMenuOpen}
              aria-controls="site-mobile-menu"
              aria-label={isMenuOpen ? t('Close menu', 'Κλείσιμο μενού') : t('Open menu', 'Άνοιγμα μενού')}
            >
              {isMenuOpen ? <X className="w-6 h-6" aria-hidden /> : <Menu className="w-6 h-6" aria-hidden />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="site-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t('Site menu', 'Μενού ιστότοπου')}
              initial={reduceMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={motionEase}
              className="md:hidden absolute top-full left-0 right-0 max-h-[min(70vh,calc(100dvh-5rem))] overflow-y-auto overscroll-contain bg-surface border-b border-primary/5 px-4 py-5 space-y-1 shadow-xl"
            >
              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-on-surface-variant py-3 px-2 rounded-xl hover:bg-surface-container/60 active:bg-surface-container"
              >
                {t('Features', 'Χαρακτηριστικά')}
              </a>
              <a
                href="#how-it-works"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-on-surface-variant py-3 px-2 rounded-xl hover:bg-surface-container/60 active:bg-surface-container"
              >
                {t('How it works', 'Πώς λειτουργεί')}
              </a>
              <a
                href="#waitlist"
                onClick={() => setIsMenuOpen(false)}
                className="block bg-primary-gradient text-white px-6 py-3.5 rounded-xl font-bold text-center mt-3 min-h-[48px] flex items-center justify-center"
              >
                {t('Join Waitlist', 'Λίστα Αναμονής')}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pb-[env(safe-area-inset-bottom,0px)]">
        {/* Hero Section */}
        <section className="pt-[calc(7.5rem+env(safe-area-inset-top,0px))] sm:pt-36 md:pt-48 pb-16 sm:pb-20 md:pb-32 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-start">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={motionEase}
              className="space-y-6 sm:space-y-8 min-w-0 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="motion-reduce:animate-none animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t('Coming Soon', 'Σύντομα Κοντά Σας')}
              </div>
              <h1 className="text-[clamp(1.75rem,5.5vw+0.5rem,4.5rem)] sm:text-5xl md:text-6xl lg:text-7xl font-headline font-extrabold text-primary tracking-tight text-left leading-[1.12]">
                <span className="block">{t('Your farm.', 'Η φάρμα σας.')}</span>
                <span className="block mt-2 text-balance">
                  {t('Organized just by talking.', 'Οργανωμένη απλά μιλώντας.')}
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-on-surface-variant max-w-lg leading-relaxed text-left">
                {t('Track tasks, costs, and reminders across your fields and machinery - with simple voice or chat.', 'Παρακολουθήστε εύκολα τις εργασίες, το κόστος και τις υπενθυμίσεις για τα χωράφια και τα μηχανήματά σας, απλά και εύκολα με φωνητικές εντολές ή μέσω συνομιλίας.')}
              </p>
              <div className="flex flex-col gap-4 items-stretch sm:flex-row sm:items-center sm:gap-5">
                <a
                  href="#waitlist"
                  className="bg-primary-gradient text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-center hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 min-h-[48px] inline-flex items-center justify-center"
                >
                  {t('Join the waitlist', 'Εγγραφείτε στη λίστα αναμονής')}
                </a>
                <div className="flex items-start gap-3 px-1 sm:px-2 py-1 text-on-surface-variant">
                  <Mic className="w-6 h-6 text-primary shrink-0 mt-0.5" aria-hidden />
                  <span className="font-medium italic text-sm sm:text-base leading-snug">
                    {t('"Tell Trakteras your day"', '"Πείτε στον Traktera για τη μέρα σας"')}
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={motionEase}
              className="relative group flex justify-center md:justify-end w-full min-w-0"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-[1.5rem] sm:rounded-[2rem] -rotate-3 transition-transform group-hover:rotate-0 duration-500 motion-reduce:transition-none"></div>
              <img
                src={lang === 'en' ? heroImageEng : heroImageGr}
                alt={t('Trakteras app preview on the farm', 'Προεπισκόπηση του Traktera στη φάρμα')}
                className="relative z-[1] rounded-[1.5rem] sm:rounded-[2rem] w-full max-w-[min(100%,640px)] max-h-[min(55vh,520px)] sm:max-h-[min(65vh,560px)] h-auto object-contain object-center shadow-2xl"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="bg-surface-container-low py-16 sm:py-20 md:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-stretch md:items-end">
              <div className="md:col-span-7 min-w-0 text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-on-background mb-6 sm:mb-8 leading-tight text-left">
                  {t('Farming is complex. Your tools shouldn’t be.', 'Η γεωργία είναι περίπλοκη. Τα εργαλεία σας δεν πρέπει να είναι.')}
                </h2>
                <div className="space-y-5 sm:space-y-6 text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed text-left">
                  <p>{t('You’re doing everything right - but keeping track is the hard part. Tasks are scattered across your day.', 'Κάνετε τα πάντα σωστά, αλλά το να τα παρακολουθείτε είναι το δύσκολο κομμάτι. Οι εργασίες είναι διασκορπισμένες κατά τη διάρκεια της ημέρας σας.')}</p>
                  <p>{t('Costs are hard to calculate at the end of the season. Notes live in your head, paper, or random apps.', 'Το κόστος είναι δύσκολο να υπολογιστεί στο τέλος της περιόδου. Οι σημειώσεις ζουν στο μυαλό σας, στο χαρτί ή σε τυχαίες εφαρμογές.')}</p>
                </div>
              </div>
              <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4 min-w-0 text-left">
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl border-l-4 border-error/30 shadow-sm">
                  <p className="italic text-on-surface-variant font-medium text-sm sm:text-base leading-relaxed text-left">
                    {t('"Wait, which field did I spray yesterday?"', '"Περίμενε, ποιο χωράφι ψέκασα χθες;"')}
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl border-l-4 border-error/30 shadow-sm">
                  <p className="italic text-on-surface-variant font-medium text-sm sm:text-base leading-relaxed text-left">
                    {t('"Where did I put that parts receipt?"', '"Πού έβαλα την απόδειξη για τα ανταλλακτικά;"')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
              <div className="w-full md:w-1/2 order-2 md:order-1 min-w-0 max-w-xl mx-auto md:mx-0 md:max-w-none">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-surface-container-high p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center gap-3 sm:gap-4 aspect-square min-h-[140px]">
                    <Tractor className="w-10 h-10 sm:w-12 sm:h-12 text-primary shrink-0" aria-hidden />
                    <p className="font-headline font-bold text-primary text-sm sm:text-base leading-tight">
                      {t('Your Fields', 'Τα χωράφια σας')}
                    </p>
                  </div>
                  <div className="bg-tertiary-fixed p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center gap-3 sm:gap-4 aspect-square min-h-[140px]">
                    <LayoutDashboard className="w-10 h-10 sm:w-12 sm:h-12 text-on-tertiary-fixed-variant shrink-0" aria-hidden />
                    <p className="font-headline font-bold text-on-tertiary-fixed-variant text-sm sm:text-base leading-tight">
                      {t('Your Machinery', 'Τα μηχανήματά σας')}
                    </p>
                  </div>
                  <div className="col-span-2 bg-primary-container p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 min-w-0">
                    <div className="text-white min-w-0">
                      <p className="text-[10px] sm:text-xs font-medium opacity-80 mb-1 uppercase tracking-wider">
                        {t('Voice Input Active', 'Φωνητική Είσοδος Ενεργή')}
                      </p>
                      <p className="text-base sm:text-lg md:text-xl font-headline font-bold leading-snug break-words">
                        {t('"Logged 50 acres of corn"', '"Καταγραφή 200 στρεμμάτων καλαμποκιού"')}
                      </p>
                    </div>
                    <div className="flex gap-1 items-center justify-center shrink-0" aria-hidden>
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                          key={i}
                          animate={reduceMotion ? undefined : { height: [10, 30, 10] }}
                          transition={reduceMotion ? undefined : { duration: 1, repeat: Infinity, delay: i * 0.1 }}
                          style={reduceMotion ? { height: 20 } : undefined}
                          className="w-1 bg-primary-fixed-dim rounded-full motion-reduce:!h-5"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2 min-w-0 text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary mb-6 sm:mb-8 text-left">
                  {t('Meet Trakteras - your farm assistant', 'Γνωρίστε τον Traktera - τον βοηθό της φάρμας σας')}
                </h2>
                <p className="text-lg sm:text-xl text-on-surface-variant leading-relaxed mb-6 sm:mb-8 text-left">
                  {t('Trakteras helps you organize your entire operation - just by talking naturally. Tell it what you did, what you spent, or what you need - and it keeps everything structured, connected, and easy to access.', 'Ο Trakteras σας βοηθά να οργανώσετε ολόκληρη την επιχείρησή σας - απλά μιλώντας. Πείτε του τι κάνατε, τι ξοδέψατε ή τι χρειάζεστε - και αυτός θα διατηρήσει τα πάντα δομημένα, συνδεδεμένα και εύκολα πρόσβασιμα.')}
                </p>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    t('Your fields', 'Τα χωράφια σας'),
                    t('Your tractors', 'Τα τρακτέρ σας'),
                    t('Your machinery', 'Τα μηχανήματά σας')
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 sm:gap-4 text-base sm:text-lg font-semibold text-primary">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="bg-surface-container-low py-16 sm:py-20 md:py-24 px-4 sm:px-6" id="how-it-works">
          <div className="max-w-7xl mx-auto">
            <div className="text-left mb-10 sm:mb-14 md:mb-16 px-1 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-on-background text-left">
                {t('How it works', 'Τόσο απλό όσο το να το λες')}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="bg-surface-container-lowest p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] shadow-sm relative group pt-8 sm:pt-10">
                <span className="absolute top-3 left-3 sm:-top-3 sm:-left-3 md:-top-4 md:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-white rounded-full flex items-center justify-center font-headline font-bold text-lg sm:text-xl shadow-md">1</span>
                <div className="mb-6">
                  <Mic className="w-12 h-12 text-primary/40" />
                </div>
                <h3 className="text-lg sm:text-xl font-headline font-bold mb-3 sm:mb-4">
                  {t('You speak or type:', 'Μιλάτε ή πληκτρολογείτε:')}
                </h3>
                <p className="text-base sm:text-lg italic text-on-surface-variant bg-surface-container-low p-3 sm:p-4 rounded-xl border-l-4 border-primary/20 leading-relaxed">
                  {t('"Added fertilizer to the north field"', '"Πρόσθεσα λίπασμα στο βόρειο χωράφι"')}
                </p>
              </div>
              {/* Step 2 */}
              <div className="bg-surface-container-lowest p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] shadow-sm relative group pt-8 sm:pt-10">
                <span className="absolute top-3 left-3 sm:-top-3 sm:-left-3 md:-top-4 md:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-white rounded-full flex items-center justify-center font-headline font-bold text-lg sm:text-xl shadow-md">2</span>
                <div className="mb-6">
                  <BrainCircuit className="w-12 h-12 text-primary/40" />
                </div>
                <h3 className="text-lg sm:text-xl font-headline font-bold mb-3 sm:mb-4">
                  {t('Trakteras understands', 'Ο Trakteras καταλαβαίνει')}
                </h3>
                <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
                  {t('It instantly recognizes the task, field location, and historical context of your operation.', 'Αναγνωρίζει την εργασία, το χωράφι, το πλαίσιο της επιχείρησής σας.')}
                </p>
              </div>
              {/* Step 3 */}
              <div className="bg-surface-container-lowest p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2rem] shadow-sm relative group pt-8 sm:pt-10">
                <span className="absolute top-3 left-3 sm:-top-3 sm:-left-3 md:-top-4 md:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-white rounded-full flex items-center justify-center font-headline font-bold text-lg sm:text-xl shadow-md">3</span>
                <div className="mb-6">
                  <CalendarDays className="w-12 h-12 text-primary/40" />
                </div>
                <h3 className="text-lg sm:text-xl font-headline font-bold mb-3 sm:mb-4">
                  {t('Always Organized', 'Όλα είναι οργανωμένα')}
                </h3>
                <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
                  {t('Everything is organized into your calendar, logs, and cost tracking without lifting a finger.', 'Η δουλειά σας αποθηκεύεται αυτόματα στο ημερολόγιο, τα αρχεία και την παρακολούθηση κόστους.')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Grid Features */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8" id="features">
          <div className="max-w-7xl mx-auto">
            <div className="text-left max-w-2xl mb-10 sm:mb-12 md:mb-14 px-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-on-background text-left">
                {t('Features', 'Χαρακτηριστικά')}
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-on-surface-variant leading-relaxed text-left">
                {t('Everything you need in the field, in one place.', 'Όλα όσα χρειάζεστε στο χωράφι, σε ένα μέρος.')}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
              {[
                { icon: CheckCircle2, label: t('Task tracking', 'Παρακολούθηση εργασιών') },
                { icon: Receipt, label: t('Cost tracking', 'Παρακολούθηση κόστους') },
                { icon: Calendar, label: t('Field calendar', 'Ημερολόγιο βάσει πεδίου') },
                { icon: Bell, label: t('Smart reminders', 'Έξυπνες υπενθυμίσεις') },
                { icon: Mic, label: t('Voice-first', 'Αλληλεπίδραση με φωνή') },
                { icon: Cloud, label: t('Weather & alerts', 'Καιρός & ειδοποιήσεις') },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-colors group cursor-default min-h-[120px] sm:min-h-0 flex flex-col text-left items-start"
                >
                  <feature.icon className="text-primary w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 shrink-0 transition-transform motion-reduce:transform-none group-hover:scale-110" aria-hidden />
                  <h4 className="font-headline font-bold text-sm sm:text-lg md:text-xl leading-snug text-left">{feature.label}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built for Farmers */}
        <section className="bg-primary text-white py-16 sm:py-20 md:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12">
              <div className="max-w-xl min-w-0 text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold mb-5 sm:mb-6 text-left">
                  {t('Built for how farmers actually work', 'Κατασκευασμένο για το πώς δουλεύουν πραγματικά οι αγρότες')}
                </h2>
                <p className="text-lg sm:text-xl opacity-90 leading-relaxed text-left">
                  {t('No complex menus. No tedious data entry at the end of a long day. Just natural communication with your digital assistant.', 'Όχι περίπλοκα μενού. Όχι κουραστική καταχώρηση δεδομένων στο τέλος μιας μεγάλης μέρας. Μόνο φυσική επικοινωνία.')}
                </p>
              </div>
              <div className="bg-primary-container p-8 sm:p-10 md:p-12 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] w-full md:w-auto md:min-w-0 md:max-w-md min-w-0 text-left">
                <div className="space-y-6 sm:space-y-8 text-lg sm:text-xl md:text-2xl font-headline font-bold text-left">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <ArrowRight className="text-primary-fixed-dim w-7 h-7 sm:w-8 sm:h-8 shrink-0 mt-0.5" aria-hidden />
                    <span className="leading-snug break-words">{t('You talk → it logs', 'Μιλάτε → καταγράφει')}</span>
                  </div>
                  <div className="flex items-start gap-4 sm:gap-6">
                    <ArrowRight className="text-primary-fixed-dim w-7 h-7 sm:w-8 sm:h-8 shrink-0 mt-0.5" aria-hidden />
                    <span className="leading-snug break-words">{t('You work → it remembers', 'Δουλεύετε → θυμάται')}</span>
                  </div>
                  <div className="flex items-start gap-4 sm:gap-6">
                    <ArrowRight className="text-primary-fixed-dim w-7 h-7 sm:w-8 sm:h-8 shrink-0 mt-0.5" aria-hidden />
                    <span className="leading-snug break-words">{t('You ask → it answers', 'Ρωτάτε → απαντά')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section className="py-20 sm:py-28 md:py-32 px-4 sm:px-6" id="waitlist">
          <div className="max-w-4xl mx-auto bg-surface-container-lowest p-6 sm:p-10 md:p-16 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-primary/5 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-primary mb-4 sm:mb-6 px-1 text-balance">
              {t('Be among the first to try Trakteras', 'Γίνετε από τους πρώτους που θα δοκιμάσουν τον Traktera')}
            </h2>
            <p className="text-lg sm:text-xl text-on-surface-variant mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed text-pretty px-1">
              {t('We’re building Trakteras with real farmers in mind. Join the waitlist and get early access when we launch.', 'Εγγραφείτε στη λίστα αναμονής και αποκτήστε πρόωρη πρόσβαση όταν ξεκινήσουμε.')}
            </p>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={motionEase}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto w-full"
                  onSubmit={handleSubmit}
                >
                  <input
                    className="flex-grow min-w-0 px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl border border-outline-variant/20 bg-surface-container text-base text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/35 focus:border-primary/20 outline-none transition-all min-h-[48px]"
                    placeholder={t('Email', 'Email')}
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="email"
                    inputMode="email"
                    enterKeyHint="send"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary-gradient text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:opacity-90 active:scale-[0.98] transition-all whitespace-nowrap disabled:opacity-50 min-h-[48px] shrink-0"
                  >
                    {isSubmitting ? t('Joining...', 'Εγγραφή...') : t('Get early access', 'Εγγραφή τώρα')}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={motionEase}
                  className="bg-primary/5 p-6 sm:p-8 rounded-2xl border border-primary/10 inline-block max-w-md w-full"
                >
                  <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden />
                  <h3 className="text-xl sm:text-2xl font-headline font-bold text-primary mb-2">
                    {t("You're on the list!", "Είστε στη λίστα!")}
                  </h3>
                  <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                    {t("We'll reach out as soon as we're ready for you.", "Θα επικοινωνήσουμε μαζί σας μόλις είμαστε έτοιμοι.")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="mt-6 text-on-surface-variant/60 text-xs sm:text-sm px-2">
              {t('Join over 200+ farmers already on the list.', 'Γίνετε ένας από τους 200+ αγρότες στη λίστα μας.')}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low py-10 sm:py-12 border-t border-primary/5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <a
              href="#top"
              className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low tap-highlight-transparent"
              aria-label={t('Trakteras - back to top', 'Trakteras - αρχική')}
            >
              <img
                src={logoTrakteras}
                alt=""
                className="h-14 sm:h-16 md:h-20 w-auto max-w-[220px] sm:max-w-[240px] object-contain"
                referrerPolicy="no-referrer"
                width={240}
                height={80}
                loading="lazy"
                decoding="async"
              />
            </a>
            <p className="text-xs sm:text-sm text-on-surface-variant/60">
              {t('© 2026 Trakteras. All rights reserved.', '© 2026 Trakteras. Με την επιφύλαξη παντός δικαιώματος.')}
            </p>
          </div>
          <nav
            className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 text-sm font-medium text-on-surface-variant/80"
            aria-label={t('Footer links', 'Σύνδεσμοι υποσέλιδου')}
          >
            <a href="#" className="hover:text-primary transition-colors underline decoration-primary/20 underline-offset-4 py-1 min-h-[44px] inline-flex items-center">
              {t('Contact', 'Επικοινωνία')}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
