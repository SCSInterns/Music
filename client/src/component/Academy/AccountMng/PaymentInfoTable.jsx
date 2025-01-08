import React from "react";
import { MaterialReactTable } from "material-react-table";

function AttendanceTable({ records }) {
  // Log the records data to ensure it's received correctly
  console.log("Records passed to AttendanceTable:", records);

  const columns = [
    {
      accessorKey: "studentname",
      header: "Student Name",
      size: 150,
    },
    {
      accessorKey: "installmentdate",
      header: "Installment Date",
      size: 100,
    },
    {
      accessorKey: "fees",
      header: "Fees",
      size: 100,
    },
    {
      accessorKey: "previousdue",
      header: "Previous Due",
      size: 100,
    },
    {
      accessorKey: "currentdue",
      header: "Current Due",
      size: 100,
    },
    {
      accessorKey: "outstandingamount",
      header: "Amount",
      size: 100,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      cell: ({ row }) => {
        // Log the row data to ensure the outstanding amount is correctly parsed
        const outstanding = parseFloat(row.original?.outstandingamount) || 0;
        console.log("Row data:", row.original); // Debugging row data

        return (
          <div>
            {outstanding > 0 ? (
              <button
                onClick={() => handleAddPayment(row.original)}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Add Payment
              </button>
            ) : (
              <span>Paid</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "batchname",
      header: "Batch Name",
      size: 200,
    },
  ];

  // Function to handle Add Payment click
  const handleAddPayment = (record) => {
    console.log("Add payment for:", record);
    alert(`Add payment for ${record.studentname}`);
    // Implement your payment logic here
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <MaterialReactTable columns={columns} data={records} />
    </div>
  );
}

export default AttendanceTable;
