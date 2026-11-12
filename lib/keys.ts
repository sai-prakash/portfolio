/** True when the event came from somewhere the visitor is typing. */
export function isTypingTarget(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable || el.getAttribute('role') === 'textbox';
}

/** A bare key press: no modifiers, not typing, not auto-repeat. */
export function isPlainKey(e: KeyboardEvent) {
  return !e.metaKey && !e.ctrlKey && !e.altKey && !e.repeat && !isTypingTarget(e.target);
}
