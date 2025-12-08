// Imports

import { signOut } from "next-auth/react";
import styles from "../page.module.css";
import { SettingsProps } from "../../types/component";

// Exports

export default function Settings({ setup }: SettingsProps) {
    return (
        <div className={styles["popup-overlay"]}>
            <div className={`${styles["popup"]} ${styles["column-container"]} ${styles["width-100"]} ${styles["content-center"]} ${styles["align-center"]} ${styles["gap-10"]}`}>
                <h2 className={`${styles["title-text"]} ${styles["text-center"]}`}>Are you sure you want to logout?</h2>
                <div className={`${styles["column-container"]} ${styles["width-100"]} ${styles["content-center"]} ${styles["align-center"]} ${styles["gap-10"]}`}>
                    <button className={`${styles["button-structure"]} ${styles["secondary-button"]} ${styles["width-100"]}`} onClick={setup.onClose}>Cancel</button>
                    <button className={`${styles["button-structure"]} ${styles["primary-button"]} ${styles["width-100"]}`} onClick={() => signOut()}>Logout</button>
                </div>
            </div>
        </div>
    )
}