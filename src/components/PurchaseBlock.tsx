import { useState } from "react";
import Icon from "@/components/ui/icon";

export interface Purchase {
  id: string;
  number: string;
  subject: string;
  amount: string;
  deadline: string;
  hasTZ: boolean;
  isSubmitted: boolean;
  isSigned: boolean;
  notes: string;
  tzDate: string;
  submissionDate: string;
  contractDate: string;
  createdAt: string;
}

interface CheckCellProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  color?: string;
}

function CheckCell({ label, checked, onChange, disabled, color = "gold" }: CheckCellProps) {
  const colorMap: Record<string, string> = {
    gold: "border-gold/60 bg-gold/10 text-gold",
    teal: "border-teal-400/60 bg-teal-400/10 text-teal-400",
    green: "border-green-400/60 bg-green-400/10 text-green-400",
  };
  const activeClass = colorMap[color] || colorMap.gold;

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded border transition-all select-none min-w-[64px] ${
        checked
          ? activeClass
          : "border-border bg-secondary/40 text-muted-foreground hover:border-border/80"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
    >
      <div
        className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
          checked ? "border-current bg-current/20" : "border-border"
        }`}
      >
        {checked && <Icon name="Check" size={12} className="text-current" />}
      </div>
      <span className="text-[10px] font-medium leading-tight whitespace-nowrap">{label}</span>
    </button>
  );
}

interface PurchaseBlockProps {
  purchase: Purchase;
  onUpdate: (id: string, updated: Partial<Purchase>) => void;
  onDelete: (id: string) => void;
}

export default function PurchaseBlock({ purchase, onUpdate, onDelete }: PurchaseBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [editData, setEditData] = useState<Purchase>(purchase);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleSave() {
    onUpdate(purchase.id, editData);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditData(purchase);
    setIsEditing(false);
  }

  function toggleCheck(field: "hasTZ" | "isSubmitted" | "isSigned", val: boolean) {
    onUpdate(purchase.id, { [field]: val });
  }

  function formatDate(d: string) {
    if (!d) return "—";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function daysLeft(deadline: string) {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    if (diff < 0) return { text: "Истёк", cls: "text-red-400" };
    if (diff === 0) return { text: "Сегодня", cls: "text-orange-400" };
    if (diff <= 5) return { text: `${diff} дн.`, cls: "text-orange-400" };
    return { text: `${diff} дн.`, cls: "text-muted-foreground" };
  }

  function formatAmount(val: string) {
    if (!val) return "—";
    const num = parseFloat(val.replace(/\s/g, "").replace(",", "."));
    if (isNaN(num)) return val;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)} млн ₽`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)} тыс ₽`;
    return `${num.toLocaleString("ru-RU")} ₽`;
  }

  const days = daysLeft(purchase.deadline);

  const completionCount = [purchase.hasTZ, purchase.isSubmitted, purchase.isSigned].filter(Boolean).length;
  const completionPct = Math.round((completionCount / 3) * 100);
  const progressColor =
    completionPct === 100 ? "bg-green-500" : completionPct >= 66 ? "bg-gold" : completionPct >= 33 ? "bg-orange-400" : "bg-border";

  return (
    <div className="card-tender rounded-lg overflow-hidden animate-slide-up">
      {/* ─── HEADER ─── */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none border-b border-border/60"
        style={{ backgroundColor: "hsl(220 22% 8%)" }}
        onClick={() => !isEditing && setExpanded(!expanded)}
      >
        {/* Progress indicator */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-border flex items-center justify-center relative">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="13" fill="none" stroke="hsl(220 18% 18%)" strokeWidth="2.5" />
            <circle
              cx="16"
              cy="16"
              r="13"
              fill="none"
              stroke={completionPct === 100 ? "hsl(142 60% 42%)" : "hsl(42 85% 58%)"}
              strokeWidth="2.5"
              strokeDasharray={`${(completionPct / 100) * 81.68} 81.68`}
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[9px] font-mono-ibm text-muted-foreground relative z-10">
            {completionPct}%
          </span>
        </div>

        {/* Number badge */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-mono-ibm text-xs text-gold bg-gold/10 border border-gold/30 px-2 py-0.5 rounded flex-shrink-0">
            #{purchase.number}
          </span>
          <span className="text-sm font-medium truncate">
            {purchase.subject || <span className="text-muted-foreground italic">Без предмета</span>}
          </span>
        </div>

        {/* Meta right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {purchase.amount && (
            <span className="font-oswald text-base font-semibold text-gold hidden sm:block">
              {formatAmount(purchase.amount)}
            </span>
          )}
          {days && (
            <span className={`text-xs font-mono-ibm ${days.cls} hidden md:block`}>
              <Icon name="Clock" size={11} className="inline mr-1" />
              {days.text}
            </span>
          )}
          {/* Check badges compact */}
          <div className="flex gap-1">
            {[
              { v: purchase.hasTZ, label: "ТЗ" },
              { v: purchase.isSubmitted, label: "Подана" },
              { v: purchase.isSigned, label: "Подп." },
            ].map(({ v, label }) => (
              <span
                key={label}
                className={`text-[9px] px-1.5 py-0.5 rounded border ${
                  v
                    ? "bg-green-500/15 border-green-500/40 text-green-400"
                    : "bg-secondary/40 border-border text-muted-foreground/40"
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setExpanded(true);
                setEditData(purchase);
              }}
              className="p-1.5 rounded text-muted-foreground hover:text-gold hover:bg-gold/10 transition-all"
              title="Редактировать"
            >
              <Icon name="Pencil" size={13} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-1.5 rounded text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"
              title="Удалить"
            >
              <Icon name="Trash2" size={13} />
            </button>
            <Icon
              name={expanded ? "ChevronUp" : "ChevronDown"}
              size={14}
              className="text-muted-foreground ml-1"
            />
          </div>
        </div>
      </div>

      {/* ─── DELETE CONFIRM ─── */}
      {showDeleteConfirm && (
        <div className="px-4 py-3 bg-red-900/20 border-b border-red-500/30 flex items-center justify-between gap-3 animate-fade-in">
          <span className="text-sm text-red-300">
            Удалить закупку <span className="font-mono-ibm text-red-200">#{purchase.number}</span>?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground transition-all"
            >
              Отмена
            </button>
            <button
              onClick={() => onDelete(purchase.id)}
              className="text-xs px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-500 transition-all"
            >
              Удалить
            </button>
          </div>
        </div>
      )}

      {/* ─── BODY ─── */}
      {expanded && (
        <div className="p-4 animate-fade-in">
          {isEditing ? (
            /* ─── EDIT MODE ─── */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Number */}
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    Номер закупки *
                  </label>
                  <input
                    className="w-full search-input rounded px-3 py-2 text-sm font-mono-ibm"
                    value={editData.number}
                    onChange={(e) => setEditData({ ...editData, number: e.target.value })}
                    placeholder="Например: 0123456789"
                  />
                </div>
                {/* Subject */}
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    Предмет закупки
                  </label>
                  <input
                    className="w-full search-input rounded px-3 py-2 text-sm"
                    value={editData.subject}
                    onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                    placeholder="Предмет закупки"
                  />
                </div>
                {/* Amount */}
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    Сумма закупки (₽)
                  </label>
                  <input
                    className="w-full search-input rounded px-3 py-2 text-sm font-mono-ibm"
                    value={editData.amount}
                    onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                    placeholder="0.00"
                    type="number"
                    min="0"
                  />
                </div>
                {/* Deadline */}
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    Дата окончания подачи
                  </label>
                  <input
                    type="date"
                    className="w-full search-input rounded px-3 py-2 text-sm"
                    value={editData.deadline}
                    onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                  />
                </div>
                {/* TZ Date */}
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    Дата создания ТЗ
                  </label>
                  <input
                    type="date"
                    className="w-full search-input rounded px-3 py-2 text-sm"
                    value={editData.tzDate}
                    onChange={(e) => setEditData({ ...editData, tzDate: e.target.value })}
                  />
                </div>
                {/* Submission Date */}
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    Дата подачи заявки
                  </label>
                  <input
                    type="date"
                    className="w-full search-input rounded px-3 py-2 text-sm"
                    value={editData.submissionDate}
                    onChange={(e) => setEditData({ ...editData, submissionDate: e.target.value })}
                  />
                </div>
                {/* Contract Date */}
                <div>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    Дата подписания контракта
                  </label>
                  <input
                    type="date"
                    className="w-full search-input rounded px-3 py-2 text-sm"
                    value={editData.contractDate}
                    onChange={(e) => setEditData({ ...editData, contractDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Checkboxes in edit mode */}
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                  Отметки
                </label>
                <div className="flex flex-wrap gap-2">
                  <CheckCell
                    label="ТЗ"
                    checked={editData.hasTZ}
                    onChange={(v) => setEditData({ ...editData, hasTZ: v })}
                    color="gold"
                  />
                  <CheckCell
                    label="Подана"
                    checked={editData.isSubmitted}
                    onChange={(v) => setEditData({ ...editData, isSubmitted: v })}
                    color="teal"
                  />
                  <CheckCell
                    label="Подписана"
                    checked={editData.isSigned}
                    onChange={(v) => setEditData({ ...editData, isSigned: v })}
                    color="green"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Заметки
                </label>
                <textarea
                  className="w-full search-input rounded px-3 py-2 text-sm resize-none"
                  rows={3}
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  placeholder="Дополнительные заметки по закупке..."
                />
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 rounded bg-gold text-background text-sm font-medium hover:bg-gold/90 transition-all"
                >
                  <Icon name="Check" size={14} />
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-4 py-2 rounded border border-border text-muted-foreground text-sm hover:text-foreground transition-all"
                >
                  <Icon name="X" size={14} />
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            /* ─── VIEW MODE ─── */
            <div className="space-y-4">
              {/* Row 1: Check cells + Amount + Deadline */}
              <div className="flex flex-wrap items-start gap-3">
                {/* Check cells */}
                <div className="flex gap-2">
                  <CheckCell
                    label="ТЗ"
                    checked={purchase.hasTZ}
                    onChange={(v) => toggleCheck("hasTZ", v)}
                    color="gold"
                  />
                  <CheckCell
                    label="Подана"
                    checked={purchase.isSubmitted}
                    onChange={(v) => toggleCheck("isSubmitted", v)}
                    color="teal"
                  />
                  <CheckCell
                    label="Подписана"
                    checked={purchase.isSigned}
                    onChange={(v) => toggleCheck("isSigned", v)}
                    color="green"
                  />
                </div>

                {/* Divider */}
                <div className="w-px bg-border self-stretch hidden sm:block" />

                {/* Info cells */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 flex-1">
                  {/* Subject */}
                  {purchase.subject && (
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Предмет</div>
                      <div className="text-sm">{purchase.subject}</div>
                    </div>
                  )}

                  {/* Amount */}
                  {purchase.amount && (
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Сумма</div>
                      <div className="font-oswald text-base font-semibold text-gold">
                        {formatAmount(purchase.amount)}
                      </div>
                    </div>
                  )}

                  {/* Deadline */}
                  {purchase.deadline && (
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        Срок подачи
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Icon name="Calendar" size={12} className="text-muted-foreground" />
                        {formatDate(purchase.deadline)}
                        {days && (
                          <span className={`text-xs ${days.cls}`}>({days.text})</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Прогресс закупки</span>
                  <span>{completionCount}/3 шагов</span>
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>

              {/* Dates row */}
              {(purchase.tzDate || purchase.submissionDate || purchase.contractDate) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-border/50">
                  {[
                    { label: "Дата создания ТЗ", val: purchase.tzDate, icon: "FileText" },
                    { label: "Дата подачи заявки", val: purchase.submissionDate, icon: "Send" },
                    { label: "Дата подписания контракта", val: purchase.contractDate, icon: "FileSignature" },
                  ].map(({ label, val, icon }) => (
                    <div key={label} className="flex items-start gap-2">
                      <div className="mt-0.5 w-6 h-6 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                        <Icon name={icon} size={11} className="text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">{label}</div>
                        <div className="text-xs font-mono-ibm text-foreground">{formatDate(val)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {purchase.notes && (
                <div className="pt-1 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
                    <Icon name="StickyNote" size={10} />
                    Заметки
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-secondary/30 rounded px-3 py-2">
                    {purchase.notes}
                  </p>
                </div>
              )}

              {/* Created at */}
              <div className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                <Icon name="Clock3" size={9} />
                Создано: {formatDate(purchase.createdAt)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}