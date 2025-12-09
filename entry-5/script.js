// 音乐播放器功能
document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const record = document.getElementById('record');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const recordImage = document.querySelector('.record-image');

    // 音乐列表 - 这里使用一些示例音乐URL，你可以替换为实际的音乐文件路径
    const musicList = [
        {
            title: "Calm Meditation",
            artist: "Nature Sounds",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: "image/f1.png"
        },
        {
            title: "Peaceful Mind",
            artist: "Relaxation Music",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            cover: "image/f2.png"
        },
        {
            title: "Serenity",
            artist: "Ambient Music",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            cover: "image/f3.png"
        },
        {
            title: "Tranquil Moments",
            artist: "Healing Sounds",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            cover: "image/hellokitty.jpg"
        },
        {
            title: "Inner Peace",
            artist: "Mindful Music",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            cover: "image/people.jpg"
        }
    ];

    let currentIndex = -1;
    let isPlaying = false;

    // 随机选择一首音乐
    function getRandomMusic() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * musicList.length);
        } while (newIndex === currentIndex && musicList.length > 1);
        
        currentIndex = newIndex;
        return musicList[currentIndex];
    }

    // 播放音乐
    function playMusic() {
        const music = getRandomMusic();
        audioPlayer.src = music.url;
        songTitle.textContent = music.title;
        songArtist.textContent = music.artist;
        
        // 更新封面图片
        if (recordImage && music.cover) {
            recordImage.src = music.cover;
        }
        
        audioPlayer.play().then(() => {
            isPlaying = true;
            playIcon.textContent = "⏸";
            record.classList.add('playing');
        }).catch(error => {
            console.error('Playback failed:', error);
            songTitle.textContent = "Unable to play music";
            songArtist.textContent = "Please check your connection";
        });
    }

    // 暂停音乐
    function pauseMusic() {
        audioPlayer.pause();
        isPlaying = false;
        playIcon.textContent = "▶";
        record.classList.remove('playing');
    }

    // 切换播放/暂停
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    // 当音乐播放结束时，自动播放下一首
    audioPlayer.addEventListener('ended', () => {
        playMusic();
    });

    // 处理播放错误
    audioPlayer.addEventListener('error', () => {
        songTitle.textContent = "Loading failed";
        songArtist.textContent = "Please try again later";
        pauseMusic();
    });

    // 初始化显示
    songTitle.textContent = "Click to play";
    songArtist.textContent = "Random music";
});