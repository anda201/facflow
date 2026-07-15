import React, { useEffect, useMemo, useState } from "react";
import { getPlan, createPlan, startPlan, getProducts, getAvailableEquipment } from "../api";
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
    const [recommendation, setRecommendation] = useState(null);

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

    useEffect(() => {
      if (!activePlanId) {
        setRecommendation(null);
        setEquipment([]);
        return;
      }

      const plan = plans.find((p) => p.planId === activePlanId);
      if (!plan || plan.status !== "WAIT") {
        setRecommendation(null);
        setEquipment([]);
        return;
      }

      const fetchPlanDetail = async () => {
        try {
          const result = await getAvailableEquipment(activePlanId);
          setEquipment(result?.equipments ?? []);
          setRecommendation(result?.recommendation ?? null);
        } catch {
          setEquipment([]);
          setRecommendation(null);
        }
      };
      fetchPlanDetail();
    }, [activePlanId, plans]);

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
      dueDate: form.dueDate,
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
          recommendation={recommendation}
          onClose={() => setActivePlanId(null)}
          onStart={handleStart}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
