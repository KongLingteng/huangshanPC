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
    { id: 1, title: '寻找最美迎客松摄影赛', start: '2026-06-01 00:00:00', end: '2026-06-30 23:59:59', visibility: '公开', status: '进行中' },
    { id: 2, title: '黄山冬雪AIGC润色征集令', start: '2026-12-01 08:00:00', end: '2026-12-15 18:00:00', visibility: '不公开', status: '未开始' }
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

// -----------------------------------------------------------------
// EXTENDED LOCAL STORAGE CLIENT DATABASE SYSTEM
// -----------------------------------------------------------------
const DEFAULT_UGC_POSTS = [
    { id: 1, title: '黄山日出云海绝美瞬间！一生必去一次', authorId: 'USER_8820', publishTime: '2026-06-01 10:30:00', type: '图文', views: 1250, comments: 24, status: '正常', shieldReason: '', content: '今天早上在光明顶守候了两个小时，终于拍到了绝美的日出云海，云雾缭绕宛如仙境！', mediaUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&auto=format&fit=crop' },
    { id: 2, title: '吐槽一下，西海大峡谷的地轨缆车排队时间太长了', authorId: 'USER_5541', publishTime: '2026-06-02 11:15:00', type: '文字', views: 890, comments: 45, status: '正常', shieldReason: '', content: '排队排了一个多小时，体验实在是一般，建议大家避开高峰期去，或者直接步行走下去。', mediaUrl: '' },
    { id: 3, title: '【航拍视频】上帝视角看冬雪下的飞来石', authorId: 'USER_6672', publishTime: '2026-05-28 15:40:00', type: '视频', views: 3400, comments: 88, status: '正常', shieldReason: '', content: '用无人机记录了飞来石在冬雪覆盖下的壮丽景象，银装素裹，鬼斧神工！', mediaUrl: 'video_placeholder.mp4' },
    { id: 4, title: '黄山山顶住宿避坑指南，必看！', authorId: 'USER_8820', publishTime: '2026-06-01 08:20:00', type: '图文', views: 150, comments: 2, status: '正常', shieldReason: '', content: '千万不要临时去订房，价格贵而且经常没房。最好提前半个月在官方小程序预订。', mediaUrl: '' }
];

const DEFAULT_SENSITIVE_WORDS = [
    { id: 1, word: '发票代开', category: '侵权', replacement: '***' },
    { id: 2, word: '违禁药品', category: '色情', replacement: '***' },
    { id: 3, word: '枪支弹药', category: '暴恐', replacement: '***' },
    { id: 4, word: '内部泄密', category: '涉密', replacement: '***' }
];

const DEFAULT_BLACKLIST = [
    { userId: 'USER_9901', banTime: '2026-05-30 12:00:00', reason: '频繁发布垃圾广告发票代开', duration: '永久' }
];

const DEFAULT_ASSET_SUBMISSIONS = [
    { id: 'SUB_8001', title: '迎客松晨曦高清摄影图', hash: '8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a', author: '黄山行者', authorType: '个人', submitTime: '2026-06-01 09:00:00', needProof: '是', antChainId: 'AntChain_2026_0901A', dciCode: '-', status: '待审核', rejectReason: '' },
    { id: 'SUB_8002', title: '翡翠谷夏日溪流慢镜头视频', hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', author: '徽风文化传媒', authorType: '机构', submitTime: '2026-06-01 14:30:00', needProof: '是', antChainId: 'AntChain_2026_0923B', dciCode: '-', status: '待审核', rejectReason: '' },
    { id: 'SUB_8003', title: '独家黄山导游手绘路线图（矢量PDF）', hash: '9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d', author: '黄山行者', authorType: '个人', submitTime: '2026-05-29 11:00:00', needProof: '否', antChainId: '-', dciCode: '-', status: '待审核', rejectReason: '' },
    { id: 'SUB_8004', title: '云谷寺秋色全景图', hash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f', author: '徽风文化传媒', authorType: '机构', submitTime: '2026-05-25 10:00:00', needProof: '是', antChainId: 'AntChain_2026_0820C', dciCode: 'DCI-2026-U891A', status: '审核成功', rejectReason: '' }
];

const DEFAULT_WITHDRAWALS = [
    { id: 'WDR_3001', user: '黄山行者', userType: '个人', amount: 350.00, account: 'alipay: zhang**@163.com', applyTime: '2026-06-02 09:00:00', status: '待审批', rejectReason: '' },
    { id: 'WDR_3002', user: '徽风文化传媒', userType: '机构', amount: 5200.00, account: 'bank: 622202******8899', applyTime: '2026-05-20 14:00:00', status: '待审批', rejectReason: '' },
    { id: 'WDR_3003', user: '大峡谷探险家', userType: '个人', amount: 80.00, account: 'alipay: ma**@qq.com', applyTime: '2026-06-01 10:00:00', status: '待审批', rejectReason: '' },
    { id: 'WDR_3004', user: '大峡谷探险家', userType: '个人', amount: 1500.00, account: 'alipay: travel**@163.com', applyTime: '2026-05-25 16:30:00', status: '已打款', rejectReason: '' }
];

const DEFAULT_QUALIFICATIONS = [
    { id: 'QUAL_4001', userId: 'USER_8820', type: '个人', applicant: '张建国', idNumber: '340104198808081234', attachments: ['身份证正面.jpg', '身份证反面.jpg'], submitTime: '2026-06-01 09:00:00', status: '待审核', rejectReason: '' },
    { id: 'QUAL_4002', userId: 'USER_6672', type: '机构', applicant: '黄山松石文化传媒有限公司', idNumber: '91340100MA2PXXXXXX', attachments: ['营业执照.jpg', '企业法人授权书.pdf'], submitTime: '2026-06-01 15:00:00', status: '待审核', rejectReason: '' },
    { id: 'QUAL_4003', userId: 'USER_5541', type: '个人', applicant: '王小二', idNumber: '340104199505054321', attachments: ['身份证正面.jpg', '身份证反面.jpg'], submitTime: '2026-05-28 10:00:00', status: '已通过', rejectReason: '' }
];

const DEFAULT_USERS = [
    { userId: 'USER_8820', nickname: '黄山行者', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop', bio: '热爱摄影的旅行博主，专注于记录黄山四季美景。', role: '供稿人(未认证)' },
    { userId: 'USER_5541', nickname: '大峡谷探险家', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', bio: '行万里路，写最真实的旅游攻略！', role: '认证供稿人' },
    { userId: 'USER_6672', nickname: '徽风文化传媒', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop', bio: '专注于安徽徽派文化、黄山自然风光的专业传媒机构。', role: '供稿人(未认证)' },
    { userId: 'USER_9901', nickname: '代开发票A', avatar: '', bio: '违规广告账号。', role: '普通用户' }
];

const DEFAULT_SYSTEM_MESSAGES = [
    { id: 1, userId: 'USER_8820', title: '系统消息', content: '欢迎加入黄山UGC社区！请完善您的供稿资质，认证后可上传优质资源赚取收益。', time: '2026-06-01 09:05:00', read: false }
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

    // New tables
    dbGet('hscms_ugc_posts', DEFAULT_UGC_POSTS);
    dbGet('hscms_sensitive_words', DEFAULT_SENSITIVE_WORDS);
    dbGet('hscms_blacklist', DEFAULT_BLACKLIST);
    dbGet('hscms_asset_submissions', DEFAULT_ASSET_SUBMISSIONS);
    dbGet('hscms_withdrawals', DEFAULT_WITHDRAWALS);
    dbGet('hscms_qualifications', DEFAULT_QUALIFICATIONS);
    dbGet('hscms_users', DEFAULT_USERS);
    dbGet('hscms_system_messages', DEFAULT_SYSTEM_MESSAGES);
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
