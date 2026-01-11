(function () {
  async function loadJSON(url) {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load ' + url + ' (' + res.status + ')');
    return res.json();
  }

  function validateEmails(arr, sourceLabel) {
    if (!Array.isArray(arr)) return [];
    const out = [];
    arr.forEach((e, i) => {
      if (!e || typeof e !== 'object') return;
      if (!e.id || !e.subject || !e.date || !e.category) {
        console.warn('[data-loader] Invalid email in', sourceLabel, 'index', i, e);
        return;
      }
      out.push(e);
    });
    return out;
  }

  function mergeStaffUsers(baseUsers, addUsers) {
    if (!Array.isArray(addUsers)) return baseUsers;
    const map = new Map((baseUsers || []).map(u => [u.username, u]));
    addUsers.forEach(u => {
      if (!u || !u.username) return;
      const existing = map.get(u.username);
      if (existing) {
        existing.name = existing.name || u.name;
        existing.department = existing.department || u.department;
        existing.securityLevel = existing.securityLevel || u.securityLevel;
        existing.accessCode = existing.accessCode || u.accessCode;
        existing.status = existing.status || u.status;
        existing.emails = (existing.emails || []).concat(validateEmails(u.emails || [], 'staff-user:' + u.username));
      } else {
        u.emails = validateEmails(u.emails || [], 'staff-user:' + u.username);
        map.set(u.username, u);
      }
    });
    return Array.from(map.values());
  }

  async function loadArchiveData() {
    try {
      const [emails, staffUsers] = await Promise.all([
        loadJSON('assets/data/emails.json'),
        loadJSON('assets/data/staff-users.json')
      ]);
      window.emails = validateEmails(emails, 'emails.json');
      window.staffUsers = Array.isArray(staffUsers) ? staffUsers : [];
      // Optional catalogs
      try { window.entities = await loadJSON('assets/data/entities.json'); } catch (_) {}
      try { window.tagCatalog = await loadJSON('assets/data/tags.json'); } catch (_) {}

      // Optional content packs
      try {
        const packIndex = await loadJSON('assets/data/packs/index.json');
        if (Array.isArray(packIndex)) {
          for (const file of packIndex) {
            try {
              const pack = await loadJSON('assets/data/packs/' + file);
              if (Array.isArray(pack.emails)) {
                window.emails = window.emails.concat(validateEmails(pack.emails, 'pack:' + file));
              }
              if (Array.isArray(pack.staffUsers)) {
                window.staffUsers = mergeStaffUsers(window.staffUsers, pack.staffUsers);
              }
              if (pack.entities) {
                window.entities = window.entities || {};
                const groups = ['characters','locations','events','servers'];
                groups.forEach(g => {
                  if (Array.isArray(pack.entities[g])) {
                    window.entities[g] = (window.entities[g] || []).concat(pack.entities[g]);
                  }
                });
              }
              if (Array.isArray(pack.tags)) {
                window.tagCatalog = (window.tagCatalog || []).concat(pack.tags);
              }
            } catch (pe) {
              console.warn('[data-loader] Failed to load pack', file, pe);
            }
          }
        }
      } catch (_) {}
      console.log('[data-loader] Successfully loaded JSON data');
      window.dataSource = 'json';
    } catch (e) {
      console.error('[data-loader] JSON loading failed, attempting fallback to lore-data.js:', e);
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'lore-data.js';
        s.onload = () => {
          console.log('[data-loader] Fallback loaded successfully from lore-data.js');
          window.dataSource = 'js';
          resolve();
        };
        s.onerror = (err) => {
          console.error('[data-loader] Fallback also failed:', err);
          reject(e);
        };
        document.head.appendChild(s);
      });
    }
  }

  window.dataReady = loadArchiveData();
  window.reloadArchiveData = loadArchiveData;
})();
