import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import PurchaseBlock, { Purchase } from "@/components/PurchaseBlock";

const INITIAL_PURCHASES: Purchase[] = [
  {
    id: "1",
    number: "0173200003625000011",
    subject: "Поставка компьютерного оборудования",
    amount: "1250000",
    deadline: "2025-05-20",
    hasTZ: true,
    isSubmitted: true,
    isSigned: false,
    notes: "Уточнить технические требования у заказчика. Обратить внимание на п. 3.2 документации.",
    tzDate: "2025-04-10",
    submissionDate: "2025-04-25",
    contractDate: "",
    createdAt: "2025-04-01",
  },
  {
    id: "2",
    number: "0373100005425000044",
    subject: "Обслуживание серверной инфраструктуры",
    amount: "480000",
    deadline: "2025-06-01",
    hasTZ: true,
    isSubmitted: false,
    isSigned: false,
    notes: "",
    tzDate: "2025-04-15",
    submissionDate: "",
    contractDate: "",
    createdAt: "2025-04-05",
  },
  {
    id: "3",
    number: "0123456789012345678",
    subject: "Разработка программного обеспечения",
    amount: "3200000",
    deadline: "2025-04-30",
    hasTZ: true,
    isSubmitted: true,
    isSigned: true,
    notes: "Контракт подписан. Работы ведутся по плану.",
    tzDate: "2025-03-01",
    submissionDate: "2025-03-20",
    contractDate: "2025-04-05",
    createdAt: "2025-03-01",
  },
];

type FilterStatus = "all" | "has_tz" | "submitted" | "signed" | "not_signed" | "overdue";

const FILTER_OPTIONS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "has_tz", label: "Есть ТЗ" },
  { key: "submitted", label: "Подана" },
  { key: "signed", label: "Подписана" },
  { key: "not_signed", label: "Не подписана" },
  { key: "overdue", label: "Просроченные" },
];

type SortKey = "number" | "deadline" | "amount" | "created";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "created", label: "По дате создания" },
  { key: "deadline", label: "По сроку подачи" },
  { key: "amount", label: "По сумме" },
  { key: "number", label: "По номеру" },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

interface AddPurchaseModalProps {
  onAdd: (p: Purchase) => void;
  onClose: () => void;
}

function AddPurchaseModal({ onAdd, onClose }: AddPurchaseModalProps) {
  const [number, setNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!number.trim()) {
      setError("Номер закупки обязателен");
      return;
    }
    onAdd({
      id: generateId(),
      number: number.trim(),
      subject,
      amount,
      deadline,
      hasTZ: false,
      isSubmitted: false,
      isSigned: false,
      notes: "",
      tzDate: "",
      submissionDate: "",
      contractDate: "",
      createdAt: new Date().toISOString().slice(0, 10),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-lg border border-border shadow-2xl animate-slide-up"
        style={{ backgroundColor: "hsl(220 22% 10%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold/10 border border-gold/30 rounded flex items-center justify-center">
              <Icon name="Plus" size={14} className="text-gold" />
            </div>
            <h2 className="font-oswald text-base font-semibold tracking-wide">Новая закупка</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Number — required */}
          <div>
            <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              Номер закупки <span className="text-gold">*</span>
            </label>
            <input
              autoFocus
              className="w-full search-input rounded px-3 py-2 text-sm font-mono-ibm"
              value={number}
              onChange={(e) => { setNumber(e.target.value); setError(""); }}
              placeholder="Например: 0173200003625000011"
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              Предмет закупки
            </label>
            <input
              className="w-full search-input rounded px-3 py-2 text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Краткое описание предмета"
            />
          </div>

          {/* Amount + Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                Сумма (₽)
              </label>
              <input
                type="number"
                min="0"
                className="w-full search-input rounded px-3 py-2 text-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                Срок подачи
              </label>
              <input
                type="date"
                className="w-full search-input rounded px-3 py-2 text-sm"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-border text-sm text-muted-foreground hover:text-foreground transition-all"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-gold text-background text-sm font-medium hover:bg-gold/90 transition-all"
          >
            <Icon name="Plus" size={14} />
            Создать закупку
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(INITIAL_PURCHASES);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [sortAsc, setSortAsc] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  function handleUpdate(id: string, updated: Partial<Purchase>) {
    setPurchases((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  }

  function handleDelete(id: string) {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  }

  function handleAdd(p: Purchase) {
    setPurchases((prev) => [p, ...prev]);
  }

  const filtered = useMemo(() => {
    let list = [...purchases];

    // Search by number or subject
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.number.toLowerCase().includes(q) ||
          p.subject.toLowerCase().includes(q)
      );
    }

    // Filter
    switch (activeFilter) {
      case "has_tz":
        list = list.filter((p) => p.hasTZ);
        break;
      case "submitted":
        list = list.filter((p) => p.isSubmitted);
        break;
      case "signed":
        list = list.filter((p) => p.isSigned);
        break;
      case "not_signed":
        list = list.filter((p) => !p.isSigned);
        break;
      case "overdue":
        list = list.filter((p) => {
          if (!p.deadline) return false;
          return new Date(p.deadline).getTime() < Date.now() && !p.isSigned;
        });
        break;
      default:
        break;
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "number":
          cmp = a.number.localeCompare(b.number);
          break;
        case "deadline":
          cmp = (a.deadline || "9999").localeCompare(b.deadline || "9999");
          break;
        case "amount":
          cmp = parseFloat(a.amount || "0") - parseFloat(b.amount || "0");
          break;
        case "created":
          cmp = (a.createdAt || "").localeCompare(b.createdAt || "");
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [purchases, search, activeFilter, sortKey, sortAsc]);

  // Stats
  const totalAmount = purchases.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const signedCount = purchases.filter((p) => p.isSigned).length;
  const submittedCount = purchases.filter((p) => p.isSubmitted).length;
  const overdueCount = purchases.filter(
    (p) => p.deadline && new Date(p.deadline).getTime() < Date.now() && !p.isSigned
  ).length;

  function formatTotal(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} млн ₽`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)} тыс ₽`;
    return `${n.toLocaleString("ru-RU")} ₽`;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ─── PAGE HEADER ─── */}
      <div className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-oswald text-xl font-semibold tracking-wide">
              Мои закупки
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Управление и отслеживание ваших закупок
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-gold text-background text-sm font-medium hover:bg-gold/90 transition-all glow-gold"
          >
            <Icon name="Plus" size={15} />
            Добавить закупку
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Всего закупок", value: purchases.length.toString(), icon: "ShoppingBag", color: "text-foreground" },
            { label: "Подписано", value: `${signedCount} / ${purchases.length}`, icon: "FileCheck2", color: "text-green-400" },
            { label: "Подано заявок", value: submittedCount.toString(), icon: "Send", color: "text-teal-400" },
            { label: "Просроченных", value: overdueCount.toString(), icon: "AlertCircle", color: overdueCount > 0 ? "text-red-400" : "text-muted-foreground" },
          ].map(({ label, value, icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-secondary/40 border border-border rounded-lg px-3 py-2.5"
            >
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon name={icon} size={15} className={color} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${color}`}>{value}</div>
                <div className="text-[10px] text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {totalAmount > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground">Общая сумма закупок:</span>
            <span className="font-oswald text-lg font-semibold text-gold">{formatTotal(totalAmount)}</span>
          </div>
        )}

        {/* Search + Filters */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full search-input rounded pl-9 pr-9 py-2 text-sm"
              placeholder="Поиск по номеру или предмету закупки..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Filter chips + Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex flex-wrap gap-1.5 flex-1">
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`tag-filter text-xs px-3 py-1 rounded-full border transition-all ${
                    activeFilter === f.key
                      ? "bg-gold text-background border-gold"
                      : "border-border text-muted-foreground hover:border-gold/50"
                  }`}
                >
                  {f.label}
                  {f.key === "overdue" && overdueCount > 0 && (
                    <span className="ml-1.5 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                      {overdueCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1.5 text-xs px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-gold/50 transition-all"
              >
                <Icon name="ArrowUpDown" size={12} />
                {SORT_OPTIONS.find((s) => s.key === sortKey)?.label}
              </button>
              {showSortMenu && (
                <div
                  className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border shadow-xl z-20 animate-fade-in overflow-hidden"
                  style={{ backgroundColor: "hsl(220 22% 10%)" }}
                >
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        if (sortKey === s.key) setSortAsc(!sortAsc);
                        else { setSortKey(s.key); setSortAsc(false); }
                        setShowSortMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-secondary transition-all ${
                        sortKey === s.key ? "text-gold" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                      {sortKey === s.key && (
                        <Icon name={sortAsc ? "ArrowUp" : "ArrowDown"} size={12} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-xs text-muted-foreground">
              {filtered.length} из {purchases.length}
            </span>
          </div>
        </div>
      </div>

      {/* ─── PURCHASES LIST ─── */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4"
        onClick={() => showSortMenu && setShowSortMenu(false)}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-fade-in">
            {purchases.length === 0 ? (
              <>
                <div className="w-16 h-16 rounded-full bg-secondary/60 border border-border flex items-center justify-center mb-4">
                  <Icon name="ShoppingBag" size={28} className="opacity-40" />
                </div>
                <div className="text-sm font-medium mb-1">Закупок пока нет</div>
                <div className="text-xs opacity-60 mb-4">Нажмите «Добавить закупку», чтобы начать</div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-gold text-background text-sm font-medium hover:bg-gold/90 transition-all"
                >
                  <Icon name="Plus" size={14} />
                  Добавить первую закупку
                </button>
              </>
            ) : (
              <>
                <Icon name="SearchX" size={36} className="mb-3 opacity-40" />
                <div className="text-sm">Закупки не найдены</div>
                <button
                  onClick={() => { setSearch(""); setActiveFilter("all"); }}
                  className="mt-3 text-xs text-gold hover:underline"
                >
                  Сбросить фильтры
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <PurchaseBlock
                  purchase={p}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── ADD MODAL ─── */}
      {showAddModal && (
        <AddPurchaseModal onAdd={handleAdd} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
