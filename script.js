(() => {
  const audioPlayer = document.querySelector("#work1-audio");

  if (audioPlayer && audioPlayer.querySelector("source[src]")) {
    const seekAndPlay = (timeCode) => {
      const match = timeCode.match(/^(\d{2,}):([0-5]\d)$/);

      if (!match) {
        return null;
      }

      return () => {
        audioPlayer.currentTime = Number(match[1]) * 60 + Number(match[2]);
        const playback = audioPlayer.play();

        if (playback && typeof playback.catch === "function") {
          playback.catch((error) => {
            console.error("Could not play the audio from the selected time code.", error);
          });
        }
      };
    };

    document.querySelectorAll("time[data-seek]").forEach((timeCode) => {
      const timestamp = timeCode.textContent.trim();
      const seek = seekAndPlay(timestamp);

      if (!seek) {
        return;
      }

      timeCode.setAttribute("role", "button");
      timeCode.setAttribute("aria-label", `Play from ${timestamp}`);
      timeCode.tabIndex = 0;
      timeCode.addEventListener("click", seek);
      timeCode.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          seek();
        }
      });
    });

    document.querySelectorAll("#analysis p").forEach((paragraph) => {
      const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
      const textNodes = [];

      while (walker.nextNode()) {
        if (/\b\d{2,}:[0-5]\d\b/.test(walker.currentNode.textContent)) {
          textNodes.push(walker.currentNode);
        }
      }

      textNodes.forEach((textNode) => {
        const fragment = document.createDocumentFragment();
        const text = textNode.textContent;
        let lastIndex = 0;

        text.replace(/\b(\d{2,}:[0-5]\d)\b/g, (timestamp, _match, offset) => {
          fragment.append(text.slice(lastIndex, offset));

          const button = document.createElement("button");
          button.type = "button";
          button.className = "timestamp-seek";
          button.textContent = timestamp;
          button.setAttribute("aria-label", `Play from ${timestamp}`);

          const seek = seekAndPlay(timestamp);
          if (seek) {
            button.addEventListener("click", seek);
          }

          fragment.append(button);
          lastIndex = offset + timestamp.length;
          return timestamp;
        });

        fragment.append(text.slice(lastIndex));
        textNode.replaceWith(fragment);
      });
    });
  }
})();
