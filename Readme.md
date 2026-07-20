# 🏭 FacFlow

> 생산 계획부터 생산 실적, 설비, 불량 관리까지 통합 관리할 수 있는 웹 기반 MES(Manufacturing Execution System)

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel)
![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?logo=amazonaws&logoColor=white)

---

## 📌 프로젝트 소개

FacFlow는 제조업의 생산 과정을 관리하는 웹 기반 MES 시스템입니다.

생산 계획을 기반으로 생산을 시작하고 종료할 수 있으며, 설비별 생산 가능 품목과 생산 능력을 고려한 설비 추천 기능을 제공합니다.

또한 생산 실적과 불량 데이터를 관리하고, 대시보드를 통해 생산 현황을 한눈에 확인할 수 있도록 구현했습니다.

**단순 CRUD 구현을 넘어 생산 계획 → 생산 → 불량으로 이어지는 실제 MES 업무 흐름을 반영하는 것을 목표로 개발했습니다.**

---

## ✨ 주요 기능

- 📊 **생산 현황 대시보드** - 생산량, 불량률, 설비 가동 현황 등 핵심 지표를 한눈에 확인
- 📅 **생산 계획 관리** - 생산 계획 생성, 조회 및 상태 변경을 통해 생산 일정을 관리
- 🤖 **설비 추천** - 생산 가능한 설비와 시간당 생산량을 기반으로 최적의 설비와 예상 완료 시간을 제공
- 🏭 **생산 실적 관리** - 생산 시작·종료와 함께 양품 및 불량 수량을 기록하여 생산 이력을 관리
- ⚙️ **설비 관리** - 설비 상태와 생산 가능 품목을 관리하여 생산 가능 여부를 확인
- ❌ **불량 관리** - 불량 이력과 유형을 관리하여 품질 데이터를 추적
- 📈 **생산 데이터 시각화** - 대시보드에서 생산 현황을 차트와 통계로 제공

---

## 🛠 기술 스택

| 분야 | 기술 |
|------|------|
| **Language** | JavaScript |
| **Frontend** | React, React Router, Axios, Bootstrap |
| **Backend** | Node.js, Express |
| **Database** | MySQL |
| **Deployment** | Vercel, AWS EC2, PM2 |
| **Version Control** | Git, GitHub |

---

## 📊 ERD

> ERD 이미지 삽입 예정

---

## 📷 화면

### 📈 Dashboard

> 화면 예제 삽입 예정

---

### 📅 생산 계획

> 화면 예제 삽입 예정

---

### 🏭 생산 관리

> 화면 예제 삽입 예정

---

### ⚙️ 설비 관리

> 화면 예제 삽입 예정

---

### ❌ 불량 관리

> 화면 예제 삽입 예정

---

## 💡 기술적 구현

### 🤖 설비 추천 로직

생산 가능한 설비를 조회한 후 설비 상태(IDLE)와 시간당 생산량(hourlyCapacity)을 종합적으로 고려하여 최적의 설비를 추천하도록 구현했습니다.

추천 결과에는 설비 정보뿐 아니라 예상 생산 완료 시간을 함께 제공하여 작업 계획 수립에 활용할 수 있도록 했습니다.

---

### 📊 SQL 기반 데이터 집계

JOIN과 집계 함수를 활용하여 생산량, 불량률, 설비 가동 현황 등 Dashboard에 필요한 데이터를 효율적으로 조회하도록 구현했습니다.

---

### 🗄️ 관계형 데이터 모델링

생산 계획(ProductPlan), 생산 실적(Production), 설비(Equipment), 불량(Defect)을 분리하고 외래 키를 활용하여 데이터의 일관성을 유지했습니다.

또한 설비와 제품은 EquipmentProduct 매핑 테이블로 관리하여 하나의 설비가 여러 제품을 생산할 수 있는 구조를 설계했습니다.

---

## 📡 API

| Method | URL | Description |
|--------|-----|-------------|
| GET | /dashboard | Dashboard 조회 |
| GET | /plan | 생산 계획 조회 |
| POST | /plan | 생산 계획 등록 |
| POST | /plan/:id/start | 생산 시작 |
| POST | /production/:id/end | 생산 종료 |
| GET | /equipment | 설비 조회 |

---

## 📂 프로젝트 구조

<details>
<summary>📂 프로젝트 구조 보기</summary>

```text
facflow
파일 구조 업데이트 예정
```

</details>

---

## 🚀 빠른 시작

### 📋 사전 요구사항

- Node.js 18 이상
- MySQL

### 📦 설치 방법

#### 1. 저장소 클론

```bash
git clone https://github.com/your-github-id/facflow.git
cd facflow
```

#### 2. 의존성 설치

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### 3. 환경 변수 설정

`backend/.env.example` 및 `frontend/.env.example` 파일을 참고하여 `.env` 파일을 생성한 후 자신의 환경에 맞게 값을 설정합니다.

#### 4. 데이터베이스 설정

```sql
CREATE DATABASE facflow;
```

이후 `database/schema.sql`과 `database/dummy-data.sql`을 실행하여 테이블과 더미 데이터를 생성합니다.

#### 5. 개발 서버 실행

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd frontend
npm run dev
```

#### 6. 실행

```
http://localhost:3000
```

---

## 📌 향후 개선 사항

- 사용자 인증 및 권한 관리
- 생산 스케줄링 알고리즘 고도화
- 실시간 생산 모니터링
- 설비 유지보수 이력 관리
- 생산 이력 검색 및 필터링 기능 강화

---

## 👨‍💻 개발자

| 이름 | 담당 |
|------|------|
| 안다정 | Frontend · Backend · Database 설계 및 구현 |