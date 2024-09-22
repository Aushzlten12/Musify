/**
 * @license Apache-2.0
 * @copyright JosePM 2024
 */

"use strict";

/**
 * custom modules
 */
import { cookies, transferPlayback, play } from "./client_player.api.js";
import { addEventOnElems } from "../utils.js";

const /** {Array<HTMLElement>} */ $players =
    document.querySelectorAll("[data-player]");

const updatePlayerInfo = (playerState, $player) => {
  const /** {HTMLElement} */ $trackBanner = $player.querySelector(
      "[data-track-banner]"
    );
  const /** {HTMLElement} */ $trackName =
      $player.querySelector("[data-track-name]");
  const /** {HTMLElement} */ $trackArtist = $player.querySelector(
      "[data-track-artist]"
    );

  // destructure current playerState
  const {
    track_window: {
      current_track: {
        album: { images: trackImages },
        artists: trackArtists,
        name: trackName,
      },
    },
  } = playerState;

  const {
    url = "/images/track-banner.png",
    width,
    height,
  } = trackImages.find((item) => item.width > 200 && item.width < 400);

  const /** {string} */ artistNames = trackArtists
      .map(({ name }) => name)
      .join(", ");

  /**
   * update player image, track name, artist name
   * and remove hide and disabled class
   */
  $trackBanner.src = url;
  $trackBanner.width = width;
  $trackBanner.height = height;

  $trackBanner.alt = trackName;
  $trackName.textContent = trackName;
  $trackArtist.textContent = artistNames;
  $player.classList.remove("hide");
  $player.classList.remove("disabled");
};

/**
 * when any changes occur in player this function will be execute e.g change track/volume/play/pause/seek/next/previous
 *
 * @param {object} playerState - currently playing track object
 */
const playerStateChange = (playerState) => {
  const { track_window } = playerState;

  // update player ui
  $players.forEach((player) => updatePlayerInfo(playerState, player));
};

/**
 * Toggle play
 */
const togglePlay = async function (player) {
  const /** {string} */ deviceId = localStorage.getItem("device_id");

  const {
    context: { uri: currentUri },
    track_window: {
      current_track: { uri: currentTrackUri },
    },
  } = await player.getCurrentState();

  const { uri: btnUri, trackUri: btnTrackUri, playBtn } = this.dataset;

  if (playBtn === "play") {
    const /** {boolean} */ lastPlayed =
        currentUri === btnUri || currentTrackUri === btnTrackUri;

    if ((!btnUri && !btnTrackUri) || lastPlayed) {
      return await player.resume();
    }

    const /** {object} */ reqBody = {};

    btnUri ? (reqBody.context_uri = btnUri) : null;
    btnTrackUri ? (reqBody.uris = [btnTrackUri]) : null;

    await play(deviceId, reqBody);
  } else {
    await player.pause();
  }
};

window.onSpotifyWebPlaybackSDKReady = () => {
  const /** {number} */ volume = localStorage.getItem("volume") ?? 100;

  /**
   * Create spotify player instance
   */
  const player = new Spotify.Player({
    name: "Musify Web Player",
    getOAuthToken: (callback) => {
      callback(cookies.get("access_token"));
    },
    volume: volume / 100,
  });

  // Player is ready
  player.addListener("ready", async ({ device_id }) => {
    // store device in localStorage
    localStorage.setItem("device_id", device_id);

    // transfer playback to current device
    await transferPlayback(device_id);

    const /** {Array<HTMLElement>} */ $playBtns =
        document.querySelectorAll("[data-play-btn]");

    addEventOnElems($playBtns, "click", function () {
      togglePlay.call(this, player);
    });
  });

  // call event when any changes occur in player
  player.addListener("player_state_changed", playerStateChange);

  // Connect player
  player.connect();
};
