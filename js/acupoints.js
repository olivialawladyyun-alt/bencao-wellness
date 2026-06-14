/* =========================================================================
 *  经络穴位图示 · 对症取穴（解剖参考版）
 *  人体图为半解剖示意：肌肉分群轮廓 + 可切换骨骼参考层。
 *  坐标系 viewBox 0 0 300 640，中线 x=150。穴位坐标按骨性标志定位。
 *  说明：穴位按摩为日常保健参考，孕妇及标注禁忌者请遵专业指导，不替代诊疗。
 * ========================================================================= */

const ACUPOINTS = [
  /* —— 头面 · 正面 —— */
  { id:'baihui', name:'百会', code:'GV20 督脉', view:'front', pts:[[150,22]],
    loc:'头顶正中，两耳尖向上连线与头部正中线的交点。', find:'两耳尖连线中点，头顶最高凹陷处。',
    treats:'头晕、头痛、提神醒脑、安神、升阳举陷', method:'指腹按揉或轻叩，每次 1~2 分钟。', caution:'力度宜轻柔。' },
  { id:'yintang', name:'印堂', code:'EX-HN3 经外奇穴', view:'front', pts:[[150,50]],
    loc:'两眉头连线的中点（眉心）。', find:'额前正中，两眉中间。',
    treats:'安神助眠、缓解头痛、鼻塞、明目', method:'拇指或中指自下而上推抹、按揉 1 分钟。', caution:'—' },
  { id:'taiyang', name:'太阳', code:'EX-HN5 经外奇穴', view:'front', pts:[[122,56],[178,56]],
    loc:'眉梢与外眼角之间，向后约一横指的凹陷处（颞肌处）。', find:'太阳穴，两侧鬓角前凹陷。',
    treats:'头痛、偏头痛、眼疲劳、目赤', method:'指腹轻揉，顺时针旋转 1~2 分钟。', caution:'力度宜轻。' },
  { id:'yingxiang', name:'迎香', code:'LI20 大肠经', view:'front', pts:[[141,74],[159,74]],
    loc:'鼻翼外缘中点旁，鼻唇沟中。', find:'鼻翼两侧凹陷处。',
    treats:'鼻塞、流涕、感冒、鼻炎', method:'食指指腹上下揉按至酸胀，约 1 分钟。', caution:'—' },

  /* —— 颈背腰 · 背面 —— */
  { id:'fengchi', name:'风池', code:'GB20 胆经', view:'back', pts:[[136,98],[164,98]],
    loc:'后颈枕骨下两侧，胸锁乳突肌与斜方肌之间的凹陷，与耳垂平齐。', find:'后脑勺发际两侧大筋外缘凹陷。',
    treats:'头痛、感冒、颈项强痛、目眩、安神', method:'拇指按揉或拿捏，酸胀为度 1~2 分钟。', caution:'力度适中。' },
  { id:'dazhui', name:'大椎', code:'GV14 督脉', view:'back', pts:[[150,128]],
    loc:'第七颈椎（C7）棘突下凹陷中。', find:'低头时颈后最高骨头的下方凹陷。',
    treats:'感冒发热、退热、颈肩不适、提升阳气', method:'按揉、刮痧，亦可艾灸。', caution:'—' },
  { id:'jianjing', name:'肩井', code:'GB21 胆经', view:'back', pts:[[118,132],[182,132]],
    loc:'大椎与肩峰连线中点，斜方肌前缘，肩部最高处。', find:'脖根与肩头连线中点，肩膀最高肌肉处。',
    treats:'肩颈酸痛、落枕、头痛', method:'拇指或四指拿捏、按揉。', caution:'孕妇禁用（古有动胎之虞）。' },
  { id:'feishu', name:'肺俞', code:'BL13 膀胱经', view:'back', pts:[[136,176],[164,176]],
    loc:'第三胸椎（T3）棘突下，旁开 1.5 寸（约两横指）。', find:'上背部脊柱旁，约平肩胛冈内侧。',
    treats:'咳嗽、感冒、呼吸不畅、固表', method:'按揉或艾灸，亦可由他人搓擦。', caution:'—' },
  { id:'mingmen', name:'命门', code:'GV4 督脉', view:'back', pts:[[150,286]],
    loc:'第二腰椎（L2）棘突下，与肚脐前后相对。', find:'后腰正中，与肚脐同高处。',
    treats:'腰膝酸软、畏寒、温补肾阳', method:'按揉或艾灸，阳虚畏寒者尤宜。', caution:'阴虚火旺者慎灸。' },
  { id:'shenshu', name:'肾俞', code:'BL23 膀胱经', view:'back', pts:[[134,286],[166,286]],
    loc:'第二腰椎（L2）棘突下，旁开 1.5 寸。', find:'后腰，与肚脐同高，脊柱旁两指处。',
    treats:'腰酸、畏寒、耳鸣、补肾固本', method:'双手搓热后按揉，或艾灸。', caution:'—' },
  { id:'weizhong', name:'委中', code:'BL40 膀胱经', view:'back', pts:[[131,476],[169,476]],
    loc:'腘窝（膝盖后方）横纹中点，两肌腱之间。', find:'膝盖后窝正中。',
    treats:'腰背痛、腿痛、膝痛（"腰背委中求"）', method:'按揉、点按，酸胀为度。', caution:'不宜用力过猛。' },

  /* —— 胸腹 · 正面 —— */
  { id:'shanzhong', name:'膻中', code:'CV17 任脉', view:'front', pts:[[150,186]],
    loc:'前正中线上，两乳头连线的中点，平第四肋间（胸骨体上）。', find:'胸骨正中，两乳头之间。',
    treats:'胸闷、气郁、心悸、宽胸理气、舒缓情绪', method:'拇指自上而下推按或揉，1~2 分钟。', caution:'—' },
  { id:'zhongwan', name:'中脘', code:'CV12 任脉', view:'front', pts:[[150,238]],
    loc:'前正中线，脐上 4 寸（剑突与脐连线中点）。', find:'肚脐与胸骨下端连线的中点。',
    treats:'胃痛、腹胀、消化不良、和胃健脾', method:'掌根顺时针揉摩，或艾灸。', caution:'—' },
  { id:'tianshu', name:'天枢', code:'ST25 胃经', view:'front', pts:[[128,272],[172,272]],
    loc:'肚脐旁开 2 寸（约三横指），腹直肌外缘。', find:'肚脐两侧三指宽处。',
    treats:'便秘、腹泻、腹胀、调理肠胃', method:'双指按揉，顺时针助通便。', caution:'孕妇慎按。' },
  { id:'qihai', name:'气海', code:'CV6 任脉', view:'front', pts:[[150,288]],
    loc:'前正中线，脐下 1.5 寸。', find:'肚脐下约两指。',
    treats:'乏力、气虚、补气培元', method:'掌揉或艾灸，温补元气。', caution:'孕妇慎用。' },
  { id:'guanyuan', name:'关元', code:'CV4 任脉', view:'front', pts:[[150,302]],
    loc:'前正中线，脐下 3 寸。', find:'肚脐下约四指（一掌宽）。',
    treats:'畏寒、疲劳、痛经、培元固本、温阳', method:'掌揉或艾灸，虚寒者尤宜。', caution:'孕妇禁用。' },

  /* —— 上肢 · 正面 —— */
  { id:'quchi', name:'曲池', code:'LI11 大肠经', view:'front', pts:[[83,258],[217,258]],
    loc:'屈肘成直角，肘横纹外侧端与肱骨外上髁连线中点凹陷。', find:'弯肘时肘弯横纹外端。',
    treats:'清热、降压、上肢酸痛、皮肤问题', method:'拇指按揉至酸胀，1 分钟。', caution:'—' },
  { id:'neiguan', name:'内关', code:'PC6 心包经', view:'front', pts:[[78,330],[222,330]],
    loc:'腕横纹上 2 寸，掌长肌腱与桡侧腕屈肌腱之间。', find:'手腕内侧横纹上三指，两筋中间。',
    treats:'心悸、胸闷、恶心呕吐、晕车、安神', method:'拇指按揉，酸胀为度 1~2 分钟。', caution:'—' },
  { id:'shenmen', name:'神门', code:'HT7 心经', view:'front', pts:[[74,350],[226,350]],
    loc:'腕横纹尺侧端，尺侧腕屈肌腱桡侧凹陷。', find:'手腕横纹靠小指一侧的凹陷。',
    treats:'失眠、心悸、健忘、安神定志', method:'睡前拇指按揉 1~2 分钟。', caution:'—' },
  { id:'hegu', name:'合谷', code:'LI4 大肠经', view:'front', pts:[[74,384],[226,384]],
    loc:'手背第一、二掌骨之间，约平第二掌骨桡侧中点。', find:'虎口处，拇食指并拢肌肉最高点。',
    treats:'头痛、牙痛、感冒、面口诸症、通用止痛', method:'拇指掐揉至酸胀。', caution:'孕妇禁用。' },

  /* —— 下肢 · 正面 —— */
  { id:'xuehai', name:'血海', code:'SP10 脾经', view:'front', pts:[[133,452],[167,452]],
    loc:'屈膝，髌骨内上缘上 2 寸，股内侧肌隆起处。', find:'膝盖内上方鼓起的肌肉处。',
    treats:'月经不调、活血化瘀、皮肤瘙痒', method:'拇指按揉，1~2 分钟。', caution:'—' },
  { id:'yinlingquan', name:'阴陵泉', code:'SP9 脾经', view:'front', pts:[[136,498],[164,498]],
    loc:'小腿内侧，胫骨内侧髁下后方凹陷处。', find:'沿小腿内侧骨向上推，膝下停手凹陷。',
    treats:'祛湿、水肿、腹胀、健脾利湿', method:'拇指按揉至酸胀。', caution:'—' },
  { id:'zusanli', name:'足三里', code:'ST36 胃经', view:'front', pts:[[128,508],[172,508]],
    loc:'外膝眼（犊鼻）下 3 寸，胫骨前嵴外一横指（胫骨前肌上）。', find:'膝盖下四横指，小腿骨外侧一指。',
    treats:'健脾和胃、强身保健、乏力、消化不良', method:'按揉或艾灸，养生第一要穴。', caution:'—' },
  { id:'fenglong', name:'丰隆', code:'ST40 胃经', view:'front', pts:[[123,548],[177,548]],
    loc:'外踝尖上 8 寸，胫骨前嵴外两横指，小腿外侧肌肉丰厚处。', find:'小腿外侧中点，肌肉最厚处。',
    treats:'化痰祛湿、头重昏沉、痰多（化痰要穴）', method:'按揉至酸胀，1~2 分钟。', caution:'—' },
  { id:'sanyinjiao', name:'三阴交', code:'SP6 脾经', view:'front', pts:[[132,588],[168,588]],
    loc:'内踝尖上 3 寸，胫骨内侧缘后方。', find:'内脚踝最高点上四横指，骨头后缘。',
    treats:'妇科、失眠、脾胃、肝肾、调和气血', method:'拇指按揉，酸胀为度。', caution:'孕妇禁用。' },
  { id:'taixi', name:'太溪', code:'KI3 肾经', view:'front', pts:[[133,604],[167,604]],
    loc:'内踝尖与跟腱之间的凹陷中。', find:'内脚踝后方与脚筋之间凹陷。',
    treats:'补肾、腰膝酸软、耳鸣、滋阴', method:'拇指按揉 1~2 分钟。', caution:'—' },
  { id:'taichong', name:'太冲', code:'LR3 肝经', view:'front', pts:[[134,622],[166,622]],
    loc:'足背第一、二跖骨结合部前方凹陷。', find:'脚背大脚趾与二趾缝向上推，停手凹陷处。',
    treats:'疏肝解郁、情绪郁怒、头痛、目赤、平肝', method:'由前向后推按，酸胀为度。', caution:'—' },
  { id:'yongquan', name:'涌泉', code:'KI1 肾经', view:'front', pts:[[126,631],[174,631]],
    loc:'足底，蜷足时前 1/3 的凹陷处（第二、三趾缝与足跟连线前 1/3）。', find:'脚掌前部，蜷脚趾时凹下去的地方。',
    treats:'安眠、引火归元、头晕、补肾、足心热', method:'睡前搓揉至足心发热。', caution:'—' },

  /* —— 总览补充穴位（参考"穴位大全"图）—— */
  { id:'touwei', name:'头维', code:'ST8 胃经', view:'front', pts:[[130,42],[170,42]],
    loc:'额角发际直上 0.5 寸，头部两侧。', find:'前额发际两角处。',
    treats:'慢性头痛、偏头痛、目眩', method:'指腹按揉，1~2 分钟。', caution:'—' },
  { id:'cuanzhu', name:'攒竹', code:'BL2 膀胱经', view:'front', pts:[[143,49],[157,49]],
    loc:'眉头凹陷处，眶上切迹。', find:'两侧眉头最里端。',
    treats:'头痛、目眩、目赤肿痛、眼疲劳', method:'拇指轻按揉，眼周力度宜轻。', caution:'力度宜轻。' },
  { id:'sibai', name:'四白', code:'ST2 胃经', view:'front', pts:[[140,61],[160,61]],
    loc:'瞳孔直下，眶下孔凹陷处。', find:'眼睛正下方约一指，颧骨上缘凹陷。',
    treats:'明目、缓解黑眼圈、色斑、面部气血（美容）', method:'指腹轻揉，避开眼球。', caution:'力度宜轻。' },
  { id:'shuigou', name:'水沟（人中）', code:'GV26 督脉', view:'front', pts:[[150,80]],
    loc:'人中沟上 1/3 与下 2/3 交点。', find:'鼻唇之间人中沟中。',
    treats:'醒神开窍、困倦、急救要穴', method:'指甲掐按（应急），日常轻按即可。', caution:'孕妇慎用强刺激。' },
  { id:'futu', name:'扶突', code:'LI18 大肠经', view:'front', pts:[[137,106],[163,106]],
    loc:'喉结旁开 3 寸，胸锁乳突肌中。', find:'颈侧，喉结水平、大筋中间。',
    treats:'咳嗽、气喘、咽喉肿痛', method:'轻按揉，颈部勿用力压。', caution:'颈动脉处，力度宜轻、勿久压。' },
  { id:'tiantu', name:'天突', code:'CV22 任脉', view:'front', pts:[[150,118]],
    loc:'胸骨上窝中央（两锁骨之间凹陷）。', find:'锁骨中间、喉下凹陷处。',
    treats:'咳嗽、喉咙痛、气逆、胸闷', method:'指腹轻向下按揉，勿向内深压。', caution:'勿向气管深压。' },
  { id:'zhongfu', name:'中府', code:'LU1 肺经', view:'front', pts:[[126,150],[174,150]],
    loc:'胸前壁外上方，前正中线旁开 6 寸，平第一肋间。', find:'锁骨外下方凹陷下一肋。',
    treats:'感冒、咳嗽、气喘、胸闷（肺之募穴）', method:'指腹按揉，1~2 分钟。', caution:'—' },
  { id:'qimen', name:'期门', code:'LR14 肝经', view:'front', pts:[[127,206],[173,206]],
    loc:'乳头直下，第六肋间隙。', find:'乳头向下数两肋。',
    treats:'疏肝理气、宿醉、胸胁胀（肝之募穴）', method:'指腹沿肋间轻揉。', caution:'—' },
  { id:'jiuwei', name:'鸠尾', code:'CV15 任脉', view:'front', pts:[[150,213]],
    loc:'前正中线，剑突下、脐上 7 寸。', find:'胸骨最下端下方。',
    treats:'宁心安神、失眠、心烦、胸闷', method:'指腹轻揉，力度宜轻。', caution:'剑突下，力度宜轻。' },
  { id:'zhangmen', name:'章门', code:'LR13 肝经', view:'front', pts:[[117,252],[183,252]],
    loc:'第十一肋游离端下方，侧腹部。', find:'屈肘合腋，肘尖到处。',
    treats:'胸闷、腹胀、嗳气、消化（脾之募穴）', method:'指腹按揉，1~2 分钟。', caution:'—' },
  { id:'shenque', name:'神阙', code:'CV8 任脉', view:'front', pts:[[150,278]],
    loc:'肚脐正中。', find:'肚脐。',
    treats:'温阳救逆、腹泻腹痛、便秘、培元（多灸不针）', method:'掌心搓热敷脐或隔盐灸。', caution:'此穴禁针，宜灸或按摩。' },
  { id:'zhongji', name:'中极', code:'CV3 任脉', view:'front', pts:[[150,316]],
    loc:'前正中线，脐下 4 寸。', find:'肚脐与耻骨连线，脐下五指。',
    treats:'痛经、月经不调、小便不利（膀胱之募穴）', method:'掌揉或艾灸。', caution:'孕妇禁用。' },
  { id:'laogong', name:'劳宫', code:'PC8 心包经', view:'front', pts:[[80,388],[220,388]],
    loc:'掌心，第二、三掌骨之间偏第三掌骨，握拳中指尖处。', find:'握拳时中指指尖按到的掌心处。',
    treats:'疲劳、口腔溃疡、心烦、压力过大、清心', method:'另手拇指按揉掌心。', caution:'—' },
  { id:'zulinqi', name:'足临泣', code:'GB41 胆经', view:'front', pts:[[137,628],[163,628]],
    loc:'足背第四、五跖骨结合部前方凹陷。', find:'脚背小趾与四趾缝向上推到凹陷。',
    treats:'慢性头痛、偏头痛、目眩、胁痛', method:'指腹按揉，酸胀为度。', caution:'—' }
];

/* ---------- 对症取穴方案 ---------- */
const SYMPTOM_GROUPS = [
  { key:'touteng',  name:'头痛 / 头晕',     tip:'先轻揉太阳、按风池放松，再叩百会、掐合谷。', points:['taiyang','fengchi','baihui','hegu','yintang'] },
  { key:'shimian',  name:'失眠 / 安神',     tip:'睡前依次按神门、内关、三阴交，搓涌泉至发热助眠。', points:['shenmen','neiguan','sanyinjiao','yongquan','baihui','yintang'] },
  { key:'jianjing', name:'颈肩酸痛 / 落枕', tip:'拿捏肩井、按风池松颈，配大椎、合谷。', points:['fengchi','jianjing','dazhui','hegu'] },
  { key:'ganmao',   name:'感冒 / 鼻塞',     tip:'揉迎香通鼻，按风池、大椎、合谷疏风解表。', points:['yingxiang','fengchi','dazhui','hegu','feishu'] },
  { key:'piwei',    name:'脾胃 / 消化不良', tip:'顺时针揉中脘、按足三里健脾和胃，内关止呕。', points:['zusanli','zhongwan','neiguan','tianshu'] },
  { key:'pifa',     name:'疲劳乏力 / 补气', tip:'灸或揉气海、关元培元，按足三里、叩百会提神。', points:['zusanli','qihai','guanyuan','baihui'] },
  { key:'weihan',   name:'畏寒 / 温阳',     tip:'艾灸关元、命门、肾俞温补，搓涌泉引火归元。', points:['guanyuan','mingmen','shenshu','zusanli','yongquan'] },
  { key:'qingxu',   name:'情绪郁闷 / 压力', tip:'推膻中宽胸，按太冲疏肝、内关神门安神。', points:['taichong','shanzhong','neiguan','shenmen'] },
  { key:'tongjing', name:'痛经 / 妇科调理', tip:'温灸关元，按三阴交、血海、太冲调和气血。', points:['sanyinjiao','guanyuan','xuehai','taichong'] },
  { key:'qushi',    name:'祛湿 / 化痰',     tip:'重按丰隆化痰，配阴陵泉、足三里健脾利湿。', points:['fenglong','yinlingquan','zusanli'] },
  { key:'yanpilao', name:'眼疲劳',          tip:'轻揉太阳、印堂，按风池缓解眼胀。', points:['taiyang','yintang','fengchi'] },
  { key:'bianmi',   name:'便秘',            tip:'顺时针揉天枢，配足三里、合谷促通便。', points:['tianshu','zusanli','hegu'] },
  { key:'yaosuan',  name:'腰酸 / 补肾',     tip:'搓热按肾俞、命门，配委中缓解腰腿。', points:['shenshu','mingmen','weizhong'] },
  { key:'shanghuo', name:'上火 / 清热',     tip:'按合谷、曲池清热，太冲平肝降火。', points:['hegu','quchi','taichong'] }
];

/* 体质 → 推荐对症取穴 key（供出诊"经络"板块联动） */
const CONST_ACU = {
  pinghe:['pifa'], qixu:['pifa','piwei'], yangxu:['weihan'], yinxu:['shimian','shanghuo'],
  tanshi:['qushi'], shire:['shanghuo','qushi'], xueyu:['tongjing'], qiyu:['qingxu','shimian'], tebing:['ganmao']
};

/* =========================================================================
 *  人体解剖图（SVG）— 肌肉轮廓 + 可选骨骼参考层
 * ========================================================================= */

/* 连续身体轮廓（真人风格）：定义左半边，用代码镜像生成右半边，保证对称。
   每段 [x,y,c1x,c1y,c2x,c2y]：从上一锚点以三次贝塞尔到 (x,y)，首项为起点。 */
function silhouettePath() {
  const L = [
    [136,92],                         // 颈左上（下颌下）
    [94,140, 137,110, 116,120],       // 颈→肩/三角肌上缘
    [84,188, 90,156, 86,170],         // 三角肌→上臂
    [80,256, 82,214, 80,236],         // →肘（略带肱二头肌）
    [74,360, 78,300, 76,332],         // 前臂→腕
    [72,382, 73,368, 72,375],         // →手掌根
    [75,414, 70,394, 71,406],         // →小指侧指尖
    [92,416, 80,423, 87,421],         // 横过指尖
    [94,380, 95,406, 94,392],         // 手内侧（拇指侧）上行
    [101,256, 98,344, 100,300],       // 前臂内侧
    [112,172, 104,226, 107,198],      // 上臂内侧→腋下
    [114,252, 114,196, 114,224],      // 体侧→腰
    [111,306, 114,278, 111,294],      // 腰→髋
    [120,362, 111,324, 116,344],      // 髋→大腿
    [126,462, 124,400, 125,436],      // 大腿→膝
    [122,556, 128,490, 124,524],      // 膝→小腿
    [119,606, 121,580, 119,596],      // 小腿→踝
    [117,626, 119,616, 118,622],      // 踝→足跟
    [112,640, 114,634, 108,639],      // 足跟→足底前
    [134,636, 120,643, 130,640],      // 足趾前缘
    [141,606, 139,632, 140,620],      // 足内侧→内踝
    [145,520, 142,582, 144,548],      // 内踝→胫
    [147,466, 146,496, 146,478],      // 胫→膝内
    [149,372, 148,440, 148,400],      // 膝内→大腿内侧
    [150,322, 149,348, 150,332]       // 大腿内侧→会阴中点
  ];
  let d = `M${L[0][0]},${L[0][1]}`;
  for (let i = 1; i < L.length; i++) { const s = L[i]; d += ` C${s[2]},${s[3]} ${s[4]},${s[5]} ${s[0]},${s[1]}`; }
  const mx = x => 300 - x;                       // 右半边镜像
  for (let i = L.length - 1; i >= 1; i--) {
    const s = L[i], prev = L[i - 1];
    d += ` C${mx(s[4])},${s[5]} ${mx(s[2])},${s[3]} ${mx(prev[0])},${prev[1]}`;
  }
  return d + ' Z';
}

/* 基础体块：连续身体轮廓 + 头 + 手指 + 脚趾（正背通用） */
function bodyBase() {
  return `
  <path class="an-skin" d="${silhouettePath()}"/>
  <!-- 头 -->
  <path class="an-skin" d="M150,16 C168,16 180,30 180,50 C180,70 169,88 150,92
    C131,88 120,70 120,50 C120,30 132,16 150,16 Z"/>
  <ellipse class="an-skin" cx="120" cy="55" rx="5" ry="9"/>
  <ellipse class="an-skin" cx="180" cy="55" rx="5" ry="9"/>
  <!-- 手指 -->
  <g class="an-line">
    <path d="M78,400 L77,415"/><path d="M82,399 L82,417"/><path d="M86,400 L87,416"/><path d="M90,401 L91,414"/>
    <path d="M222,400 L223,415"/><path d="M218,399 L218,417"/><path d="M214,400 L213,416"/><path d="M210,401 L209,414"/>
  </g>
  <!-- 脚趾 -->
  <g class="an-line">
    <path d="M115,632 L114,640"/><path d="M120,633 L120,641"/><path d="M125,633 L126,640"/><path d="M130,632 L131,638"/>
    <path d="M185,632 L186,640"/><path d="M180,633 L180,641"/><path d="M175,633 L174,640"/><path d="M170,632 L169,638"/>
  </g>`;
}

/* 正面定义线与五官（精简，真人风格） */
function frontDetail() {
  return `<g class="an-musc">
    <!-- 发际 -->
    <path class="an-line" d="M129,40 Q150,30 171,40"/>
    <!-- 眉 -->
    <path class="an-line" d="M135,49 Q140,46 146,49"/><path class="an-line" d="M154,49 Q160,46 165,49"/>
    <!-- 眼 -->
    <path class="an-line" d="M136,55 Q141,52 147,55"/><path class="an-line" d="M153,55 Q159,52 164,55"/>
    <circle class="an-eye" cx="141" cy="55" r="1.7"/><circle class="an-eye" cx="159" cy="55" r="1.7"/>
    <!-- 鼻 -->
    <path class="an-line" d="M150,57 L148,70 Q150,73 153,71"/>
    <!-- 嘴 -->
    <path class="an-line" d="M143,79 Q150,83 157,79"/>
    <!-- 胸锁乳突肌（淡） -->
    <path class="an-line" d="M141,94 Q145,108 148,118"/><path class="an-line" d="M159,94 Q155,108 152,118"/>
    <!-- 锁骨 -->
    <path class="an-line" d="M150,132 Q130,130 110,140"/><path class="an-line" d="M150,132 Q170,130 190,140"/>
    <!-- 胸 -->
    <path class="an-line" d="M150,140 C136,142 124,150 121,168 Q132,180 150,180"/>
    <path class="an-line" d="M150,140 C164,142 176,150 179,168 Q168,180 150,180"/>
    <circle class="an-dot" cx="128" cy="172" r="1.8"/><circle class="an-dot" cx="172" cy="172" r="1.8"/>
    <!-- 腹白线 + 腱划（少量） -->
    <path class="an-line" d="M150,182 L150,300"/>
    <path class="an-line" d="M134,222 L166,222"/><path class="an-line" d="M134,250 L166,250"/>
    <!-- 脐 -->
    <circle class="an-dot" cx="150" cy="278" r="2.2"/>
    <!-- 膝（淡） -->
    <path class="an-line" d="M129,460 Q135,474 141,460"/><path class="an-line" d="M159,460 Q165,474 171,460"/>
    <!-- 腕（淡） -->
    <path class="an-line" d="M75,372 Q83,376 91,372"/><path class="an-line" d="M225,372 Q217,376 209,372"/>
  </g>`;
}

/* 背面定义线 + 脊柱（精简） */
function backDetail() {
  return `<g class="an-musc">
    <!-- 后发际 -->
    <path class="an-line" d="M132,84 Q150,90 168,84"/>
    <!-- 斜方肌（淡） -->
    <path class="an-line" d="M150,118 Q126,126 106,142"/><path class="an-line" d="M150,118 Q174,126 194,142"/>
    <!-- 脊柱（常显） -->
    <line class="an-spine" x1="150" y1="118" x2="150" y2="318"/>
    <g class="an-vert">
      ${[128,142,156,170,184,198,212,226,240,254,268,282,296,310].map(y =>
        `<rect x="146" y="${y-3}" width="8" height="5" rx="1.5"/>`).join('')}
    </g>
    <!-- 肩胛（淡） -->
    <path class="an-line" d="M128,150 Q138,172 134,192"/><path class="an-line" d="M172,150 Q162,172 166,192"/>
    <!-- 腰窝/臀线 -->
    <path class="an-line" d="M150,318 Q132,322 120,338"/><path class="an-line" d="M150,318 Q168,322 180,338"/>
    <!-- 膝后（淡） -->
    <path class="an-line" d="M129,462 Q135,472 141,462"/><path class="an-line" d="M159,462 Q165,472 171,462"/>
  </g>`;
}

/* 骨骼参考层（叠加） */
function skeletonFront() {
  return `<g class="an-bone">
    <!-- 颅骨 -->
    <ellipse cx="150" cy="52" rx="24" ry="30"/>
    <path d="M134,74 Q150,86 166,74"/>
    <!-- 锁骨 -->
    <path d="M150,132 C134,134 118,138 106,146"/>
    <path d="M150,132 C166,134 182,138 194,146"/>
    <!-- 胸骨 + 肋骨 -->
    <line x1="150" y1="136" x2="150" y2="208"/>
    ${[150,162,174,186,198].map(y =>
      `<path d="M150,${y} C132,${y-2} 116,${y+6} 110,${y+16}"/><path d="M150,${y} C168,${y-2} 184,${y+6} 190,${y+16}"/>`).join('')}
    <!-- 脊柱（隐约） -->
    <line x1="150" y1="208" x2="150" y2="300" stroke-dasharray="2 3"/>
    <!-- 骨盆 -->
    <path class="bfill" d="M116,300 C124,294 140,294 150,302 C160,294 176,294 184,300
      C186,314 176,326 168,330 L150,316 L132,330 C124,326 114,314 116,300 Z"/>
    <!-- 肱骨 / 桡尺骨 -->
    <line x1="100" y1="156" x2="88" y2="252"/><line x1="88" y1="252" x2="80" y2="356"/>
    <line x1="200" y1="156" x2="212" y2="252"/><line x1="212" y1="252" x2="220" y2="356"/>
    <circle cx="88" cy="252" r="4"/><circle cx="212" cy="252" r="4"/>
    <!-- 股骨 / 胫腓骨 -->
    <line x1="138" y1="332" x2="135" y2="460"/><line x1="135" y1="478" x2="128" y2="606"/>
    <line x1="162" y1="332" x2="165" y2="460"/><line x1="165" y1="478" x2="172" y2="606"/>
    <line x1="143" y1="478" x2="140" y2="600"/><line x1="157" y1="478" x2="160" y2="600"/>
    <circle cx="135" cy="468" r="6"/><circle cx="165" cy="468" r="6"/>
  </g>`;
}

function skeletonBack() {
  const verts = [
    {y:128,l:'C7'},{y:148},{y:164},{y:176,l:'T3'},{y:192},{y:208},{y:222,l:'T7'},
    {y:236},{y:250},{y:264},{y:278},{y:286,l:'L2'},{y:300},{y:312}
  ];
  return `<g class="an-bone">
    <ellipse cx="150" cy="52" rx="24" ry="30"/>
    <!-- 脊柱椎体 + 编号 -->
    <line x1="150" y1="118" x2="150" y2="320"/>
    ${verts.map(v => `<rect x="145" y="${v.y-4}" width="10" height="6" rx="2"/>` +
      (v.l ? `<text class="an-vtext" x="170" y="${v.y+2}">${v.l}</text><line class="an-lead" x1="156" y1="${v.y-1}" x2="168" y2="${v.y-1}"/>` : '')).join('')}
    <!-- 肩胛骨 -->
    <path d="M124,150 L146,158 L136,196 Z"/>
    <path d="M176,150 L154,158 L164,196 Z"/>
    <!-- 肋骨（背侧隐约） -->
    ${[160,174,188,202].map(y =>
      `<path d="M150,${y} C134,${y+2} 120,${y+8} 114,${y+16}" stroke-dasharray="2 3"/><path d="M150,${y} C166,${y+2} 180,${y+8} 186,${y+16}" stroke-dasharray="2 3"/>`).join('')}
    <!-- 骨盆 / 骶骨 -->
    <path class="bfill" d="M118,316 C126,308 140,308 150,316 C160,308 174,308 182,316
      C184,332 174,346 166,350 L150,332 L134,350 C126,346 116,332 118,316 Z"/>
    <!-- 长骨 -->
    <line x1="100" y1="156" x2="88" y2="252"/><line x1="88" y1="252" x2="80" y2="356"/>
    <line x1="200" y1="156" x2="212" y2="252"/><line x1="212" y1="252" x2="220" y2="356"/>
    <line x1="138" y1="334" x2="135" y2="460"/><line x1="135" y1="476" x2="130" y2="606"/>
    <line x1="162" y1="334" x2="165" y2="460"/><line x1="165" y1="476" x2="170" y2="606"/>
    <circle cx="135" cy="468" r="6"/><circle cx="165" cy="468" r="6"/>
  </g>`;
}

/* =========================================================================
 *  全身总览（穴位大全）海报式排版：全身一张图 + 两侧引线标注框
 *  side: L/R 标注框在左/右；ly: 标注框中心纵坐标；ind: 主治简注（每元素一行）
 * ========================================================================= */
const POSTER = [
  /* —— 左列（自上而下）—— */
  { id:'baihui',   side:'L', ly:74,  ind:['慢性头痛','安神、脱发'] },
  { id:'sibai',    side:'L', ly:116, ind:['色斑、黑眼圈','肤色暗沉'] },
  { id:'shuigou',  side:'L', ly:156, ind:['困倦','醒神开窍'] },
  { id:'futu',     side:'L', ly:196, ind:['咳嗽气喘','咽喉肿痛'] },
  { id:'zhongfu',  side:'L', ly:236, ind:['感冒、咳嗽'] },
  { id:'shanzhong',side:'L', ly:274, ind:['压力过大','脾、肺、失眠'] },
  { id:'jiuwei',   side:'L', ly:312, ind:['失眠、宁心'] },
  { id:'zhangmen', side:'L', ly:350, ind:['胸闷、腹胀','嗳气'] },
  { id:'tianshu',  side:'L', ly:390, ind:['腹泻、便秘'] },
  { id:'neiguan',  side:'L', ly:430, ind:['宿醉、嗳气','晕车'] },
  { id:'laogong',  side:'L', ly:470, ind:['疲劳、口疮','压力过大'] },
  { id:'xuehai',   side:'L', ly:516, ind:['痛经、健忘','皮肤干燥'] },
  { id:'fenglong', side:'L', ly:566, ind:['健忘、减肥','化痰'] },
  { id:'sanyinjiao',side:'L',ly:612, ind:['痛经、体寒','妇科、减肥'] },

  /* —— 右列（自上而下）—— */
  { id:'touwei',   side:'R', ly:74,  ind:['慢性头痛'] },
  { id:'cuanzhu',  side:'R', ly:110, ind:['头痛目眩','目赤肿痛'] },
  { id:'taiyang',  side:'R', ly:146, ind:['眼疲劳、色斑','肤色暗沉、浮肿'] },
  { id:'yingxiang',side:'R', ly:184, ind:['鼻塞、过敏','法令纹、衰老'] },
  { id:'tiantu',   side:'R', ly:222, ind:['喉咙痛、咳嗽'] },
  { id:'qimen',    side:'R', ly:258, ind:['宿醉、疏肝'] },
  { id:'zhongwan', side:'R', ly:296, ind:['胃胀、胃痛','食欲不振'] },
  { id:'quchi',    side:'R', ly:334, ind:['痘痘、清热'] },
  { id:'shenque',  side:'R', ly:368, ind:['腹泻腹痛','便秘（灸）'] },
  { id:'guanyuan', side:'R', ly:404, ind:['畏寒、便秘','腹泻、培元'] },
  { id:'shenmen',  side:'R', ly:444, ind:['心、肺、失眠'] },
  { id:'yinlingquan',side:'R',ly:480,ind:['皮肤干燥','祛湿、水肿'] },
  { id:'zusanli',  side:'R', ly:520, ind:['胃胀、乏力','食欲不振'] },
  { id:'taichong', side:'R', ly:566, ind:['失眠、疏肝','身体发热、压力'] },
  { id:'zulinqi',  side:'R', ly:612, ind:['慢性头痛'] }
];

function posterSVG() {
  const OX = 218, OY = 12;     // 人体图平移量
  let dots = '', leads = '', boxes = '';

  POSTER.forEach(p => {
    const a = ACUPOINTS.find(x => x.id === p.id);
    // 取与标注框同侧的点（双侧取靠该侧者）
    let pt = a.pts[0];
    if (a.pts.length > 1) pt = p.side === 'L'
      ? a.pts.reduce((m, c) => c[0] < m[0] ? c : m)
      : a.pts.reduce((m, c) => c[0] > m[0] ? c : m);
    const dx = OX + pt[0], dy = OY + pt[1];
    dots += `<circle class="pz-dot" cx="${dx}" cy="${dy}" r="3"/>`;

    const lines = p.ind;
    const nm = a.name.replace(/（[^）]*）/, '');   // 总览框内去掉括号注释，统一框宽
    const nameW = 54;
    if (p.side === 'L') {
      const px = 150, py = p.ly;                  // 穴名框右边缘 x≈px
      const bx = px - nameW;
      leads += `<polyline class="pz-lead" points="${px},${py} ${Math.min(dx-26,px+40)},${py} ${dx},${dy}"/>`;
      boxes += `<rect class="pz-pill" x="${bx}" y="${py-11}" width="${nameW}" height="22" rx="7"/>
        <text class="pz-name" x="${bx+nameW/2}" y="${py+5}" text-anchor="middle">${nm}</text>`;
      const ty = py - (lines.length - 1) * 8;
      boxes += lines.map((t, i) =>
        `<text class="pz-ind" x="${bx-8}" y="${ty + i*16 + 4}" text-anchor="end">${t}</text>`).join('');
    } else {
      const px = 588, py = p.ly;                  // 穴名框左边缘 x≈px
      leads += `<polyline class="pz-lead" points="${px},${py} ${Math.max(dx+26,px-40)},${py} ${dx},${dy}"/>`;
      boxes += `<rect class="pz-pill" x="${px}" y="${py-11}" width="${nameW}" height="22" rx="7"/>
        <text class="pz-name" x="${px+nameW/2}" y="${py+5}" text-anchor="middle">${nm}</text>`;
      const ty = py - (lines.length - 1) * 8;
      boxes += lines.map((t, i) =>
        `<text class="pz-ind" x="${px+nameW+8}" y="${ty + i*16 + 4}" text-anchor="start">${t}</text>`).join('');
    }
    // 让穴名可点击查看详解
    boxes += `<rect class="pz-hit" x="${p.side==='L'?150-nameW:588}" y="${p.ly-11}" width="${nameW}" height="22"
      onclick="posterFocus('${p.id}')"/>`;
  });

  return `<svg viewBox="0 0 760 680" class="poster-svg">
    <g class="poster-fig" transform="translate(${OX},${OY})">${bodyAnatomy('front', false)}</g>
    <g class="pz-leads">${leads}</g>
    <g class="pz-dots">${dots}</g>
    <g class="pz-boxes">${boxes}</g>
  </svg>`;
}

/* 组装：view = front/back, bones = 是否叠加骨骼层 */
function bodyAnatomy(view, bones) {
  const detail = view === 'front' ? frontDetail() : backDetail();
  const skel = bones ? (view === 'front' ? skeletonFront() : skeletonBack()) : '';
  return `<g class="figure ${bones ? 'show-bones' : ''}">
    <g class="an-body">${bodyBase()}</g>
    ${detail}
    ${skel}
    <text class="fig-tag" x="150" y="640" text-anchor="middle">${view === 'front' ? '正 面' : '背 面'}${bones ? ' · 含骨骼参考' : ''}</text>
  </g>`;
}
