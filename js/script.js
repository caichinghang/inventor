document.addEventListener('DOMContentLoaded', () => {
    // 导航链接平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 修复游戏卡片闪烁问题
    const gameCards = document.querySelectorAll('.game-card');
    
    // 首先将卡片设为可见以防止闪烁
    gameCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // 然后再设置过渡动画效果
    setTimeout(() => {
        gameCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
            card.style.transitionDelay = `${index * 0.2}s`;
        });
        
        // 强制浏览器重绘
        void document.documentElement.offsetHeight;
        
        // 添加进入视图动画
        gameCards.forEach((card) => {
            card.classList.add('in-view');
        });
    }, 100);
    
    // 滚动时显示元素动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 仅为其他元素添加动画效果
    document.querySelectorAll('.about-text p').forEach((p, index) => {
        p.style.opacity = '0';
        p.style.transform = 'translateY(20px)';
        p.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
        p.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(p);
    });

    document.querySelectorAll('.qr-code').forEach((qr, index) => {
        qr.style.opacity = '0';
        qr.style.transform = 'scale(0.9)';
        qr.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
        qr.style.transitionDelay = `${index * 0.3 + 0.5}s`;
        observer.observe(qr);
    });

    // 添加 .in-view 样式
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .game-card.in-view, .about-text p.in-view, .qr-code.in-view {
                opacity: 1 !important;
                transform: translateY(0) scale(1) !important;
            }
        </style>
    `);

    // 3D 海报倾斜效果
    const poster = document.getElementById('tiltPoster');
    if (poster) {
        const posterImg = poster.querySelector('img');
        
        poster.addEventListener('mousemove', (e) => {
            const rect = poster.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
            const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1
            
            posterImg.style.transform = `
                perspective(1000px)
                rotateY(${xPercent * 10}deg)
                rotateX(${-yPercent * 10}deg)
                scale(1.05)
            `;
            
            posterImg.style.boxShadow = `
                ${-xPercent * 20}px ${-yPercent * 20}px 30px rgba(0, 0, 0, 0.7)
            `;
        });
        
        poster.addEventListener('mouseleave', () => {
            posterImg.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
            posterImg.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        });
    }

    // 处理说明书"查看更多"按钮
    const viewMoreBtns = document.querySelectorAll('.view-more-btn');
    
    viewMoreBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 根据索引链接到不同的页面
            if (index === 0) {
                window.location.href = 'instruction1-more1.html';
            } else if (index === 1) {
                window.location.href = 'instruction1-more2.html';
            }
        });
    });

    // 汉堡菜单切换 - 修复移动端点击问题
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (menuToggle && mobileNav && menuOverlay) {
        console.log('Mobile menu elements found');
        
        // 确保菜单初始状态正确
        mobileNav.style.display = 'block';
        menuOverlay.style.display = 'none';
        
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu toggle clicked');
            
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            
            // 如果菜单已激活，显示覆盖层并禁止滚动
            if (mobileNav.classList.contains('active')) {
                console.log('Opening mobile menu');
                document.body.style.overflow = 'hidden';
                menuOverlay.style.display = 'block';
                mobileNav.style.right = '0'; // 强制设置位置
            } else {
                console.log('Closing mobile menu');
                document.body.style.overflow = '';
                // 使用setTimeout以允许过渡动画完成
                setTimeout(() => {
                    if (!mobileNav.classList.contains('active')) {
                        menuOverlay.style.display = 'none';
                    }
                }, 300);
                mobileNav.style.right = '-100%'; // 强制设置位置
            }
        });
        
        // 点击遮罩关闭菜单
        menuOverlay.addEventListener('click', () => {
            console.log('Overlay clicked');
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            mobileNav.style.right = '-100%'; // 强制设置位置
            
            // 使用setTimeout以允许过渡动画完成
            setTimeout(() => {
                if (!mobileNav.classList.contains('active')) {
                    menuOverlay.style.display = 'none';
                }
            }, 300);
        });
        
        // 点击移动菜单中的链接后关闭菜单
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('Mobile link clicked');
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
                mobileNav.style.right = '-100%'; // 强制设置位置
                
                // 使用setTimeout以允许过渡动画完成
                setTimeout(() => {
                    if (!mobileNav.classList.contains('active')) {
                        menuOverlay.style.display = 'none';
                    }
                }, 300);
            });
        });
    } else {
        console.error('Mobile menu elements not found:', {
            menuToggle: !!menuToggle,
            mobileNav: !!mobileNav,
            menuOverlay: !!menuOverlay
        });
    }
});
