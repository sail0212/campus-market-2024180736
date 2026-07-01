const fs = require('fs');
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// ===== Add placeholder images to trades =====
// Each trade gets 2-4 suitable placeholder images
const tradeImages = {
  1: ['https://picsum.photos/seed/trade1a/400/300', 'https://picsum.photos/seed/trade1b/400/300'],
  2: ['https://picsum.photos/seed/trade2a/400/300', 'https://picsum.photos/seed/trade2b/400/300', 'https://picsum.photos/seed/trade2c/400/300'],
  3: ['https://picsum.photos/seed/trade3a/400/300', 'https://picsum.photos/seed/trade3b/400/300'],
  4: ['https://picsum.photos/seed/trade4a/400/300', 'https://picsum.photos/seed/trade4b/400/300', 'https://picsum.photos/seed/trade4c/400/300'],
  5: ['https://picsum.photos/seed/trade5a/400/300'],
  6: ['https://picsum.photos/seed/trade6a/400/300', 'https://picsum.photos/seed/trade6b/400/300'],
  7: ['https://picsum.photos/seed/trade7a/400/300', 'https://picsum.photos/seed/trade7b/400/300', 'https://picsum.photos/seed/trade7c/400/300'],
  8: ['https://picsum.photos/seed/trade8a/400/300', 'https://picsum.photos/seed/trade8b/400/300'],
  9: ['https://picsum.photos/seed/trade9a/400/300', 'https://picsum.photos/seed/trade9b/400/300'],
  10: ['https://picsum.photos/seed/trade10a/400/300'],
  11: ['https://picsum.photos/seed/trade11a/400/300', 'https://picsum.photos/seed/trade11b/400/300'],
  12: ['https://picsum.photos/seed/trade12a/400/300', 'https://picsum.photos/seed/trade12b/400/300', 'https://picsum.photos/seed/trade12c/400/300'],
  13: ['https://picsum.photos/seed/trade13a/400/300', 'https://picsum.photos/seed/trade13b/400/300'],
  14: ['https://picsum.photos/seed/trade14a/400/300', 'https://picsum.photos/seed/trade14b/400/300'],
  15: ['https://picsum.photos/seed/trade15a/400/300'],
  16: ['https://picsum.photos/seed/trade16a/400/300', 'https://picsum.photos/seed/trade16b/400/300', 'https://picsum.photos/seed/trade16c/400/300'],
  17: ['https://picsum.photos/seed/trade17a/400/300', 'https://picsum.photos/seed/trade17b/400/300'],
  18: ['https://picsum.photos/seed/trade18a/400/300', 'https://picsum.photos/seed/trade18b/400/300', 'https://picsum.photos/seed/trade18c/400/300'],
  19: ['https://picsum.photos/seed/trade19a/400/300', 'https://picsum.photos/seed/trade19b/400/300'],
  20: ['https://picsum.photos/seed/trade20a/400/300', 'https://picsum.photos/seed/trade20b/400/300', 'https://picsum.photos/seed/trade20c/400/300'],
};

db.trades.forEach(t => {
  if (tradeImages[t.id]) {
    t.images = tradeImages[t.id];
    t.image = tradeImages[t.id][0];
  }
});

// ===== Add placeholder images to lostFounds =====
const lfImages = {
  1: ['https://picsum.photos/seed/lf1a/400/300'],
  2: ['https://picsum.photos/seed/lf2a/400/300', 'https://picsum.photos/seed/lf2b/400/300'],
  3: ['https://picsum.photos/seed/lf3a/400/300'],
  5: ['https://picsum.photos/seed/lf5a/400/300', 'https://picsum.photos/seed/lf5b/400/300'],
  8: ['https://picsum.photos/seed/lf8a/400/300'],
  9: ['https://picsum.photos/seed/lf9a/400/300'],
  10: ['https://picsum.photos/seed/lf10a/400/300'],
  12: ['https://picsum.photos/seed/lf12a/400/300'],
  15: ['https://picsum.photos/seed/lf15a/400/300', 'https://picsum.photos/seed/lf15b/400/300'],
  16: ['https://picsum.photos/seed/lf16a/400/300'],
  18: ['https://picsum.photos/seed/lf18a/400/300'],
};
db.lostFounds.forEach(t => {
  if (lfImages[t.id]) t.images = lfImages[t.id];
});

// ===== Add placeholder images to groupBuys =====
const gbImages = {
  1: ['https://picsum.photos/seed/gb1a/400/300'],
  4: ['https://picsum.photos/seed/gb4a/400/300'],
  7: ['https://picsum.photos/seed/gb7a/400/300', 'https://picsum.photos/seed/gb7b/400/300'],
  9: ['https://picsum.photos/seed/gb9a/400/300'],
  13: ['https://picsum.photos/seed/gb13a/400/300', 'https://picsum.photos/seed/gb13b/400/300'],
  16: ['https://picsum.photos/seed/gb16a/400/300', 'https://picsum.photos/seed/gb16b/400/300'],
  18: ['https://picsum.photos/seed/gb18a/400/300'],
};
db.groupBuys.forEach(t => {
  if (gbImages[t.id]) t.images = gbImages[t.id];
});

// ===== Add placeholder images to errands =====
const erImages = {
  1: ['https://picsum.photos/seed/er1a/400/300'],
  4: ['https://picsum.photos/seed/er4a/400/300'],
  7: ['https://picsum.photos/seed/er7a/400/300'],
  9: ['https://picsum.photos/seed/er9a/400/300'],
  12: ['https://picsum.photos/seed/er12a/400/300'],
  15: ['https://picsum.photos/seed/er15a/400/300'],
  18: ['https://picsum.photos/seed/er18a/400/300', 'https://picsum.photos/seed/er18b/400/300'],
};
db.errands.forEach(t => {
  if (erImages[t.id]) t.images = erImages[t.id];
});

// ===== Add comments collection =====
db.comments = [
  {
    id: 1,
    itemType: 'trade',
    itemId: 2,
    author: '想买的学生',
    content: '请问还在吗？可以小刀吗？',
    time: '2026-06-29T10:00:00Z'
  },
  {
    id: 2,
    itemType: 'trade',
    itemId: 2,
    author: '小李同学',
    content: '还在的，价格可以商量，加微信聊吧',
    time: '2026-06-29T10:30:00Z'
  },
  {
    id: 3,
    itemType: 'trade',
    itemId: 7,
    author: '耳机爱好者',
    content: '还在保的话我要了，怎么联系？',
    time: '2026-06-29T09:00:00Z'
  },
  {
    id: 4,
    itemType: 'trade',
    itemId: 7,
    author: '音乐爱好者',
    content: '已出，谢谢关注',
    time: '2026-06-29T14:00:00Z'
  },
  {
    id: 5,
    itemType: 'lostFound',
    itemId: 1,
    author: '好心人',
    content: '我在图书馆看到一个黑色钱包，已经交到服务台了，你去问问',
    time: '2026-06-28T14:00:00Z'
  },
  {
    id: 6,
    itemType: 'lostFound',
    itemId: 1,
    author: '张同学',
    content: '谢谢！我马上去看',
    time: '2026-06-28T14:15:00Z'
  },
  {
    id: 7,
    itemType: 'lostFound',
    itemId: 15,
    author: '图书馆常客',
    content: '昨天在二楼C区确实看到一台笔记本，好像被管理员收走了',
    time: '2026-06-29T17:30:00Z'
  },
  {
    id: 8,
    itemType: 'groupBuy',
    itemId: 4,
    author: '想上分',
    content: '我来打野！王者50星，加我微信',
    time: '2026-06-28T12:00:00Z'
  },
  {
    id: 9,
    itemType: 'groupBuy',
    itemId: 7,
    author: '路人甲',
    content: '周六下午我有空！还有位置吗？',
    time: '2026-06-28T17:00:00Z'
  },
  {
    id: 10,
    itemType: 'groupBuy',
    itemId: 7,
    author: '电影搭子',
    content: '有的有的，加微信聊',
    time: '2026-06-28T17:10:00Z'
  },
  {
    id: 11,
    itemType: 'errand',
    itemId: 1,
    author: '刚好在北区',
    content: '我正好在北区食堂，帮你带。微信联系',
    time: '2026-06-28T11:45:00Z'
  },
  {
    id: 12,
    itemType: 'errand',
    itemId: 6,
    author: '打印店老板',
    content: '已打印好，在店里等着取',
    time: '2026-06-28T10:00:00Z'
  },
  {
    id: 13,
    itemType: 'trade',
    itemId: 20,
    author: '数码控',
    content: '全新的话380真的很划算！可惜我已经买了',
    time: '2026-06-29T15:00:00Z'
  },
  {
    id: 14,
    itemType: 'trade',
    itemId: 19,
    author: '宿舍管理员',
    content: '提醒一下，宿舍用电器不能超过500W哦',
    time: '2026-06-29T08:00:00Z'
  },
  {
    id: 15,
    itemType: 'lostFound',
    itemId: 1,
    author: '张同学',
    content: '找到了！在图书馆服务台，太感谢了🙏',
    time: '2026-06-28T15:00:00Z'
  }
];

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

const imgStats = {trades:0, lostFounds:0, groupBuys:0, errands:0};
db.trades.forEach(t => { if(t.images.length>0) imgStats.trades++; });
db.lostFounds.forEach(t => { if(t.images.length>0) imgStats.lostFounds++; });
db.groupBuys.forEach(t => { if(t.images.length>0) imgStats.groupBuys++; });
db.errands.forEach(t => { if(t.images.length>0) imgStats.errands++; });

console.log('Image coverage:');
console.log('  trades:', imgStats.trades + '/' + db.trades.length);
console.log('  lostFounds:', imgStats.lostFounds + '/' + db.lostFounds.length);
console.log('  groupBuys:', imgStats.groupBuys + '/' + db.groupBuys.length);
console.log('  errands:', imgStats.errands + '/' + db.errands.length);
console.log('Comments added:', db.comments.length);
