/**
 * 平台识别与链接提取
 *
 * 取代原插件只识别抖音域名的 extractDouyinUrls，
 * 扩展为识别多平台分享链接，并标注其所属平台。
 */

import type { Platform } from './types';

/** 平台 → 域名关键字映射 */
const PLATFORM_HOSTS: Array<{ platform: Platform; label: string; hosts: string[] }> = [
    { platform: 'douyin', label: '抖音', hosts: ['douyin.com', 'iesdouyin.com'] },
    { platform: 'xiaohongshu', label: '小红书', hosts: ['xiaohongshu.com', 'xhslink.com'] },
    { platform: 'bilibili', label: '哔哩哔哩', hosts: ['bilibili.com', 'b23.tv', 'acg.tv'] },
    { platform: 'kuaishou', label: '快手', hosts: ['kuaishou.com', 'kuaishouapp.com', 'chenzhongtech.com', 'gifshow.com'] },
    { platform: 'weibo', label: '微博', hosts: ['weibo.com', 'weibo.cn', 'video.weibo.com'] },
];

/** 平台标识 → 中文名 */
export function platformLabel(platform: Platform): string {
    const found = PLATFORM_HOSTS.find((p) => p.platform === platform);
    return found ? found.label : '未知平台';
}

/** 根据 URL 判断所属平台，未匹配返回 'unknown' */
export function detectPlatform(url: string): Platform {
    try {
        const host = new URL(url).hostname.toLowerCase();
        for (const entry of PLATFORM_HOSTS) {
            if (entry.hosts.some((h) => host === h || host.endsWith('.' + h) || host.includes(h))) {
                return entry.platform;
            }
        }
    } catch {
        /* 非法 URL，忽略 */
    }
    return 'unknown';
}

/** 提取的链接 + 平台信息 */
export interface ExtractedUrl {
    url: string;
    platform: Platform;
}

/**
 * 从文本中提取所有受支持平台的分享链接。
 * 返回去重后的 {url, platform} 列表。
 */
export function extractMediaUrls(text: string): ExtractedUrl[] {
    const urlMatches = text.match(/https?:\/\/[^\s]+/g) || [];
    const seen = new Set<string>();
    const result: ExtractedUrl[] = [];
    for (const raw of urlMatches) {
        // 去掉链接尾部可能粘连的标点
        const cleaned = raw.replace(/[)>"'\]，。！？、]+$/, '');
        const platform = detectPlatform(cleaned);
        if (platform === 'unknown') continue;
        if (seen.has(cleaned)) continue;
        seen.add(cleaned);
        result.push({ url: cleaned, platform });
    }
    return result;
}
