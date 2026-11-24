# 交互结构示例：源码与构建

最终交付物是上一级的单文件 [interaction-demo.html](../interaction-demo.html)，可以直接双击打开，不需要服务器。

## 文件

- `index.html`：页面骨架（引用相对 CSS/JS）。
- `styles.css`：纸面 / 石墨双主题、响应式和组件样式。
- `app.js`：演示数据、视图渲染、抽屉、搜索、结构层和对比单元格编辑。
- `build.mjs`：把 CSS/JS 内联进单文件 `../interaction-demo.html`。
- `smoke-test.mjs`：用 jsdom 检查视图切换、抽屉、单元格编辑、主题与搜索。

## 构建

```powershell
node build.mjs
```

生成 `../interaction-demo.html`。

## 冒烟测试

```powershell
node smoke-test.mjs
```

测试读取最终单文件 HTML，不依赖浏览器。真实的视觉与手势检查仍需在浏览器中完成。

## 说明

- 演示数据中，定义、观点、冲突和来源引用现有知识库；发展时间轴和对比单元格含“结构示意”“草案”“待整理”占位。
- 单元格编辑只修改当前浏览器内存，不写入 `content/`。正式版应在保存时做字段校验、临时构建和原子发布。
- 本示例不引用任何 EE2 / 战斗研究隔离内容。
