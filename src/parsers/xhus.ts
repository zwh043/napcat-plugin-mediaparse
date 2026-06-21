/**
 * xhus 解析源（免费，仅抖音，兜底）
 *
 * 端点: GET http://api.xhus.cn/api/douyin?url=<编码url>
 * 无需 key。这是原插件唯一的解析源，现降级为最后兜底。
 *
 * 返回结构：
 * { code: 200, msg, data: { author, uid, like, title, cover, images[], url(视频直链) } }
 * images 非空 = 图集；否则取 url 作为视频。
 */

import { pluginState } from '../core/state';
import { platformLabel } from './platform';
import type { MediaParser, MediaInfo, ParseResult, Platform } from './types';

const ENDPOINT = 'http://api.xhus.cn/api/douyin';
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 10; Pixel 5 Build/QQ3A.200805.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.0.0 Mobile Safari/537.36';

interface XhusResponse {
    code?: number;
    msg?: string;
    data?: {
        author?: string;
        uid?: string | number;
        like?: number | string;
        title?: string;
        cover?: string;
        images?: string[] | string;
        url?: string;
    };
}

/** 按配置应用视频清晰度参数（保留原插件行为） */
function applyQualityToUrl(playUrl: string): string {
    try {
        const url = new URL(playUrl);
        const quality = pluginState.config.douyinVideoQuality === 'high' ? '1080p' : '720p';
        url.searchParams.set('ratio', quality);
        return url.toString();
    } catch {
        return playUrl;
    }
}

export const xhusParser: MediaParser = {
    name: 'xhus',

    isAvailable(platform: Platform): boolean {
        return pluginState.config.enableXhus && platform === 'douyin';
    },

    async parse(shareUrl: string, _platform: Platform): Promise<ParseResult> {
        const api = `${ENDPOINT}?url=${encodeURIComponent(shareUrl)}`;
        try {
            const res = await fetch(api, { headers: { 'User-Agent': MOBILE_UA } });
            const raw = await res.text();
            if (!res.ok) {
                return { ok: false, errorType: 'api_request', message: `xhus 响应异常: ${res.status}` };
            }
            const trimmed = raw.trim();
            if (trimmed.startsWith('<') || trimmed.includes('waf_js') || trimmed.includes('Please wait')) {
                return { ok: false, errorType: 'api_response', message: 'xhus 返回异常（疑似风控/HTML 验证页）' };
            }
            let json: XhusResponse | null = null;
            try {
                json = trimmed ? JSON.parse(trimmed) as XhusResponse : null;
            } catch (e) {
                return { ok: false, errorType: 'api_response', message: `xhus JSON 解析失败: ${String(e)}` };
            }
            if (!json || json.code !== 200 || !json.data) {
                return {
                    ok: false,
                    errorType: 'api_response',
                    message: `xhus 返回异常 code=${json?.code ?? 'null'} msg=${json?.msg ?? ''}`,
                };
            }
            const data = json.data;
            const author = data.author || '抖音';
            const desc = data.title || '';
            const awemeId = String(data.uid ?? Date.now());
            const likeNum = typeof data.like === 'number' ? data.like : Number(data.like);
            const likes = Number.isFinite(likeNum) ? likeNum : undefined;
            const images = Array.isArray(data.images) ? data.images.filter(Boolean) as string[] : [];

            if (images.length > 0) {
                const info: MediaInfo = {
                    awemeId,
                    platform: 'douyin',
                    platformLabel: platformLabel('douyin'),
                    type: 'image',
                    desc,
                    author,
                    images,
                    cover: data.cover,
                    likes,
                    sourceUrl: shareUrl,
                    parserName: 'xhus',
                };
                return { ok: true, info };
            }
            if (!data.url) {
                return { ok: false, errorType: 'api_response', message: 'xhus 未返回视频链接' };
            }
            const info: MediaInfo = {
                awemeId,
                platform: 'douyin',
                platformLabel: platformLabel('douyin'),
                type: 'video',
                desc,
                author,
                playUrl: applyQualityToUrl(data.url),
                cover: data.cover,
                likes,
                sourceUrl: shareUrl,
                parserName: 'xhus',
            };
            return { ok: true, info };
        } catch (err) {
            return { ok: false, errorType: 'api_request', message: `调用 xhus 失败: ${String(err)}` };
        }
    },
};
