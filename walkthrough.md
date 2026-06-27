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

## 新增变更内容 (AIGC 风格预设页面新增与CRUD管理)
- **菜单与页面结构新增**：
  - 在 [settings.html](file:///c:/Users/Administrator/Desktop/project/黄山CMS和管理后台/黄山管理后台/settings.html) 子导航栏新增“AIGC风格预设”菜单项，关联 `switchTab('aigc-style')`。
  - 在选项卡区域新增 `aigcStyleTab` 面板，包含一个左右分栏的配置容器（左侧为已配置的风格预设卡片/表格展示，支持实时切换启用/禁用状态、编辑和删除；右侧为表单录入区）。
- **字段及交互联动设计**：
  - 支持字段：风格名称、风格类型（AI生文 / AI生图）、图标、提示词、状态（启用 / 禁用）。
  - **图标上传联动**：选择“AI生图”时显示图标上传项，若选择“AI生文”则自动隐藏该上传项。图标上传组件支持前端本地 `FileReader` 转换为 Base64 进行持久化，并展示清晰预览图。
- **持久化及CRUD逻辑**：
  - 更新 [common.js](file:///c:/Users/Administrator/Desktop/project/黄山CMS和管理后台/黄山管理后台/js/common.js) 的 `initDatabase`，初始化内置默认的 AIGC 风格数据 `hscms_settings_aigc_styles`（含 AI生文、AI生图示例）。
  - 编写 `settings.html` 中的 `loadAigcStyles()` 列表渲染、`editAigcStyle()` 数据回显、`deleteAigcStyle()` 数据移除、`saveAigcStyle()` 提交更新等全部客户端 JS 业务逻辑，严格执行非空校验与防错处理。

## 新增变更内容 (AIGC 提示词预设功能新增)
- **菜单与页面结构新增**：
  - 子导航栏新添“AIGC提示词预设”菜单，动作切换参数为 `switchTab('aigc-preset')`。
  - 新增独立的双层结构控制面板 `aigcPresetTab`。左侧树形区域呈现：一级场景（场景名、类型、启用禁用状态），下方级联嵌套渲染其关联的二级提示词列表（提示词标题、详细指令内容缩略）。
- **双模表单管理交互**：
  - 右侧配置面板支持双表单模式动态切换：
    - **场景模式**：可录入场景名称、风格类型（AI生文/生图）、状态（启用/禁用）。
    - **提示词模式**：在选中一级场景下添加或编辑详细提示词，包含所属场景下拉框、提示词标题、内容文本域。
  - 新增/编辑/删除动作高度联动。点击一级的“添加提示词”或二级的“编辑提示词”自动在右侧切换表单并锁定所属场景。
- **数据结构与双层CRUD实现**：
  - 在 [common.js](file:///c:/Users/Administrator/Desktop/project/黄山CMS和管理后台/黄山管理后台/js/common.js) 的 `initDatabase` 中注册全新的二级结构默认表 `hscms_settings_aigc_presets`。
  - 编写了独立的 JS CRUD 控制函数，保证一级场景的修改/删除能同步级联更新它底下的二级提示词数组。所有读写操作直接落入 LocalStorage 数据库。
  - 在“AIGC提示词预设”的二级项中移除了“提示词标题”输入框与数据属性，二级子项仅维护提示词模板内容。进一步将二级提示词的卡片结构精简，去除了卡片中的“提示词模板 #x”编号和额外的嵌套容器，直接以更扁平直观的提示词文案列表呈现，且支持超长文本省略截断与悬浮完整提示。
  - 将“AIGC风格预设”与“AIGC提示词预设”的表单输入项 Label 统一规范化对齐为 **“提示词模板”**；同时两边卡片内容中均移除了“提示词模板：”的小前缀标题，直接清爽显示提示词文本。

