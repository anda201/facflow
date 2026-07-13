import { useState, useEffect } from "react";
import { getDashboard } from "../api";
import { AchievementGaugeCard, Kpi, WeeklyProductionChart, ProductRanking} from "../components/dashboard";
import { PageHeader, HeaderBadge, AlertBanner } from "../components/common";
import { fmt, fmtPct } from "../utils/format";
import { Factory } from "lucide-react";
import { COLORS } from "../constants/colors";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDashboard();
        setData(result);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="dashboard">로딩 중...</div>;
  }

  if (error) {
    return <div className="dashboard">데이터를 불러오지 못했습니다.</div>;
  }

  if (!data) return null;

  const showAlert =
    Number(data.equipmentUtilization) === 0 || Number(data.achievementRate) < 30;

  return (
    <div className="dashboard">
      <PageHeader
        title="생산 현황 대시보드"
        subtitle="LINE MONITOR · 2026-07-13 (MON) · 실시간"
        icon={Factory}
      >
        <HeaderBadge
          color={showAlert ? COLORS.red : COLORS.green}
          label={showAlert ? "라인 점검 필요" : "정상 가동"}
        />
      </PageHeader>

      <AlertBanner
        show={showAlert}
        title={`설비 가동률 ${fmtPct(data.equipmentUtilization, 0)}% · 목표 달성률 ${fmtPct(data.achievementRate, 1)}%`}
        description="오늘 생산 라인이 정지 상태이거나 목표치에 크게 못 미치고 있습니다. 현장 설비 상태를 확인하세요."
      />

      <div className="dashboard-kpi-row">
        <AchievementGaugeCard value={data.achievementRate} />
        <Kpi
          eyebrow="금일 생산량"
          value={fmt(data.todayProduction)}
          unit="EA"
          sub="오늘 누적 생산 수량"
        />
        <Kpi
          eyebrow="불량 수량 / 불량률"
          value={fmt(data.todayDefect)}
          unit="EA"
          tone={Number(data.todayDefectRate) > 1 ? "bad" : "neutral"}
          sub={`불량률 ${fmtPct(data.todayDefectRate, 2)}%`}
        />
        <Kpi
          eyebrow="설비 가동률"
          value={fmtPct(data.equipmentUtilization, 0)}
          unit="%"
          tone={Number(data.equipmentUtilization) === 0 ? "bad" : "good"}
          sub={Number(data.equipmentUtilization) === 0 ? "설비 미가동" : "정상 가동 중"}
        />
      </div>

      <div className="dashboard-charts-row">
        <WeeklyProductionChart weeklyChart={data.weeklyChart} />
        <ProductRanking productChart={data.productChart} />
      </div>
    </div>
  );
}
