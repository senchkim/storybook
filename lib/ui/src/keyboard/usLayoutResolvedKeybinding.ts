import { KeyCode, KeyCodeUtils, Keybinding, ResolvedKeybinding, SimpleKeybinding } from './keyCodes';
import { OperatingSystem, UILabelProvider, UserSettingsLabelProvider } from './platform';

export class USLayoutResolvedKeybinding extends ResolvedKeybinding {
  constructor(actual: Keybinding, OS: OperatingSystem) {
    super();
    this._os = OS;
    if (!actual) {
      throw new Error(`Invalid USLayoutResolvedKeybinding`);
    } else {
      this.shortcut = actual;
    }
  }
  private readonly _os: OperatingSystem;
  private readonly shortcut: SimpleKeybinding;

  // returns a string version of keybinding separated by '+'
  public static getDispatchStr(keybinding: SimpleKeybinding): string | null {
    if (keybinding.isModifierKey()) {
      return null;
    }
    let result = '';

    if (keybinding.ctrlKey) {
      result += 'ctrl+';
    }
    if (keybinding.shiftKey) {
      result += 'shift+';
    }
    if (keybinding.altKey) {
      result += 'alt+';
    }
    if (keybinding.metaKey) {
      result += 'meta+';
    }
    result += KeyCodeUtils.toString(keybinding.keyCode);

    return result;
  }

  private _keyCodeToUILabel(keyCode: KeyCode): string {
    if (this._os === OperatingSystem.Macintosh) {
      switch (keyCode) {
        case KeyCode.LeftArrow:
          return '←';
        case KeyCode.UpArrow:
          return '↑';
        case KeyCode.RightArrow:
          return '→';
        case KeyCode.DownArrow:
          return '↓';
      }
    }
    return KeyCodeUtils.toString(keyCode);
  }

  private _getUILabelForKeybinding(keybinding: SimpleKeybinding | null): string | null {
    if (!keybinding) {
      return null;
    }
    if (keybinding.isDuplicateModifierCase()) {
      return '';
    }
    return this._keyCodeToUILabel(+keybinding.keyCode);
  }

  public getLabel(): string | null {
    let shortcut = this._getUILabelForKeybinding(this.shortcut);
    return UILabelProvider.toLabel(this.shortcut, shortcut, this._os);
  }

  private _getUserSettingsLabelForKeybinding(keybinding: SimpleKeybinding | null): string | null {
    if (!keybinding) {
      return null;
    }
    if (keybinding.isDuplicateModifierCase()) {
      return '';
    }
    return KeyCodeUtils.toUserSettingsUS(keybinding.keyCode);
  }

  public getUserSettingsLabel(): string | null {
    let shortcut = this._getUserSettingsLabelForKeybinding(this.shortcut);

    let result = UserSettingsLabelProvider.toLabel(this.shortcut, shortcut, this._os);
    return result ? result.toLowerCase() : result;
  }
}
