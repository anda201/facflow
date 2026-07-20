import React, { useMemo, useState, useEffect } from "react";
import { ProductionDetailCard, ProductionTable } from "../components/productions";
import { SummaryChip, PageHeader, HeaderBadge, DateStatusToolbar, DelayAlertSection } from "../components/common";
import { PRODUCTION_STATUS_FILTERS } from "../constants/statusMeta";
import { COLORS } from "../constants/colors";
import { splitByDelaySeverity } from "../utils/delay";
import {
  fmt,
  fmtPct,
  toKstDateInputValue,
} from "../utils/format";
import {
  Factory,
  Gauge,
  CheckCircle2,
  PackageCheck,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { getProduction, endProduction } from "../api";


const EMPTY_SUMMARY = {
  totalProductions: 0,
  totalGoodQty: 0,
  totalDefectQty: 0,
  totalProductionQty: 0,
  defectRate: 0,
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export default function ProductionPerformanceDashboard() {
  const [productions, setProductions] = useState([]);
  const [overdueProductions, setOverdueProductions] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [selectedDate, setSelectedDate] = useState(
    toKstDateInputValue(new Date().toISOString())
  );
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeProductionId, setActiveProductionId] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getProduction({ productionDate: selectedDate });
        setProductions(result.productions ?? []);
        setOverdueProductions(result.overdueProductions ?? []);
        setSummary(result.summary ?? EMPTY_SUMMARY);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProductions();
  }, [selectedDate]);

  const productionsForDate = useMemo(() => {
    const overdueIds = new Set(overdueProductions.map((p) => p.productionId));
    return productions
      .filter((p) => !overdueIds.has(p.productionId))
      .filter((p) => statusFilter === "ALL" || p.status === statusFilter)
      .sort((a, b) => b.productionId - a.productionId);
  }, [productions, overdueProductions, statusFilter]);

  const overdueProductionsForView = useMemo(() => {
    return overdueProductions
      .filter((p) => statusFilter === "ALL" || p.status === statusFilter)
      .sort((a, b) => a.planDate.localeCompare(b.planDate) || b.productionId - a.productionId);
  }, [overdueProductions, statusFilter]);

  const { startDelayed: startDelayedProductions, dueOverdue: dueOverdueProductions } = useMemo(
    () => splitByDelaySeverity(overdueProductionsForView),
    [overdueProductionsForView]
  );

  const delaySummary = useMemo(
    () => splitByDelaySeverity(overdueProductions),
    [overdueProductions]
  );

  const runningCount = [...overdueProductions, ...productions].filter((p) => p.status === "RUN").length;
  const activeProduction =
    [...overdueProductions, ...productions].find((p) => p.productionId === activeProductionId) ?? null;

  async function handleComplete(productionId) {
    try {
      const result = await endProduction(productionId);
      setProductions((prev) =>
        prev.map((p) =>
          p.productionId === productionId
            ? {
                ...p,
                status: "DONE",
                goodQty: result.goodQty,
                defectQty: result.defectQty,
                endTime: new Date().toISOString(),
              }
            : p
        )
      );
      setOverdueProductions((prev) => prev.filter((p) => p.productionId !== productionId));
      setActiveProductionId(null);
      setFlashId(productionId);
      setTimeout(() => setFlashId(null), 2200);
      const refetch = await getProduction({ productionDate: selectedDate });
      setSummary(refetch.summary ?? EMPTY_SUMMARY);
    } catch (e) {
      setError(e);
    }
  }

  if (loading) {
    return <div className="dashboard">로딩 중...</div>;
  }

  if (error) {
    return <div className="dashboard">데이터를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="dashboard">
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor: pointer; }
        @keyframes flashRow { 0% { background: rgba(61,220,132,0.18); } 100% { background: transparent; } }
        tr.perf-row:hover { background: rgba(255,255,255,0.025); }
        tr.perf-row--clickable:hover { cursor: pointer; }
        tr.perf-row-delay-critical:hover { background: rgba(255,90,90,0.06); }
        tr.perf-row-delay-warning:hover { background: rgba(245,166,35,0.08); }
      `}</style>

      <PageHeader
        title="실적 현황"
        subtitle="PERFORMANCE · 일자별 생산 실적 조회 및 완료 처리"
        icon={Gauge}
      >
        {runningCount > 0 && (
          <HeaderBadge color={COLORS.amber} label={`${runningCount}건 생산중`} />
        )}
      </PageHeader>

      {/* Summary strip (DONE-only, mirrors selectProductionSummary) */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <SummaryChip label="총 생산 건수" value={summary.totalProductions} unit="건" color={COLORS.blue} Icon={PackageCheck} />
        <SummaryChip label="양품 수량" value={fmt(summary.totalGoodQty)} unit="EA" color={COLORS.green} Icon={CheckCircle2} />
        <SummaryChip label="불량 수량" value={fmt(summary.totalDefectQty)} unit="EA" color={COLORS.red} Icon={AlertTriangle} />
        <SummaryChip label="총 생산 수량" value={fmt(summary.totalProductionQty)} unit="EA" color={COLORS.text} Icon={Factory} />
        <SummaryChip label="불량률" value={fmtPct(summary.defectRate, 2)} unit="%" color={Number(summary.defectRate) > 5 ? COLORS.red : COLORS.amber} Icon={Gauge} />
        <SummaryChip label="착수 지연" value={delaySummary.startDelayed.length} unit="건" color={COLORS.amber} Icon={Clock} />
        <SummaryChip label="납기 지연" value={delaySummary.dueOverdue.length} unit="건" color={COLORS.red} Icon={AlertTriangle} />
      </div>

      {dueOverdueProductions.length > 0 && (
        <DelayAlertSection
          severity="critical"
          count={dueOverdueProductions.length}
          title="진행중 실적 (납기 지연)"
        >
          <ProductionTable
            productions={dueOverdueProductions}
            runningCount={dueOverdueProductions.filter((p) => p.status === "RUN").length}
            flashId={flashId}
            onRowClick={setActiveProductionId}
            showPlanDate
            showDueDate
            borderRadius="4px"
            variant="delay-critical"
          />
        </DelayAlertSection>
      )}

      {startDelayedProductions.length > 0 && (
        <DelayAlertSection
          severity="warning"
          count={startDelayedProductions.length}
          title="진행중 실적 (착수 지연)"
        >
          <ProductionTable
            productions={startDelayedProductions}
            runningCount={startDelayedProductions.filter((p) => p.status === "RUN").length}
            flashId={flashId}
            onRowClick={setActiveProductionId}
            showPlanDate
            borderRadius="4px"
            variant="delay-warning"
          />
        </DelayAlertSection>
      )}

      <DateStatusToolbar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onTodayClick={() => setSelectedDate(toKstDateInputValue(new Date().toISOString()))}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusFilters={PRODUCTION_STATUS_FILTERS}
      />

      <ProductionTable
        productions={productionsForDate}
        runningCount={productionsForDate.filter((p) => p.status === "RUN").length}
        flashId={flashId}
        onRowClick={setActiveProductionId}
      />

      {activeProduction?.status === "RUN" && (
        <ProductionDetailCard
          production={activeProduction}
          onClose={() => setActiveProductionId(null)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
