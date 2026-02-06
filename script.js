/* ============================================================
   OUR STORY — INTENTION OVER CHANCE
   Valentine's Day Website Scripts
   ============================================================ */

(function () {
    'use strict';

    /* ==========================================================
       1. INITIALIZE AOS (Animate On Scroll)
       ========================================================== */
    AOS.init({
        duration: 1000,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic'
    });

    /* ==========================================================
       2. FALLING ROSE PETALS (Canvas Animation)
       ========================================================== */
    const petalCanvas = document.getElementById('petal-canvas');
    const ctx = petalCanvas.getContext('2d');
    let petals = [];
    const PETAL_COUNT = 35;

    function resizeCanvas() {
        petalCanvas.width = window.innerWidth;
        petalCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Petal {
        constructor() {
            this.reset(true);
        }

        reset(initial) {
            this.x = Math.random() * petalCanvas.width;
            this.y = initial ? Math.random() * petalCanvas.height * -1 : -20;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 1.2 + 0.3;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.03;
            this.opacity = Math.random() * 0.4 + 0.15;
            this.wobblePhase = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            // Random petal colors: rose, pink, light pink, soft red
            const colors = [
                [201, 24, 74],   // rose
                [232, 70, 106],  // light rose
                [255, 182, 193], // light pink
                [255, 214, 224], // soft pink
                [183, 110, 121], // rose gold
                [255, 105, 130]  // coral pink
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.wobblePhase += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobblePhase) * 0.5;
            this.rotation += this.rotationSpeed;

            if (this.y > petalCanvas.height + 20) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            // Draw petal shape
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 1)`;
            ctx.fill();

            // Inner highlight
            ctx.beginPath();
            ctx.ellipse(-this.size * 0.1, -this.size * 0.2, this.size * 0.25, this.size * 0.5, 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
            ctx.fill();

            ctx.restore();
        }
    }

    // Create petals
    for (let i = 0; i < PETAL_COUNT; i++) {
        petals.push(new Petal());
    }

    function animatePetals() {
        ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
        petals.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animatePetals);
    }

    animatePetals();

    /* ==========================================================
       3. SCROLL-TRIGGERED TEXT REVEAL
       ========================================================== */
    const textBlocks = document.querySelectorAll('.chapter-text');

    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    textBlocks.forEach(block => textObserver.observe(block));

    /* ==========================================================
       4. YOUTUBE BACKGROUND MUSIC
       ========================================================== */
    let player = null;
    let musicPlaying = false;
    const musicToggle = document.getElementById('music-toggle');
    const musicStatus = musicToggle.querySelector('.music-status');

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(tag, firstScript);

    /*
     * Simple manual-play flow:
     *  - Music does NOT autoplay.
     *  - Button says "Play" with a subtle CSS glow animation to draw attention.
     *  - User clicks Play → music starts, button switches to "Pause".
     */
    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player('youtube-player', {
            height: '1',
            width: '1',
            videoId: 't1dvrcqlQgI',
            playerVars: {
                autoplay: 0,
                loop: 1,
                playlist: 't1dvrcqlQgI',
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                rel: 0
            },
            events: {
                onReady: function (event) {
                    event.target.setVolume(30);
                },
                onStateChange: function (event) {
                    if (event.data === YT.PlayerState.PLAYING) {
                        musicToggle.classList.add('playing');
                        musicStatus.textContent = 'Pause';
                        musicPlaying = true;
                    }
                    if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                        musicToggle.classList.remove('playing');
                        musicStatus.textContent = 'Play';
                        musicPlaying = false;
                    }
                }
            }
        });
    };

    musicToggle.addEventListener('click', function () {
        if (!player || typeof player.playVideo !== 'function') return;

        if (musicPlaying) {
            player.pauseVideo();
            musicToggle.classList.remove('playing');
            musicStatus.textContent = 'Play';
            musicPlaying = false;
        } else {
            player.unMute();
            player.setVolume(30);
            player.playVideo();
            musicToggle.classList.add('playing');
            musicStatus.textContent = 'Pause';
            musicPlaying = true;
        }
    });

    /* ==========================================================
       5. SMOOTH SCROLL FOR HERO ARROW
       ========================================================== */
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const chapter1 = document.getElementById('chapter1');
            if (chapter1) {
                chapter1.scrollIntoView({ behavior: 'smooth' });
            }
        });
        scrollIndicator.style.cursor = 'pointer';
    }

    /* ==========================================================
       6. PARALLAX EFFECT ON HERO
       ========================================================== */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight * 1.5) {
                heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
            }
        }, { passive: true });
    }

    /* ==========================================================
       7. "NO" BUTTON — RUNAWAY BEHAVIOR (proximity-based)
       ========================================================== */
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const valentineHint = document.getElementById('valentine-hint');
    const valentineSection = document.getElementById('valentine');
    let noHoverCount = 0;
    let noDisappeared = false;
    let isRunaway = false;
    let noMoving = false; // debounce flag

    // Threshold: how close the cursor needs to get before the button flees
    const FLEE_DISTANCE = 100;

    function getSafeRandomPosition() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const btnWidth = noBtn.offsetWidth || 130;
        const btnHeight = noBtn.offsetHeight || 55;
        const padding = 40;

        const minX = padding;
        const maxX = vw - btnWidth - padding;
        const minY = padding + 60;
        const maxY = vh - btnHeight - padding;

        const x = Math.random() * (maxX - minX) + minX;
        const y = Math.random() * (maxY - minY) + minY;
        return { x, y };
    }

    // Get distance from mouse to button center
    function getDistToBtn(mx, my) {
        const rect = noBtn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        return Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
    }

    // Flee AWAY from the cursor to a new position
    function fleeFrom(mx, my) {
        if (noDisappeared || noMoving) return;
        noMoving = true;
        noHoverCount++;

        if (noHoverCount >= 2) {
            triggerExplosion();
            return;
        }

        // Switch to fixed positioning on first runaway
        // Move button to body to escape any ancestor transforms (AOS sets transform
        // on .valentine-content which breaks position:fixed containment & getBoundingClientRect)
        if (!isRunaway) {
            isRunaway = true;
            document.body.appendChild(noBtn);
            noBtn.style.position = 'fixed';
            noBtn.style.margin = '0';
            noBtn.style.zIndex = '9997';
            // Place at a random safe position far from cursor (original rect is unreliable due to AOS transform)
            const safe = getSafeRandomPosition();
            // Ensure it's far from mouse
            let attempts = 0;
            let pos = safe;
            while (attempts < 10) {
                const dx = mx - (pos.x + (noBtn.offsetWidth || 130) / 2);
                const dy = my - (pos.y + (noBtn.offsetHeight || 55) / 2);
                if (Math.sqrt(dx * dx + dy * dy) > FLEE_DISTANCE * 2) break;
                pos = getSafeRandomPosition();
                attempts++;
            }
            noBtn.style.left = pos.x + 'px';
            noBtn.style.top = pos.y + 'px';
            noBtn.style.transition = 'none'; // instant first placement
            noBtn.style.transform = 'scale(0.9)';
            // Allow next flee after a brief pause
            setTimeout(() => { noMoving = false; }, 100);
            return;
        }

        // Calculate flee direction (away from mouse)
        const rect = noBtn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let angle = Math.atan2(cy - my, cx - mx); // direction AWAY from cursor
        // Add some randomness to the angle
        angle += (Math.random() - 0.5) * 1.2;

        const fleeDistance = 200 + Math.random() * 150;
        let newX = cx + Math.cos(angle) * fleeDistance - rect.width / 2;
        let newY = cy + Math.sin(angle) * fleeDistance - rect.height / 2;

        // Clamp within viewport
        const pad = 40;
        const btnW = rect.width;
        const btnH = rect.height;
        newX = Math.max(pad, Math.min(window.innerWidth - btnW - pad, newX));
        newY = Math.max(pad + 50, Math.min(window.innerHeight - btnH - pad, newY));

        // If still too close to cursor, pick a random safe spot instead
        const distAfter = Math.sqrt((mx - (newX + btnW / 2)) ** 2 + (my - (newY + btnH / 2)) ** 2);
        if (distAfter < FLEE_DISTANCE * 1.5) {
            const safe = getSafeRandomPosition();
            newX = safe.x;
            newY = safe.y;
        }

        // Animate smoothly using CSS transition
        noBtn.style.transition = 'left 0.35s cubic-bezier(.25,.8,.25,1), top 0.35s cubic-bezier(.25,.8,.25,1), transform 0.35s ease';
        noBtn.style.left = newX + 'px';
        noBtn.style.top = newY + 'px';
        noBtn.style.transform = 'scale(0.9)';

        // Allow next flee after transition completes
        setTimeout(() => { noMoving = false; }, 380);
    }

    // FIRST FLEE: triggered by mouseenter on the button itself
    // (getBoundingClientRect is unreliable while inside AOS-transformed parent,
    //  but the browser fires mouseenter correctly regardless)
    noBtn.addEventListener('mouseenter', function (e) {
        if (noDisappeared || noMoving || isRunaway) return;
        fleeFrom(e.clientX, e.clientY);
    });

    // SUBSEQUENT FLEES (after button is on body with position:fixed):
    // use proximity-based detection since getBoundingClientRect is now reliable
    document.addEventListener('mousemove', function (e) {
        if (noDisappeared || noMoving || !isRunaway) return;
        const dist = getDistToBtn(e.clientX, e.clientY);
        if (dist < FLEE_DISTANCE) {
            fleeFrom(e.clientX, e.clientY);
        }
    });

    // Touch support
    noBtn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        const touch = e.touches[0];
        fleeFrom(touch.clientX, touch.clientY);
    });

    document.addEventListener('touchmove', function (e) {
        if (noDisappeared || noMoving || !isRunaway) return;
        const touch = e.touches[0];
        const dist = getDistToBtn(touch.clientX, touch.clientY);
        if (dist < FLEE_DISTANCE * 1.5) {
            fleeFrom(touch.clientX, touch.clientY);
        }
    }, { passive: true });

    // Prevent clicking No
    noBtn.addEventListener('click', function (e) {
        e.preventDefault();
        fleeFrom(e.clientX, e.clientY);
    });

    function triggerExplosion() {
        const rect = noBtn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Remove transitions so explosion animation plays immediately
        noBtn.style.transition = 'none';
        noBtn.classList.add('exploding');

        // Screen shake
        document.body.style.animation = 'screenShake 0.5s ease';
        setTimeout(() => { document.body.style.animation = ''; }, 500);

        // Flash overlay at explosion point
        const flash = document.createElement('div');
        flash.className = 'explosion-flash';
        flash.style.setProperty('--cx', cx + 'px');
        flash.style.setProperty('--cy', cy + 'px');
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);

        // Shockwave rings
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const ring = document.createElement('div');
                ring.className = 'explosion-shockwave';
                ring.style.left = cx + 'px';
                ring.style.top = cy + 'px';
                document.body.appendChild(ring);
                setTimeout(() => ring.remove(), 800);
            }, i * 150);
        }

        // Heart particle bursts
        createExplosionParticles(cx, cy, 30, 'heart-particle-large', 150);
        setTimeout(() => createExplosionParticles(cx, cy, 20, 'heart-particle-small', 250), 100);
        setTimeout(() => createExplosionParticles(cx, cy, 10, 'heart-particle-ring', 300), 250);

        // Confetti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 360,
                origin: { x: cx / window.innerWidth, y: cy / window.innerHeight },
                colors: ['#c9184a', '#b76e79', '#d4a574', '#ffd6e0', '#ff6b81', '#f0c987'],
                startVelocity: 30,
                gravity: 0.8,
                ticks: 100
            });
            setTimeout(() => {
                confetti({
                    particleCount: 40,
                    spread: 120,
                    origin: { x: cx / window.innerWidth, y: cy / window.innerHeight },
                    colors: ['#ff0044', '#ff4488', '#ffaacc'],
                    startVelocity: 20
                });
            }, 200);
        }

        // Remove button and show hint
        setTimeout(() => {
            noBtn.style.display = 'none';
            noDisappeared = true;
            valentineHint.style.display = 'block';
        }, 800);
    }

    function createExplosionParticles(cx, cy, count, className, maxRadius) {
        const hearts = ['❤️', '💕', '💗', '💖', '💝', '🌹', '✨', '💘', '🔥', '💫'];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
            const radius = maxRadius + Math.random() * 100;
            const tx = Math.cos(angle) * radius;
            const ty = Math.sin(angle) * radius;

            const particle = document.createElement('span');
            particle.className = 'heart-particle ' + className;
            particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            particle.style.left = cx + 'px';
            particle.style.top = cy + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 2000);
        }
    }

    /* ==========================================================
       8. "YES" BUTTON — CELEBRATION
       ========================================================== */
    yesBtn.addEventListener('click', function () {
        launchCelebration();
    });

    function launchCelebration() {
        const celebration = document.getElementById('celebration');
        celebration.style.display = 'flex';
        celebration.style.alignItems = 'center';
        celebration.style.justifyContent = 'center';
        document.body.classList.add('celebrating');
        // Prevent body scroll while celebration is showing
        document.body.style.overflow = 'hidden';

        // Confetti explosion
        const duration = 6000;
        const end = Date.now() + duration;

        function fireConfetti() {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#c9184a', '#b76e79', '#d4a574', '#ffd6e0', '#ff6b81', '#f0c987']
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#c9184a', '#b76e79', '#d4a574', '#ffd6e0', '#ff6b81', '#f0c987']
            });
            if (Date.now() < end) {
                requestAnimationFrame(fireConfetti);
            }
        }
        fireConfetti();

        // Big burst
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.5 },
                colors: ['#c9184a', '#b76e79', '#d4a574', '#ffd6e0', '#ff6b81']
            });
        }, 300);

        // Floating hearts
        launchFloatingHearts();

        // Add minions
        addDancingMinions();

        // Continuous confetti bursts
        let burstCount = 0;
        const burstInterval = setInterval(() => {
            burstCount++;
            confetti({
                particleCount: 30,
                spread: 70,
                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.5
                },
                colors: ['#c9184a', '#b76e79', '#d4a574', '#ffd6e0', '#ff6b81', '#f0c987']
            });
            if (burstCount > 15) clearInterval(burstInterval);
        }, 1500);
    }

    function launchFloatingHearts() {
        const hearts = ['❤️', '💕', '💗', '💖', '💝', '🌹', '💘'];
        const container = document.getElementById('celebration');

        function createHeart() {
            const heart = document.createElement('span');
            heart.className = 'celebration-floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            // Use percentage of container width, not vw, to avoid overflow
            heart.style.left = Math.random() * 90 + 5 + '%';
            heart.style.bottom = '-20px';
            heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
            heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 6000);
        }

        // Initial burst
        for (let i = 0; i < 20; i++) {
            setTimeout(createHeart, i * 150);
        }

        // Continuous hearts
        const heartInterval = setInterval(createHeart, 500);
        setTimeout(() => clearInterval(heartInterval), 20000);
    }

    function addDancingMinions() {
        const container = document.getElementById('minions-container');
        const minionGifs = [
            'https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif',
            'https://media.giphy.com/media/14qb1Uhf40ndw4/giphy.gif',
            'https://media.giphy.com/media/3EfgWHj0YIDrW/giphy.gif',
            'https://media.giphy.com/media/geslvCFM31sFW/giphy.gif'
        ];

        minionGifs.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Dancing Minion';
            img.className = 'minion-dancer';
            img.style.animationDelay = (idx * 0.15) + 's';
            img.onerror = function () {
                // Fallback: create CSS minion character
                const fallback = document.createElement('div');
                fallback.className = 'minion-dancer';
                fallback.style.width = '80px';
                fallback.style.height = '100px';
                fallback.style.background = 'linear-gradient(to bottom, #ffd700, #ffed4e)';
                fallback.style.borderRadius = '40% 40% 20% 20%';
                fallback.style.display = 'flex';
                fallback.style.alignItems = 'center';
                fallback.style.justifyContent = 'center';
                fallback.style.fontSize = '2.5rem';
                fallback.textContent = '🕺';
                this.replaceWith(fallback);
            };
            container.appendChild(img);
        });
    }

    /* ==========================================================
       9. TIMELINE LINE ANIMATION ON SCROLL
       ========================================================== */
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineLine.style.transition = 'opacity 1.5s ease';
                    timelineLine.style.opacity = '1';
                } else {
                    timelineLine.style.opacity = '0.2';
                }
            });
        }, { threshold: 0.2 });

        timelineLine.style.opacity = '0.2';
        timelineObserver.observe(document.querySelector('.timeline-wrapper'));
    }

    /* ==========================================================
       10. PRELOADER / INITIAL ANIMATION
       ========================================================== */
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';

        // Refresh AOS after everything loads
        setTimeout(() => AOS.refresh(), 300);
    });

    // Set initial body opacity for fade-in
    document.body.style.transition = 'opacity 1s ease';
    document.body.style.opacity = '0';

})();
