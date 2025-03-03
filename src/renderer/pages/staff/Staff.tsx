"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash, Search, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { StaffForm } from "./staff-form";
import type { Staff, StaffWithClass } from "@/lib/types/db_entities";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
  });

  const applyFilters = useCallback(
    (staffList: Staff[], currentFilters: typeof filters) => {
      let result = [...staffList];

      if (currentFilters.firstName) {
        result = result.filter((student) =>
          student.firstName
            .toLowerCase()
            .includes(currentFilters.firstName.toLowerCase())
        );
      }

      if (currentFilters.lastName) {
        result = result.filter((student) =>
          student.lastName
            .toLowerCase()
            .includes(currentFilters.lastName.toLowerCase())
        );
      }

      setFilteredStaff(result);
    },
    []
  );

  const getAllStaff = useCallback(async () => {
    try {
      const staff = await window.api.staff.getAllStaff();
      console.log(staff);
      setStaff(staff);
      applyFilters(staff, filters);

      toast("Found all students");
    } catch (error) {
      console.error(error);
      setStaff([]);
      setFilteredStaff([]);
      toast("Failed to get students");
    }
  }, [applyFilters, filters]);

  async function deleteStaff(staffId: string) {
    try {
      await window.api.staff.deleteStaff({ id: staffId });
      const updatedStaff = staff.filter((s) => s.staffId !== staffId);
      setStaff(updatedStaff);
      applyFilters(updatedStaff, filters);
      toast("Deleted staff");
    } catch (error) {
      console.error(error);
      toast("Failed to delete staff");
    }
  }

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(staff, newFilters);
  };

  const clearFilters = () => {
    setFilters({ firstName: "", lastName: "" });
    setFilteredStaff(staff);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  useEffect(() => {
    getAllStaff();
  }, [getAllStaff]);

  return (
    <div className='container mx-auto py-10 px-10'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Staff</h1>
        <div className='flex items-center gap-4'>
          <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff</DialogTitle>
              </DialogHeader>
              <StaffForm
                onDone={async () => {
                  setNewDialogOpen(false);
                  await getAllStaff();
                }}
                type='create'
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters Section */}
      <div className='mb-6 p-4 border rounded-lg bg-gray-50'>
        <div className='flex items-center gap-2 mb-2'>
          <Search className='h-4 w-4 text-gray-500' />
          <h2 className='font-medium'>Filter Staff</h2>
          {hasActiveFilters && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearFilters}
              className='ml-auto text-xs'>
              <X className='h-3 w-3 mr-1' /> Clear Filters
            </Button>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-2'>
          <div>
            <label
              htmlFor='firstName'
              className='text-sm font-medium block mb-1'>
              First Name
            </label>
            <Input
              id='firstName'
              placeholder='Filter by first name'
              value={filters.firstName}
              onChange={(e) => handleFilterChange("firstName", e.target.value)}
              className='w-full'
            />
          </div>

          <div>
            <label
              htmlFor='lastName'
              className='text-sm font-medium block mb-1'>
              Last Name
            </label>
            <Input
              id='lastName'
              placeholder='Filter by last name'
              value={filters.lastName}
              onChange={(e) => handleFilterChange("lastName", e.target.value)}
              className='w-full'
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 mt-4'>
            {filters.firstName && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                First Name: {filters.firstName}
                <button
                  onClick={() => handleFilterChange("firstName", "")}
                  className='ml-1'>
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            )}
            {filters.lastName && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                Last Name: {filters.lastName}
                <button
                  onClick={() => handleFilterChange("lastName", "")}
                  className='ml-1'>
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center py-8 text-gray-500'>
                  {staff.length === 0
                    ? "No staff found. Add some students to get started."
                    : "No staff match your filters. Try adjusting your search criteria."}
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((staff: StaffWithClass) => (
                <TableRow key={staff.staffId}>
                  <TableCell>{staff.firstName}</TableCell>
                  <TableCell>{staff.lastName}</TableCell>
                  <TableCell>
                    {staff.class
                      ? `${staff.class?.academicLevel}
                    ${staff.class?.class}`
                      : "No CLass Assigned"}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Dialog
                      open={editDialogOpen}
                      onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setEditingStaff(staff)}>
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Student</DialogTitle>
                        </DialogHeader>
                        <StaffForm
                          onDone={async () => {
                            setEditDialogOpen(false);
                            await getAllStaff();
                          }}
                          initialData={editingStaff ?? undefined}
                          type='update'
                        />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='destructive'
                          size='icon'
                          className='ml-2'>
                          <Trash className='h-4 w-4' />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you Sure?</DialogTitle>
                        </DialogHeader>
                        <section className='flex items-center justify-center flex-col gap-4'>
                          <p className='text-red-500'>
                            This action cannot be undone.
                          </p>

                          <p className='text-gray-500 mt-4'>
                            This will permanently delete {staff.firstName}{" "}
                            {staff.lastName} from the database.
                          </p>
                          <section className='flex items-center justify-center gap-4'>
                            <Button
                              variant='destructive'
                              size='sm'
                              onClick={() => deleteStaff(staff.staffId)}>
                              Delete
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => setEditingStaff(null)}>
                              Cancel
                            </Button>
                          </section>
                        </section>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
