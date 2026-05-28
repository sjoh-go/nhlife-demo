#!/bin/bash
# 로컬에서 데모 페이지를 http://localhost:8000 으로 띄우는 스크립트
# (file:// 프로토콜에서는 PDF.js worker가 보안 정책으로 안 됨)

cd "$(dirname "$0")"

if command -v python3 &> /dev/null; then
  echo "▶ http://localhost:8000/nh-life-review-demo.html 에서 데모를 여세요"
  python3 -m http.server 8000
elif command -v python &> /dev/null; then
  echo "▶ http://localhost:8000/nh-life-review-demo.html 에서 데모를 여세요"
  python -m SimpleHTTPServer 8000
elif command -v npx &> /dev/null; then
  echo "▶ http://localhost:8000/nh-life-review-demo.html 에서 데모를 여세요"
  npx http-server -p 8000
else
  echo "Python 또는 Node.js가 필요합니다. 또는 Netlify Drop에 ZIP을 올려주세요."
  exit 1
fi
