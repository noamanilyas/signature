/**
 * Shared header + preloader behaviour (see stylesheets/gs-chrome.css).
 *
 * GSLoader  - show/hide the branded full-page preloader.
 * GSHeader  - org badge / user chip / editor save-status helpers.
 *
 * The app's existing "loading" SweetAlerts (Swal.fire with onBeforeOpen +
 * Swal.showLoading) are routed to GSLoader below, so every page gets the
 * new preloader without touching each call site.
 */
(function () {
  const LOADER_HTML = `
    <div class="gs-loader-card">
      <div class="gs-ring">
        <svg width="104" height="104" viewBox="0 0 104 104"><circle cx="52" cy="52" r="48" fill="none" stroke="oklch(93% 0.035 145)" stroke-width="4"/></svg>
        <svg class="spin" width="104" height="104" viewBox="0 0 104 104"><circle cx="52" cy="52" r="48" fill="none" stroke="oklch(55% 0.16 145)" stroke-width="4" stroke-linecap="round" stroke-dasharray="80 222"/></svg>
        <div class="gs-ring-core"><img src="/images/favicon.png" alt=""></div>
      </div>
      <div>
        <div class="gs-loader-title"><span id="gsLoaderMsg">Signatures are loading</span><span class="d">.</span><span class="d">.</span><span class="d">.</span></div>
        <div class="gs-loader-sub" id="gsLoaderSub">This usually takes a few seconds.</div>
      </div>
    </div>`;
  const DEFAULT_MSG = "Signatures are loading";
  const DEFAULT_SUB = "This usually takes a few seconds.";

  function ensureLoader() {
    let el = document.getElementById("gsLoader");
    if (!el) {
      el = document.createElement("div");
      el.id = "gsLoader";
      el.className = "gs-loader";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.innerHTML = LOADER_HTML;
      document.body.appendChild(el);
    }
    return el;
  }

  window.GSLoader = {
    show({ message = DEFAULT_MSG, sub = DEFAULT_SUB } = {}) {
      const el = ensureLoader();
      el.querySelector("#gsLoaderMsg").textContent = message;
      const subEl = el.querySelector("#gsLoaderSub");
      subEl.textContent = sub;
      subEl.hidden = !sub;
      el.classList.add("is-visible");
    },
    hide() {
      const el = document.getElementById("gsLoader");
      if (el) el.classList.remove("is-visible");
    },
  };

  // ---- Route the existing loading SweetAlerts to the new preloader ----
  function patchSwal() {
    if (!window.Swal || window.Swal.__gsPatched) return !!window.Swal;
    const fire = Swal.fire.bind(Swal);
    const close = Swal.close.bind(Swal);
    Swal.fire = function (opts) {
      if (opts && typeof opts === "object" && opts.onBeforeOpen) {
        const message = opts.title || DEFAULT_MSG;
        GSLoader.show({ message });
        return Promise.resolve({});
      }
      GSLoader.hide();
      return fire.apply(Swal, arguments);
    };
    Swal.close = function () {
      GSLoader.hide();
      return close.apply(Swal, arguments);
    };
    Swal.__gsPatched = true;
    return true;
  }
  // SweetAlert is loaded after this script on some pages; patch once it exists.
  if (!patchSwal()) {
    const t = setInterval(() => patchSwal() && clearInterval(t), 10);
    document.addEventListener("DOMContentLoaded", () => patchSwal() && clearInterval(t));
  }

  // ---- Header ----
  const initials = (t) =>
    (t || "")
      .trim()
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w[0] || ""))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "?";

  document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("[data-gs-header]");
    if (!header) return;
    if (header.dataset.page === "editor") {
      header.dataset.mode = new URLSearchParams(location.search).get("id") ? "edit" : "create";
    }
    const q = (s) => header.querySelector(s);
    const status = q("[data-gs-status]");
    const statusText = q("[data-gs-status-text]");
    const isCreate = header.dataset.mode === "create";
    let savedOnce = !isCreate;
    const setStatus = (t, dirty) => {
      if (!status) return;
      statusText.textContent = t;
      status.classList.toggle("dirty", dirty);
    };
    const markDirty = () => setStatus(savedOnce ? "Unsaved changes" : "Not saved yet", true);
    const markSaved = () => {
      savedOnce = true;
      setStatus("Saved", false);
    };

    if (status) {
      const nw = q("[data-gs-new]");
      if (nw) nw.hidden = !isCreate;
      const name = q("[data-gs-name]");
      if (name) name.addEventListener("input", markDirty);
      // The editor flips its global `edited` flag on every canvas change and
      // clears it after a save; mirror that into the status chip.
      let last = false;
      setInterval(() => {
        const now = typeof edited !== "undefined" && !!edited;
        if (now && !last) markDirty();
        else if (!now && last) markSaved();
        last = now;
      }, 400);
    }

    window.GSHeader = {
      setOrg(t) {
        if (!t) return;
        q("[data-gs-org]").textContent = t;
        q("[data-gs-org-badge]").textContent = initials(t);
      },
      setUser(email) {
        if (!email) return;
        q("[data-gs-email]").textContent = email;
        q("[data-gs-avatar]").textContent = email[0].toUpperCase();
        q(".gs-account").title = email;
      },
      markDirty,
      markSaved,
    };
  });
  // Safe no-op until the header exists, so page scripts can call it early.
  window.GSHeader = window.GSHeader || { setOrg() {}, setUser() {}, markDirty() {}, markSaved() {} };
})();
