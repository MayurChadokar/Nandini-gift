let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
        
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    })

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

// Music Player Functionality
const playBtn = document.getElementById('playBtn');
const audioPlayer = document.getElementById('audioPlayer');
const songCover = document.getElementById('songCover');
const progressBar = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-bar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
let isPlaying = false;
let firstClickOnMobile = true;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Format time function
function formatTime(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Click on cover to play/pause
songCover.addEventListener('click', handleCoverClick);

// Click on play button to play/pause
playBtn.addEventListener('click', handlePlayClick);

function handleCoverClick() {
  if (isMobile && firstClickOnMobile) {
    firstClickOnMobile = false;
    playAuto();
  } else {
    togglePlay();
  }
}

function handlePlayClick() {
  if (isMobile && firstClickOnMobile) {
    firstClickOnMobile = false;
    playAuto();
  } else {
    togglePlay();
  }
}

function playAuto() {
  audioPlayer.play().then(() => {
    isPlaying = true;
    playBtn.classList.add('playing');
    songCover.classList.add('playing');
    playBtn.innerHTML = '<span class="play-icon">⏸</span>';
  }).catch(err => {
    console.log('Auto-play error:', err);
  });
}

function togglePlay() {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    playBtn.classList.remove('playing');
    songCover.classList.remove('playing');
    playBtn.innerHTML = '<span class="play-icon">▶</span>';
  } else {
    audioPlayer.play();
    isPlaying = true;
    playBtn.classList.add('playing');
    songCover.classList.add('playing');
    playBtn.innerHTML = '<span class="play-icon">⏸</span>';
  }
}

// Update progress bar when audio plays
audioPlayer.addEventListener('timeupdate', () => {
  const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = percent + '%';
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

// Set duration when audio is loaded
audioPlayer.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audioPlayer.duration);
});

// Click on progress bar to seek
progressContainer.addEventListener('click', (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
});

// Reset button state when audio ends
audioPlayer.addEventListener('ended', () => {
  isPlaying = false;
  playBtn.classList.remove('playing');
  songCover.classList.remove('playing');
  playBtn.innerHTML = '<span class="play-icon">▶</span>';
  audioPlayer.currentTime = 0;
  progressBar.style.width = '0%';
});