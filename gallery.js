(function () {
  document.querySelectorAll(".photos").forEach(function (box) {
    var imgs = Array.prototype.slice.call(box.querySelectorAll("img"));
    if (!imgs.length) return;

    var track = document.createElement("div");
    track.className = "photos-track";
    imgs.forEach(function (img) { track.appendChild(img); });
    box.appendChild(track);
    if (imgs.length < 2) return;

    var title = (box.closest(".work") || document).querySelector("h3");
    var name = title ? title.textContent.trim() : "project";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", name + " photos");

    function button(cls, label, text) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "photo-btn " + cls;
      b.setAttribute("aria-label", label);
      b.textContent = text;
      box.appendChild(b);
      return b;
    }
    var prev = button("prev", "Previous photo", "‹");
    var next = button("next", "Next photo", "›");

    var dotsWrap = document.createElement("div");
    dotsWrap.className = "photo-dots";
    var dots = imgs.map(function (_, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", "Photo " + (i + 1) + " of " + imgs.length);
      d.addEventListener("click", function () { go(i); });
      dotsWrap.appendChild(d);
      return d;
    });
    box.appendChild(dotsWrap);

    function current() { return Math.round(track.scrollLeft / track.clientWidth) || 0; }
    function go(i) {
      i = Math.max(0, Math.min(imgs.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth });
    }
    function update() {
      var i = current();
      prev.disabled = i === 0;
      next.disabled = i === imgs.length - 1;
      dots.forEach(function (d, j) { d.setAttribute("aria-current", j === i ? "true" : "false"); });
    }

    prev.addEventListener("click", function () { go(current() - 1); });
    next.addEventListener("click", function () { go(current() + 1); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(update); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(current() - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { go(current() + 1); e.preventDefault(); }
    });
    update();
  });
})();
