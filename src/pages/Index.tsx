import { useState } from "react";
import Icon from "@/components/ui/icon";

const tenders = [
  {
    id: "44-ФЗ-2024-0091",
    title: "Поставка компьютерного оборудования для нужд Министерства образования",
    customer: "Министерство образования РФ",
    region: "Москва",
    price: 12_480_000,
    deadline: "2025-05-15",
    published: "2025-04-01",
    status: "active",
    category: "ИТ-оборудование",
    law: "44-ФЗ",
    participants: 7,
    myBid: null,
  },
  {
    id: "44-ФЗ-2024-0088",
    title: "Строительство детского сада на 240 мест в г. Казань",
    customer: "Администрация г. Казань",
    region: "Татарстан",
    price: 248_000_000,
    deadline: "2025-04-28",
    published: "2025-03-25",
    status: "active",
    category: "Строительство",
    law: "44-ФЗ",
    participants: 3,
    myBid: null,
  },
  {
    id: "223-ФЗ-2024-0044",
    title: "Техническое обслуживание медицинского оборудования в 5 больницах",
    customer: "ГБУЗ «Городская больница №1»",
    region: "Санкт-Петербург",
    price: 5_600_000,
    deadline: "2025-05-10",
    published: "2025-03-30",
    status: "pending",
    category: "Медицина",
    law: "223-ФЗ",
    participants: 2,
    myBid: 5_200_000,
  },
  {
    id: "44-ФЗ-2024-0081",
    title: "Аренда транспортных средств для государственных нужд",
    customer: "ФНС России, УФНС по МО",
    region: "Московская область",
    price: 3_200_000,
    deadline: "2025-04-10",
    published: "2025-03-15",
    status: "closed",
    category: "Транспорт",
    law: "44-ФЗ",
    participants: 11,
    myBid: 2_980_000,
  },
  {
    id: "44-ФЗ-2024-0075",
    title: "Поставка офисной мебели для Федеральной службы судебных приставов",
    customer: "ФССП России",
    region: "Москва",
    price: 1_800_000,
    deadline: "2025-03-20",
    published: "2025-03-01",
    status: "won",
    category: "Мебель",
    law: "44-ФЗ",
    participants: 5,
    myBid: 1_720_000,
  },
  {
    id: "223-ФЗ-2024-0039",
    title: "Разработка программного обеспечения для автоматизации документооборота",
    customer: "ПАО «Росгеология»",
    region: "Москва",
    price: 18_500_000,
    deadline: "2025-05-25",
    published: "2025-04-02",
    status: "active",
    category: "ИТ-услуги",
    law: "223-ФЗ",
    participants: 4,
    myBid: null,
  },
];

const stats = [
  { label: "Активных тендеров", value: "2 841", icon: "FileText", delta: "+124 за неделю", color: "gold" },
  { label: "Моих заявок", value: "12", icon: "Send", delta: "3 на рассмотрении", color: "teal" },
  { label: "Выигранных", value: "₽ 4.2M", icon: "Trophy", delta: "+18% к плану", color: "success" },
  { label: "Эффективность", value: "67%", icon: "TrendingUp", delta: "выше среднего", color: "warning" },
];

const categories = ["Все", "ИТ-оборудование", "ИТ-услуги", "Строительство", "Медицина", "Транспорт", "Мебель"];
const laws = ["Все законы", "44-ФЗ", "223-ФЗ"];
const navItems = ["Дашборд", "Тендеры", "Мои заявки", "Аналитика", "Уведомления"];

function formatPrice(p: number) {
  if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(1)} млн ₽`;
  if (p >= 1_000) return `${(p / 1_000).toFixed(0)} тыс ₽`;
  return `${p.toLocaleString()} ₽`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(deadline: string) {
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (diff < 0) return "Истёк";
  if (diff === 0) return "Сегодня";
  return `${diff} д.`;
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  active: { label: "Активный", cls: "status-active" },
  pending: { label: "Подача заявки", cls: "status-pending" },
  closed: { label: "Завершён", cls: "status-closed" },
  won: { label: "Победа", cls: "status-won" },
};

export default function Index() {
  const [activeNav, setActiveNav] = useState("Тендеры");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [activeLaw, setActiveLaw] = useState("Все законы");
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [selectedTender, setSelectedTender] = useState<typeof tenders[0] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = tenders.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Все" || t.category === activeCategory;
    const matchLaw = activeLaw === "Все законы" || t.law === activeLaw;
    const matchStatus = !activeStatus || t.status === activeStatus;
    return matchSearch && matchCat && matchLaw && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-ibm overflow-x-hidden">
      {/* TOP BAR */}
      <header className="h-14 border-b border-border flex items-center px-4 gap-4 z-50 bg-background/95 backdrop-blur-sm sticky top-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-muted-foreground hover:text-gold transition-colors p-1"
        >
          <Icon name="Menu" size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 bg-gold rounded flex items-center justify-center">
            <Icon name="Scale" size={14} className="text-background" />
          </div>
          <span className="font-oswald text-lg font-semibold tracking-wider">
            ТЕНДЕР<span className="text-gold">ПРО</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`nav-link text-sm font-medium pb-0.5 transition-colors ${
                activeNav === item
                  ? "text-gold active"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <button className="p-2 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              <Icon name="Bell" size={18} />
            </button>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold" />
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold text-gold">
              ИП
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-medium leading-tight">ИП Петров А.В.</div>
              <div className="text-[10px] text-muted-foreground">ИНН 771234567890</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        {sidebarOpen && (
          <aside
            className="w-56 border-r border-border flex-shrink-0 overflow-y-auto scrollbar-thin hidden md:flex flex-col animate-fade-in"
            style={{ backgroundColor: "hsl(220 25% 6%)" }}
          >
            <div className="p-4 space-y-1">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-2">
                Навигация
              </div>
              {[
                { icon: "LayoutDashboard", label: "Дашборд", count: null },
                { icon: "FileSearch", label: "Тендеры", count: "2 841" },
                { icon: "Send", label: "Мои заявки", count: "12" },
                { icon: "Star", label: "Избранное", count: "8" },
                { icon: "BarChart3", label: "Аналитика", count: null },
              ].map(({ icon, label, count }) => (
                <button
                  key={label}
                  onClick={() => setActiveNav(label)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded text-sm transition-all ${
                    activeNav === label
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon name={icon} size={15} />
                  <span className="flex-1 text-left">{label}</span>
                  {count && (
                    <span
                      className={`text-[10px] font-mono-ibm ${
                        activeNav === label ? "text-gold" : "text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-border mt-2 space-y-1">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-2">
                Площадки
              </div>
              {["ЕИС Госзакупки", "Сбербанк-АСТ", "РТС-тендер", "ЕЭТП"].map((p) => (
                <button
                  key={p}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-border" />
                  {p}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-border mt-auto">
              <button className="w-full flex items-center gap-2 px-2 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                <Icon name="Settings" size={15} />
                Настройки
              </button>
            </div>
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {/* HERO STRIP */}
          <div className="relative border-b border-border px-6 py-5 overflow-hidden">
            <div className="absolute inset-0 grid-diagonal opacity-30" />
            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-gold/5 to-transparent" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-4 bg-gold rounded-full" />
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                    Реестр закупок
                  </span>
                </div>
                <h1 className="font-oswald text-2xl font-semibold tracking-wide">
                  Государственные тендеры
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Мониторинг и участие по 44-ФЗ и 223-ФЗ · Обновлено 2 минуты назад
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right mr-1">
                  <div className="text-xs text-muted-foreground">Новых за сегодня</div>
                  <div className="font-oswald text-xl text-gold font-semibold">+47</div>
                </div>
                <button className="flex items-center gap-2 bg-gold text-background text-sm font-semibold px-4 py-2 rounded hover:bg-gold/90 transition-all">
                  <Icon name="Plus" size={16} />
                  Подать заявку
                </button>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="stat-card card-tender rounded p-4"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-xs text-muted-foreground leading-tight">{s.label}</div>
                  <div
                    className={`p-1.5 rounded ${
                      s.color === "gold"
                        ? "bg-gold/10 text-gold"
                        : s.color === "teal"
                        ? "bg-accent/10 text-accent"
                        : s.color === "success"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-orange-500/10 text-orange-400"
                    }`}
                  >
                    <Icon name={s.icon} size={14} />
                  </div>
                </div>
                <div className="font-oswald text-xl font-semibold mb-1">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.delta}</div>
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div className="px-6 pb-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Icon
                name="Search"
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Поиск по названию, заказчику или номеру тендера..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input w-full pl-9 pr-4 py-2.5 rounded text-sm"
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

            {/* Filter row */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`tag-filter text-xs px-3 py-1 rounded-full border transition-all ${
                      activeCategory === c
                        ? "bg-gold text-background border-gold"
                        : "border-border text-muted-foreground hover:border-gold/50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-border mx-1" />

              <div className="flex gap-1.5">
                {laws.map((l) => (
                  <button
                    key={l}
                    onClick={() => setActiveLaw(l)}
                    className={`tag-filter text-xs px-3 py-1 rounded border font-mono-ibm transition-all ${
                      activeLaw === l
                        ? "bg-gold text-background border-gold"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-border mx-1" />

              <div className="flex gap-1.5">
                {[
                  { key: "active", label: "Активные" },
                  { key: "pending", label: "Участвую" },
                  { key: "won", label: "Победы" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveStatus(activeStatus === s.key ? null : s.key)}
                    className={`tag-filter text-xs px-3 py-1 rounded border transition-all ${
                      activeStatus === s.key
                        ? "bg-gold text-background border-gold"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{filtered.length} тендеров</span>
                <button className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-gold/50 transition-all">
                  <Icon name="SlidersHorizontal" size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* TENDERS LIST */}
          <div className="px-6 pb-8 space-y-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Icon name="SearchX" size={40} className="mb-3 opacity-40" />
                <div className="text-sm">Тендеры не найдены</div>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("Все");
                    setActiveLaw("Все законы");
                    setActiveStatus(null);
                  }}
                  className="mt-3 text-xs text-gold hover:underline"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              filtered.map((tender, i) => {
                const st = statusConfig[tender.status];
                const days = daysLeft(tender.deadline);
                const isUrgent =
                  days !== "Истёк" && !isNaN(parseInt(days)) && parseInt(days) <= 5;
                const isSelected = selectedTender?.id === tender.id;

                return (
                  <div
                    key={tender.id}
                    onClick={() => setSelectedTender(isSelected ? null : tender)}
                    className={`card-tender rounded p-4 cursor-pointer ${
                      isSelected ? "border-gold/40" : ""
                    }`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Left accent bar */}
                      <div
                        className={`w-0.5 self-stretch rounded-full flex-shrink-0 ${
                          tender.status === "active"
                            ? "bg-green-500"
                            : tender.status === "pending"
                            ? "bg-orange-400"
                            : tender.status === "won"
                            ? "bg-gold"
                            : "bg-border"
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`text-[10px] font-mono-ibm px-2 py-0.5 rounded ${st.cls}`}>
                                {st.label}
                              </span>
                              <span className="text-[10px] font-mono-ibm text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                                {tender.law}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {tender.category}
                              </span>
                            </div>
                            <h3 className="text-sm font-medium leading-snug line-clamp-2 hover:text-gold transition-colors">
                              {tender.title}
                            </h3>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="font-oswald text-base font-semibold text-gold">
                              {formatPrice(tender.price)}
                            </div>
                            {tender.myBid && (
                              <div className="text-[11px] text-muted-foreground">
                                Моя заявка: {formatPrice(tender.myBid)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Icon name="Building2" size={11} />
                            {tender.customer}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="MapPin" size={11} />
                            {tender.region}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Users" size={11} />
                            {tender.participants} участников
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Calendar" size={11} />
                            Публ. {formatDate(tender.published)}
                          </span>
                        </div>

                        {/* Expanded details */}
                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-border animate-fade-in">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                              {[
                                { label: "Номер тендера", value: tender.id },
                                {
                                  label: "Срок подачи заявок",
                                  value: formatDate(tender.deadline),
                                },
                                { label: "НМЦ контракта", value: formatPrice(tender.price) },
                                { label: "Участников", value: String(tender.participants) },
                              ].map((d) => (
                                <div key={d.label} className="bg-secondary/50 rounded p-2.5">
                                  <div className="text-[10px] text-muted-foreground mb-1">
                                    {d.label}
                                  </div>
                                  <div className="text-xs font-semibold font-mono-ibm">{d.value}</div>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <button className="flex items-center gap-1.5 bg-gold text-background text-xs font-semibold px-4 py-2 rounded hover:bg-gold/90 transition-all">
                                <Icon name="Send" size={13} />
                                Подать заявку
                              </button>
                              <button className="flex items-center gap-1.5 border border-border text-xs px-3 py-2 rounded hover:border-gold/50 hover:text-foreground text-muted-foreground transition-all">
                                <Icon name="FileText" size={13} />
                                Документы
                              </button>
                              <button className="flex items-center gap-1.5 border border-border text-xs px-3 py-2 rounded hover:border-gold/50 hover:text-foreground text-muted-foreground transition-all">
                                <Icon name="Star" size={13} />
                                В избранное
                              </button>
                              <button className="flex items-center gap-1.5 border border-border text-xs px-3 py-2 rounded hover:border-gold/50 hover:text-foreground text-muted-foreground transition-all ml-auto">
                                <Icon name="ExternalLink" size={13} />
                                ЕИС
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: deadline */}
                      <div
                        className={`flex-shrink-0 text-right pl-3 border-l ${
                          isUrgent ? "border-orange-400/40" : "border-border"
                        }`}
                      >
                        <div
                          className={`text-xs font-mono-ibm font-semibold ${
                            days === "Истёк"
                              ? "text-muted-foreground line-through"
                              : isUrgent
                              ? "text-orange-400"
                              : "text-foreground"
                          }`}
                        >
                          {days}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">до подачи</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* BOTTOM ANALYTICS STRIP */}
          <div
            className="border-t border-border px-6 py-5"
            style={{ backgroundColor: "hsl(220 25% 6%)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-oswald text-base font-semibold tracking-wide">
                Эффективность участия
              </h2>
              <span className="text-xs text-muted-foreground">Последние 90 дней</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Подано заявок", total: 18, value: 18, max: 30 },
                { label: "Допущено к участию", total: 14, value: 14, max: 18 },
                { label: "Победы", total: 5, value: 5, max: 14 },
              ].map((item) => {
                const pct = Math.round((item.value / item.max) * 100);
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono-ibm text-foreground font-medium">
                        {item.total}
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="progress-bar h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {pct}% от допустимого
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}