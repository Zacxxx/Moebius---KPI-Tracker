

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { PlusCircleIcon, Trash2Icon, ArrowUpDownIcon, ChevronUpIcon, ChevronDownIcon } from './Icons';
import { Input } from './ui/Input';
import { EURO } from '../utils';
import type { ColumnDef } from '../types';

interface DataTableProps<T extends { id: number }> {
  columns: ColumnDef<T>[];
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  newRowData: Omit<T, 'id'>;
  isReadOnly?: boolean;
}

export function DataTable<T extends { id: number }>({ columns, data, setData, newRowData, isReadOnly = false }: DataTableProps<T>) {
  const [editingCell, setEditingCell] = useState<{ rowId: number; columnKey: keyof T } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T, direction: 'asc' | 'desc' } | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data];
    if (filter) {
      const lowercasedFilter = filter.toLowerCase();
      result = result.filter(row => 
        columns.some(col => String(row[col.accessorKey]).toLowerCase().includes(lowercasedFilter))
      );
    }
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, filter, sortConfig, columns]);

  useEffect(() => {
    if (editingCell) {
      inputRef.current?.focus();
      selectRef.current?.focus();
    }
  }, [editingCell]);

  const handleCellClick = (rowId: number, columnKey: keyof T, value: any) => {
    if (isReadOnly) return;
    setEditingCell({ rowId, columnKey });
    setEditValue(String(value));
  };

  const handleUpdate = () => {
    if (!editingCell) return;
    const { rowId, columnKey } = editingCell;
    const column = columns.find(c => c.accessorKey === columnKey);
    let finalValue: any = editValue;
    if (column?.cellType === 'number' || column?.cellType === 'currency') {
        finalValue = Number(editValue) || 0;
    }

    setData(prev => prev.map(row => row.id === rowId ? { ...row, [columnKey]: finalValue } : row));
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };
  
  const handleAddRow = () => {
      if (isReadOnly) return;
      const newEntry = { id: Date.now(), ...newRowData } as T;
      setData(prev => [...prev, newEntry]);
  }

  const handleDeleteRow = (idToDelete: number) => {
      if (isReadOnly) return;
      setData(prev => prev.filter(row => row.id !== idToDelete));
  }

  const requestSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof T) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDownIcon className="h-4 w-4 ml-2 text-zinc-500" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ChevronUpIcon className="h-4 w-4 ml-2 text-zinc-200" />;
    }
    return <ChevronDownIcon className="h-4 w-4 ml-2 text-zinc-200" />;
  };
  
  const renderCellContent = (row: T, column: ColumnDef<T>) => {
    const value = row[column.accessorKey];
    if (!isReadOnly && editingCell?.rowId === row.id && editingCell?.columnKey === column.accessorKey) {
      if (column.cellType === 'badge' && column.badgeOptions) {
        return (
          <select
            ref={selectRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
            className="w-full bg-zinc-700 border-violet-500 rounded-md text-sm p-1 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {Object.keys(column.badgeOptions).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      }
      return (
        <Input
          ref={inputRef}
          type={column.cellType === 'number' || column.cellType === 'currency' ? 'number' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={handleKeyDown}
          className="h-8 text-sm"
        />
      );
    }

    if (column.cellType === 'badge' && column.badgeOptions) {
      const variant = column.badgeOptions[value as string] || 'default';
      return <Badge variant={variant}>{String(value)}</Badge>;
    }
    
    if (column.cellType === 'currency') {
        return EURO.format(value as number);
    }

    return String(value);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 flex-shrink-0">
            <Input 
              placeholder="Filter data..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="max-w-sm"
            />
        </div>
        <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 sticky top-0">
                    <tr>
                        {columns.map(col => (
                            <th key={String(col.accessorKey)} scope="col" className="px-6 py-3">
                                <button onClick={() => requestSort(col.accessorKey)} className="flex items-center hover:text-zinc-100 transition-colors">
                                    {col.header}
                                    {getSortIcon(col.accessorKey)}
                                </button>
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {sortedAndFilteredData.map((row) => (
                        <tr key={row.id} className="hover:bg-zinc-800/40 group">
                            {columns.map(col => (
                                <td 
                                    key={String(col.accessorKey)} 
                                    className={`px-6 py-2 text-zinc-300 ${!isReadOnly ? 'cursor-cell' : ''}`}
                                    onClick={() => handleCellClick(row.id, col.accessorKey, row[col.accessorKey])}
                                >
                                    {renderCellContent(row, col)}
                                </td>
                            ))}
                            <td className="px-6 py-2 text-right">
                            {!isReadOnly && (
                                <button onClick={() => handleDeleteRow(row.id)} className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Delete row">
                                <Trash2Icon className="h-4 w-4" />
                            </button>
                            )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {!isReadOnly && (
            <div className="p-4 border-t border-zinc-700/50 flex-shrink-0">
                <Button variant="secondary" onClick={handleAddRow}>
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add Row
                </Button>
            </div>
        )}
    </div>
  );
}