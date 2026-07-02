import { useState } from "react";
import { Link } from "wouter";
import { useUser } from "@/hooks/use-user";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lead, LeadStatus } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, Trash2, Inbox, Mail, Phone, Building2 } from "lucide-react";

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-amber-100 text-amber-800 border border-amber-200",
  read: "bg-slate-100 text-slate-700 border border-slate-200",
  archived: "bg-slate-200 text-slate-500 border border-slate-300",
};

function AdminNav({ active }: { active: "portfolio" | "leads" }) {
  return (
    <nav className="hidden sm:flex items-center gap-1 ml-4">
      <Link href="/admin/dashboard">
        <span className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer ${active === "portfolio" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}>
          Portfolio
        </span>
      </Link>
      <Link href="/admin/leads">
        <span className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer ${active === "leads" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900"}`}>
          Leads
        </span>
      </Link>
    </nav>
  );
}

export default function Leads() {
  const { logout } = useUser();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data: leads, isLoading } = useQuery<Lead[]>({ queryKey: ["/api/leads"] });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: LeadStatus }) =>
      apiRequest("PATCH", `/api/leads/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/leads"] }),
    onError: (err: any) => toast({ variant: "destructive", title: "Error", description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({ title: "Deleted", description: "Lead removed." });
      setDeletingId(null);
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-6 shadow-sm">
        <h1 className="text-xl font-bold font-display">Omniflow<span className="text-amber-500">CMS</span></h1>
        <AdminNav active="leads" />
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Leads</h2>
          {leads && <span className="text-sm text-slate-500">{leads.length} total</span>}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-xl" />)}
          </div>
        ) : !leads || leads.length === 0 ? (
          <div className="text-center py-24 text-slate-500 bg-white rounded-xl border">
            <Inbox className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No leads yet.</p>
            <p className="text-sm text-slate-400 mt-1">Submissions from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-xl border p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{lead.name}</h3>
                      <Badge className={STATUS_STYLES[lead.status]}>{lead.status}</Badge>
                      <span className="text-xs uppercase tracking-wide text-slate-400">{lead.service}</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-2 space-y-1">
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /><a href={`mailto:${lead.email}`} className="hover:underline break-all">{lead.email}</a></div>
                      {lead.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" />{lead.phone}</div>}
                      {lead.company && <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-slate-400" />{lead.company}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select value={lead.status} onValueChange={(status) => statusMutation.mutate({ id: lead.id, status: status as LeadStatus })}>
                      <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="destructive" size="icon" className="h-9 w-9" onClick={() => setDeletingId(lead.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-600">
                  <p className={expanded === lead.id ? "whitespace-pre-wrap" : "line-clamp-2"}>{lead.message}</p>
                  {lead.message.length > 140 && (
                    <button
                      onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                      className="text-xs font-medium text-amber-600 hover:text-amber-700 mt-1"
                    >
                      {expanded === lead.id ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>

                <div className="mt-3 text-xs text-slate-400">
                  {new Date(lead.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the submission.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
