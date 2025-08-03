import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './LandingPage.module.css';

import { FaAndroid, FaApple, FaDesktop, FaBrain, FaComments, FaChartBar, FaSun, FaLink, FaBullseye, FaDownload, FaPowerOff, FaShieldAlt, FaMapMarkerAlt, FaMicrophoneAlt, FaMapMarker, } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';

// Scroll progress indicator
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.scrollProgress}>
      <div 
        className={styles.scrollProgressBar}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

// Particle effect component
const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const createParticle = () => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.2,
    });

    const initialParticles = Array.from({ length: 50 }, createParticle);
    setParticles(initialParticles);

    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.speedX,
          y: particle.y + particle.speedY,
          opacity: particle.opacity + (Math.random() - 0.5) * 0.1,
        })).map(particle => {
          if (particle.x < 0) particle.x = window.innerWidth;
          if (particle.x > window.innerWidth) particle.x = 0;
          if (particle.y < 0) particle.y = window.innerHeight;
          if (particle.y > window.innerHeight) particle.y = 0;
          return particle;
        })
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.particleContainer}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={styles.particle}
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
};

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
            <nav className={styles.nav}>
                <a href="#" className={styles.logo} aria-label="Aya Home">Aya</a>
                <ul className={styles.navLinks}>
                    <li><a href="#features" aria-label="View Features">Features</a></li>
                    <li><a href="#how-it-works" aria-label="How It Works">How It Works</a></li>
                    <li><a href="#download" aria-label="Download Aya">Download</a></li>
                    <li><a href="#about" aria-label="About Aya">About</a></li>
                </ul>
                <a href="#download" className={styles.ctaNav} aria-label="Get Started with Aya">Get Started</a>
                <button
                    className={styles.mobileMenuToggle}
                    aria-label="Toggle Mobile Menu"
                    aria-expanded={isMenuOpen}
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </nav>
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
                <a href="#features" aria-label="View Features">Features</a>
                <a href="#how-it-works" aria-label="How It Works">How It Works</a>
                <a href="#download" aria-label="Download Aya">Download</a>
                <a href="#about" aria-label="About Aya">About</a>
                <a href="#download" className={styles.ctaNav} aria-label="Get Started with Aya">Get Started</a>
            </div>
        </header>
    );
};

const PlatformCard = ({ type, icon, title, description, buttonText, onClick }) => {
    return (
        <div
            className={`${styles.platformCard} ${styles[type]} ${styles.separated}`}
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className={`${styles.platformIcon} ${styles[type]}`}>{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            <a href="#" className={`${styles.downloadBtn} ${styles[type]}`} aria-label={`Download Aya for ${title}`}>
                <FaDownload style={{ marginRight: 8 }} /> {buttonText}
            </a>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => {
    const { ref, inView } = useInView({
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
    });

    return (
        <div
            ref={ref}
            className={`${styles.featureCard} ${inView ? styles.visible : ''}`}
            style={{ '--delay': `${delay}s` }}
        >
            <div className={styles.featureIcon}>{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

const StepCard = ({ number, title, description }) => {
    const { ref, inView } = useInView({
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
    });

    return (
        <div ref={ref} className={`${styles.step} ${inView ? styles.visible : ''}`}>
            <div className={styles.stepNumber}>{number}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

const App = () => {
    const platformCards = [
        {
            type: 'android',
            icon: <FaAndroid size={40} color="#4caf50" />,
            title: 'Android',
            description: 'Get it on Google Play',
            buttonText: 'Download',
        },
        {
            type: 'desktop',
            icon: <FaDesktop size={40} color="#667eea" />,
            title: 'Desktop',
            description: 'Try the web version',
            buttonText: 'Launch App',
        },
        {
            type: 'ios',
            icon: <FaApple size={40} color="#000000" />,
            title: 'iOS',
            description: 'Download on App Store',
            buttonText: 'Download',
        },
    ];

    const features = [
        {
          icon: <FaBrain size={36} color="white" />,
          title: 'AI-Powered Threat Detection',
          description: 'Aya uses advanced AI to analyze sensor and environmental data to detect potential threats in real time.',
          delay: 0,
        },
        {
          icon: <FaMicrophoneAlt size={36} color="white" />,
          title: 'Voice Activation',
          description: 'Trigger safety protocols or send alerts using voice commands, even when your hands are occupied or the screen is off.',
          delay: 0.2,
        },
        {
          icon: <FaChartBar size={36} color="white" />,
          title: 'Safety Insights',
          description: 'Get real-time alerts and statistics based on local crime data and your movement patterns.',
          delay: 0.4,
        },
        {
          icon: <FaPowerOff size={36} color="white" />,
          title: 'Offline Functionality',
          description: 'Aya continues to protect you even without internet access—essential in low-connectivity areas or during emergencies.',
          delay: 0.6,
        },
        {
          icon: <FaMapMarkerAlt size={36} color="white" />,
          title: 'Smart Integration',
          description: 'Aya connects with your device\'s GPS, accelerometer, microphone, and emergency contacts for fast response.',
          delay: 0.8,
        },
        {
          icon: <FaShieldAlt size={36} color="white" />,
          title: 'Panic Mode',
          description: 'One tap or voice activation instantly alerts trusted contacts with your live location and audio recording.',
          delay: 1.0,
        },
      ];
      
      const steps = [
        {
          number: 1,
          title: 'Launch Aya',
          description: 'Open the Aya app to activate continuous safety monitoring using your phone\'s sensors and location data.',
        },
        {
          number: 2,
          title: 'Stay Aware',
          description: 'Aya passively listens and watches for unusual patterns, sudden movement, or distress signals.',
        },
        {
          number: 3,
          title: 'Trigger Help',
          description: 'Use voice, tap, or shake to activate emergency mode. Aya sends alerts and begins live tracking instantly.',
        },
        {
          number: 4,
          title: 'Get Support',
          description: 'Your emergency contacts are notified with real-time updates, and Aya guides you through next safety steps.',
        },
      ];
      

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <ScrollProgress />
            <Header />
            <section className={styles.hero} id="hero">
                <ParticleBackground />
                <div className={styles.heroContent}>
                    <h1 className="text-4xl md:text-6xl font-black mb-8 text-gray-800 animate-[fadeInUp_1s_ease-out]">Meet Aya</h1>
                    <p className={`${styles.heroSubtitle} animate-[fadeInUp_1s_ease-out_0.2s]`}>
                    Your intelligent safety companion. Aya listens, detects emergencies using AI and sensors, and helps keep you safe anytime, anywhere.
                    </p>
                    <div className={styles.platformsContainer}>
                        {platformCards.map(card => (
                            <PlatformCard
                                key={card.type}
                                {...card}
                                onClick={() => window.location.href = `#${card.type}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <section className={styles.features} id="features">
                <h2 className={`${styles.sectionTitle} fade-in-up`}>Smart Safety Features</h2>
                <p className={`${styles.sectionSubtitle} fade-in-up`}> Experience cutting-edge AI and sensor technology designed to protect you anytime, anywhere</p>
                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} {...feature} delay={index * 0.2} />
                    ))}
                </div>
                <div className="flex justify-center mt-16">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-white/40 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                        <div className="w-3 h-3 bg-white/60 rounded-full animate-[pulse_1.5s_ease-in-out_infinite_0.2s]"></div>
                        <div className="w-3 h-3 bg-white/40 rounded-full animate-[pulse_1.5s_ease-in-out_infinite_0.4s]"></div>
                    </div>
                </div>
            </section>
            <section className={styles.howItWorks} id="how-it-works">
                <h2 className={`${styles.sectionTitle} fade-in-up`}>How Aya Works</h2>
                <p className={`${styles.sectionSubtitle} fade-in-up`}> Stay protected with these simple, powerful steps</p>
                <div className={styles.steps}>
                    {steps.map(step => (
                        <StepCard key={step.number} {...step} />
                    ))}
                </div>
            </section>
            <section className={styles.finalCta} id="download">
                <div className={`${styles.ctaContent} fade-in-up`}>
                    <h2 className={styles.sectionTitle}>Ready to Stay Safer with Aya?</h2>
                    <p className={styles.sectionSubtitle}>Join thousands of users empowered by intelligent emergency detection and real-time alerts.</p>
                    <div className={styles.ctaButtons}>
                        <a href="#" className={styles.btnWhite} aria-label="Download Aya Now">Download Now</a>
                        <a href="#" className={styles.btnOutline} aria-label="Try Aya Web Version">Try Web Version</a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default App;
