const fs = require('fs');
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// ===== 新增二手交易 (4条，增加closed/done状态) =====
const newTrades = [
  {
    id: 17, title: '《计算机组成原理》唐朔飞 第二版',
    price: 22, originalPrice: 55, category: '教材', condition: '八成新',
    publisher: '计算机学长', publishTime: '2026-06-24T09:00:00Z', location: '南区宿舍4号楼',
    image: '', images: [],
    desc: '课程指定教材，重点章节有标注，期末考试前买来突击用的，考完就出。书况良好无缺页。',
    status: 'closed', views: 187, contact: 'QQ：223344556', tags: ['教材', '计算机', '组成原理'],
    specs: { '出版社': '高等教育出版社', '版次': '第二版', '作者': '唐朔飞' },
    favorited: 11, tradeLocation: '教学楼A栋门口', updatedAt: '2026-06-26T18:00:00Z'
  },
  {
    id: 18, title: '小米手环8 NFC版 曜石黑',
    price: 120, originalPrice: 239, category: '数码', condition: '九五新',
    publisher: '数码控阿杰', publishTime: '2026-06-25T11:00:00Z', location: '东区宿舍3号楼',
    image: '', images: [],
    desc: '买了三个月，戴了不到10次。功能正常，屏幕无划痕，表带几乎全新。换了Apple Watch所以出。包装盒、充电器都在。',
    status: 'done', views: 456, contact: '微信：mi_band8', tags: ['小米', '手环', 'NFC'],
    specs: { '品牌': '小米', '型号': '手环8', '版本': 'NFC版', '颜色': '曜石黑' },
    favorited: 28, tradeLocation: '东区食堂', updatedAt: '2026-06-27T15:00:00Z'
  },
  {
    id: 19, title: '宿舍用小冰箱 50L 冷暖两用',
    price: 200, originalPrice: 499, category: '生活', condition: '七成新',
    publisher: '毕业季甩卖', publishTime: '2026-06-23T16:00:00Z', location: '北区宿舍9号楼',
    image: '', images: [],
    desc: '大二买的，用了两年。夏天冰饮料水果一流，冬天还能暖牛奶。50L容量刚刚好不占地方。毕业带不走。',
    status: 'open', views: 567, contact: '微信：fridge_50L', tags: ['冰箱', '宿舍', '毕业'],
    specs: { '容量': '50L', '功能': '冷暖两用', '功率': '45W', '尺寸': '45×45×50cm' },
    favorited: 52, tradeLocation: '北区9号楼门口', updatedAt: '2026-06-23T16:00:00Z'
  },
  {
    id: 20, title: '全新未拆封 华为FreeBuds 5 银色',
    price: 380, originalPrice: 599, category: '数码', condition: '九九新',
    publisher: '抽奖锦鲤', publishTime: '2026-06-26T13:00:00Z', location: '西区宿舍1号楼',
    image: '', images: [],
    desc: '学生会年会抽奖抽中的奖品，全新未拆封！自己有AirPods了用不上。京东自营同款599，血亏出。',
    status: 'open', views: 723, contact: '微信：lucky_draw', tags: ['华为', 'FreeBuds', '耳机', '全新'],
    specs: { '品牌': '华为', '型号': 'FreeBuds 5', '颜色': '银色', '状态': '全新未拆封' },
    favorited: 67, tradeLocation: '西区食堂门口', updatedAt: '2026-06-26T13:00:00Z'
  }
];

// ===== 新增失物招领 (4条，增加多样性) =====
const newLostFounds = [
  {
    id: 15, title: '笔记本电脑一台',
    type: 'lost', itemName: '笔记本电脑', category: '电子设备',
    location: '图书馆二楼自习区', eventTime: '2026-06-29T14:00:00Z', publishTime: '2026-06-29T16:00:00Z',
    contact: '着急的小钱', contactPhone: '152xxxx7788',
    desc: '联想小新Pro14 灰色，忘记在图书馆二楼C区第三个桌子上。里面有重要论文资料！急急急！',
    status: 'open', images: [], reward: 100, claimLocation: '图书馆服务台',
    resolvedAt: null, finder: null, tags: ['笔记本', '急', '论文']
  },
  {
    id: 16, title: '校园卡+钥匙一串',
    type: 'found', itemName: '校园卡+钥匙', category: '生活用品',
    location: '操场跑道旁长凳', eventTime: '2026-06-29T06:30:00Z', publishTime: '2026-06-29T07:00:00Z',
    contact: '晨跑的好心人', contactPhone: '180xxxx1122',
    desc: '一串钥匙上面挂着校园卡，机械工程学院李同学。已经放在操场门卫室了。',
    status: 'open', images: [], reward: null, claimLocation: '操场门卫室',
    resolvedAt: null, finder: '晨跑的好心人', tags: ['校园卡', '钥匙', '机械学院']
  },
  {
    id: 17, title: '羽毛球拍一支',
    type: 'lost', itemName: '羽毛球拍', category: '生活用品',
    location: '体育馆羽毛球场3号场地', eventTime: '2026-06-28T20:00:00Z', publishTime: '2026-06-28T21:30:00Z',
    contact: '球友小林', contactPhone: '158xxxx9900',
    desc: '尤尼克斯天斧88D，黑色拍袋装着。打完球走的时候忘记拿了。如有捡到请一定联系！',
    status: 'closed', images: [], reward: 30, claimLocation: '体育馆前台',
    resolvedAt: '2026-06-29T09:00:00Z', finder: null, tags: ['羽毛球拍', '尤尼克斯', '体育馆']
  },
  {
    id: 18, title: '电子词典',
    type: 'found', itemName: '电子词典', category: '电子设备',
    location: '教学楼B栋语音室', eventTime: '2026-06-29T11:00:00Z', publishTime: '2026-06-29T12:00:00Z',
    contact: '语音室管理员', contactPhone: '',
    desc: 'CASIO电子词典，英语专业同学常用款。下课后留在语音室桌上了。放语音室前台。',
    status: 'open', images: [], reward: null, claimLocation: '语音室前台',
    resolvedAt: null, finder: '语音室管理员', tags: ['电子词典', 'CASIO', '英语']
  }
];

// ===== 新增拼单搭子 (4条，增加closed状态和多样性) =====
const newGroupBuys = [
  {
    id: 15, title: '拼车去机场（暑假回家）',
    type: 'ping', category: '出行', targetCount: 4, currentCount: 4,
    deadline: '2026-07-02T08:00:00Z', location: '学校北门', publisher: '回家的孩子',
    price: '25', publishTime: '2026-06-27T12:00:00Z',
    desc: '7月2日上午拼滴滴去机场，已经凑满4人。每人约25元。',
    status: 'closed', images: [], contact: '微信：go_home', participants: [
      { name: '回家的孩子', joinedAt: '2026-06-27T12:00:00Z' },
      { name: '东北老乡', joinedAt: '2026-06-27T14:00:00Z' },
      { name: '南方姑娘', joinedAt: '2026-06-28T09:00:00Z' },
      { name: '旅行达人', joinedAt: '2026-06-28T16:00:00Z' }
    ], requirements: '7月2日上午出发，每人分摊25元，北门集合',
    tags: ['拼车', '机场', '暑假'], updatedAt: '2026-06-28T16:00:00Z'
  },
  {
    id: 16, title: '周末骑行团（绕城绿道）',
    type: 'team', category: '运动', targetCount: 10, currentCount: 5,
    deadline: '2026-07-05T07:00:00Z', location: '校门口集合', publisher: '骑行爱好者',
    price: '0', publishTime: '2026-06-28T09:00:00Z',
    desc: '绕城绿道全程约50公里，预计4-5小时。自带自行车（学校门口也有共享单车），沿途风景绝美。',
    status: 'open', images: [], contact: '微信：cycling_fun', participants: [
      { name: '骑行爱好者', joinedAt: '2026-06-28T09:00:00Z' },
      { name: '公路车大神', joinedAt: '2026-06-28T10:00:00Z' },
      { name: '山地车玩家', joinedAt: '2026-06-28T14:00:00Z' },
      { name: '新手上路', joinedAt: '2026-06-29T08:00:00Z' },
      { name: '摄影+骑行', joinedAt: '2026-06-29T15:00:00Z' }
    ], requirements: '会骑自行车即可，建议自带水和干粮，注意防晒',
    tags: ['骑行', '户外', '周末', '绿道'], updatedAt: '2026-06-29T15:00:00Z'
  },
  {
    id: 17, title: '拼团买学习资料（CPA考试）',
    type: 'ping', category: '学习', targetCount: 8, currentCount: 3,
    deadline: '2026-07-15T00:00:00Z', location: '线上拼团', publisher: '考证人小陈',
    price: '35', publishTime: '2026-06-29T10:00:00Z',
    desc: 'CPA会计科目资料大全，包含网课视频+笔记+真题+模拟题。8人拼团价35元/人（原价199），超值！',
    status: 'open', images: [], contact: '微信：cpa_chen', participants: [
      { name: '考证人小陈', joinedAt: '2026-06-29T10:00:00Z' },
      { name: '一定要过CPA', joinedAt: '2026-06-29T11:30:00Z' },
      { name: '财务小金', joinedAt: '2026-06-29T14:00:00Z' }
    ], requirements: '资料为PDF+网盘，拼满后统一发链接，不支持退款',
    tags: ['CPA', '考证', '资料', '拼团'], updatedAt: '2026-06-29T14:00:00Z'
  },
  {
    id: 18, title: '找周末去博物馆的搭子',
    type: 'dazi', category: '娱乐', targetCount: 4, currentCount: 2,
    deadline: '2026-07-06T09:00:00Z', location: '市博物馆', publisher: '博物馆控',
    price: '0', publishTime: '2026-06-28T20:00:00Z',
    desc: '市博物馆有埃及文物特展，一个人去太无聊了想找人一起。门票自理（学生票30元），看完可以一起吃饭。',
    status: 'open', images: [], contact: '微信：museum_lover', participants: [
      { name: '博物馆控', joinedAt: '2026-06-28T20:00:00Z' },
      { name: '历史迷', joinedAt: '2026-06-29T09:00:00Z' }
    ], requirements: '对历史文化有兴趣，周六上午9点市博物馆门口集合',
    tags: ['博物馆', '展览', '周末', '文化'], updatedAt: '2026-06-29T09:00:00Z'
  }
];

// ===== 新增跑腿委托 (4条，增加done/closed状态) =====
const newErrands = [
  {
    id: 15, title: '代取体检报告',
    taskType: '代取', category: '医疗', reward: 8,
    from: '校医院体检中心', to: '研究生宿舍3号楼',
    deadline: '2026-06-29T16:00:00Z', publisher: '刚体检完',
    publishTime: '2026-06-29T10:00:00Z',
    desc: '入职体检报告已出，需要去体检中心窗口领取（报名字和学号即可）。送到研究生3号楼。',
    status: 'open', images: [], contact: '微信：report_pick', urgency: 'medium',
    acceptor: null, completedAt: null, tags: ['体检', '代取', '研究生']
  },
  {
    id: 16, title: '代买退烧药品',
    taskType: '代买', category: '医疗', reward: 5,
    from: '校医院药房', to: '北区宿舍3号楼512',
    deadline: '2026-06-29T14:00:00Z', publisher: '发烧的小林',
    publishTime: '2026-06-29T11:00:00Z',
    desc: '发烧38°C了出不了门，急需退烧药布洛芬一盒+退热贴一盒。校医院药房可以买，送到北区3号楼。',
    status: 'done', images: [], contact: '微信：fever_help', urgency: 'high',
    acceptor: '好室友', completedAt: '2026-06-29T12:30:00Z', tags: ['退烧药', '急', '医疗']
  },
  {
    id: 17, title: '帮忙寄顺丰快递',
    taskType: '代办', category: '快递', reward: 5,
    from: '东区宿舍7号楼', to: '校内顺丰快递点',
    deadline: '2026-06-30T15:00:00Z', publisher: '卖闲置的小孙',
    publishTime: '2026-06-29T09:00:00Z',
    desc: '一个小包裹（耳机），到付即可不用垫钱。拿过去扫码下单就行，5分钟搞定。',
    status: 'open', images: [], contact: '微信：ship_sun', urgency: 'low',
    acceptor: null, completedAt: null, tags: ['寄快递', '顺丰', '代办']
  },
  {
    id: 18, title: '帮忙排队买演唱会门票',
    taskType: '代办', category: '购物', reward: 30,
    from: '体育馆售票处', to: '任何地点（电子票）',
    deadline: '2026-07-08T07:00:00Z', publisher: '追星少女',
    publishTime: '2026-06-28T18:00:00Z',
    desc: '7月8日上午体育馆现场售票，帮忙排队抢两张票（限购2张）。排队费用30元，票钱另外给。',
    status: 'open', images: [], contact: '微信：star_chaser', urgency: 'medium',
    acceptor: null, completedAt: null, tags: ['演唱会', '排队', '代购']
  }
];

db.trades.push(...newTrades);
db.lostFounds.push(...newLostFounds);
db.groupBuys.push(...newGroupBuys);
db.errands.push(...newErrands);

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('Done!');
console.log('trades:', db.trades.length, '- statuses:', [...new Set(db.trades.map(t=>t.status))].join(', '));
console.log('lostFounds:', db.lostFounds.length, '- statuses:', [...new Set(db.lostFounds.map(t=>t.status))].join(', '));
console.log('groupBuys:', db.groupBuys.length, '- statuses:', [...new Set(db.groupBuys.map(t=>t.status))].join(', '));
console.log('errands:', db.errands.length, '- statuses:', [...new Set(db.errands.map(t=>t.status))].join(', '));
