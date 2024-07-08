document.addEventListener("DOMContentLoaded", () => {
    const adminLoginLink = document.getElementById('adminLogin');
    const articlesList = document.getElementById('articles');
    const articleContentSection = document.getElementById('article-content');
    const articleListSection = document.getElementById('article-list');
    const backButton = document.getElementById('backButton');
    const saveButton = document.getElementById('saveButton');
    const addArticleButton = document.getElementById('addArticleButton');
    const imageUpload = document.getElementById('imageUpload');
    const articleImage = document.getElementById('articleImage');
    const addLinkButton = document.getElementById('addLinkButton');
    const addImageButton = document.getElementById('addImageButton');
    const deleteArticleButton = document.getElementById('deleteArticleButton');
    const formatBoldButton = document.getElementById('formatBold');
    const formatItalicButton = document.getElementById('formatItalic');
    const formatHeadingButton = document.getElementById('formatHeading');
    let articles = JSON.parse(localStorage.getItem('articles')) || [
        { id: '1', title: 'Заголовок статті 1', content: 'Тут буде текст першої статті...', imageUrl: '' },
        { id: '2', title: 'Заголовок статті 2', content: 'Тут буде текст другої статті...', imageUrl: '' }
    ];
    const adminPassword = "1111";

    function renderArticles() {
        articlesList.innerHTML = '';
        articles.forEach(article => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" data-id="${article.id}">${article.title}</a>`;
            if (article.imageUrl) {
                const img = document.createElement('img');
                img.src = article.imageUrl;
                li.insertBefore(img, li.firstChild); // Розмістити фото зліва
            }
            articlesList.appendChild(li);
        });
    }

    function loadArticles() {
        articles.forEach(article => {
            const savedTitle = localStorage.getItem(`article-${article.id}-title`);
            const savedContent = localStorage.getItem(`article-${article.id}-content`);
            const savedImage = localStorage.getItem(`article-${article.id}-image`);
            if (savedTitle) article.title = savedTitle;
            if (savedContent) article.content = savedContent;
            if (savedImage) article.imageUrl = savedImage;
        });
        renderArticles();
    }

    function enableEditing() {
        const article = articleContentSection.querySelector('article');
        article.querySelector('h2').contentEditable = "true";
        article.querySelector('p').contentEditable = "true";
        saveButton.style.display = "block";
        addArticleButton.style.display = "block";
        imageUpload.style.display = "block";
        addLinkButton.style.display = "block";
        addImageButton.style.display = "block";
        deleteArticleButton.style.display = "block";
        formatBoldButton.style.display = "block";
        formatItalicButton.style.display = "block";
        formatHeadingButton.style.display = "block";
    }

    function disableEditing() {
        const article = articleContentSection.querySelector('article');
        article.querySelector('h2').contentEditable = "false";
        article.querySelector('p').contentEditable = "false";
        saveButton.style.display = "none";
        addArticleButton.style.display = "none";
        imageUpload.style.display = "none";
        addLinkButton.style.display = "none";
        addImageButton.style.display = "none";
        deleteArticleButton.style.display = "none";
        formatBoldButton.style.display = "none";
        formatItalicButton.style.display = "none";
        formatHeadingButton.style.display = "none";
    }

    function showArticle(id) {
        const article = articles.find(a => a.id === id);
        if (article) {
            const articleElement = articleContentSection.querySelector('article');
            articleElement.setAttribute('data-id', article.id);
            articleElement.querySelector('h2').innerText = article.title;
            articleElement.querySelector('p').innerHTML = article.content; // HTML to support hyperlinks
            if (article.imageUrl) {
                articleImage.src = article.imageUrl;
                articleImage.style.display = 'block';
            } else {
                articleImage.style.display = 'none';
            }
            articleListSection.style.display = 'none';
            articleContentSection.style.display = 'block';
        }
    }

    function showArticleList() {
        articleListSection.style.display = 'block';
        articleContentSection.style.display = 'none';
    }

    function saveArticle() {
        const article = articleContentSection.querySelector('article');
        const id = article.getAttribute('data-id');
        const title = article.querySelector('h2').innerText;
        const content = article.querySelector('p').innerHTML;
        const imageUrl = articleImage.src;
        localStorage.setItem(`article-${id}-title`, title);
        localStorage.setItem(`article-${id}-content`, content);
        localStorage.setItem(`article-${id}-image`, imageUrl);
        const articleIndex = articles.findIndex(a => a.id === id);
        if (articleIndex !== -1) {
            articles[articleIndex].title = title;
            articles[articleIndex].content = content;
            articles[articleIndex].imageUrl = imageUrl;
        } else {
            articles.push({ id, title, content, imageUrl });
        }
        localStorage.setItem('articles', JSON.stringify(articles));
        renderArticles();
        alert('Стаття збережена!');
    }

    function addNewArticle() {
        const newId = (articles.length + 1).toString();
        const newArticle = { id: newId, title: 'Новий заголовок статті', content: 'Новий текст статті...', imageUrl: '' };
        articles.push(newArticle);
        renderArticles();
        showArticle(newId);
    }

    function deleteArticle() {
        const article = articleContentSection.querySelector('article');
        const id = article.getAttribute('data-id');
        articles = articles.filter(a => a.id !== id);
        localStorage.removeItem(`article-${id}-title`);
        localStorage.removeItem(`article-${id}-content`);
        localStorage.removeItem(`article-${id}-image`);
        localStorage.setItem('articles', JSON.stringify(articles));
        showArticleList();
        renderArticles();
        alert('Стаття видалена!');
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                articleImage.src = e.target.result;
                articleImage.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    }

    function addImage() {
        const url = prompt("Введіть URL зображення або виберіть файл:");
        if (url) {
            document.execCommand('insertImage', false, url);
        } else {
            imageUpload.click();
        }
    }

    function addHyperlink() {
        const url = prompt("Введіть URL для гіперпосилання:");
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    function formatText(command, value = null) {
        document.execCommand(command, false, value);
    }

    adminLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        const password = prompt("Введіть пароль адміністратора:");
        if (password === adminPassword) {
            enableEditing();
            alert("Ви увійшли в режим редагування.");
        } else {
            alert("Неправильний пароль!");
        }
    });

    articlesList.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const id = e.target.getAttribute('data-id');
            showArticle(id);
        }
    });

    backButton.addEventListener('click', showArticleList);
    saveButton.addEventListener('click', saveArticle);
    addArticleButton.addEventListener('click', addNewArticle);
    imageUpload.addEventListener('change', handleImageUpload);
    addLinkButton.addEventListener('click', addHyperlink);
    addImageButton.addEventListener('click', addImage);
    deleteArticleButton.addEventListener('click', deleteArticle);

    formatBoldButton.addEventListener('click', () => formatText('bold'));
    formatItalicButton.addEventListener('click', () => formatText('italic'));
    formatHeadingButton.addEventListener('click', () => formatText('formatBlock', 'h1'));

    loadArticles();
    disableEditing();
    showArticleList();
});
