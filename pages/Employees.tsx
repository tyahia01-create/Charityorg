import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Employee, Beneficiary } from '../types';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { EGYPT_GOVERNORATES } from '../constants';

type SortDirection = 'asc' | 'desc';
type EmployeeSortKey = keyof Employee;
interface SortConfig {
    key: EmployeeSortKey | null;
    direction: SortDirection;
}

interface EmployeesPageProps {
    employees: Employee[];
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
    beneficiaries: Beneficiary[];
    setBeneficiaries: React.Dispatch<React.SetStateAction<Beneficiary[]>>;
    updateEmployee: (employee: Employee, originalNationalId: string) => void;
}

const EmployeeForm: React.FC<{
    onSubmit: (employee: Employee) => void;
    onClose: () => void;
    employeeToEdit: Employee | null;
}> = ({ onSubmit, onClose, employeeToEdit }) => {
    const [formData, setFormData] = useState<Employee>(
        employeeToEdit || { name: '', national_id: '', phone: '', governorate: '', city: '', area: '', is_frozen: false }
    );
    const [cities, setCities] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ national_id?: string; phone?: string }>({});
    const inputClasses = "w-full p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white";

    const validate = (data: Employee) => {
        const newErrors: { national_id?: string; phone?: string } = {};
        if (data.national_id && !/^(2|3)\d{13}$/.test(data.national_id)) {
            newErrors.national_id = 'الرقم القومي يجب أن يكون 14 رقمًا ويبدأ بـ 2 أو 3.';
        }
        if (data.phone && !/^01[0125]\d{8}$/.test(data.phone)) {
            newErrors.phone = 'رقم المحمول يجب أن يكون 11 رقمًا ويبدأ بـ 010 أو 011 أو 012 أو 015.';
        }
        return newErrors;
    };

    useEffect(() => {
        const validationErrors = validate(formData);
        setErrors(validationErrors);
    }, [formData]);

    useEffect(() => {
        if (formData.governorate) {
            setCities(EGYPT_GOVERNORATES[formData.governorate] || []);
        } else {
            setCities([]);
        }
    }, [formData.governorate]);
    
    useEffect(() => {
        if(employeeToEdit) {
            setFormData(employeeToEdit);
            if (employeeToEdit.governorate) {
                setCities(EGYPT_GOVERNORATES[employeeToEdit.governorate] || []);
            }
        }
    }, [employeeToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'governorate') {
            setFormData(prev => ({ ...prev, governorate: value, city: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const isFormInvalid = useMemo(() => {
        if (!formData.name || !formData.national_id || !formData.phone || !formData.governorate || !formData.city || !formData.area) {
            return true;
        }
        return Object.values(errors).some(error => !!error);
    }, [formData, errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormInvalid) return;
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" required className={inputClasses}/>
            <div>
                <input type="text" name="national_id" value={formData.national_id} onChange={handleChange} placeholder="الرقم القومي" required className={inputClasses} disabled={!!employeeToEdit}/>
                {errors.national_id && formData.national_id && <p className="text-red-500 text-sm mt-1">{errors.national_id}</p>}
            </div>
            <div>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="رقم المحمول" required className={inputClasses}/>
                {errors.phone && formData.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            <select name="governorate" value={formData.governorate} onChange={handleChange} required className={inputClasses}>
                <option value="">اختر المحافظة</option>
                {Object.keys(EGYPT_GOVERNORATES).map(gov => <option key={gov} value={gov}>{gov}</option>)}
            </select>
            <select name="city" value={formData.city} onChange={handleChange} required className={inputClasses} disabled={!formData.governorate}>
                <option value="">اختر المركز</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="المنطقة" required className={inputClasses}/>
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
                <Button type="submit" variant="primary" disabled={isFormInvalid}>{employeeToEdit ? 'تعديل' : 'إضافة'}</Button>
            </div>
        </form>
    );
};

const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    
    return (
        <nav className="mt-6 flex justify-center items-center space-x-1 space-x-reverse">
            <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="secondary" className="px-3 py-1">
                <i className="fas fa-chevron-right"></i>
            </Button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentPage === number 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                >
                    {number}
                </button>
            ))}
            <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary" className="px-3 py-1">
                 <i className="fas fa-chevron-left"></i>
            </Button>
        </nav>
    );
};

const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    confirmButtonText: string;
    confirmButtonVariant?: 'danger' | 'primary' | 'secondary';
}> = ({ isOpen, onClose, onConfirm, title, message, confirmButtonText, confirmButtonVariant = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <p className="text-lg text-gray-700 dark:text-gray-300">{message}</p>
                <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        إلغاء
                    </Button>
                    <Button type="button" variant={confirmButtonVariant} onClick={onConfirm}>
                        {confirmButtonText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};


export const EmployeesPage: React.FC<EmployeesPageProps> = ({ employees, setEmployees, setBeneficiaries, updateEmployee }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [employeeToFreeze, setEmployeeToFreeze] = useState<{ national_id: string; freeze: boolean } | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
    const [selectedIds, setSelectedIds] = useState(new Set<string>());
    const headerCheckboxRef = useRef<HTMLInputElement>(null);
    const ITEMS_PER_PAGE = 10;

    const filteredEmployees = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
        const displayableEmployees = employees.filter(emp => emp.national_id !== 'VOLUNTEER');
        
        if (!lowercasedSearchTerm) {
            return displayableEmployees;
        }
        return displayableEmployees.filter(emp =>
            emp.name.toLowerCase().includes(lowercasedSearchTerm) ||
            emp.national_id.includes(lowercasedSearchTerm) ||
            emp.phone.includes(lowercasedSearchTerm)
        );
    }, [employees, searchTerm]);

    const sortedEmployees = useMemo(() => {
        let sortableItems = [...filteredEmployees];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key!];
                const valB = b[sortConfig.key!];
                
                let comparison = 0;
                if (valA > valB) {
                    comparison = 1;
                } else if (valA < valB) {
                    comparison = -1;
                }

                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [filteredEmployees, sortConfig]);

    const requestSort = (key: EmployeeSortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortDirectionIcon = (key: EmployeeSortKey) => {
         if (sortConfig.key !== key) {
            return 'fa-sort text-gray-500';
         }
         return sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    };


    useEffect(() => {
        setCurrentPage(1);
        setSelectedIds(new Set());
    }, [searchTerm, sortConfig]);

    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, sortedEmployees]);
    
     useEffect(() => {
        if (headerCheckboxRef.current) {
            const numSelected = paginatedEmployees.filter(emp => selectedIds.has(emp.national_id)).length;
            headerCheckboxRef.current.checked = numSelected === paginatedEmployees.length && paginatedEmployees.length > 0;
            headerCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < paginatedEmployees.length;
        }
    }, [selectedIds, paginatedEmployees]);


    const totalPages = Math.ceil(sortedEmployees.length / ITEMS_PER_PAGE);

    const handleAdd = (employee: Employee) => {
        if (employees.some(e => e.national_id === employee.national_id)) {
            alert('الرقم القومي موجود بالفعل!');
            return;
        }
        setEmployees(prev => [...prev, employee]);
        setIsModalOpen(false);
    };

    const handleEdit = (employee: Employee) => {
        if (employeeToEdit) {
            updateEmployee(employee, employeeToEdit.national_id);
            if(employee.governorate !== employeeToEdit.governorate || employee.city !== employeeToEdit.city) {
                 setBeneficiaries(prev => prev.map(ben => ben.employee_national_id === employee.national_id ? { ...ben, employee_national_id: employee.national_id } : ben));
            }
        }
        setIsModalOpen(false);
        setEmployeeToEdit(null);
    };

    const handleFreezeToggle = (national_id: string, freeze: boolean) => {
        setEmployeeToFreeze({ national_id, freeze });
        setIsConfirmModalOpen(true);
    };

    const confirmFreezeToggle = () => {
        if (employeeToFreeze) {
            if(employeeToFreeze.freeze) {
                setBeneficiaries(prev =>
                    prev.map(ben =>
                        ben.employee_national_id === employeeToFreeze.national_id
                            ? { ...ben, employee_national_id: 'VOLUNTEER' }
                            : ben
                    )
                );
            }
            setEmployees(prev => prev.map(emp => emp.national_id === employeeToFreeze.national_id ? { ...emp, is_frozen: employeeToFreeze.freeze } : emp));
            
            setIsConfirmModalOpen(false);
            setEmployeeToFreeze(null);
        }
    };
    
    const handleBulkFreeze = (freeze: boolean) => {
         if (window.confirm(`هل أنت متأكد من ${freeze ? 'تجميد' : 'فك تجميد'} ${selectedIds.size} موظف (موظفين)؟`)) {
            if(freeze) {
                setBeneficiaries(prev =>
                    prev.map(ben =>
                        selectedIds.has(ben.employee_national_id)
                            ? { ...ben, employee_national_id: 'VOLUNTEER' }
                            : ben
                    )
                );
            }
            setEmployees(prev => prev.map(emp => selectedIds.has(emp.national_id) ? { ...emp, is_frozen: freeze } : emp));
            setSelectedIds(new Set());
        }
    }

    const handleSelect = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(paginatedEmployees.map(emp => emp.national_id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const openEditModal = (employee: Employee) => {
        setEmployeeToEdit(employee);
        setIsModalOpen(true);
    };
    
    const ThSortable: React.FC<{ sortKey: EmployeeSortKey; label: string; }> = ({ sortKey, label }) => (
        <th className="p-3">
            <button onClick={() => requestSort(sortKey)} className="w-full flex items-center justify-end text-right font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none">
                <span>{label}</span>
                <i className={`fas ${getSortDirectionIcon(sortKey)} mr-2`}></i>
            </button>
        </th>
    );

    return (
        <div>
            <Header title="إدارة الموظفين" icon="fa-users-cog" />
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div className="w-full sm:w-1/3">
                    <input
                        type="text"
                        placeholder="ابحث بالاسم/الرقم القومي/المحمول..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-gray-700 rounded text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
                {selectedIds.size > 0 ? (
                    <div className="flex items-center gap-4 animate-fade-in-right">
                        <span className="text-lg">{selectedIds.size} تم تحديده</span>
                        <Button icon="fa-snowflake" variant='secondary' onClick={() => handleBulkFreeze(true)}>تجميد المحدد</Button>
                        <Button icon="fa-sun" variant='primary' onClick={() => handleBulkFreeze(false)}>فك تجميد المحدد</Button>
                    </div>
                ) : (
                    <Button icon="fa-plus" onClick={() => { setEmployeeToEdit(null); setIsModalOpen(true); }}>إضافة موظف جديد</Button>
                )}
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-3 text-center w-12">
                                <input type="checkbox" ref={headerCheckboxRef} onChange={handleSelectAll} className="form-checkbox h-5 w-5 text-emerald-600 bg-gray-100 border-gray-300 dark:bg-gray-900 dark:border-gray-600 rounded focus:ring-emerald-500 cursor-pointer" />
                            </th>
                            <ThSortable sortKey="name" label="الاسم" />
                            <ThSortable sortKey="national_id" label="الرقم القومي" />
                            <ThSortable sortKey="phone" label="المحمول" />
                            <ThSortable sortKey="governorate" label="المحافظة" />
                            <ThSortable sortKey="city" label="المركز" />
                            <ThSortable sortKey="area" label="المنطقة" />
                            <th className="p-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEmployees.map(emp => (
                            <tr key={emp.national_id} className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${selectedIds.has(emp.national_id) ? 'bg-emerald-50 dark:bg-emerald-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'} ${emp.is_frozen ? 'opacity-60' : ''}`}>
                                <td className="p-3 text-center">
                                    <input type="checkbox" checked={selectedIds.has(emp.national_id)} onChange={() => handleSelect(emp.national_id)} className="form-checkbox h-5 w-5 text-emerald-600 bg-gray-100 border-gray-300 dark:bg-gray-900 dark:border-gray-600 rounded focus:ring-emerald-500 cursor-pointer" />
                                </td>
                                <td className={`p-3 ${emp.is_frozen ? 'line-through' : ''}`}>{emp.name}</td>
                                <td className="p-3">{emp.national_id}</td>
                                <td className="p-3">{emp.phone}</td>
                                <td className="p-3">{emp.governorate}</td>
                                <td className="p-3">{emp.city}</td>
                                <td className="p-3">{emp.area}</td>
                                <td className="p-3 flex space-x-2 space-x-reverse">
                                    <Button variant="secondary" onClick={() => openEditModal(emp)}><i className="fas fa-edit"></i></Button>
                                    {emp.is_frozen ? (
                                        <Button variant="primary" onClick={() => handleFreezeToggle(emp.national_id, false)} title="فك تجميد"><i className="fas fa-sun"></i></Button>
                                    ) : (
                                        <Button variant="danger" onClick={() => handleFreezeToggle(emp.national_id, true)} title="تجميد"><i className="fas fa-snowflake"></i></Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sortedEmployees.length === 0 && (
                    <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                        لا توجد بيانات تطابق معايير البحث الحالية.
                    </div>
                )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={employeeToEdit ? 'تعديل موظف' : 'إضافة موظف جديد'}>
                <EmployeeForm onSubmit={employeeToEdit ? handleEdit : handleAdd} onClose={() => setIsModalOpen(false)} employeeToEdit={employeeToEdit} />
            </Modal>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmFreezeToggle}
                title={employeeToFreeze?.freeze ? "تأكيد تجميد الموظف" : "تأكيد فك تجميد الموظف"}
                message={
                    employeeToFreeze?.freeze ? (
                        <>
                            هل أنت متأكد من تجميد هذا الموظف؟
                            <br />
                            <span className="font-bold text-amber-500 dark:text-amber-400">سيتم إعادة تعيين المستفيدين المرتبطين به إلى "متطوع" تلقائيًا.</span>
                        </>
                    ) : "هل أنت متأكد من فك تجميد هذا الموظف؟"
                }
                confirmButtonText={employeeToFreeze?.freeze ? "تجميد" : "فك التجميد"}
                confirmButtonVariant={employeeToFreeze?.freeze ? "danger" : "primary"}
            />
        </div>
    );
};