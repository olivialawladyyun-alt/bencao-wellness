/* =========================================================================
 *  问诊量表数据
 *  依据：中华中医药学会《中医体质分类与判定》标准 (ZYYXH/T157-2009)
 *  9 种体质、66 个条目，每题 5 级评分（1 没有 ~ 5 总是）
 *  平和质中标注 reverse:true 的条目反向计分（得分 = 6 - 作答分）
 * ========================================================================= */

const SCALE_OPTIONS = [
  { value: 1, label: '没有（根本不）' },
  { value: 2, label: '很少（有一点）' },
  { value: 3, label: '有时（有些）' },
  { value: 4, label: '经常（相当）' },
  { value: 5, label: '总是（非常）' }
];

/* 九种体质元信息：key、名称、一句话特征、主题色 */
const CONSTITUTIONS = [
  { key: 'pinghe',  name: '平和质', tag: '阴阳气血调和',   color: '#6ea96b' },
  { key: 'qixu',    name: '气虚质', tag: '元气不足易疲乏', color: '#c9a24b' },
  { key: 'yangxu',  name: '阳虚质', tag: '阳气不足畏寒凉', color: '#7a9cc6' },
  { key: 'yinxu',   name: '阴虚质', tag: '阴津亏少燥热',   color: '#c97b63' },
  { key: 'tanshi',  name: '痰湿质', tag: '水湿停聚体沉重', color: '#8a9a7b' },
  { key: 'shire',   name: '湿热质', tag: '湿热内蕴面油垢', color: '#b08a3e' },
  { key: 'xueyu',   name: '血瘀质', tag: '血行不畅多瘀滞', color: '#9c6b7a' },
  { key: 'qiyu',    name: '气郁质', tag: '气机郁滞情志不舒', color: '#7b88a8' },
  { key: 'tebing',  name: '特禀质', tag: '禀赋特异易过敏', color: '#a88abf' }
];

/* 问卷条目。c = 所属体质 key；reverse = 是否反向计分 */
const QUESTIONS = [
  /* —— 平和质（8 题，多数反向）—— */
  { c: 'pinghe', reverse: false, text: '您精力充沛吗？' },
  { c: 'pinghe', reverse: true,  text: '您容易疲乏吗？' },
  { c: 'pinghe', reverse: true,  text: '您说话声音低弱无力吗？' },
  { c: 'pinghe', reverse: true,  text: '您感到闷闷不乐、情绪低沉吗？' },
  { c: 'pinghe', reverse: true,  text: '您比一般人耐受不了寒冷（冬天的寒冷，夏天的冷空调、电扇等）吗？' },
  { c: 'pinghe', reverse: false, text: '您能适应外界自然和社会环境的变化吗？' },
  { c: 'pinghe', reverse: true,  text: '您容易失眠吗？' },
  { c: 'pinghe', reverse: true,  text: '您容易忘事（健忘）吗？' },

  /* —— 气虚质（8 题）—— */
  { c: 'qixu', reverse: false, text: '您容易疲乏吗？' },
  { c: 'qixu', reverse: false, text: '您容易气短（呼吸短促，接不上气）吗？' },
  { c: 'qixu', reverse: false, text: '您容易心慌吗？' },
  { c: 'qixu', reverse: false, text: '您容易头晕或站起时眩晕吗？' },
  { c: 'qixu', reverse: false, text: '您比别人容易患感冒吗？' },
  { c: 'qixu', reverse: false, text: '您喜欢安静、懒得说话吗？' },
  { c: 'qixu', reverse: false, text: '您说话声音低弱无力吗？' },
  { c: 'qixu', reverse: false, text: '您活动量稍大就容易出虚汗吗？' },

  /* —— 阳虚质（7 题）—— */
  { c: 'yangxu', reverse: false, text: '您手脚发凉吗？' },
  { c: 'yangxu', reverse: false, text: '您胃脘部、背部或腰膝部怕冷吗？' },
  { c: 'yangxu', reverse: false, text: '您感到怕冷、衣服比别人穿得多吗？' },
  { c: 'yangxu', reverse: false, text: '您比一般人耐受不了寒冷（冬天的寒冷，夏天的冷空调、电扇等）吗？' },
  { c: 'yangxu', reverse: false, text: '您比别人容易患感冒吗？' },
  { c: 'yangxu', reverse: false, text: '您吃（喝）凉的东西会感到不舒服或者怕吃（喝）凉东西吗？' },
  { c: 'yangxu', reverse: false, text: '您受凉或吃（喝）凉的东西后，容易腹泻（拉肚子）吗？' },

  /* —— 阴虚质（8 题）—— */
  { c: 'yinxu', reverse: false, text: '您感到手脚心发热吗？' },
  { c: 'yinxu', reverse: false, text: '您感觉身体、脸上发热吗？' },
  { c: 'yinxu', reverse: false, text: '您皮肤或口唇干吗？' },
  { c: 'yinxu', reverse: false, text: '您口唇的颜色比一般人红吗？' },
  { c: 'yinxu', reverse: false, text: '您容易便秘或大便干燥吗？' },
  { c: 'yinxu', reverse: false, text: '您面部两颧潮红或偏红吗？' },
  { c: 'yinxu', reverse: false, text: '您感到眼睛干涩吗？' },
  { c: 'yinxu', reverse: false, text: '您感到口干咽燥、总想喝水吗？' },

  /* —— 痰湿质（8 题）—— */
  { c: 'tanshi', reverse: false, text: '您感到胸闷或腹部胀满吗？' },
  { c: 'tanshi', reverse: false, text: '您感到身体沉重不轻松或不爽快吗？' },
  { c: 'tanshi', reverse: false, text: '您腹部肥满松软吗？' },
  { c: 'tanshi', reverse: false, text: '您有额部油脂分泌多的现象吗？' },
  { c: 'tanshi', reverse: false, text: '您上眼睑比别人肿（上眼睑有轻微隆起的现象）吗？' },
  { c: 'tanshi', reverse: false, text: '您嘴里有黏黏的感觉吗？' },
  { c: 'tanshi', reverse: false, text: '您平时痰多，特别是咽喉部总感到有痰堵着吗？' },
  { c: 'tanshi', reverse: false, text: '您舌苔厚腻或有舌苔厚厚的感觉吗？' },

  /* —— 湿热质（6 题）—— */
  { c: 'shire', reverse: false, text: '您面部或鼻部有油腻感或者油亮发光吗？' },
  { c: 'shire', reverse: false, text: '您易生痤疮或疮疖吗？' },
  { c: 'shire', reverse: false, text: '您感到口苦或嘴里有异味吗？' },
  { c: 'shire', reverse: false, text: '您大便黏滞不爽、有解不尽的感觉吗？' },
  { c: 'shire', reverse: false, text: '您小便时尿道有发热感、尿色浓（深）吗？' },
  { c: 'shire', reverse: false, text: '您带下色黄（限女性）／阴囊部位潮湿（限男性）吗？' },

  /* —— 血瘀质（7 题）—— */
  { c: 'xueyu', reverse: false, text: '您的皮肤在不知不觉中会出现青紫瘀斑（皮下出血）吗？' },
  { c: 'xueyu', reverse: false, text: '您两颧部有细微红丝吗？' },
  { c: 'xueyu', reverse: false, text: '您身体上有哪里疼痛吗？' },
  { c: 'xueyu', reverse: false, text: '您面色晦暗或容易出现褐斑吗？' },
  { c: 'xueyu', reverse: false, text: '您容易有黑眼圈吗？' },
  { c: 'xueyu', reverse: false, text: '您容易忘事（健忘）吗？' },
  { c: 'xueyu', reverse: false, text: '您口唇颜色偏暗吗？' },

  /* —— 气郁质（7 题）—— */
  { c: 'qiyu', reverse: false, text: '您感到闷闷不乐、情绪低沉吗？' },
  { c: 'qiyu', reverse: false, text: '您容易精神紧张、焦虑不安吗？' },
  { c: 'qiyu', reverse: false, text: '您多愁善感、感情脆弱吗？' },
  { c: 'qiyu', reverse: false, text: '您容易感到害怕或受到惊吓吗？' },
  { c: 'qiyu', reverse: false, text: '您胁肋部或乳房胀痛吗？' },
  { c: 'qiyu', reverse: false, text: '您无缘无故叹气吗？' },
  { c: 'qiyu', reverse: false, text: '您咽喉部有异物感，且吐之不出、咽之不下吗？' },

  /* —— 特禀质（7 题）—— */
  { c: 'tebing', reverse: false, text: '您没有感冒时也会打喷嚏吗？' },
  { c: 'tebing', reverse: false, text: '您没有感冒时也会鼻塞、流鼻涕吗？' },
  { c: 'tebing', reverse: false, text: '您有因季节变化、温度变化或异味等原因而咳喘的现象吗？' },
  { c: 'tebing', reverse: false, text: '您容易过敏（对药物、食物、气味、花粉，或在季节交替、气候变化时）吗？' },
  { c: 'tebing', reverse: false, text: '您的皮肤容易起荨麻疹（风团、风疹块、风疙瘩）吗？' },
  { c: 'tebing', reverse: false, text: '您的皮肤因过敏出现过紫癜（紫红色瘀点、瘀斑）吗？' },
  { c: 'tebing', reverse: false, text: '您的皮肤一抓就红，并出现抓痕吗？' }
];
