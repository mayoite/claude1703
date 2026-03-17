# Document Source Gap

## Current State

- `missing_documents` remains a real audit requirement.
- The live product data does not currently provide product-level document links.
- `public/` currently contains no product document assets.
- `/downloads` remains a request-driven Resource Desk, not a direct-download system.

## Locked Meaning

- This is a real content gap, not an audit bug.
- Do not hide or downgrade `missing_documents`.
- Do not imply direct product downloads unless a real source is added.

## Reopen Only When

- a real document field exists in live data, or
- a related document table exists, or
- structured local content is added for product documents, or
- real downloadable assets are added and mapped explicitly

## Until Then

- keep the gap visible
- keep `/downloads` request-driven
- keep direct-download promises out of product UX
