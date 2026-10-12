

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);

const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
lenis.stop();

const createDust = (x, y) => {
    const dust = document.createElement('div');
    dust.classList.add('magic-dust');
    dust.style.left = x + 'px';
    dust.style.top = y + 'px';
    document.body.appendChild(dust);

    const randomX = (Math.random() - 0.5) * 60;
    const randomY = (Math.random() - 0.5) * 60 + 20;

    gsap.to(dust, {
        x: randomX,
        y: randomY,
        scale: 0,
        opacity: 0,
        duration: 0.8 + Math.random() * 0.5,
        ease: "power1.out",
        onComplete: () => dust.remove()
    });
};

let lastDustTime = 0;
const handleMove = (e) => {
    const now = Date.now();
    if (now - lastDustTime > 25) {
        let x = e.clientX;
        let y = e.clientY;
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        createDust(x, y);
        lastDustTime = now;
    }
};

window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove, { passive: true });

const loginBtn = document.getElementById('btn-login');
const pwdInput = document.getElementById('pwd-input');
const loginError = document.getElementById('login-error');
const loginScreen = document.getElementById('login-screen');
const loginCard = document.getElementById('login-card');
const lilyBgs = document.querySelectorAll('.login-lily-bg');

let starSpeedMultiplier = 1;

const loginParallax = (e) => {
    const xAxis = ((window.innerWidth / 2 - e.pageX) / window.innerWidth) * 20;
    const yAxis = ((window.innerHeight / 2 - e.pageY) / window.innerHeight) * 20;

    gsap.to(loginCard, {
        rotateY: xAxis,
        rotateX: -yAxis,
        ease: "power2.out",
        duration: 0.8,
        transformPerspective: 1000
    });

    lilyBgs.forEach((lily, index) => {
        const speed = (index + 1) * 3;
        const x = (window.innerWidth / 2 - e.pageX) * speed / 100;
        const y = (window.innerHeight / 2 - e.pageY) * speed / 100;
        gsap.to(lily, { x: x, y: y, duration: 0.8, ease: "power2.out" });
    });
};

const resetLoginParallax = () => {
    gsap.to(loginCard, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power2.out" });
    gsap.to(lilyBgs, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
};

loginScreen.addEventListener('mousemove', loginParallax);
loginScreen.addEventListener('mouseleave', resetLoginParallax);

function attemptLogin() {
    const val = pwdInput.value.trim().toLocaleLowerCase('tr-TR');

    if (val === 'tatlı kaşığı') {
        loginScreen.removeEventListener('mousemove', loginParallax);
        loginScreen.removeEventListener('mouseleave', resetLoginParallax);

        const loginTl = gsap.timeline({
            onComplete: () => { loginScreen.style.display = 'none'; lenis.start(); }
        });

        gsap.to({ val: 1 }, { val: 20, duration: 1.5, onUpdate: function () { starSpeedMultiplier = this.targets()[0].val; } });

        loginTl.to('.login-card', { scale: 1.1, opacity: 0, duration: 0.6, ease: "power2.in" })
            .to('.login-glow', { opacity: 0, scale: 2, duration: 0.6 }, "<")
            .to('.login-lily-bg', { scale: 1.5, opacity: 0, duration: 0.6, stagger: 0.1 }, "<")
            .to(loginScreen, { opacity: 0, duration: 1 }, "+=0.3")
            .call(() => {
                gsap.to({ val: 20 }, { val: 1, duration: 1.5, onUpdate: function () { starSpeedMultiplier = this.targets()[0].val; } });
            });
    } else {
        pwdInput.classList.remove('shake-anim');
        void pwdInput.offsetWidth;
        pwdInput.classList.add('shake-anim');
        loginError.style.opacity = '1';
        setTimeout(() => { loginError.style.opacity = '0'; }, 2000);
    }
}

loginBtn.addEventListener('click', attemptLogin);
pwdInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') attemptLogin(); });

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.z = 800;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const starsGeometry = new THREE.BufferGeometry();
const starsCount = 6000;
const posArray = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 3500; }
starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({ size: 1.2, color: 0xffffff, transparent: true, opacity: 0.8 });
const starMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starMesh);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

lenis.on('scroll', (e) => { camera.position.z = 800 - (e.progress * 1800); });

function animateStars() {
    requestAnimationFrame(animateStars);
    starMesh.rotation.y += 0.0003 * starSpeedMultiplier;
    starMesh.rotation.x += 0.0001 * starSpeedMultiplier;
    renderer.render(scene, camera);
}
animateStars();

const startDate = new Date(2026, 9, 2, 23, 6, 0).getTime();

function updateCounter() {
    const now = new Date().getTime();
    const diff = now - startDate;
    const absoluteDiff = Math.abs(diff);

    const days = Math.floor(absoluteDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absoluteDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absoluteDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absoluteDiff % (1000 * 60)) / 1000);

    document.getElementById('c-days').innerText = String(days).padStart(2, '0');
    document.getElementById('c-hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('c-mins').innerText = String(minutes).padStart(2, '0');
    document.getElementById('c-secs').innerText = String(seconds).padStart(2, '0');
}
setInterval(updateCounter, 1000);
updateCounter();

const particleCount = 8;
const particlesContainer = document.getElementById('particles-container');
for (let i = 0; i < particleCount; i++) {
    let star = document.createElement('div');
    star.classList.add('stardust');
    let size = Math.random() * 2 + 1;
    star.style.width = size + 'px'; star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%'; star.style.top = Math.random() * 100 + '%';
    particlesContainer.appendChild(star);
    gsap.to(star, { x: () => (Math.random() - 0.5) * 60, y: () => (Math.random() - 0.5) * 60, opacity: () => Math.random() * 0.4 + 0.1, duration: () => Math.random() * 5 + 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
}

document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 1000
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
        });
    });
});

/* --- SİHİRLİ DOKUNUŞ ETKİLEŞİM JS'İ --- */
const syncContainer = document.getElementById('sync-container');
const syncRing = document.getElementById('sync-ring');
const syncSub = document.getElementById('sync-sub');
let syncTl;
let isSynced = false;

const startSync = (e) => {
    if (e.cancelable) e.preventDefault();
    if (isSynced) return;
    syncContainer.classList.add('holding');

    syncTl = gsap.timeline({
        onComplete: () => {
            isSynced = true;
            syncContainer.classList.remove('holding');
            syncSub.innerHTML = "Kalplerimiz artık senkronize... ❤️";
            gsap.fromTo(syncSub, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" });
            gsap.to('.sync-heart', { opacity: 0, duration: 0.3 });
            gsap.to('.sync-ring-svg', { opacity: 0, duration: 0.3 });

            const giantHeart = document.createElement('div');
            giantHeart.innerHTML = '❤️';
            giantHeart.style.position = 'absolute';
            giantHeart.style.fontSize = '80px';
            giantHeart.style.filter = 'drop-shadow(0 0 20px rgba(214, 137, 150, 0.8))';
            giantHeart.style.zIndex = '5';
            syncContainer.appendChild(giantHeart);
            gsap.fromTo(giantHeart, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" });

            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: ['#c9a65f', '#d68996'] });
        }
    });

    syncTl.to(syncRing, { strokeDashoffset: 0, duration: 2.5, ease: "power1.inOut" })
        .to('.sync-glow', { scale: 2.5, opacity: 0.8, duration: 2.5, ease: "power1.inOut" }, "<");
};

const stopSync = () => {
    if (isSynced) return;
    syncContainer.classList.remove('holding');
    if (syncTl) {
        syncTl.kill();
        gsap.to(syncRing, { strokeDashoffset: 471.2, duration: 0.5, ease: "power2.out" });
        gsap.to('.sync-glow', { scale: 0, opacity: 0, duration: 0.5 });
    }
};

syncContainer.addEventListener('mousedown', startSync);
syncContainer.addEventListener('touchstart', startSync, { passive: false });
window.addEventListener('mouseup', stopSync);
window.addEventListener('touchend', stopSync);

const routePath = document.getElementById("route-path-active");
const pathLength = routePath.getTotalLength();
routePath.style.strokeDasharray = pathLength;
routePath.style.strokeDashoffset = pathLength;

const masterTl = gsap.timeline({ scrollTrigger: { trigger: "#scroll-proxy", start: "top top", end: "bottom bottom", scrub: 1.2 } });

masterTl.to("#sec-intro", { autoAlpha: 1, duration: 0.1 })
    .fromTo("#text-intro", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" })
    .to("#text-intro", { scale: 2, opacity: 0, duration: 1.5, ease: "power2.in" })
    .fromTo("#text-transition", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" })
    .to("#text-transition", { scale: 2, opacity: 0, duration: 1.5, ease: "power2.in" })
    .to("#sec-intro", { autoAlpha: 0, duration: 0.1 });

masterTl.to("#sec-book", { autoAlpha: 1, duration: 0.1 })
    .to("#the-book", { opacity: 1, y: 0, rotationX: 0, duration: 2 })

    .to(".seal-half.left", { x: -80, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "openBook")
    .to(".seal-half.right", { x: 80, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "openBook")
    .to(".seal-center-heart", { scale: 0, opacity: 0, duration: 0.5 }, "openBook")

    .to(".cover", { rotateY: -160, duration: 1.5 }, "openBook")
    .to("#the-book", { x: window.innerWidth <= 768 ? "45%" : "25%", duration: 1.5 }, "openBook")
    .to("#first-page-names", { opacity: 1, duration: 0.5 })
    .to("#the-book", { scale: 25, x: "200%", y: "50%", opacity: 0, duration: 2 }, "zoomIn")
    .to("#inside-book-bg", { autoAlpha: 1, duration: 0.5 }, "zoomIn+=1.5")
    .to(".lily", { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }, "zoomIn+=1.5");

masterTl.to("#page-1", { autoAlpha: 1, duration: 0.5 })
    .to("#anim-heart", { strokeDashoffset: 0, duration: 1.5 })
    .to("#anim-heart", { fill: "#fbe6e9", duration: 0.5 })
    .to("#heart-counters", { opacity: 1, duration: 0.5 });

masterTl.to("#page-1", { rotateY: -180, duration: 1.5, ease: "power1.inOut" }, "flip1")
    .to("#page-1", { autoAlpha: 0, duration: 0.1 }, "flip1+=1.4")
    .to("#page-2", { autoAlpha: 1, duration: 0.1 }, "flip1")
    .to("#particles-container", { opacity: 1, duration: 0.5 }, "flip1+=0.5")
    .to(".flip-card", { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }, "flip1+=0.5");

masterTl.to("#page-2", { rotateY: -180, duration: 1.5, ease: "power1.inOut" }, "flip2")
    .to("#page-2", { autoAlpha: 0, duration: 0.1 }, "flip2+=1.4")
    .to("#page-3", { autoAlpha: 1, duration: 0.1 }, "flip2");

let poemTime = 0.5;
const pLines = document.querySelectorAll('.poem-line');

pLines.forEach((line, i) => {
    const targetText = line.getAttribute('data-text');
    line.innerHTML = '<span class="text-content"></span><span class="type-cursor">|</span>';
    const textContent = line.querySelector('.text-content');
    const cursor = line.querySelector('.type-cursor');

    masterTl.set(cursor, { opacity: 1 }, `flip2+=${poemTime}`)
        .to(textContent, { text: { value: targetText, delimiter: "" }, duration: 1.5, ease: "none" }, `flip2+=${poemTime}`)
        .set(cursor, { opacity: (i === pLines.length - 1 ? 1 : 0) }, `flip2+=${poemTime + 1.5}`);

    poemTime += 1.5;
});

masterTl.add("toJourney", `flip2+=${poemTime + 1}`);

masterTl.to(["#page-3", ".lily", "#particles-container", "#inside-book-bg"], { autoAlpha: 0, duration: 1 }, "toJourney")
    .to("#sec-journey", { autoAlpha: 1, duration: 1 }, "toJourney+=0.5")
    .to("#route-container", { y: () => -(3500 - window.innerHeight + (window.innerHeight * 0.15)), duration: 12, ease: "none" }, "ride")
    .to("#route-path-active", { strokeDashoffset: 0, duration: 12, ease: "none" }, "ride")
    .to("#bicycle-icon", { motionPath: { path: "#route-path-active", align: "#route-path-active", alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 12, ease: "none" }, "ride")
    .to(".wp-1", { opacity: 1, scale: 1, duration: 0.5 }, "ride+=0.5")
    .to(".wp-2", { opacity: 1, scale: 1, duration: 0.5 }, "ride+=2.0")
    .to(".wp-3", { opacity: 1, scale: 1, duration: 0.5 }, "ride+=3.5")
    .to(".wp-4", { opacity: 1, scale: 1, duration: 0.5 }, "ride+=5.5")
    .to(".wp-5", { opacity: 1, scale: 1, duration: 0.5 }, "ride+=7.5")
    .to(".wp-6", { opacity: 1, scale: 1, duration: 0.5 }, "ride+=9.5")
    .to(".wp-7", { opacity: 1, scale: 1, duration: 0.5 }, "ride+=11.5");

masterTl.to("#sec-journey", { autoAlpha: 0, duration: 1 }, "toLantern")
    .to("#sec-lantern", { autoAlpha: 1, duration: 1 }, "toLantern+=0.5")
    .to({}, { duration: 2 });

masterTl.to("#sec-lantern", { autoAlpha: 0, duration: 1 }, "toDaisy")
    .to("#sec-daisy", { autoAlpha: 1, duration: 1 }, "toDaisy+=0.5")
    .to({}, { duration: 3 });

// --- MASTER TIMELINE'A "SİHİRLİ DOKUNUŞ" BÖLÜMÜ EKLENDİ ---
masterTl.to("#sec-daisy", { autoAlpha: 0, duration: 1 }, "toSync")
    .to("#sec-sync", { autoAlpha: 1, duration: 1 }, "toSync+=0.5")
    .to({}, { duration: 3 }); // Etkileşim için bırakılan kaydırma alanı

masterTl.to("#sec-sync", { autoAlpha: 0, duration: 1 }, "closeBook")
    .to("#inside-book-bg", { autoAlpha: 0, duration: 0.1 }, "closeBook")
    .to("#the-book", { scale: 25, x: "200%", y: "50%", opacity: 0, duration: 0.1 }, "closeBook")
    .to("#the-book", { opacity: 1, duration: 0.1 }, "closeBook+=0.2")
    .to("#the-book", { scale: 1, x: window.innerWidth <= 768 ? "45%" : "25%", y: 0, duration: 2, ease: "power2.inOut" }, "closeBook+=0.2")
    .to("#first-page-names", { opacity: 0, duration: 0.5 }, "closeBook+=1")
    .to(".cover", { rotateY: 0, duration: 1.5, ease: "power2.inOut" }, "closeBook+=2.2")
    .to("#the-book", { x: 0, duration: 1.5, ease: "power2.inOut" }, "closeBook+=2.2")
    .to("#the-book", { y: "150vh", rotationX: 45, opacity: 0, duration: 2, ease: "power2.in" }, "closeBook+=3.7")
    .to("#sec-book", { autoAlpha: 0, duration: 0.1 });

masterTl.call(() => { starSpeedMultiplier = 20; })
    .to({}, { duration: 2 })
    .call(() => { gsap.to({ val: 20 }, { val: 1, duration: 1.5, onUpdate: function () { starSpeedMultiplier = this.targets()[0].val; } }); })
    .to("#sec-final", { autoAlpha: 1, duration: 1.5 });

const btnWish = document.getElementById('btn-wish');
const lanternContainer = document.getElementById('lantern-container');
const lanternSVG = `
        <svg viewBox="0 0 200 300" style="filter: drop-shadow(0 0 25px rgba(255, 120, 0, 1));">
            <path d="M 50 50 Q 100 20 150 50 L 170 200 Q 100 230 30 200 Z" fill="url(#lantern-grad)"/>
            <rect x="80" y="215" width="40" height="20" fill="#5c2b2b"/>
            <path d="M 100 215 L 100 235" stroke="#ffaa00" stroke-width="3"/>
            <circle cx="100" cy="200" r="18" fill="#ffdd00" style="filter: blur(8px);"/>
            <defs>
                <linearGradient id="lantern-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ff8800"/>
                    <stop offset="100%" stop-color="#ffcc00"/>
                </linearGradient>
            </defs>
        </svg>`;

btnWish.addEventListener('click', () => {
    const lantern = document.createElement('div');
    lantern.classList.add('lantern-element');
    lantern.innerHTML = lanternSVG;
    lantern.style.left = (Math.random() * 80 + 10) + '%';
    lanternContainer.appendChild(lantern);
    gsap.to(lantern, { y: -window.innerHeight - 200, x: "+=" + ((Math.random() - 0.5) * 150), rotation: (Math.random() - 0.5) * 20, duration: 1.2 + Math.random() * 0.8, ease: "power1.in", onComplete: () => lantern.remove() });
});

const petals = document.querySelectorAll('.petal');
const daisyText = document.getElementById('daisy-text');
let petalCount = 0;

const daisyPhrases = [
    "Seviyor...",
    "Sevmiyor... (Şaka şaka, tabii ki Seviyor!)",
    "Seviyor...",
    "Sevmiyor... (İmkansız, hep Seviyor!)",
    "Seviyor...",
    "Sevmiyor... (Kimi kandırıyoruz, Seviyor!)",
    "Seviyor...",
    "Sevmiyor... (Sistem hatası: O da Seviyor!)",
    "Veee SONSUZA DEK SEVİYOR! ❤️"
];

petals.forEach((petal) => {
    petal.addEventListener('click', function () {
        if (this.classList.contains('plucked')) return;
        this.classList.add('plucked');

        gsap.to(this, {
            y: -150,
            rotation: (Math.random() - 0.5) * 60,
            transformOrigin: "50% 50%",
            opacity: 0,
            duration: 1.5,
            ease: "power1.out"
        });

        if (petalCount < daisyPhrases.length) {
            daisyText.innerText = daisyPhrases[petalCount];
            daisyText.style.color = (petalCount % 2 === 0 || petalCount === 8) ? "#c9a65f" : "#d68996";

            gsap.fromTo(daisyText,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)", overwrite: "auto" }
            );
            petalCount++;
        }
    });
});

const btnNo = document.getElementById('btn-no');
const interactionArea = document.getElementById('final-interaction-area');
const btnYes = document.getElementById('btn-yes');

const moveNoButton = () => {
    const areaRect = interactionArea.getBoundingClientRect();
    const yesRect = btnYes.getBoundingClientRect();
    const noRect = btnNo.getBoundingClientRect();

    const padding = 20;
    const maxX = areaRect.width - noRect.width;
    const maxY = areaRect.height - noRect.height;
    const yesX = yesRect.left - areaRect.left;
    const yesY = yesRect.top - areaRect.top;
    const yesW = yesRect.width;
    const yesH = yesRect.height;

    let randX, randY, attempts = 0, isOverlapping = true;

    while (isOverlapping && attempts < 100) {
        randX = Math.random() * maxX;
        randY = Math.random() * maxY;

        const noRight = randX + noRect.width + padding;
        const noBottom = randY + noRect.height + padding;
        const noLeft = randX - padding;
        const noTop = randY - padding;

        const yesRight = yesX + yesW;
        const yesBottom = yesY + yesH;

        if (noRight < yesX || noLeft > yesRight || noBottom < yesY || noTop > yesBottom) {
            isOverlapping = false;
        }
        attempts++;
    }
    gsap.to(btnNo, { left: randX + (noRect.width / 2), top: randY + (noRect.height / 2), duration: 0.2, ease: "power2.out" });
};

btnNo.addEventListener('mouseenter', moveNoButton);
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); }, { passive: false });

document.getElementById('btn-yes').addEventListener('click', () => {
    document.getElementById('final-buttons').style.display = 'none';
    const fText = document.getElementById('final-text');
    fText.innerHTML = "Okuduğumuz en güzel kitap olacak...<br><br><span class='script' style='font-size: 1.5em; color: #d68996'>Sonsuza dek...</span>";
    gsap.fromTo(fText, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 2, ease: "back.out(1.5)" });

    var duration = 4 * 1000, end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#c9a65f', '#d68996', '#ffffff'] });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#c9a65f', '#d68996', '#ffffff'] });
        if (Date.now() < end) { requestAnimationFrame(frame); }
    }());

    const targetPos = new Float32Array(starsCount * 3);
    const curCamZ = camera.position.z;
    const heartCenterZ = curCamZ - 800;

    for (let i = 0; i < starsCount; i++) {
        const t = Math.random() * Math.PI * 2;
        const isOutline = Math.random() > 0.5;
        const r = Math.random();
        const scaleFactor = isOutline ? 1 : Math.pow(r, 0.6);

        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        x = x * 18 * scaleFactor;
        y = y * 18 * scaleFactor;

        const noiseX = (Math.random() - 0.5) * 5;
        const noiseY = (Math.random() - 0.5) * 5;
        const noiseZ = (Math.random() - 0.5) * 30;

        targetPos[i * 3] = x + noiseX;
        targetPos[i * 3 + 1] = y + noiseY;
        targetPos[i * 3 + 2] = heartCenterZ + noiseZ;

        if (!isOutline) {
            targetPos[i * 3 + 2] += (Math.random() - 0.5) * 150 * (1 - scaleFactor);
        }
    }

    const initialPos = new Float32Array(starsGeometry.attributes.position.array);
    let morphObj = { progress: 0 };

    gsap.to({ val: starSpeedMultiplier }, {
        val: 0,
        duration: 2,
        onUpdate: function () { starSpeedMultiplier = this.targets()[0].val; }
    });
    gsap.to(starMesh.rotation, { x: 0, y: 0, z: 0, duration: 2, ease: "power2.inOut" });
    gsap.to(starsMaterial.color, { r: 1.0, g: 0.6, b: 0.7, duration: 3 });

    gsap.to(morphObj, {
        progress: 1,
        duration: 4,
        ease: "power3.inOut",
        onUpdate: () => {
            const positions = starsGeometry.attributes.position.array;
            for (let i = 0; i < starsCount * 3; i++) {
                positions[i] = initialPos[i] + (targetPos[i] - initialPos[i]) * morphObj.progress;
            }
            starsGeometry.attributes.position.needsUpdate = true;
        }
    });

    gsap.to(starMesh.scale, {
        x: 1.05, y: 1.05, z: 1.05,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 4
    });
});
