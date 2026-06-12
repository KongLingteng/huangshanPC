const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');

// 1. Update sub-sidebar for system settings files
const settingsFiles = ['settings.html', 'announcements.html'];
settingsFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    let audit_active = "";
    let limit_active = "";
    let asset_reject_active = "";
    let post_shield_active = "";
    let split_active = "";
    let announcements_active = "";

    if (file === 'settings.html') {
        audit_active = "active";
    } else if (file === 'announcements.html') {
        announcements_active = "active";
    }

    const newSubbar = `<!-- SUB SIDEBAR (MIDDLE COLUMN) -->
            <aside class="sub-sidebar">
                <div class="sub-sidebar-title">
                    <span>系统设置</span>
                </div>
                <ul class="sub-nav-list">
                    <li class="sub-nav-item \${audit_active}" id="tabAuditNav">
                        <a href="settings.html?tab=audit">审核配置</a>
                    </li>
                    <li class="sub-nav-item \${limit_active}" id="tabLimitNav">
                        <a href="settings.html?tab=limit">AIGC额度管控</a>
                    </li>
                    <li class="sub-nav-item \${asset_reject_active}" id="tabAssetRejectNav">
                        <a href="settings.html?tab=asset-reject">素材驳回原因配置</a>
                    </li>
                    <li class="sub-nav-item \${post_shield_active}" id="tabPostShieldNav">
                        <a href="settings.html?tab=post-shield">帖子下架配置</a>
                    </li>
                    <li class="sub-nav-item \${split_active}" id="tabSplitNav">
                        <a href="settings.html?tab=split">分成策略配置</a>
                    </li>
                    <li class="sub-nav-item \${announcements_active}" id="tabAnnouncementsNav">
                        <a href="announcements.html">通知公告</a>
                    </li>
                </ul>
            </aside>`;

    const regex = /<!-- SUB SIDEBAR[\s\S]*?<\/aside>/;
    const simpleRegex = /<aside class="sub-sidebar">[\s\S]*?<\/aside>/;

    if (regex.test(content)) {
        content = content.replace(regex, newSubbar);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated subbar for: ${file}`);
    } else if (simpleRegex.test(content)) {
        content = content.replace(simpleRegex, newSubbar);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated subbar (simple match) for: ${file}`);
    } else {
        console.log(`Subbar not found in: ${file}`);
    }
});

// 2. Update sub-sidebar for system management files
const sysFiles = ['sys-user.html', 'sys-role.html', 'sys-menu.html', 'sys-dept.html', 'sys-post.html'];
sysFiles.forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    let user_active = "";
    let role_active = "";
    let menu_active = "";
    let dept_active = "";
    let post_active = "";

    if (file === 'sys-user.html') user_active = "active";
    else if (file === 'sys-role.html') role_active = "active";
    else if (file === 'sys-menu.html') menu_active = "active";
    else if (file === 'sys-dept.html') dept_active = "active";
    else if (file === 'sys-post.html') post_active = "active";

    const newSubbar = `<!-- SUB SIDEBAR (MIDDLE COLUMN) -->
            <aside class="sub-sidebar">
                <div class="sub-sidebar-title">
                    <span>系统管理</span>
                </div>
                <ul class="sub-nav-list">
                    <li class="sub-nav-item \${user_active}" id="tabSysUserNav">
                        <a href="sys-user.html">系统用户管理</a>
                    </li>
                    <li class="sub-nav-item \${role_active}" id="tabSysRoleNav">
                        <a href="sys-role.html">角色管理</a>
                    </li>
                    <li class="sub-nav-item \${menu_active}" id="tabSysMenuNav">
                        <a href="sys-menu.html">菜单管理</a>
                    </li>
                    <li class="sub-nav-item \${dept_active}" id="tabSysDeptNav">
                        <a href="sys-dept.html">部门管理</a>
                    </li>
                    <li class="sub-nav-item \${post_active}" id="tabSysPostNav">
                        <a href="sys-post.html">岗位管理</a>
                    </li>
                </ul>
            </aside>`;

    const regex = /<!-- SUB SIDEBAR[\s\S]*?<\/aside>/;
    const simpleRegex = /<aside class="sub-sidebar">[\s\S]*?<\/aside>/;

    if (regex.test(content)) {
        content = content.replace(regex, newSubbar);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated sys subbar for: ${file}`);
    } else if (simpleRegex.test(content)) {
        content = content.replace(simpleRegex, newSubbar);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated sys subbar (simple match) for: ${file}`);
    } else {
        console.log(`Sys subbar not found in: ${file}`);
    }
});
