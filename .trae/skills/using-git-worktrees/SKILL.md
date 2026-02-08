# 使用 Git Worktree

## 何时激活

此技能在以下情况下自动激活：

- 需要并行处理多个任务
- 需要在隔离环境中测试更改
- 需要在不干扰主分支的情况下进行实验
- 需要为 Pull Request 创建预览环境

## 目标

此技能的目标是使用 Git Worktree 在隔离的工作目录中进行开发。

Git Worktree 允许你在同一个仓库中创建多个工作目录，每个工作目录都有自己的分支。这对于并行处理多个任务非常有用。

## 步骤

### 1. 创建 Worktree

使用 `git worktree add` 命令创建新的 worktree：

```bash
git worktree add <path> <branch>
```

例如：

```bash
# 创建新的 feature 分支的 worktree
git worktree add ../myfeature feature

# 创建新的修复分支的 worktree
git worktree add ../hotfix bugfix
```

### 2. 在 Worktree 中工作

在新的 worktree 中工作：

1. **切换到 worktree 目录：** `cd <path>`
2. **创建分支：** 如果需要，创建新分支
3. **进行更改：** 进行所需的更改
4. **提交更改：** 提交更改

### 3. 管理 Worktree

使用 `git worktree list` 命令列出所有 worktree：

```bash
git worktree list
```

输出示例：

```
/path/to/main     abc1234 [main]
/path/to/myfeature def5678 [myfeature]
/path/to/hotfix   ghi9012 [hotfix]
```

### 4. 移除 Worktree

使用 `git worktree remove` 命令移除 worktree：

```bash
git worktree remove <path>
```

或者使用 `-f` 强制移除：

```bash
git worktree remove -f <path>
```

## 使用场景

### 场景一：并行处理多个任务

假设你正在处理两个任务：添加用户认证和修复 bug。使用 worktree，你可以同时在两个目录中工作：

```bash
# 在主目录中工作（用户认证）
cd /path/to/repo
git checkout -f feature/auth
# 进行更改...

# 在另一个目录中工作（bug 修复）
git worktree add ../bugfix bugfix
cd ../bugfix
# 进行更改...
```

### 场景二：测试 Pull Request

假设你正在审查他人的 Pull Request。使用 worktree 在隔离环境中测试更改：

```bash
# 获取 Pull Request
git fetch origin pull/123/head:pr-123

# 创建 worktree 来测试
git worktree add ../pr-123 pr-123
cd ../pr-123
# 运行测试...
```

### 场景三：创建预览环境

假设你想为 Pull Request 创建预览环境。使用 worktree 创建预览分支：

```bash
# 创建预览分支
git checkout -b preview
git worktree add ../preview preview

# 在预览分支中工作
cd ../preview
# 进行部署相关的更改...
```

## 最佳实践

### 1. 使用有意义的路径

使用有意义的路径来命名 worktree：

```bash
# 好
git worktree add ../feature/user-auth feature/user-auth
git worktree add ../bugfix/login-error bugfix/login-error

# 不好
git worktree add ../wf1 feature
git worktree add ../wf2 bugfix
```

### 2. 定期清理

定期清理不再需要的 worktree：

```bash
# 列出所有 worktree
git worktree list

# 移除不再需要的 worktree
git worktree remove ../old-feature
```

### 3. 避免过度使用

不要创建太多 worktree。创建太多 worktree 会导致混乱。

### 4. 保持同步

确保所有 worktree 与主分支保持同步：

```bash
# 在每个 worktree 中
git fetch origin
git rebase origin/main
```

## 常见问题

### 问题一：worktree 目录不存在

如果 worktree 目录不存在，可以使用 `git worktree add` 命令创建：

```bash
git worktree add <path> <branch>
```

### 问题二：worktree 分支已存在

如果 worktree 分支已存在，会报错。可以先删除现有的 worktree：

```bash
git worktree remove <path>
git worktree add <path> <branch>
```

### 问题三：worktree 目录被意外删除

如果 worktree 目录被意外删除，可以使用 `git worktree prune` 命令清理：

```bash
git worktree prune
```

## 与其他技能的集成

此技能可以与以下技能一起使用：

- **writing-plans：** 使用 worktree 来实现计划中的任务
- **executing-plans：** 使用 worktree 来执行计划
- **finishing-a-development-branch：** 使用 worktree 来完成开发分支
- **requesting-code-review：** 使用 worktree 来准备代码审查

## 示例

### 示例一：并行处理多个任务

```bash
# 在主仓库中工作
cd /path/to/repo
git checkout main
git pull

# 创建新的 feature 分支
git checkout -f feature/user-auth
# 进行更改...

# 创建 worktree 来处理 bug 修复
git worktree add ../bugfix bugfix
cd ../bugfix
git checkout -b bugfix/login-error
# 进行 bug 修复...

# 回到 feature 分支
cd /path/to/repo
# 继续工作...
```

### 示例二：测试 Pull Request

```bash
# 获取 Pull Request
git fetch origin pull/456/head:pr-456

# 创建 worktree 来测试
git worktree add ../pr-456 pr-456
cd ../pr-456

# 运行测试
pytest

# 测试完成后，移除 worktree
cd /path/to/repo
git worktree remove ../pr-456
git branch -d pr-456
```

### 示例三：创建预览环境

```bash
# 创建预览分支
git checkout -b preview
git worktree add ../preview preview

# 在预览分支中工作
cd ../preview
# 进行部署相关的更改...
git add .
git commit -m "Prepare for preview"

# 部署到预览环境
./deploy.sh preview

# 测试完成后，清理
cd /path/to/repo
git worktree remove ../preview
git checkout main
git branch -d preview
```
