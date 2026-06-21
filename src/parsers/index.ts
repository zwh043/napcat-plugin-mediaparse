/**
 * 解析源调度器
 *
 * 按固定优先级排列解析源：apizero(全平台主力) → 新野(抖音免费) → xhus(抖音兜底)。
 * 对给定链接，依次尝试每个「可用且支持该平台」的源，
 * 第一个成功即返回；全部失败则返回最后一次的错误信息。
 */

import { pluginState } from '../core/state';
import { apizeroParser } from './apizero';
import { xinyewParser } from './xinyew';
import { xhusParser } from './xhus';
import { detectPlatform, platformLabel } from './platform';
import type { MediaParser, ParseResult, Platform } from './types';

/** 解析源优先级顺序（靠前优先） */
const PARSERS: MediaParser[] = [apizeroParser, xinyewParser, xhusParser];

export interface ParseAttemptResult extends ParseResult {
    /** 实际尝试过的源名称及其结果，用于日志/记录 */
    attempts: Array<{ parser: string; ok: boolean; message?: string }>;
}

/**
 * 解析单个链接，按优先级自动降级。
 * @param shareUrl 规范化后的链接
 * @param platform 已识别平台（未传则内部识别）
 */
export async function parseWithFallback(
    shareUrl: string,
    platform?: Platform,
): Promise<ParseAttemptResult> {
    const plat = platform ?? detectPlatform(shareUrl);
    const attempts: ParseAttemptResult['attempts'] = [];
    let lastError: ParseResult | null = null;

    const available = PARSERS.filter((p) => p.isAvailable(plat));
    if (available.length === 0) {
        const msg = `没有可用的解析源支持平台「${platformLabel(plat)}」`
            + '（apizero 需填写 API Key；免费源仅支持抖音）';
        pluginState.logger.warn(msg);
        return { ok: false, errorType: 'api_request', message: msg, attempts };
    }

    for (const parser of available) {
        if (pluginState.config.debug) {
            pluginState.logger.debug(`尝试解析源 [${parser.name}] | 平台=${plat} | url=${shareUrl}`);
        }
        let result: ParseResult;
        try {
            result = await parser.parse(shareUrl, plat);
        } catch (err) {
            result = { ok: false, errorType: 'api_request', message: `${parser.name} 抛出异常: ${String(err)}` };
        }
        attempts.push({ parser: parser.name, ok: result.ok, message: result.message });

        if (result.ok && result.info) {
            pluginState.logger.info(`解析成功 | 源=${parser.name} | 平台=${plat} | 类型=${result.info.type}`);
            return { ...result, attempts };
        }

        lastError = result;
        pluginState.logger.warn(`解析源 [${parser.name}] 失败，尝试下一个 | ${result.message ?? ''}`);
    }

    return {
        ok: false,
        errorType: lastError?.errorType ?? 'api_response',
        message: lastError?.message ?? '所有解析源均失败',
        attempts,
    };
}
