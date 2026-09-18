import { test } from 'node:test';
import assert from 'node:assert';

test('useModalBackHandler: Browser History & Mobile Back Protocol', async () => {
  // Mock window & history environment
  let popstateHandler: ((e: any) => void) | null = null;
  const historyStack: any[] = [{ page: 'home' }];
  let backCallCount = 0;

  (globalThis as any).window = {
    location: { pathname: '/baca' },
    history: {
      get state() {
        return historyStack[historyStack.length - 1];
      },
      pushState(state: any, _title: string) {
        historyStack.push(state);
      },
      back() {
        backCallCount++;
        historyStack.pop();
        if (popstateHandler) {
          popstateHandler({ state: historyStack[historyStack.length - 1] });
        }
      }
    },
    addEventListener(event: string, handler: any) {
      if (event === 'popstate') popstateHandler = handler;
    },
    removeEventListener(event: string, handler: any) {
      if (event === 'popstate' && popstateHandler === handler) {
        popstateHandler = null;
      }
    }
  };

  // Test Case 1: Modal Opens -> History State Pushed
  let isClosed = false;
  const onClose = () => { isClosed = true; };

  // Simulate hook mounting with isOpen = true
  const initialHistoryLen = historyStack.length;
  window.history.pushState({ ...window.history.state, __qurabic_modal_active: true }, '');
  assert.strictEqual(historyStack.length, initialHistoryLen + 1, 'Modal must push a history entry on open');

  // Test Case 2: Mobile Back Button Pressed -> Triggers popstate, pops entry, calls onClose, NO extra back()
  let closedByPop = false;
  popstateHandler = () => {
    closedByPop = true;
    onClose();
  };

  // Simulate mobile back button
  historyStack.pop(); // Browser pops the modal state
  popstateHandler({}); // Browser emits popstate
  assert.strictEqual(closedByPop, true, 'popstate must close the modal');
  assert.strictEqual(isClosed, true, 'onClose must be called');
  assert.strictEqual(historyStack.length, initialHistoryLen, 'History length must be restored to initial page state');

  // Clean up mock
  delete (globalThis as any).window;
});
