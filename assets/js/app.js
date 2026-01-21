(function () {
    // Smooth scroll for in-page quick links
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
  
      const id = link.getAttribute("href");
      const el = document.querySelector(id);
      if (!el) return;
  
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  
    // === CHECKLISTS: persistence + progress (X of Y) ===
    const checklistForms = document.querySelectorAll("form.checklist[data-checklist-id]");
    checklistForms.forEach((form) => {
      const listId = form.getAttribute("data-checklist-id");
      const storageKey = `poc-checklist:${listId}`;
      const checkboxes = Array.from(form.querySelectorAll('input[type="checkbox"][data-step]'));
  
      // Inject progress UI (top of form)
      const progressEl = document.createElement("div");
      progressEl.className = "checklist__progress";
      progressEl.setAttribute("role", "status");
      progressEl.setAttribute("aria-live", "polite");
      form.insertBefore(progressEl, form.firstChild);
  
      // Load saved state
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
        checkboxes.forEach((cb) => {
          const step = cb.getAttribute("data-step");
          cb.checked = !!saved[step];
        });
      } catch {
        // ignore malformed storage
      }
  
      renderProgress();
  
      // Save on change + update progress
      form.addEventListener("change", (e) => {
        const cb = e.target.closest('input[type="checkbox"][data-step]');
        if (!cb) return;
  
        const step = cb.getAttribute("data-step");
        const saved = safeRead(storageKey);
        saved[step] = cb.checked;
        localStorage.setItem(storageKey, JSON.stringify(saved));
  
        renderProgress();
      });
  
      // Reset button
      const resetBtn = form.querySelector("[data-reset-checklist]");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          checkboxes.forEach((cb) => (cb.checked = false));
          localStorage.setItem(storageKey, JSON.stringify({}));
          renderProgress();
        });
      }
  
      function renderProgress() {
        const total = checkboxes.length;
        const done = checkboxes.filter((cb) => cb.checked).length;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);
        progressEl.textContent = `${done} of ${total} completed (${pct}%)`;
      }
    });
  
    function safeRead(key) {
      try {
        return JSON.parse(localStorage.getItem(key) || "{}") || {};
      } catch {
        return {};
      }
    }
  
    // === COPY TO CLIPBOARD FOR CODE ===
    // Adds a copy button beside <code> snippets and to <pre><code> blocks.
    initCopyButtons();
  
    function initCopyButtons() {
      // 1) <pre><code> blocks (if you add them later)
      const preCodes = document.querySelectorAll("pre > code");
      preCodes.forEach((codeEl) => {
        const pre = codeEl.parentElement;
        if (!pre || pre.dataset.copyEnhanced === "1") return;
        pre.dataset.copyEnhanced = "1";
  
        const wrapper = document.createElement("div");
        wrapper.className = "codeblock";
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
  
        const btn = makeCopyButton(() => codeEl.innerText);
        btn.classList.add("copy-btn--block");
        wrapper.appendChild(btn);
      });
  
      // 2) standalone <code> (your page has many of these)
      const codes = document.querySelectorAll("code");
      codes.forEach((codeEl) => {
        if (codeEl.closest("pre")) return; // already handled above
        if (codeEl.dataset.copyEnhanced === "1") return;
  
        codeEl.dataset.copyEnhanced = "1";
  
        const wrap = document.createElement("span");
        wrap.className = "codewrap";
  
        codeEl.parentNode.insertBefore(wrap, codeEl);
        wrap.appendChild(codeEl);
  
        const btn = makeCopyButton(() => codeEl.innerText);
        wrap.appendChild(btn);
      });
    }
  
    function makeCopyButton(getText) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "copy-btn";
        btn.setAttribute("aria-label", "Copy code to clipboard");
        btn.innerHTML = copyIcon(); // icon only by default
      
        btn.addEventListener("click", async () => {
          const text = (getText() || "").trim();
          if (!text) return;
      
          btn.disabled = true;
          const originalHTML = btn.innerHTML;
      
          try {
            await navigator.clipboard.writeText(text);
            btn.textContent = "Copied";
          } catch {
            try {
              const ta = document.createElement("textarea");
              ta.value = text;
              ta.style.position = "fixed";
              ta.style.left = "-9999px";
              document.body.appendChild(ta);
              ta.select();
              document.execCommand("copy");
              document.body.removeChild(ta);
              btn.textContent = "Copied";
            } catch {
              btn.textContent = "Failed";
            }
          } finally {
            setTimeout(() => {
              btn.innerHTML = originalHTML;
              btn.disabled = false;
            }, 900);
          }
        });
      
        return btn;
      }
      
      function copyIcon() {
        return `
          <svg xmlns="http://www.w3.org/2000/svg"
               width="14" height="14" viewBox="0 0 24 24"
               fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4
                     a2 2 0 0 1 2-2h9
                     a2 2 0 0 1 2 2v1"></path>
          </svg>
        `;
      }
      
  })();
  