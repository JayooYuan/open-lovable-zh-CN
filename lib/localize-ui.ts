import { messages } from "@/locales";

const welcomeMessage =
  "欢迎！我可以结合沙箱中的全部文件和项目结构帮助你生成代码。直接输入需求即可；如果尚未创建沙箱，系统会自动创建。\n\n提示：如果出现 react-router-dom 等依赖缺失错误，可以输入“npm install”或“检查依赖包”，系统会自动安装缺失依赖。";

const replacements: ReadonlyArray<readonly [RegExp, string]> = [
  [/^Failed to install packages: ([\s\S]+)$/, "安装依赖包失败：$1"],
  [/^Failed to create sandbox: ([\s\S]+)$/, "创建沙箱失败：$1"],
  [/^Command failed with exit code ([\s\S]+)$/, "命令执行失败，退出码：$1"],
  [/^Error: ([\s\S]+)$/, "错误：$1"],
  [/^Applied (\d+) files successfully!$/, "已成功应用 $1 个文件！"],
  [/^Generated (\d+) files?!$/, "已生成 $1 个文件！"],
  [/^Generated (.+)$/, "已生成 $1"],
  [/^Installing (\d+) packages?\.\.\.$/, "正在安装 $1 个依赖包……"],
  [/^Installing (\d+) new package\(s\): ([\s\S]+)$/, "正在安装 $1 个新依赖包：$2"],
  [/^Installing (.+)$/, "正在安装 $1"],
  [/^Already installed: ([\s\S]+)$/, "已安装：$1"],
  [/^Successfully installed: ([\s\S]+)$/, "安装成功：$1"],
  [/^Failed to restart dev server: ([\s\S]+)$/, "重启开发服务器失败：$1"],
  [/^Updated (.+)$/, "已更新 $1"],
  [/^Creating (\d+) files\.\.\.$/, "正在创建 $1 个文件……"],
  [/^Successfully applied (\d+) files$/, "已成功应用 $1 个文件"],
  [/^Parsed (\d+) Morph edits$/, "已解析 $1 个 Morph 修改"],
  [/^Applying (\d+) fast edits via Morph\.\.\.$/, "正在通过 Morph 快速应用 $1 项修改……"],
  [/^Executing (\d+) commands\.\.\.$/, "正在执行 $1 条命令……"],
  [/^🔎 Searching for: ([\s\S]+)$/, "🔎 正在搜索：$1"],
  [/^✅ Found code in (.+) at line (\d+)$/, "✅ 在 $1 第 $2 行找到代码"],
  [/^Identified edit type: ([\s\S]+)$/, "已识别修改类型：$1"],
  [/^Service temporarily unavailable, retrying \(attempt (\d+)\/(\d+)\)\.\.\.$/, "服务暂时不可用，正在重试（第 $1/$2 次）……"],
  [/^Package detected: ([\s\S]+)$/, "检测到依赖包：$1"],
  [/^Package detected from imports: ([\s\S]+)$/, "从 import 语句中检测到依赖包：$1"],
  [/^Completing (.+)\.\.\.$/, "正在补全 $1……"],
  [/^Could not auto-complete (.+)\. Manual review may be needed\.$/, "无法自动补全 $1，可能需要手动检查。"],
  [/^Starting to clone (.+)\.\.\.$/, "正在复刻 $1……"],
  [/^Analyzing brand from (.+)\.\.\.$/, "正在分析 $1 的品牌风格……"],
  [/^Acquired branding format from (.+)$/, "已获取 $1 的品牌规范"],
  [/^Failed to clone website: ([\s\S]+)$/, "网站复刻失败：$1"],
  [/^Failed to create ZIP: ([\s\S]+)$/, "创建 ZIP 文件失败：$1"],
  [/^Failed to capture screenshot: ([\s\S]+)$/, "网页截图失败：$1"],
  [/^Sandbox created! ID: (.+?)\. I now have context[\s\S]*$/, "沙箱已创建！ID：$1。现在可以描述你希望构建或修改的内容。"],
  [/^Successfully built your custom component using (.+?)'s brand guidelines![\s\S]*$/, "已成功使用 $1 的品牌规范构建自定义组件！你可以继续要求修改或添加功能。"],
  [/^Successfully recreated (.+?) as a modern React app[\s\S]*$/, "已成功将 $1 复刻为现代 React 应用！已载入网站内容，可以继续要求修改具体区块或添加功能。"],
];

export function localizeUiText(text: string): string {
  if (!text) return text;

  if (text.startsWith("Welcome! I can help you generate code with full context")) {
    return welcomeMessage;
  }

  const exact = messages.dynamicExact[text];
  if (exact) return exact;

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(text)) return text.replace(pattern, replacement);
  }

  if (text.includes("Some packages failed to install. Check the error banner above for details.")) {
    return "⚠️ 部分依赖包安装失败，请查看上方错误提示了解详情。";
  }

  if (text.startsWith("Your Vite app has been downloaded!")) {
    return "Vite 项目已下载！本地运行步骤：\n1. 解压文件\n2. 运行：npm install\n3. 运行：npm run dev\n4. 打开 http://localhost:5173";
  }

  return text;
}
