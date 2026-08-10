/* ==========================================================================
   PJMOO TIL - Client App Logic
   Interactive Single Page Application (SPA) Controller with Timeline and UX features.
   ========================================================================== */

const initApp = () => {
  // State variables
  let activeTab = 'all'; // 'all', 'daily', or 'project'
  let searchQuery = '';
  let selectedTag = '';
  let allLogs = [];
  let currentFontSizeRem = parseFloat(localStorage.getItem('til-font-size') || '1.05');
  let sortOrder = localStorage.getItem('til-sort-order') || 'asc'; // Default to chronological (May 14th first)
  
  // Cache DOM Elements
  const el = {
    themeToggle: document.getElementById('theme-toggle'),
    searchInput: document.getElementById('search-input'),
    sortToggle: document.getElementById('sort-toggle'),
    tabAll: document.getElementById('tab-all'),
    tabDaily: document.getElementById('tab-daily'),
    tabProject: document.getElementById('tab-project'),
    allList: document.getElementById('all-list'),
    dailyList: document.getElementById('daily-list'),
    projectList: document.getElementById('project-list'),
    tagsCloud: document.getElementById('tags-cloud'),
    mainContent: document.getElementById('main-content'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    sidebar: document.getElementById('sidebar'),
    backToTop: document.getElementById('back-to-top'),
    tocContainer: document.getElementById('toc-container'),
    tocList: document.getElementById('toc-list'),
    scrollProgress: document.getElementById('scroll-progress')
  };

  // Initialize
  function init() {
    if (typeof window.TIL_DATA === 'undefined') {
      console.log('TIL_DATA not found. Attempting to fetch from GitHub...');
      
      const loadDataFromUrl = (url) => {
        return fetch(url)
          .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
          })
          .then(text => {
            try {
              const jsonStart = text.indexOf('{');
              const jsonEnd = text.lastIndexOf('};');
              if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonText = text.substring(jsonStart, jsonEnd + 1);
                window.TIL_DATA = JSON.parse(jsonText.trim());
                console.log('TIL_DATA successfully parsed from GitHub JSON.');
                continueInit();
              } else {
                throw new Error('Could not find JSON object in data');
              }
            } catch (e) {
              console.warn('JSON.parse failed, falling back to script injection:', e);
              const script = document.createElement('script');
              script.text = text;
              document.head.appendChild(script);
              if (typeof window.TIL_DATA !== 'undefined') {
                continueInit();
              } else {
                showError();
              }
            }
          });
      };

      if (window.GIT_SHA) {
        loadDataFromUrl('https://raw.githubusercontent.com/pjmoo/PJMOO_TIL/' + window.GIT_SHA + '/docs_data.js')
          .catch(err => {
            console.error('Failed to load docs_data.js with GIT_SHA:', err);
            showError();
          });
      } else {
        // Fallback if app.js is loaded without skin.html GIT_SHA (e.g. testing)
        fetch('https://api.github.com/repos/pjmoo/PJMOO_TIL/commits/main?v=' + Date.now())
          .then(res => {
            if (!res.ok) throw new Error('API rate limit or error');
            return res.json();
          })
          .then(commit => {
            return loadDataFromUrl('https://raw.githubusercontent.com/pjmoo/PJMOO_TIL/' + commit.sha + '/docs_data.js');
          })
          .catch(err => {
            console.warn('GitHub API failed, loading from main branch raw:', err);
            return loadDataFromUrl('https://raw.githubusercontent.com/pjmoo/PJMOO_TIL/main/docs_data.js?v=' + Date.now());
          })
          .catch(err => {
            console.error('Final load failed:', err);
            showError();
          });
      }
    } else {
      continueInit();
    }
  }

  function showError() {
    el.mainContent.innerHTML = `<div class="content-body"><h2>데이터 오류</h2><p>학습 데이터를 불러올 수 없습니다. <code>node build.js</code> 명령어를 실행해 데이터 파일을 갱신해 주세요.</p></div>`;
  }

  function continueInit() {
    // Combine all logs with type mapping
    const rawDaily = window.TIL_DATA.dailyLogs || [];
    const rawProjects = window.TIL_DATA.projectLogs || [];
    
    allLogs = [
      ...rawDaily.map(log => ({ ...log, type: 'daily' })),
      ...rawProjects.map(log => ({ ...log, type: 'project' }))
    ];

    setupTheme();
    updateSortIcon(); // Initialize sort icon
    renderSidebarLists();
    renderTagsCloud();
    setupEventListeners();
    setupKeyboardShortcuts();
    handleRouting();
  }

  /* ==========================================================================
     Theme Configuration
     ========================================================================== */
  function setupTheme() {
    const savedTheme = localStorage.getItem('til-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    el.themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('til-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    el.themeToggle.innerHTML = theme === 'dark' 
      ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  /* ==========================================================================
     Sidebar Lists Rendering & Filtering
     ========================================================================== */
  function renderSidebarLists() {
    // Filter by search query and tag
    const filterFn = log => {
      const matchesSearch = searchQuery === '' || 
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        log.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.topic && log.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.project && log.project.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag === '' || log.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    };

    const filteredAll = allLogs.filter(filterFn);
    const filteredDaily = allLogs.filter(log => log.type === 'daily').filter(filterFn);
    const filteredProject = allLogs.filter(log => log.type === 'project').filter(filterFn);

    renderAllTimelineList(filteredAll);
    renderDailyList(filteredDaily);
    renderProjectList(filteredProject);
  }

  function renderAllTimelineList(logs) {
    // Sort all combined logs by date based on sortOrder
    logs.sort((a, b) => sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));

    // Group by Year-Month
    const groups = {};
    logs.forEach(log => {
      const mainDate = log.date.split('~')[0].trim();
      const match = mainDate.match(/^(\d{4}-\d{2})/);
      const monthGroup = match ? match[1] : '기타';
      
      if (!groups[monthGroup]) groups[monthGroup] = [];
      groups[monthGroup].push(log);
    });

    if (logs.length === 0) {
      el.allList.innerHTML = `<li class="group-header" style="text-transform: none;">검색 결과가 없습니다</li>`;
      return;
    }

    let html = '';
    const sortedGroups = Object.keys(groups).sort((a, b) => sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
    
    sortedGroups.forEach(month => {
      const monthDisplay = month === '기타' ? 'Other' : formatMonthLabel(month);
      html += `<li class="group-header">${monthDisplay} <span>(${groups[month].length})</span></li>`;
      
      groups[month].forEach(log => {
        const isCurrent = window.location.hash === `#/${log.type}/${log.id}`;
        const typeBadge = log.type === 'project' ? '<span style="font-size:0.6rem; padding: 1px 4px; border-radius:3px; background-color:var(--accent); color:white; font-weight:500;">실습</span>' : '<span style="font-size:0.6rem; padding: 1px 4px; border-radius:3px; background-color:var(--border); color:var(--text-secondary);">일지</span>';
        
        html += `
          <li class="log-item">
            <a href="#/${log.type}/${log.id}" class="log-link ${isCurrent ? 'active' : ''}" id="nav-all-${log.id}">
              <div class="log-item-meta">
                <span>📅 ${log.date}</span>
                <span>•</span>
                <span>⏱ ${log.readingTime}분</span>
                <span>•</span>
                ${typeBadge}
              </div>
              <div class="log-item-title" title="${log.title}">${log.title}</div>
            </a>
          </li>
        `;
      });
    });

    el.allList.innerHTML = html;
  }

  function renderDailyList(logs) {
    logs.sort((a, b) => sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));

    const groups = {};
    logs.forEach(log => {
      const mainDate = log.date.split('~')[0].trim();
      const match = mainDate.match(/^(\d{4}-\d{2})/);
      const monthGroup = match ? match[1] : '기타';
      
      if (!groups[monthGroup]) groups[monthGroup] = [];
      groups[monthGroup].push(log);
    });

    if (logs.length === 0) {
      el.dailyList.innerHTML = `<li class="group-header" style="text-transform: none;">검색 결과가 없습니다</li>`;
      return;
    }

    let html = '';
    const sortedGroups = Object.keys(groups).sort((a, b) => sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
    
    sortedGroups.forEach(month => {
      const monthDisplay = month === '기타' ? 'Other' : formatMonthLabel(month);
      html += `<li class="group-header">${monthDisplay} <span>(${groups[month].length})</span></li>`;
      
      groups[month].forEach(log => {
        const isCurrent = window.location.hash === `#/daily/${log.id}`;
        html += `
          <li class="log-item">
            <a href="#/daily/${log.id}" class="log-link ${isCurrent ? 'active' : ''}" id="nav-daily-${log.id}">
              <div class="log-item-meta">
                <span>📅 ${log.date}</span>
                <span>•</span>
                <span>⏱ ${log.readingTime}분</span>
              </div>
              <div class="log-item-title" title="${log.title}">${log.title}</div>
            </a>
          </li>
        `;
      });
    });

    el.dailyList.innerHTML = html;
  }

  function renderProjectList(logs) {
    // Sort projects based on sortOrder
    logs.sort((a, b) => sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));

    if (logs.length === 0) {
      el.projectList.innerHTML = `<li class="group-header" style="text-transform: none;">검색 결과가 없습니다</li>`;
      return;
    }

    let html = '';
    logs.forEach(log => {
      const isCurrent = window.location.hash === `#/project/${log.id}`;
      html += `
        <li class="log-item">
          <a href="#/project/${log.id}" class="log-link ${isCurrent ? 'active' : ''}" id="nav-project-${log.id}">
            <div class="log-item-meta">
              <span>📅 ${log.date}</span>
              <span>•</span>
              <span>🛠 ${log.project}</span>
            </div>
            <div class="log-item-title" title="${log.title}">${log.title}</div>
          </a>
        </li>
      `;
    });

    el.projectList.innerHTML = html;
  }

  function formatMonthLabel(ym) {
    const [year, month] = ym.split('-');
    const monthNames = {
      '01': 'January', '02': 'February', '03': 'March', '04': 'April',
      '05': 'May', '06': 'June', '07': 'July', '08': 'August',
      '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };
    return `${monthNames[month] || month} ${year}`;
  }

  /* ==========================================================================
     Tag Cloud Rendering
     ========================================================================== */
  function renderTagsCloud() {
    const tagCounts = {};
    allLogs.forEach(log => {
      log.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

    let html = `
      <span class="tag-badge ${selectedTag === '' ? 'active' : ''}" data-tag="">
        전체 (${allLogs.length})
      </span>
    `;

    sortedTags.forEach(tag => {
      const isActive = selectedTag === tag;
      html += `
        <span class="tag-badge ${isActive ? 'active' : ''}" data-tag="${tag}">
          #${tag} (${tagCounts[tag]})
        </span>
      `;
    });

    el.tagsCloud.innerHTML = html;

    // Attach click events
    el.tagsCloud.querySelectorAll('.tag-badge').forEach(badge => {
      badge.addEventListener('click', (e) => {
        const tag = e.target.getAttribute('data-tag');
        selectedTag = tag;
        
        el.tagsCloud.querySelectorAll('.tag-badge').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        renderSidebarLists();
      });
    });
  }

  /* ==========================================================================
     Welcome Page & Dashboard
     ========================================================================== */
  function renderWelcomePage() {
    document.querySelectorAll('.log-link').forEach(link => link.classList.remove('active'));

    const dailyCount = allLogs.filter(log => log.type === 'daily').length;
    const projectCount = allLogs.filter(log => log.type === 'project').length;
    
    const tagMap = {};
    allLogs.forEach(log => log.tags.forEach(t => tagMap[t] = (tagMap[t] || 0) + 1));

    // Get 5 most recent items from the entire merged log list
    const recentLogs = [...allLogs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);

    // Get all daily logs sorted descending by date
    const allDailyLogs = [...allLogs]
      .filter(log => log.type === 'daily')
      .sort((a, b) => b.date.localeCompare(a.date));

    // Heatmap: last 32 learning entries sorted chronologically
    const latest32 = [...allLogs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 32)
      .reverse();

    let heatmapCellsHtml = '';
    latest32.forEach(log => {
      const shortDate = log.date.substring(5);
      const isProj = log.type === 'project';
      const cellClass = isProj ? 'active-day' : 'active-day';
      const cellColor = isProj ? 'style="background-color: var(--accent); color: white;"' : '';
      
      heatmapCellsHtml += `
        <div class="heatmap-cell ${cellClass}" ${cellColor} onclick="window.location.hash='#/${log.type}/${log.id}'" title="${log.date}: ${log.title} (${isProj ? '실습' : '일지'})">
          <span style="font-size:0.6rem; opacity: 0.9;">${shortDate.replace('-', '/')}</span>
        </div>
      `;
    });

    for (let i = latest32.length; i < 32; i++) {
      heatmapCellsHtml += `<div class="heatmap-cell" style="opacity: 0.3;"></div>`;
    }

    const html = `
      <div class="welcome-container">
        <header class="welcome-header">
          <h2>학습 일지 통합 타임라인 📝</h2>
          <p>
            배우고 성장한 순간들을 매일 정리하는 개인 학습 공간입니다. 
            날짜순 통합 타임라인을 통해 일일 학습 로그와 주제별 프로젝트 실습 이력을 한눈에 편안하게 모아볼 수 있습니다.
          </p>
        </header>

        <!-- Stats Grid -->
        <section class="stats-grid">
          <div class="stat-card">
            <span class="stat-val">${dailyCount + projectCount}개</span>
            <span class="stat-lbl">📅 전체 학습 일지</span>
          </div>
          <div class="stat-card">
            <span class="stat-val">${dailyCount}개</span>
            <span class="stat-lbl">📝 일일 학습 로그</span>
          </div>
          <div class="stat-card">
            <span class="stat-val">${projectCount}개</span>
            <span class="stat-lbl">🛠 프로젝트 실습</span>
          </div>
        </section>

        <!-- Learning Heatmap -->
        <section class="heatmap-container">
          <div class="heatmap-title" style="margin-bottom: 8px;">
            최근 학습 타임라인 (전체 흐름)
            <span id="heatmap-desc">최근 32개 학습 이력</span>
          </div>
          
          <!-- Heatmap Color Legend -->
          <div class="heatmap-legend" style="display: flex; gap: 16px; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 16px; border-bottom: 1px solid var(--border-light); padding-bottom: 10px;">
            <span style="display: inline-flex; align-items: center; gap: 6px;">
              <span class="heatmap-cell active-day" style="width: 14px; height: 14px; display: inline-block; cursor: default; pointer-events: none; margin: 0; border: 1px solid rgba(153, 73, 53, 0.15);"></span>
              일일 학습 로그 (Daily Logs)
            </span>
            <span style="display: inline-flex; align-items: center; gap: 6px;">
              <span class="heatmap-cell active-day" style="width: 14px; height: 14px; background-color: var(--accent); color: white; display: inline-block; cursor: default; pointer-events: none; margin: 0;"></span>
              주제별 프로젝트 실습 (Project Logs)
            </span>
          </div>

          <div class="heatmap-grid" id="heatmap-grid">
            ${heatmapCellsHtml}
          </div>
          <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
            <button id="show-all-heatmap-btn" class="show-all-btn" style="background: none; border: 1px solid var(--border); padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; color: var(--text-secondary); cursor: pointer; transition: var(--transition);">
              전체 보기 ↓
            </button>
          </div>
        </section>

        <!-- Recent Logs List -->
        <section class="recent-activity-card">
          <h3 class="recent-title">최근 작성된 학습 기록</h3>
          <div class="recent-list">
            ${recentLogs.map(log => `
              <div class="recent-item">
                <div class="recent-item-info">
                  <a href="#/${log.type}/${log.id}" class="recent-item-title">${log.title}</a>
                  <span class="recent-item-date">
                    📅 ${log.date} • ⏱ 읽기 시간 약 ${log.readingTime}분 • 
                    ${log.type === 'project' ? '<b style="color:var(--accent);">실습 프로젝트</b>' : '일일 학습'}
                  </span>
                </div>
                <div class="article-tags" style="gap:4px;">
                  ${log.tags.slice(0, 2).map(tag => `<span class="article-tag" style="font-size:0.65rem; padding: 2px 6px;">${tag}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- All Daily Logs List -->
        <section class="recent-activity-card">
          <h3 class="recent-title">전체 일일 학습 로그 (All Daily Logs)</h3>
          <div class="recent-list" style="max-height: 400px; overflow-y: auto; padding-right: 8px;">
            ${allDailyLogs.map(log => `
              <div class="recent-item">
                <div class="recent-item-info">
                  <a href="#/daily/${log.id}" class="recent-item-title">${log.title}</a>
                  <span class="recent-item-date">
                    📅 ${log.date} • ⏱ 읽기 시간 약 ${log.readingTime}분
                  </span>
                </div>
                <div class="article-tags" style="gap:4px;">
                  ${log.tags.slice(0, 2).map(tag => `<span class="article-tag" style="font-size:0.65rem; padding: 2px 6px;">${tag}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <footer class="page-footer">
          <span>© PJMOO Today I Learned.</span>
          <span>최종 빌드 시간: ${new Date(window.TIL_DATA.buildTime).toLocaleString()}</span>
        </footer>
      </div>

    `;

    el.mainContent.innerHTML = `<div class="content-body">${html}</div>`;
    el.tocContainer.style.display = 'none';
    el.scrollProgress.style.transform = 'scaleX(0)';

    // Attach dynamic click event for heatmap expansion and collapse
    const showAllBtn = document.getElementById('show-all-heatmap-btn');
    if (showAllBtn) {
      showAllBtn.addEventListener('click', () => {
        const grid = document.getElementById('heatmap-grid');
        const desc = document.getElementById('heatmap-desc');
        if (!grid || !desc) return;

        const isExpanded = showAllBtn.getAttribute('data-expanded') === 'true';

        if (!isExpanded) {
          // Expand state
          const allItems = [...allLogs]
            .sort((a, b) => b.date.localeCompare(a.date))
            .reverse();

          let allCellsHtml = '';
          allItems.forEach(log => {
            const shortDate = log.date.substring(5);
            const isProj = log.type === 'project';
            const cellColor = isProj ? 'style="background-color: var(--accent); color: white;"' : '';
            
            allCellsHtml += `
              <div class="heatmap-cell active-day" ${cellColor} onclick="window.location.hash='#/${log.type}/${log.id}'" title="${log.date}: ${log.title} (${isProj ? '실습' : '일지'})">
                <span style="font-size:0.6rem; opacity: 0.9;">${shortDate.replace('-', '/')}</span>
              </div>
            `;
          });

          grid.innerHTML = allCellsHtml;
          desc.innerText = `전체 ${allItems.length}개 학습 이력`;
          showAllBtn.innerText = '접기 ↑';
          showAllBtn.setAttribute('data-expanded', 'true');
        } else {
          // Collapse state (back to 32 items)
          const latest32 = [...allLogs]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 32)
            .reverse();

          let heatmapCellsHtml = '';
          latest32.forEach(log => {
            const shortDate = log.date.substring(5);
            const isProj = log.type === 'project';
            const cellClass = isProj ? 'active-day' : 'active-day';
            const cellColor = isProj ? 'style="background-color: var(--accent); color: white;"' : '';
            
            heatmapCellsHtml += `
              <div class="heatmap-cell ${cellClass}" ${cellColor} onclick="window.location.hash='#/${log.type}/${log.id}'" title="${log.date}: ${log.title} (${isProj ? '실습' : '일지'})">
                <span style="font-size:0.6rem; opacity: 0.9;">${shortDate.replace('-', '/')}</span>
              </div>
            `;
          });

          for (let i = latest32.length; i < 32; i++) {
            heatmapCellsHtml += `<div class="heatmap-cell" style="opacity: 0.3;"></div>`;
          }

          grid.innerHTML = heatmapCellsHtml;
          desc.innerText = `최근 32개 학습 이력`;
          showAllBtn.innerText = '전체 보기 ↓';
          showAllBtn.setAttribute('data-expanded', 'false');
        }
      });
    }
  }

  /* ==========================================================================
     Article View & Rendering
     ========================================================================== */
  function renderArticle(type, id) {
    const log = allLogs.find(l => l.type === type && l.id === id);
    if (!log) {
      el.mainContent.innerHTML = `<div class="content-body"><h2>글을 찾을 수 없습니다.</h2><p>해당 경로의 문서를 불러올 수 없습니다.</p></div>`;
      el.tocContainer.style.display = 'none';
      return;
    }

    // Set active link in sidebar across tabs
    document.querySelectorAll('.log-link').forEach(link => link.classList.remove('active'));
    
    // Highlight matching link in ALL lists
    const activeSelectors = [`#nav-all-${id}`, `#nav-daily-${id}`, `#nav-project-${id}`];
    activeSelectors.forEach(sel => {
      const link = document.querySelector(sel);
      if (link) link.classList.add('active');
    });

    // Configure marked options
    marked.setOptions({
      headerIds: true,
      gfm: true
    });

    const parsedHTML = marked.parse(log.content);

    const html = `
      <article>
        <header class="article-header">
          <div class="article-meta">
            <span>${type === 'daily' ? '📝 Daily Log' : '🛠 Project Log'}</span>
            <span class="meta-divider">|</span>
            <span>⏱ 읽기 시간 약 ${log.readingTime}분</span>
            <span class="meta-divider">|</span>
            <span>📅 날짜: ${log.date}</span>
            
            <!-- Font Size Adjuster Widget -->
            <div class="font-size-adjuster" id="fs-adjuster">
              <button id="font-dec" title="글자 작게" aria-label="Decrease Font Size">A-</button>
              <button id="font-inc" title="글자 크게" aria-label="Increase Font Size">A+</button>
            </div>
          </div>
          <h2 class="article-title">${log.title}</h2>
          <div class="article-tags">
            ${log.tags.map(tag => `<span class="article-tag">#${tag}</span>`).join('')}
          </div>
          <div class="article-path">파일 경로: ${log.link}</div>
        </header>

        <!-- Inline Table of Contents for narrow desktop/tablet screens -->
        <div class="inline-toc" id="inline-toc-container">
          <details open>
            <summary>📋 아티클 목차 (Outline)</summary>
            <ul class="inline-toc-list" id="inline-toc-list">
              <!-- Dynamically populated outline -->
            </ul>
          </details>
        </div>

        <section class="article-content" id="article-markdown-body">
          ${parsedHTML}
        </section>

        <footer class="page-footer">
          <span>© PJMOO Today I Learned.</span>
          <a href="#" style="font-weight: 500;">맨 위로 이동 ↑</a>
        </footer>
      </article>
    `;

    el.mainContent.innerHTML = `<div class="content-body">${html}</div>`;
    
    // Wire up font size adjustments
    setupFontSizeControls();
    
    // Post process Markdown: Code Blocks (Copy Button + Highlighting)
    postProcessMarkdownContent();

    // Table of Contents generation (both side and inline)
    generateTableOfContents();
  }

  function setupFontSizeControls() {
    const decBtn = document.getElementById('font-dec');
    const incBtn = document.getElementById('font-inc');
    const body = document.getElementById('article-markdown-body');
    
    if (decBtn && incBtn && body) {
      body.style.fontSize = `${currentFontSizeRem}rem`;
      
      decBtn.addEventListener('click', () => {
        currentFontSizeRem = Math.max(0.85, currentFontSizeRem - 0.05);
        body.style.fontSize = `${currentFontSizeRem}rem`;
        localStorage.setItem('til-font-size', currentFontSizeRem.toString());
      });

      incBtn.addEventListener('click', () => {
        currentFontSizeRem = Math.min(1.3, currentFontSizeRem + 0.05);
        body.style.fontSize = `${currentFontSizeRem}rem`;
        localStorage.setItem('til-font-size', currentFontSizeRem.toString());
      });
    }
  }

  function postProcessMarkdownContent() {
    const codeBlocks = el.mainContent.querySelectorAll('pre');
    codeBlocks.forEach(pre => {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.innerText = 'Copy';
      pre.appendChild(copyBtn);

      copyBtn.addEventListener('click', () => {
        const codeElement = pre.querySelector('code');
        if (!codeElement) return;
        
        const text = codeElement.innerText;
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.innerText = 'Copied!';
          copyBtn.style.color = '#5F7D6D';
          setTimeout(() => {
            copyBtn.innerText = 'Copy';
            copyBtn.style.color = '';
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy code: ', err);
        });
      });
    });

    if (typeof Prism !== 'undefined') {
      Prism.highlightAllUnder(el.mainContent);
    }
  }

  /* ==========================================================================
     Outline / Table of Contents (TOC) Generation
     ========================================================================== */
  function generateTableOfContents() {
    const markdownBody = document.getElementById('article-markdown-body');
    const inlineContainer = document.getElementById('inline-toc-container');
    const inlineList = document.getElementById('inline-toc-list');
    
    if (!markdownBody) {
      el.tocContainer.style.display = 'none';
      if (inlineContainer) inlineContainer.style.display = 'none';
      return;
    }

    // Find headings (h2 and h3)
    const headings = markdownBody.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      el.tocContainer.style.display = 'none';
      if (inlineContainer) inlineContainer.style.display = 'none';
      return;
    }

    let sideTocHtml = '';
    let inlineTocHtml = '';

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      // Clean emojis and extra items for cleaner display in list
      const cleanText = heading.innerText.replace(/[📂🛠💡🧩💾🚀🛡📚👾🔒💬🤖🎨☕➕🧩🏋️📊🔌🍃💾🏰🐳🍪🕵️‍♂️🃏🔊🔮🧸📰🐱📁]/g, '').trim();
      const indentClass = heading.tagName.toLowerCase() === 'h3' ? 'h3' : 'h2';
      const inlineDepthClass = heading.tagName.toLowerCase() === 'h3' ? 'inline-toc-item h3' : 'inline-toc-item';

      // 1. Sidebar TOC item
      sideTocHtml += `
        <li class="toc-item ${indentClass}">
          <a href="#${heading.id}" class="toc-link" data-target="${heading.id}">${cleanText}</a>
        </li>
      `;

      // 2. Inline TOC item
      inlineTocHtml += `
        <li class="${inlineDepthClass}">
          <a href="#${heading.id}" class="inline-toc-link" data-target="${heading.id}">• ${cleanText}</a>
        </li>
      `;
    });

    // Populate Sidebar TOC
    el.tocList.innerHTML = sideTocHtml;
    el.tocContainer.style.display = 'flex';

    // Populate Inline TOC
    if (inlineList && inlineContainer) {
      inlineList.innerHTML = inlineTocHtml;
      inlineContainer.style.display = 'block';
      
      // Wire click for inline TOC links
      inlineList.querySelectorAll('.inline-toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          scrollToHeading(link.getAttribute('data-target'));
        });
      });
    }

    // Wire click for sidebar TOC links
    el.tocList.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToHeading(link.getAttribute('data-target'));
      });
    });

    setupTOCScrollObserver(headings);
  }

  function scrollToHeading(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 60,
        behavior: 'smooth'
      });
      history.pushState(null, null, `#${window.location.hash.split('#')[1].split('?')[0]}?heading=${targetId}`);
    }
  }

  function setupTOCScrollObserver(headings) {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          el.tocList.querySelectorAll('.toc-link').forEach(link => {
            if (link.getAttribute('data-target') === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    headings.forEach(h => observer.observe(h));
  }

  /* ==========================================================================
     Scroll Progress Indicator
     ========================================================================== */
  function updateScrollProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const scrolled = window.scrollY / docHeight;
      el.scrollProgress.style.transform = `scaleX(${scrolled})`;
    }
  }

  /* ==========================================================================
     Keyboard Shortcuts
     ========================================================================== */
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Focus Search input on '/' or 's' (if not already focusing an input)
      if ((e.key === '/' || e.key === 's' || e.key === 'S') && document.activeElement !== el.searchInput) {
        e.preventDefault();
        el.searchInput.focus();
        el.searchInput.select();
      }

      // Escape key clears search, or closes mobile drawer
      if (e.key === 'Escape') {
        if (el.sidebar.classList.contains('mobile-open')) {
          el.sidebar.classList.remove('mobile-open');
        } else if (document.activeElement === el.searchInput) {
          el.searchInput.blur();
        } else if (searchQuery !== '') {
          el.searchInput.value = '';
          searchQuery = '';
          renderSidebarLists();
        }
      }
    });
  }

  /* ==========================================================================
     Event Listeners
     ========================================================================== */
  function setupEventListeners() {
    // Search Box Listener
    el.searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderSidebarLists();
    });

    // Navigation Tabs
    el.tabAll.addEventListener('click', () => switchTab('all'));
    el.tabDaily.addEventListener('click', () => switchTab('daily'));
    el.tabProject.addEventListener('click', () => switchTab('project'));

    // Sort Toggle Button
    el.sortToggle.addEventListener('click', () => {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      localStorage.setItem('til-sort-order', sortOrder);
      updateSortIcon();
      renderSidebarLists();
    });

    // Mobile Drawer Trigger
    el.mobileMenuBtn.addEventListener('click', () => {
      el.sidebar.classList.toggle('mobile-open');
    });

    // Close mobile drawer when clicking sidebar items
    el.sidebar.addEventListener('click', (e) => {
      if (e.target.closest('.log-link') || e.target.closest('.tag-badge')) {
        el.sidebar.classList.remove('mobile-open');
      }
    });

    // Back to top floating button visibility
    window.addEventListener('scroll', () => {
      updateScrollProgress();
      if (window.scrollY > 400) {
        el.backToTop.classList.add('visible');
      } else {
        el.backToTop.classList.remove('visible');
      }
    });

    el.backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  function updateSortIcon() {
    if (sortOrder === 'asc') {
      el.sortToggle.innerHTML = `
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
          <path d="M3 4h13M3 10h9M3 16h5M19 6v14m0 0l-3-3m3 3l3-3"/>
        </svg>
      `;
      el.sortToggle.title = '오래된 순 정렬 중 (클릭 시 최신 순)';
    } else {
      el.sortToggle.innerHTML = `
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
          <path d="M3 4h13M3 10h9M3 16h5M19 18V4m0 0l-3 3m3-3l3 3"/>
        </svg>
      `;
      el.sortToggle.title = '최신 순 정렬 중 (클릭 시 오래된 순)';
    }
  }

  function switchTab(tab) {
    activeTab = tab;
    
    // Remove active styles on all tabs
    el.tabAll.classList.remove('active');
    el.tabDaily.classList.remove('active');
    el.tabProject.classList.remove('active');
    
    el.allList.classList.remove('active');
    el.dailyList.classList.remove('active');
    el.projectList.classList.remove('active');

    // Activate selected
    if (tab === 'all') {
      el.tabAll.classList.add('active');
      el.allList.classList.add('active');
    } else if (tab === 'daily') {
      el.tabDaily.classList.add('active');
      el.dailyList.classList.add('active');
    } else {
      el.tabProject.classList.add('active');
      el.projectList.classList.add('active');
    }
  }

  /* ==========================================================================
     Routing System
     ========================================================================== */
  function handleRouting() {
    const hash = window.location.hash;
    const dailyMatch = hash.match(/^#\/daily\/([^?]+)/);
    const projectMatch = hash.match(/^#\/project\/([^?]+)/);

    if (dailyMatch) {
      renderArticle('daily', dailyMatch[1]);
    } else if (projectMatch) {
      renderArticle('project', projectMatch[1]);
    } else {
      renderWelcomePage();
    }
    
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', handleRouting);

  // Initialize
  init();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
