export const runtime = "edge";

import { NextResponse } from "next/server";
import { getProducts, saveProducts, getBlogPosts, saveBlogPosts } from "@/lib/kv";

// Existing translation data extracted from JSON files
// This is used to populate KV with the initial translations
const PRODUCT_TRANSLATIONS: Record<string, Record<string, { title: string; desc: string }>> = {
  "premium-cotton-jersey-fabric": {
    zh: { title: "优质棉质平纹针织面料", desc: "我们的优质棉质平纹针织面料采用100%精梳棉制成，表面光滑，手感柔软。这种多功能面料透气性好，适合各种服装应用，是T恤、连衣裙和轻便上衣的理想选择。" },
    ja: { title: "プレミアムコットンジャージー生地", desc: "100%コーマ綿を使用した高級コットンジャージー生地で、なめらかな表面と柔らかな肌触りが特長です。" },
    ru: { title: "Премиальная хлопковая джерси", desc: "Наша премиальная хлопковая джерси изготовлена из 100% гребенного хлопка с гладкой поверхностью и мягкой текстурой." },
    es: { title: "Tejido de punto de algodón premium", desc: "Nuestro tejido de punto de algodón premium está elaborado con algodón peinado 100%." },
    fr: { title: "Tissu jersey coton premium", desc: "Notre tissu jersey coton premium est fabriqué à partir de coton peigné 100%." },
    de: { title: "Premium-Baumwoll-Jersey-Stoff", desc: "Unser Premium-Baumwoll-Jersey wird aus 100% gekämmter Baumwolle hergestellt." },
  },
  "rib-knit-fabric": {
    zh: { title: "罗纹针织面料", desc: "高品质1x1罗纹针织面料，具有出色的弹性和回复力。棉涤混纺结构确保耐用性和形状保持性，非常适合袖口、领口和修身服装。" },
    ja: { title: "リブニット生地", desc: "優れた伸縮性と回復力を備えた高品質1x1リブニット生地。綿ポリエステル混紡が耐久性と形状保持を保証します。" },
    ru: { title: "Рибан (ластик)", desc: "Высококачественный трикотаж рибана 1x1 с отличной растяжимостью и восстановлением. Смесовая ткань обеспечивает долговечность." },
    es: { title: "Tejido de punto acanalado", desc: "Tejido de punto acanalado 1x1 de alta calidad con excelente elasticidad y recuperación." },
    fr: { title: "Tissu côtelé", desc: "Tissu côtelé 1x1 de haute qualité avec une excellente élasticité et récupération." },
    de: { title: "Rippstrickstoff", desc: "Hochwertiger 1x1 Rippstrickstoff mit ausgezeichneter Dehnbarkeit und Formrückstellung." },
  },
  "french-terry-fabric": {
    zh: { title: "法式毛圈面料", desc: "我们的有机法式毛圈面料将可持续性与舒适性相结合。毛圈背面提供吸湿排汗性能，同时保持柔软触感，是卫衣和休闲装的完美选择。" },
    ja: { title: "フレンチテリー生地", desc: "サステナビリティと快適さを両立したオーガニックフレンチテリー生地。ループバックが吸湿発散性を提供します。" },
    ru: { title: "Французский футер", desc: "Наш органический французский футер сочетает экологичность с комфортом. Петли с изнанки обеспечивают впитывание влаги." },
    es: { title: "Tejido French Terry", desc: "Nuestro tejido French Terry orgánico combina sostenibilidad con comodidad." },
    fr: { title: "Tissu French Terry", desc: "Notre tissu French Terry biologique allie durabilité et confort." },
    de: { title: "French Terry Stoff", desc: "Unser Bio-French Terry vereint Nachhaltigkeit mit Komfort." },
  },
  "fleece-fabric": {
    zh: { title: "拉绒抓绒面料", desc: "温暖舒适的拉绒抓绒面料，采用棉涤混纺制成。拉绒表面提供卓越的隔热性能，同时保持透气性，非常适合卫衣、运动衫和寒冷天气服装。" },
    ja: { title: "ブラシフリース生地", desc: "綿ポリエステル混紡で作られた暖かく心地よいブラシフリース生地。ブラシ加工された表面が優れた断熱性を提供します。" },
    ru: { title: "Начесанный флис", desc: "Теплая и уютная ткань из смеси хлопка и полиэстера. Начесанная поверхность обеспечивает превосходную теплоизоляцию." },
    es: { title: "Tejido de forro polar cepillado", desc: "Tejido de forro polar cálido y acogedor hecho de mezcla de algodón y poliéster." },
    fr: { title: "Tissu molleton brossé", desc: "Tissu molleton chaud et douillet en mélange coton-polyester." },
    de: { title: "Gebürsteter Fleecestoff", desc: "Warmer und kuscheliger gebürsteter Fleecestoff aus Baumwoll-Polyester-Mischung." },
  },
  "classic-cotton-t-shirt": {
    zh: { title: "经典棉质T恤", desc: "采用180gsm 100%精梳棉平纹针织面料制成的永恒经典。这款经典T恤具有日常穿着的舒适性和耐用性，是衣橱必备单品。" },
    ja: { title: "クラシックコットンTシャツ", desc: "180gsmの100%コーマ綿ジャージーで作られたタイムレスな定番アイテム。毎日の着用に最適な快適さと耐久性を備えています。" },
    ru: { title: "Классическая хлопковая футболка", desc: "Вечная классика из 100% гребенного хлопкового джерси плотностью 180 г/м². Комфорт и долговечность для повседневной носки." },
    es: { title: "Camiseta clásica de algodón", desc: "Un clásico atemporal elaborado con jersey de algodón peinado 100% de 180 g/m²." },
    fr: { title: "T-shirt coton classique", desc: "Un classique intemporel en jersey de coton peigné 100% de 180 g/m²." },
    de: { title: "Klassisches Baumwoll-T-Shirt", desc: "Ein zeitloser Klassiker aus 100% gekämmter Baumwoll-Jersey mit 180 g/m²." },
  },
  "premium-heavyweight-t-shirt": {
    zh: { title: "高级重磅T恤", desc: "采用240gsm重磅T恤，由100%环锭纺棉制成。这款高级T恤具有卓越的耐用性和结构感，同时保持柔软舒适。" },
    ja: { title: "プレミアムヘビーウェイトTシャツ", desc: "240gsmのヘビーウェイトTシャツで、100%リング紡績綿を使用。優れた耐久性と構造感を備えています。" },
    ru: { title: "Премиальная тяжелая футболка", desc: "Тяжелая футболка плотностью 240 г/м² из 100% кольцевой пряжи. Превосходная долговечность и структурность." },
    es: { title: "Camiseta premium de peso pesado", desc: "Camiseta de peso pesado de 240 g/m² hecha de algodón de fibra anillada 100%." },
    fr: { title: "T-shirt premium poids lourd", desc: "T-shirt poids lourd de 240 g/m² en coton à fibres longues 100%." },
    de: { title: "Premium Heavyweight T-Shirt", desc: "Ein schweres T-Shirt mit 240 g/m² aus 100% ringgesponnener Baumwolle." },
  },
  "classic-pullover-hoodie": {
    zh: { title: "经典套头卫衣", desc: "采用300gsm棉涤抓绒制成的舒适套头卫衣。配有可调节拉绳兜帽、袋鼠口袋和罗纹袖口下摆，兼具风格与功能性。" },
    ja: { title: "クラシックプルオーバーパーカー", desc: "300gsmの綿ポリエステルフリースで作られた快適なプルオーバーパーカー。調節可能なドローコードフードとカンガルーポケット付き。" },
    ru: { title: "Классическая худи", desc: "Удобная худи из флиса 300 г/м². Регулируемый капюшон, кенгуру-карман и ребристые манжеты." },
    es: { title: "Sudadera con capucha clásica", desc: "Cómoda sudadera con capucha de forro polar de algodón y poliéster de 300 g/m²." },
    fr: { title: "Sweat à capuche classique", desc: "Sweat à capuche confortable en molleton coton-polyester de 300 g/m²." },
    de: { title: "Klassischer Pullover-Hoodie", desc: "Bequemer Pullover-Hoodie aus 300 g/m² Baumwoll-Polyester-Fleece." },
  },
  "zip-up-hoodie": {
    zh: { title: "拉链卫衣", desc: "采用320gsm 100%棉质法式毛圈面料制成的多功能拉链卫衣。配有前拉链、侧口袋和罗纹袖口下摆。" },
    ja: { title: "ジップアップパーカー", desc: "320gsmの100%コットンフレンチテリーで作られた多用途ジップアップパーカー。フロントジッパーとサイドポケット付き。" },
    ru: { title: "Худи на молнии", desc: "Универсальная худи на молнии из 100% хлопкового французского футера 320 г/м². Передняя молния и боковые карманы." },
    es: { title: "Sudadera con cremallera", desc: "Sudadera versátil con cremallera de French Terry 100% algodón de 320 g/m²." },
    fr: { title: "Sweat à fermeture éclair", desc: "Sweat polyvalent à fermeture éclair en French Terry 100% coton de 320 g/m²." },
    de: { title: "Zip-Up Hoodie", desc: "Vielseitiger Zip-Up Hoodie aus 100% Baumwoll-French-Terry mit 320 g/m²." },
  },
  "knit-leg-warmers": {
    zh: { title: "针织腿套", desc: "舒适时尚的针织腿套，采用100%腈纶针织制成。弹力贴合设计，提供温暖和支撑，适合舞蹈、运动或日常穿着。" },
    ja: { title: "ニットレッグウォーマー", desc: "100%アクリルニットで作られた暖かくスタイリッシュなレッグウォーマー。伸縮性のあるフィット感で暖かさとサポートを提供。" },
    ru: { title: "Вязаные гетры", desc: "Уютные и стильные вязаные гетры из 100% акрила. Эластичная посадка обеспечивает тепло и поддержку." },
    es: { title: "Calentadores de piernas de punto", desc: "Calentadores de piernas de punto cómodos y elegantes hechos de acrílico 100%." },
    fr: { title: "Jambières en tricot", desc: "Jambières en tricot confortables et élégantes en acrylique 100%." },
    de: { title: "Gestrickte Beinwärmer", desc: "Kuschelige und stilvolle gestrickte Beinwärmer aus 100% Acryl." },
  },
  "cable-knit-leg-warmers": {
    zh: { title: "麻花针织腿套", desc: "优质麻花针织腿套，采用温暖的羊毛混纺制成。经典麻花图案增添优雅气息，加长设计提供额外覆盖。" },
    ja: { title: "ケーブルニットレッグウォーマー", desc: "暖かいウール混紡で作られたプレミアムケーブルニットレッグウォーマー。クラシックなケーブル模様がエレガントな雰囲気を添えます。" },
    ru: { title: "Гетры с косами", desc: "Премиальные вязаные гетры из теплой шерстяной смеси. Классический узор «коса» придает элегантность." },
    es: { title: "Calentadores de punto de cable", desc: "Calentadores de punto de cable premium elaborados con una mezcla cálida de lana." },
    fr: { title: "Jambières torsadées", desc: "Jambières torsadées premium en mélange de laine chaude." },
    de: { title: "Zopfmuster-Beinwärmer", desc: "Premium-Zopfmuster-Beinwärmer aus warmer Wollmischung." },
  },
  "classic-beanie-hat": {
    zh: { title: "经典无檐便帽", desc: "采用200gsm 100%腈纶针织制成的经典针织无檐便帽。舒适的罗纹结构确保紧密贴合，是日常佩戴的理想选择。" },
    ja: { title: "クラシックビーニー帽", desc: "200gsmの100%アクリルニットで作られたクラシックなニットビーニー帽。快適なリブ構造でぴったりフィット。" },
    ru: { title: "Классическая шапка-бини", desc: "Классическая вязаная шапка-бини из 100% акрила плотностью 200 г/м². Ребристая структура обеспечивает плотную посадку." },
    es: { title: "Gorro clásico de punto", desc: "Gorro clásico de punto hecho de acrílico 100% de 200 g/m²." },
    fr: { title: "Bonnet classique", desc: "Bonnet classique en tricot acrylique 100% de 200 g/m²." },
    de: { title: "Klassische Beanie-Mütze", desc: "Klassische Strick-Beanie-Mütze aus 100% Acryl mit 200 g/m²." },
  },
  "wool-blend-beanie": {
    zh: { title: "羊毛混纺便帽", desc: "优质羊毛混纺便帽，兼具天然保暖性和耐用性。50%羊毛50%腈纶混纺提供卓越的隔热性能，同时保持柔软不刺痒。" },
    ja: { title: "ウールブレンドビーニー", desc: "天然の暖かさと耐久性を兼ね備えたプレミアムウールブレンドビーニー。50%ウール50%アクリル混紡。" },
    ru: { title: "Шапка из шерстяной смеси", desc: "Премиальная шапка из смеси шерсти, сочетающая естественное тепло и долговечность. Состав: 50% шерсть, 50% акрил." },
    es: { title: "Gorro de mezcla de lana", desc: "Gorro premium de mezcla de lana que combina calidez natural con durabilidad." },
    fr: { title: "Bonnet en mélange de laine", desc: "Bonnet premium en mélange de laine alliant chaleur naturelle et durabilité." },
    de: { title: "Wollmischungs-Beanie", desc: "Premium-Wollmischungs-Beanie mit natürlicher Wärme und Strapazierfähigkeit." },
  },
  "knit-gloves": {
    zh: { title: "针织手套", desc: "温暖舒适的针织手套，采用180gsm 100%腈纶针织制成。弹力贴合设计确保紧密贴合，罗纹袖口提供额外保暖。" },
    ja: { title: "ニット手袋", desc: "180gsmの100%アクリルニットで作られた暖かく快適なニット手袋。伸縮性のあるフィット感でしっかりとフィット。" },
    ru: { title: "Вязаные перчатки", desc: "Теплые и удобные вязаные перчатки из 100% акрила плотностью 180 г/м². Эластичная посадка и ребристые манжеты." },
    es: { title: "Guantes de punto", desc: "Guantes de punto cálidos y cómodos hechos de acrílico 100% de 180 g/m²." },
    fr: { title: "Gants en tricot", desc: "Gants en tricot chauds et confortables en acrylique 100% de 180 g/m²." },
    de: { title: "Strickhandschuhe", desc: "Warme und bequeme Strickhandschuhe aus 100% Acryl mit 180 g/m²." },
  },
  "touchscreen-knit-gloves": {
    zh: { title: "触屏针织手套", desc: "智能针织手套，采用导电纱线技术，支持触屏操作。指尖区域的导电纱线让您无需脱下手套即可使用智能手机。" },
    ja: { title: "タッチスクリーンニット手袋", desc: "導電性ヤーン技術を採用したスマートニット手袋。指先の導電性糸で手袋を外さずにスマートフォン操作が可能。" },
    ru: { title: "Сенсорные перчатки", desc: "Умные вязаные перчатки с токопроводящей пряжей для сенсорных экранов. Позволяют пользоваться смартфоном не снимая перчаток." },
    es: { title: "Guantes táctiles de punto", desc: "Guantes inteligentes con hilo conductor para compatibilidad con pantallas táctiles." },
    fr: { title: "Gants tactiles en tricot", desc: "Gants intelligents avec fil conducteur pour écrans tactiles." },
    de: { title: "Touchscreen-Strickhandschuhe", desc: "Intelligente Strickhandschuhe mit leitfähigem Garn für Touchscreen-Kompatibilität." },
  },
  "crew-knit-socks": {
    zh: { title: "中筒针织袜", desc: "舒适的中筒针织袜，采用柔软的棉涤氨纶混纺制成。罗纹袜口确保不滑落，加厚袜底提供额外缓冲和耐用性。" },
    ja: { title: "クルーニットソックス", desc: "柔らかな綿ポリエステルスパンデックス混紡で作られた快適なクルー丈ニットソックス。リブ編みの履き口でずり落ち防止。" },
    ru: { title: "Хлопковые носки", desc: "Удобные носки средней длины из мягкой смеси хлопка, полиэстера и спандекса. Ребристый верх предотвращает сползание." },
    es: { title: "Calcetines de punto de tripulación", desc: "Cómodos calcetines de punto de longitud media hechos de suave mezcla de algodón." },
    fr: { title: "Chaussettes en tricot", desc: "Chaussettes confortables en mélange coton-polyester-spandex." },
    de: { title: "Crew-Stricksocken", desc: "Bequeme Knöchel-Stricksocken aus weicher Baumwoll-Polyester-Spandex-Mischung." },
  },
  "wool-knit-socks": {
    zh: { title: "羊毛针织袜", desc: "优质过膝羊毛针织袜，提供天然保暖和湿气管理功能。美利奴羊毛混纺确保柔软舒适，适合寒冷天气穿着。" },
    ja: { title: "ウールニットソックス", desc: "天然の保温性と湿気管理機能を提供するプレミアムニーハイウールニットソックス。メリノウール混紡で柔らかな履き心地。" },
    ru: { title: "Шерстяные носки", desc: "Премиальные высокие шерстяные носки с естественным теплом и влагоотведением. Мериносовая смесь для мягкости." },
    es: { title: "Calcetines de lana de punto", desc: "Calcetines premium de lana de punto hasta la rodilla que ofrecen calidez natural." },
    fr: { title: "Chaussettes en laine tricotée", desc: "Chaussettes montantes en laine tricotée offrant chaleur naturelle." },
    de: { title: "Woll-Stricksocken", desc: "Premium-Kniehohe-Woll-Stricksocken mit natürlicher Wärme." },
  },
};

const BLOG_TRANSLATIONS: Record<string, Record<string, { title: string; excerpt: string }>> = {
  "knitwear-trends-2026": {
    zh: { title: "2026年针织品趋势：塑造针织纺织品未来的因素", excerpt: "探索塑造2026年的关键针织品趋势，从可持续材料和智能制造技术到新兴的针织应用领域。" },
    ja: { title: "2026年のニットウェアトレンド：ニットテキスタイルの未来を形作るもの", excerpt: "持続可能な素材やスマート製造技術から新興のニット用途まで、2026年を形作る主要なニットウェアトレンドをご紹介します。" },
    ru: { title: "Тренды трикотажа 2026: что формирует будущее вязаного текстиля", excerpt: "Откройте для себя ключевые тренды трикотажа 2026 года — от экологичных материалов и умного производства до новых сфер применения." },
    es: { title: "Tendencias de punto 2026: dando forma al futuro de los textiles", excerpt: "Descubra las tendencias clave de punto que darán forma a 2026." },
    fr: { title: "Tendances maille 2026 : l'avenir des textiles tricotés", excerpt: "Découvrez les tendances clés de la maille qui façonneront 2026." },
    de: { title: "Strickmodetrends 2026: Die Zukunft der Stricktextilien", excerpt: "Entdecken Sie die wichtigsten Strickmodetrends, die 2026 prägen werden." },
  },
  "choosing-knit-fabric-for-garments": {
    zh: { title: "为您的服装选择合适的针织面料：完整指南", excerpt: "关于为您的服装生产选择完美针织面料的综合指南，涵盖面料重量、成分和最终用途考量。" },
    ja: { title: "衣料品に最適なニット生地の選び方：完全ガイド", excerpt: "生地の重さ、組成、最終用途の考慮事項を網羅した、アパレル生産に最適なニット生地を選ぶための包括的ガイド。" },
    ru: { title: "Выбор правильного трикотажа для одежды: полное руководство", excerpt: "Исчерпывающее руководство по выбору идеального трикотажного полотна для производства одежды." },
    es: { title: "Cómo elegir la tela de punto adecuada: guía completa", excerpt: "Guía completa para seleccionar la tela de punto perfecta para su producción de prendas." },
    fr: { title: "Choisir le bon tissu maille : guide complet", excerpt: "Guide complet pour sélectionner le tissu maille parfait pour votre production." },
    de: { title: "Den richtigen Strickstoff wählen: Ein vollständiger Leitfaden", excerpt: "Umfassender Leitfaden zur Auswahl des perfekten Strickstoffs für Ihre Bekleidungsproduktion." },
  },
  "sustainable-knitwear-manufacturing": {
    zh: { title: "可持续针织品制造：实践与创新", excerpt: "探索正在改变针织品行业的可持续制造实践，从环保材料到节水染色工艺和循环生产模式。" },
    ja: { title: "持続可能なニットウェア製造：実践と革新", excerpt: "環境に優しい素材から節水染色プロセス、循環型生産モデルまで、ニットウェア業界を変革する持続可能な製造実践をご紹介します。" },
    ru: { title: "Устойчивое производство трикотажа: практики и инновации", excerpt: "Изучите экологичные производственные практики, трансформирующие трикотажную промышленность." },
    es: { title: "Fabricación sostenible de punto: prácticas e innovaciones", excerpt: "Explore las prácticas de fabricación sostenible que transforman la industria del punto." },
    fr: { title: "Fabrication durable de maille : pratiques et innovations", excerpt: "Explorez les pratiques de fabrication durable qui transforment l'industrie." },
    de: { title: "Nachhaltige Strickwarenherstellung: Praktiken und Innovationen", excerpt: "Entdecken Sie die nachhaltigen Herstellungspraktiken, die die Strickwarenindustrie verändern." },
  },
  "custom-knitwear-production-guide": {
    zh: { title: "定制针织品生产：品牌分步指南", excerpt: "关于定制针织品生产所需了解的一切，从最初设计概念到最终质量检验和包装。" },
    ja: { title: "カスタムニットウェア生産：ブランド向けステップバイステップガイド", excerpt: "最初のデザインコンセプトから最終的な品質検査と包装まで、カスタムニットウェア生産について知っておくべきすべて。" },
    ru: { title: "Производство трикотажа на заказ: пошаговое руководство для брендов", excerpt: "Все, что нужно знать о производстве трикотажа на заказ — от дизайн-концепции до контроля качества." },
    es: { title: "Producción de punto personalizada: guía para marcas", excerpt: "Todo lo que necesita saber sobre la producción de punto personalizada." },
    fr: { title: "Production de maille personnalisée : guide pour les marques", excerpt: "Tout ce que vous devez savoir sur la production de maille personnalisée." },
    de: { title: "Maßgeschneiderte Strickwarenproduktion: Leitfaden für Marken", excerpt: "Alles, was Sie über die maßgeschneiderte Strickwarenproduktion wissen müssen." },
  },
  "quality-control-knit-products": {
    zh: { title: "针织产品质量控制：标准与流程", excerpt: "了解确保Hongtexus针织产品符合最高国际标准的严格质量控制流程。" },
    ja: { title: "ニット製品の品質管理：基準とプロセス", excerpt: "Hongtexusのニット製品が最高の国際基準を満たすことを保証する厳格な品質管理プロセスについて学びます。" },
    ru: { title: "Контроль качества в производстве трикотажа: стандарты и процессы", excerpt: "Узнайте о строгих процессах контроля качества, гарантирующих соответствие высочайшим международным стандартам." },
    es: { title: "Control de calidad en productos de punto: estándares y procesos", excerpt: "Conozca los rigurosos procesos de control de calidad de Hongtexus." },
    fr: { title: "Contrôle qualité des produits maille : normes et processus", excerpt: "Découvrez les processus rigoureux de contrôle qualité de Hongtexus." },
    de: { title: "Qualitätskontrolle bei Strickprodukten: Standards und Prozesse", excerpt: "Erfahren Sie mehr über die strengen Qualitätskontrollprozesse von Hongtexus." },
  },
};

export async function POST() {
  try {
    // Migrate products
    const products = await getProducts();
    let productCount = 0;
    const migratedProducts = products.map((p: any) => {
      if (!p.translations && PRODUCT_TRANSLATIONS[p.slug]) {
        productCount++;
        return { ...p, translations: PRODUCT_TRANSLATIONS[p.slug] };
      }
      return p;
    });
    await saveProducts(migratedProducts);

    // Migrate blog posts
    const posts = await getBlogPosts();
    let blogCount = 0;
    const migratedPosts = posts.map((p: any) => {
      if (!p.translations && BLOG_TRANSLATIONS[p.slug]) {
        blogCount++;
        return { ...p, translations: BLOG_TRANSLATIONS[p.slug] };
      }
      return p;
    });
    await saveBlogPosts(migratedPosts);

    return NextResponse.json({
      success: true,
      message: `Migration complete. Updated ${productCount} products and ${blogCount} blog posts.`,
      productCount,
      blogCount,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}

export async function GET() {
  const products = await getProducts();
  const posts = await getBlogPosts();

  const productsWithTranslations = products.filter((p: any) => p.translations).length;
  const postsWithTranslations = posts.filter((p: any) => p.translations).length;

  return NextResponse.json({
    totalProducts: products.length,
    productsWithTranslations,
    totalPosts: posts.length,
    postsWithTranslations,
    needsMigration: productsWithTranslations < products.length || postsWithTranslations < posts.length,
  });
}
