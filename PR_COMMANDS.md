# 🚀 Commands để tạo Pull Request

## Bước 1: Stage và commit các thay đổi

```bash
# Add tất cả files đã thay đổi
git add .

# Hoặc add từng file cụ thể
git add src/service/geminiService.ts
git add src/components/InputForm.tsx
git add src/components/ChatWindow.tsx
git add src/components/EventCard.tsx
git add src/components/Dashboard.tsx
git add src/app/ai-planner/page.tsx
git add src/app/globals.css
git add REBUILD_SUMMARY.md

# Commit với message rõ ràng
git commit -m "refactor: rebuild AI Planner components with clean Tailwind CSS

- Fixed TypeScript errors and removed 'any' types
- Rebuilt InputForm, ChatWindow, EventCard, Dashboard with clean code
- Fixed geminiService function signatures
- Uncommented globals.css styles
- Fixed all build errors, only minor warnings remain
- Build successfully: ✓ Compiled in 13.7s
- Bundle optimized: ai-planner 46.9 kB

Closes #[issue-number]"
```

## Bước 2: Push lên remote

```bash
# Push lên origin (fork của bạn)
git push origin hoang

# Hoặc push lên upstream nếu có quyền
git push upstream hoang
```

## Bước 3: Tạo Pull Request trên GitHub

### Cách 1: Qua GitHub CLI (nếu đã cài)
```bash
gh pr create --base master --head hoang --title "Rebuild AI Planner with Clean Tailwind CSS" --body "## 🎯 Changes

- Rebuilt all AI Planner components with clean Tailwind CSS
- Fixed TypeScript errors (removed all 'any' types)
- Fixed geminiService function signatures
- Improved responsive design and UX
- Build successfully with no errors

## ✅ Testing
- [x] Build passes
- [x] No TypeScript errors
- [x] All features working

## 📊 Bundle Size
- ai-planner: 46.9 kB
- Total First Load: 149 kB

See REBUILD_SUMMARY.md for details."
```

### Cách 2: Qua GitHub Web UI
1. Vào https://github.com/[your-username]/traveling_with_AI
2. Click "Compare & pull request" button
3. Base: `master` ← Compare: `hoang`
4. Title: **Rebuild AI Planner with Clean Tailwind CSS**
5. Description: Copy nội dung từ REBUILD_SUMMARY.md
6. Click "Create pull request"

## 📝 PR Template

```markdown
## 🎯 Mục đích
Rebuild toàn bộ AI Planner components với code mới, clean và tránh lỗi UI.

## 🔧 Thay đổi chính
- ✅ Rebuilt InputForm.tsx - Cleaner structure với Tailwind CSS
- ✅ Rebuilt ChatWindow.tsx - Fixed layout issues
- ✅ Rebuilt EventCard.tsx - Fixed UI bugs
- ✅ Rebuilt Dashboard.tsx - Cleaner stats display
- ✅ Rebuilt ai-planner page - Better state management
- ✅ Fixed geminiService.ts - Removed 'any' types
- ✅ Fixed globals.css - Uncommented styles

## ✅ Testing
- [x] Build thành công (13.7s)
- [x] Không có TypeScript errors
- [x] Tất cả features hoạt động
- [x] Responsive design tested

## 📊 Performance
- Bundle size optimized
- First Load JS: 149 kB (ai-planner)
- Build time: 13.7s

## 📸 Screenshots
[Thêm screenshots nếu có]

## 📚 Documentation
Chi tiết trong REBUILD_SUMMARY.md
```

## 🔍 Review Checklist
- [ ] Code follows project style guide
- [ ] All tests pass
- [ ] No console errors
- [ ] Responsive design works
- [ ] Documentation updated

---

**Note:** Thay `[your-username]` và `[issue-number]` bằng giá trị thực tế của bạn.
