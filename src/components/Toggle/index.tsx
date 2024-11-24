import styles from "./Toggle.module.css";

// TODO REFACTOR for using chakra.

export interface ToggleProps {
	isToggled: boolean;
	onToggle: () => void;
}

export function Toggle({ isToggled, onToggle }: ToggleProps) {
	return (
		<div className={styles.toggleWrapper}>
			<input type="checkbox" className={styles.toggleCheckbox} checked={isToggled} onChange={onToggle} id="twoFaToggle" />
			<label htmlFor="twoFaToggle" className={styles.toggleLabel}></label>
		</div>
	);
}
