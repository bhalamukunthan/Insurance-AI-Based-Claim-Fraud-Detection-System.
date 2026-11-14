import React, { useState, useMemo } from 'react';
import type { Transaction, TransactionStatus, RiskTier, FraudLabel } from '../types';
import {
  Search,
  Filter,
  Download,
  Sliders,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from '../components/icons';

interface TransactionsPageProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onRefresh: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  onSelectTransaction,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  
  // Sorting
  const [sortField, setSortField] = useState<keyof Transaction>('timestamp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  // Row selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Column visibility
  const [showColSettings, setShowColSettings] = useState(false);
  const [columns, setColumns] = useState({
    id: true,
    timestamp: true,
    customer: true,
    amount: true,
    merchant: true,
    method: true,
    ip: false,
    riskScore: true,
    riskTier: true,
    status: true,
  });

  // Filter & Sort
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.transaction_id.toLowerCase().includes(q) ||
        t.customer_name.toLowerCase().includes(q) ||
        t.merchant_name.toLowerCase().includes(q) ||
        t.ip_address.includes(q);

      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesRisk = riskFilter === 'All' || t.risk_tier === riskFilter;

      const minA = minAmount !== '' ? parseFloat(minAmount) : null;
      const maxA = maxAmount !== '' ? parseFloat(maxAmount) : null;

      const matchesMin = minA === null || isNaN(minA) || t.amount >= minA;
      const matchesMax = maxA === null || isNaN(maxA) || t.amount <= maxA;

      return matchesSearch && matchesStatus && matchesRisk && matchesMin && matchesMax;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        const cmp = (valA as string).localeCompare(valB as string);
        return sortAsc ? cmp : -cmp;
      }
      if (typeof valA === 'number') {
        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
      return 0;
    });
  }, [transactions, search, statusFilter, riskFilter, minAmount, maxAmount, sortField, sortAsc]);

  // Paginated slice
  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  // Handle Sort
  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((d) => d.id)));
    }
  };

  const toggleSelectRow = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Timestamp',
      'Customer',
      'Amount',
      'Currency',
      'Merchant',
      'Payment Method',
      'IP Address',
      'Risk Score',
      'Risk Tier',
      'Fraud Label',
      'Status'
    ];

    const rows = filteredTransactions.map((t) => [
      t.transaction_id,
      t.timestamp,
      `"${t.customer_name}"`,
      t.amount,
      t.currency,
      `"${t.merchant_name}"`,
      t.payment_method,
      t.ip_address,
      t.risk_score,
      t.risk_tier,
      t.fraud_label,
      t.status
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FraudGuard_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Badges
  const renderStatusBadge = (status: TransactionStatus) => {
    const styles: Record<TransactionStatus, string> = {
      Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      Flagged: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      Declined: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      'Under Review': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const renderRiskTierBadge = (tier: RiskTier) => {
    const styles: Record<RiskTier, string> = {
      'Low Risk': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Medium Risk': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'High Risk': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'Critical Risk': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${styles[tier]}`}>
        {tier}
      </span>
    );
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0b1222] to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers size={18} className="text-sky-400" />
            Advanced Transaction Intelligence Explorer
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Querying {transactions.length.toLocaleString()} audited financial transactions across enterprise rails
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download size={14} className="text-sky-400" />
            Export CSV ({filteredTransactions.length})
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Refresh Table Data"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by ID, Customer, Merchant, or IP..."
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Flagged">Flagged</option>
              <option value="Declined">Declined</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          {/* Risk Tier Filter */}
          <div className="lg:col-span-2">
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="All">All Risk Tiers</option>
              <option value="Low Risk">Low Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="High Risk">High Risk</option>
              <option value="Critical Risk">Critical Risk</option>
            </select>
          </div>

          {/* Amount Range Filter */}
          <div className="lg:col-span-2 flex items-center gap-1.5 font-mono">
            <input
              type="number"
              value={minAmount}
              onChange={(e) => {
                setMinAmount(e.target.value);
                setPage(1);
              }}
              placeholder="Min $"
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-2.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-xs"
            />
            <span className="text-slate-600">-</span>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => {
                setMaxAmount(e.target.value);
                setPage(1);
              }}
              placeholder="Max $"
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-2.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-xs"
            />
          </div>

          {/* Column Settings Toggle */}
          <div className="lg:col-span-2 relative flex justify-end">
            <button
              onClick={() => setShowColSettings(!showColSettings)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors font-mono"
            >
              <Sliders size={13} className="text-sky-400" />
              Columns
            </button>

            {showColSettings && (
              <div className="absolute right-0 top-11 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-30 space-y-2 text-xs">
                <div className="text-[10px] font-bold uppercase text-slate-400 font-mono pb-1 border-b border-slate-800">
                  Toggle Columns
                </div>
                {Object.entries(columns).map(([col, isVisible]) => (
                  <label key={col} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => setColumns({ ...columns, [col]: !isVisible })}
                      className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
                    />
                    <span className="capitalize">{col}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Batch Action Bar if rows selected */}
        {selectedIds.size > 0 && (
          <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between text-xs font-mono text-sky-300">
            <span>{selectedIds.size} transaction(s) selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-[#0b101d]/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.size > 0 && selectedIds.size === paginatedData.length}
                    onChange={toggleSelectAll}
                    className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
                  />
                </th>

                {columns.id && (
                  <th
                    className="p-3.5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('transaction_id')}
                  >
                    Tx ID
                  </th>
                )}

                {columns.timestamp && (
                  <th
                    className="p-3.5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('timestamp')}
                  >
                    Timestamp
                  </th>
                )}

                {columns.customer && (
                  <th
                    className="p-3.5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('customer_name')}
                  >
                    Customer
                  </th>
                )}

                {columns.amount && (
                  <th
                    className="p-3.5 cursor-pointer hover:text-white text-right"
                    onClick={() => handleSort('amount')}
                  >
                    Amount (USD)
                  </th>
                )}

                {columns.merchant && (
                  <th
                    className="p-3.5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('merchant_name')}
                  >
                    Merchant
                  </th>
                )}

                {columns.method && <th className="p-3.5">Method</th>}

                {columns.ip && <th className="p-3.5">IP Address</th>}

                {columns.riskScore && (
                  <th
                    className="p-3.5 cursor-pointer hover:text-white text-center"
                    onClick={() => handleSort('risk_score')}
                  >
                    Risk Score
                  </th>
                )}

                {columns.riskTier && <th className="p-3.5 text-center">Risk Tier</th>}

                {columns.status && <th className="p-3.5 text-center">Status</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-mono">
              {paginatedData.length > 0 ? (
                paginatedData.map((tx) => {
                  const isSelected = selectedIds.has(tx.id);
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => onSelectTransaction(tx)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-500/10' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(tx.id)}
                          className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
                        />
                      </td>

                      {columns.id && (
                        <td className="p-3.5 font-bold text-sky-400 truncate max-w-[150px]">
                          {tx.transaction_id}
                        </td>
                      )}

                      {columns.timestamp && (
                        <td className="p-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                          {new Date(tx.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      )}

                      {columns.customer && (
                        <td className="p-3.5 text-slate-200 font-sans font-medium truncate max-w-[160px]">
                          {tx.customer_name}
                        </td>
                      )}

                      {columns.amount && (
                        <td className="p-3.5 text-right font-extrabold text-white">
                          ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      )}

                      {columns.merchant && (
                        <td className="p-3.5 text-slate-300 font-sans truncate max-w-[150px]">
                          {tx.merchant_name}
                        </td>
                      )}

                      {columns.method && (
                        <td className="p-3.5 text-slate-400 text-[11px]">{tx.payment_method}</td>
                      )}

                      {columns.ip && (
                        <td className="p-3.5 text-slate-400 text-[11px]">{tx.ip_address}</td>
                      )}

                      {columns.riskScore && (
                        <td className="p-3.5 text-center">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              tx.risk_score >= 75
                                ? 'text-rose-400 bg-rose-500/10'
                                : tx.risk_score >= 50
                                ? 'text-orange-400 bg-orange-500/10'
                                : tx.risk_score >= 30
                                ? 'text-amber-400 bg-amber-500/10'
                                : 'text-emerald-400 bg-emerald-500/10'
                            }`}
                          >
                            {tx.risk_score.toFixed(1)}
                          </span>
                        </td>
                      )}

                      {columns.riskTier && (
                        <td className="p-3.5 text-center">{renderRiskTierBadge(tx.risk_tier)}</td>
                      )}

                      {columns.status && (
                        <td className="p-3.5 text-center">{renderStatusBadge(tx.status)}</td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-500 font-mono">
                    No transactions matched your search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div>
            Showing {(page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, filteredTransactions.length)} of{' '}
            {filteredTransactions.length.toLocaleString()} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-3 py-1 font-bold text-white">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
