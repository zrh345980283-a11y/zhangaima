// 模块页面通用JavaScript功能
class ModuleBase {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupInteractions();
        this.setupScrollEffects();
        this.setupResponsive();
    }

    // 设置页面动画
    setupAnimations() {
        // 页面加载动画
        window.addEventListener('load', () => {
            this.animateElements();
        });

        // 滚动动画
        window.addEventListener('scroll', () => {
            this.handleScrollAnimations();
        });
    }

    // 元素动画
    animateElements() {
        const elements = document.querySelectorAll('.module-header, .content-section');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in');
            }, index * 200);
        });
    }

    // 滚动动画处理
    handleScrollAnimations() {
        const elements = document.querySelectorAll('.structure-card, .organelle-item, .quiz-card, .comparison-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('bounce-in');
            }
        });
    }

    // 设置交互效果
    setupInteractions() {
        // 卡片悬停效果
        const cards = document.querySelectorAll('.structure-card, .organelle-item, .quiz-card, .comparison-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addHoverEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeHoverEffect(card);
            });
        });

        // 按钮点击效果
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.addClickEffect(e.target);
            });
        });
    }

    // 添加悬停效果
    addHoverEffect(element) {
        element.style.transform = 'translateY(-5px) scale(1.02)';
        element.style.boxShadow = '0 15px 35px rgba(0, 172, 193, 0.2)';
    }

    // 移除悬停效果
    removeHoverEffect(element) {
        element.style.transform = '';
        element.style.boxShadow = '';
    }

    // 添加点击效果
    addClickEffect(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    // 设置滚动效果
    setupScrollEffects() {
        // 平滑滚动
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // 滚动进度条
        this.createScrollProgress();
    }

    // 创建滚动进度条
    createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #00ACC1, #B2EBF2);
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // 设置响应式
    setupResponsive() {
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // 初始处理
        this.handleResize();
    }

    // 处理窗口大小变化
    handleResize() {
        const width = window.innerWidth;
        
        if (width <= 768) {
            this.setupMobileView();
        } else {
            this.setupDesktopView();
        }
    }

    // 移动端视图设置
    setupMobileView() {
        const cards = document.querySelectorAll('.structure-card, .organelle-item');
        cards.forEach(card => {
            card.style.margin = '10px 0';
        });
    }

    // 桌面端视图设置
    setupDesktopView() {
        const cards = document.querySelectorAll('.structure-card, .organelle-item');
        cards.forEach(card => {
            card.style.margin = '';
        });
    }

    // 工具方法：防抖
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 工具方法：节流
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 显示消息
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `module-message ${type}`;
        messageEl.textContent = message;
        
        const colors = {
            info: '#00ACC1',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };
        
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-size: 14px;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(messageEl);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    messageEl.parentNode.removeChild(messageEl);
                }, 300);
            }
        }, 3000);
    }

    // 添加加载动画
    addLoadingAnimation(element) {
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        
        const loader = document.createElement('div');
        loader.className = 'module-loader';
        loader.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
            animation: loading 1.5s infinite;
        `;
        
        element.appendChild(loader);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes loading {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // 移除加载动画
    removeLoadingAnimation(element) {
        const loader = element.querySelector('.module-loader');
        if (loader) {
            loader.remove();
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ModuleBase();
});

// 暴露全局对象供其他脚本使用
window.ModuleBase = ModuleBase;