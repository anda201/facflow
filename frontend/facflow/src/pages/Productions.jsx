import React, { useMemo, useState, useEffect } from "react";
import { ProductionDetailCard, ProductionTable } from "../components/productions";
import { SummaryChip, PageHeader, HeaderBadge, DateStatusToolbar } from "../components/common";
import { PRODUCTION_STATUS_FILTERS } from "../constants/productionMeta";
import { COLORS } from "../constants/colors";
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
    return productions
      .filter((p) => statusFilter === "ALL" || p.status === statusFilter)
      .sort((a, b) => b.productionId - a.productionId);
  }, [productions, statusFilter]);

  const runningCount = productions.filter((p) => p.status === "RUN").length;
  const activeProduction =
    productions.find((p) => p.productionId === activeProductionId) ?? null;

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
        <SummaryChip
          label="불량률"
          value={fmtPct(summary.defectRate, 2)}
          unit="%"
          color={Number(summary.defectRate) > 5 ? COLORS.red : COLORS.amber}
          Icon={Gauge}
        />
      </div>

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
        runningCount={runningCount}
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
