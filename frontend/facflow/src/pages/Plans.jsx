import React, { useEffect, useMemo, useState } from "react";
import { getPlan, getIdleEquipment, createPlan, startPlan, getProducts } from "../api";
import {
  toKstDateInputValue,
} from "../utils/format";
import {
  CreatePlanForm,
  PlanDetailCard,
  PlanTable,
} from "../components/plans";
import { PageHeader, SummaryChip, DateStatusToolbar } from "../components/common";
import { COLORS } from "../constants/colors";
import { PLAN_STATUS_FILTERS } from "../constants/statusMeta";
import {
  Clock,
  PlayCircle,
  CheckCircle2,
  Ban,
  ListTodo,
  Plus,
  X,
} from "lucide-react";


// get products from /products API 구현 예정
const PRODUCTS = [
  { productId: 1, productCode: "P-001", productName: "자동차 브레이크 패드" },
  { productId: 4, productCode: "P-004", productName: "기어 샤프트" },
  { productId: 6, productCode: "P-006", productName: "모터 커버" },
  { productId: 7, productCode: "P-007", productName: "배터리 프레임" },
  { productId: 9, productCode: "P-009", productName: "센서 모듈" },
  { productId: 10, productCode: "P-010", productName: "제어 보드" },
  { productId: 11, productCode: "P-011", productName: "스틸 플레이트" },
  { productId: 13, productCode: "P-013", productName: "유압 밸브" },
  { productId: 14, productCode: "P-014", productName: "실린더 블록" },
  { productId: 16, productCode: "P-016", productName: "로봇 암 조인트" },
  { productId: 17, productCode: "P-017", productName: "반도체 장비 부품" },
  { productId: 19, productCode: "P-019", productName: "산업용 컨트롤러" },
  { productId: 20, productCode: "P-020", productName: "스마트 센서 키트" },
];


const EMPTY_SUMMARY = {
  totalPlans: 0,
  waitPlans: 0,
  runningPlans: 0,
  completedPlans: 0,
  canceledPlans: 0,
};


export default function ProductionPlanDashboard() { 
    const [selectedDate, setSelectedDate] = useState(
        toKstDateInputValue(new Date().toISOString())
    );
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [showForm, setShowForm] = useState(false);
    const [flashId, setFlashId] = useState(null);
    const [activePlanId, setActivePlanId] = useState(null);
    
    const [equipment, setEquipment] = useState([]);
    const [plans, setPlans] = useState([]);
    const [summary, setSummary] = useState(EMPTY_SUMMARY);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [createError, setCreateError] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
      const fetchEquipment = async () => {
        try {
          const equipmentData = await getIdleEquipment();
          setEquipment(equipmentData ?? []);
        } catch (e) {
          setError(e);
        }
      };
      fetchEquipment();
    }, []);

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const productsData = await getProducts();
          setProducts(productsData ?? []);
        } catch (e) {
          setError(e);
        }
      };
      fetchProducts();
    }, []);

    useEffect(() => {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          setError(null);
          const result = await getPlan({ planDate: selectedDate });
          setPlans(result.plans ?? []);
          setSummary(result.summary ?? EMPTY_SUMMARY);
        } catch (e) {
          setError(e);
        } finally {
          setLoading(false);
        }
      };
      fetchPlans();
    }, [selectedDate]);

  const plansForDate = useMemo(() => {
    return plans
      .filter((p) => statusFilter === "ALL" || p.status === statusFilter)
      .sort((a, b) => b.planId - a.planId);
  }, [plans, statusFilter]);

  if (loading) {
    return <div className="dashboard">로딩 중...</div>;
  }

  if (error) {
    return <div className="dashboard">데이터를 불러오지 못했습니다.</div>;
  }

  const dateTargetTotal = plansForDate.reduce((s, p) => s + p.targetQty, 0);
  const activePlan = plans.find((p) => p.planId === activePlanId) || null;


  async function handleCreate(form) {
    const requestBody = {
      productId: form.productId,
      planDate: form.planDate,
      targetQty: form.targetQty,
    };

    try {
      setCreateError(null);
      const planId = await createPlan(requestBody);
      const dateChanged = form.planDate !== selectedDate;

      setSelectedDate(form.planDate);
      setStatusFilter("ALL");
      setShowForm(false);

      if (!dateChanged) {
        const result = await getPlan({ planDate: form.planDate });
        setPlans(result.plans ?? []);
        setSummary(result.summary ?? EMPTY_SUMMARY);
      }

      setFlashId(planId);
      setTimeout(() => setFlashId(null), 2200);

    } catch (e) {
      setCreateError("계획 등록에 실패했습니다.");
    }
  }

  async function handleStart(planId, equipmentId) {
    const requestBody = {
      equipmentId: equipmentId,
    };

    try {
      const response = await startPlan(planId, requestBody);
      setPlans((prev) =>
        prev.map((p) =>
          p.planId === planId ? { ...p, status: "RUN", equipmentId } : p
        )
      );
      setEquipment((prev) =>
        prev.map((e) =>
          e.equipmentId === equipmentId ? { ...e, status: "RUN" } : e
        )
      );
      setFlashId(planId);
      setTimeout(() => setFlashId(null), 2200);
      setActivePlanId(null);
    } catch (e) {
      setError(e);
    }
  }

  function handleDelete(planId) {
    const target = plans.find((p) => p.planId === planId);
    setPlans((prev) => prev.filter((p) => p.planId !== planId));
    if (target && target.status === "RUN" && target.equipmentId) {
      setEquipment((prev) =>
        prev.map((e) =>
          e.equipmentId === target.equipmentId ? { ...e, status: "IDLE" } : e
        )
      );
    }
    setActivePlanId(null);
  }

  return (
    <div className="dashboard">
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor: pointer; }
        select { cursor: pointer; }
        @keyframes flashRow { 0% { background: rgba(245,166,35,0.22); } 100% { background: transparent; } }
        tr.plan-row:hover { background: rgba(255,255,255,0.025); cursor: pointer; }
      `}</style>

      <PageHeader title="생산 계획 관리" subtitle="PLAN MANAGER" icon={ListTodo}>
        <button
          onClick={() => {
            setShowForm((v) => !v);
            setCreateError(null);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: showForm ? "transparent" : COLORS.amber,
            border: `1px solid ${COLORS.amber}`,
            color: showForm ? COLORS.amber : "#1A1300",
            borderRadius: 4,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? "닫기" : "새 계획 등록"}
        </button>
      </PageHeader>
      {/* Summary strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <SummaryChip label="전체 계획" value={summary.totalPlans} color={COLORS.blue} Icon={ListTodo} />
        <SummaryChip label="대기" value={summary.waitPlans} color={COLORS.muted} Icon={Clock} />
        <SummaryChip label="진행중" value={summary.runningPlans} color={COLORS.amber} Icon={PlayCircle} />
        <SummaryChip label="완료" value={summary.completedPlans} color={COLORS.green} Icon={CheckCircle2} />
        <SummaryChip label="취소" value={summary.canceledPlans} color={COLORS.red} Icon={Ban} />
      </div>

      {/* Create form */}
      {showForm && (
        <CreatePlanForm
          products={products}
          defaultDate={selectedDate}
          serverError={createError}
          onCancel={() => {
            setShowForm(false);
            setCreateError(null);
          }}
          onCreate={handleCreate}
        />
      )}

      <DateStatusToolbar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onTodayClick={() =>
          setSelectedDate(toKstDateInputValue(new Date().toISOString()))
        }
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusFilters={PLAN_STATUS_FILTERS}
      />
      <PlanTable
        plans={plansForDate}
        dateTargetTotal={dateTargetTotal}
        flashId={flashId}
        onRowClick={setActivePlanId}
      />
      {activePlan && (
        <PlanDetailCard
          plan={activePlan}
          equipment={equipment}
          onClose={() => setActivePlanId(null)}
          onStart={handleStart}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
