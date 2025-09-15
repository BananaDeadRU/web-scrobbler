export {};
setupConnector();
function setupConnector() {
  const body = document.querySelector("body");
  const isNewDesign = body?.classList.contains("ym-font-music") && (body.classList.contains("ym-dark-theme") || body.classList.contains("ym-light-theme"));
  if (isNewDesign) {
    setupNewConnector();
  } else {
    setupOldConnector();
  }
}
function setupOldConnector() {
  const observer = new MutationObserver(() => {
    const el = document.querySelector(".track.track_type_player");
    if (el) {
      observer.disconnect();
      Connector.playerSelector = ".track.track_type_player";
    }
  });
  const btn = document.querySelector(".player-controls__btn_play");
  if (btn) {
    const btnObserver = new MutationObserver(() => {
      Connector.onStateChanged();
    });
    btnObserver.observe(btn, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }
  const trackObserver = new MutationObserver(() => {
    Connector.onStateChanged();
  });
  const trackNode = document.querySelector(
    ".player-controls__track-container"
  );
  if (trackNode) {
    trackObserver.observe(trackNode, { childList: true, subtree: true });
  }
  observer.observe(document.body, { childList: true, subtree: true });
  Connector.trackSelector = ".track__title";
  Connector.artistSelector = ".d-artists.d-artists__expanded";
  Connector.getTrackArt = () => {
    const container = document.querySelector(
      ".player-controls__track-container"
    );
    if (!container) {
      return null;
    }
    const images = container.querySelectorAll("img");
    for (const img of images) {
      const src = img.getAttribute("src");
      if (src && src.includes("50x50")) {
        const absoluteUrl = new URL(
          src,
          window.location.origin
        ).toString();
        return absoluteUrl.replace("50x50", "800x800");
      }
    }
    return null;
  };
  Connector.getCurrentTime = () => {
    const el = document.querySelector(".progress__bar.progress__text");
    const timeStr = el?.getAttribute("data-played-time");
    return timeStr ? parseFloat(timeStr) : null;
  };
  Connector.getDuration = () => {
    const el = document.querySelector(".progress__bar.progress__text");
    const durStr = el?.getAttribute("data-duration");
    return durStr ? parseFloat(durStr) : null;
  };
  Connector.isPlaying = () => {
    const btn2 = document.querySelector(".player-controls__btn_play");
    return btn2?.classList.contains("player-controls__btn_pause") ?? false;
  };
}


function setupNewConnector() {
  Connector.playerSelector = "section[class*='PlayerBarDesktopWithBackgroundProgressBar_root']";

  Connector.getTrack = () => {
    const playerContainer = document.querySelector(
      'section[class*="PlayerBarDesktopWithBackgroundProgressBar_root"]'
    );
    if (!playerContainer) {
      console.warn("[Yandex Connector getTrack] The playerContainer is missing");
      return null;
    }

    const infoContainer = playerContainer.querySelector(
      'div[class*="PlayerBarDesktopWithBackgroundProgressBar_info"]'
    );
    if (!infoContainer) {
      console.warn("[Yandex Connector getTrack] The infoContainer is missing");
      return null;
    }

    const titleContainer = infoContainer.querySelector(
      'div[class*="Meta_titleContainer__"]'
    );
    if (!titleContainer) {
      console.warn("[Yandex Connector getTrack] The titleContainer is missing");
      return null;
    }

    const link = titleContainer.querySelector(
      'a[class*="Meta_albumLink__"]'
    );
    if (!link) {
      console.warn("[Yandex Connector getTrack] The link inside the titleContainer was not found.");
      return null;
    }

    const titleSpan = link.querySelector('span[class*="Meta_title__"]');
    if (!titleSpan) {
      console.warn("[Yandex Connector getTrack] The span with the track name was not found.");
      return null;
    }

    const trackName = titleSpan.textContent?.trim() ?? "";
    if (!trackName) {
      console.warn("[Yandex Connector getTrack] Track name is empty");
      return null;
    }

    return trackName;
  };


  Connector.getArtist = () => {
    const playerContainer = document.querySelector(
      'section[class*="PlayerBarDesktopWithBackgroundProgressBar_root"]'
    );
    if (!playerContainer) {
      console.warn("[Yandex Connector getArtist] There is no playerContainer");
      return null;
    }

    // Ищем блок с артистами, оба варианта класса
    const artistContainer = playerContainer.querySelector(
      'div[class*="SeparatedArtists_root_variant_breakAll__"], div[class*="Meta_artists__"]'
    );
    if (!artistContainer) {
      console.warn("[Yandex Connector getArtist] The artistContainer was not found");
      return null;
    }

    // Берём только первый артист
    const firstLink = artistContainer.querySelector("a");
    if (!firstLink) {
      console.warn("[Yandex Connector getArtist] No link for artists");
      return null;
    }

    const span = firstLink.querySelector('span[class*="Meta_artistCaption"]');
    if (!span) {
      console.warn("[Yandex Connector getArtist] There is no span with artist name");
      return null;
    }

    const artistName = span.textContent?.trim() || null;
    return artistName;
  };


  Connector.getTrackArt = () => {
    const img = document.querySelector(
      'img[class*="PlayerBarDesktopWithBackgroundProgressBar_cover__"]'
    );
    const src = img?.getAttribute("src");
    return src ? src.replace(/\d+x\d+/, "1000x1000") : null;
  };

  Connector.getCurrentTime = () => {
    const el = document.querySelector('[class*="Timecode_root_start"]');
    const parts = el?.textContent?.trim().split(":");
    if (!parts || parts.length !== 2) {
      return null;
    }
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds)) {
      return null;
    }
    return minutes * 60 + seconds;
  };
  Connector.getDuration = () => {
    const el = document.querySelector('[class*="Timecode_root_end"]');
    const parts = el?.textContent?.trim().split(":");
    if (!parts || parts.length !== 2) {
      return null;
    }
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    if (isNaN(minutes) || isNaN(seconds)) {
      return null;
    }
    return minutes * 60 + seconds;
  };

  Connector.isPlaying = () => {
    const buttons = Array.from(document.querySelectorAll("button"));
    for (const btn of buttons) {
      if (Array.from(btn.classList).some(c => c.includes("BaseSonataControlsDesktop_sonataButton"))) {
        const label = btn.getAttribute("aria-label");

        // Русский
        if (label === "Пауза") return true;
        if (label === "Воспроизведение") return false;

        // English
        if (label === "Pause") return true;
        if (label === "Playback") return false;

        // Ўзбекча
        if (label === "Pauza") return true
        if (label === "Ijro") return false

        // Қазақша
        if (label === "Үзіліс") return true
        if (label === "Ойнату") return false
      }
    }
    return false;
  };

  Connector.onStateChanged();
  const playerNode = document.querySelector(Connector.playerSelector);
  if (playerNode) {
    const observer = new MutationObserver(() => Connector.onStateChanged());
    observer.observe(playerNode, { childList: true, subtree: true });
  } else {
    console.warn(
      "[Yandex Connector] Something went wrong. Trying to fallback with interval..."
    );
    setInterval(() => Connector.onStateChanged(), 1e3);
  }
}