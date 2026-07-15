import { useMemo, useState, useEffect } from "react";
import { PageHeader, SummaryChip } from "../components/common";
import { EquipmentCard, EquipmentDetailCard } from "../components/equipments";
import { getEquipment, updateEquipmentStatus } from "../api";
import { COLORS } from "../constants/colors";
import {
  Wrench,
  PlayCircle,
  Clock,
  ShieldAlert,
  Cog,
} from "lucide-react";

const EQUIP_SUMMARY_FILTERS = [
  { key: "ALL", label: "전체 설비", summaryKey: "totalEquipment", color: COLORS.blue, Icon: Wrench },
  { key: "RUN", label: "가동중", summaryKey: "runningEquipment", color: COLORS.amber, Icon: PlayCircle },
  { key: "IDLE", label: "대기", summaryKey: "idleEquipment", color: COLORS.green, Icon: Clock },
  { key: "STOP", label: "점검", summaryKey: "stoppedEquipment", color: COLORS.red, Icon: ShieldAlert },
];

const EMPTY_SUMMARY = {
  totalEquipment: 0,
  runningEquipment: 0,
  idleEquipment: 0,
  stoppedEquipment: 0,
};

function patchSummary(prev, fromStatus, toStatus) {
  const next = { ...prev };
  if (fromStatus === "RUN") next.runningEquipment -= 1;
  if (fromStatus === "IDLE") next.idleEquipment -= 1;
  if (fromStatus === "STOP") next.stoppedEquipment -= 1;
  if (toStatus === "RUN") next.runningEquipment += 1;
  if (toStatus === "IDLE") next.idleEquipment += 1;
  if (toStatus === "STOP") next.stoppedEquipment += 1;
  return next;
}

export default function EquipmentStatusDashboard() {
  const [equipments, setEquipments] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getEquipment();
        setEquipments(result.equipments ?? []);
        setSummary(result.summary ?? EMPTY_SUMMARY);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipments();
  }, []);

  const filtered = useMemo(() => {
    return equipments
      .filter((e) => statusFilter === "ALL" || e.status === statusFilter)
      .sort((a, b) => a.equipmentId - b.equipmentId);
  }, [equipments, statusFilter]);

  const utilizationPct =
    summary.totalEquipment === 0 ? 0 : (summary.runningEquipment / summary.totalEquipment) * 100;

  const activeEquip = equipments.find((e) => e.equipmentId === activeId) || null;

  async function handleSetStop(equipmentId) {
    try {
      const result = await updateEquipmentStatus(equipmentId, { status: "STOP" });
      setEquipments((prev) =>
        prev.map((e) => (e.equipmentId === equipmentId ? { ...e, status: "STOP" } : e))
      );

      console.log(result);
      setSummary((prev) => patchSummary(prev, result.status, "STOP"));
      setActiveId(null);

    } catch (e) {
      setError(e);
    }
  };

  if (loading) {
    return <div className="dashboard">로딩 중...</div>;
  }

  if (error) {
    return <div className="dashboard">데이터를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="dashboard">
      <PageHeader
        title="설비 현황"
        subtitle="EQUIPMENT · 실시간 설비 상태 조회"
        icon={Cog}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: COLORS.muted,
          }}
        >
          가동률
          <span
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: utilizationPct >= 50 ? COLORS.green : COLORS.amber,
            }}
          >
            {utilizationPct.toFixed(0)}%
          </span>
        </div>
      </PageHeader>
      <div style={{ display: "flex", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
        {EQUIP_SUMMARY_FILTERS.map(({ key, label, summaryKey, color, Icon }) => (
          <SummaryChip
            key={key}
            label={label}
            value={summary[summaryKey]}
            color={color}
            Icon={Icon}
            active={statusFilter === key}
            onClick={() => setStatusFilter(key)}
          />
        ))}
      </div>
      {/* Equipment grid */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11.5,
          color: COLORS.muted,
          marginBottom: 10,
        }}
      >
        {filtered.length}대 표시 중 · 카드를 클릭하면 상세 정보를 볼 수 있어요
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
          gap: 12,
        }}
      >
        {filtered.map((eq) => (
          <EquipmentCard key={eq.equipmentId} eq={eq} onOpen={setActiveId} />
        ))}
      </div>

      {activeEquip && (
        <EquipmentDetailCard
          eq={activeEquip}
          onClose={() => setActiveId(null)}
          onSetStop={handleSetStop}
        />
      )}
    </div>
  );
}
