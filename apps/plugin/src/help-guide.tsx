import { QuestionMark } from '@soundor/icons/lucide';
import { Modal, useViewSize } from '@soundor/react';
import { useRef, useState } from 'react';
import type { UiNode } from 'soundor:ui';

import { GuidePanel } from './guide-panel';
import { RoundIconButton } from './round-icon-button';

/** The "How to use Orbit" button, and the guide it opens above itself. */
export function HelpGuide() {
  const trigger = useRef<UiNode>(null);
  const [anchor, setAnchor] = useState<{ right: number; top: number } | null>(
    null,
  );
  const { safeArea } = useViewSize();
  const close = () => setAnchor(null);
  const open = () => {
    const box = trigger.current?.getBoundingClientRect();
    // Relative to the safe area, so it follows the footer.
    if (box)
      setAnchor({
        right: box.x + box.width - safeArea.x,
        top: box.y - safeArea.y,
      });
  };

  return (
    <>
      <RoundIconButton
        icon={QuestionMark}
        ref={trigger}
        label="How to use Orbit"
        onPress={open}
      />
      <Modal
        visible={anchor !== null}
        accessibilityLabel="Orbit controls guide"
        dismissOnBackdropPress
        onRequestClose={close}
      >
        {anchor && <GuidePanel anchor={anchor} onClose={close} />}
      </Modal>
    </>
  );
}
