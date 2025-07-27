document.querySelectorAll('use').forEach(use => {
    const href = use.getAttribute('href');
    if (href.includes('sprite.svg')) {
        const [path, id] = href.split('#');
        use.setAttribute('href', `${path}?v=${Date.now()}#${id}`);
    }
});
