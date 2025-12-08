// Imports

import styles from "../page.module.css";
import { TableProps } from "../../types/component";

// Exports

export default function Table({ setup }: TableProps) {

    const filteredData = setup.filterBy && setup.filterBy !== "all"
        ? setup.data.filter((row) => {
            const statusColumnIndex = setup.headers.indexOf("Status");
            return row[statusColumnIndex] === setup.filterBy;
        })
        : setup.data;

    return (
        <table className={styles["table-container"]}>
            <thead>
                <tr>
                    {setup.headers.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                    {setup.hasComments && (
                        <th>Comments</th>
                    )}
                    {setup.archiveable && (
                        <th>Archive</th>
                    )}
                </tr>
            </thead>

            <tbody>
                {filteredData.length === 0 ? (
                    <tr>
                        <td colSpan={setup.headers.length} className={styles["text-center"]}>No data available</td>
                    </tr>
                ) : (
                    filteredData.map((row, rowIndex) => (
                        <tr key={rowIndex} className={setup.clickable ? styles["clickable"] : ""} onClick={() => setup.onClick(Number(row[0]))}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex}>{cell}</td>
                            ))}
                            {setup.hasComments && (
                                <td>
                                    <button
                                        className={`${styles["button-structure"]} ${styles["secondary-button"]}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setup.onViewComments(Number(row[0]));
                                        }}
                                    >
                                        View
                                    </button>
                                </td>
                            )}
                            {setup.archiveable && (
                                <td>
                                    <button
                                        className={`${styles["button-structure"]} ${styles["secondary-button"]}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setup.onArchive(Number(row[0]));
                                        }}
                                    >
                                        Archive
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}