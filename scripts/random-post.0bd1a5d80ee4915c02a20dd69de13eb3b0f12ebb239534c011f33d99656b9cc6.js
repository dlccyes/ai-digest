// Handle .random-post-link anchors: fetch the lightweight post index
// (postlist.json, URL in data-index) and jump to a random post.
// Optional data-section / data-tag attributes narrow the pool.
(function () {
  let postsPromise = null;

  function loadPosts(indexURL) {
    if (postsPromise === null) {
      postsPromise = fetch(indexURL)
        .then((res) => {
          if (!res.ok) throw new Error('failed to load ' + indexURL);
          return res.json();
        })
        .catch((err) => {
          postsPromise = null; // allow retry on the next click
          throw err;
        });
    }
    return postsPromise;
  }

  function goToRandomPost(e) {
    e.preventDefault();
    const link = e.currentTarget;
    const section = link.getAttribute('data-section');
    const tag = link.getAttribute('data-tag');
    loadPosts(link.getAttribute('data-index')).then((posts) => {
      let pool = posts.filter((p) => {
        if (section) return p.s === section;
        if (tag) return Array.isArray(p.t) && p.t.includes(tag);
        return true;
      });
      // prefer not to land on the page we're already on
      const others = pool.filter((p) => p.u !== window.location.pathname);
      if (others.length > 0) pool = others;
      if (pool.length === 0) return;
      window.location.href = pool[Math.floor(Math.random() * pool.length)].u;
    });
  }

  // both the desktop sidebar and the mobile drawer render the links
  document.querySelectorAll('.random-post-link').forEach((link) => {
    link.addEventListener('click', goToRandomPost);
  });
})();
