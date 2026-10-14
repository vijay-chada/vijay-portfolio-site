const LINKS = {
  linkedin: 'https://www.linkedin.com/in/vijaykrishnareddy-chada',
  github: 'https://github.com/vijay-chada',
  cvDownload: 'https://drive.google.com/uc?export=download&id=1qXCM420YuqEmDuxwUF1ulGtX5-SqxDZE',
  cvView: 'https://drive.google.com/file/d/1qXCM420YuqEmDuxwUF1ulGtX5-SqxDZE/view?usp=sharing',
  twitter: '',
  dribbble: ''
};

const PORTFOLIO_CONFIG = {
  company: 'Pragmasoft Solutions',
  role: 'Website Developer Intern',
  jobTitle: 'Website Developer',
  internshipMonths: '6',
  projectCount: '[X]',
  technologies: ['React.js', 'JavaScript', 'Git', 'GitHub'],
  metaDescription: 'Fresher Full Stack Developer building responsive web applications with React.js, JavaScript, Git, and GitHub.'
};

const ABOUT_SKILLS = [
  { name: 'Web Development', percent: 95, gradient: ['#06b6d4', '#ec4899'] },
  { name: 'UI/UX Design', percent: 90, gradient: ['#a855f7', '#ec4899'] },
  { name: 'Backend Development', percent: 88, gradient: ['#22c55e', '#06b6d4'] },
  { name: 'Mobile Development', percent: 85, gradient: ['#f97316', '#ef4444'] }
];

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Each feature initializes independently so a failure does not disable the rest.
  const initializeSafely = (name, initialize) => {
    try {
      initialize();
    } catch (error) {
      console.error(`Portfolio feature failed to initialize: ${name}`, error);
    }
  };

  const initTheme = () => {
    const root = document.documentElement;
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    const setTheme = (theme) => {
      root.dataset.theme = theme;
      const light = theme === 'light';
      toggle.innerHTML = `<i class="fa-regular ${light ? 'fa-moon' : 'fa-sun'}" aria-hidden="true"></i>`;
      toggle.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
      toggle.classList.toggle('is-light', light);
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) themeColor.content = light ? '#f8fafc' : '#0f172a';
    };
    let theme = 'dark';
    try {
      theme = localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark';
    } catch (error) {
      console.warn('Theme preference could not be read from local storage.', error);
    }
    setTheme(theme);
    toggle.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
      try {
        localStorage.setItem('portfolio-theme', nextTheme);
      } catch (error) {
        console.warn('Theme preference could not be saved to local storage.', error);
      }
    });
  };

  const initLinks = () => {
    // Route every profile, CV, and source link through the single config object.
    document.querySelectorAll('a[href^="https://github.com/"]').forEach((link) => {
      link.dataset.link = 'github';
    });
    document.querySelectorAll('.project-icon-link').forEach((link) => {
      if (link.querySelector('.fa-github')) link.dataset.link = 'github';
    });
    document.querySelectorAll('a[href^="https://linkedin.com/"], a[href^="https://www.linkedin.com/"]').forEach((link) => {
      link.dataset.link = 'linkedin';
    });
    document.querySelectorAll('a[data-link]').forEach((link) => {
      const key = link.dataset.link;
      const destination = key === 'cv' ? LINKS.cvDownload : LINKS[key];
      if (!destination) {
        link.hidden = true;
        return;
      }
      link.href = destination;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      if (!link.hasAttribute('aria-label')) {
        link.setAttribute('aria-label', `${link.textContent.trim()} (opens in a new tab)`);
      }
    });

    const cvLink = document.querySelector('[data-link="cv"]');
    if (cvLink) {
      cvLink.href = LINKS.cvDownload;
      cvLink.addEventListener('click', (event) => {
        if (navigator.onLine) return;
        event.preventDefault();
        window.open(LINKS.cvView, '_blank', 'noopener,noreferrer');
      });
    }

    // Assign the configured GitHub profile to the project source icons.
    document.querySelectorAll('.project-icon-link .fa-github').forEach((icon) => {
      const link = icon.closest('a');
      if (!link) return;
      link.dataset.link = 'github';
      link.href = LINKS.github;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${link.getAttribute('aria-label') || 'Project source'} on GitHub (opens in a new tab)`);
    });
  };

  const initMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!menuToggle || !mobileMenu) return;
    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    };
    menuToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      menuToggle.innerHTML = `<i class="fa-solid ${open ? 'fa-xmark' : 'fa-bars'}" aria-hidden="true"></i>`;
    });
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  };

  const initAnchorNavigation = () => {
    document.addEventListener('click', (event) => {
      if (event.defaultPrevented) return;
      const targetElement = event.target instanceof Element ? event.target : null;
      if (!targetElement || targetElement.closest('[data-project], [data-blog], .project-icon-link, .modal-actions a')) return;
      const link = targetElement.closest('a[href^="#"]');
      if (!link) return;
      const selector = link.getAttribute('href');
      if (!selector || selector === '#') {
        event.preventDefault();
        return;
      }
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      const header = document.querySelector('.site-header');
      const offset = (header?.getBoundingClientRect().height || 0) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  };

  const initPortfolioConfig = () => {
    const config = PORTFOLIO_CONFIG;
    document.querySelectorAll('[data-config="company"]').forEach((element) => {
      element.textContent = config.company;
    });
    document.querySelectorAll('[data-config="internshipRole"]').forEach((element) => {
      element.textContent = config.role;
    });
    document.querySelectorAll('[data-config="internshipMonths"]').forEach((element) => {
      element.textContent = config.internshipMonths;
    });
    document.querySelectorAll('[data-config="projectCount"]').forEach((element) => {
      element.dataset.count = config.projectCount;
      if (element.textContent.trim() === '0' || element.textContent.trim() === '') {
        element.textContent = config.projectCount;
      }
    });
    document.querySelectorAll('[data-config="internshipMonthsCount"]').forEach((element) => {
      element.dataset.count = config.internshipMonths;
      if (element.textContent.trim() === '0' || element.textContent.trim() === '') {
        element.textContent = config.internshipMonths;
      }
    });
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = config.metaDescription;
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = config.metaDescription;
    const structuredScript = document.querySelector('script[type="application/ld+json"]');
    if (structuredScript) {
      structuredScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Vijay Krishna Reddy',
        jobTitle: config.jobTitle,
        description: config.metaDescription,
        worksFor: {
          '@type': 'Organization',
          name: config.company
        },
        knowsAbout: ['React.js', 'JavaScript', 'Git', 'GitHub', 'HTML', 'CSS', 'Responsive Web Design', 'Web Development'],
        sameAs: ['https://github.com/vijay-chada', 'https://www.linkedin.com/in/vijaykrishnareddy-chada']
      }, null, 2);
    }
  };

  const initTyping = () => {
    const roleElement = document.querySelector('.typed-text');
    if (!roleElement) return;
    const roles = ['Website Developer', 'Frontend Developer', 'React Developer', 'Problem Solver', 'Web Enthusiast'];
    if (reducedMotion) {
      roleElement.textContent = roles[0];
      return;
    }
    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    const typeRole = () => {
      const role = roles[roleIndex];
      characterIndex += deleting ? -1 : 1;
      roleElement.textContent = role.slice(0, characterIndex);
      let delay = deleting ? 50 : 90;
      if (!deleting && characterIndex === role.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }
      window.setTimeout(typeRole, delay);
    };
    typeRole();
  };

  const initReveal = () => {
    const footer = document.querySelector('.site-footer');
    if (footer) footer.classList.add('reveal');
    document.querySelectorAll('.stars').forEach((stars) => {
      stars.innerHTML = [...stars.textContent].map((star) => `<span aria-hidden="true">${star}</span>`).join('');
    });
    const revealItems = [...document.querySelectorAll('.reveal')];
    revealItems.forEach((element) => {
      const grid = element.closest('.service-grid, .project-grid, .testimonial-grid, .blog-grid');
      if (!grid) return;
      const siblings = [...grid.querySelectorAll('.reveal')];
      element.style.setProperty('--reveal-delay', `${siblings.indexOf(element) * 100}ms`);
    });
    document.querySelector('.about-visual')?.classList.add('reveal-left');
    document.querySelector('.about-copy')?.classList.add('reveal-right');
    document.querySelector('.contact-copy')?.classList.add('reveal-left');
    document.querySelector('.contact-form')?.classList.add('reveal-right');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    revealItems.forEach((element) => observer.observe(element));
  };

  const renderSkillBars = () => {
    const container = document.querySelector('#about-skill-list');
    if (!container) return;

    container.innerHTML = ABOUT_SKILLS.map((skill, index) => `
      <div class="skill-item" data-percent="${skill.percent}" style="--skill-start:${skill.gradient[0]}; --skill-end:${skill.gradient[1]}; --skill-delay:${index * 150}ms;">
        <div class="skill-label">
          <span>${skill.name}</span>
          <span class="skill-percent" data-target="${skill.percent}">0%</span>
        </div>
        <div class="skill-track">
          <div
            class="skill-fill"
            role="progressbar"
            aria-label="${skill.name}"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="0"
            style="--skill-start:${skill.gradient[0]}; --skill-end:${skill.gradient[1]};"
          ></div>
        </div>
      </div>
    `).join('');
  };

  const initAboutCounters = () => {
    const about = document.querySelector('#about');
    if (!about) return;

    const countTo = (element, target, duration) => {
      if (!Number.isFinite(target)) {
        element.textContent = element.dataset.count || '0';
        return;
      }
      if (reducedMotion) {
        element.textContent = String(target);
        return;
      }
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        element.textContent = String(Math.floor(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    const animateSkills = () => {
      document.querySelectorAll('.skill-item').forEach((item, index) => {
        const fill = item.querySelector('.skill-fill');
        const percentNode = item.querySelector('.skill-percent');
        const target = Number(item.dataset.percent || 0);
        if (!fill || !percentNode) return;

        if (reducedMotion) {
          fill.style.width = `${target}%`;
          fill.setAttribute('aria-valuenow', String(target));
          percentNode.textContent = `${target}%`;
          return;
        }

        setTimeout(() => {
          const start = performance.now();
          const duration = 1200;
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            fill.style.width = `${current}%`;
            fill.setAttribute('aria-valuenow', String(current));
            percentNode.textContent = `${current}%`;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, index * 150);
      });
    };

    renderSkillBars();

    const animate = () => {
      animateSkills();
      document.querySelectorAll('.count-up').forEach((counter) => {
        const target = Number(counter.dataset.count);
        if (!Number.isFinite(target)) {
          counter.textContent = counter.dataset.count || '0';
          return;
        }
        countTo(counter, target, 2000);
      });
    };

    if (reducedMotion || !('IntersectionObserver' in window)) {
      animate();
      return;
    }

    const observer = new IntersectionObserver((entries, activeObserver) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      animate();
      activeObserver.disconnect();
    }, { threshold: 0.2 });
    observer.observe(about);
  };

  const initScrollSpy = () => {
    const header = document.querySelector('.site-header');
    const progressBar = document.querySelector('.scroll-progress');
    const backToTop = document.querySelector('.back-to-top');
    const sections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...document.querySelectorAll('.desktop-nav .nav-link, .mobile-menu .nav-link')];
    const navIds = new Set(navLinks.map((link) => link.getAttribute('href')?.slice(1)));
    sections.forEach((section) => {
      if (!navIds.has(section.id)) console.warn(`Section "${section.id}" has no matching navigation link.`);
    });
    const setActive = (id) => navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if ('IntersectionObserver' in window) {
      const visibleSections = new Map();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.target);
          else visibleSections.delete(entry.target.id);
        });
        const center = window.innerHeight * 0.425;
        const current = [...visibleSections.values()].sort((a, b) => {
          const aDistance = Math.abs(a.getBoundingClientRect().top - center);
          const bDistance = Math.abs(b.getBoundingClientRect().top - center);
          return aDistance - bDistance;
        })[0];
        if (current) setActive(current.id);
      }, { rootMargin: '-40% 0px -55% 0px' });
      sections.forEach((section) => observer.observe(section));
    }
    let scheduled = false;
    const updatePageChrome = () => {
      if (progressBar) {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
      }
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
      scheduled = false;
    };
    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updatePageChrome);
    }, { passive: true });
    window.addEventListener('resize', updatePageChrome, { passive: true });
    updatePageChrome();
    backToTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  };

  const initCursor = () => {
    if (!finePointer || reducedMotion) return;
    const dot = document.querySelector('.custom-cursor-dot');
    const ring = document.querySelector('.custom-cursor-ring');
    if (!dot || !ring) return;
    let pointerX = -100;
    let pointerY = -100;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;
    const moveRing = () => {
      ringX += (pointerX - ringX) * 0.15;
      ringY += (pointerY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      if (Math.abs(pointerX - ringX) > 0.1 || Math.abs(pointerY - ringY) > 0.1) {
        frame = requestAnimationFrame(moveRing);
      } else {
        frame = 0;
      }
    };
    document.addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      dot.classList.add('visible');
      ring.classList.add('visible');
      if (!frame) frame = requestAnimationFrame(moveRing);
    });
    document.addEventListener('pointerleave', () => {
      dot.classList.remove('visible');
      ring.classList.remove('visible');
    });
    document.querySelectorAll('a, button, .service-card, .project-card, .testimonial-card, .social-circle, .contact-socials a')
      .forEach((element) => {
        element.addEventListener('pointerenter', () => {
          ring.classList.add('is-hovering');
          if (element.matches('.nav-link')) ring.classList.add('is-nav-hover');
        });
        element.addEventListener('pointerleave', () => {
          ring.classList.remove('is-hovering', 'is-nav-hover');
        });
      });
    document.addEventListener('pointerdown', () => ring.classList.add('is-clicking'));
    document.addEventListener('pointerup', () => ring.classList.remove('is-clicking'));
  };

  const initParallax = () => {
    if (!finePointer || reducedMotion) return;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    document.addEventListener('pointermove', (event) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 18;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 18;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        document.querySelectorAll('.ambient').forEach((orb, index) => {
          const factor = (index + 1) * 0.35;
          orb.style.translate = `${pointerX * factor}px ${pointerY * factor}px`;
        });
        frame = 0;
      });
    });
  };

  const initContactForm = () => {
    const form = document.querySelector('#contact-form');
    const toast = document.querySelector('.toast');
    if (!form || !toast) return;
    const submitButton = form.querySelector('.submit-button');
    let toastTimer;
    const fieldMessages = {
      name: 'Please enter at least 2 characters.',
      email: 'Please enter a valid email address.',
      subject: 'Please enter a subject (at least 3 characters).',
      message: 'Please enter a message of at least 10 characters.'
    };
    const validateField = (field) => {
      const errorElement = field.parentElement.querySelector('.field-error');
      const valid = field.checkValidity();
      field.setAttribute('aria-invalid', String(!valid));
      if (errorElement) errorElement.textContent = valid ? '' : fieldMessages[field.name];
      if (!valid && !reducedMotion) {
        field.classList.remove('field-shake');
        requestAnimationFrame(() => field.classList.add('field-shake'));
      }
      return valid;
    };
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.hasAttribute('aria-invalid')) validateField(field);
      });
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = [...form.querySelectorAll('input, textarea')];
      if (!fields.map(validateField).every(Boolean)) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      if (!submitButton) return;
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="loading-spinner" aria-hidden="true"></span> Sending...';
      window.setTimeout(() => {
        form.reset();
        fields.forEach((field) => {
          field.removeAttribute('aria-invalid');
          const errorElement = field.parentElement.querySelector('.field-error');
          if (errorElement) errorElement.textContent = '';
        });
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message <span aria-hidden="true">→</span>';
        toast.textContent = 'Thanks for reaching out! Your message is ready to send. Connect this form to your email service to receive submissions.';
        toast.classList.add('visible');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3000);
      }, reducedMotion ? 0 : 700);
    });
  };

  const initModals = () => {
    const projectModal = document.querySelector('#projectModal');
    const blogModal = document.querySelector('#blogModal');
    if (!projectModal || !blogModal) throw new Error('Project and blog modal markup is required.');

    // Project details are local data so the modal also works from file:// URLs.
    const projects = {
      1: {
        title: 'E-Commerce Platform', category: 'Web Development',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
        overview: 'A fast, conversion-focused storefront that makes browsing and purchasing feel effortless. The experience pairs a responsive product catalog with a streamlined checkout and dependable operations during traffic peaks.',
        stats: [{ value: '6', label: 'FEATURES', color: '#4ade80' }, { value: 'React + Next', label: 'STACK', color: '#38bdf8' }],
        challenge: 'The original shopping flow made it difficult to find relevant products, and slow page responses increased the chance that customers would abandon their carts. The platform also needed to remain reliable during promotions and sudden demand spikes.',
        solution: 'A component-driven storefront, optimized rendering, and edge caching make browsing feel immediate. A simplified checkout reduces unnecessary steps, while resilient inventory and session handling keep the experience consistent under load.',
        tech: ['React 18', 'Next.js 14', 'Tailwind CSS', 'Redis Edge'], liveUrl: '', sourceUrl: LINKS.github
      },
      2: {
        title: 'Task Management App', category: 'SaaS',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=900&q=80',
        overview: 'A shared workspace for teams to plan projects, coordinate work, and keep decisions close to the tasks they affect. Live updates help everyone work from the same current view without repeatedly refreshing.',
        stats: [{ value: '5', label: 'FEATURES', color: '#38bdf8' }, { value: 'Next.js + SQL', label: 'STACK', color: '#c084fc' }],
        challenge: 'Distributed teams were tracking work across disconnected tools, creating stale task lists and missed handoffs. Frequent collaboration also put pressure on the application to synchronize edits quickly without overwriting teammates’ changes.',
        solution: 'The app organizes work into clear projects and focused task views, with live events broadcasting updates as they happen. Optimistic interactions keep common actions responsive, while persistent records preserve history and team accountability.',
        tech: ['Next.js', 'WebSockets', 'PostgreSQL', 'Prisma'], liveUrl: '', sourceUrl: LINKS.github
      },
      3: {
        title: 'Finance Tracker', category: 'FinTech',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
        overview: 'A friendly personal finance dashboard that turns transaction history into understandable spending insights. Clear summaries and flexible views help people make informed decisions without needing accounting expertise.',
        stats: [{ value: '5', label: 'FEATURES', color: '#4ade80' }, { value: 'Vue + Charts', label: 'STACK', color: '#22d3ee' }],
        challenge: 'Raw transaction feeds are noisy, inconsistent, and difficult to interpret. Users needed trustworthy totals, useful categories, and clear visual summaries while maintaining confidence that calculations represented their actual activity.',
        solution: 'The tracker normalizes transactions, presents categorized trends in accessible charts, and keeps totals consistent across time ranges. Thoughtful empty states and concise explanations make financial patterns easier to understand and act on.',
        tech: ['Vue.js', 'Chart.js', 'Node.js', 'MongoDB'], liveUrl: '', sourceUrl: LINKS.github
      },
      4: {
        title: 'Social Network Platform', category: 'Social',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
        overview: 'A community-first social platform built around interest groups, meaningful conversations, and a dependable real-time messaging experience. Members can discover people and participate without the interface getting in their way.',
        stats: [{ value: '6', label: 'FEATURES', color: '#c084fc' }, { value: 'MERN Stack', label: 'STACK', color: '#38bdf8' }],
        challenge: 'A growing community needs more than a feed: members need to find relevant groups, understand conversations, and trust that messages arrive in order. The platform had to scale activity while avoiding a noisy, hard-to-navigate experience.',
        solution: 'Focused community spaces and clear conversation threading make discovery more intentional. Real-time messaging updates active discussions instantly, while a responsive interface keeps group activity usable across screen sizes.',
        tech: ['MongoDB', 'Express', 'React', 'Node.js', 'Socket.io'], liveUrl: '', sourceUrl: LINKS.github
      },
      5: {
        title: 'AI Chatbot Assistant', category: 'AI/ML',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
        overview: 'A conversational support assistant designed to understand common questions, respond with useful guidance, and hand off ambiguous requests when a person is better equipped to help.',
        stats: [{ value: '3', label: 'CORE FLOWS', color: '#c084fc' }, { value: 'Python + NLP', label: 'STACK', color: '#38bdf8' }],
        challenge: 'Support teams needed a faster way to resolve routine questions without trapping customers in irrelevant automated replies. The assistant had to recognize intent reliably, keep response times low, and be clear when confidence was limited.',
        solution: 'A focused intent model routes common requests to concise, reviewed responses. The API separates inference from conversation handling, and confidence checks provide a smooth path to human support when a question needs more context.',
        tech: ['Python', 'TensorFlow', 'FastAPI', 'NLP'], liveUrl: '', sourceUrl: LINKS.github
      },
      6: {
        title: 'Fitness Tracking App', category: 'Health',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
        overview: 'A mobile companion for recording workouts, building healthy routines, and celebrating gradual progress. Simple session logging and useful summaries help users stay consistent without turning exercise into a chore.',
        stats: [{ value: '4', label: 'TRACKING FEATURES', color: '#4ade80' }, { value: 'React Native', label: 'STACK', color: '#fbbf24' }],
        challenge: 'Fitness plans are difficult to sustain when tracking takes longer than the workout or progress feels invisible. Users needed quick logging, reliable access to their history, and encouragement that supported personal goals rather than comparison.',
        solution: 'Fast workout entry, clear progress summaries, and reminders designed around user preferences make healthy routines easier to maintain. A mobile-first interface keeps the key actions accessible before, during, and after training.',
        tech: ['React Native', 'Firebase', 'Redux'], liveUrl: '', sourceUrl: LINKS.github
      }
    };

    // Three full-length editorial posts power the locally rendered blog modal.
    const blogs = {
      1: {
        title: '10 UI/UX Design Principles for 2026', category: 'Design',
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80',
        date: 'Oct 20, 2025', readTime: '8 min read',
        sections: [
          { heading: 'Design for clarity before novelty', paragraphs: [
            'Interfaces in 2026 are becoming more capable, but capability does not automatically create a better experience. Begin with a clear hierarchy: users should understand what a page is for, what action matters most, and what will happen next. Strong labels, useful grouping, and predictable placement often outperform a clever interaction that needs explanation.',
            'Clarity also means showing the system’s state. Confirm that an action succeeded, explain why a control is unavailable, and make loading states feel intentional. These small moments prevent uncertainty, especially when an interface is processing a payment, saving a long form, or using an AI-assisted feature.'
          ] },
          { heading: 'Make accessibility part of the visual system', paragraphs: [
            'Accessible design is not a final checklist added after the visual work. Color contrast, keyboard focus, target size, motion preferences, and readable type all shape the core components from the beginning. When these decisions are built into tokens and patterns, teams spend less time repairing inconsistent screens later.',
            'Do not communicate status with color alone. Pair a warning hue with an icon and concise language, and make focus states visible against every surface. Test flows using a keyboard and a screen reader, not only a mouse. These habits reveal barriers that screenshots cannot show.'
          ] },
          { heading: 'Use motion and personalization with purpose', paragraphs: [
            'Motion works best when it explains a relationship: a menu opens from its control, a new item enters a list, or a chart reveals a change. Keep transitions brief, avoid animating layout-heavy properties, and respect reduced-motion preferences. Decorative movement should never compete with reading or make controls harder to reach.',
            'Personalization should give people control rather than guess at their needs. Remember preferences when they are useful, explain recommendations, and provide a simple way to change them. The best personalization is often quiet: a sensible default, a remembered view, or content organized around a chosen goal.'
          ] },
          { heading: 'Validate the experience with real behavior', paragraphs: [
            'A polished prototype can still hide a confusing task. Observe people completing realistic scenarios, then note hesitation, repeated clicks, and places where they need to reread. Combine these observations with performance and accessibility checks; one metric cannot describe the whole experience.',
            'Finally, treat design as an ongoing product practice. Review support questions, analytics, and user feedback after release, and make small improvements that remove friction. A durable interface is not the one with the most effects. It is the one that stays understandable as people, devices, and expectations change.'
          ] }
        ],
        takeaways: ['Prioritize clear hierarchy and feedback.', 'Build accessibility into components and tokens.', 'Use motion only when it clarifies a change.', 'Test real tasks and keep improving after launch.']
      },
      2: {
        title: 'The Future of AI in Cloud Computing', category: 'Technology',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
        date: 'Oct 12, 2025', readTime: '7 min read',
        sections: [
          { heading: 'Cloud platforms are becoming intelligent infrastructure', paragraphs: [
            'Cloud computing has always abstracted away physical machines. The next shift is making infrastructure more responsive to the work running on it. AI-assisted operations can inspect telemetry, recognize unusual patterns, forecast capacity needs, and suggest targeted actions before a small issue becomes a customer-facing outage.',
            'These systems are most useful when they explain their recommendations. An operator should be able to see which signals contributed to an alert, compare the proposed action with recent deployments, and decide whether to apply it. Human review remains important wherever an automated change could affect availability, privacy, or cost.'
          ] },
          { heading: 'Inference changes how teams design cloud workloads', paragraphs: [
            'Adding machine-learning inference to an application changes its performance and resource profile. Teams must consider model size, accelerator availability, cold starts, request bursts, and the distance between data and compute. A single deployment pattern rarely fits every use case, so the model should be measured under realistic traffic before it is placed in a production path.',
            'Some requests benefit from specialized accelerators; others are small enough to run efficiently on ordinary instances. Caching stable results, batching compatible requests, and selecting an appropriate model can improve response time while reducing cost. The goal is not to use the largest model, but to deliver a reliable result that meets the product requirement.'
          ] },
          { heading: 'Governance and security must evolve alongside automation', paragraphs: [
            'AI services process prompts, context, and sometimes sensitive business data. Cloud architecture should make data boundaries visible and enforce them with identity controls, encryption, retention limits, and auditable access. Teams should understand which provider receives each request and whether submitted information can be retained or used for training.',
            'Automated operations need similar safeguards. Give agents narrow permissions, record actions, and define rollback paths. Start with recommendations or low-risk tasks, then expand autonomy only when monitoring demonstrates that the system behaves predictably.'
          ] },
          { heading: 'Build for measurable value, not the label', paragraphs: [
            'The most practical AI-cloud projects start with a specific operational or customer problem. Define a baseline for response time, error rate, staffing effort, or infrastructure spend. Then run a limited pilot and compare it against that baseline, including the cost of inference and the effort required to maintain the solution.',
            'A thoughtful rollout combines reliable cloud fundamentals with carefully scoped intelligence. Observability, backups, tested deployments, and clear ownership are still essential. AI can help teams operate faster, but it is the surrounding engineering discipline that makes those improvements safe, repeatable, and valuable.'
          ] }
        ],
        takeaways: ['Treat AI inference as a measured production workload.', 'Keep sensitive data and model access governed.', 'Use human review for high-impact automation.', 'Track cost and outcomes against a baseline.']
      },
      3: {
        title: 'Mastering the Art of Modern Web Development', category: 'Development',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
        date: 'Oct 04, 2025', readTime: '9 min read',
        sections: [
          { heading: 'Start with the problem and the platform', paragraphs: [
            'Modern web development offers an enormous range of frameworks, rendering strategies, and hosted services. The first engineering decision should still be about the people and tasks the product serves. Identify the important journeys, the devices people use, and the quality constraints that matter: accessibility, speed, resilience, or rapid iteration.',
            'Once those needs are clear, choose tools that make the requirements easier to satisfy. A small content-focused site may not need a complex application architecture. A collaborative product may benefit from server rendering, durable state, and live updates. Avoid choosing technology solely because it is fashionable or familiar.'
          ] },
          { heading: 'Build a foundation that is easy to change', paragraphs: [
            'Good structure makes a codebase understandable without turning every feature into a framework. Keep boundaries around user-facing components, data access, and domain rules. Share patterns that are genuinely repeated, but avoid abstracting two similar screens before their requirements are known.',
            'Use types and tests to make important assumptions explicit. Validate external data where it enters the system, test business rules independently, and verify the most valuable user journeys in the browser. A practical test suite gives developers confidence to improve the design rather than fear every change.'
          ] },
          { heading: 'Treat performance and accessibility as product features', paragraphs: [
            'Performance is not only a score. Slow images, excessive JavaScript, and long-running interactions interrupt the task a person came to complete. Measure real page behavior, optimize the largest assets first, and avoid shipping code that a route does not need. Small improvements compound across mobile devices and less reliable networks.',
            'Accessibility benefits from the same early attention. Use semantic HTML, label controls clearly, preserve keyboard operation, and make focus visible. Respect system preferences for reduced motion and color contrast. These choices make the interface more robust for everyone, including users working in unusual environments.'
          ] },
          { heading: 'Ship deliberately and learn from production', paragraphs: [
            'A release process should make failures visible and recovery possible. Automate checks, deploy in manageable increments, and monitor errors alongside performance. Provide useful logs without exposing private information, and make it clear who owns the system when a problem appears.',
            'After launch, compare the product with the original goals. Listen to support requests, study where users leave a flow, and ask whether the feature is helping people finish their tasks. Modern development is a cycle of design, implementation, measurement, and refinement. The craft is less about collecting tools than using them intentionally.'
          ] }
        ],
        takeaways: ['Choose tools based on user and product needs.', 'Keep architecture understandable and testable.', 'Prioritize performance and accessibility early.', 'Measure production outcomes and iterate deliberately.']
      }
    };

    const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
    let opener = null;
    let previousOverflow = '';
    let activeModal = null;

    const showModal = (modal, returnTarget) => {
      if (activeModal && activeModal !== modal) hideModal(activeModal);
      returnTarget?.setAttribute('tabindex', '-1');
      opener = returnTarget;
      activeModal = modal;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('is-open');
      window.setTimeout(() => {
        if (activeModal === modal && modal.classList.contains('is-open')) {
          modal.querySelector('.modal-close')?.focus();
        }
      }, 50);
    };
    const hideModal = (modal = activeModal) => {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = previousOverflow;
      activeModal = null;
      const returnTarget = opener;
      opener = null;
      returnTarget?.focus();
    };

    const openProjectModal = (id, returnTarget) => {
      const project = projects[id];
      if (!project) {
        console.error(`Unknown project modal id: ${id}`);
        return;
      }
      console.log('Project modal opened:', id);
      projectModal.querySelector('[data-project-image]').src = project.image;
      projectModal.querySelector('[data-project-image]').alt = project.title;
      projectModal.querySelector('[data-project-category]').textContent = project.category;
      projectModal.querySelector('[data-project-title]').textContent = project.title;
      projectModal.querySelector('[data-project-overview]').textContent = project.overview;
      projectModal.querySelector('[data-project-challenge]').textContent = project.challenge;
      projectModal.querySelector('[data-project-solution]').textContent = project.solution;
      projectModal.querySelector('[data-project-stats]').innerHTML = project.stats.map((stat) =>
        `<div class="modal-stat" style="--stat-color:${escapeHTML(stat.color)}"><strong>${escapeHTML(stat.value)}</strong><span>${escapeHTML(stat.label)}</span></div>`
      ).join('');
      projectModal.querySelector('[data-project-tech]').innerHTML = project.tech
        .map((technology) => `<span>${escapeHTML(technology)}</span>`).join('');
      const liveLink = projectModal.querySelector('[data-project-live]');
      if (project.liveUrl) {
        liveLink.href = project.liveUrl;
        liveLink.setAttribute('aria-disabled', 'false');
        liveLink.setAttribute('aria-label', 'Live Preview (opens in a new tab)');
      } else {
        liveLink.removeAttribute('href');
        liveLink.setAttribute('aria-disabled', 'true');
        liveLink.setAttribute('aria-label', 'Live Preview is not configured');
      }
      const sourceLink = projectModal.querySelector('[data-project-source]');
      sourceLink.href = project.sourceUrl;
      sourceLink.dataset.link = 'github';
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.setAttribute('aria-label', 'View source on GitHub (opens in a new tab)');
      showModal(projectModal, returnTarget);
    };

    const openBlogModal = (id, returnTarget) => {
      const blog = blogs[id];
      if (!blog) {
        console.error(`Unknown blog modal id: ${id}`);
        return;
      }
      blogModal.querySelector('[data-blog-image]').src = blog.image;
      blogModal.querySelector('[data-blog-image]').alt = blog.title;
      blogModal.querySelector('[data-blog-category]').textContent = blog.category;
      blogModal.querySelector('[data-blog-title]').textContent = blog.title;
      blogModal.querySelector('[data-blog-date]').textContent = blog.date;
      blogModal.querySelector('[data-blog-read-time]').textContent = blog.readTime;
      blogModal.querySelector('[data-blog-body]').innerHTML = blog.sections.map((section) =>
        `<section><h3>${escapeHTML(section.heading)}</h3>${section.paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join('')}</section>`
      ).join('');
      blogModal.querySelector('[data-blog-takeaways]').innerHTML = blog.takeaways
        .map((takeaway) => `<li>${escapeHTML(takeaway)}</li>`).join('');
      showModal(blogModal, returnTarget);
    };

    // Delegated click handling works for card surfaces and links, including file:// pages.
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest('[data-project-live][aria-disabled="true"]')) {
        event.preventDefault();
        return;
      }
      if (target.closest('.project-icon-link')) {
        event.stopPropagation();
        return;
      }
      const trigger = target.closest('[data-project]');
      if (trigger) {
        if (target.closest('.project-icon-link')) return;
        event.preventDefault();
        const card = trigger.closest('.project-card') || trigger;
        openProjectModal(trigger.dataset.project, card);
        return;
      }
      const blogTrigger = target.closest('[data-blog]');
      if (blogTrigger) {
        event.preventDefault();
        const card = blogTrigger.closest('.blog-card') || blogTrigger;
        openBlogModal(blogTrigger.dataset.blog, card);
        return;
      }
      const closeButton = target.closest('.modal-close');
      if (closeButton) {
        hideModal(closeButton.closest('.modal-backdrop'));
        return;
      }
      if (target.classList.contains('modal-backdrop') && target.classList.contains('is-open')) {
        hideModal(target);
        return;
      }
      if (target.closest('.modal-actions a[href="#"]')) event.preventDefault();
    });

    document.addEventListener('keydown', (event) => {
      if (!activeModal) return;
      if (event.key === 'Escape') {
        hideModal();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...activeModal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        activeModal.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  };

  const initAll = () => {
    initializeSafely('profile, CV, and project links', initLinks);
    initializeSafely('theme toggle', initTheme);
    initializeSafely('mobile navigation', initMenu);
    initializeSafely('project and blog modals', initModals);
    initializeSafely('anchor navigation', initAnchorNavigation);
    initializeSafely('hero typing', initTyping);
    initializeSafely('scroll reveals', initReveal);
    initializeSafely('about counters', initAboutCounters);
    initializeSafely('scroll spy and page chrome', initScrollSpy);
    initializeSafely('custom cursor', initCursor);
    initializeSafely('background parallax', initParallax);
    initializeSafely('contact form', initContactForm);
  };

  // Run every feature once the document (including modal markup) is ready.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
})();
