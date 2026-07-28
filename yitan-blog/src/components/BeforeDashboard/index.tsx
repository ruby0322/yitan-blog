import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.css'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>歡迎使用胰探究竟後台</h4>
      </Banner>
      建議操作順序：
      <ul className={`${baseClass}__instructions`}>
        <li>
          首次使用可點選 <SeedButton />
          {' 建立示範首頁、關於頁與文章，再 '}
          <a href="/" target="_blank">
            前往網站
          </a>
          {' 查看效果。'}
        </li>
        <li>日常發文請到「文章」建立內容，儲存草稿後再發布。</li>
        <li>首頁與關於頁可在「頁面」中編輯。</li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
