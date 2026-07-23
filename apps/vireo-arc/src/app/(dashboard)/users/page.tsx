'use client';

import * as React from 'react';
import Link from 'next/link';
import { Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import {
  Badge, Button, Card, CardContent, Input,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@cardioline/ui';
import { PrototypeToast } from '@/components/ui/prototype-toast';
import { SortableHeader, type SortDirection } from '@/components/ui/sortable-header';
import { TablePagination } from '@/components/ui/table-pagination';

const users = [
  ['marco.rossi', 'Carlos Almeida', 'Clinician', 'Pending'], ['giulia.verdi', 'Andrea Bigazzi', 'Technician', 'Inactive'], ['alessandro.bianchi', 'Gabriel Kruschewsky Mattos Vaz', 'Administrator', 'Inactive'], ['sofia.gallo', 'Chiara Mancini', 'Clinician', 'Inactive'], ['matteo.ferri', 'Cristiano Montanari', 'Technician', 'Active'], ['francesca.martini', 'Junior Delagore', 'Clinician', 'Active'], ['luca.russo', 'Larissa Oliveira Montanari', 'Clinician', 'Inactive'], ['chiara.conti', 'Laura Lombardi', 'Technician', 'Pending'],
] as const;

type SortKey = 0 | 1 | 2 | 3;
const pageSize = 5;

export default function UsersPage() {
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('All');
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState<{ key: SortKey; direction: SortDirection }>({ key: 0, direction: 'asc' });
  const [toast, setToast] = React.useState<string | null>(null);

  const filtered = users
    .filter((user) => `${user[0]} ${user[1]} ${user[2]}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All' || user[3] === status))
    .sort((a, b) => { const result = a[sort.key].localeCompare(b[sort.key], undefined, { numeric: true }); return sort.direction === 'asc' ? result : -result; });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const toggleSort = (key: SortKey) => { setSort((current) => current.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }); setPage(1); };
  const columns: [string, SortKey][] = [['Username', 0], ['Name', 1], ['Role', 2], ['Status', 3]];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Administration › Users</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-accent">Users</h1>
      </div>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Type to search..." className="bg-muted pl-9" />
            </div>
            <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
              <SelectTrigger aria-label="Filter by status" className="h-10 min-w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['All', 'Active', 'Pending', 'Inactive'].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setQuery(''); setStatus('All'); setPage(1); }}><Filter className="mr-2" />Clear</Button>
          </div>
          <Button asChild><Link href="/users/new"><Plus className="mr-2" />Add user</Link></Button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs text-muted-foreground">
                <tr>
                  {columns.map(([label, key]) => <th key={label} className="px-5 py-4"><SortableHeader label={label} active={sort.key === key} direction={sort.direction} onClick={() => toggleSort(key)} /></th>)}
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((user) => (
                  <tr key={user[0]} className="hover:bg-muted">
                    <td className="px-5 py-4 font-medium text-foreground">{user[0]}</td>
                    <td className="px-5 py-4 text-foreground">{user[1]}</td>
                    <td className="px-5 py-4 text-muted-foreground">{user[2]}</td>
                    <td className="px-5 py-4"><StatusBadge value={user[3]} /></td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <Button asChild size="icon" variant="ghost" aria-label={`Edit ${user[0]}`}><Link href={`/users/${user[0]}/edit`}><Pencil /></Link></Button>
                        <Button size="icon" variant="ghost" aria-label={`Remove ${user[0]}`} onClick={() => setToast(`${user[1]} removed from this mock list.`)} className="text-destructive hover:bg-destructive/10"><Trash2 /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visible.length && <p className="p-10 text-center text-sm text-muted-foreground">No users found.</p>}
          </div>
          <TablePagination page={page} pageCount={pageCount} total={filtered.length} pageSize={pageSize} onPageChange={setPage} />
        </CardContent>
      </Card>
      <PrototypeToast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const variant = value === 'Active' ? 'success' : value === 'Pending' ? 'neutral' : 'destructive';
  return <Badge variant={variant}>{value}</Badge>;
}
