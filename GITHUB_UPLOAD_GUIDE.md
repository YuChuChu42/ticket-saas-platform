# 如何将项目上传到 GitHub

## 📝 步骤 1: 在 GitHub 上创建新仓库

### 方法一：通过网页创建

1. 打开浏览器，访问 [GitHub](https://github.com)
2. 登录您的 GitHub 账号
3. 点击右上角的 **"+"** 按钮，选择 **"New repository"**
4. 填写仓库信息：
   - **Repository name**: `ticket-saas-platform` （或您喜欢的名字）
   - **Description**: `智链工单与运营看板 SaaS 平台 - Vue3 + TypeScript + Pinia + Vite`
   - **Public/Private**: 选择公开或私有
   - ⚠️ **不要勾选** "Initialize this repository with a README"（因为我们已经有代码了）
   - ⚠️ **不要添加** .gitignore 和 License（我们已经有了）
5. 点击 **"Create repository"**

### 方法二：使用 GitHub CLI（如果已安装）

```bash
gh repo create ticket-saas-platform --public --description "智链工单与运营看板 SaaS 平台"
```

## 🚀 步骤 2: 将本地代码推送到 GitHub

在创建好 GitHub 仓库后，GitHub 会显示一些命令。按照以下步骤操作：

### 1️⃣ 添加远程仓库地址

```bash
# 替换 YOUR_USERNAME 为您的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/ticket-saas-platform.git

# 或者使用 SSH（如果您配置了 SSH key）
git remote add origin git@github.com:YOUR_USERNAME/ticket-saas-platform.git
```

### 2️⃣ 推送代码到 GitHub

```bash
# 推送主分支
git push -u origin main

# 如果您的默认分支是 master，使用：
# git push -u origin master
```

### 3️⃣ 验证推送成功

访问您的 GitHub 仓库页面，应该能看到所有代码已经上传成功！

## 🔧 可能遇到的问题

### 问题 1: 分支名称不匹配

如果提示分支不存在，可以重命名分支：

```bash
# 将当前分支重命名为 main
git branch -M main

# 然后再推送
git push -u origin main
```

### 问题 2: 需要身份验证

GitHub 已经不再支持密码验证，您需要使用：

#### 选项 A: Personal Access Token (推荐)

1. 访问 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成 token 并复制（只会显示一次！）
5. 在推送时，使用 token 作为密码

#### 选项 B: SSH Key

1. 生成 SSH key：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. 复制公钥：
```bash
cat ~/.ssh/id_ed25519.pub
```

3. 添加到 GitHub：Settings → SSH and GPG keys → New SSH key

4. 使用 SSH URL 而不是 HTTPS URL

### 问题 3: 已经存在 origin

如果提示 origin 已存在：

```bash
# 删除旧的 origin
git remote remove origin

# 重新添加
git remote add origin https://github.com/YOUR_USERNAME/ticket-saas-platform.git
```

## 📦 步骤 3: 后续更新代码

以后每次修改代码后，使用以下命令推送更新：

```bash
# 1. 查看修改的文件
git status

# 2. 添加修改的文件
git add .

# 3. 提交修改
git commit -m "描述你的修改"

# 4. 推送到 GitHub
git push
```

## 🎯 快速命令（复制粘贴）

```bash
# 1. 添加远程仓库（记得替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/ticket-saas-platform.git

# 2. 确保分支名是 main
git branch -M main

# 3. 推送代码
git push -u origin main
```

## 📚 其他有用的 Git 命令

```bash
# 查看远程仓库
git remote -v

# 查看提交历史
git log --oneline

# 查看当前状态
git status

# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 合并分支
git merge feature/new-feature
```

## 🌟 添加徽章到 README

推送成功后，您可以在 README.md 中看到这些徽章：

- [![CI](https://github.com/YOUR_USERNAME/ticket-saas-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/ticket-saas-platform/actions/workflows/ci.yml)

记得将 `YOUR_USERNAME` 替换为您的 GitHub 用户名！

## ✅ 完成！

现在您的项目已经成功上传到 GitHub 了！🎉

您可以：
- 分享您的项目链接
- 邀请其他人协作
- 启用 GitHub Pages 部署
- 配置 CI/CD 自动部署

---

如有问题，欢迎查看 [GitHub 官方文档](https://docs.github.com/zh)

