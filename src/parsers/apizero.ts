/**
 * apizero 解析源（主力，全平台）
 *
 * 端点: GET https://v1.apizero.cn/api/video-parse?url=<编码url>
 * 认证: Authorization: Bearer <apiKey>
 * 文档: https://apizero.cn/marketplace/video-parse
 *
 * 实测返回结构：
 * {
 *   code: 0, msg: "成功",
 *   data: {
 *     code: 200, platform: "douyin", type: "视频",
 *     data: {
 *       title, video_url(无水印直链), cover_url, audio_url,
 *       imagelist: [], // 非空 = 图集
 *       source: { platform, platform_label, original_url, author_name, ... }
 *     }
 *   }
 * }
 */

import { pluginState } from '../core/state';
import { platformLabel } from './platform';
import type { MediaParser, MediaInfo, ParseResult, Platform } from './types';

const ENDPOINT = 'https://v1.apizero.cn/api/video-parse';

interface ApizeroInner {
    title?: string;
    video_url?: string;
    cover_url?: string;
    audio_url?: string;
    imagelist?: string[];
    source?: {
        platform?: string;
        platform_label?: string;
        original_url?: string;
        author_name?: string;
        aweme_id?: string | number;
        like_count?: number;
    };
}

interface ApizeroResponse {
    code?: number;
    msg?: string;
    data?: {
        code?: number;
        platform?: string;
        type?: string;
        data?: ApizeroInner;
    };
}

/** 把 apizero 的 platform 字符串映射到内部 Platform */
function mapPlatform(raw: string | undefined, fallback: Platform): Platform {
    const known: Platform[] = ['douyin', 'xiaohongshu', 'bilibili', 'kuaishou', 'weibo'];
    if (raw && (known as string[]).includes(raw)) return raw as Platform;
    return fallback;
}

export const apizeroParser: MediaParser = {
    name: 'apizero',

    isAvailable(_platform: Platform): boolean {
        // 全平台支持；需启用且填了 key
        return pluginState.config.enableApizero && !!pluginState.config.apizeroApiKey?.trim();
    },

    async parse(shareUrl: string, platform: Platform): Promise<ParseResult> {
        const key = pluginState.config.apizeroApiKey?.trim();
        if (!key) {
            return { ok: false, errorType: 'api_request', message: 'apizero 未配置 API Key' };
        }
        const api = `${ENDPOINT}?url=${encodeURIComponent(shareUrl)}`;
        try {
            const res = await fetch(api, {
                headers: { Authorization: `Bearer ${key}` },
            });
            const raw = await res.text();
            if (!res.ok) {
                const snippet = raw ? raw.slice(0, 300) : '';
                return {
                    ok: false,
                    errorType: 'api_request',
                    message: `apizero 响应异常: ${res.status}${snippet ? ` | ${snippet}` : ''}`,
                };
            }

            let json: ApizeroResponse | null = null;
            try {
                json = raw ? JSON.parse(raw) as ApizeroResponse : null;
            } catch (e) {
                return { ok: false, errorType: 'api_response', message: `apizero JSON 解析失败: ${String(e)}` };
            }

            // 外层 code 0 = 网关成功；内层 data.code 200 = 业务成功
            if (!json || json.code !== 0 || !json.data) {
                return {
                    ok: false,
                    errorType: 'api_response',
                    message: `apizero 返回异常 code=${json?.code ?? 'null'} msg=${json?.msg ?? ''}`,
                };
            }
            const outer = json.data;
            if (outer.code !== 200 || !outer.data) {
                return {
                    ok: false,
                    errorType: 'api_response',
                    message: `apizero 解析失败 code=${outer.code ?? 'null'}`,
                };
            }

            const d = outer.data;
            const src = d.source || {};
            const resolvedPlatform = mapPlatform(outer.platform || src.platform, platform);
            const author = src.author_name || '未知作者';
            const desc = d.title || '';
            const awemeId = String(src.aweme_id ?? Date.now());
            const likes = typeof src.like_count === 'number' ? src.like_count : undefined;
            const label = src.platform_label || platformLabel(resolvedPlatform);

            const images = Array.isArray(d.imagelist) ? d.imagelist.filter(Boolean) : [];
            if (images.length > 0) {
                const info: MediaInfo = {
                    awemeId,
                    platform: resolvedPlatform,
                    platformLabel: label,
                    type: 'image',
                    desc,
                    author,
                    images,
                    cover: d.cover_url,
                    likes,
                    sourceUrl: shareUrl,
                    parserName: 'apizero',
                };
                return { ok: true, info };
            }

            if (!d.video_url) {
                return { ok: false, errorType: 'api_response', message: 'apizero 未返回视频链接' };
            }
            const info: MediaInfo = {
                awemeId,
                platform: resolvedPlatform,
                platformLabel: label,
                type: 'video',
                desc,
                author,
                playUrl: d.video_url,
                cover: d.cover_url,
                likes,
                sourceUrl: shareUrl,
                parserName: 'apizero',
            };
            return { ok: true, info };
        } catch (err) {
            return { ok: false, errorType: 'api_request', message: `调用 apizero 失败: ${String(err)}` };
        }
    },
};
