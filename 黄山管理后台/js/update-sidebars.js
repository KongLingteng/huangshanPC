const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');

const files = [
    'index.html',
    'ugc.html',
    'post-detail.html',
    'asset-audit.html',
    'material-library.html',
    'take-down-requests.html',
    'material-usage.html',
    'asset-detail.html',
    'finance.html',
    'user-list.html',
    'user-audit.html',
    'user-groups.html',
    'orders.html',
    'contracts.html',
    'settings.html',
    'announcements.html',
    'sys-user.html',
    'sys-role.html',
    'sys-menu.html',
    'sys-dept.html',
    'sys-post.html'
];

function getActiveMap(filename) {
    const active = {
        index: '',
        ugc: '',
        asset: '',
        finance: '',
        user: '',
        order: '',
        contract: '',
        settings: '',
        sys: ''
    };

    if (filename === 'index.html') {
        active.index = 'active';
    } else if (filename === 'ugc.html' || filename === 'post-detail.html') {
        active.ugc = 'active';
    } else if (['asset-audit.html', 'material-library.html', 'take-down-requests.html', 'material-usage.html', 'asset-detail.html'].includes(filename)) {
        active.asset = 'active';
    } else if (filename === 'finance.html') {
        active.finance = 'active';
    } else if (['user-list.html', 'user-audit.html', 'user-groups.html'].includes(filename)) {
        active.user = 'active';
    } else if (filename === 'orders.html') {
        active.order = 'active';
    } else if (filename === 'contracts.html') {
        active.contract = 'active';
    } else if (['settings.html', 'announcements.html'].includes(filename)) {
        active.settings = 'active';
    } else if (['sys-user.html', 'sys-role.html', 'sys-menu.html', 'sys-dept.html', 'sys-post.html'].includes(filename)) {
        active.sys = 'active';
    }
    return active;
}

files.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const active = getActiveMap(file);

    const newSidebar = `<!-- PRIMARY LEFT SIDEBAR -->
            <aside class="left-sidebar">
                <div class="nav-group-top">
                    <a href="index.html" class="nav-item ${active.index}">
                        <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                        <span>首页</span>
                    </a>
                    <a href="ugc.html" class="nav-item ${active.ugc}">
                        <svg viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>
                        <span>社区运营</span>
                    </a>
                    <a href="asset-audit.html" class="nav-item ${active.asset}">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        <span>素材管理</span>
                    </a>
                    <a href="finance.html" class="nav-item ${active.finance}">
                        <svg viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                        <span>提现管理</span>
                    </a>
                    <a href="user-list.html" class="nav-item ${active.user}">
                        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        <span>用户管理</span>
                    </a>
                    <a href="orders.html" class="nav-item ${active.order}">
                        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                        <span>订单管理</span>
                    </a>
                    <a href="contracts.html" class="nav-item ${active.contract}">
                        <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                        <span>合同配置</span>
                    </a>
                    <a href="settings.html" class="nav-item ${active.settings}">
                        <svg viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69-.98l.38-2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
                        <span>系统设置</span>
                    </a>
                    <a href="sys-user.html" class="nav-item ${active.sys}">
                        <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                        <span>系统管理</span>
                    </a>
                </div>
            </aside>`;

    // Replace <aside class="left-sidebar"> ... </aside>
    const regex = /<!-- PRIMARY LEFT SIDEBAR -->\s*<aside class="left-sidebar">([\s\S]*?)<\/aside>/;
    if (regex.test(content)) {
        content = content.replace(regex, newSidebar);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated sidebar for: ${file}`);
    } else {
        // Try simple aside matching if comment not present
        const simpleRegex = /<aside class="left-sidebar">([\s\S]*?)<\/aside>/;
        if (simpleRegex.test(content)) {
            content = content.replace(simpleRegex, newSidebar);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated sidebar (simple match) for: ${file}`);
        } else {
            console.log(`Sidebar not found in: ${file}`);
        }
    }
});
