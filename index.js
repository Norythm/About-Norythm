function optimizeVideo() {
    const video = document.getElementById('bgVideo');

    video.playsInline = true;
    video.muted = true;
    video.defaultMuted = true;

    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    video.style.transform = 'translateZ(0)';
    video.style.backfaceVisibility = 'hidden';
    video.style.perspective = '1000px';

    function resizeVideo() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const videoRatio = 16 / 9;

        const windowRatio = windowWidth / windowHeight;

        if (windowRatio > videoRatio) {
            video.style.width = '100%';
            video.style.height = 'auto';
            video.style.left = '0';
            video.style.top = '50%';
            video.style.transform = 'translateY(-50%) translateZ(0)';
        } else {
            video.style.width = 'auto';
            video.style.height = '100%';
            video.style.left = '50%';
            video.style.top = '0';
            video.style.transform = 'translateX(-50%) translateZ(0)';
        }
    }
    resizeVideo();
    window.addEventListener('resize', resizeVideo);
    window.addEventListener('orientationchange', resizeVideo);

    const playVideo = () => {
        video.play().then(() => {
            console.log('Video playing smoothly');
        }).catch(error => {
            console.log('Video play failed, retrying...', error);
            setTimeout(playVideo, 500);
        });
    };

    playVideo();

    document.addEventListener('click', playVideo, { once: true });
}
document.addEventListener('DOMContentLoaded', optimizeVideo);

const audio = document.getElementById('bgAudio');
const audioIcon = document.getElementById('audioIcon');
const volumeSlider = document.getElementById('volumeSlider');
let isAudioPlaying = false;

function enterSite() {
    document.getElementById('preEntryBlur').style.display = 'none';
    document.getElementById('bgOldTv').style.display = 'block';
    document.querySelector('.entry-text').style.display = 'none';
    const main = document.getElementById('mainContent');
    main.style.display = 'flex';
    main.classList.add('show');
    audio.play().catch(e => console.log("Audio play failed:", e));
    isAudioPlaying = true;
    document.querySelector('.audio-container').style.display = 'flex';
    document.getElementById('bgVideo').play().catch(e => console.log("Video play failed:", e));
}

function toggleAudio() {
    if (isAudioPlaying) {
        audio.pause();
        audioIcon.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23281c8c'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>";
        isAudioPlaying = false;
    } else {
        audio.play().catch(e => console.log("Audio play failed:", e));
        audioIcon.src = "https://cdn-icons-png.flaticon.com/512/727/727269.png";
        isAudioPlaying = true;
    }
    audioIcon.style.filter = "brightness(0) saturate(100%) invert(22%) sepia(99%) saturate(745%) hue-rotate(227deg) brightness(87%) contrast(93%)";
}

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    const val = volumeSlider.value;
    const percent = val * 100;
    volumeSlider.style.background = `linear-gradient(to right, #281c8c 0%, #281c8c ${percent}%, #686868 ${percent}%, #686868 100%)`;
});

function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

const usernameText = document.getElementById('usernameText');
const canvas = document.getElementById('usernameParticles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const rect = usernameText.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.top = '0px';
    canvas.style.left = '0px';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const maxParticles = 70;

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function createParticle() {
    return {
        x: randomRange(0, canvas.width),
        y: randomRange(0, canvas.height),
        radius: randomRange(0.5, 1.2),
        speedX: randomRange(-0.15, 0.15),
        speedY: randomRange(-0.15, 0.15),
        opacity: randomRange(0.2, 0.6),
        opacityChange: 0.005 * (Math.random() < 0.5 ? 1 : -1),
        color: '#281c8c'
    };
}

for (let i = 0; i < maxParticles; i++) {
    particles.push(createParticle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacityChange;

        if (p.opacity > 0.6) p.opacity = 0.6;
        if (p.opacity < 0.2) p.opacity = 0.2;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -0.5;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -0.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(40, 28, 140, ${p.opacity})`;
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

const snowCanvas = document.createElement('canvas');
snowCanvas.id = 'snowCanvas';
snowCanvas.style.position = 'fixed';
snowCanvas.style.top = '0';
snowCanvas.style.left = '0';
snowCanvas.style.pointerEvents = 'none';
snowCanvas.style.zIndex = '2';
document.body.appendChild(snowCanvas);

const snowCtx = snowCanvas.getContext('2d');
let width = snowCanvas.width = window.innerWidth;
let height = snowCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = snowCanvas.width = window.innerWidth;
    height = snowCanvas.height = window.innerHeight;
});

const snowflakes = Array.from({ length: 100 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 3 + 1,
    d: Math.random() + 1,
}));

function drawSnow() {
    snowCtx.clearRect(0, 0, width, height);
    snowCtx.fillStyle = "white";
    snowCtx.beginPath();
    for (let i = 0; i < snowflakes.length; i++) {
        const f = snowflakes[i];
        snowCtx.moveTo(f.x, f.y);
        snowCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    }
    snowCtx.fill();
    updateSnow();
}

let angle = 0;
function updateSnow() {
    angle += 0.01;
    for (let i = 0; i < snowflakes.length; i++) {
        const f = snowflakes[i];
        f.y += Math.pow(f.d, 2) + 1;
        f.x += Math.sin(angle) * 2;
        if (f.y > height) {
            f.y = -10;
            f.x = Math.random() * width;
        }
    }
}

function animateSnow() {
    drawSnow();
    requestAnimationFrame(animateSnow);
}
animateSnow();