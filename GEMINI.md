# Agent Execution Pipeline

所有开发任务必须严格按照以下三步流水线执行，严禁跳步：

**Phase 1: Meta-Routing**
* 始终保持 `using-superpowers` 处于激活状态。
* 接收到新需求后，首先分析需求意图，明确当前应该加载哪个具体的业务技能。

**Phase 2: Architectural Planning (Mandatory)**
* 只要涉及业务逻辑变动或新模块开发，必须先加载 `brainstorming`。
* 在此阶段，禁止输出任何可执行代码。
* 必须输出详尽的设计草案，包括但不限于：核心逻辑、异常处理、数据流转图。待用户明确确认（例如回复 "LGTM" 或 "可以"）后，方可进入下一阶段。

**Phase 3: Implementation via Karpathy Style**
* 获得用户的架构确认后，卸载 brainstorming 的思考模式，加载 `andrej-karpathy` 技能进行编码。
* 编码原则：抵制过度工程化。避免引入不必要的第三方库。保持代码逻辑的扁平与透明，优先使用标准库，确保代码高度可读 and 易于 Debug。
