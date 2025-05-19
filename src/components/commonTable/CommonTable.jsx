import React from "react";
import { Table } from "react-bootstrap";

const TableSkeleton = ({ columns }) => (
  <tbody>
    {[...Array(5)].map((_, index) => (
      <tr key={index}>
        {columns.map((col, i) => (
          <td key={i} style={{ padding: "8px" }}>
            <div
              className="skeleton-loader"
              style={{ width: "100%", height: "16px" }}
            />
          </td>
        ))}
        <td style={{ padding: "8px" }}>
          <div
            className="skeleton-loader"
            style={{ width: "50%", height: "16px", float: "right" }}
          />
        </td>
      </tr>
    ))}
  </tbody>
);

const CommonTable = ({ columns, data, isLoading, paddingRight, actions }) => {
  return (
    <div className="hidden-scrollbar-user">
      <Table className="table" striped hover>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.style}>
                {col.label}
              </th>
            ))}
            {actions && (
              <th
                style={{
                  textAlign: "right",
                  paddingRight: paddingRight || "60px",
                }}
              >
                Action
              </th>
            )}
          </tr>
        </thead>
        {isLoading === "loading" ? (
          <TableSkeleton columns={columns} />
        ) : (
          <tbody>
            {data?.length > 0 ? (
              data?.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={col.style}
                      className={col.className}
                      title={
                        col.key === "details" ||
                        col.key === "message" ||
                        col.key === "card_name" ||
                        col.key === "outlet_name"
                          ? col.render(item)
                          : ""
                      }
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td style={{ textAlign: "right" }}>
                      <div className="btn-container">{actions(item)}</div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={actions ? columns.length + 1 : columns.length}
                  style={{ textAlign: "center" }}
                >
                  No data is available
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>
    </div>
  );
};

export default CommonTable;
