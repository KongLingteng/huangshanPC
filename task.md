# 任务清单 (task.md)

- [x] 移除 `sys-user.html` 表格上方的“新增”、“修改”、“删除”按钮
- [x] 移除 `sys-user.html` 表格操作列中的“编辑”和“删除”图标按钮
- [x] 优化 `sys-user.html` 中的 JavaScript `updateToolbarState` 函数，避免因批量修改/批量删除按钮不存在而产生空指针报错
- [x] 本地自测与代码验证
- [x] 在 `user-list.html` 的操作列中渲染并添加“黑名单”与“移出黑名单”操作
- [x] 在 `user-list.html` 的 HTML 底部新增自定义拉黑确认模态框结构
- [x] 在 `user-list.html` 的脚本段中实现拉黑与移出黑名单的交互 and 持久化逻辑
- [x] 协同验证拉黑/移出拉黑对用户列表页中用户状态及按钮文案的更新
- [x] 移除 `sys-user.html` 中检索区的“状态”选择框 HTML
- [x] 移除 `sys-user.html` 表格表头的“状态” `<th>`
- [x] 移除 `sys-user.html` 表格每行渲染的“状态” `<td>` 并修正空数据提示 `colspan="8"`
- [x] 移除 `sys-user.html` 用户编辑弹窗表单中的“状态”设置项 HTML
- [x] 优化 `sys-user.html` 的 JavaScript 函数进行非空防护（`searchUsers`, `resetSearch`, `openAddUserModal`, `openEditUserModal`, `submitUserForm`）
- [x] 本地自测与验证
- [x] 移除 `settings.html` 审核配置选项卡中的旧版两个 AI 审查引擎开关
- [x] 在 `settings.html` 中新增“文本AI合规检测”、“图片AI合规检测”、“视频AI合规检测”三个独立的开关及对应的详细说明
- [x] 修改 `settings.html` 中的 JavaScript 加载函数 `loadAuditForm`，以正确读取和显示三个新配置开关的状态
- [x] 修改 `settings.html` 中的 JavaScript 保存函数 `saveAuditConfig`，使保存操作正确写入三个独立的配置项到 LocalStorage
- [x] 修改 `js/common.js` 的 `initDatabase` 初始化逻辑，将 `hscms_settings_audit_config` 默认配置由旧的两个字段改为三个新字段的默认开启状态
- [x] 手动验证上述配置开关状态的初始化、切换和保存等功能正常运行

## AIGC风格预设功能 (settings.html 新增菜单与CRUD)
- [x] 在 `settings.html` 的 sub-sidebar（子菜单栏）中新增“AIGC风格预设”菜单项并绑定 `switchTab('aigc-style')`
- [x] 在 `settings.html` 的 workspace-canvas 下新增 `aigcStyleTab` 选项卡，编写风格预设的列表（表格形式）及管理表单（右侧/侧边表单形式）
- [x] 表单组件设计：支持风格名称、风格类型（AI生文、AI生图，下拉选择）、图标文件上传（仅AI生图展示并上传，转换为Base64图片存储）、提示词（多行文本框）、状态（启用/禁用开关或单选）
- [x] 在 `js/common.js` 中新增 AIGC 风格预设的初始化默认数据 `hscms_settings_aigc_styles`
- [x] 在 `settings.html` 脚本区实现：
  - [x] 切换选项卡至 `aigc-style` 时调用数据初始化并加载列表的逻辑 `loadAigcStyles()`
  - [x] 新增风格、编辑风格（数据回显）、删除风格的 CRUD 逻辑及状态快速切换（启用/禁用）逻辑
  - [x] 图片上传处理逻辑：当选中文件时转换为 Base64 并显示预览图，若是 AI生文 则重置并隐藏上传控件
- [x] 自测验证功能的完整性，确保 CRUD 功能与 LocalStorage 双向同步无报错

## AIGC提示词预设功能 (二级结构新增)
- [x] 在 `settings.html` 的 sub-sidebar（子菜单栏）中新增“AIGC提示词预设”菜单项并绑定 `switchTab('aigc-preset')`
- [x] 在 `js/common.js` 中新增二级结构默认数据 `hscms_settings_aigc_presets` 并注册到 `initDatabase()` 中
- [x] 在 `settings.html` 的 workspace-canvas 下新增独立的 `aigcPresetTab` 选项卡
- [x] 设计 `aigcPresetTab` 的左右分栏与双层树形 DOM 布局：
  - [x] 左侧采用树状容器展现：一级场景预设卡片，以及级联嵌套的二级提示词卡片列表
  - [x] 右侧设计“双模表单”：支持通过状态标识在“一级场景表单”和“二级提示词表单”之间动态切换
- [x] 编写页面交互及 CRUD 逻辑：
  - [x] 一级场景：支持新增、编辑、删除（级联删除所有下级提示词）、一键切换启用/禁用状态
  - [x] 二级提示词：支持新增（可选所属场景）、编辑、删除
  - [x] 按钮事件联动：点击一级的“添加提示词”或二级的“编辑提示词”自动在右侧激活提示词表单并锁定所属场景
- [x] 自测验证新增的二级提示词预设页面及交互逻辑，确保其独立运行且不影响已有的“AIGC风格预设”功能
- [x] 细节微调：移除“AIGC提示词预设”二级子项的“提示词标题”输入框与数据结构属性，列表直接渲染提示词模板
- [x] 细节微调：将两套配置页面的表单 Label 与列表卡片属性名称统一对齐为“提示词模板”

