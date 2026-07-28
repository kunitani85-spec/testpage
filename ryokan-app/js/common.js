function renderBottomNav(active) {
  const items = [
    { key: 'home', href: 'index.html', label: 'ホーム',
      icon: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9h12v-9"/>' },
    { key: 'shop', href: 'shop.html', label: '館内商品',
      icon: '<path d="M4 8h16l-1.5 11a2 2 0 01-2 2H7.5a2 2 0 01-2-2L4 8z"/><path d="M8 8V6a4 4 0 018 0v2"/>' },
    { key: 'post', href: 'post.html', label: '投稿する',
      icon: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>' },
    { key: 'community', href: 'community.html', label: 'タイムライン',
      icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/>' }
  ];

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = items.map(item => (
    '<a href="' + item.href + '" class="' + (item.key === active ? 'active' : '') + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + item.icon + '</svg>' +
      '<span>' + item.label + '</span>' +
    '</a>'
  )).join('');
  document.body.appendChild(nav);
}
