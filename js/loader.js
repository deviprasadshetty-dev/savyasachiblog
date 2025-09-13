const BASE_URL = '/posts/';

async function fetchPostList() {
  try {
    const res = await fetch('/posts.json');
    if (!res.ok) {
      throw new Error('Cannot access posts.json');
    }
    const posts = await res.json();
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return posts;
  } catch (error) {
    console.error('Error fetching post list:', error);
    return [];
  }
}


async function fetchPost(file) {
  const cacheKey = `post_${file}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  try {
    const res = await fetch(`${BASE_URL}${file}`);
    if (!res.ok) {
      throw new Error('Post not found');
    }
    const text = await res.text();
    const lines = text.split('\n');
    const title = lines[0]?.trim() || '';
    const subtitle = lines[1]?.trim() || '';
    const tagsStr = lines[2]?.trim() || '';
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})_/);
    const date = dateMatch ? dateMatch[1] : '';
    const metadata = { title, subtitle, tags, date };
    const bodyLines = text.split('\n').slice(4);
    const body = bodyLines.join('\n').trim();
    const html = parseMarkdown(body);
    const post = { ...metadata, html };
    sessionStorage.setItem(cacheKey, JSON.stringify(post));
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Post missing');
  }
}

function parseMarkdown(text) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
  let output = '';
  for (const para of paragraphs) {
    const lines = para.split('\n').map(l => l.trimStart());
    const isBlockquote = lines.every(l => l.startsWith('> '));
    let content;
    if (isBlockquote) {
      content = lines.map(l => l.slice(2).trim()).join(' ');
    } else {
      content = lines.join(' ');
    }
    content = processInline(content);
    if (isBlockquote) {
      output += `<blockquote><p>${content}</p></blockquote>\n`;
    } else {
      output += `<p>${content}</p>\n`;
    }
  }
  return output;
}

function processInline(text) {
  text = text.replace(/\[([^\]]*)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  return text;
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  document.body.classList.toggle('dark', newTheme === 'dark');
}

// Expose functions globally for non-module use if needed, but primarily for import
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchPostList, fetchPost, toggleTheme, parseMarkdown };
} else {
  window.loader = { fetchPostList, fetchPost, toggleTheme, parseMarkdown };
}