// Imports

import styles from "../page.module.css";
import { StatusDropdownProps } from "../../types/component";

// Exports

export default function StatusDropdown({ setup }: StatusDropdownProps) {
    return (
        <select className={`${styles["input-structure"]} ${styles["width-100"]} ${styles["clickable"]}`} onChange={(e) => {
            setup.onSelect(e.target.value);
        }}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
        </select>
    )
}