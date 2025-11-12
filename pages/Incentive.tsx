import React, { useState, useMemo } from 'react';
import type { Employee, Beneficiary } from '../types';
import { Header } from '../components/Header';
import { Button } from '../components/Button';

interface IncentivePageProps {
    employees: Employee[];
    beneficiaries: Beneficiary[];
}

export const IncentivePage: React.FC<IncentivePageProps> = ({ employees, beneficiaries }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const [searchResults, setSearchResults] = useState<Beneficiary[]>([]);
    const [beneficiaryTypes, setBeneficiaryTypes] = useState<Map<string, 'داخلي' | 'خارجي'>>(new Map());
    const [currentSearchCriteria, setCurrentSearchCriteria] = useState<{ employeeId: string; start: string; end: string } | null>(null);

    const availableEmployees = useMemo(() => {
        return employees.filter(emp => emp.national_id !== 'VOLUNTEER');
    }, [employees]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployeeId || !startDate || !endDate) {
            alert('يرجى اختيار الموظف وتحديد فترة زمنية.');
            return;
        }

        const filtered = beneficiaries.filter(b => 
            b.employee_national_id === selectedEmployeeId &&
            b.research_submission_date &&
            b.research_submission_date >= startDate &&
            b.research_submission_date <= endDate
        );

        setSearchResults(filtered);
        setBeneficiaryTypes(new Map()); // Reset types on new search
        setCurrentSearchCriteria({ employeeId: selectedEmployeeId, start: startDate, end: endDate });
    };

    const handleTypeChange = (beneficiaryId: string, type: 'داخلي' | 'خارجي') => {
        setBeneficiaryTypes(prevMap => {
            const newMap = new Map(prevMap);
            newMap.set(beneficiaryId, type);
            return newMap;
        });
    };

    const summary = useMemo(() => {
        if (!currentSearchCriteria) return null;

        const counts = { 'داخلي': 0, 'خارجي': 0 };
        for (const type of beneficiaryTypes.values()) {
            counts[type]++;
        }

        const selectedEmployee = employees.find(e => e.national_id === currentSearchCriteria.employeeId);

        return {
            employeeName: selectedEmployee?.name || 'غير معروف',
            period: `من ${currentSearchCriteria.start} إلى ${currentSearchCriteria.end}`,
            internalCount: counts['داخلي'],
            externalCount: counts['خارجي'],
            total: searchResults.length,
        };
    }, [beneficiaryTypes, searchResults, currentSearchCriteria, employees]);

    return (
        <div>
            <Header title="شاشة الحافز" icon="fa-award" />

            <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-8">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="employee" className="block text-sm font-medium text-gray-300 mb-1">اختر الموظف</label>
                        <select
                            id="employee"
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            className="w-full p-2 bg-gray-700 rounded text-white"
                            required
                        >
                            <option value="">-- اختر باحث --</option>
                            {availableEmployees.map(emp => <option key={emp.national_id} value={emp.national_id}>{emp.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">من تاريخ</label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 bg-gray-700 rounded text-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">إلى تاريخ</label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 bg-gray-700 rounded text-white"
                            required
                        />
                    </div>
                    <Button type="submit" icon="fa-search">
                        بحث
                    </Button>
                </form>
            </div>

            {currentSearchCriteria && (
                <div className="bg-gray-800 shadow-lg rounded-lg overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-3">اسم المستفيد</th>
                                <th className="p-3">المركز</th>
                                <th className="p-3">المحافظة</th>
                                <th className="p-3 text-center">النوع (داخلي / خارجي)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.length > 0 ? searchResults.map(ben => (
                                <tr key={ben.national_id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-3">{ben.name}</td>
                                    <td className="p-3">{ben.city}</td>
                                    <td className="p-3">{ben.governorate}</td>
                                    <td className="p-3">
                                        <div className="flex justify-center items-center gap-x-4">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`type-${ben.national_id}`}
                                                    className="form-radio h-5 w-5 text-emerald-500 bg-gray-900 border-gray-600 focus:ring-emerald-500"
                                                    onChange={() => handleTypeChange(ben.national_id, 'داخلي')}
                                                />
                                                <span className="mr-2 text-gray-200">داخلي</span>
                                            </label>
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`type-${ben.national_id}`}
                                                    className="form-radio h-5 w-5 text-amber-500 bg-gray-900 border-gray-600 focus:ring-amber-500"
                                                    onChange={() => handleTypeChange(ben.national_id, 'خارجي')}
                                                />
                                                <span className="mr-2 text-gray-200">خارجي</span>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-6 text-gray-400">
                                        لا توجد أبحاث مسلمة لهذا الباحث في الفترة المحددة.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
            {summary && (
                <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
                    <h3 className="text-2xl font-bold mb-4 text-emerald-400">ملخص النتائج</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                         <div className="bg-gray-700 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">اسم الباحث</p>
                            <p className="text-xl font-bold text-white">{summary.employeeName}</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">الفترة الزمنية</p>
                            <p className="text-xl font-bold text-white">{summary.period}</p>
                        </div>
                        <div className="bg-emerald-900/50 p-4 rounded-lg">
                            <p className="text-sm text-emerald-300">عدد المستفيدين (داخل)</p>
                            <p className="text-3xl font-bold text-white">{summary.internalCount}</p>
                        </div>
                        <div className="bg-amber-900/50 p-4 rounded-lg">
                            <p className="text-sm text-amber-300">عدد المستفيدين (خارج)</p>
                            <p className="text-3xl font-bold text-white">{summary.externalCount}</p>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-lg text-gray-300">
                        <strong>إجمالي الأبحاث المسلمة: {summary.total}</strong>
                    </div>
                </div>
            )}
        </div>
    );
};
