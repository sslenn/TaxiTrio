import { Check, X } from 'lucide-react';

export default function PackageIncludes({ includedItems, excludedItems }) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <IncludedList title="What's Included" items={includedItems} icon={Check} tone="emerald" />
      <IncludedList title="What's Not Included" items={excludedItems} icon={X} tone="rose" />
    </section>
  );
}

function IncludedList({ title, items = [], icon: Icon, tone }) {
  if (!items.length) return null;

  const styles =
    tone === 'emerald'
      ? {
          border: 'border-emerald-500',
          card: 'border-emerald-500/20 bg-emerald-950/10',
          icon: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        }
      : {
          border: 'border-rose-500',
          card: 'border-rose-500/20 bg-rose-950/10',
          icon: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
        };

  return (
    <div className="flex flex-col gap-4">
      <h2 className={`border-l-2 pl-3 font-serif text-2xl font-bold text-white ${styles.border}`}>
        {title}
      </h2>
      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className={`flex items-center gap-3 rounded-2xl border p-4 ${styles.card}`}
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${styles.icon}`}>
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm font-light text-neutral-200">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
