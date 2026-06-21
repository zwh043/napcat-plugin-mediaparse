/**
 * 新野解析源（免费，仅抖音）
 *
 * 端点: GET https://api.xinyew.cn/api/douyinjx?url=<编码url>
 * 无需 key。文档: https://api.xinyew.cn/doc/douyinjx.html
 *
 * 返回结构：
 * {
 *   code: 200, msg: "解析成功",
 *   data: {
 *     play_url, video_url(视频直链), cover_url, parse_time,
 *     additional_data: [{ desc, url(头像), nickname, signature }]
 *   }
 * }
 * 注意：该源仅返回视频，不支持图集。
 */

import { pluginState } from '../core/state';
import { platformLabel } from './platform';
import type { MediaParser, MediaInfo, ParseResult, Platform } from './types';

const ENDPOINT = 'https://api.xinyew.cn/api/douyinjx';
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 10; Pixel 5 Build/QQ3A.200805.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.0.0 Mobile Safari/537.36';

interface XinyewResponse {
    code?: number;
    msg?: string;
    data?: string | {
        play_url?: string;
        video_url?: string;
        cover_url?: string;
        parse_time?: string;
        additional_data?: Array<{
            desc?: string;
            url?: string;
            nickname?: string;
            signature?: string;
        }>;
    };
}

export const xinyewParser: MediaParser = {
    name: 'xinyew',

    isAvailable(platform: Platform): boolean {
        // 仅支持抖音
        return pluginState.config.enableXinyew && platform === 'douyin';
    },

    async parse(shareUrl: string, _platform: Platform): Promise<ParseResult> {
        const api = `${ENDPOINT}?url=${encodeURIComponent(shareUrl)}`;
        try {
            const res = await fetch(api, { headers: { 'User-Agent': MOBILE_UA } });
            const raw = await res.text();
            if (!res.ok) {
                return { ok: false, errorType: 'api_request', message: `新野响应异常: ${res.status}` };
            }
            let json: XinyewResponse | null = null;
            try {
                json = raw ? JSON.parse(raw) as XinyewResponse : null;
            } catch (e) {
                return { ok: false, errorType: 'api_response', message: `新野 JSON 解析失败: ${String(e)}` };
            }
            if (!json || json.code !== 200 || !json.data || typeof json.data === 'string') {
                return {
                    ok: false,
                    errorType: 'api_response',
                    message: `新野返回异常 code=${json?.code ?? 'null'} msg=${json?.msg ?? ''}`,
                };
            }
            const data = json.data;
            const videoUrl = data.video_url || data.play_url;
            if (!videoUrl) {
                return { ok: false, errorType: 'api_response', message: '新野未返回视频链接' };
            }
            const extra = Array.isArray(data.additional_data) && data.additional_data.length
                ? data.additional_data[0]
                : {};
            const info: MediaInfo = {
                awemeId: String(Date.now()),
                platform: 'douyin',
                platformLabel: platformLabel('douyin'),
                type: 'video',
                desc: extra.desc || '',
                author: extra.nickname || '抖音',
                playUrl: videoUrl,
                cover: data.cover_url,
                sourceUrl: shareUrl,
                parserName: 'xinyew',
            };
            return { ok: true, info };
        } catch (err) {
            return { ok: false, errorType: 'api_request', message: `调用新野失败: ${String(err)}` };
        }
    },
};
