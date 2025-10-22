import { useEffect, useState, useMemo } from "react";
import { useApplicantStore } from "../../../../stores/useApplicantStore";
import Searchbar from "@/components/shared/searchbar";
import AddApplicant from "./add";
import EditApplicant from "./edit";
import NoteDialog from "./note";
import ViewApplicant from "./view";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  X,
  MoreHorizontal,
  SquarePen,
  Eye,
  User,
  BriefcaseBusiness,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Applicant } from "@/types/applicant";
import DeleteApplicant from "./delete";
import AdminNote from "./adminNote";

export default function ApplicantPage() {
  const {
    applicants,
    loading,
    fetchApplicants,
    subscribe,
    unsubscribe,
    promoteApplicant,
    demoteApplicant,
    cancelApplicant,
    deployApplicant,
  } = useApplicantStore();

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentApplicantId, setCurrentApplicantId] = useState<string | null>(
    null
  );

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  const [editOpen, setEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [actionType, setActionType] = useState<
    "promote" | "demote" | "cancel" | "deploy"
  >("promote");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;

  useEffect(() => {
    fetchApplicants();
    subscribe();
    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const matchesType = typeFilter === "all" || a.type === typeFilter;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesSearch =
        a.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [applicants, typeFilter, statusFilter, searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleNoteSave = (note: string) => {
    if (!currentApplicantId) return;

    switch (actionType) {
      case "promote":
        promoteApplicant(currentApplicantId, note);
        break;
      case "demote":
        demoteApplicant(currentApplicantId, note);
        break;
      case "cancel":
        cancelApplicant(currentApplicantId, note);
        break;
      case "deploy":
        deployApplicant(currentApplicantId);
        break;
    }

    setCurrentApplicantId(null);
    setNoteDialogOpen(false);
  };

  // ✅ FIXED: open dialog for deploy
  const handleDeploy = (applicant: Applicant) => {
    setCurrentApplicantId(applicant.id);
    setActionType("deploy");
    setNoteDialogOpen(true);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Applicants Management</h2>

        <div className="space-x-2">
          <AdminNote />
          <AddApplicant />
        </div>
      </div>

      <div className="flex flex-col gap-4 items-end">
        <div className="w-1/2 flex gap-4 justify-end">
          <Searchbar value={searchTerm} onChange={setSearchTerm} />

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Type</SelectItem>
                <SelectItem value="working-student">Working Student</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="no-status">No Status</SelectItem>
                <SelectItem value="examination">Examination</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="requirements">Requirements</SelectItem>
                <SelectItem value="deployment">Deployment</SelectItem>
                <SelectItem value="orientation">Orientation</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="deployed">Deployed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Promote/Demote</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading applicants...
                  </TableCell>
                </TableRow>
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No applicants found.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <User className="size-5" /> <span>{a.fullname}</span>
                    </TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell className="capitalize">
                      {a.type === "working-student"
                        ? "Working Student"
                        : "Full Time"}
                    </TableCell>
                    <TableCell
                      className={`capitalize ${
                        a.status === "cancelled"
                          ? "text-red-600"
                          : a.status === "deployed"
                          ? "text-green-600"
                          : ""
                      }`}
                    >
                      {a.status.replace("-", " ")}
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentApplicantId(a.id);
                          setActionType("promote");
                          setNoteDialogOpen(true);
                        }}
                        disabled={
                          a.status === "orientation" ||
                          a.status === "deployed" ||
                          a.status === "cancelled"
                        }
                      >
                        <ArrowUp className="w-4 h-4 mr-1" /> Promote
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentApplicantId(a.id);
                          setActionType("demote");
                          setNoteDialogOpen(true);
                        }}
                        disabled={
                          a.status === "examination" ||
                          a.status === "deployed" ||
                          a.status === "cancelled"
                        }
                      >
                        <ArrowDown className="w-4 h-4 mr-1" /> Demote
                      </Button>
                    </TableCell>

                    <TableCell>
                      {new Date(a.created_at).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedApplicant(a);
                                setViewOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" /> View
                            </Button>
                          </DropdownMenuItem>

                          {a.status !== "deployed" &&
                            a.status !== "cancelled" && (
                              <>
                                <DropdownMenuItem>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedApplicant(a);
                                      setEditOpen(true);
                                    }}
                                  >
                                    <SquarePen className="mr-2 h-4 w-4" /> Edit
                                  </Button>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setCurrentApplicantId(a.id);
                                      setActionType("cancel");
                                      setNoteDialogOpen(true);
                                    }}
                                    className="text-red-600"
                                  >
                                    <X className="w-4 h-4 mr-2 text-red-600" />
                                    Cancel
                                  </Button>
                                </DropdownMenuItem>

                                {a.status === "orientation" && (
                                  <DropdownMenuItem>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeploy(a)}
                                      className="text-green-600"
                                    >
                                      <BriefcaseBusiness className="w-4 h-4 mr-2 text-green-600" />
                                      Deploy
                                    </Button>
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}

                          <DropdownMenuItem>
                            <Button
                              onClick={() => {
                                setCurrentApplicantId(a.id);
                                setDeleteDialogOpen(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-red-800"
                            >
                              <Trash2 className="w-4 h-4 mr-2 text-red-800" />
                              Delete
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-2">
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {currentApplicantId && (
        <NoteDialog
          open={noteDialogOpen}
          onClose={() => setNoteDialogOpen(false)}
          onSave={handleNoteSave}
          action={actionType}
        />
      )}

      {selectedApplicant && (
        <ViewApplicant
          applicant={selectedApplicant}
          open={viewOpen}
          onClose={() => setViewOpen(false)}
        />
      )}

      {selectedApplicant && (
        <EditApplicant
          applicant={selectedApplicant}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}

      {currentApplicantId && (
        <DeleteApplicant
          applicantId={currentApplicantId}
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        />
      )}
    </section>
  );
}
