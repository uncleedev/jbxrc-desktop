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
    deleteApplicant,
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

  const [actionType, setActionType] = useState<"promote" | "demote" | "cancel">(
    "promote"
  );

  useEffect(() => {
    fetchApplicants();
    subscribe();
    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const matchesType = typeFilter === "all" || a.type === typeFilter;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesSearch = a.fullname
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [applicants, typeFilter, statusFilter, searchTerm]);

  const handleNoteSave = (note: string) => {
    if (!currentApplicantId) return;

    if (actionType === "promote") {
      promoteApplicant(currentApplicantId, note);
    } else if (actionType === "demote") {
      demoteApplicant(currentApplicantId, note);
    } else if (actionType === "cancel") {
      cancelApplicant(currentApplicantId, note);
    }

    setCurrentApplicantId(null);
    setNoteDialogOpen(false);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Applicants Management</h2>
        <AddApplicant />
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
                <SelectItem value="part-time">Part Time</SelectItem>
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
                <SelectItem value="examination">Examination</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="requirements">Requirements</SelectItem>
                <SelectItem value="deployment">Deployment</SelectItem>
                <SelectItem value="orientation">Orientation</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
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
                  <TableCell colSpan={6} className="text-center py-6">
                    Loading applicants...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No applicants found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.fullname}</TableCell>
                    <TableCell>{a.type}</TableCell>
                    <TableCell
                      className={`capitalize ${
                        a.status === "cancelled" ? "text-red-600" : ""
                      }`}
                    >
                      {a.status}
                    </TableCell>

                    {/* Combined Promote/Demote Column */}
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
                          a.status === "orientation" || a.status === "cancelled"
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
                          a.status === "examination" || a.status === "cancelled"
                        }
                      >
                        <ArrowDown className="w-4 h-4 mr-1" /> Demote
                      </Button>
                    </TableCell>

                    <TableCell>
                      {new Date(a.created_at).toLocaleString()}
                    </TableCell>

                    {/* Actions Dropdown */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
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
                              size={"sm"}
                              variant={"ghost"}
                              onClick={() => {
                                setCurrentApplicantId(a.id);
                                setActionType("cancel");
                                setNoteDialogOpen(true);
                              }}
                              disabled={a.status === "cancelled"}
                            >
                              <X className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Button
                              onClick={() => deleteApplicant(a.id)}
                              variant={"ghost"}
                              size={"sm"}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
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
      </div>
      {/* Note Dialog */}
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
    </section>
  );
}
