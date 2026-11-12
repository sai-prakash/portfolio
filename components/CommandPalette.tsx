'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@vercel/analytics';
import { site } from '@/lib/site';
import { findEgg, toast } from '@/lib/eggs';
import { isPlainKey } from '@/lib/keys';
import { toggleTheme } from './ThemeToggle';
import { toggleAgentView } from './AgentView';
import { openAsk } from './AskButton';

type Item = { id: string; group: 'Go to' | 'Case studies' | 'Actions'; label: string; run: () => void };
type Props = { cases: { slug: string; title: string }[]; hasPosts: boolean };

export default function CommandPalette({ cases, hasPosts }: Props) {
  const router = useRouter();
  const dlg = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  const items = useMemo<Item[]>(() => {
    const go = (id: string, label: string, href: string): Item => ({ id, group: 'Go to', label, run: () => router.push(href) });
    const list: Item[] = [
      go('home', 'Home', '/'),
      go('work', 'Work', '/work'),
      go('hire', 'Hiring summary', '/hire'),
      go('cv', 'CV', '/cv'),
      go('playground', 'Playground', '/playground'),
      go('system', 'Design system', '/system'),
      go('accessibility', 'Accessibility', '/accessibility'),
    ];
    if (hasPosts) list.push(go('writing', 'Writing', '/writing'));
    for (const c of cases) list.push({ id: `case-${c.slug}`, group: 'Case studies', label: c.title, run: () => router.push(`/work/${c.slug}`) });
    list.push(
      {
        id: 'copy-email', group: 'Actions', label: 'Copy email address',
        run: () => {
          navigator.clipboard?.writeText(site.email).then(() => toast('Email address copied.'), () => toast(site.email));
        },
      },
      { id: 'email', group: 'Actions', label: 'Email Sai', run: () => { window.location.href = `mailto:${site.email}`; } },
      { id: 'theme', group: 'Actions', label: 'Toggle dark theme', run: toggleTheme },
      { id: 'agent', group: 'Actions', label: 'Toggle agent view', run: toggleAgentView },
      { id: 'ask', group: 'Actions', label: 'Ask the guide about Sai', run: () => openAsk() },
      { id: 'pdf', group: 'Actions', label: 'Save CV as PDF', run: () => router.push('/cv') },
    );
    return list;
  }, [cases, hasPosts, router]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter((i) => i.label.toLowerCase().includes(t)) : items;
  }, [items, q]);
  const groups = useMemo(() => (['Go to', 'Case studies', 'Actions'] as const).map((g) => ({ g, rows: shown.filter((i) => i.group === g) })).filter((x) => x.rows.length), [shown]);

  const open = useCallback(() => {
    const d = dlg.current;
    if (!d || d.open) return;
    opener.current = document.activeElement as HTMLElement | null;
    setQ(''); setActive(0); setIsOpen(true);
    d.showModal();
    findEgg('palette');
    try { track('palette_open'); } catch {}
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dlg.current?.open) dlg.current.close(); else open();
      } else if (e.key === '/' && isPlainKey(e)) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => { setActive(0); }, [q]);
  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, isOpen, shown]);

  function run(item: Item) {
    try { track('palette_run', { id: item.id }); } catch {}
    dlg.current?.close();
    setTimeout(item.run, 40);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (shown.length ? (a + 1) % shown.length : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (shown.length ? (a - 1 + shown.length) % shown.length : 0)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(Math.max(0, shown.length - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (shown[active]) run(shown[active]); }
  }

  const activeId = shown[active] ? `cmd-opt-${shown[active].id}` : undefined;
  let idx = -1;
  return (
    <>
      <button type="button" className="icon-btn has-label cmd-btn" aria-label="Open command menu" aria-haspopup="dialog" onClick={open}>
        <span aria-hidden="true">⌘K</span>
      </button>
      <dialog
        ref={dlg}
        className="cmd"
        aria-label="Command menu"
        onClose={() => { setIsOpen(false); opener.current?.focus?.(); }}
        onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}
      >
        {isOpen && (
          <div className="cmd-box">
            <input
              className="cmd-input"
              role="combobox"
              aria-expanded="true"
              aria-controls="cmd-list"
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              aria-label="Search commands"
              placeholder="Type a command or search"
              autoComplete="off"
              spellCheck={false}
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <div id="cmd-list" className="cmd-list" role="listbox" aria-label="Commands" ref={listRef}>
              {groups.map(({ g, rows }) => (
                <div key={g} role="group" aria-labelledby={`cmd-g-${g.replace(/\s/g, '')}`}>
                  <div className="cmd-group" id={`cmd-g-${g.replace(/\s/g, '')}`} role="presentation">{g}</div>
                  {rows.map((it) => {
                    const i = ++idx;
                    return (
                      <div key={it.id} id={`cmd-opt-${it.id}`} role="option" aria-selected={i === active} className="cmd-opt" onPointerMove={() => setActive(i)} onClick={() => run(it)}>
                        {it.label}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            {shown.length === 0 && <p className="cmd-empty" role="status">Nothing matches. Try &apos;cv&apos; or &apos;email&apos;.</p>}
            <p className="cmd-foot" aria-hidden="true">Up and down to move, Enter to run, Esc to close</p>
          </div>
        )}
      </dialog>
    </>
  );
}
