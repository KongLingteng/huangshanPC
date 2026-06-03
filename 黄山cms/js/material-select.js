const MaterialSelector = {
    modalHtml: `
<div id="materialSelectModal" class="modal-overlay">
    <div class="modal-card material-select-modal">
        <div class="modal-header">
            <h3>选择素材</h3>
            <button type="button" class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body">
            <!-- Left Panel: Folder Tree -->
            <div class="material-left-panel">
                <div class="tree-search-wrapper">
                    <svg class="search-icon" viewBox="0 0 24 24" style="left:8px; width:12px; height:12px; fill:var(--text-muted);">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <input type="text" id="treeSearchInput" placeholder="搜索文件夹">
                </div>
                <div class="material-tree" id="folderTreeView">
                    <!-- Dynamically generated tree nodes -->
                </div>
            </div>
            <!-- Right Panel: Filters + Card Grid -->
            <div class="material-right-panel">
                <div class="material-filters-bar">
                    <div class="filters-left-group">
                        <div class="filter-dropdown-selector">
                            <span>类型</span>
                            <select id="filterType">
                                <option value="">全部</option>
                                <option value="图片">图片</option>
                                <option value="视频">视频</option>
                                <option value="文章">文章</option>
                            </select>
                        </div>
                        <div class="filter-dropdown-selector">
                            <span>格式</span>
                            <select id="filterFormat">
                                <option value="">全部</option>
                                <option value="png">png</option>
                                <option value="jpg">jpg</option>
                                <option value="mp4">mp4</option>
                                <option value="doc">doc</option>
                                <option value="pdf">pdf</option>
                                <option value="txt">txt</option>
                            </select>
                        </div>
                        <div class="filter-dropdown-selector">
                            <span>标签</span>
                            <select id="filterTag">
                                <option value="">全部</option>
                                <option value="全景">全景</option>
                                <option value="写实">写实</option>
                                <option value="极简">极简</option>
                                <option value="水墨">水墨</option>
                            </select>
                        </div>
                        <div class="filter-dropdown-selector">
                            <span>有效期</span>
                            <select id="filterValidity">
                                <option value="">全部</option>
                                <option value="有效">有效</option>
                                <option value="失效">失效</option>
                            </select>
                        </div>
                    </div>
                    <div class="search-bar-right">
                        <svg class="search-icon" viewBox="0 0 24 24" style="left:8px; width:12px; height:12px; fill:var(--text-muted);">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                        <input type="text" id="materialSearchInput" placeholder="搜索">
                    </div>
                </div>
                <!-- Cards Grid -->
                <div class="material-cards-grid" id="materialCardsGrid">
                    <!-- Rendered dynamically -->
                </div>
            </div>
        </div>
        <div class="modal-footer material-footer">
            <div class="material-selection-summary">
                已选 <span id="selectedCountText">0/0</span> 项
            </div>
            <div class="modal-footer-btns">
                <button type="button" class="btn cancel-btn">取消</button>
                <button type="button" class="btn btn-primary confirm-btn">确定</button>
            </div>
        </div>
    </div>
</div>
`,
    config: {
        singleSelect: false,
        selectedIds: [],
        onConfirm: null
    },
    
    // UI states
    selectedMaterialIds: [],
    activeFolder: '',
    collapsedNodes: {},
    allMaterials: [],
    filteredMaterials: [],

    init() {
        if (document.getElementById('materialSelectModal')) return;
        
        const div = document.createElement('div');
        div.innerHTML = this.modalHtml.trim();
        document.body.appendChild(div.firstElementChild);
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('treeSearchInput').oninput = () => this.filterFolderTree();
        document.getElementById('filterType').onchange = () => this.filterMaterials();
        document.getElementById('filterFormat').onchange = () => this.filterMaterials();
        document.getElementById('filterTag').onchange = () => this.filterMaterials();
        document.getElementById('filterValidity').onchange = () => this.filterMaterials();
        document.getElementById('materialSearchInput').oninput = () => this.filterMaterials();
    },

    open(config) {
        this.config = {
            singleSelect: false,
            selectedIds: [],
            onConfirm: null,
            ...config
        };

        // Clone/initialize selection state
        this.selectedMaterialIds = [...this.config.selectedIds];
        this.activeFolder = '';
        this.collapsedNodes = {};

        // Make sure component markup is loaded and appended
        this.init();

        // Reset filter elements to default
        document.getElementById('filterType').value = '';
        document.getElementById('filterFormat').value = '';
        document.getElementById('filterTag').value = '';
        document.getElementById('filterValidity').value = '';
        document.getElementById('materialSearchInput').value = '';
        document.getElementById('treeSearchInput').value = '';

        // Bind Confirm button
        const confirmBtn = document.querySelector('#materialSelectModal .confirm-btn');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                if (this.config.onConfirm) {
                    this.config.onConfirm(this.selectedMaterialIds);
                }
                this.close();
            };
        }

        // Bind Cancel & Close buttons
        const closeBtns = document.querySelectorAll('#materialSelectModal .cancel-btn, #materialSelectModal .modal-close-btn');
        closeBtns.forEach(btn => {
            btn.onclick = () => this.close();
        });

        // Initial render
        this.renderFolderTree();
        this.filterMaterials();

        // Show Modal
        document.getElementById('materialSelectModal').classList.add('active');
    },

    close() {
        const modal = document.getElementById('materialSelectModal');
        if (modal) modal.classList.remove('active');
    },

    renderFolderTree() {
        const folders = [
            { name: '全部资产', path: '', level: 0, isParent: true },
            { name: 'Standard Dataset in LibCity', path: 'Standard Dataset in LibCity', level: 1, isParent: true },
            { name: 'AUSTINRIDE20160701-20', path: 'Standard Dataset in LibCity/AUSTINRIDE20160701-20', level: 2 },
            { name: 'BEIJING_SUBWAY_10MIN', path: 'Standard Dataset in LibCity/BEIJING_SUBWAY_10MIN', level: 2 },
            { name: 'BEIJING_SUBWAY_15MIN', path: 'Standard Dataset in LibCity/BEIJING_SUBWAY_15MIN', level: 2 },
            { name: 'BEIJING_SUBWAY_30MIN', path: 'Standard Dataset in LibCity/BEIJING_SUBWAY_30MIN', level: 2 },
            { name: 'BIKECHI202007-202009', path: 'Standard Dataset in LibCity/BIKECHI202007-202009', level: 2 },
            { name: 'BIKECHI202007-202009-3', path: 'Standard Dataset in LibCity/BIKECHI202007-202009-3', level: 2 },
            { name: 'BIKEDC202007-202009', path: 'Standard Dataset in LibCity/BIKEDC202007-202009', level: 2 },
            { name: 'Beijing_Taxi_Sample', path: 'Standard Dataset in LibCity/Beijing_Taxi_Sample', level: 2 },
            { name: 'CHICAGO_RISK', path: 'Standard Dataset in LibCity/CHICAGO_RISK', level: 2 },
            { name: 'Chengdu_Taxi_Sample1', path: 'Standard Dataset in LibCity/Chengdu_Taxi_Sample1', level: 2 },
            { name: 'Global', path: 'Standard Dataset in LibCity/Global', level: 2 },
            { name: 'HZMETRO', path: 'Standard Dataset in LibCity/HZMETRO', level: 2 },
            { name: 'LOOP_SEATTLE', path: 'Standard Dataset in LibCity/LOOP_SEATTLE', level: 2 }
        ];

        const searchVal = document.getElementById('treeSearchInput').value.trim().toLowerCase();
        const container = document.getElementById('folderTreeView');
        if (!container) return;
        
        container.innerHTML = '';

        const filteredFolders = folders.filter(f => {
            if (!searchVal) return true;
            return f.name.toLowerCase().includes(searchVal);
        });

        container.innerHTML = filteredFolders.map(f => {
            const isActive = this.activeFolder === f.path;
            const indent = f.level * 14;
            const isCollapsed = this.collapsedNodes[f.path] || false;
            
            let arrowSvg = '';
            if (f.isParent) {
                arrowSvg = `<svg class="arrow-icon" onclick="MaterialSelector.toggleNodeCollapse('${f.path}', event)" style="width:12px; height:12px; fill:var(--text-light); cursor:pointer; margin-right:4px; transition: transform 0.2s; ${isCollapsed ? 'transform:rotate(-90deg);' : ''}">
                    <path d="M7 10l5 5 5-5z"/>
                </svg>`;
            } else {
                arrowSvg = `<span style="width:16px; display:inline-block;"></span>`;
            }

            let iconSvg = '';
            if (f.path === '') {
                iconSvg = `<svg class="node-icon" viewBox="0 0 24 24" style="width:14px; height:14px; fill:#1e90ff; margin-right:4px;"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0-2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>`;
            } else {
                iconSvg = `<svg class="node-icon" viewBox="0 0 24 24" style="width:14px; height:14px; fill:#3b82f6; margin-right:4px;"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`;
            }

            let showNode = true;
            if (f.level > 0) {
                const parts = f.path.split('/');
                if (parts.length > 1) {
                    const parentPath = parts.slice(0, parts.length - 1).join('/');
                    if (this.collapsedNodes[parentPath]) showNode = false;
                }
            }
            if (f.level > 1 && this.collapsedNodes['Standard Dataset in LibCity']) {
                showNode = false;
            }

            if (!showNode) return '';

            return `
                <div class="tree-node-row ${isActive ? 'active' : ''}" 
                     style="padding-left: ${indent}px; display: flex; align-items: center;"
                     onclick="MaterialSelector.selectFolder('${f.path}')">
                    ${arrowSvg}
                    ${iconSvg}
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">${f.name}</span>
                </div>
            `;
        }).join('');
    },

    toggleNodeCollapse(path, event) {
        event.stopPropagation();
        this.collapsedNodes[path] = !this.collapsedNodes[path];
        this.renderFolderTree();
    },

    selectFolder(path) {
        this.activeFolder = path;
        this.renderFolderTree();
        this.filterMaterials();
    },

    filterFolderTree() {
        this.renderFolderTree();
    },

    filterMaterials() {
        this.allMaterials = dbGet('hscms_materials', DEFAULT_MATERIALS);
        
        const typeFilter = document.getElementById('filterType').value;
        const formatFilter = document.getElementById('filterFormat').value;
        const tagFilter = document.getElementById('filterTag').value;
        const validityFilter = document.getElementById('filterValidity').value;
        const searchVal = document.getElementById('materialSearchInput').value.trim().toLowerCase();

        this.filteredMaterials = this.allMaterials.filter(m => {
            if (this.activeFolder) {
                if (m.folder !== this.activeFolder && !m.folder.startsWith(this.activeFolder + '/')) {
                    return false;
                }
            }
            if (typeFilter && m.type !== typeFilter) return false;
            if (formatFilter && m.format !== formatFilter) return false;
            if (tagFilter && m.tag !== tagFilter) return false;
            if (validityFilter && m.validity !== validityFilter) return false;
            if (searchVal && !m.name.toLowerCase().includes(searchVal)) return false;
            return true;
        });

        this.renderMaterialsGrid();
    },

    renderMaterialsGrid() {
        const grid = document.getElementById('materialCardsGrid');
        if (!grid) return;
        
        if (this.filteredMaterials.length === 0) {
            grid.innerHTML = `
                <div class="empty-grid-placeholder" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width:100%; min-height: 200px; color: var(--text-light); gap: 12px;">
                    <svg viewBox="0 0 24 24" style="width: 48px; height: 48px; fill: currentColor;">
                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"/>
                    </svg>
                    <span>暂无匹配的素材</span>
                </div>
            `;
            document.getElementById('selectedCountText').textContent = `0/${this.allMaterials.length}`;
            return;
        }

        grid.innerHTML = this.filteredMaterials.map(m => {
            const isSelected = this.selectedMaterialIds.includes(m.id);
            
            const iconTypeSvg = m.type === '图片' 
                ? `<svg viewBox="0 0 24 24" style="fill:#10b981; width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 9l2.29 2.29-4.88 4.88 1.42 1.42 4.88-4.88L20 15V9h-6z"/></svg>`
                : (m.type === '视频'
                    ? `<svg viewBox="0 0 24 24" style="fill:#86198f; width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-9 11V9l5 3-5 3z"/></svg>`
                    : `<svg viewBox="0 0 24 24" style="fill:#f59e0b; width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`);
            
            const isVideo = m.type === '视频';
            const playButton = isVideo 
                ? `<div class="card-video-play" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: white;">
                       <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>
                   </div>` 
                : '';

            let previewBg = '';
            let artworkHtml = '';
            if (m.type === '图片') {
                if (m.name.includes('bike')) {
                    previewBg = `background: linear-gradient(135deg, #0284c7 0%, #075985 100%);`;
                    artworkHtml = `<svg viewBox="0 0 100 60" style="position:absolute; width:55%; height:55%; top:22.5%; left:22.5%; opacity:0.8; stroke:#ffffff; stroke-width:3; fill:none; stroke-linecap:round; stroke-linejoin:round;"><circle cx="25" cy="40" r="10" /><circle cx="75" cy="40" r="10" /><polyline points="25,40 45,40 55,22 75,40" /><polyline points="45,40 40,25 58,25" /><line x1="55" y1="22" x2="52" y2="16" /><line x1="75" y1="40" x2="70" y2="25" /><line x1="65" y1="25" x2="75" y2="25" /></svg>`;
                } else {
                    previewBg = `background: linear-gradient(135deg, #0d9488 0%, #115e59 100%);`;
                    artworkHtml = `<svg viewBox="0 0 100 60" style="position:absolute; width:45%; height:45%; top:27.5%; left:27.5%; opacity:0.8; fill:#ffffff;"><path d="M10 5v50h60V5H10zm50 40H20V10h40v35z" /><rect x="25" y="16" width="30" height="3" /><rect x="25" y="24" width="30" height="3" /><rect x="25" y="32" width="20" height="3" /></svg>`;
                }
            } else if (m.type === '视频') {
                previewBg = `background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);`;
                artworkHtml = `<svg viewBox="0 0 100 60" style="position:absolute; width:50%; height:50%; top:25%; left:25%; opacity:0.8; fill:#ffffff;"><rect x="10" y="10" width="80" height="40" rx="4" /><path d="M44 23l16 7-16 7z" fill="#000000" /></svg>`;
            } else { // 文章
                previewBg = `background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);`;
                artworkHtml = `<svg viewBox="0 0 100 60" style="position:absolute; width:40%; height:40%; top:30%; left:30%; opacity:0.8; fill:#ffffff;"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`;
            }

            return `
                <div class="material-card-item ${isSelected ? 'selected' : ''}" onclick="MaterialSelector.toggleMaterialSelection('${m.id}')" style="cursor: pointer; position: relative;">
                    <div class="card-preview-box" style="height: 100px; position: relative; overflow: hidden; border-radius: 6px; ${previewBg}">
                        ${artworkHtml}
                        <div class="card-checkbox-badge" style="position: absolute; top: 8px; right: 8px; width: 18px; height: 18px; border-radius: 50%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white;">
                            <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; fill: currentColor;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        </div>
                        ${playButton}
                        <div class="card-zoom-hover" onclick="MaterialSelector.previewMaterial('${m.id}', event)" style="position: absolute; bottom: 8px; right: 8px; cursor: pointer; color: white; opacity: 0.6; width: 16px; height: 16px;">
                            <svg viewBox="0 0 24 24" style="fill: currentColor; width:100%; height:100%;"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        </div>
                    </div>
                    <div class="card-info-box" style="padding: 8px; font-size:12px;">
                        <div class="card-title-line" style="display: flex; align-items: center; justify-content: space-between; overflow:hidden;">
                            <span class="card-title-text" title="${m.name}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight:600;">${iconTypeSvg}${m.name}</span>
                        </div>
                        <div class="card-date-text" style="color: var(--text-light); font-size: 10px; margin-top:4px;">${m.time}</div>
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById('selectedCountText').textContent = `${this.selectedMaterialIds.length}/${this.allMaterials.length}`;
    },

    toggleMaterialSelection(id) {
        if (this.config.singleSelect) {
            // Single Select logic
            if (this.selectedMaterialIds.includes(id)) {
                this.selectedMaterialIds = [];
            } else {
                this.selectedMaterialIds = [id];
            }
        } else {
            // Multi-Select logic
            const idx = this.selectedMaterialIds.indexOf(id);
            if (idx > -1) {
                this.selectedMaterialIds.splice(idx, 1);
            } else {
                this.selectedMaterialIds.push(id);
            }
        }
        this.renderMaterialsGrid();
    },

    previewMaterial(id, event) {
        event.stopPropagation();
        const materials = dbGet('hscms_materials', DEFAULT_MATERIALS);
        const material = materials.find(m => m.id === id);
        if (material) {
            showLockToast(`查看素材: ${material.name} [${material.format}]`, true);
        }
    }
};
