const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README.md');
const docsDir = path.join(__dirname, 'docs');
const outputPath = path.join(__dirname, 'docs_data.js');

console.log('Starting PJMOO TIL build process with date extraction...');

if (!fs.existsSync(readmePath)) {
  console.error('Error: README.md not found at', readmePath);
  process.exit(1);
}

let readmeContent = fs.readFileSync(readmePath, 'utf8');

// Static mapping of known project creation/commit dates (matches GitHub repository timeline)
const projectDatesMap = {
  "temp_FatDogAI": "2026-05-20",
  "FatDogAi2": "2026-05-20",
  "Fatdogaiex": "2026-05-20",
  "hw2_ex": "2026-05-21",
  "aibe7-team2": "2026-05-22",
  "plz2": "2026-05-22",
  "plz": "2026-05-22",
  "HWHWHW": "2026-05-22",
  "portfolio": "2026-05-26",
  "til-skin": "2026-05-26",
  "tli-skin": "2026-05-26",
  "tli": "2026-05-26",
  "programmers-refactor-practice": "2026-05-26",
  "fatdog2": "2026-05-27",
  "board": "2026-05-27",
  "QandA": "2026-05-27",
  "news-scraper": "2026-05-28",
  "HW-news": "2026-05-28",
  "spring": "2026-05-29",
  "archat": "2026-05-29",
  "jsp": "2026-06-01",
  "servlet": "2026-06-01",
  "cookiesession": "2026-06-02",
  "mybatis": "2026-06-02",
  "mybatis2": "2026-06-02",
  "mybatis3": "2026-06-02",
  "justchat": "2026-06-04",
  "saju": "2026-06-05",
  "HELP": "2026-06-08",
  "260618_pdf-study-review": "2026-06-18",
  "260622HW": "2026-06-22",
  "tomcat": "2026-06-30",
  "todayfortune": "2026-07-03",
  "webmvc": "2026-07-07",
  "springsupamemo": "2026-07-07",
  "boot-legacy": "2026-07-08",
  "FatDogAI": "2026-07-08",
  "nim-rest-client": "2026-07-09",
  "plan": "2026-07-14",
  "spring-jdbc": "2026-07-20",
  "jpa": "2026-07-23",
  "jpa2": "2026-07-24",
  "querydsl": "2026-07-27",
  "jpa3": "2026-07-27",
  "springai": "2026-07-28",
  "springai2": "2026-07-29",
  "rag": "2026-07-30",
  "thymeleaf": "2026-08-04",
  "worrydoll": "2026-08-04",
  "thssr": "2026-08-05",
  "260807_fileupload": "2026-08-07",
  "260810_aifile": "2026-08-10",
  "260811_imagegen": "2026-08-11",
  "260811_sec": "2026-08-11",
  "260812_sec_crud": "2026-08-12",
  "260813_secu_social": "2026-08-13",
  "260814_rest": "2026-08-14",
  "260818_rest_sec": "2026-08-18",
  "260819_sec_jwt": "2026-08-19",
  "260820_jwt_fetch": "2026-08-20",
  "260903_barohae": "2026-08-20 ~ 2026-09-03",
  "260907_infra": "2026-09-07",
  "260908_docker-ghcr": "2026-09-08",
  "260909_docker-compose-nginx": "2026-09-09",
  "260910_complex-back": "2026-09-10"
};

// --- START AUTO-SCAN AND REGISTER NEW FILES ---
const allFiles = fs.readdirSync(docsDir).filter(file => file.endsWith('.md'));
const registeredFiles = new Set();
const linkRegex = /docs\/[a-zA-Z0-9_\-\.]+/g;
let match;
while ((match = linkRegex.exec(readmeContent)) !== null) {
  registeredFiles.add(path.basename(match[0]));
}

const newFiles = allFiles.filter(file => !registeredFiles.has(file));

if (newFiles.length > 0) {
  console.log(`Found ${newFiles.length} unregistered markdown files in docs/. Registering...`);
  let readmeLines = readmeContent.split('\n');
  let dailyIndex = -1;
  let projectIndex = -1;
  
  for (let i = 0; i < readmeLines.length; i++) {
    const line = readmeLines[i].trim();
    if (line.startsWith('## ') && (line.includes('날짜별') || line.includes('Daily Logs'))) {
      dailyIndex = i;
    }
    if (line.startsWith('## ') && (line.includes('주제별') || line.includes('Project Logs'))) {
      projectIndex = i;
    }
  }

  let lastDailyRowIndex = -1;
  for (let i = dailyIndex + 1; i < readmeLines.length; i++) {
    const line = readmeLines[i].trim();
    if (line.startsWith('## ') || line === '---') break;
    if (line.startsWith('|')) {
      lastDailyRowIndex = i;
    }
  }

  let lastProjectRowIndex = -1;
  for (let i = projectIndex + 1; i < readmeLines.length; i++) {
    const line = readmeLines[i].trim();
    if (line.startsWith('## ') || line === '---') break;
    if (line.startsWith('|')) {
      lastProjectRowIndex = i;
    }
  }

  const newDailyRows = [];
  const newProjectRows = [];
  
  newFiles.sort();

  for (const file of newFiles) {
    const filePath = path.join(docsDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const titleMatch = fileContent.match(/^#\s+(.+)$/m);
    let title = titleMatch ? titleMatch[1].trim() : path.basename(file, '.md');
    
    const projectID = path.basename(file, '.md');
    
    let date = '';
    const dateMatch = file.match(/^(2\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/);
    if (dateMatch) {
      date = `20${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
    } else if (projectDatesMap[projectID] || projectDatesMap[file.replace(/\.md$/, '')]) {
      date = projectDatesMap[projectID] || projectDatesMap[file.replace(/\.md$/, '')];
    } else {
      const localRepoPath = path.join('C:\\workspace', projectID);
      let gitDate = '';
      if (fs.existsSync(path.join(localRepoPath, '.git'))) {
        try {
          const execSync = require('child_process').execSync;
          gitDate = execSync('git log --reverse --format="%cd" --date=short', { cwd: localRepoPath }).toString().trim().split('\n')[0].trim();
        } catch (e) {}
      }
      if (gitDate && gitDate.startsWith('20')) {
        date = gitDate;
      } else {
        const stat = fs.statSync(filePath);
        const d = stat.birthtime || stat.mtime;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        date = `${year}-${month}-${day}`;
      }
    }
    
    newDailyRows.push(`| ${date} | ${title} | [상세 보기](docs/${file}) |`);
    newProjectRows.push(`| ${projectID} | ${title} | [상세 보기](docs/${file}) |`);
  }

  if (lastProjectRowIndex !== -1 && newProjectRows.length > 0) {
    readmeLines.splice(lastProjectRowIndex + 1, 0, ...newProjectRows);
  }
  if (lastDailyRowIndex !== -1 && newDailyRows.length > 0) {
    readmeLines.splice(lastDailyRowIndex + 1, 0, ...newDailyRows);
  }

  readmeContent = readmeLines.join('\n');
  fs.writeFileSync(readmePath, readmeContent, 'utf8');
  console.log(`Successfully registered ${newFiles.length} files in README.md.`);
}
// --- END AUTO-SCAN AND REGISTER NEW FILES ---

const lines = readmeContent.split('\n');

let currentSection = '';
const dailyLogs = [];
const projectLogs = [];

for (let line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('## ')) {
    if (trimmed.includes('날짜별') || trimmed.includes('Daily Logs')) {
      currentSection = 'daily';
    } else if (trimmed.includes('주제별') || trimmed.includes('Project Logs')) {
      currentSection = 'project';
    } else {
      currentSection = '';
    }
    continue;
  }

  if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
    const parts = trimmed.split('|').map(p => p.trim());
    
    // Skip separator rows like | :--- | :--- |
    if (parts.some(p => p.includes('---'))) continue;
    
    // Skip header rows
    if (
      parts[1].includes('날짜') || 
      parts[1].toLowerCase().includes('date') || 
      parts[1].includes('프로젝트') || 
      parts[1].toLowerCase().includes('project')
    ) {
      continue;
    }

    if (currentSection === 'daily' && parts.length >= 4) {
      const date = parts[1];
      const topic = parts[2];
      const linkMatch = parts[3].match(/\((docs\/[^)]+\.md)\)/);
      if (linkMatch) {
        dailyLogs.push({
          date,
          topic,
          link: linkMatch[1]
        });
      }
    } else if (currentSection === 'project' && parts.length >= 4) {
      const project = parts[1];
      const description = parts[2];
      const linkMatch = parts[3].match(/\((docs\/[^)]+\.md)\)/);
      if (linkMatch) {
        projectLogs.push({
          project,
          description,
          link: linkMatch[1]
        });
      }
    }
  }
}

console.log(`Parsed ${dailyLogs.length} daily logs and ${projectLogs.length} project logs from README.md.`);

// Build map of document file to daily log date from README.md
const readmeDailyDateMap = {};
for (const item of dailyLogs) {
  const baseName = path.basename(item.link);
  readmeDailyDateMap[baseName] = item.date;
}

function processLogs(logs, isProject = false) {
  return logs.map(log => {
    const fileName = path.basename(log.link);
    const fullPath = path.join(docsDir, fileName);
    let rawContent = '';
    let title = isProject ? (log.description || log.project) : (log.topic || '');
    
    // Clean up emojis/decorations for raw search titles
    title = title.replace(/[📝📅🎨🛠📐💻🧠⚙🎬⏳👾🔒🚀🤖☕➕🧩🏋️📊🔌🍃💾🏰🐳🍪🕵️‍♂️🃏🔊🔮🧸📰🐱📁]/g, '').trim();

    if (fs.existsSync(fullPath)) {
      rawContent = fs.readFileSync(fullPath, 'utf8');
      
      // Extract title from the first heading in the markdown file
      const titleMatch = rawContent.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        title = titleMatch[1].trim();
      }
    } else {
      console.warn(`Warning: File not found: ${fullPath}`);
      rawContent = `# ${title}\n\n내용이 아직 등록되지 않았거나 파일을 찾을 수 없습니다: \`${log.link}\``;
    }

    // Auto-detect tags based on contents and filenames
    const tags = [];
    const lowerContent = rawContent.toLowerCase();
    const lowerPath = log.link.toLowerCase();
    
    // Check Java / Spring
    if (lowerContent.includes('spring') || lowerContent.includes('jpa') || lowerContent.includes('querydsl') || lowerContent.includes('thymeleaf')) {
      tags.push('Spring');
    }
    if (lowerContent.includes('java') && !lowerContent.includes('javascript')) {
      tags.push('Java');
    }
    
    // Check JavaScript
    if (lowerContent.includes('javascript') || lowerContent.includes('es6') || lowerContent.includes('async/await') || lowerContent.includes('dom ') || lowerPath.includes('script')) {
      tags.push('JavaScript');
    }
    
    // Check Databases
    if (
      lowerContent.includes('mysql') || 
      lowerContent.includes('sqld') || 
      lowerContent.includes('database') || 
      lowerContent.includes('데이터베이스') || 
      lowerContent.includes('jdbc') || 
      lowerContent.includes('mybatis') ||
      lowerContent.includes('dql') ||
      lowerContent.includes('dml') ||
      lowerContent.includes('ddl')
    ) {
      tags.push('Database');
    }
    
    // Check HTML/CSS
    if (
      lowerContent.includes('html') || 
      lowerContent.includes('css') || 
      lowerContent.includes('레이아웃') || 
      lowerContent.includes('bootstrap') || 
      lowerContent.includes('tailwind') ||
      lowerContent.includes('flex') ||
      lowerContent.includes('position')
    ) {
      tags.push('HTML/CSS');
    }
    
    // Check AI / LLM / RAG
    if (
      lowerContent.includes('ai ') || 
      lowerContent.includes('gemini') || 
      lowerContent.includes('langchain') || 
      lowerContent.includes('rag') || 
      lowerContent.includes('groq') || 
      lowerContent.includes('챗봇') ||
      lowerContent.includes('saju') ||
      lowerContent.includes('worrydoll')
    ) {
      tags.push('AI/RAG');
    }
    
    // Check Servlet / Web Basics
    if (
      lowerContent.includes('servlet') || 
      lowerContent.includes('jsp') || 
      lowerContent.includes('node.js') || 
      lowerContent.includes('express') || 
      lowerContent.includes('cookie') || 
      lowerContent.includes('session') ||
      lowerContent.includes('서블릿') ||
      lowerContent.includes('쿠키') ||
      lowerContent.includes('세션')
    ) {
      tags.push('Web/Backend');
    }

    // Default tag if none matched
    if (tags.length === 0) {
      tags.push('기타');
    }

    // Reading time calculation: roughly 400 characters per minute for standard readings
    const readingTime = Math.max(1, Math.ceil(rawContent.length / 400));

    // Get an anchor ID based on file name
    const id = path.basename(log.link, '.md');

    // Extract Date for Projects
    let extractedDate = log.date || '';
    if (isProject) {
      const fileName = path.basename(log.link);
      const projectId = log.project;
      const baseNameNoExt = fileName.replace(/\.md$/, '');

      // 1. Check if README.md's daily logs table already specified the date for this document
      if (readmeDailyDateMap[fileName]) {
        extractedDate = readmeDailyDateMap[fileName];
      }
      // 2. Check static projectDatesMap
      else if (projectDatesMap[projectId] || projectDatesMap[baseNameNoExt]) {
        extractedDate = projectDatesMap[projectId] || projectDatesMap[baseNameNoExt];
      }
      // 3. Check if project ID or file name contains a date pattern (e.g. 260622HW -> 2026-06-22)
      else {
        const idDateMatch = projectId.match(/^(2\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/);
        const fileDateMatch = fileName.match(/^(2\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/);
        const descDateMatch = log.description ? log.description.match(/\b(2\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\b/) : null;

        if (idDateMatch) {
          extractedDate = `20${idDateMatch[1]}-${idDateMatch[2]}-${idDateMatch[3]}`;
        } else if (fileDateMatch) {
          extractedDate = `20${fileDateMatch[1]}-${fileDateMatch[2]}-${fileDateMatch[3]}`;
        } else if (descDateMatch) {
          extractedDate = `20${descDateMatch[1]}-${descDateMatch[2]}-${descDateMatch[3]}`;
        } else {
          // 4. Query git FIRST (creation) commit date from workspace folder
          const localRepoPath = path.join('C:\\workspace', projectId);
          if (fs.existsSync(path.join(localRepoPath, '.git'))) {
            try {
              const execSync = require('child_process').execSync;
              const gitDate = execSync('git log --reverse --format="%cd" --date=short', { cwd: localRepoPath }).toString().trim().split('\n')[0].trim();
              if (gitDate && gitDate.startsWith('20')) {
                extractedDate = gitDate;
              }
            } catch (e) {
              // Ignore
            }
          }
        }
      }

      // 5. Fallback if still empty
      if (!extractedDate) {
        extractedDate = '2026-08-05';
      }
    }

    return {
      id,
      ...log,
      date: extractedDate,
      title,
      content: rawContent,
      tags,
      readingTime
    };
  });
}

console.log('Processing daily logs...');
const processedDaily = processLogs(dailyLogs, false);

console.log('Processing project logs...');
const processedProjects = processLogs(projectLogs, true);

const finalData = {
  dailyLogs: processedDaily,
  projectLogs: processedProjects,
  buildTime: new Date().toISOString()
};

const outputContent = `// Auto-generated TIL data file. Do not edit directly.
const TIL_DATA = ${JSON.stringify(finalData, null, 2)};

if (typeof window !== 'undefined') {
  window.TIL_DATA = TIL_DATA;
}
if (typeof module !== 'undefined') {
  module.exports = TIL_DATA;
}
`;

fs.writeFileSync(outputPath, outputContent, 'utf8');
console.log(`Build complete! Saved combined data with dates to ${outputPath}.`);

// Also update the Tistory skin folder files to stay in sync
const tistoryDir = path.join(__dirname, 'tistory_skin');
if (fs.existsSync(tistoryDir)) {
  const tistoryDocsDataPath = path.join(tistoryDir, 'docs_data.js');
  const tistoryAppPath = path.join(tistoryDir, 'app.js');
  const tistoryStylePath = path.join(tistoryDir, 'style.css');

  fs.writeFileSync(tistoryDocsDataPath, outputContent, 'utf8');
  console.log(`Synced: docs_data.js -> ${tistoryDocsDataPath}`);

  const rootAppPath = path.join(__dirname, 'app.js');
  if (fs.existsSync(rootAppPath)) {
    fs.copyFileSync(rootAppPath, tistoryAppPath);
    console.log(`Synced: app.js -> ${tistoryAppPath}`);
  }

  const rootStylePath = path.join(__dirname, 'style.css');
  if (fs.existsSync(rootStylePath)) {
    fs.copyFileSync(rootStylePath, tistoryStylePath);
    console.log(`Synced: style.css -> ${tistoryStylePath}`);
  }
}

