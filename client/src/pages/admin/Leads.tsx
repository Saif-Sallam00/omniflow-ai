import { useState } from "react";
import { Link } from "wouter";
import { useUser } from "@/hooks/use-user";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useDocumentTitle } from "@/hooks/use-document-title";
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
  new: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  read: "bg-slate-700/40 text-slate-300 border border-slate-600/50",
  archived: "bg-slate-800/60 text-slate-500 border border-slate-700",
};

function AdminNav({ active }: { active: "portfolio" | "leads" }) {
  return (
    <nav className="hidden sm:flex items-center gap-1 ml-4">
      <Link href="/admin/dashboard">
        <span className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer ${active === "portfolio" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>
          Portfolio
        </span>
      </Link>
      <Link href="/admin/leads">
        <span className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer ${active === "leads" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>
          Leads
        </span>
      </Link>
    </nav>
  );
}

export default function Leads() {
  useDocumentTitle("Admin — Leads");
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
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-2 border-b border-slate-800 bg-[#0a0a0b]/90 backdrop-blur-sm px-6">
        <h1 className="text-xl font-bold font-display text-white">Omniflow<span className="text-primary">CMS</span></h1>
        <AdminNav active="leads" />
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => logout()} className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Leads</h2>
          {leads && <span className="text-sm text-slate-400">{leads.length} total</span>}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-900 animate-pulse rounded-xl" />)}
          </div>
        ) : !leads || leads.length === 0 ? (
          <div className="text-center py-24 text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
            <Inbox className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="font-medium">No leads yet.</p>
            <p className="text-sm text-slate-500 mt-1">Submissions from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-slate-950 rounded-xl border border-slate-800 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{lead.name}</h3>
                      <Badge className={STATUS_STYLES[lead.status]}>{lead.status}</Badge>
                      <span className="text-xs uppercase tracking-wide text-slate-500">{lead.service}</span>
                    </div>
                    <div className="text-sm text-slate-400 mt-2 space-y-1">
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /><a href={`mailto:${lead.email}`} className="hover:underline hover:text-white break-all">{lead.email}</a></div>
                      {lead.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" />{lead.phone}</div>}
                      {lead.company && <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-slate-500" />{lead.company}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select value={lead.status} onValueChange={(status) => statusMutation.mutate({ id: lead.id, status: status as LeadStatus })}>
                      <SelectTrigger className="w-32 h-9 bg-slate-900 border-slate-800 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="new" className="text-white focus:bg-slate-800 focus:text-white">New</SelectItem>
                        <SelectItem value="read" className="text-white focus:bg-slate-800 focus:text-white">Read</SelectItem>
                        <SelectItem value="archived" className="text-white focus:bg-slate-800 focus:text-white">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="destructive" size="icon" className="h-9 w-9" onClick={() => setDeletingId(lead.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-300">
                  <p className={expanded === lead.id ? "whitespace-pre-wrap" : "line-clamp-2"}>{lead.message}</p>
                  {lead.message.length > 140 && (
                    <button
                      onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                      className="text-xs font-medium text-primary hover:text-orange-400 mt-1"
                    >
                      {expanded === lead.id ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  {new Date(lead.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-slate-950 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">This permanently removes the submission.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
