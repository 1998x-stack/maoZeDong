# Source record 模板

```yaml
source_id: src-unique
title: ""
creator: ""
material_type: primary_contemporaneous # primary_retrospective | secondary_scholarship | editorial | legacy_commentary
repository: ""
edition: ""
url: ""
locator: ""                 # 页码/段落/文件号；无则注明无法定位
event_time: null
published_at: null
available_at: null          # 确认何时可被当事人获知
accessed_at: null
rights_checked: false
reuse_status: link_only     # link_only | permission_confirmed
limitations: ""
verified_by: []
```

## 注意
`source_id` 用于跨文章/人物/事件引用；不得依赖 URL 猜测事件发生日期。`available_at` 与 `published_at` 不同，不能互相替代。版本不明时填 `unknown`，不要填“原版”。
