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

// -----------------------------------------------------------------
// EXTENDED LOCAL STORAGE CLIENT DATABASE SYSTEM
// -----------------------------------------------------------------
const DEFAULT_UGC_POSTS = [
    { id: 1, title: '黄山日出云海绝美瞬间！一生必去一次', authorId: 'USER_8820', publishTime: '2026-06-01 10:30:00', type: '图文', views: 1250, comments: 24, status: '正常', shieldReason: '', content: '今天早上在光明顶守候了两个小时，终于拍到了绝美的日出云海，云雾缭绕宛如仙境！', mediaUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&auto=format&fit=crop' },
    { id: 2, title: '吐槽一下，西海大峡谷的地轨缆车排队时间太长了', authorId: 'USER_5541', publishTime: '2026-06-02 11:15:00', type: '文字', views: 890, comments: 45, status: '正常', shieldReason: '', content: '排队排了一个多小时，体验实在是一般，建议大家避开高峰期去，或者直接步行走下去。', mediaUrl: '' },
    { id: 3, title: '【航拍视频】上帝视角看冬雪下的飞来石', authorId: 'USER_6672', publishTime: '2026-05-28 15:40:00', type: '视频', views: 3400, comments: 88, status: '正常', shieldReason: '', content: '用无人机记录了飞来石在冬雪覆盖下的壮丽景象，银装素裹，鬼斧神工！', mediaUrl: 'video_placeholder.mp4' },
    { id: 4, title: '黄山山顶住宿避坑指南，必看！', authorId: 'USER_8820', publishTime: '2026-06-01 08:20:00', type: '图文', views: 150, comments: 2, status: '正常', shieldReason: '', content: '千万不要临时去订房，价格贵而且经常没房。最好提前半个月在官方小程序预订。', mediaUrl: '' }
];

const DEFAULT_UGC_COMMENTS = [
    // 帖子 1 评论
    { id: 101, postId: 1, userId: 'USER_5541', content: '景色太壮观了！请问光明顶几点去占位置比较好？', time: '2026-06-01 11:00:00', status: '正常', parentId: null },
    { id: 102, postId: 1, userId: 'USER_8820', content: '我是早上 4:30 到的，人已经不少了，建议提前一点过去。', time: '2026-06-01 11:15:00', status: '正常', parentId: 101, replyTo: '大峡谷探险家' },
    { id: 103, postId: 1, userId: 'USER_5541', content: '收到，多谢博主！那我就 4 点出发。', time: '2026-06-01 11:20:00', status: '正常', parentId: 101, replyTo: '黄山行者' },
    { id: 104, postId: 1, userId: 'USER_6672', content: '黄山的云海确实名不虚传，期待博主更多大作！', time: '2026-06-01 12:30:00', status: '正常', parentId: null },
    { id: 105, postId: 1, userId: 'USER_1001', content: '非常漂亮的日出，构图极其精美，学习了！', time: '2026-06-01 13:00:00', status: '正常', parentId: null },
    { id: 106, postId: 1, userId: 'USER_1002', content: '看完好想去啊，下周调休就去！', time: '2026-06-01 14:00:00', status: '正常', parentId: null },
    { id: 107, postId: 1, userId: 'USER_1003', content: '请问一下博主是用什么相机和镜头拍摄的？', time: '2026-06-01 14:30:00', status: '正常', parentId: null },
    { id: 108, postId: 1, userId: 'USER_8820', content: '用的是全画幅机身，搭配 24-70mm 变焦镜头，云海大场景很适合这个焦段。', time: '2026-06-01 14:45:00', status: '正常', parentId: 107, replyTo: '光明顶守望者' },
    { id: 109, postId: 1, userId: 'USER_1003', content: '谢谢博主，我也打算带上我的 2470 出行了。', time: '2026-06-01 15:00:00', status: '正常', parentId: 107, replyTo: '黄山行者' },
    { id: 110, postId: 1, userId: 'USER_1005', content: '迎客松那里的雾气是不是很大？需要做防水保护吗？', time: '2026-06-01 15:30:00', status: '正常', parentId: null },
    { id: 111, postId: 1, userId: 'USER_8820', content: '早上露水比较重，最好备个相机防雨罩或干毛巾，随时擦拭。', time: '2026-06-01 15:45:00', status: '正常', parentId: 110, replyTo: '徽州古村落' },

    // 帖子 2 评论
    { id: 201, postId: 2, userId: 'USER_8820', content: '同感，排队时间确实有点久。其实可以从前山上去。', time: '2026-06-02 12:00:00', status: '正常', parentId: null },
    { id: 202, postId: 2, userId: 'USER_1001', content: '请问步行下峡谷大概要走多久啊？', time: '2026-06-02 12:15:00', status: '正常', parentId: null },
    { id: 203, postId: 2, userId: 'USER_5541', content: '大概需要 2 个小时，台阶比较陡，很考验膝盖。', time: '2026-06-02 12:30:00', status: '正常', parentId: 202, replyTo: '松涛入梦' },

    // 帖子 3 评论
    { id: 301, postId: 3, userId: 'USER_1006', content: '这个航拍镜头拉得太漂亮了，有大片视感！', time: '2026-05-28 16:00:00', status: '正常', parentId: null },
    { id: 302, postId: 3, userId: 'USER_6672', content: '谢谢支持！冬天的飞来石在雪里有一种独特的宁静美。', time: '2026-05-28 16:15:00', status: '正常', parentId: 301, replyTo: '西海飞石' }
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
    { userId: 'USER_8820', nickname: '黄山行者', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop', bio: '热爱摄影的旅行博主，专注于记录黄山四季美景。', role: '供稿人(未认证)', identity: '普通用户', joinTime: '2026-05-12', aiTextLimit: 1000, aiTextUsed: 120, aiImageLimit: 100, aiImageUsed: 25, aiVideoLimit: 20, aiVideoUsed: 3 },
    { userId: 'USER_5541', nickname: '大峡谷探险家', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', bio: '行万里路，写最真实的旅游攻略！', role: '认证供稿人', identity: '个人供稿', joinTime: '2026-04-18', aiTextLimit: 2000, aiTextUsed: 450, aiImageLimit: 200, aiImageUsed: 80, aiVideoLimit: 50, aiVideoUsed: 12 },
    { userId: 'USER_6672', nickname: '徽风文化传媒', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop', bio: '专注于安徽徽派文化、黄山自然风光的专业传媒机构。', role: '供稿人(未认证)', identity: '机构供稿', joinTime: '2026-05-25', aiTextLimit: 5000, aiTextUsed: 1100, aiImageLimit: 500, aiImageUsed: 180, aiVideoLimit: 100, aiVideoUsed: 35 },
    { userId: 'USER_9901', nickname: '代开发票A', avatar: '', bio: '违规广告账号。', role: '普通用户', identity: '普通用户', joinTime: '2026-05-30', aiTextLimit: 500, aiTextUsed: 50, aiImageLimit: 50, aiImageUsed: 5, aiVideoLimit: 10, aiVideoUsed: 0 },
    { userId: 'USER_1001', nickname: '松涛入梦', avatar: '', bio: '静听松涛，心如止水。', role: '认证供稿人', identity: '个人供稿', joinTime: '2026-05-01', aiTextLimit: 1000, aiTextUsed: 300, aiImageLimit: 100, aiImageUsed: 15, aiVideoLimit: 20, aiVideoUsed: 2 },
    { userId: 'USER_1002', nickname: '云海行舟', avatar: '', bio: '随风起舞，浪迹云海。', role: '普通用户', identity: '普通用户', joinTime: '2026-05-02', aiTextLimit: 1000, aiTextUsed: 500, aiImageLimit: 150, aiImageUsed: 60, aiVideoLimit: 30, aiVideoUsed: 5 },
    { userId: 'USER_1003', nickname: '光明顶守望者', avatar: '', bio: '十年如一日守候黄山日出。', role: '认证供稿人', identity: '个人供稿', joinTime: '2026-05-05', aiTextLimit: 1500, aiTextUsed: 800, aiImageLimit: 200, aiImageUsed: 95, aiVideoLimit: 40, aiVideoUsed: 8 },
    { userId: 'USER_1004', nickname: '翡翠谷溪流', avatar: '', bio: '安徽知名文化旅游传媒工作室。', role: '认证供稿人', identity: '机构供稿', joinTime: '2026-05-10', aiTextLimit: 3000, aiTextUsed: 1500, aiImageLimit: 400, aiImageUsed: 220, aiVideoLimit: 60, aiVideoUsed: 18 },
    { userId: 'USER_1005', nickname: '徽州古村落', avatar: '', bio: '记录青砖黛瓦的徽派印记。', role: '普通用户', identity: '普通用户', joinTime: '2026-05-15', aiTextLimit: 500, aiTextUsed: 200, aiImageLimit: 50, aiImageUsed: 10, aiVideoLimit: 10, aiVideoUsed: 0 },
    { userId: 'USER_1006', nickname: '西海飞石', avatar: '', bio: '奇峰怪石，自然奇观。', role: '认证供稿人', identity: '个人供稿', joinTime: '2026-05-18', aiTextLimit: 1000, aiTextUsed: 600, aiImageLimit: 100, aiImageUsed: 45, aiVideoLimit: 20, aiVideoUsed: 4 },
    { userId: 'USER_1007', nickname: '屯溪老街客', avatar: '', bio: '行走在岁月打磨的石板路上。', role: '普通用户', identity: '普通用户', joinTime: '2026-05-20', aiTextLimit: 500, aiTextUsed: 100, aiImageLimit: 50, aiImageUsed: 8, aiVideoLimit: 10, aiVideoUsed: 1 },
    { userId: 'USER_1008', nickname: '新安江渔歌', avatar: '', bio: '专注山水廊道及新安江流域风光宣介。', role: '认证供稿人', identity: '机构供稿', joinTime: '2026-05-22', aiTextLimit: 5000, aiTextUsed: 2500, aiImageLimit: 600, aiImageUsed: 310, aiVideoLimit: 80, aiVideoUsed: 22 }
];

const DEFAULT_SYSTEM_MESSAGES = [
    { id: 1, userId: 'USER_8820', title: '系统消息', content: '欢迎加入黄山UGC社区！请完善您的供稿资质，认证后可上传优质资源赚取收益。', time: '2026-06-01 09:05:00', read: false }
];

const DEFAULT_CAMPAIGN_WORKS = [
    // 寻找最美迎客松摄影赛 (campaignId: 1)
    { id: 1, campaignId: 1, content: '今天早晨在玉屏楼前拍 of 迎客松，云雾缭绕，仿若仙境。', mediaType: '图片', attachment: '迎客松日出云海.jpg', author: '黄山行者', time: '2026-06-02 08:30:00' },
    { id: 2, campaignId: 1, content: '西海大峡谷的这棵奇松长在峭壁上，生命力极度顽强！', mediaType: '图片', attachment: '西海怪石奇松.jpg', author: '徽风文化传媒', time: '2026-06-03 14:15:30' },
    { id: 3, campaignId: 1, content: '【高清视频投稿】上帝视角下的迎客松全景，云卷云舒气势恢宏。', mediaType: '视频', attachment: '迎客松全景俯瞰.mp4', author: '大峡谷探险家', time: '2026-06-05 10:00:12' },
    { id: 4, campaignId: 1, content: '始信峰的雾凇松针特写，晶莹剔透，美得令人窒息。', mediaType: '图片', attachment: '始信峰冰晶松针.jpg', author: '摄影发烧友', time: '2026-06-06 09:40:00' },
    { id: 5, campaignId: 1, content: '清晨的迎客松，松枝挂着露珠，阳光洒下来格外温暖。', mediaType: '图片', attachment: '晨露松枝特写.jpg', author: '山水墨客', time: '2026-06-07 07:15:22' },
    { id: 6, campaignId: 1, content: '雨后初晴，莲花峰旁的奇松怪石在晚霞中如梦如幻。', mediaType: '图片', attachment: '莲花峰奇松晚霞.jpg', author: '云游四海', time: '2026-06-07 18:50:00' },
    { id: 7, campaignId: 1, content: '光明顶旁的古松在松涛阵阵中向游人招手致意。', mediaType: '图片', attachment: '光明顶古松.jpg', author: '驴友阿强', time: '2026-06-08 11:20:00' },

    // 黄山冬雪AIGC润色征集令 (campaignId: 2)
    { id: 8, campaignId: 2, content: '冬雪覆顶的飞来石，犹如一颗巨大的白玉降临人间。', mediaType: '图片', attachment: '冬雪飞来石AIGC.jpg', author: '徽风文化传媒', time: '2026-12-02 11:30:00' },
    { id: 9, campaignId: 2, content: '视频记录了黄山雾凇在雪后的绝美景象，纯洁无瑕。', mediaType: '视频', attachment: '雪后黄山雾凇晶莹.mp4', author: '黄山行者', time: '2026-12-05 15:40:00' }
];

const DEFAULT_MATERIAL_ORDERS = [
    { orderId: 'ORD_2026_9001', materialName: '迎客松日出云海.jpg', price: 99.00, buyerId: 'USER_8820', channel: '支付宝', time: '2026-06-01 09:12:00', status: '已完成' },
    { orderId: 'ORD_2026_9002', materialName: '西海峡谷航拍短片.mp4', price: 299.00, buyerId: 'USER_5541', channel: '微信支付', time: '2026-06-02 10:45:00', status: '已完成' },
    { orderId: 'ORD_2026_9003', materialName: '雪后飞来石AIGC大图.png', price: 150.00, buyerId: 'USER_6672', channel: '支付宝', time: '2026-06-03 14:20:00', status: '已完成' },
    { orderId: 'ORD_2026_9004', materialName: '翡翠谷夏日溪流慢视频.mp4', price: 199.00, buyerId: 'USER_1001', channel: '微信支付', time: '2026-06-04 16:30:00', status: '已退款' },
    { orderId: 'ORD_2026_9005', materialName: '宏村古建筑摄影组图.zip', price: 350.00, buyerId: 'USER_1002', channel: '支付宝', time: '2026-06-05 11:10:00', status: '已完成' },
    { orderId: 'ORD_2026_9006', materialName: '光明顶云海星空延时.mp4', price: 499.00, buyerId: 'USER_1003', channel: '微信支付', time: '2026-06-05 18:22:00', status: '已完成' },
    { orderId: 'ORD_2026_9007', materialName: '始信峰冬雪松针特写.jpg', price: 88.00, buyerId: 'USER_1005', channel: '支付宝', time: '2026-06-06 08:05:00', status: '已完成' },
    { orderId: 'ORD_2026_9008', materialName: '呈坎八卦村航拍全景.png', price: 180.00, buyerId: 'USER_1006', channel: '微信支付', time: '2026-06-07 13:40:00', status: '已完成' }
];

const DEFAULT_PROOF_ORDERS = [
    { orderId: 'PRF_2026_8001', workName: '迎客松晨曦全景摄影图', applicant: '张建国', price: 200.00, time: '2026-06-01 09:30:00', status: '已出证', certNo: 'DCI-2026-A9901' },
    { orderId: 'PRF_2026_8002', workName: '飞来石雪景AIGC润色大片', applicant: '黄山松石文化传媒有限公司', price: 500.00, time: '2026-06-01 16:12:00', status: '已出证', certNo: 'DCI-2026-B8872' },
    { orderId: 'PRF_2026_8003', workName: '西海大峡谷奇石探秘视频', applicant: '王小二', price: 200.00, time: '2026-05-28 10:15:00', status: '已出证', certNo: 'DCI-2026-C5541' },
    { orderId: 'PRF_2026_8004', workName: '翡翠谷绿潭水波特写', applicant: '李四', price: 200.00, time: '2026-06-02 11:20:00', status: '处理中', certNo: '-' },
    { orderId: 'PRF_2026_8005', workName: '屯溪老街雨后石板路摄影', applicant: '徽风文化传媒', price: 500.00, time: '2026-06-03 15:40:00', status: '已出证', certNo: 'DCI-2026-D1004' },
    { orderId: 'PRF_2026_8006', workName: '新安江渔火航拍短片', applicant: '安徽文旅工作室', price: 500.00, time: '2026-06-04 09:05:00', status: '处理中', certNo: '-' },
    { orderId: 'PRF_2026_8007', workName: '木梨硆云海古村落水彩画', applicant: '黄山行者', price: 200.00, time: '2026-06-05 14:18:00', status: '已出证', certNo: 'DCI-2026-E8820' },
    { orderId: 'PRF_2026_8008', workName: '光明顶星轨百张堆栈图', applicant: '松涛入梦', price: 200.00, time: '2026-06-06 20:30:00', status: '处理中', certNo: '-' }
];

const DEFAULT_CONTRACTS = {
    userAgreement: `<h2>黄山数字资产运营平台用户服务协议</h2>
<p>欢迎您使用黄山数字资产平台。本协议由黄山数字平台（以下简称“本平台”）与所有使用本平台服务的用户共同缔结。</p>
<p><strong>第一条 声明与承诺</strong></p>
<p>用户注册本平台账户时，必须提供真实有效的实名资质。凡通过非合规手段获取账户权限者，本平台保留封禁其账号的权利。</p>
<p><strong>第二条 知识产权及授权许可</strong></p>
<p>本平台所展示的所有摄影、视频、音频及文章资产，均归原创作者所有。任何用户购买下载后，仅获得本平台许可范围内的非排他性使用权，不得擅自传播或转授权。</p>`,
    
    privacyPolicy: `<h2>黄山数字平台用户隐私政策</h2>
<p>本隐私政策旨在向您说明本平台如何收集、使用、存储和保护您的个人信息。</p>
<p><strong>一、 信息的收集范围</strong></p>
<p>1. 当您申请注册或进行实名认证时，我们需要收集您的姓名、身份证号、联系方式以及支付账户信息。<br>
2. 当您进行 AIGC 能力操作时，系统会自动记录您调用的 API 记录及已用次数。</p>
<p><strong>二、 信息安全保障</strong></p>
<p>本平台采用行业领先的安全加密技术对供稿人资质材料及订单信息进行脱敏存储，承诺绝不向任何第三方恶意泄露您的私人敏感数据。</p>`,

    consumerGuarantee: `<h2>消费者权益保障及退款政策</h2>
<p>为保障黄山数字平台消费者的合法权益，制定以下保障条款：</p>
<p><strong>1. 数字商品的特殊性说明</strong></p>
<p>由于摄影图、视频素材等数字商品的易复制和不可收回性，所有素材订单一旦交易成功，原则上<em>不支持无理由退款</em>。</p>
<p><strong>2. 例外退款条件</strong></p>
<p>若消费者购买并付款后，下载的附件文件发生损坏、无法播放、无法解压，且本平台运营人员核实确定后，可向消费者发起退款并更改订单状态为“已退款”。</p>`,

    assetListing: `<h2>数字资产上架与版权交易服务协议</h2>
<p>本协议适用于申请将原创摄影、视频资产在黄山数字平台进行展示并出售的供稿人。</p>
<p><strong>【上架准则】</strong></p>
<p>1. 供稿人对其提报上架的所有作品必须拥有独立、完整的著作权。严禁从他人处盗用或进行未授权的二次创作。<br>
2. 提报上架时可自愿选择是否关联“蚂蚁链存证/DCI确权服务”。选择确权服务需支付相应的区块链确权工本费，通过后可自动出具证书及证书编号。</p>`,

    contributorContract: `<h2>黄山数字平台认证供稿人合作协议</h2>
<p>甲方：黄山数字资产运营平台<br>
乙方：认证供稿人（个人或机构）</p>
<p>双方便就数字资产交易分成及合作事宜达成如下协议：</p>
<p><strong>一、 收益分成策略</strong></p>
<p>乙方上传的素材在平台售出后，甲方将扣除 20% 的平台技术维护费，乙方获得 80% 的实付分成。收益将结算至乙方的分成账户中，乙方可在每月 1-5 号申请提现结算。</p>
<p><strong>二、 违约责任</strong></p>
<p>如乙方因版权抄袭引发法律诉讼纠纷，需独立承担全部责任，甲方有权扣除其全部未提现分成收益并封禁其供稿权限。</p>`
};

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
    dbGet('hscms_ugc_comments', DEFAULT_UGC_COMMENTS);
    dbGet('hscms_sensitive_words', DEFAULT_SENSITIVE_WORDS);
    dbGet('hscms_blacklist', DEFAULT_BLACKLIST);
    dbGet('hscms_asset_submissions', DEFAULT_ASSET_SUBMISSIONS);
    dbGet('hscms_withdrawals', DEFAULT_WITHDRAWALS);
    dbGet('hscms_qualifications', DEFAULT_QUALIFICATIONS);
    dbGet('hscms_users', DEFAULT_USERS);
    dbGet('hscms_system_messages', DEFAULT_SYSTEM_MESSAGES);
    dbGet('hscms_campaign_works', DEFAULT_CAMPAIGN_WORKS);
    
    // Decoupled tables for orders and contracts
    dbGet('hscms_material_orders', DEFAULT_MATERIAL_ORDERS);
    dbGet('hscms_proof_orders', DEFAULT_PROOF_ORDERS);
    dbGet('hscms_contracts', DEFAULT_CONTRACTS);

    // 新增设置相关的配置表
    dbGet('hscms_settings_audit_config', {
        assetAiAudit: true,
        communityAiAudit: true
    });
    dbGet('hscms_settings_aigc_limit', {
        initTextLimit: 1000,
        initImageLimit: 100,
        initVideoLimit: 20
    });
    dbGet('hscms_settings_usage_config', [
        {
            id: 1,
            name: "学术研究",
            desc: "用于学术报告、配图等",
            specs: [
                { name: "学术交流用途", price: 100 },
                { name: "研究报告用途", price: 150 },
                { name: "学术论文配图", price: 200 },
                { name: "学术著作配图", price: 250 }
            ]
        },
        {
            id: 2,
            name: "仅供自用",
            desc: "个人学习与欣赏",
            specs: [
                { name: "仅供个人学习", price: 50 }
            ]
        },
        {
            id: 3,
            name: "公共文化弘扬",
            desc: "公益活动与教育用图",
            specs: [
                { name: "展览展示(公益性)", price: 100 },
                { name: "其他图书、杂志、报刊配图", price: 150 },
                { name: "普及性文章发表用图", price: 180 },
                { name: "公开教育活动用图", price: 120 },
                { name: "公开创意设计用图", price: 200 }
            ]
        },
        {
            id: 4,
            name: "新闻宣传",
            desc: "自媒体或新闻配图等",
            specs: [
                { name: "公众号以及自媒体文章配图", price: 150 },
                { name: "图文新闻报道", price: 180 },
                { name: "视频新闻报道", price: 300 },
                { name: "高清宣传片制作用图", price: 500 },
                { name: "4k宣传片制作用图", price: 800 }
            ]
        }
    ]);
    dbGet('hscms_settings_reject_reasons', [
        "图片/视频分辨率不足，未达高清供稿标准",
        "资产内容存在显著的外部水印、版权争议",
        "作品分类提报有误，请修改属性重新提报"
    ]);
    dbGet('hscms_settings_shield_reasons', [
        "发布垃圾广告或商业推广",
        "包含争议性、偏激低俗言论",
        "含有侵权、涉密或违禁词汇"
    ]);

    // 初始化用户申请下架通知表
    dbGet('hscms_take_down_requests', [
        { id: 'TDR_1001', assetId: 'SUB_8003', assetTitle: '独家黄山导游手绘路线图（矢量PDF）', author: '黄山行者', reason: '商用版使用授权合同已到期，申请平台下架原素材。', submitTime: '2026-06-08 09:00:00', status: '未读' },
        { id: 'TDR_1002', assetId: 'SUB_8004', assetTitle: '云谷寺秋色全景图', author: '徽风文化传媒', reason: '作品版权将转售于第三方机构，应第三方要求在平台申请下架。', submitTime: '2026-06-08 09:30:00', status: '未读' }
    ]);

    // 初始化用户群组配置表
    dbGet('hscms_user_groups', [
        { id: 'GRP_1001', name: '官方自营账号', status: '启用', createTime: '2026-06-01' },
        { id: 'GRP_1002', name: '特邀摄影创作者', status: '启用', createTime: '2026-06-02' },
        { id: 'GRP_1003', name: '自媒体合作机构', status: '启用', createTime: '2026-06-03' }
    ]);
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

// 全局通知铃铛动态注入与红点更新逻辑
window.addEventListener('DOMContentLoaded', () => {
    injectNotificationBell();
    checkTakeDownNotifications();
});

function injectNotificationBell() {
    const headerRight = document.querySelector('.header-right');
    const userProfile = document.querySelector('.user-profile');
    if (headerRight && userProfile && !document.querySelector('.notification-bell-container')) {
        // 创建铃铛容器
        const bellContainer = document.createElement('div');
        bellContainer.className = 'notification-bell-container';
        bellContainer.style.position = 'relative';
        bellContainer.style.cursor = 'pointer';
        bellContainer.style.display = 'flex';
        bellContainer.style.alignItems = 'center';
        bellContainer.style.marginRight = '16px';
        bellContainer.title = '用户申请下架通知';
        bellContainer.onclick = () => {
            location.href = 'take-down-requests.html';
        };
        bellContainer.innerHTML = `
            <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: #475569; transition: fill 0.2s;" onmouseover="this.style.fill='var(--primary-color)'" onmouseout="this.style.fill='#475569'">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
            </svg>
            <span id="bellRedDot" style="display: none; position: absolute; top: -1px; right: -1px; width: 8px; height: 8px; background-color: #ef4444; border-radius: 50%; border: 1.5px solid #ffffff;"></span>
        `;
        
        // 样式微调确保并排对齐
        headerRight.style.display = 'flex';
        headerRight.style.alignItems = 'center';
        
        // 将铃铛按钮插入到用户头像左侧
        headerRight.insertBefore(bellContainer, userProfile);
    }
}

function checkTakeDownNotifications() {
    const defaultRequests = [
        { id: 'TDR_1001', assetId: 'SUB_8003', assetTitle: '独家黄山导游手绘路线图（矢量PDF）', author: '黄山行者', reason: '商用版使用授权合同已到期，申请平台下架原素材。', submitTime: '2026-06-08 09:00:00', status: '未读' },
        { id: 'TDR_1002', assetId: 'SUB_8004', assetTitle: '云谷寺秋色全景图', author: '徽风文化传媒', reason: '作品版权将转售于第三方机构，应第三方要求在平台申请下架。', submitTime: '2026-06-08 09:30:00', status: '未读' }
    ];
    const requests = dbGet('hscms_take_down_requests', defaultRequests);
    const hasUnread = requests.some(r => r.status === '未读');
    const dot = document.getElementById('bellRedDot');
    if (dot) {
        dot.style.display = hasUnread ? 'block' : 'none';
    }
}
