const RYOKAN_PRODUCTS = [
  { id: 'shampoo',   name: 'アミノ酸シャンプー',             price: 1800, emoji: '🧴', color: '#dfae6c',
    desc: '大浴場でご好評をいただいている、地元ハーブ配合のアミノ酸シャンプーです。髪と頭皮にやさしい洗い上がり。' },
  { id: 'treatment', name: 'ダマスクローズ トリートメント', price: 2000, emoji: '💆', color: '#c98a8a',
    desc: 'ダマスクローズの香りに包まれる、しっとりまとまるヘアトリートメントです。' },
  { id: 'lotion',    name: '温泉化粧水',                     price: 2500, emoji: '💧', color: '#8fb3c9',
    desc: '当館の温泉水をベースにした、しっとり肌なじみの良い化粧水です。' },
  { id: 'bathsalt',  name: '入浴剤（湯の音ブレンド）',       price: 1200, emoji: '♨️', color: '#7fae7a',
    desc: 'ご自宅でも当館の湯浴み気分を。オリジナルブレンドの入浴剤です。' },
  { id: 'towel',     name: '今治産 フェイスタオル',          price: 2200, emoji: '🧺', color: '#b79ccf',
    desc: '肌触りの良い今治産タオル。館内で使用しているものと同じシリーズです。' }
];

const RyokanStore = (function(){
  const POSTS_KEY = 'ryokanApp.posts';

  function getProducts() {
    return RYOKAN_PRODUCTS;
  }

  function getProductById(id) {
    return RYOKAN_PRODUCTS.find(p => p.id === id) || null;
  }

  function loadPosts() {
    try {
      return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    } catch (err) {
      return [];
    }
  }

  function savePosts(posts) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  function addPost({ name, caption, image }) {
    const posts = loadPosts();
    posts.unshift({
      id: Date.now(),
      name: name || 'ゲスト',
      caption: caption || '',
      image: image,
      likes: 0,
      likedByMe: false,
      comments: [],
      createdAt: new Date().toISOString()
    });
    savePosts(posts);
    return posts;
  }

  function toggleLike(postId) {
    const posts = loadPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return posts;
    post.likedByMe = !post.likedByMe;
    post.likes = Math.max(0, post.likes + (post.likedByMe ? 1 : -1));
    savePosts(posts);
    return posts;
  }

  function addComment(postId, { name, text }) {
    const posts = loadPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return posts;
    post.comments.push({
      id: Date.now(),
      name: name || 'ゲスト',
      text: text,
      createdAt: new Date().toISOString()
    });
    savePosts(posts);
    return posts;
  }

  function resizeImageToDataURL(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = objectUrl;
    });
  }

  function formatRelativeDate(iso) {
    const d = new Date(iso);
    const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diffMin < 1) return 'たった今';
    if (diffMin < 60) return diffMin + '分前';
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return diffHour + '時間前';
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  return {
    getProducts,
    getProductById,
    loadPosts,
    savePosts,
    addPost,
    toggleLike,
    addComment,
    resizeImageToDataURL,
    formatRelativeDate,
    escapeHtml
  };
})();
