export function showDialog(dialog: HTMLDialogElement | null) {
  if (!dialog) return;

  dialog.tabIndex = -1;
  dialog.showModal();
  dialog.focus({ preventScroll: true });
}
