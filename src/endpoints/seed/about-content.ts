import { ABOUT_SEO } from '@/constants/seo'
import { LEGAL } from '@/content/legal'
import { heading, paragraph, richTextRoot, text } from './lexical-helpers'

export type AboutTopic = {
  description: string
  title: string
}

export const aboutTopicsHeading = '希望陪你一起了解的事'

export const aboutTopicsIntro =
  '這個網站，希望成為一座連結醫學與日常生活的橋梁。在這裡，您可以：'

export const aboutTopicsClosing =
  '希望每一篇文章，都能讓您對自己的身體多一分理解；也希望當您需要時，這裡能成為一個值得信賴的知識夥伴。'

export const ABOUT_TOPICS: AboutTopic[] = [
  {
    title: '了解你的胰臟',
    description:
      '認識胰臟的功能，以及它如何影響消化、血糖代謝與整體健康，建立正確的胰臟健康觀念。',
  },
  {
    title: '認識胰臟疾病',
    description:
      '從胰臟發炎、胰臟囊腫（胰臟水泡）、脂肪胰、各類胰臟腫瘤到胰臟癌等，了解疾病的成因、症狀、診斷與治療方向。',
  },
  {
    title: '看懂健檢與檢查',
    description:
      '抽血數值代表什麼？哪些影像檢查適合自己？什麼情況需要進一步追蹤？希望讓複雜的醫療資訊變得容易理解。',
  },
  {
    title: '了解胰臟癌篩檢',
    description:
      '哪些人屬於高風險族群？什麼時候開始篩檢？需要做哪些檢查？如何選擇適合自己的追蹤方式？陪您一步步了解胰臟癌早期發現的重要性。',
  },
  {
    title: '掌握最新醫學進展',
    description:
      '分享國內外重要研究成果、最新治療與醫療新知，協助讀者理解醫學發展，也了解這些進展對健康可能帶來的意義。',
  },
  {
    title: '學習生活中的胰臟照護',
    description:
      '從飲食、體重控制、糖尿病、運動到日常保健，提供有醫學根據且容易實踐的健康建議，陪伴大家把胰臟照護落實於每一天。',
  },
]

export const aboutMainRichTextBeforeTopics = richTextRoot(
  heading('h2', '為什麼是胰臟？'),
  paragraph(
    text(
      '近三十年來，我每天面對的，不只是胰臟疾病，更是一個又一個來不及被發現的遺憾。',
    ),
  ),
  paragraph(
    text(
      '許多病人第一次出現明顯症狀時，往往已錯過最佳治療時機。我始終相信，許多疾病的結局，如果能早一點發現，就有機會被改變。',
    ),
  ),
  paragraph(
    text(
      '也正因如此，我選擇長期投入胰臟醫學，從臨床照護到研究，不斷尋找早期發現的線索；也希望將診間累積的經驗與最新的醫學知識，化為一般人都能理解的內容。',
    ),
  ),
  paragraph(
    text(
      '我相信，真正守護健康的，不只是治療疾病，更是在疾病發生之前，讓每一個人有機會認識胰臟、理解風險，並做出更好的健康選擇。這也是我希望將診間最重要的知識帶出診間、分享給更多人的原因。',
    ),
  ),
  heading('h2', '認識章醫師'),
  paragraph(
    text(
      '我是章明珠醫師，現任台大醫學院內科臨床副教授、台大醫院內科部主治醫師，近三十年來始終專注於胰臟疾病的臨床照護、研究與教學。',
    ),
  ),
  paragraph(
    text(
      '多年來，我持續投入胰臟癌早期診斷、高風險族群追蹤、慢性胰臟炎、胰臟囊腫等相關疾病研究。我與先生張毓廷醫師共同建立台灣最大的胰臟疾病生物資料庫，積極參與國內外研究合作，多次於國際學術會議分享台灣在慢性胰臟炎病因探討、胰臟癌篩檢及早期診斷等研究成果。',
    ),
  ),
  paragraph(
    text(
      '我始終相信，醫學的價值，不只在於治療疾病，更在於透過知識的傳遞，幫助更多人在疾病發生之前，就有機會改變未來。',
    ),
  ),
  heading('h2', '為什麼成立這個部落格？'),
  paragraph(text('診間只有短短幾分鐘，但許多問題，其實值得更完整的說明。')),
  paragraph(
    text(
      '因此，我創立了「胰探究竟－章醫師的胰臟日常」，希望把門診裡最常被問到的問題，透過圖文、故事與最新醫學研究，用淺顯易懂的方式分享給大家，陪伴更多人一起認識胰臟、守護健康。',
    ),
  ),
)

export const aboutMainRichTextAfterTopics = richTextRoot(
  heading('h2', '專業經歷'),
  paragraph(text('• 台大醫學院臨床醫學研究所博士班畢業')),
  paragraph(text('• 台大醫學院內科臨床副教授')),
  paragraph(text('• 台大醫院內科部主治醫師')),
  paragraph(text('• 長年投入胰臟疾病臨床照護、研究與教學')),
  paragraph(text('• 迄今發表六十餘篇國際學術論文，其中四十八篇聚焦於胰臟疾病')),
  paragraph(text('• 與張毓廷醫師共同建立台灣最大的胰臟疾病生物資料庫')),
  paragraph(
    text('• 積極參與國內外研究合作，多次於國際學術會議發表胰臟疾病研究成果'),
  ),
  paragraph(
    text('• 研究領域涵蓋慢性胰臟炎病因、胰臟癌高風險族群追蹤、早期篩檢及精準醫療。'),
  ),
  heading('h2', '章醫師的心願'),
  paragraph(
    text(
      '我希望有一天，當大家談起胰臟，想到的不再只是恐懼，而是知道如何認識它、照顧它，並把握更早發現、更早預防的機會。',
    ),
  ),
  paragraph(
    text(
      '如果這個網站的一篇文章，能讓一個人少一分擔心、多一分理解；能讓一個家庭因此改變疾病的結局，那麼，這一路的努力，便有了最好的意義。',
    ),
  ),
  paragraph(text('這，就是我一直努力的方向。')),
)

export const aboutDisclaimerRichText = richTextRoot(
  heading('h2', '醫療資訊聲明'),
  paragraph(text(LEGAL.medicalDisclaimer)),
)

export const aboutHeroRichText = richTextRoot(
  heading('h1', '關於章醫師'),
  paragraph(
    text('台灣胰臟癌篩檢權威，以近 30 年臨床經驗把複雜的胰臟知識說清楚。'),
  ),
)

export const aboutMeta = {
  title: ABOUT_SEO.title,
  description: ABOUT_SEO.description,
} as const
