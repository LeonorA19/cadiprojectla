(() => {
  const audioPlayer = document.querySelector("#work1-audio");

  if (audioPlayer && audioPlayer.getAttribute("src")) {
    document.querySelectorAll("time[data-seek]").forEach((timeCode) => {
      const match = timeCode.textContent.trim().match(/^(\d{2,}):([0-5]\d)$/);

      if (!match) {
        return;
      }

      const seekTo = Number(match[1]) * 60 + Number(match[2]);
      timeCode.setAttribute("role", "button");
      timeCode.setAttribute("aria-label", `Play from ${timeCode.textContent.trim()}`);
      timeCode.tabIndex = 0;

      const seekAndPlay = () => {
        audioPlayer.currentTime = seekTo;
        const playback = audioPlayer.play();

        if (playback) {
          playback.catch((error) => {
            console.error("Could not play the audio from the selected time code.", error);
          });
        }
      };

      timeCode.addEventListener("click", seekAndPlay);
      timeCode.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          seekAndPlay();
        }
      });
    });
  }
})();
