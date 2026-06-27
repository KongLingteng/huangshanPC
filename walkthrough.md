# 变更说明 (walkthrough.md)

本文件用于记录系统功能升级与页面改动。

## 历史变更内容
- 在 [sys-user.html](file:///c:/Users/Administrator/Desktop/project/%E9%BB%84%E5%B1%B1CMS%E5%92%8C%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0/%E9%BB%84%E5%B1%B1%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0/sys-user.html) 表格上方的工具栏中去除了“新增”、“修改”、“删除”这三个按钮。
- 在数据表格操作列中，去除了“修改用户”（编辑图标）与“删除用户”（删除图标）对应的按钮，仅保留“重置密码”与“分配角色”两个操作。
- 重构了 `updateToolbarState` 逻辑，在对 `btnBulkEdit` 和 `btnBulkDelete` 批量按钮的状态设置操作前增加了非空防护。
- **用户列表拉黑与解封功能**：在 [user-list.html](file:///c:/Users/Administrator/Desktop/project/黄山CMS和管理后台/黄山管理后台/user-list.html) 页面中新增了对于正常用户的“拉黑”及黑名单用户的“移出黑名单”双向处理逻辑，并追加了自定义封禁原因的模态框 `blacklistModal`。

## 新增变更内容 (系统用户管理隐藏状态字段)
- **检索与过滤隐藏**：在 [sys-user.html](file:///c:/Users/Administrator/Desktop/project/黄山CMS和管理后台/黄山管理后台/sys-user.html) 顶部的检索行中移除了“状态”查询项，并在 `searchUsers()`、`resetSearch()` 的检索参数提取段增加非空验证防护（防止元素不存在导致 `TypeError`）。
- **表格列彻底隐藏**：移除了 `sys-user.html` 表格表头中的 `<th>状态</th>` 以及单行数据中原本用来渲染状态切换 Switch 滑块的 `<td>` 元素。同时，将列表无数据时的提示单元格宽度 `colspan` 从 `9` 缩减到 `8` 保证样式自适应。
- **表单弹窗优化**：移除了“新增/编辑用户”模态框中供管理员选择用户“正常”或“停用”状态的下拉选择项。在 `openAddUserModal()`、`openEditUserModal()`、`submitUserForm()` 中对 `formStatus` 下拉框进行了非空判断处理（若隐藏，提交新增用户时自动缺省赋予 `'正常'` 状态），确保系统原有数据库业务模型兼容且无报错。
- **布局错位修正**：修复了在删除“状态”搜索条件时因缺失 `</div>` 闭合标签而引起的高级检索行元素嵌套错位问题。

## 新增变更内容 (内容审核配置重构)
- **旧开关移除**：已彻底移除 `settings.html` 审核配置模块下的“素材版权自动确权 AI 审查”和“社区论坛贴 AI 实时审核”两个旧开关相关的 HTML 和 JS 代码。
- **三项独立合规检测引入**：
  - **文本AI合规检测**：控制对社区帖子和评论发布、用户昵称、个人简介的自动检测。
  - **图片AI合规检测**：控制针对社区帖子中的图片、素材供稿（图片类型）、用户上传自定义头像的检测。
  - **视频AI合规检测**：控制针对社区帖子中的视频、素材供稿（视频类型）的检测。
- **数据层及页面脚本改造**：
  - 更新了 [common.js](file:///c:/Users/Administrator/Desktop/project/黄山CMS和管理后台/黄山管理后台/js/common.js) 的 `initDatabase` 默认数据库配置，将 `hscms_settings_audit_config` 更改为包含 `textAiAudit`、`imageAiAudit` 和 `videoAiAudit` 的新结构，并添加了自动兼容升级旧配置属性的安全兜底代码。
  - 改造了 [settings.html](file:///c:/Users/Administrator/Desktop/project/黄山CMS和管理后台/黄山管理后台/settings.html) 的 `loadAuditForm()` 和 `saveAuditConfig()` 加载与保存逻辑，包含对 DOM 节点的安全非空防护校验，确保配置能正确与 LocalStorage 双向同步且无任何 JavaScript 报错。
