
import { KEYBOARD_SHORTCUTS } from '../../constants/keyboard-shortcuts'

import { isApple } from '../../helpers/isApple';

export const ShortcutLabel = ({ shortcutKey }) => {
  const shortcut = KEYBOARD_SHORTCUTS[shortcutKey];
  return (
    <small className="text-muted fw-light">
      {isApple() ? shortcut.apple : shortcut.windows}
    </small>
  );
};

export const ShortcutLabelStr = (shortcutKey) => {
  const shortcut = KEYBOARD_SHORTCUTS[shortcutKey];
  return `${shortcut.description} (${isApple() ? shortcut.apple : shortcut.windows})`;
};
