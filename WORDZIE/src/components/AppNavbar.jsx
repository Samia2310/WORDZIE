import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Activity,
    BookOpen,
    BookOpenText,
    ChevronDown,
    Compass,
    Gamepad2,
    Home,
    Layers3,
    Map,
    Menu,
    Moon,
    ScanSearch,
    Sparkles,
    Sun,
    X,
} from 'lucide-react';
import '../app-brand.css';

const activityLinks = [
    { label: 'Game Studio', hint: 'Challenge modes and games', href: '#view=gameSelect', icon: Gamepad2 },
    { label: 'Quick Quizzes', hint: 'Instant feedback', href: '#view=quiz&mode=quick_quiz', icon: Sparkles },
    { label: 'Flashcards', hint: 'Definitions, synonyms and usage', href: '#view=flashcards&round=flashcard-preview', icon: BookOpen },
];

const discoveryLinks = [
    { label: 'Word Themes', hint: 'Browse words by meaning', href: '#view=wordThemes', icon: Layers3 },
    { label: 'Word Tales', hint: 'Vocabulary inside short stories', href: '#view=wordTales', icon: BookOpenText },
    { label: 'Word Detective', hint: 'Solve cases from clues', href: '#view=wordDetective', icon: ScanSearch },
];

const themeByMode = {
    word_buckets: 'word-buckets',
    matching: 'matching',
    fill_blanks: 'fill-blanks',
    word_builder: 'word-builder',
    quick_quiz: 'quick-quiz',
};
const COLOR_MODE_KEY = 'wordzie-color-mode';

const readColorMode = () => {
    try {
        return window.localStorage.getItem(COLOR_MODE_KEY) === 'light' ? 'light' : 'dark';
    } catch {
        return 'dark';
    }
};

/* Reads the current view (and game mode) from the URL hash. */
const getRoute = () => {
    if (typeof window === 'undefined') return { view: '', mode: '' };

    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return { view: params.get('view') || '', mode: params.get('mode') || '' };
};

/* Marks the menu link that matches the page currently open. */
const isLinkActive = (href, route) => {
    const target = new URLSearchParams(href.replace(/^#/, ''));
    const targetView = target.get('view');

    if (targetView === 'quiz') return route.view === 'quiz' && route.mode === target.get('mode');
    if (targetView === 'gameSelect') {
        return route.view === 'gameSelect' || (route.view === 'quiz' && route.mode !== 'quick_quiz');
    }
    return route.view === targetView;
};

const NavigationDropdown = ({ label, icon, links, route, isOpen, onToggle, onNavigate }) => {
    const isCurrent = links.some((link) => isLinkActive(link.href, route));

    return (
        <div className={`app-nav__dropdown${isOpen ? ' is-open' : ''}`}>
            <button
                className={`app-nav__link app-nav__dropdown-trigger${isCurrent ? ' is-current' : ''}`}
                type="button"
                aria-expanded={isOpen}
                onClick={onToggle}
            >
                {React.createElement(icon, { size: 17, 'aria-hidden': true })}
                <span>{label}</span>
                <ChevronDown className="app-nav__chevron" size={15} aria-hidden="true" />
            </button>
            {isOpen && (
                <div className="app-nav__menu">
                    {links.map(({ label: linkLabel, hint, href, icon: LinkIcon }) => {
                        const isActive = isLinkActive(href, route);
                        return (
                            <a
                                className={`app-nav__menu-link${isActive ? ' is-active' : ''}`}
                                href={href}
                                key={linkLabel}
                                aria-current={isActive ? 'page' : undefined}
                                onClick={onNavigate}
                            >
                                {React.createElement(LinkIcon, { size: 17, 'aria-hidden': true })}
                                <span className="app-nav__menu-text">
                                    <strong>{linkLabel}</strong>
                                    <small>{hint}</small>
                                </span>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const AppNavbar = () => {
    const [openDropdown, setOpenDropdown] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [route, setRoute] = useState(getRoute);
    const [colorMode, setColorMode] = useState(readColorMode);
    const navRef = useRef(null);
    const toggleRef = useRef(null);

    const gameTheme = route.view === 'quiz' ? themeByMode[route.mode] || '' : '';
    const isHome = route.view === 'home' || route.view === '';
    const appliedColorMode = gameTheme ? 'dark' : colorMode;

    useLayoutEffect(() => {
        document.documentElement.dataset.colorMode = appliedColorMode;
        try {
            window.localStorage.setItem(COLOR_MODE_KEY, colorMode);
        } catch {
            // Theme still works for this visit when browser storage is unavailable.
        }
    }, [appliedColorMode, colorMode]);

    useEffect(() => {
        const syncRoute = () => setRoute(getRoute());
        const closeFromOutside = (event) => {
            const target = event.target;
            const activeDropdown = navRef.current?.querySelector('.app-nav__dropdown.is-open');

            if (!activeDropdown?.contains(target)) {
                setOpenDropdown('');
            }

            if (!navRef.current?.contains(target) && !toggleRef.current?.contains(target)) {
                setIsDrawerOpen(false);
            }
        };

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setOpenDropdown('');
                setIsDrawerOpen(false);
                toggleRef.current?.focus();
            }
        };

        document.addEventListener('pointerdown', closeFromOutside);
        document.addEventListener('keydown', closeOnEscape);
        window.addEventListener('hashchange', syncRoute);
        window.addEventListener('popstate', syncRoute);
        window.addEventListener('wordzie:navigation', syncRoute);
        return () => {
            document.removeEventListener('pointerdown', closeFromOutside);
            document.removeEventListener('keydown', closeOnEscape);
            window.removeEventListener('hashchange', syncRoute);
            window.removeEventListener('popstate', syncRoute);
            window.removeEventListener('wordzie:navigation', syncRoute);
        };
    }, []);

    const closeNavigation = () => {
        setOpenDropdown('');
        setIsDrawerOpen(false);
    };

    const toggleDropdown = (name) => {
        setOpenDropdown((currentDropdown) => (currentDropdown === name ? '' : name));
    };

    return (
        <header className={`app-brand-bar${gameTheme ? ` app-brand-bar--${gameTheme}` : ''}`}>
            <div className="app-brand-bar__inner">
                <a className="app-brand" href="#view=home" aria-label="WORDZIE home" onClick={closeNavigation}>
                    <img src="/wordzie.png" alt="" aria-hidden="true" />
                    <span className="wordzie-logo" aria-hidden="true">
                        <span className="wordzie-logo__word">WORD</span>
                        <span className="wordzie-logo__zie">ZIE</span>
                    </span>
                </a>

                <button
                    ref={toggleRef}
                    className="app-nav__drawer-toggle"
                    type="button"
                    aria-label={isDrawerOpen ? 'Close navigation' : 'Open navigation'}
                    aria-expanded={isDrawerOpen}
                    aria-controls="main-navigation"
                    onClick={() => setIsDrawerOpen((isOpen) => !isOpen)}
                >
                    {isDrawerOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                {isDrawerOpen && (
                    <button
                        className="app-nav__backdrop"
                        type="button"
                        aria-label="Close navigation"
                        onClick={closeNavigation}
                    />
                )}

                <nav
                    ref={navRef}
                    id="main-navigation"
                    className={`app-nav${isDrawerOpen ? ' is-drawer-open' : ''}`}
                    aria-label="Main navigation"
                >
                    <a
                        className="app-nav__link"
                        href="#view=home"
                        aria-current={isHome ? 'page' : undefined}
                        onClick={closeNavigation}
                    >
                        <Home size={17} aria-hidden="true" />
                        <span>Home</span>
                    </a>
                    <NavigationDropdown
                        label="Activity"
                        icon={Activity}
                        links={activityLinks}
                        route={route}
                        isOpen={openDropdown === 'activity'}
                        onToggle={() => toggleDropdown('activity')}
                        onNavigate={closeNavigation}
                    />
                    <NavigationDropdown
                        label="Discover"
                        icon={Compass}
                        links={discoveryLinks}
                        route={route}
                        isOpen={openDropdown === 'discover'}
                        onToggle={() => toggleDropdown('discover')}
                        onNavigate={closeNavigation}
                    />
                    <a
                        className="app-nav__link"
                        href="#view=guide"
                        aria-current={route.view === 'guide' ? 'page' : undefined}
                        onClick={closeNavigation}
                    >
                        <Map size={17} aria-hidden="true" />
                        <span>Guide</span>
                    </a>
                </nav>
                {!gameTheme && (
                    <button
                        className="app-nav__theme-toggle"
                        type="button"
                        aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
                        title={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
                        onClick={() => setColorMode((mode) => (mode === 'dark' ? 'light' : 'dark'))}
                    >
                        {colorMode === 'dark'
                            ? <Sun size={18} aria-hidden="true" />
                            : <Moon size={18} aria-hidden="true" />}
                    </button>
                )}
            </div>
        </header>
    );
};

export default AppNavbar;
