# 1. Update sub-sidebar for system settings files
$settingsFiles = @('settings.html', 'announcements.html')
foreach ($file in $settingsFiles) {
    $filePath = Join-Path "C:\Users\Administrator\Desktop\project\黄山CMS和管理后台\黄山管理后台" $file
    if (-not (Test-Path $filePath)) {
        Write-Host "File not found: $file"
        continue
    }

    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    $startTag = "<aside class=`"sub-sidebar`">"
    $startIndex = $content.IndexOf($startTag)
    if ($startIndex -lt 0) {
        Write-Host "Subbar start tag not found in $file"
        continue
    }

    $endTag = "</aside>"
    $endIndex = $content.IndexOf($endTag, $startIndex)
    if ($endIndex -lt 0) {
        Write-Host "Subbar end tag not found in $file"
        continue
    }

    $endIndex += $endTag.Length

    $commentTag = "<!-- SUB SIDEBAR"
    $commentIndex = $content.IndexOf($commentTag)
    $replaceStart = $startIndex
    if ($commentIndex -ge 0 -and $commentIndex -lt $startIndex -and ($startIndex - $commentIndex) -le 80) {
        $replaceStart = $commentIndex
    }

    $audit_active = ""
    $limit_active = ""
    $asset_reject_active = ""
    $post_shield_active = ""
    $split_active = ""
    $announcements_active = ""

    if ($file -eq "settings.html") {
        $audit_active = "active"
    } elseif ($file -eq "announcements.html") {
        $announcements_active = "active"
    }

    $newSubbar = @"
<!-- SUB SIDEBAR (MIDDLE COLUMN) -->
            <aside class="sub-sidebar">
                <div class="sub-sidebar-title">
                    <span>系统设置</span>
                </div>
                <ul class="sub-nav-list">
                    <li class="sub-nav-item $audit_active" id="tabAuditNav">
                        <a href="settings.html?tab=audit">审核配置</a>
                    </li>
                    <li class="sub-nav-item $limit_active" id="tabLimitNav">
                        <a href="settings.html?tab=limit">AIGC额度管控</a>
                    </li>
                    <li class="sub-nav-item $asset_reject_active" id="tabAssetRejectNav">
                        <a href="settings.html?tab=asset-reject">素材驳回原因配置</a>
                    </li>
                    <li class="sub-nav-item $post_shield_active" id="tabPostShieldNav">
                        <a href="settings.html?tab=post-shield">帖子下架配置</a>
                    </li>
                    <li class="sub-nav-item $split_active" id="tabSplitNav">
                        <a href="settings.html?tab=split">分成策略配置</a>
                    </li>
                    <li class="sub-nav-item $announcements_active" id="tabAnnouncementsNav">
                        <a href="announcements.html">通知公告</a>
                    </li>
                </ul>
            </aside>
"@

    $beforePart = $content.Substring(0, $replaceStart)
    $afterPart = $content.Substring($endIndex)
    $content = $beforePart + $newSubbar + $afterPart
    [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Updated settings subbar for: $file"
}

# 2. Update sub-sidebar for system management files
$sysFiles = @('sys-user.html', 'sys-role.html', 'sys-menu.html', 'sys-dept.html', 'sys-post.html')
foreach ($file in $sysFiles) {
    $filePath = Join-Path "C:\Users\Administrator\Desktop\project\黄山CMS和管理后台\黄山管理后台" $file
    if (-not (Test-Path $filePath)) {
        Write-Host "File not found: $file"
        continue
    }

    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    $startTag = "<aside class=`"sub-sidebar`">"
    $startIndex = $content.IndexOf($startTag)
    if ($startIndex -lt 0) {
        Write-Host "Subbar start tag not found in $file"
        continue
    }

    $endTag = "</aside>"
    $endIndex = $content.IndexOf($endTag, $startIndex)
    if ($endIndex -lt 0) {
        Write-Host "Subbar end tag not found in $file"
        continue
    }

    $endIndex += $endTag.Length

    $commentTag = "<!-- SUB SIDEBAR"
    $commentIndex = $content.IndexOf($commentTag)
    $replaceStart = $startIndex
    if ($commentIndex -ge 0 -and $commentIndex -lt $startIndex -and ($startIndex - $commentIndex) -le 80) {
        $replaceStart = $commentIndex
    }

    $user_active = ""
    $role_active = ""
    $menu_active = ""
    $dept_active = ""
    $post_active = ""

    if ($file -eq "sys-user.html") { $user_active = "active" }
    elseif ($file -eq "sys-role.html") { $role_active = "active" }
    elseif ($file -eq "sys-menu.html") { $menu_active = "active" }
    elseif ($file -eq "sys-dept.html") { $dept_active = "active" }
    elseif ($file -eq "sys-post.html") { $post_active = "active" }

    $newSubbar = @"
<!-- SUB SIDEBAR (MIDDLE COLUMN) -->
            <aside class="sub-sidebar">
                <div class="sub-sidebar-title">
                    <span>系统管理</span>
                </div>
                <ul class="sub-nav-list">
                    <li class="sub-nav-item $user_active" id="tabSysUserNav">
                        <a href="sys-user.html">系统用户管理</a>
                    </li>
                    <li class="sub-nav-item $role_active" id="tabSysRoleNav">
                        <a href="sys-role.html">角色管理</a>
                    </li>
                    <li class="sub-nav-item $menu_active" id="tabSysMenuNav">
                        <a href="sys-menu.html">菜单管理</a>
                    </li>
                    <li class="sub-nav-item $dept_active" id="tabSysDeptNav">
                        <a href="sys-dept.html">部门管理</a>
                    </li>
                    <li class="sub-nav-item $post_active" id="tabSysPostNav">
                        <a href="sys-post.html">岗位管理</a>
                    </li>
                </ul>
            </aside>
"@

    $beforePart = $content.Substring(0, $replaceStart)
    $afterPart = $content.Substring($endIndex)
    $content = $beforePart + $newSubbar + $afterPart
    [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Updated sys subbar for: $file"
}
