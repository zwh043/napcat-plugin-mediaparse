/**
 * 解析源统一类型定义
 *
 * 多平台、多解析源架构的核心抽象。
 * 每个解析源（apizero / 新野 / xhus 等）实现统一的 MediaParser 接口，
 * 返回统一的 MediaInfo 结构，由 ParserManager 按优先级调度并自动降级。
 */

/** 支持的平台标识 */
export type Platform =
    | 'douyin'      // 抖音
    | 'xiaohongshu' // 小红书
    | 'bilibili'    // 哔哩哔哩
    | 'kuaishou'    // 快手
    | 'weibo'       // 微博
    | 'unknown';    // 未识别（仍可尝试解析）

/** 解析错误类型（与主流程的 ParseErrorType 对齐） */
export type ParseErrorType = 'api_request' | 'api_response' | 'download';

/**
 * 统一的媒体信息结构
 * 所有解析源都归一化到这个结构，下游发送/归档逻辑只认它。
 */
export interface MediaInfo {
    /** 作品唯一 ID（不同源可能用不同字段，取不到则用时间戳兜底） */
    awemeId: string;
    /** 平台标识 */
    platform: Platform;
    /** 平台中文名（如「抖音」「小红书」） */
    platformLabel: string;
    /** 媒体类型 */
    type: 'video' | 'image';
    /** 标题 / 描述文案 */
    desc: string;
    /** 作者昵称 */
    author: string;
    /** 视频无水印直链（type=video 时） */
    playUrl?: string;
    /** 图集图片直链数组（type=image 时） */
    images?: string[];
    /** 封面图 */
    cover?: string;
    /** 点赞数（部分源提供） */
    likes?: number;
    /** 原始分享链接 */
    sourceUrl: string;
    /** 命中的解析源名称（用于日志/记录展示） */
    parserName?: string;
}

/** 单个解析源的返回结果 */
export interface ParseResult {
    ok: boolean;
    info?: MediaInfo;
    errorType?: ParseErrorType;
    message?: string;
}

/**
 * 解析源接口
 * 每个第三方接口实现一个 MediaParser。
 */
export interface MediaParser {
    /** 解析源名称（日志展示用） */
    readonly name: string;
    /**
     * 是否启用（读配置 + 是否支持该平台）
     * @param platform 已识别的平台
     */
    isAvailable(platform: Platform): boolean;
    /**
     * 执行解析
     * @param shareUrl 规范化后的分享链接
     * @param platform 已识别的平台
     */
    parse(shareUrl: string, platform: Platform): Promise<ParseResult>;
}
