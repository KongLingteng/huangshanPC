// Global Toast and Modal Controllers
let toastTimeout;

function showLockToast(message, isSuccess = false) {
    const toast = document.getElementById('lockToast');
    const toastText = document.getElementById('lockToastText');
    const toastIcon = document.getElementById('lockToastIcon');

    if (!toast || !toastText) return;

    toastText.textContent = message;
    
    if (isSuccess) {
        toast.classList.add('success');
        toastIcon.innerHTML = `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`;
    } else {
        toast.classList.remove('success');
        toastIcon.innerHTML = `<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>`;
    }

    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// -----------------------------------------------------------------
// LOCAL STORAGE CLIENT DATABASE SYSTEM
// -----------------------------------------------------------------
const DEFAULT_TOPICS = [
    { id: 1, name: '摄影素材', status: '启用', weight: 10, assets: 12 },
    { id: 2, name: '黄山冬雪', status: '启用', weight: 8, assets: 4 },
    { id: 3, name: '水墨山水', status: '禁用', weight: 5, assets: 0 },
    { id: 4, name: '迎客松特写', status: '启用', weight: 12, assets: 0 }
];

const DEFAULT_TAGS = {
    geographic: ['迎客松', '西海大峡谷', '始信峰', '光明顶'],
    style: ['水墨', '写实', '全景', '极简'],
    season: ['春归', '夏翠', '秋绚', '冬雪']
};

const DEFAULT_SCHEDULES = [
    { id: 1, targetType: '专题', targetId: 3, targetName: '水墨山水', type: '上架', time: '2026-06-05 10:00:00', status: '等待中' },
    { id: 2, targetType: '活动', targetId: 1, targetName: '寻找最美迎客松摄影赛', type: '下架', time: '2026-06-12 18:00:00', status: '等待中' }
];

const DEFAULT_BANNERS = [
    { id: 1, title: '摄影大赛冬雪专题', type: '活动落地页', target: 'ACT_10023', status: '启用' },
    { id: 2, title: '西海大峡谷春归航拍', type: '视频素材', target: 'VID_0099', status: '禁用' }
];

const DEFAULT_CAMPAIGNS = [
    { id: 1, title: '寻找最美迎客松摄影赛', start: '2026-06-01 00:00:00', end: '2026-06-30 23:59:59', visibility: '公开', tag: '迎客松', status: '进行中' },
    { id: 2, title: '黄山冬雪AIGC润色征集令', start: '2026-12-01 08:00:00', end: '2026-12-15 18:00:00', visibility: '不公开', tag: '冬雪', status: '未开始' }
];

// DB Helper Methods
function dbGet(key, defaultVal) {
    const val = localStorage.getItem(key);
    if (val === null) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
    }
    try {
        return JSON.parse(val);
    } catch (e) {
        return defaultVal;
    }
}

function dbSave(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Default materials and relationships database
const DEFAULT_MATERIALS = [
    { id: 'MAT_001', name: 'bike_316.png_fff_Cui_...', type: '图片', format: 'png', time: '2026-05-31 05:30:13', folder: 'Standard Dataset in LibCity/BIKECHI202007-202009', tag: '全景', validity: '有效' },
    { id: 'MAT_002', name: 'bike_348.png_fff_Cui_...', type: '图片', format: 'png', time: '2026-05-31 05:30:13', folder: 'Standard Dataset in LibCity/BIKECHI202007-202009', tag: '写实', validity: '有效' },
    { id: 'MAT_003', name: 'bike_322.png_fff_Cui_...', type: '图片', format: 'png', time: '2026-05-31 05:30:13', folder: 'Standard Dataset in LibCity/BIKECHI202007-202009', tag: '写实', validity: '有效' },
    { id: 'MAT_004', name: 'wos_harbor_Y9d5-vKo...', type: '图片', format: 'png', time: '2026-04-18 09:25:00', folder: 'Standard Dataset in LibCity/Beijing_Taxi_Sample', tag: '极简', validity: '有效' },
    { id: 'MAT_005', name: 'Valorant 2026.04.12 - ...', type: '视频', format: 'mp4', time: '2026-04-14 04:59:31', folder: 'Standard Dataset in LibCity/Global', tag: '写实', validity: '有效' },
    { id: 'MAT_006', name: 'Valorant 2026.04.08 - ...', type: '视频', format: 'mp4', time: '2026-04-14 04:59:19', folder: 'Standard Dataset in LibCity/Global', tag: '全景', validity: '有效' },
    { id: 'MAT_007', name: 'Valorant 2026.03.18 - ...', type: '视频', format: 'mp4', time: '2026-04-14 04:59:18', folder: 'Standard Dataset in LibCity/Global', tag: '全景', validity: '有效' },
    { id: 'MAT_008', name: 'Valorant 2026.02.26 - ...', type: '视频', format: 'mp4', time: '2026-04-14 04:59:19', folder: 'Standard Dataset in LibCity/Global', tag: '水墨', validity: '有效' },
    { id: 'MAT_009', name: 'bike_325.png_fff_Cui_...', type: '图片', format: 'png', time: '2026-05-31 05:31:00', folder: 'Standard Dataset in LibCity/BIKECHI202007-202009-3', tag: '全景', validity: '有效' },
    { id: 'MAT_010', name: 'bike_350.png_fff_Cui_...', type: '图片', format: 'png', time: '2026-05-31 05:32:00', folder: 'Standard Dataset in LibCity/BIKECHI202007-202009-3', tag: '写实', validity: '有效' },
    { id: 'MAT_011', name: 'taxi_001.jpg', type: '图片', format: 'jpg', time: '2026-04-20 10:15:30', folder: 'Standard Dataset in LibCity/Beijing_Taxi_Sample', tag: '全景', validity: '有效' },
    { id: 'MAT_012', name: 'taxi_002.jpg', type: '图片', format: 'jpg', time: '2026-04-20 10:16:00', folder: 'Standard Dataset in LibCity/Beijing_Taxi_Sample', tag: '极简', validity: '有效' },
    { id: 'MAT_013', name: 'subway_line1.mp4', type: '视频', format: 'mp4', time: '2026-05-01 08:00:00', folder: 'Standard Dataset in LibCity/BEIJING_SUBWAY_10MIN', tag: '全景', validity: '有效' },
    { id: 'MAT_014', name: 'subway_line2.mp4', type: '视频', format: 'mp4', time: '2026-05-01 08:05:00', folder: 'Standard Dataset in LibCity/BEIJING_SUBWAY_15MIN', tag: '极简', validity: '失效' },
    { id: 'MAT_015', name: 'subway_line3.mp4', type: '视频', format: 'mp4', time: '2026-05-01 08:10:00', folder: 'Standard Dataset in LibCity/BEIJING_SUBWAY_30MIN', tag: '写实', validity: '有效' },
    { id: 'MAT_016', name: 'chicago_transit.jpg', type: '图片', format: 'jpg', time: '2026-04-12 14:20:00', folder: 'Standard Dataset in LibCity/CHICAGO_RISK', tag: '写实', validity: '有效' },
    { id: 'MAT_017', name: 'seattle_flow.jpg', type: '图片', format: 'jpg', time: '2026-05-15 11:30:00', folder: 'Standard Dataset in LibCity/LOOP_SEATTLE', tag: '全景', validity: '有效' },
    { id: 'MAT_018', name: 'hangzhou_metro.mp4', type: '视频', format: 'mp4', time: '2026-05-10 16:45:00', folder: 'Standard Dataset in LibCity/HZMETRO', tag: '全景', validity: '有效' },
    { id: 'MAT_019', name: '黄山三天两晚经典游记与自驾攻略', type: '文章', format: 'doc', time: '2026-05-20 10:00:00', folder: 'Standard Dataset in LibCity/Global', tag: '写实', validity: '有效' },
    { id: 'MAT_020', name: '冬雪下的徽派建筑与奇松美学摄影指南', type: '文章', format: 'pdf', time: '2026-05-21 11:30:00', folder: 'Standard Dataset in LibCity/Global', tag: '水墨', validity: '有效' },
    { id: 'MAT_021', name: '西海大峡谷地质风貌科普手册', type: '文章', format: 'txt', time: '2026-05-25 15:45:00', folder: 'Standard Dataset in LibCity/Global', tag: '极简', validity: '有效' }
];

const DEFAULT_TOPIC_MATERIALS = {
    1: [
        { id: 'MAT_001', weight: 120 },
        { id: 'MAT_002', weight: 110 },
        { id: 'MAT_003', weight: 100 },
        { id: 'MAT_004', weight: 90 },
        { id: 'MAT_005', weight: 80 },
        { id: 'MAT_006', weight: 70 },
        { id: 'MAT_007', weight: 60 },
        { id: 'MAT_008', weight: 50 },
        { id: 'MAT_009', weight: 40 },
        { id: 'MAT_010', weight: 30 },
        { id: 'MAT_011', weight: 20 },
        { id: 'MAT_012', weight: 10 }
    ],
    2: [
        { id: 'MAT_013', weight: 40 },
        { id: 'MAT_014', weight: 30 },
        { id: 'MAT_015', weight: 20 },
        { id: 'MAT_016', weight: 10 }
    ],
    3: [],
    4: []
};

const DEFAULT_CAMPAIGN_WORKS = [
    // 寻找最美迎客松摄影赛 (campaignId: 1)
    { id: 1, campaignId: 1, content: '今天早晨在玉屏楼前拍的迎客松，云雾缭绕，仿若仙境。', mediaType: '图片', attachment: '迎客松日出云海.jpg', author: '黄山行者', time: '2026-06-02 08:30:00' },
    { id: 2, campaignId: 1, content: '西海大峡谷的这棵奇松长在峭壁上，生命力极度顽强！', mediaType: '图片', attachment: '西海怪石奇松.jpg', author: '徽风文化传媒', time: '2026-06-03 14:15:30' },
    { id: 3, campaignId: 1, content: '【高清视频投稿】上帝视角下的迎客松全景，云卷云舒气势恢宏。', mediaType: '视频', attachment: '迎客松全景俯瞰.mp4', author: '大峡谷探险家', time: '2026-06-05 10:00:12' },
    { id: 4, campaignId: 1, content: '始信峰的雾凇松针特写，晶莹剔透，美得令人窒息。', mediaType: '图片', attachment: '始信峰冰晶松针.jpg', author: '摄影发烧友', time: '2026-06-06 09:40:00' },
    { id: 5, campaignId: 1, content: '清晨的迎客松，松枝挂着露珠，阳光洒下来格外温暖。', mediaType: '图片', attachment: '晨露松枝特写.jpg', author: '山水墨客', time: '2026-06-07 07:15:22' },
    { id: 6, campaignId: 1, content: '雨后初晴，莲花峰旁的奇松怪石在晚霞中如梦如幻。', mediaType: '图片', attachment: '莲花峰奇松晚霞.jpg', author: '云游四海', time: '2026-06-07 18:50:00' },
    { id: 7, campaignId: 1, content: '光明顶旁的古松在松涛阵阵中向游人招手致意。', mediaType: '图片', attachment: '光明顶古松.jpg', author: '驴友阿强', time: '2026-06-08 11:20:00' },

    // 黄山冬雪AIGC润色征集令 (campaignId: 2)
    { id: 8, campaignId: 2, content: '冬雪覆顶的飞来石，犹如一颗巨大的白玉降临人间。', mediaType: '图片', attachment: '冬雪飞来石AIGC.jpg', author: '徽风文化传媒', time: '2026-12-02 11:30:00' },
    { id: 9, campaignId: 2, content: '视频记录了黄山雾凇在雪后的绝美景象，纯洁无瑕。', mediaType: '视频', attachment: '雪后黄山雾凇奇景.mp4', author: '黄山行者', time: '2026-12-05 15:40:00' }
];

// Database Initialization
function initDatabase() {
    dbGet('hscms_topics', DEFAULT_TOPICS);
    dbGet('hscms_tags', DEFAULT_TAGS);
    
    let schedules = dbGet('hscms_schedules', DEFAULT_SCHEDULES);
    schedules = schedules.filter(s => {
        const idStr = String(s.targetId || s.assetId || '');
        const nameStr = String(s.targetName || s.assetName || '');
        return !idStr.includes('ASSET_2026_12') && 
               !idStr.includes('ASSET_2026_09') && 
               !nameStr.includes('ASSET_2026_12') && 
               !nameStr.includes('ASSET_2026_09');
    });
    dbSave('hscms_schedules', schedules);

    dbGet('hscms_banners', DEFAULT_BANNERS);
    dbGet('hscms_campaigns', DEFAULT_CAMPAIGNS);
    dbGet('hscms_materials', DEFAULT_MATERIALS);
    dbGet('hscms_topic_materials', DEFAULT_TOPIC_MATERIALS);
    dbGet('hscms_campaign_works', DEFAULT_CAMPAIGN_WORKS);
}

// Initialize on Script load
initDatabase();

// Global listener for search shortcut Ctrl+K
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showLockToast('搜索模块暂不可用（除“内容管理”外均处于锁定状态）');
    }
});
