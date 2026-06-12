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
