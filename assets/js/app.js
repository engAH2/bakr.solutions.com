(function () {
  const pathName = location.pathname.replace(/\\/g, "/");
  const ROOT = (function () {
    const parts = pathName.split("/").filter(Boolean);
    if (parts.length && /\.html?$/i.test(parts[parts.length - 1])) parts.pop();
    if (parts[parts.length - 1] === "pages") parts.pop();
    return "/" + (parts.length ? parts.join("/") + "/" : "");
  })();
  const B = window.RUKN.brand;
  const COVERS = {
    tech: "linear-gradient(135deg,#0f766e,#14b8a6)",
    research: "linear-gradient(135deg,#0f172a,#0f766e)",
    graduation: "linear-gradient(135deg,#0f766e,#f59e0b)",
    presentation: "linear-gradient(135deg,#115e59,#f59e0b)",
    stats: "linear-gradient(135deg,#0f766e,#334155)",
    editing: "linear-gradient(135deg,#0d9488,#0f766e)",
    ai: "linear-gradient(135deg,#0f766e,#7c3aed)",
    cyber: "linear-gradient(135deg,#0f172a,#0f766e)",
    medical: "linear-gradient(135deg,#0f766e,#14b8a6)",
    education: "linear-gradient(135deg,#0d9488,#f59e0b)",
    software: "linear-gradient(135deg,#115e59,#334155)",
    admin: "linear-gradient(135deg,#0f172a,#14b8a6)"
  };

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $all = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[ًٌٍَُِّْٰـ]/g, "")
      .replace(/[إأآاٱ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/[؟?!.،,;:«»""''()[\]{}]/g, " ")
      .replace(/[^\u0600-\u06FFa-z0-9+\s]/gi, " ")
      .replace(/\s+/g, " ")
      .replace(/(^| )ال(?=\S{2,})/g, "$1")
      .trim();
  }

  function scoreKeywords(query, keywords) {
    const q = norm(query);
    if (!q) return 0;
    let score = 0;
    (keywords || []).forEach((raw) => {
      const k = norm(raw);
      if (!k) return;
      if (q === k) score += 10;
      else if (k.indexOf(" ") !== -1 && q.indexOf(k) !== -1) score += 7;
      else if (k.length > 1 && new RegExp("(^| )" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "( |$)", "i").test(q))
        score += 5;
      else if (
        k.length >= 3 &&
        q.split(" ").some((t) => ["ه", "ات", "ين", "ون", "ان", "ها"].some((sfx) => t === k + sfx))
      )
        score += 3;
    });
    return score;
  }

  function matchesQuery(hay, q) {
    const nq = norm(q);
    if (!nq) return true;
    return norm(hay).indexOf(nq) !== -1;
  }

  function pageFile() {
    const here = location.pathname.replace(/\\/g, "/");
    const name = here.split("/").pop() || "index.html";
    if (!name || !/\.html?$/i.test(name)) return "index.html";
    return name;
  }

  function waTextUrl(text) {
    const base = B.whatsappUrl || "";
    const sep = base.indexOf("?") === -1 ? "?" : "&";
    return base + sep + "text=" + encodeURIComponent(text);
  }

  function navLink(href, label) {
    const file = href.replace(ROOT, "");
    const here = pageFile();
    const onHome = !/\/pages\//.test(location.pathname.replace(/\\/g, "/"));
    let active = false;
    if (file === "index.html") active = onHome && here === "index.html";
    else active = here === file.split("/").pop();
    return `<a class="${active ? "active" : ""}" href="${href}">${label}</a>`;
  }

  function renderChrome() {
    const header = document.createElement("header");
    header.className = "header";
    header.innerHTML = `
      <div class="header-inner">
        <div class="logo">
          <a class="logo-main" href="${ROOT}index.html">
                      <img src="${ROOT}assets/images/logo.png" alt="شعار ${B.fullName}" width="46" height="46"> 

          </a>
          <div class="logo-text">
            <a href="${ROOT}index.html">
              <strong>${B.name}</strong>
              <span>${B.tagline}</span>
            </a>
          </div>
        </div>
        <nav class="nav" aria-label="القائمة الرئيسية">
          ${navLink(ROOT + "index.html", "الرئيسية")}
          ${navLink(ROOT + "pages/services.html", "خدماتنا")}
          ${navLink(ROOT + "pages/specializations.html", "التخصصات")}
          ${navLink(ROOT + "pages/projects.html", "أعمالنا")}
          ${navLink(ROOT + "pages/about.html", "من نحن")}
          ${navLink(ROOT + "pages/faq.html", "الأسئلة")}
          ${navLink(ROOT + "pages/contact.html", "تواصل")}
        </nav>
        <div class="header-actions">
          <button class="icon-btn" id="searchBtn" type="button" aria-label="بحث">⌕</button>
          <button class="icon-btn" id="themeBtn" type="button" aria-label="تبديل الوضع">☾</button>
          <a class="btn btn-primary btn-header" href="${ROOT}pages/request.html">اطلب خدمتك</a>
          <button class="icon-btn menu-btn" id="menuBtn" type="button" aria-label="القائمة">☰</button>
        </div>
      </div>
      <div class="mobile-nav" id="mobileNav"></div>
    `;
    const main = document.getElementById("main");
    document.body.insertBefore(header, main);
    $("#mobileNav").innerHTML = $(".nav").innerHTML + `<a class="btn btn-primary" href="${ROOT}pages/request.html">اطلب خدمتك</a>`;

    const footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML = `
      <div class="container footer-main">
        <div class="footer-brand">
          <a class="footer-logo" href="${ROOT}index.html">
            <img src="${ROOT}assets/images/logo.png" alt="" width="44" height="44">
            <span>
              <strong>${B.name}</strong>
              <small>${B.tagline}</small>
            </span>
          </a>
          <p>${B.description}</p>
          <a class="footer-founder" href="${B.founder.url}" target="_blank" rel="noopener">${B.founder.honorific || B.founder.name}</a>
          <small class="footer-role">${B.founder.title || B.founder.role}</small>
          <div class="footer-cta">
            <a class="btn btn-accent" href="${ROOT}pages/request.html">اطلب خدمتك</a>
            <a class="btn btn-ghost footer-wa-btn" href="${B.whatsappUrl}" target="_blank" rel="noopener">واتساب</a>
          </div>
        </div>
        <nav class="footer-col" aria-label="روابط الموقع">
          <h2>روابط</h2>
          <a href="${ROOT}index.html">الرئيسية</a>
          <a href="${ROOT}pages/services.html">خدماتنا</a>
          <a href="${ROOT}pages/projects.html">أعمالنا</a>
          <a href="${ROOT}index.html#how">كيف نعمل؟</a>
          <a href="${ROOT}pages/about.html">من نحن</a>
          <a href="${ROOT}pages/faq.html">الأسئلة الشائعة</a>
          <a href="${ROOT}pages/contact.html">تواصل معنا</a>
        </nav>
        <nav class="footer-col" aria-label="أبرز الخدمات">
          <h2>الخدمات</h2>
          ${RUKN.services
            .slice(0, 6)
            .map((s) => `<a href="${ROOT}pages/service-details.html?id=${s.id}">${s.name}</a>`)
            .join("")}
        </nav>
        <div class="footer-col footer-contact">
          <h2>التواصل</h2>
          <a href="tel:${B.phoneTel}"><i class="fa-solid fa-phone" aria-hidden="true"></i> <span dir="ltr">${B.phoneDisplay}</span></a>
          <a href="${B.whatsappUrl}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> واتساب</a>
          <a href="mailto:${B.email}"><i class="fa-solid fa-envelope" aria-hidden="true"></i> <span dir="ltr">${B.email}</span></a>
          <a href="${B.founder.youtubeChannel}" target="_blank" rel="noopener"><i class="fa-brands fa-youtube" aria-hidden="true"></i> قناة يوتيوب</a>
          <span class="footer-meta">${B.city}</span>
          <a href="${ROOT}pages/privacy.html">سياسة الخصوصية</a>
          <a href="${ROOT}pages/terms.html">الشروط والأحكام</a>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© ${B.year} ${B.fullName}</span>
        <a href="${B.founder.url}" target="_blank" rel="noopener">إشراف تقني: ${B.founder.name}</a>
      </div>
    `;
    document.body.appendChild(footer);

    const wa = document.createElement("a");
    wa.className = "wa-float";
    wa.href = B.whatsappUrl;
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "تواصل معنا عبر واتساب");
    wa.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .13 5.34.13 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.29-1.65a11.86 11.86 0 0 0 5.75 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.43-8.44zM12.05 21.8h-.01a9.86 9.86 0 0 1-5.02-1.38l-.36-.21-3.73.98.99-3.64-.24-.37a9.86 9.86 0 0 1-1.51-5.28c0-5.44 4.43-9.87 9.88-9.87 2.64 0 5.12 1.03 6.98 2.9a9.82 9.82 0 0 1 2.89 6.97c0 5.44-4.44 9.87-9.87 9.87zm5.42-7.39c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47a8.9 8.9 0 0 1-1.65-2.04c-.17-.3 0-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"/></svg><span>واتساب</span>`;
    document.body.appendChild(wa);

    const ai = document.createElement("div");
    ai.className = "ai-wrap";
    ai.innerHTML = `
      <div class="ai-pop" id="aiWelcome" role="status" aria-live="polite">
        <img class="ai-pop-logo" src="${ROOT}assets/images/ai-assistant.svg" alt="" width="46" height="46">
        <div class="ai-pop-text">
          <strong>هل تحتاج مساعدة؟</strong>
          <span>اكتب ما تحتاجه، وسأقترح الخدمة وأفتح لك طلبها.</span>
        </div>
        <button type="button" class="ai-pop-action" id="aiWelcomeAction">ابدأ</button>
        <button type="button" class="ai-pop-close" id="aiWelcomeClose" aria-label="إغلاق الرسالة">×</button>
      </div>
      <div class="ai-panel" id="aiPanel" hidden>
        <div class="ai-head">
          <img src="${ROOT}assets/images/ai-assistant.svg" alt="" width="38" height="38">
          <div>
            <strong>مساعد بكر</strong>
            <small>يختار الخدمة المناسبة ويفتح طلبها</small>
          </div>
          <a class="icon-btn ai-wa" href="${B.whatsappUrl}" target="_blank" rel="noopener" aria-label="واتساب">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
          <button type="button" class="icon-btn" id="aiClose" aria-label="إغلاق المساعد">×</button>
        </div>
        <div class="ai-msgs" id="aiMsgs" role="log" aria-live="polite"></div>
        <div class="ai-quick" id="aiQuick"></div>
        <form class="ai-form" id="aiForm">
          <input id="aiInput" type="text" placeholder="مثال: أريد مشروع تخرج، بحث علمي، أو تصميم موقع" autocomplete="off" maxlength="400">
          <button class="btn btn-primary" type="submit" aria-label="إرسال">➤</button>
        </form>
      </div>
      <button class="ai-fab" id="aiFab" type="button" aria-label="فتح مساعد الذكاء الاصطناعي">
        <span class="ai-pulse"></span>
        <span class="ai-pulse ai-pulse-delay"></span>
        <img src="${ROOT}assets/images/ai-assistant.svg" alt="مساعد الذكاء الاصطناعي">
        <em class="ai-label">مساعد ذكي</em>
      </button>`;
    document.body.appendChild(ai);

    const top = document.createElement("button");
    top.className = "to-top";
    top.type = "button";
    top.setAttribute("aria-label", "العودة للأعلى");
    top.textContent = "↑";
    document.body.appendChild(top);
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    const overlay = document.createElement("div");
    overlay.className = "search-overlay";
    overlay.id = "searchOverlay";
    overlay.innerHTML = `
      <div class="search-panel" role="dialog" aria-modal="true" aria-label="بحث الموقع">
        <div class="search-head">
          <strong>بحث الموقع</strong>
          <button class="icon-btn" id="searchClose" type="button" aria-label="إغلاق البحث">×</button>
        </div>
        <input id="siteSearch" type="search" placeholder="ابحث عن خدمة، تخصص، أو سؤال..." autocomplete="off">
        <div id="searchHits" class="search-hits"></div>
      </div>`;
    document.body.appendChild(overlay);
  }

  function crumbs() {
    const box = $(".crumbs");
    if (!box) return;
    const map = {
      "services.html": "خدماتنا",
      "service-details.html": "تفاصيل الخدمة",
      "specializations.html": "التخصصات",
      "projects.html": "أعمالنا",
      "project-details.html": "تفاصيل العمل",
      "about.html": "من نحن",
      "contact.html": "تواصل معنا",
      "request.html": "اطلب خدمتك",
      "faq.html": "الأسئلة الشائعة",
      "privacy.html": "سياسة الخصوصية",
      "terms.html": "الشروط والأحكام"
    };
    const file = pageFile();
    const parent =
      file === "service-details.html"
        ? `<span>/</span><a href="${ROOT}pages/services.html">خدماتنا</a>`
        : file === "project-details.html"
          ? `<span>/</span><a href="${ROOT}pages/projects.html">أعمالنا</a>`
          : "";
    box.innerHTML = `<a href="${ROOT}index.html">الرئيسية</a>${parent}<span>/</span><span>${map[file] || file}</span>`;
  }

  function sitePages() {
    return [
      { file: "index.html", href: ROOT + "index.html", label: "الرئيسية" },
      { file: "services.html", href: ROOT + "pages/services.html", label: "خدماتنا" },
      { file: "specializations.html", href: ROOT + "pages/specializations.html", label: "التخصصات" },
      { file: "projects.html", href: ROOT + "pages/projects.html", label: "أعمالنا" },
      { file: "about.html", href: ROOT + "pages/about.html", label: "من نحن" },
      { file: "faq.html", href: ROOT + "pages/faq.html", label: "الأسئلة" },
      { file: "contact.html", href: ROOT + "pages/contact.html", label: "تواصل" },
      { file: "request.html", href: ROOT + "pages/request.html", label: "اطلب خدمتك", cta: true }
    ];
  }

  function pageSwitch() {
    const main = $("#main");
    if (!main || $("#pageSwitch")) return;
    const pages = sitePages();
    const file = pageFile();
    const extras = {
      "service-details.html": "services.html",
      "project-details.html": "projects.html",
      "privacy.html": "about.html",
      "terms.html": "about.html"
    };
    const currentFile = extras[file] || file;
    const idx = pages.findIndex((p) => p.file === currentFile);
    const prev = idx > 0 ? pages[idx - 1] : pages[pages.length - 1];
    const next = idx >= 0 && idx < pages.length - 1 ? pages[idx + 1] : pages[0];
    const nav = document.createElement("nav");
    nav.className = main.classList.contains("container") ? "page-switch" : "page-switch container";
    nav.id = "pageSwitch";
    nav.setAttribute("aria-label", "التنقل بين الصفحات");
    nav.innerHTML = `
      <a class="page-prev" href="${prev.href}">‹ ${prev.label}</a>
      <div class="page-list">${pages
        .map(
          (p) =>
            `<a class="${p.file === currentFile ? "is-current" : ""}${p.cta ? " page-cta" : ""}" href="${p.href}">${p.label}</a>`
        )
        .join("")}</div>
      <a class="page-next" href="${next.href}">${next.label} ›</a>`;
    main.appendChild(nav);
  }

  function openFold(el) {
    if (!el) return;
    if (el.matches("details.fold")) el.open = true;
    const wrap = el.closest("details.fold");
    if (wrap) wrap.open = true;
    requestAnimationFrame(() => {
      $all("[data-carousel]", el.matches("details") ? el : wrap || el).forEach(bindCarousel);
    });
  }

  function bindFolds() {
    $all("details.fold > summary").forEach((sum) => {
      if (sum.querySelector(".fold-toggle")) return;
      const icon = document.createElement("span");
      icon.className = "fold-toggle";
      icon.setAttribute("aria-hidden", "true");
      sum.appendChild(icon);
    });
    $all("details.fold").forEach((el) => {
      el.addEventListener("toggle", () => {
        if (!el.open) return;
        requestAnimationFrame(() => $all("[data-carousel]", el).forEach(bindCarousel));
      });
    });
    const openFromHash = () => {
      const id = decodeURIComponent((location.hash || "").replace("#", ""));
      if (!id) return;
      openFold(document.getElementById(id));
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const hash = href.split("#")[1];
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      const samePage = href.charAt(0) === "#" || href.split("#")[0] === "" || href.indexOf(pageFile()) !== -1 || (pageFile() === "index.html" && href.indexOf("pages/") === -1);
      if (!samePage) return;
      openFold(target);
    });
  }

  function theme() {
    const saved = localStorage.getItem("rukn-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    const btn = $("#themeBtn");
    const sync = () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      btn.textContent = dark ? "☀" : "☾";
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute("content", dark ? "#0a1413" : "#0c6b64");
    };
    sync();
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("rukn-theme", next);
      sync();
    });
  }

  function headerScroll() {
    const header = $(".header");
    const top = $(".to-top");
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 12);
      top.classList.toggle("show", window.scrollY > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function mobileMenu() {
    const btn = $("#menuBtn");
    const nav = $("#mobileNav");
    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.id = "navBackdrop";
    document.body.appendChild(backdrop);
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      backdrop.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "mobileNav");
    btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    backdrop.addEventListener("click", () => setOpen(false));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function siteSearch() {
    const overlay = $("#searchOverlay");
    const input = $("#siteSearch");
    const hits = $("#searchHits");
    const open = () => {
      overlay.classList.add("open");
      input.value = "";
      hits.innerHTML = "<p>ابدأ الكتابة للبحث في الخدمات والأعمال والأسئلة.</p>";
      setTimeout(() => input.focus(), 40);
    };
    const close = () => overlay.classList.remove("open");
    $("#searchBtn").addEventListener("click", open);
    $("#searchClose").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
      if (e.key === "Escape") close();
    });
    const items = [
      ...RUKN.services.map((s) => ({
        t: s.name,
        d: s.short,
        h: `${ROOT}pages/service-details.html?id=${s.id}`
      })),
      ...RUKN.projects.map((p) => ({
        t: p.title,
        d: p.spec + " — " + p.typeLabel,
        h: `${ROOT}pages/project-details.html?id=${p.id}`
      })),
      ...RUKN.specializations.map((s) => ({
        t: s.name,
        d: "تخصص · " + s.group,
        h: `${ROOT}pages/specializations.html`
      })),
      ...RUKN.faqs.map((f) => ({ t: f.q, d: f.a, h: `${ROOT}pages/faq.html` }))
    ];
    input.addEventListener("input", () => {
      const q = input.value.trim();
      if (!q) {
        hits.innerHTML = "<p>ابدأ الكتابة للبحث في الخدمات والأعمال والأسئلة.</p>";
        return;
      }
      const list = items.filter((i) => matchesQuery(i.t + " " + i.d, q)).slice(0, 8);
      hits.innerHTML = list.length
        ? list.map((i) => `<a href="${escapeHtml(i.h)}"><b>${escapeHtml(i.t)}</b><span>${escapeHtml(i.d)}</span></a>`).join("")
        : "<p>لا توجد نتائج مطابقة.</p>";
    });
  }

  function hrefOf(h) {
    if (!h) return "#";
    if (h.startsWith("#") || h.startsWith("http")) return h;
    return ROOT + h;
  }

  function slideVisual(s) {
    const shape = s.shape || "grad";
    if (shape === "book") {
      return `
        <div class="shape-panel shape-book" aria-hidden="true">
          <span class="sheet s1"></span>
          <span class="sheet s2"></span>
          <span class="sheet s3"><i class="fa-solid ${s.icon}"></i></span>
          <span class="shape-chip">تقرير جاهز</span>
        </div>`;
    }
    if (shape === "code") {
      return `
        <div class="shape-panel shape-code" aria-hidden="true">
          <div class="code-window">
            <span class="dots"><i></i><i></i><i></i></span>
            <span class="line w1"></span>
            <span class="line w2"></span>
            <span class="line w3"></span>
            <span class="line w4"></span>
            <b><i class="fa-solid ${s.icon}"></i> مشروع تقني</b>
          </div>
        </div>`;
    }
    if (shape === "chat") {
      return `
        <div class="shape-panel shape-chat" aria-hidden="true">
          <span class="bubble in">كيف أبدأ مشروعي؟</span>
          <span class="bubble out">نرتّب الفكرة ونوضح المسار</span>
          <span class="bubble in">واتساب مباشرة؟</span>
          <span class="chat-fab"><i class="fa-solid ${s.icon}"></i></span>
        </div>`;
    }
    return `
      <div class="shape-panel shape-grad" aria-hidden="true">
        <span class="ring"></span>
        <span class="shape-core"><img src="${ROOT}assets/images/logo.png" alt="" width="72" height="72"></span>
        <span class="shape-chip c1">تخرج</span>
        <span class="shape-chip c2">بحوث</span>
        <span class="shape-chip c3">تقنية</span>
        <span class="shape-chip c4 g-chip-mini"><i class="fa-brands fa-google"></i> تقييمات جوجل</span>
      </div>`;
  }

  function heroSlider() {
    const box = $("#heroSlider");
    if (!box || !RUKN.slides) return;
    let i = 0;
    const slides = RUKN.slides;
    const gUrl = (B.googleReviews && B.googleReviews.searchUrl) || B.whatsappUrl;
    const founderName = (B.founder && (B.founder.honorific || B.founder.name)) || "";
    box.innerHTML = `
      <div class="hero-slides">
        ${slides
          .map(
            (s, idx) => `
          <article class="hero-slide${idx === 0 ? " is-active" : ""}">
            <div class="container hero-grid">
              <div class="hero-content">
                <span class="eyebrow">${s.eyebrow}</span>
                <h1>${s.title}</h1>
                <p class="lead">${s.text}</p>
                <div class="hero-proof">
                  <a class="g-chip" href="${gUrl}" target="_blank" rel="noopener">
                    <i class="fa-brands fa-google" aria-hidden="true"></i>
                    <span class="g-stars" aria-hidden="true">★★★★★</span>
                    <span>تقييمات جوجل</span>
                  </a>
                  <span class="proof-item">${founderName}</span>
                  <span class="proof-item">${B.city}</span>
                </div>
                <div class="hero-actions">
                  <a class="btn btn-primary" href="${hrefOf(s.href)}">${s.cta}</a>
                  <a class="btn btn-ghost" href="${hrefOf(s.ghostHref)}">${s.ghost}</a>
                </div>
              </div>
              <div class="visual">${slideVisual(s)}</div>
            </div>
          </article>`
          )
          .join("")}
      </div>
      <div class="container">
        <div class="hero-controls">
          <button type="button" class="hero-arrow" data-dir="-1" aria-label="الشريحة السابقة">‹</button>
          <div class="hero-dots">${slides
            .map((_, idx) => `<button type="button" class="dot${idx === 0 ? " active" : ""}" data-i="${idx}" aria-label="شريحة ${idx + 1}"></button>`)
            .join("")}</div>
          <button type="button" class="hero-arrow" data-dir="1" aria-label="الشريحة التالية">›</button>
        </div>
      </div>`;
    const apply = () => {
      $all(".hero-slide", box).forEach((el, idx) => el.classList.toggle("is-active", idx === i));
      $all(".hero-dots .dot", box).forEach((el, idx) => el.classList.toggle("active", idx === i));
    };
    const go = (n) => {
      const last = slides.length;
      i = ((n % last) + last) % last;
      apply();
    };
    box.addEventListener("click", (e) => {
      const arrow = e.target.closest(".hero-arrow");
      const dot = e.target.closest(".hero-dots .dot");
      if (arrow) go(i + Number(arrow.dataset.dir));
      if (dot) go(Number(dot.dataset.i));
    });
    let startX = 0;
    box.addEventListener(
      "touchstart",
      (e) => {
        startX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    box.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) < 40) return;
        go(i + (dx < 0 ? 1 : -1));
      },
      { passive: true }
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && slides.length > 1) {
      let timer = setInterval(() => go(i + 1), 7000);
      const stop = () => clearInterval(timer);
      const play = () => {
        stop();
        timer = setInterval(() => go(i + 1), 7000);
      };
      box.addEventListener("mouseenter", stop);
      box.addEventListener("mouseleave", play);
      box.addEventListener("focusin", stop);
      box.addEventListener("focusout", play);
    }
  }

  function bindCarousel(root) {
    if (!root || !root.querySelector) return;
    const viewport = $(".carousel-viewport", root);
    const track = $(".carousel-track", root);
    const dotsBox = $(".carousel-dots", root);
    if (!viewport || !track) return;
    const items = () => [...track.children].filter((el) => el.nodeType === 1 && el.tagName !== "P");
    const page = () => {
      const kids = items();
      if (!kids.length) return 0;
      const vr = viewport.getBoundingClientRect();
      const mid = vr.left + vr.width / 2;
      let best = 0;
      let dist = Infinity;
      kids.forEach((el, idx) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < dist) {
          dist = d;
          best = idx;
        }
      });
      return best;
    };
    const paintDots = () => {
      if (!dotsBox) return;
      const kids = items();
      const cur = page();
      dotsBox.innerHTML =
        kids.length > 8
          ? `<span class="carousel-count">${cur + 1} / ${kids.length}</span>`
          : kids
              .map((_, idx) => `<button type="button" class="dot${idx === cur ? " active" : ""}" data-i="${idx}" aria-label="بطاقة ${idx + 1}"></button>`)
              .join("");
    };
    const goTo = (n) => {
      const kids = items();
      if (!kids.length) return;
      const from = typeof root._i === "number" ? root._i : page();
      const i = ((n % kids.length) + kids.length) % kids.length;
      root._i = i;
      const el = kids[i];
      const vr = viewport.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      const delta = er.left + er.width / 2 - (vr.left + vr.width / 2);
      const wrap = (from === kids.length - 1 && i === 0) || (from === 0 && i === kids.length - 1);
      viewport.scrollBy({ left: delta, behavior: wrap ? "auto" : "smooth" });
      window.clearTimeout(root._scrollTimer);
      root._scrollTimer = window.setTimeout(paintDots, wrap ? 80 : 450);
    };
    if (root.dataset.bound === "1") {
      paintDots();
      return;
    }
    root.dataset.bound = "1";
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-dir]");
      const dot = e.target.closest("[data-i]");
      if (btn && root.contains(btn)) {
        const cur = typeof root._i === "number" ? root._i : page();
        goTo(cur + Number(btn.dataset.dir));
      }
      if (dot && dotsBox && dotsBox.contains(dot)) goTo(Number(dot.dataset.i));
    });
    viewport.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(root._dotTimer);
        root._dotTimer = window.setTimeout(() => {
          root._i = page();
          paintDots();
        }, 80);
      },
      { passive: true }
    );
    viewport.addEventListener("scrollend", paintDots, { passive: true });
    window.requestAnimationFrame(paintDots);
  }

  function bindCarousels() {
    $all("[data-carousel]").forEach(bindCarousel);
  }

  function marquee() {
    const track = $("#marqueeTrack");
    if (!track) return;
    const items = RUKN.services.map((s) => `<span><i class="fa-solid ${s.icon}"></i> ${s.name}</span>`).join("");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.innerHTML = reduceMotion ? items : items + items;
  }

  function assistant() {
    const fab = $("#aiFab");
    const panel = $("#aiPanel");
    const msgs = $("#aiMsgs");
    const form = $("#aiForm");
    const input = $("#aiInput");
    const quick = $("#aiQuick");
    const welcomeNotice = $("#aiWelcome");
    if (!fab) return;

    let lastService = null;
    let busy = false;
    const DEFAULT_CHIPS = ["مشروع تخرج", "بحث علمي", "موقع إلكتروني", "سيرة ذاتية", "كيف أطلب؟", "واتساب"];
    const STOP = new Set([
      "اريد", "ابي", "ابغى", "محتاج", "احتاج", "ساعدني", "لو", "سمحت", "هل", "يمكن",
      "عندي", "كيف", "وش", "ما", "هذا", "هذه", "الي", "من", "في", "على", "طلب", "خدمه", "خدمات"
    ]);

    const pageService = () => {
      if (pageFile() !== "service-details.html") return null;
      const id = new URLSearchParams(location.search).get("id");
      return RUKN.services.find((x) => x.id === id) || null;
    };
    const link = (href, label, cls) =>
      `<a href="${href}"${href.startsWith("http") || href.startsWith("mailto:") ? ' target="_blank" rel="noopener"' : ""}${
        cls ? ` class="${cls}"` : ""
      }>${label}</a>`;
    const svcLinks = (s) =>
      `<span class="ai-cta-row">${link(
        ROOT + "pages/request.html?service=" + s.id,
        "طلب الخدمة",
        "ai-cta"
      )}${link(ROOT + "pages/service-details.html?id=" + s.id, "التفاصيل", "ai-cta ghost")}</span>`;
    const durationOf = (s) => {
      const d = (s.duration || "").trim();
      return d || "تُحدَّد بعد مراجعة الطلب";
    };
    const waFor = (s) =>
      s
        ? waTextUrl(`السلام عليكم، أرغب بطلب خدمة: ${s.name}`)
        : B.whatsappUrl;
    const serviceReply = (s) => {
      lastService = s;
      return `<b>${s.name}</b><br>${s.short}<br>المدة التقريبية: ${durationOf(s)}${svcLinks(s)}`;
    };
    const contactReply = () =>
      `تواصل مباشرة عبر الهاتف <a href="tel:${B.phoneTel}">${B.phoneDisplay}</a> أو ${link(waFor(lastService), "واتساب")} أو البريد ${link("mailto:" + B.email, B.email)}. ${link(ROOT + "pages/contact.html", "صفحة التواصل")}`;
    const orderReply = (s) =>
      s
        ? `لطلب «${s.name}» عبّئ النموذج ثم أكمل عبر واتساب، أو راسلنا مباشرة.${svcLinks(s)}<span class="ai-cta-row">${link(
            waFor(s),
            "واتساب",
            "ai-cta ghost"
          )}</span>`
        : `اختر الخدمة ثم عبّئ النموذج، أو راسلنا على واتساب وسنوجّهك.<span class="ai-cta-row">${link(
            ROOT + "pages/request.html",
            "نموذج الطلب",
            "ai-cta"
          )}${link(B.whatsappUrl, "واتساب", "ai-cta ghost")}</span>`;
    const priceReply = (s) =>
      s
        ? `تكلفة «${s.name}» ليست ثابتة؛ تعتمد على نطاق العمل والمدة. بعد مراجعة التفاصيل نرسل عرضاً واضحاً قبل البدء. المدة التقريبية: ${durationOf(s)}.${svcLinks(s)}`
        : `لا توجد قائمة أسعار ثابتة. بعد مراجعة نطاق العمل والموعد نوضّح العرض قبل البدء.<span class="ai-cta-row">${link(
            ROOT + "pages/request.html",
            "أرسل تفاصيل طلبك",
            "ai-cta"
          )}</span>`;

    const setChips = (labels) => {
      quick.innerHTML = (labels || DEFAULT_CHIPS).map((l) => `<button type="button" class="chip">${l}</button>`).join("");
    };

    const add = (text, who) => {
      const el = document.createElement("div");
      el.className = "ai-bubble " + who;
      if (who === "bot") el.innerHTML = text;
      else el.textContent = text;
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    };

    const welcome = () => {
      msgs.innerHTML = "";
      const current = pageService();
      lastService = current;
      if (current) {
        add(
          `أهلاً بك. أنت في صفحة <b>${current.name}</b>. يمكنني فتح طلبها الآن، أو توضيح السعر والمدة.`,
          "bot"
        );
        setChips(["اطلب هذه الخدمة", "سعر تقريبي", "واتساب", "خدمة أخرى"]);
        return;
      }
      add(
        `أهلاً بك في <b>${B.fullName}</b>. اكتب احتياجك وسأقترح الخدمة المناسبة وأفتح لك طلبها مباشرة.<br>مثلاً: مشروع تخرج، بحث علمي، أو تصميم موقع.`,
        "bot"
      );
      setChips(DEFAULT_CHIPS);
    };

    const rankServices = (q) => {
      const qWords = norm(q)
        .split(" ")
        .filter((w) => w.length >= 3 && !STOP.has(w));
      return RUKN.services
        .map((s) => {
          const aliases = (RUKN.serviceAliases && RUKN.serviceAliases[s.id]) || [];
          const hay = norm([s.name, s.id, s.short, ...aliases].join(" "));
          let sc = scoreKeywords(q, [s.name, s.id, ...aliases]);
          qWords.forEach((w) => {
            if (hay.indexOf(w) !== -1) sc += 2;
          });
          return { s, sc };
        })
        .sort((a, b) => b.sc - a.sc);
    };

    const reply = (raw) => {
      const q = raw.trim();
      const nq = norm(q);
      if (!nq) return "اكتب اسم الخدمة أو احتياجك، مثل: مشروع تخرج، بحث، موقع إلكتروني.";

      if (/^(نعم|ايوه|اي|ايه|ok|okay|تمام|حسنا|حسناً|موافق)$/.test(nq) && lastService) {
        return orderReply(lastService);
      }

      const hits = rankServices(q);
      const best = hits[0] || { s: null, sc: 0 };
      const second = hits[1] || { s: null, sc: 0 };
      const strongSvc = best.sc >= 4;
      const ambiguous = strongSvc && second.sc >= 4 && best.sc - second.sc < 2 && best.s.id !== second.s.id;
      const svc = strongSvc && !ambiguous ? best.s : null;

      const intents = {
        greet: scoreKeywords(q, ["السلام عليكم", "سلام", "مرحبا", "مرحباً", "اهلا", "أهلا", "هلا", "hello", "hi", "hey", "صباح الخير", "مساء الخير"]),
        thanks: scoreKeywords(q, ["شكرا", "شكراً", "مشكور", "تسلم", "يعطيك العافيه", "thanks", "thank you"]),
        bye: scoreKeywords(q, ["باي", "مع السلامه", "الى اللقاء", "bye"]),
        contact: scoreKeywords(q, ["واتساب", "whatsapp", "رقم", "هاتف", "جوال", "تواصل", "ايميل", "بريد", "email", "اتصال", "تلفون"]),
        price: scoreKeywords(q, ["سعر", "اسعار", "تكلفه", "تكلف", "فلوس", "رسوم", "كم يكلف", "كم السعر", "price", "cost"]),
        duration: scoreKeywords(q, ["مده", "كم يوم", "كم اسبوع", "تستغرق", "متى يجهز", "موعد تسليم", "كم تاخذ"]),
        order: scoreKeywords(q, ["كيف اطلب", "طريقه الطلب", "نموذج الطلب", "كيف ابدا", "ارسل طلب", "ابي اطلب", "طلب الخدمه", "اطلب", "طلب الخدمه"]),
        help: scoreKeywords(q, ["ساعدني", "ما ادري", "وش تنصح", "اقترح علي", "ما المناسب", "وش اطلب"]),
        privacy: scoreKeywords(q, ["سري", "خصوصيه", "سريه", "امان الملفات", "بياناتي"]),
        founder: scoreKeywords(q, ["مؤسس", "ابوبكر", "ابو بكر", "حسان", "abobakr", "المهندس ابوبكر", "المهندس أبوبكر", "eng abobakr", "المشرف"]),
        about: scoreKeywords(q, ["من انتم", "عن المركز", "عن الاكاديميه", "من نحن", "وش تسوون", "ما هي اكاديمية بكر", "ما هي أكاديمية بكر", "بكر الحلول", "ما هي بكر الحلول", "عرفوني بالمركز"]),
        location: scoreKeywords(q, ["عنوان", "موقعكم", "وين انتم", "اين انتم", "مقر", "مكانكم", "location"]),
        hours: scoreKeywords(q, ["دوام", "ساعات العمل", "متى تردون", "24"]),
        services: scoreKeywords(q, ["خدماتكم", "ما هي خدمات", "كل الخدمات", "وش الخدمات", "services"]),
        specs: scoreKeywords(q, ["تخصصات", "تخصصي", "كل التخصصات"]),
        pay: scoreKeywords(q, ["دفع", "تحويل", "كيف ادفع", "payment"]),
        edit: scoreKeywords(q, ["تعديل", "تعديلات", "مراجعه بعد التسليم"]),
        remote: scoreKeywords(q, ["عن بعد", "اونلاين", "online", "حضوري"])
      };

      const websiteAsk = scoreKeywords(q, ["موقع الكتروني", "تصميم موقع", "تطوير موقع", "ويب سايت", "website"]);
      const whereAsk = scoreKeywords(q, ["موقعكم", "عنوانكم", "وين مقر", "اين المقر"]);
      if (nq === "موقع" || (nq.indexOf("موقع") !== -1 && !websiteAsk && !whereAsk && !svc && intents.location < 4)) {
        return `هل تقصد <b>تطوير موقع إلكتروني</b> أم <b>عنوان المركز</b>؟<br>${link(
          ROOT + "pages/service-details.html?id=web",
          "تطوير المواقع"
        )} · ${link(ROOT + "pages/contact.html", "التواصل والعنوان")}`;
      }

      if (intents.thanks >= 4 && best.sc < 5) return "العفو. إذا احتجت خدمة أخرى اسألني مباشرة، أو تواصل عبر واتساب.";
      if (intents.bye >= 4 && best.sc < 5) return `مع السلامة. نحن متاحون عبر ${link(B.whatsappUrl, "واتساب")} متى احتجت.`;

      const onlyGreet = intents.greet >= 4 && q.length < 28 && best.sc < 5 && intents.contact < 4 && intents.order < 4;
      if (onlyGreet) {
        return `وعليكم السلام. أهلاً بك في ${B.fullName}. ما الخدمة التي تحتاجها اليوم؟`;
      }

      if (ambiguous) {
        const opts = hits
          .filter((h) => h.sc >= 5)
          .slice(0, 3)
          .map((h) => link(ROOT + "pages/service-details.html?id=" + h.s.id, h.s.name));
        lastService = null;
        return `وجدت أكثر من خدمة قريبة من سؤالك:<br>${opts.join("<br>")} <br>اكتب اسم الخدمة المطلوبة أو ${link(
          ROOT + "pages/services.html",
          "تصفح كل الخدمات"
        )}.`;
      }

      if (intents.contact >= 4 && (!svc || intents.contact >= best.sc)) return contactReply();
      if (intents.founder >= 4) {
        const F = B.founder;
        return `${F.honorific || F.name}، ${F.title || "يشرف على الحلول التقنية"} في ${B.fullName}.<span class="ai-cta-row">${link(
          ROOT + "pages/about.html#founder",
          "من نحن",
          "ai-cta"
        )}${link(F.url, "الموقع الشخصي", "ai-cta ghost")}</span>`;
      }
      if (intents.help >= 4 && !svc) {
        return `أخبرني بما تحتاجه: مشروع تخرج، بحث، موقع، سيرة ذاتية، أو أي خدمة أخرى وسأفتح لك طلبها.<span class="ai-cta-row">${link(
          ROOT + "pages/services.html",
          "تصفح الخدمات",
          "ai-cta"
        )}${link(ROOT + "pages/request.html", "نموذج الطلب", "ai-cta ghost")}</span>`;
      }
      if (intents.about >= 4 && !svc) {
        return `${B.fullName}: ${B.about} ${link(
          ROOT + "pages/about.html",
          "اقرأ المزيد"
        )}`;
      }
      if (intents.location >= 4) {
        return `المركز في <b>${B.city}</b>، و${B.workMode}. للتواصل: ${B.phoneDisplay}. ${link(
          ROOT + "pages/contact.html",
          "صفحة التواصل"
        )}`;
      }
      if (intents.hours >= 4) return `الدعم ${B.hours} (${RUKN.stats.support}). أسرع قناة هي واتساب.`;
      if (intents.privacy >= 4) {
        return `نعم، ملفاتك ومتطلباتك تُعامل بخصوصية ولا تُعرض كأعمال عامة. ${link(
          ROOT + "pages/privacy.html",
          "سياسة الخصوصية"
        )}`;
      }
      if (intents.pay >= 4) {
        return "نتفق على التكلفة وطريقة التحويل بعد تأكيد نطاق العمل. لا يتم الدفع عبر الموقع نفسه.";
      }
      if (intents.edit >= 4) {
        return "نعم، نراجع ملاحظاتك ضمن النطاق المتفق عليه حتى يصل العمل إلى صورة مناسبة للتسليم أو المناقشة.";
      }
      if (intents.remote >= 4) {
        return `${B.workMode}. معظم الطلبات تُنجز عن بُعد عبر واتساب، مع إمكانية الحضور في تعز عند الحاجة.`;
      }
      if (intents.services >= 5 && !svc) {
        const byCat = (RUKN.serviceCategories || [])
          .map((c) => {
            const names = RUKN.services.filter((s) => s.category === c.id).map((s) => s.name);
            return names.length ? `<b>${c.name}</b>: ${names.join("، ")}` : "";
          })
          .filter(Boolean)
          .join("<br>");
        return `هذه خدماتنا:<br>${byCat}<br>${link(ROOT + "pages/services.html", "عرض صفحة الخدمات")}`;
      }
      if (intents.specs >= 4 && !svc) {
        return `نخدم تخصصات تقنية وإدارية وهندسية. إن لم يظهر تخصصك في القائمة راسلنا. ${link(
          ROOT + "pages/specializations.html",
          "عرض التخصصات"
        )}`;
      }

      if (svc && intents.price >= 4) return priceReply(svc);
      if (svc && intents.duration >= 4) {
        lastService = svc;
        return `المدة التقريبية ل«${svc.name}» هي <b>${durationOf(svc)}</b>، وتُؤكَّد بعد مراجعة المتطلبات والموعد الجامعي.<br>${svcLinks(svc)}`;
      }
      if (svc && intents.order >= 4) return orderReply(svc);
      if (intents.price >= 4 && !svc) return priceReply(null);
      if (intents.duration >= 4 && !svc) {
        return "المدة تختلف حسب نوع الطلب وحجمه. بعد مراجعة المتطلبات نحدد خطة زمنية قبل البدء.";
      }
      if (intents.order >= 4 && !svc) return orderReply(null);

      if (svc) return serviceReply(svc);

      const projects = (RUKN.projects || [])
        .map((p) => ({ p, sc: scoreKeywords(q, [p.title, p.spec, p.summary]) }))
        .sort((a, b) => b.sc - a.sc);
      if (projects[0] && projects[0].sc >= 7) {
        const p = projects[0].p;
        return `<b>${p.title}</b><br>${p.summary}<br>${link(ROOT + "pages/project-details.html?id=" + p.id, "تفاصيل المشروع")} · ${link(
          ROOT + "pages/request.html?service=" + (p.type || "tech"),
          "اطلب مشروعاً مشابهاً"
        )}`;
      }

      const faqHits = (RUKN.faqs || [])
        .map((f) => ({ f, sc: scoreKeywords(q, [f.q]) + (matchesQuery(f.a, q) ? 1 : 0) }))
        .sort((a, b) => b.sc - a.sc);
      if (faqHits[0] && faqHits[0].sc >= 5) return faqHits[0].f.a;

      if (best.sc >= 3 && best.s) {
        lastService = best.s;
        const near = hits.filter((h) => h.sc >= 3).slice(0, 3);
        if (near.length > 1) {
          return `أقرب الخدمات لطلبك:<br>${near
            .map((h) => `<b>${h.s.name}</b><br>${h.s.short}${svcLinks(h.s)}`)
            .join("")}`;
        }
        return `هل تقصد <b>${best.s.name}</b>؟<br>${best.s.short}${svcLinks(best.s)}`;
      }
      return `لم أتضح الطلب بعد. اختر خياراً سريعاً بالأسفل، أو تصفّح الخدمات، أو راسلنا على واتساب.<span class="ai-cta-row">${link(
        ROOT + "pages/services.html",
        "تصفح الخدمات",
        "ai-cta"
      )}${link(B.whatsappUrl, "واتساب", "ai-cta ghost")}</span>`;
    };

    const ask = (q) => {
      if (!q.trim() || busy) return;
      busy = true;
      add(q, "user");
      const typing = document.createElement("div");
      typing.className = "ai-bubble bot ai-typing";
      typing.setAttribute("aria-label", "يكتب الآن");
      typing.innerHTML = "<span></span><span></span><span></span>";
      msgs.appendChild(typing);
      msgs.scrollTop = msgs.scrollHeight;
      const wait = 420 + Math.min(700, q.length * 12);
      setTimeout(() => {
        typing.remove();
        add(reply(q), "bot");
        if (lastService) setChips(["اطلب هذه الخدمة", "واتساب", "سعر تقريبي", "خدمة أخرى"]);
        else setChips(DEFAULT_CHIPS);
        busy = false;
      }, wait);
    };

    const open = () => {
      hideWelcome();
      panel.hidden = false;
      fab.classList.add("open");
      fab.setAttribute("aria-expanded", "true");
      requestAnimationFrame(() => panel.classList.add("is-open"));
      if (!msgs.children.length) welcome();
      input.focus();
    };
    const close = () => {
      panel.classList.remove("is-open");
      fab.classList.remove("open");
      fab.setAttribute("aria-expanded", "false");
      window.setTimeout(() => {
        if (!fab.classList.contains("open")) panel.hidden = true;
      }, 240);
      fab.focus();
    };

    const hideWelcome = () => {
      if (!welcomeNotice) return;
      welcomeNotice.classList.remove("is-ready");
      welcomeNotice.classList.add("is-hidden");
      sessionStorage.setItem("rukn-ai-welcome-closed", "1");
    };

    setChips(DEFAULT_CHIPS);
    fab.setAttribute("aria-expanded", "false");
    if (welcomeNotice && sessionStorage.getItem("rukn-ai-welcome-closed") === "1") {
      welcomeNotice.classList.add("is-hidden");
    }
    const welcomeClose = $("#aiWelcomeClose");
    const welcomeAction = $("#aiWelcomeAction");
    if (welcomeClose) welcomeClose.addEventListener("click", (e) => {
      e.stopPropagation();
      hideWelcome();
    });
    if (welcomeAction) {
      welcomeAction.addEventListener("click", (e) => {
        e.stopPropagation();
        hideWelcome();
        open();
      });
    }
    if (welcomeNotice) {
      welcomeNotice.addEventListener("click", () => {
        hideWelcome();
        open();
      });
    }
    if (welcomeNotice && !welcomeNotice.classList.contains("is-hidden")) {
      welcomeNotice.classList.add("is-ready");
    }
    fab.addEventListener("click", () => (panel.hidden ? open() : close()));
    $("#aiClose").addEventListener("click", close);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value;
      input.value = "";
      ask(q);
    });
    quick.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const label = b.textContent.trim();
      if ((label === "اطلب هذه الخدمة" || label === "كيف أطلب؟") && lastService) {
        location.href = ROOT + "pages/request.html?service=" + lastService.id;
        return;
      }
      if (label === "كيف أطلب؟") {
        ask("كيف أطلب خدمة");
        return;
      }
      if (label === "واتساب") {
        window.open(waFor(lastService), "_blank", "noopener");
        return;
      }
      if (label === "سعر تقريبي" && lastService) {
        ask("كم سعر " + lastService.name);
        return;
      }
      if (label === "خدمة أخرى") {
        lastService = null;
        setChips(DEFAULT_CHIPS);
        add("حسناً، اختر مجالاً أو اكتب طلبك.", "bot");
        return;
      }
      ask(label);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) close();
    });
    if (location.hash === "#ai" || new URLSearchParams(location.search).has("ask")) {
      const preset = new URLSearchParams(location.search).get("ask");
      setTimeout(() => {
        open();
        if (preset) ask(preset);
      }, 80);
    }
  }

  function animateCounters() {
    $all("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      let started = false;
      const run = () => {
        if (started) return;
        started = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / 1200);
          el.textContent = prefix + Math.floor(target * p) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) run();
      });
      io.observe(el);
    });
  }

  function homeStats() {
    const box = $("#homeStats");
    if (!box) return;
    const s = RUKN.stats;
    const specCount = (RUKN.specializations && RUKN.specializations.length) || s.specializations;
    box.innerHTML = `
      <div class="stat"><b data-count="${s.students}" data-prefix="+">+${s.students}</b> طالب</div>
      <div class="stat"><b data-count="${s.projects}" data-prefix="+">+${s.projects}</b> مشروع وبحث</div>
      <div class="stat"><b data-count="${specCount}" data-prefix="+">+${specCount}</b> تخصص</div>
      <div class="stat"><b>${s.support}</b> دعم</div>`;
  }

  function serviceCard(s) {
    return `
      <article class="card">
        <div class="icon-wrap"><i class="fa-solid ${s.icon}"></i></div>
        <h3>${s.name}</h3>
        <p>${s.short}</p>
        <div class="card-actions">
          <a class="btn btn-primary" href="${ROOT}pages/request.html?service=${s.id}">طلب الخدمة</a>
          <button class="btn btn-ghost" type="button" data-service="${s.id}">التفاصيل</button>
        </div>
      </article>`;
  }

  function ensureServiceModal() {
    if ($("#serviceModal")) return;
    const wrap = document.createElement("div");
    wrap.id = "serviceModal";
    wrap.className = "svc-modal";
    wrap.hidden = true;
    wrap.innerHTML = `
      <div class="svc-modal-box" role="dialog" aria-modal="true" aria-labelledby="svcModalTitle">
        <button class="icon-btn svc-modal-close" type="button" data-close aria-label="إغلاق">×</button>
        <div id="svcModalBody"></div>
      </div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap || e.target.closest("[data-close]")) closeServiceModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeServiceModal();
    });
  }

  function closeServiceModal() {
    const wrap = $("#serviceModal");
    if (!wrap) return;
    wrap.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function openServiceModal(id) {
    const s = RUKN.services.find((x) => x.id === id);
    if (!s) return;
    ensureServiceModal();
    const cat = (RUKN.serviceCategories || []).find((c) => c.id === s.category);
    $("#svcModalBody").innerHTML = `
      <div class="icon-wrap"><i class="fa-solid ${s.icon}"></i></div>
      ${cat ? `<span class="tag">${cat.name}</span>` : ""}
      <h2 id="svcModalTitle">${s.name}</h2>
      <p class="lead">${s.details}</p>
      <h3>ماذا يشمل العمل؟</h3>
      <ul class="check-list">${s.includes.map((i) => `<li>${i}</li>`).join("")}</ul>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${ROOT}pages/request.html?service=${s.id}">طلب الخدمة</a>
        <a class="btn btn-ghost" href="${ROOT}pages/service-details.html?id=${s.id}">صفحة التفاصيل</a>
      </div>`;
    $("#serviceModal").hidden = false;
    document.body.classList.add("modal-open");
    const closeBtn = $(".svc-modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function initServices() {
    const grid = $("#servicesGrid") || $("#servicesPageGrid");
    const filters = $("#serviceFilters");
    if (!grid) return;
    ensureServiceModal();
    const cats = RUKN.serviceCategories || [];
    let current = "all";
    if (filters) {
      filters.innerHTML =
        `<button class="chip active" type="button" data-cat="all">الكل</button>` +
        cats.map((c) => `<button class="chip" type="button" data-cat="${c.id}">${c.name}</button>`).join("");
    }
    const draw = () => {
      const asSlide = grid.classList.contains("carousel-track");
      const list = current === "all" ? RUKN.services : RUKN.services.filter((s) => s.category === current);
      if (asSlide) {
        grid.innerHTML = list.length ? list.map(serviceCard).join("") : "<p>لا توجد خدمات في هذا التصنيف.</p>";
        bindCarousel(grid.closest("[data-carousel]"));
        return;
      }
      if (current === "all") {
        grid.innerHTML = cats
          .map((c) => {
            const items = RUKN.services.filter((s) => s.category === c.id);
            if (!items.length) return "";
            return `<details class="fold page-fold svc-group"${c.id === cats[0].id ? " open" : ""}>
              <summary><h3><i class="fa-solid ${c.id === "academic" ? "fa-graduation-cap" : c.id === "dev" ? "fa-code" : c.id === "technical" ? "fa-microchip" : "fa-briefcase"}"></i> ${c.name}</h3><small>${items.length} خدمة</small></summary>
              <div class="cards-4 fold-body">${items.map(serviceCard).join("")}</div>
            </details>`;
          })
          .join("");
      } else {
        grid.innerHTML = list.length
          ? `<div class="cards-4">${list.map(serviceCard).join("")}</div>`
          : "<p>لا توجد خدمات في هذا التصنيف.</p>";
      }
    };
    if (filters) {
      filters.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-cat]");
        if (!btn) return;
        $all("[data-cat]", filters).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        current = btn.dataset.cat;
        draw();
      });
    }
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-service]");
      if (btn) openServiceModal(btn.dataset.service);
    });
    draw();
  }

  function finder() {
    const chips = $("#finderChips");
    const result = $("#finderResult");
    if (!chips) return;
    chips.innerHTML = RUKN.finder
      .map((f) => `<button type="button" class="chip" data-id="${f.id}">${f.label}</button>`)
      .join("");
    chips.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      $all(".chip", chips).forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      const item = RUKN.finder.find((f) => f.id === btn.dataset.id);
      result.classList.add("show");
      result.innerHTML = `
        <small>الخدمة المناسبة لك</small>
        <h3>${item.result}</h3>
        <p>${item.text}</p>
        <a class="btn btn-primary" href="${ROOT}pages/request.html?service=${item.id}">ابدأ طلبك</a>
      `;
    });
  }

  function specsHome() {
    const box = $("#homeSpecs");
    if (!box) return;
    box.innerHTML = RUKN.specializations
      .slice(0, 12)
      .map((s) => `<div class="spec-pill">${s.name}</div>`)
      .join("");
  }

  function howSteps() {
    const box = $("#howSteps");
    if (!box) return;
    const slide = box.classList.contains("carousel-track");
    box.innerHTML = RUKN.steps
      .map((s) =>
        slide
          ? `<article class="card step-slide"><b>${s.n}</b><h3>${s.t}</h3><p>${s.d}</p></article>`
          : `<div class="step"><b>${s.n}</b><div><h3>${s.t}</h3><p>${s.d}</p></div></div>`
      )
      .join("");
  }

  function whyGrid() {
    const box = $("#whyGrid");
    if (!box) return;
    box.innerHTML = RUKN.why
      .map(
        (w) =>
          `<article class="card"><div class="icon-wrap"><i class="fa-solid ${w.icon}"></i></div><h3>${w.t}</h3><p>${w.d}</p></article>`
      )
      .join("");
  }

  function specsPage() {
    const grid = $("#specGrid");
    const search = $("#specSearch");
    const filter = $("#specFilter");
    if (!grid) return;
    const groups = [...new Set(RUKN.specializations.map((s) => s.group))];
    filter.innerHTML = `<option value="">كل المجالات</option>` + groups.map((g) => `<option>${g}</option>`).join("");
    const draw = () => {
      const q = (search.value || "").trim();
      const g = filter.value;
      const list = RUKN.specializations.filter((s) => (!g || s.group === g) && matchesQuery(s.name + " " + s.group, q));
      const grouped = [];
      const map = new Map();
      list.forEach((s) => {
        if (!map.has(s.group)) {
          map.set(s.group, []);
          grouped.push(s.group);
        }
        map.get(s.group).push(s);
      });
      const openAll = !!q || !!g;
      grid.innerHTML = grouped.length
        ? grouped
            .map((groupName, idx) => {
              const items = map.get(groupName);
              return `<details class="fold page-fold spec-group"${openAll || idx === 0 ? " open" : ""}>
                <summary><h3>${groupName}</h3><small>${items.length} تخصص</small></summary>
                <div class="spec-grid fold-body">${items
                  .map(
                    (s) =>
                      `<a class="spec-pill" href="${ROOT}pages/request.html?spec=${encodeURIComponent(s.name)}">${s.name}</a>`
                  )
                  .join("")}</div>
              </details>`;
            })
            .join("")
        : `<p>لا توجد تخصصات مطابقة لبحثك.</p>`;
    };
    search.addEventListener("input", draw);
    filter.addEventListener("change", draw);
    draw();
  }

  function projectImages(p) {
    if (Array.isArray(p.images) && p.images.length) return p.images;
    if (p.image) return [p.image];
    return [];
  }

  function projectImageSrc(image) {
    if (!image) return "";
    const path = String(image).replace(/^assets\/images\//, "");
    return ROOT + "assets/images/" + encodeURI(path);
  }

  function projectCoverHtml(p, tall) {
    const image = projectImages(p)[0];
    const extra = tall ? " project-cover-detail" : "";
    const icon = p.icon || "fa-layer-group";
    const bg = p.cover || COVERS[p.type] || COVERS.tech;
    if (image) {
      return `<div class="project-cover has-img${extra}" data-icon="${icon}" data-cover="${bg}"><img src="${projectImageSrc(image)}" alt="${escapeHtml(p.title)}" width="640" height="360" loading="${tall ? "eager" : "lazy"}"></div>`;
    }
    return `<div class="project-cover art${extra}" style="background:${bg}"><i class="fa-solid ${icon}"></i></div>`;
  }

  function projectCard(p) {
    return `
      <article class="card">
        ${projectCoverHtml(p)}
        <div class="meta"><span class="tag">${p.spec}</span><span class="tag">${p.typeLabel}</span></div>
        <h3>${p.title}</h3>
        <p>${p.summary}</p>
        <a class="btn btn-ghost" href="${ROOT}pages/project-details.html?id=${p.id}">التفاصيل</a>
      </article>`;
  }

  function projects(target, limit) {
    const box = $(target);
    if (!box) return;
    const search = $("#projectSearch");
    const draw = (type) => {
      const q = (search && search.value.trim()) || "";
      const list = RUKN.projects
        .filter((p) => !type || type === "all" || p.type === type)
        .filter((p) => !q || matchesQuery(p.title + " " + p.spec + " " + p.summary, q))
        .slice(0, limit || 99);
      box.innerHTML = list.length ? list.map(projectCard).join("") : "<p>لا توجد أعمال مطابقة.</p>";
    };
    const filters = $("#projectFilters");
    let current = box.dataset.filter || "all";
    if (filters) {
      filters.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-type]");
        if (!btn) return;
        $all("[data-type]", filters).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        current = btn.dataset.type;
        draw(current);
      });
    }
    if (search) search.addEventListener("input", () => draw(current));
    draw(current);
  }

  function testimonials() {
    const box = $("#testimonials");
    if (!box) return;
    const g = B.googleReviews || {};
    const gUrl = g.searchUrl || g.mapsUrl || "#";
    box.innerHTML = `
      <div class="reviews-grid">
        ${RUKN.testimonials
          .map(
            (t) => `
          <article class="review-card">
            <header class="review-head">
              <span class="review-avatar" aria-hidden="true">${escapeHtml(t.name.charAt(0))}</span>
              <div>
                <b>${escapeHtml(t.name)}</b>
                <small>${escapeHtml(t.role)}</small>
              </div>
              <i class="fa-brands fa-google review-g" aria-hidden="true"></i>
            </header>
            <div class="stars" aria-label="تقييم خمس نجوم">★★★★★</div>
            <p>«${escapeHtml(t.text)}»</p>
            <span class="review-source">تقييم على جوجل</span>
          </article>`
          )
          .join("")}
      </div>
      <p class="center-link reviews-cta">
        <a class="btn btn-primary" href="${gUrl}" target="_blank" rel="noopener"><i class="fa-brands fa-google"></i> عرض كل التقييمات على جوجل</a>
      </p>`;
  }

  function faqs() {
    const box = $("#faqList");
    if (!box) return;
    const search = $("#faqSearch");
    const draw = () => {
      const q = (search && search.value.trim()) || "";
      const source = search ? RUKN.faqs : RUKN.faqs.slice(0, 5);
      const list = source.filter((f) => !q || matchesQuery(f.q + " " + f.a, q));
      box.innerHTML = list.length
        ? list.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("")
        : "<p>لا توجد أسئلة مطابقة.</p>";
    };
    if (search) search.addEventListener("input", draw);
    draw();
  }

  function serviceDetails() {
    const box = $("#serviceDetails");
    if (!box) return;
    const id = new URLSearchParams(location.search).get("id") || "graduation";
    const s = RUKN.services.find((x) => x.id === id) || RUKN.services[0];
    const related = RUKN.services.filter((x) => x.id !== s.id && x.category === s.category).slice(0, 3);
    const relatedWork = RUKN.projects.filter((p) => p.type === s.id).slice(0, 2);
    const si = RUKN.services.findIndex((x) => x.id === s.id);
    const prevS = RUKN.services[(si - 1 + RUKN.services.length) % RUKN.services.length];
    const nextS = RUKN.services[(si + 1) % RUKN.services.length];
    document.title = `${s.name} | ${B.fullName}`;
    box.innerHTML = `
      <div class="page-hero" style="padding-top:0">
        <div class="icon-wrap"><i class="fa-solid ${s.icon}"></i></div>
        <span class="tag">${(RUKN.serviceCategories || []).find((c) => c.id === s.category)?.name || ""}</span>
        <h1>${s.name}</h1>
        <p class="lead">${s.details}</p>
      </div>
      <h2>ماذا يشمل العمل؟</h2>
      <ul class="check-list">${s.includes.map((i) => `<li>${i}</li>`).join("")}</ul>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${ROOT}pages/request.html?service=${s.id}">طلب الخدمة</a>
        <a class="btn btn-ghost" href="${waTextUrl("السلام عليكم، أرغب بطلب خدمة: " + s.name)}" target="_blank" rel="noopener">واتساب</a>
      </div>
      <div class="item-pager">
        <a class="btn btn-ghost" href="${ROOT}pages/service-details.html?id=${prevS.id}">‹ ${prevS.name}</a>
        <a class="btn btn-ghost" href="${ROOT}pages/services.html">كل الخدمات</a>
        <a class="btn btn-ghost" href="${ROOT}pages/service-details.html?id=${nextS.id}">${nextS.name} ›</a>
      </div>
      ${
        relatedWork.length
          ? `<h2>نماذج مرتبطة</h2><div class="cards-2">${relatedWork.map(projectCard).join("")}</div>`
          : ""
      }
      ${
        related.length
          ? `<h2>خدمات قريبة</h2>
      <div class="cards-3">${related
        .map(
          (x) =>
            `<article class="card"><h3>${x.name}</h3><p>${x.short}</p><div class="card-actions"><a class="btn btn-primary" href="${ROOT}pages/request.html?service=${x.id}">طلب الخدمة</a><a class="btn btn-ghost" href="${ROOT}pages/service-details.html?id=${x.id}">التفاصيل</a></div></article>`
        )
        .join("")}</div>`
          : ""
      }
    `;
  }

  function itemPagerHtml(p) {
    const list = RUKN.projects;
    const i = list.findIndex((x) => x.id === p.id);
    if (i < 0) return "";
    const prev = list[(i - 1 + list.length) % list.length];
    const next = list[(i + 1) % list.length];
    return `<div class="item-pager">
      <a class="btn btn-ghost" href="${ROOT}pages/project-details.html?id=${prev.id}">‹ ${prev.title}</a>
      <a class="btn btn-ghost" href="${ROOT}pages/projects.html">كل الأعمال</a>
      <a class="btn btn-ghost" href="${ROOT}pages/project-details.html?id=${next.id}">${next.title} ›</a>
    </div>`;
  }

  function projectDetails() {
    const box = $("#projectDetails");
    if (!box) return;
    const id = new URLSearchParams(location.search).get("id") || "p1";
    const p = RUKN.projects.find((x) => x.id === id) || RUKN.projects[0];
    document.title = `${p.title} | ${B.fullName}`;
    const images = projectImages(p);
    box.innerHTML = `
      ${projectCoverHtml(p, true)}
      ${images.length > 1 ? `<div class="project-gallery" aria-label="صور المشروع">${images.slice(1).map((image, index) => `<img src="${projectImageSrc(image)}" alt="${escapeHtml(p.title)} - صورة ${index + 2}" loading="lazy">`).join("")}</div>` : ""}
      <h1>${p.title}</h1>
      <div class="meta"><span class="tag">${p.spec}</span><span class="tag">${p.typeLabel}</span><span class="tag">${p.year}</span></div>
      <p>${p.summary}</p>
      <p>${p.details}</p>
      <a class="btn btn-primary" href="${ROOT}pages/request.html?service=${p.type || "tech"}">اطلب مشروعاً مشابهاً</a>
      ${itemPagerHtml(p)}
    `;
  }

  function founderBlock() {
    const F = B.founder;
    if (!F) return;
    $all("[data-founder]").forEach((box) => {
      box.innerHTML = `
        <div class="founder-layout">
          <div>
            <span class="tag">مهندس برمجيات</span>
            <h3>${F.honorific || F.name}</h3>
            <p class="muted-line">${F.title}</p>
            <p>${F.bio}</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="${F.url}" target="_blank" rel="noopener">الموقع الشخصي</a>
              <a class="btn btn-ghost" href="${F.youtube}" target="_blank" rel="noopener"><i class="fa-brands fa-youtube"></i> شاهد الكلمة</a>
              ${
                pageFile() === "about.html"
                  ? `<a class="btn btn-ghost" href="${ROOT}pages/request.html">اطلب خدمتك</a>`
                  : `<a class="btn btn-ghost" href="${ROOT}pages/about.html#founder">من نحن</a>`
              }
            </div>
            ${
              F.youtubeId
                ? `<div class="video-frame"><iframe src="https://www.youtube.com/embed/${F.youtubeId}" title="${escapeHtml(F.videoTitle)}" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`
                : ""
            }
          </div>
        </div>`;
    });
  }

  function fillContactCards() {
    const phone = $("#contactPhone");
    if (phone) phone.innerHTML = `<a href="tel:${B.phoneTel}">${B.phoneDisplay}</a>`;
    const wa = $("#contactWaCard");
    if (wa) wa.innerHTML = `<a href="${B.whatsappUrl}" target="_blank" rel="noopener">${B.phoneDisplay}</a>`;
    const mail = $("#contactMail");
    if (mail) mail.innerHTML = `<a href="mailto:${B.email}">${B.email}</a>`;
    const cta = $("#ctaWhatsapp");
    if (cta && cta.dataset.wa) cta.href = B.whatsappUrl;
  }

  function requestForm() {
    const form = $("#requestForm");
    if (!form) return;
    const serviceSel = form.querySelector('[name="service"]');
    const specInput = form.querySelector('[name="spec"]');
    const params = new URLSearchParams(location.search);
    serviceSel.innerHTML =
      `<option value="">اختر الخدمة</option>` +
      RUKN.services.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
    const KEY = "rukn-request-draft";
    const saved = localStorage.getItem(KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach((k) => {
          if (form[k] && data[k]) form[k].value = data[k];
        });
      } catch (e) {}
    }
    const preset = params.get("service");
    if (preset && RUKN.services.some((s) => s.id === preset)) serviceSel.value = preset;
    if (params.get("spec")) specInput.value = params.get("spec");
    form.addEventListener("input", () => {
      const draft = {};
      $all("input, select, textarea", form).forEach((f) => {
        if (f.name) draft[f.name] = f.value;
      });
      localStorage.setItem(KEY, JSON.stringify(draft));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $all("[required]", form).forEach((field) => {
        const err = field.parentElement.querySelector(".error");
        if (!field.value.trim()) {
          ok = false;
          if (err) err.style.display = "block";
        } else if (err) err.style.display = "none";
      });
      const phone = form.phone.value.trim();
      const phoneErr = form.phone.parentElement.querySelector(".error");
      if (!/^[\d+\s]{8,}$/.test(phone)) {
        ok = false;
        if (phoneErr) phoneErr.style.display = "block";
      }
      if (!ok) return;
      const svc = RUKN.services.find((s) => s.id === form.service.value);
      const msg = `السلام عليكم،
أرغب في طلب خدمة من بكر الحلول الرقمية.
الاسم: ${form.fullname.value}
الجامعة: ${form.university.value}
التخصص: ${form.spec.value}
الخدمة: ${svc ? svc.name : form.service.value}
تفاصيل الطلب: ${form.details.value}
الموعد: ${form.deadline.value || "غير محدد"}
الهاتف: ${form.phone.value}
ملاحظات: ${form.notes.value || "لا يوجد"}`;
      $("#successBox").style.display = "block";
      $("#waSend").href = waTextUrl(msg);
      localStorage.removeItem(KEY);
      form.reset();
    });
  }

  function contactForm() {
    const form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $all("[required]", form).forEach((field) => {
        const err = field.parentElement.querySelector(".error");
        if (!field.value.trim()) {
          ok = false;
          if (err) err.style.display = "block";
        } else if (err) err.style.display = "none";
      });
      const phone = form.phone.value.trim();
      const phoneErr = form.phone.parentElement.querySelector(".error");
      if (phone && !/^[\d+\s]{8,}$/.test(phone)) {
        ok = false;
        if (phoneErr) phoneErr.style.display = "block";
      }
      if (!ok) return;
      const msg = `السلام عليكم، رسالة من موقع بكر الحلول الرقمية
الاسم: ${form.fullname.value}
الهاتف: ${form.phone.value}
الرسالة: ${form.message.value}`;
      $("#contactSuccess").style.display = "block";
      $("#contactWa").href = waTextUrl(msg);
    });
  }

  function bindImageFallbacks() {
    document.addEventListener(
      "error",
      (e) => {
        const img = e.target;
        if (!(img instanceof HTMLImageElement)) return;
        const cover = img.closest(".project-cover");
        if (cover && cover.classList.contains("has-img")) {
          const icon = cover.getAttribute("data-icon") || "fa-layer-group";
          const bg = cover.getAttribute("data-cover") || COVERS.tech;
          cover.classList.remove("has-img");
          cover.classList.add("art");
          cover.style.background = bg;
          cover.innerHTML = `<i class="fa-solid ${icon}"></i>`;
          return;
        }
        if (img.classList.contains("founder-photo")) {
          img.replaceWith(Object.assign(document.createElement("div"), { className: "icon-wrap", innerHTML: '<i class="fa-solid fa-user-tie"></i>' }));
          return;
        }
        if (img.closest(".project-gallery")) img.remove();
      },
      true
    );
  }

  function seoHead() {
    const origin = location.origin + ROOT;
    const image = new URL(ROOT + "assets/images/og-cover.png", location.origin).href;
    const page = location.href.split("#")[0];
    const ensure = (sel, make) => {
      let el = document.head.querySelector(sel);
      if (!el) {
        el = make();
        document.head.appendChild(el);
      }
      return el;
    };
    const canonical = ensure('link[rel="canonical"]', () => {
      const l = document.createElement("link");
      l.rel = "canonical";
      return l;
    });
    canonical.href = page.split("?")[0];
    const ogUrl = ensure('meta[property="og:url"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:url");
      return m;
    });
    ogUrl.setAttribute("content", page);
    const ogImg = ensure('meta[property="og:image"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:image");
      return m;
    });
    ogImg.setAttribute("content", image);
    const siteName = ensure('meta[property="og:site_name"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:site_name");
      return m;
    });
    siteName.setAttribute("content", B.fullName);
    const ogTitle = document.head.querySelector('meta[property="og:title"]');
    if (ogTitle && !ogTitle.getAttribute("content")) ogTitle.setAttribute("content", document.title);
    const ogType = ensure('meta[property="og:type"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:type");
      m.setAttribute("content", "website");
      return m;
    });
    ogType.setAttribute("content", "website");
    const ogImgAlt = ensure('meta[property="og:image:alt"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:image:alt");
      return m;
    });
    ogImgAlt.setAttribute("content", B.fullName);
    const twImg = ensure('meta[name="twitter:image"]', () => {
      const m = document.createElement("meta");
      m.name = "twitter:image";
      return m;
    });
    twImg.setAttribute("content", image);
    const twTitle = ensure('meta[name="twitter:title"]', () => {
      const m = document.createElement("meta");
      m.name = "twitter:title";
      return m;
    });
    twTitle.setAttribute("content", document.title);
    const themeMeta = ensure('meta[name="theme-color"]', () => {
      const m = document.createElement("meta");
      m.name = "theme-color";
      return m;
    });
    const dark = document.documentElement.getAttribute("data-theme") !== "light";
    themeMeta.setAttribute("content", dark ? "#0a1413" : "#0c6b64");
    ensure('meta[name="twitter:card"]', () => {
      const m = document.createElement("meta");
      m.name = "twitter:card";
      m.content = "summary_large_image";
      return m;
    }).setAttribute("content", "summary_large_image");
    ensure('link[rel="manifest"]', () => {
      const l = document.createElement("link");
      l.rel = "manifest";
      l.href = ROOT + "site.webmanifest";
      return l;
    });
    ensure('link[rel="apple-touch-icon"]', () => {
      const l = document.createElement("link");
      l.rel = "apple-touch-icon";
      l.sizes = "180x180";
      l.href = ROOT + "assets/images/apple-touch-icon.png";
      return l;
    }).setAttribute("href", ROOT + "assets/images/apple-touch-icon.png");
    ensure('link[rel="icon"][type="image/png"][sizes="32x32"]', () => {
      const l = document.createElement("link");
      l.rel = "icon";
      l.type = "image/png";
      l.sizes = "32x32";
      l.href = ROOT + "assets/images/favicon-32.png";
      return l;
    });
    ensure('link[rel="icon"][type="image/png"][sizes="192x192"]', () => {
      const l = document.createElement("link");
      l.rel = "icon";
      l.type = "image/png";
      l.sizes = "192x192";
      l.href = ROOT + "assets/images/favicon-192.png";
      return l;
    });
    if (!document.getElementById("ruknJsonLd")) {
      const script = document.createElement("script");
      script.id = "ruknJsonLd";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": ["ProfessionalService", "Organization"],
            "@id": origin + "#org",
            name: B.fullName,
            alternateName: ["بكر الحلول", "Bakr Digital Solutions"],
            description: B.description,
            telephone: B.phoneTel,
            email: B.email,
            url: B.siteUrl || origin,
            image,
            areaServed: ["YE", "تعز"],
            address: {
              "@type": "PostalAddress",
              addressLocality: "تعز",
              addressCountry: "YE"
            },
            founder: { "@id": origin + "#founder" },
            sameAs: [B.founder.url, B.founder.youtubeChannel, B.founder.linkedin].filter(Boolean)
          },
          {
            "@type": "Person",
            "@id": origin + "#founder",
            name: B.founder.name,
            alternateName: B.founder.aliases || [],
            honorificPrefix: "المهندس",
            jobTitle: B.founder.role,
            description: B.founder.bio,
            url: B.founder.url,
            image: new URL(ROOT + "assets/images/Abobakr_Hassan.png", location.origin).href,
            worksFor: { "@id": origin + "#org" },
            sameAs: [B.founder.url, B.founder.youtubeChannel, B.founder.linkedin].filter(Boolean)
          },
          {
            "@type": "WebSite",
            "@id": origin + "#website",
            name: B.fullName,
            url: B.siteUrl || origin,
            inLanguage: "ar",
            publisher: { "@id": origin + "#org" }
          }
        ]
      });
      document.head.appendChild(script);
    }
  }

  function motion() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = $all(".card, .stat, .trust-item, .step, .spec-pill, .section-head, .form, .cta, .finder, .quote").filter(
      (el) => !el.closest("details.fold")
    );
    if (reduce) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    targets.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" }
    );
    targets.forEach((el) => io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindImageFallbacks();
    renderChrome();
    seoHead();
    crumbs();
    pageSwitch();
    bindFolds();
    theme();
    headerScroll();
    mobileMenu();
    siteSearch();
    heroSlider();
    marquee();
    assistant();
    founderBlock();
    homeStats();
    animateCounters();
    initServices();
    finder();
    specsHome();
    howSteps();
    whyGrid();
    specsPage();
    projects("#homeProjects", 6);
    projects("#projectsGrid");
    testimonials();
    faqs();
    serviceDetails();
    projectDetails();
    fillContactCards();
    requestForm();
    contactForm();
    bindCarousels();
    motion();
  });
})();
