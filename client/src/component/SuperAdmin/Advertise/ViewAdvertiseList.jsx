import React, { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Button,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Token from "../../Token/Token";
import UpdateAdvertiseForm from "./UpdationForm";
import { toast } from "react-toastify";

const ViewAdvertiseList = () => {
  const [advertiseList, setAdvertiseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const token = Token();

  const handleEdit = (row) => {
    setEditData(row.original);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    setIsEditOpen(false);
    fetchData();
  };

  const fetchData = async () => {
    try {
      const url = "http://localhost:5000/api/auth/allentries";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      setAdvertiseList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    try {
      const url = "http://localhost:5000/api/auth/deleteentry";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ id: deleteId, role: "Superadmin" }),
      });
      if (response.ok) {
        toast.success("Advertise deleted successfully!");
        setAdvertiseList((prev) =>
          prev.filter((item) => item._id !== deleteId)
        );
      } else {
        toast.error("Error deleting advertise.");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      closeDeleteDialog();
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "price",
      header: "Price",
      Cell: ({ cell }) => `₹${cell.getValue()}`,
    },
    {
      accessorKey: "limit",
      header: "Limit",
    },
    {
      accessorKey: "section",
      header: "Section",
    },
    {
      header: "Actions",
      id: "actions",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <IconButton color="primary" onClick={() => handleEdit(row)}>
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => openDeleteDialog(row.original._id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ maxWidth: "100%", p: 3 }}>
        <MaterialReactTable
          columns={columns}
          data={advertiseList}
          isLoading={isLoading}
          enableRowSelection={false}
          enableSorting
          enableGlobalFilter
          muiTableBodyCellProps={{
            sx: {
              fontSize: "14px",
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              fontWeight: "bold",
              fontSize: "16px",
            },
          }}
        />
      </Box>

      {isEditOpen && (
        <UpdateAdvertiseForm
          open={isEditOpen}
          initialData={editData}
          onClose={() => setIsEditOpen(false)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this advertise? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewAdvertiseList;
