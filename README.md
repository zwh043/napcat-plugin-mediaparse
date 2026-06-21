# NapCat 聚合解析插件（napcat-plugin-mediaparse）

**写在前面：最新版本的napcat设置了插件白名单，所有非官方的插件都不让读取。不知道到回退到哪个版本才可以用，我是一直用的旧版v4.15.18。**
本项目是一个基于 [NapCat](https://github.com/NapNeko/NapCatQQ) 的插件，自动解析群聊中分享的**抖音、小红书、哔哩哔哩、快手、微博**等平台链接，并将无水印视频、图文作品直接发送到聊天中。内置多解析源自动降级，显著提升解析成功率。

> 本项目基于 [Black-Cyan/napcat-plugin-douyin](https://github.com/Black-Cyan/napcat-plugin-douyin) 二次开发，由原来的单一抖音解析扩展为多平台聚合解析。

<p align="center">
  <a href="https://github.com/zwh043/napcat-plugin-mediaparse/releases">
    <img src="https://img.shields.io/github/downloads/zwh043/napcat-plugin-mediaparse/total">
  </a>
</p>

## 功能特性

- **多平台解析**：识别消息中的抖音、小红书、哔哩哔哩、快手、微博等分享链接并自动解析。
- **多源降级**：内置三个解析源，按优先级 `apizero（全平台主力）→ 新野（抖音免费）→ xhus（抖音兜底）` 依次尝试，任一失败自动切换下一个，大幅提升解析成功率。
- **自备 API Key**：apizero 为全平台主力源，在 WebUI 中填入自己申请的 API Key 即可启用（[申请地址](https://apizero.cn/marketplace/video-parse)）；不填则仅使用免费源（仅支持抖音）。
- **作品详情**：展示作品所属平台、作者与简介。
- **图文内容**：按照原作品顺序发送图片。

## 解析源说明

| 解析源 | 支持平台 | 是否需要 Key | 优先级 |
| --- | --- | --- | --- |
| apizero | 抖音 / 小红书 / B站 / 快手 / 微博等 | 需要（自行申请） | 主力 |
| 新野 | 仅抖音 | 免费 | 备用 |
| xhus | 仅抖音 | 免费 | 兜底 |

> 提示：若只解析抖音，可不填 apizero Key，免费源即可工作；若需要小红书 / B站等其他平台，请在 WebUI 的「解析源设置」中配置 apizero API Key。

## 使用说明（重要）

不同平台、不同分享方式的链接格式存在差异，实测情况如下：

- **抖音**：分享链接（`https://v.douyin.com/...`）直接发到群里即可解析。
- **小红书**：请使用 App 内「复制链接」得到的链接（`https://www.xiaohongshu.com/...` 或 `xhslink.com`）发送。直接把图文笔记**以「分享卡片」转发到群里可能无法解析**，建议复制链接发送。
- **哔哩哔哩**：复制视频链接（`https://www.bilibili.com/video/...` 或 `b23.tv`）发送即可。
- **快手 / 微博**：发送对应的分享链接。

简言之：**如果某条分享卡片解析失败，改用「复制链接」发送纯文本链接通常即可成功。**

## 安装方法

### 方式一：离线安装（推荐）

1. 前往 [Releases](https://github.com/zwh043/napcat-plugin-mediaparse/releases) 页面下载最新的 `napcat-plugin-mediaparse.zip`。
2. 将压缩包解压至 NapCat 的 `plugins` 文件夹下（解压后应得到 `napcat-plugin-mediaparse` 目录）。
3. 重启 NapCat，或在 WebUI 的插件管理页面刷新并启用该插件。
4. 进入插件配置页的「解析源设置」，填入你的 apizero API Key（如需多平台）。

> 注意：需要 NapCat 版本 >= 4.14.0。

### 方式二：源码构建

1. 克隆仓库：

```bash
git clone https://github.com/zwh043/napcat-plugin-mediaparse.git
cd napcat-plugin-mediaparse
```

2. 安装依赖并构建：

```bash
pnpm install
pnpm run build
```

3. 构建完成后，将生成的 `dist/` 目录下的 `index.mjs`、`package.json` 以及 `webui/` 目录复制到 NapCat 的插件目录下。

## 配置项说明

| 配置项 | 说明 |
| --- | --- |
| apizero API Key | 全平台主力解析源密钥（形如 `sk_live_xxx`），留空仅用免费源 |
| 启用 apizero | 全平台支持，需填写 Key |
| 启用新野 | 仅抖音，免费备用 |
| 启用 xhus | 仅抖音，免费兜底 |
| 转发显示昵称 | 合并转发卡片中展示的昵称 |
| 视频质量 / 发送方式 / 大小上限 | 沿用原插件行为 |
| 去重时间 / 缓存设置 | 沿用原插件行为 |

## 开发与贡献

如果你有任何建议或发现了 Bug，欢迎在 [Issues](https://github.com/zwh043/napcat-plugin-mediaparse/issues) 提交反馈或 Pull Request。

## 鸣谢

本项目在开发过程中参考了以下优秀项目，排名不分先后：

- [napcat-plugin-douyin](https://github.com/Black-Cyan/napcat-plugin-douyin) - 本项目的基础，原抖音解析插件。
- [napcat-plugin-bilibili](https://github.com/AQiaoYo/napcat-plugin-bilibili) - 插件架构参考。
- [apizero 全平台视频解析](https://apizero.cn/marketplace/video-parse) - 全平台解析接口。
- [新野 API](https://api.xinyew.cn/doc/douyinjx.html) - 抖音解析接口。
- [xhus 抖音解析接口](https://api.xhus.cn/doc/douyin.html) - 抖音解析接口。

## 许可证

MIT
