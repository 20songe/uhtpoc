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
  
    // Checklist persistence for any form with data-checklist-id
    const checklistForms = document.querySelectorAll("form.checklist[data-checklist-id]");
    checklistForms.forEach((form) => {
      const listId = form.getAttribute("data-checklist-id");
      const storageKey = `poc-checklist:${listId}`;
  
      const checkboxes = Array.from(form.querySelectorAll('input[type="checkbox"][data-step]'));
  
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
  
      // Save on change
      form.addEventListener("change", (e) => {
        const cb = e.target.closest('input[type="checkbox"][data-step]');
        if (!cb) return;
  
        const step = cb.getAttribute("data-step");
        const saved = safeRead(storageKey);
        saved[step] = cb.checked;
        localStorage.setItem(storageKey, JSON.stringify(saved));
      });
  
      // Reset button
      const resetBtn = form.querySelector("[data-reset-checklist]");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          checkboxes.forEach((cb) => (cb.checked = false));
          localStorage.setItem(storageKey, JSON.stringify({}));
        });
      }
    });
  
    function safeRead(key) {
      try {
        return JSON.parse(localStorage.getItem(key) || "{}") || {};
      } catch {
        return {};
      }
    }
  })();
  