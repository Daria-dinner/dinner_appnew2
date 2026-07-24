document.addEventListener('DOMContentLoaded', () => {
  // --- БЛОК ЦИТАТ ---
  const quotes = document.querySelectorAll('.quote');
  const btnQuote = document.getElementById('random-quote-btn');
  let currentIndex = -1;

  function showRandomQuote() {
    // Если цитат нет — выходим
    if (quotes.length === 0) return;

    let newIndex;
    // Ищем случайный индекс, который НЕ равен текущему
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentIndex);

    currentIndex = newIndex;

    // Убираем класс active у всех цитат
    quotes.forEach(q => q.classList.remove('active-quote'));

    // Добавляем класс активной только выбранной
    const newQuote = quotes[currentIndex];
    newQuote.classList.add('active-quote');
  }

  if (btnQuote) {
    btnQuote.addEventListener('click', showRandomQuote);
  }


  // --- БЛОК ПЛЕЕРА (базовая реализация) ---
  const audio = document.getElementById('main-audio');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const volumeSlider = document.getElementById('volume-slider');
  const trackDisplay = document.getElementById('track-display');

  // Заглушка для треков (так как реальных файлов нет)
  const tracks = [
    { title: 'Малиновый закат', artist: 'Макс Корж', duration: 225 }, // 3:45
    { title: '10', artist: 'Эндшпиль', duration: 178 }, // 2:58
    { title: 'Нимфоманка', artist: 'Santiz', duration: 192 }, // 3:12
    { title: 'I Got Love', artist: 'MiyaGi & Эндшпиль', duration: 245 }, // 4:05
    { title: 'Зверь', artist: 'Guf', duration: 210 } // 3:30
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;

  // Функция обновления времени и прогресс-бара
  function updateProgress() {
    if (!audio || audio.duration === 0 || isNaN(audio.duration)) return;
    
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${percent}%`;

    const mins = Math.floor(audio.currentTime / 60);
    const secs = Math.floor(audio.currentTime % 60);
    currentTimeEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Форматирование длительности (секунды -> mm:ss)
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Плей/Пауза
  function togglePlay() {
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(e => {
        console.log('Автовоспроизведение заблокировано браузером. Нужно взаимодействие пользователя.');
        // В реальном проекте тут нужна кнопка "Разрешить звук"
      });
      isPlaying = true;
      playPauseBtn.textContent = '⏸';
    } else {
      audio.pause();
      isPlaying = false;
      playPauseBtn.textContent = '▶';
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlay);
  }

  // Прогресс-бар (клик по полосе)
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const posX = e.clientX - rect.left;
      const percent = posX / rect.width;
      if (audio) {
        audio.currentTime = percent * audio.duration;
      }
    });
  }

  // Громкость
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      if (audio) audio.volume = parseFloat(e.target.value);
    });
  }

  // Обработка событий аудио
  if (audio) {
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('durationchange', () => {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('ended', () => {
      // Автопереключение на следующий трек (опционально)
      currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
      loadTrack(currentTrackIndex);
      audio.play();
    });
  }

  // Простая имитация выбора трека из списка (для демонстрации)
  // В реальности нужно вешать обработчики на каждый <li class="track">
  const trackListItems = document.querySelectorAll('.track');
  trackListItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      loadTrack(index);
      togglePlay();
    });
  });

  function loadTrack(index) {
    currentTrackIndex = index;
    const track = tracks[index];
    
    // Тут должен быть src с реальным файлом, пока заглушка
    // audio.src = `assets/audio/track_${index}.mp3`; 
    
    if (trackDisplay) {
      trackDisplay.textContent = `${track.title} — ${track.artist}`;
    }
    if (durationEl) {
      durationEl.textContent = formatTime(track.duration);
    }
    
    // Сброс времени для визуальной красоты
    if (audio) {
      audio.currentTime = 0;
      progressFill.style.width = '0%';
      currentTimeEl.textContent = '0:00';
    }
  }
});
