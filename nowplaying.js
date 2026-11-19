// ---- Fill these in ----------------------------------------------------
const LASTFM_USER = "YOUR_LASTFM_USERNAME";
const LASTFM_API_KEY = "YOUR_LASTFM_API_KEY";
// ------------------------------------------------------------------------

(function () {
  var box = document.getElementById("nowplaying");
  if (!box) return;

  // Stay hidden until configured so visitors never see a broken widget.
  if (LASTFM_USER.indexOf("YOUR_") === 0 || LASTFM_API_KEY.indexOf("YOUR_") === 0) return;
  box.hidden = false;

  var art = document.getElementById("np-art");
  var status = document.getElementById("np-status");
  var track = document.getElementById("np-track");
  var artist = document.getElementById("np-artist");
  var POLL_MS = 30000;

  function ago(uts) {
    var s = Math.max(0, Math.floor(Date.now() / 1000) - Number(uts));
    if (s < 3600) return Math.max(1, Math.round(s / 60)) + " min ago";
    if (s < 86400) return Math.round(s / 3600) + " hr ago";
    return Math.round(s / 86400) + " days ago";
  }

  function render(t) {
    var live = t["@attr"] && t["@attr"].nowplaying === "true";
    status.textContent = live ? "Now playing" : "Last played" + (t.date ? " · " + ago(t.date.uts) : "");
    box.classList.toggle("live", !!live);

    track.textContent = t.name;
    track.href = t.url;
    artist.textContent = t.artist["#text"] || t.artist.name || "";

    var imgs = t.image || [];
    var src = (imgs[imgs.length - 2] || imgs[imgs.length - 1] || {})["#text"];
    if (src && src.indexOf("https://") === 0) { art.src = src; art.hidden = false; }
    else { art.hidden = true; }
  }

  function load() {
    var url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&format=json" +
      "&user=" + encodeURIComponent(LASTFM_USER) + "&api_key=" + encodeURIComponent(LASTFM_API_KEY);
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var t = d && d.recenttracks && d.recenttracks.track && d.recenttracks.track[0];
        if (t) render(t); else box.hidden = true;
      })
      .catch(function () { /* keep whatever is showing */ });
  }

  load();
  setInterval(function () { if (!document.hidden) load(); }, POLL_MS);
})();
