/**
 * Shared react-data-table-component customStyles
 * Works with both light and dark themes via CSS variables
 */
const getTableStyles = () => ({
  table: {
    style: {
      backgroundColor: "var(--surface)",
    },
  },
  headRow: {
    style: {
      backgroundColor: "var(--surface-2)",
      borderBottomColor: "var(--border)",
      borderBottomWidth: "1px",
      minHeight: "48px",
    },
  },
  headCells: {
    style: {
      color: "var(--text)",
      fontWeight: "700",
      fontSize: "0.8125rem",
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      paddingLeft: "1rem",
      paddingRight: "1rem",
    },
  },
  rows: {
    style: {
      backgroundColor: "var(--surface)",
      color: "var(--text)",
      borderBottomColor: "var(--border)",
      borderBottomWidth: "1px",
      minHeight: "52px",
      "&:hover": {
        backgroundColor: "var(--surface-2)",
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: "var(--surface-2)",
      color: "var(--text)",
      outline: "none",
    },
  },
  cells: {
    style: {
      color: "var(--text)",
      fontSize: "0.9rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
    },
  },
  pagination: {
    style: {
      backgroundColor: "var(--surface)",
      color: "var(--text-muted)",
      borderTopColor: "var(--border)",
      borderTopWidth: "1px",
    },
    pageButtonsStyle: {
      color: "var(--text-muted)",
      fill: "var(--text-muted)",
      "&:hover:not(:disabled)": {
        backgroundColor: "var(--surface-2)",
      },
      "&:focus": {
        outline: "none",
        backgroundColor: "var(--surface-2)",
      },
    },
  },
  noData: {
    style: {
      backgroundColor: "var(--surface)",
      color: "var(--text-muted)",
      padding: "2.5rem",
      textAlign: "center",
      fontSize: "0.9375rem",
    },
  },
});

export default getTableStyles;
