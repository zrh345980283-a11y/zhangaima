// 细胞里的靖边 - 主页面JavaScript功能
class CellMuseum {
    constructor() {
        this.currentModule = 'basic-knowledge';
        this.searchData = {
            'basic-knowledge': ['细胞膜', '细胞质', '细胞核', '线粒体', '叶绿体', '内质网', '高尔基体', '核糖体', '溶酶体', '中心体', '液泡', '细胞壁'],
            'guide-plans': ['导学案', '学习计划', '教学目标', '教学重点', '教学难点', '课堂活动', '课后练习'],
            'drawings': ['细胞结构图', '细胞器绘图', '显微镜绘图', '生物绘图', '科学绘图', '手绘细胞', '细胞分裂图'],
            'models': ['细胞模型', '3D模型', '纸质模型', '塑料模型', '立体模型', '手工模型', '细胞结构模型']
        };
        this.init();
    }

    init() {
        this.setupLoadingAnimation();
        this.setupNavigation();
        this.setupSearch();
        this.setupResponsive();
    }

    // 页面加载动画
    setupLoadingAnimation() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                const mainContainer = document.getElementById('main-container');
                
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        mainContainer.classList.add('loaded');
                        this.addFadeInAnimation();
                    }, 500);
                }
            }, 1000);
        });
    }

    // 添加淡入动画
    addFadeInAnimation() {
        const elements = document.querySelectorAll('.header, .sidebar, .main-content, .footer');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in-up');
            }, index * 200);
        });
    }

    // 设置导航功能
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentFrame = document.getElementById('content-frame');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 移除所有活动状态
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // 添加当前活动状态
                item.classList.add('active');
                
                // 获取模块名称
                const moduleName = item.dataset.module;
                this.currentModule = moduleName;
                
                // 更新iframe内容
                this.loadModule(moduleName);
                
                // 添加切换动画
                this.addModuleTransition();
            });
        });
    }

    // 加载模块
    loadModule(moduleName) {
        const contentFrame = document.getElementById('content-frame');
        const moduleUrl = `modules/${moduleName}/index.html`;
        
        // 添加加载效果
        contentFrame.style.opacity = '0.5';
        
        // 更新iframe源
        contentFrame.src = moduleUrl;
        
        // 监听加载完成
        contentFrame.onload = () => {
            contentFrame.style.opacity = '1';
            this.addModuleTransition();
        };
    }

    // 模块切换动画
    addModuleTransition() {
        const contentFrame = document.getElementById('content-frame');
        contentFrame.style.transform = 'scale(0.95)';
        contentFrame.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        
        setTimeout(() => {
            contentFrame.style.transform = 'scale(1)';
        }, 100);
    }

    // 设置搜索功能
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        const performSearch = () => {
            const query = searchInput.value.trim().toLowerCase();
            
            if (query.length === 0) {
                this.clearSearchResults();
                return;
            }
            
            if (query.length < 2) {
                this.showSearchMessage('请输入至少2个字符进行搜索');
                return;
            }
            
            this.search(query);
        };
        
        // 搜索按钮点击事件
        searchBtn.addEventListener('click', performSearch);
        
        // 输入框回车事件
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // 输入框输入事件（防抖）
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (searchInput.value.trim().length >= 2) {
                    performSearch();
                } else {
                    this.clearSearchResults();
                }
            }, 500);
        });
    }

    // 搜索功能
    search(query) {
        const results = [];
        
        // 在所有模块中搜索
        Object.keys(this.searchData).forEach(module => {
            const items = this.searchData[module];
            const matches = items.filter(item => 
                item.toLowerCase().includes(query)
            );
            
            if (matches.length > 0) {
                results.push({
                    module: module,
                    moduleName: this.getModuleDisplayName(module),
                    matches: matches
                });
            }
        });
        
        if (results.length > 0) {
            this.displaySearchResults(results, query);
        } else {
            this.showSearchMessage(`未找到与"${query}"相关的内容`);
        }
    }

    // 获取模块显示名称
    getModuleDisplayName(module) {
        const names = {
            'basic-knowledge': '细胞知识馆',
            'guide-plans': '导学案展厅',
            'drawings': '绘图作品馆',
            'models': '细胞模型馆'
        };
        return names[module] || module;
    }

    // 显示搜索结果
    displaySearchResults(results, query) {
        // 如果当前模块有搜索结果，直接跳转到该模块
        const currentModuleResult = results.find(r => r.module === this.currentModule);
        
        if (currentModuleResult) {
            this.highlightSearchResultsInFrame(query);
            this.showSearchMessage(`在当前模块找到 ${currentModuleResult.matches.length} 个相关结果`);
        } else {
            // 建议跳转到有结果的模块
            const firstResult = results[0];
            this.suggestModuleSwitch(firstResult.module, firstResult.moduleName, query);
        }
    }

    // 在iframe中高亮搜索结果
    highlightSearchResultsInFrame(query) {
        const iframe = document.getElementById('content-frame');
        
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const content = iframeDoc.body.innerHTML;
            
            // 简单的文本高亮（可以根据需要扩展）
            const highlightedContent = content.replace(
                new RegExp(`(${query})`, 'gi'),
                '<span class="search-highlight">$1</span>'
            );
            
            iframeDoc.body.innerHTML = highlightedContent;
        } catch (e) {
            // 跨域问题或其他错误，静默处理
            console.log('无法在iframe中高亮搜索结果');
        }
    }

    // 建议模块切换
    suggestModuleSwitch(module, moduleName, query) {
        const message = `在${moduleName}中找到相关结果，是否切换到该模块？`;
        
        if (confirm(message)) {
            // 切换到目标模块
            const targetNavItem = document.querySelector(`[data-module="${module}"]`);
            if (targetNavItem) {
                targetNavItem.click();
                
                // 延迟搜索高亮
                setTimeout(() => {
                    this.highlightSearchResultsInFrame(query);
                }, 1000);
            }
        }
    }

    // 显示搜索消息
    showSearchMessage(message) {
        // 创建临时消息元素
        const messageEl = document.createElement('div');
        messageEl.className = 'search-message';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: #00ACC1;
            color: white;
            padding: 12px 20px;
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
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }

    // 清除搜索结果
    clearSearchResults() {
        // 清除iframe中的高亮
        const iframe = document.getElementById('content-frame');
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const highlights = iframeDoc.querySelectorAll('.search-highlight');
            highlights.forEach(highlight => {
                const parent = highlight.parentNode;
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            });
        } catch (e) {
            // 跨域问题，静默处理
        }
    }

    // 响应式设计
    setupResponsive() {
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.adjustLayout();
        });
        
        // 初始调整
        this.adjustLayout();
    }

    // 调整布局
    adjustLayout() {
        const width = window.innerWidth;
        const sidebar = document.querySelector('.sidebar');
        const navMenu = document.querySelector('.nav-menu');
        
        if (width <= 768) {
            // 移动端布局调整
            sidebar.style.position = 'static';
            navMenu.style.display = 'flex';
            navMenu.style.overflowX = 'auto';
        } else {
            // 桌面端布局
            sidebar.style.position = 'sticky';
            navMenu.style.display = 'block';
            navMenu.style.overflowX = 'visible';
        }
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
}

// 添加CSS动画样式
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .content-frame {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new CellMuseum();
});

// 暴露全局对象供其他模块使用
window.CellMuseum = CellMuseum;