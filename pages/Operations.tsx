import React, { useState, useMemo, useEffect, useRef } from 'react';
<<<<<<< HEAD
import type { Operation, Beneficiary, AssistanceType, OperationStatus } from '../types';
=======
import type { Operation, Beneficiary, AssistanceType, OperationStatus, Employee } from '../types';
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FileProviderModal } from '../components/FileProviderModal';

declare const XLSX: any;

type SortDirection = 'asc' | 'desc';
type OperationSortKey = keyof Operation | 'beneficiaryName';
interface SortConfig {
    key: OperationSortKey | null;
    direction: SortDirection;
}

interface OperationsPageProps {
    operations: Operation[];
    setOperations: React.Dispatch<React.SetStateAction<Operation[]>>;
    beneficiaries: Beneficiary[];
    assistanceTypes: AssistanceType[];
<<<<<<< HEAD
=======
    employees: Employee[];
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
    showToast: (message: string, type?: 'success' | 'info', copyText?: string) => void;
}

const getInitialFormData = (operationToEdit: Operation | null = null) => {
    const defaults = {
        beneficiary_national_id: '',
        assistance_id: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        committee_number: '',
        committee_decision_description: '',
        spending_entity: '',
        details: '',
        status: 'معلقة' as OperationStatus,
        acceptance_date: '',
        pending_date: '',
        disbursement_status: undefined,
        disbursement_date: '',
<<<<<<< HEAD
=======
        employee_national_id: '',
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
    };
    if (operationToEdit) {
        const { code, id, ...editableData } = operationToEdit;
        return {
            ...defaults,
            ...editableData,
            assistance_id: String(operationToEdit.assistance_id),
        };
    }
    return defaults;
};


const OperationForm: React.FC<{
    onSubmit: (operation: Omit<Operation, 'id' | 'code'>) => void;
    onClose: () => void;
    operationToEdit: Operation | null;
    beneficiaries: Beneficiary[];
    assistanceTypes: AssistanceType[];
<<<<<<< HEAD
}> = ({ onSubmit, onClose, operationToEdit, beneficiaries, assistanceTypes }) => {
    const [formData, setFormData] = useState(getInitialFormData(operationToEdit));
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [beneficiaryError, setBeneficiaryError] = useState('');
    
    const inputClasses = "w-full p-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

=======
    employees: Employee[];
}> = ({ onSubmit, onClose, operationToEdit, beneficiaries, assistanceTypes, employees }) => {
    const [formData, setFormData] = useState(getInitialFormData(operationToEdit));
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [beneficiaryError, setBeneficiaryError] = useState('');
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f

    useEffect(() => {
        if (formData.beneficiary_national_id) {
            const beneficiary = beneficiaries.find(b => b.national_id === formData.beneficiary_national_id);
<<<<<<< HEAD
            if (beneficiary) setBeneficiaryName(beneficiary.name);
        }
    }, [formData.beneficiary_national_id, beneficiaries]);
=======
            if (beneficiary) {
                setBeneficiaryName(beneficiary.name);
                 if (beneficiary.is_blacklisted) {
                    setBeneficiaryError('هذا المستفيد محظور ولا يمكن إضافة عمليات له.');
                    setFormData(prev => ({ ...prev, employee_national_id: '' }));
                    return;
                }
                setBeneficiaryError('');

                const matchingEmployees = employees.filter(emp => 
                    !emp.is_frozen && emp.governorate === beneficiary.governorate && emp.city === beneficiary.city
                );

                if (matchingEmployees.length === 1) {
                    setFormData(prev => ({...prev, employee_national_id: matchingEmployees[0].national_id}));
                } else {
                     setFormData(prev => ({...prev, employee_national_id: 'VOLUNTEER'}));
                }

            } else {
                setBeneficiaryName('');
                setBeneficiaryError(formData.beneficiary_national_id.trim() ? 'الرقم القومي للمستفيد غير موجود.' : '');
                setFormData(prev => ({ ...prev, employee_national_id: '' }));
            }
        }
    }, [formData.beneficiary_national_id, beneficiaries, employees]);
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let updatedFormData = { ...formData, [name]: value };
<<<<<<< HEAD

        if (name === 'beneficiary_national_id') {
            const foundBeneficiary = beneficiaries.find(b => b.national_id === value);
            if (foundBeneficiary) {
                setBeneficiaryName(foundBeneficiary.name);
                if (foundBeneficiary.is_blacklisted) {
                    setBeneficiaryError('هذا المستفيد محظور ولا يمكن إضافة عمليات له.');
                } else {
                    setBeneficiaryError('');
                }
            } else {
                setBeneficiaryName('');
                setBeneficiaryError(value.trim() ? 'الرقم القومي للمستفيد غير موجود.' : '');
            }
        }
=======
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
        
        if (name === 'status') {
             updatedFormData = {
                ...updatedFormData,
                acceptance_date: '',
                pending_date: '',
                disbursement_status: undefined,
                disbursement_date: '',
            };
        }
        
        setFormData(updatedFormData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const foundBeneficiary = beneficiaries.find(b => b.national_id === formData.beneficiary_national_id);
        if (!foundBeneficiary) {
            setBeneficiaryError('الرقم القومي للمستفيد غير موجود أو غير صحيح.');
            return;
        }
        if (foundBeneficiary.is_blacklisted) {
            setBeneficiaryError('هذا المستفيد محظور ولا يمكن إضافة عمليات له.');
            return;
        }
        
        const data: Omit<Operation, 'id' | 'code'> = {
            beneficiary_national_id: formData.beneficiary_national_id,
            assistance_id: parseInt(String(formData.assistance_id), 10),
            amount: Number(formData.amount),
            date: formData.date,
            committee_number: formData.committee_number,
            committee_decision_description: formData.committee_decision_description,
            spending_entity: formData.spending_entity,
            details: formData.details,
            status: formData.status,
            acceptance_date: formData.status === 'مقبوله' ? formData.acceptance_date : undefined,
            pending_date: formData.status === 'معلقة' ? formData.pending_date : undefined,
            disbursement_status: formData.status === 'مقبوله' ? formData.disbursement_status : undefined,
            disbursement_date: formData.status === 'مقبوله' && formData.disbursement_status ? formData.disbursement_date : undefined,
<<<<<<< HEAD
=======
            employee_national_id: formData.employee_national_id,
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
        };
        onSubmit(data);
    };

    const isFormInvalid = useMemo(() => {
        if (beneficiaryError) return true;
        
        const foundBeneficiary = beneficiaries.find(b => b.national_id === formData.beneficiary_national_id);
<<<<<<< HEAD
        if (!foundBeneficiary || !formData.beneficiary_national_id || !formData.assistance_id || formData.amount <= 0 || !formData.date || !formData.spending_entity || !formData.status) {
=======
        if (!foundBeneficiary || !formData.beneficiary_national_id || !formData.assistance_id || formData.amount <= 0 || !formData.date || !formData.spending_entity || !formData.status || !formData.employee_national_id) {
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
            return true;
        }
        if (formData.status === 'مقبوله' && !formData.acceptance_date) {
            return true;
        }
        if (formData.status === 'معلقة' && !formData.pending_date) {
            return true;
        }
        if(formData.disbursement_status && !formData.disbursement_date) {
            return true;
        }
        return false;
    }, [formData, beneficiaries, beneficiaryError]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
<<<<<<< HEAD
                    <label htmlFor="beneficiary_national_id" className={labelClasses}>الرقم القومي للمستفيد</label>
                    <input id="beneficiary_national_id" type="text" name="beneficiary_national_id" value={formData.beneficiary_national_id} onChange={handleChange} placeholder="أدخل 14 رقمًا" required className={inputClasses} disabled={!!operationToEdit}/>
                    {beneficiaryError && <p className="text-red-500 text-sm mt-1">{beneficiaryError}</p>}
                    {beneficiaryName && !beneficiaryError && <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1">اسم المستفيد: {beneficiaryName}</p>}
                </div>
                <div>
                    <label htmlFor="assistance_id" className={labelClasses}>نوع المساعدة</label>
                    <select id="assistance_id" name="assistance_id" value={formData.assistance_id} onChange={handleChange} required className={inputClasses}>
=======
                    <label htmlFor="beneficiary_national_id" className="block text-sm font-medium text-gray-300 mb-1">الرقم القومي للمستفيد</label>
                    <input id="beneficiary_national_id" type="text" name="beneficiary_national_id" value={formData.beneficiary_national_id} onChange={handleChange} placeholder="أدخل 14 رقمًا" required className="w-full p-2 bg-gray-700 rounded" disabled={!!operationToEdit}/>
                    {beneficiaryError && <p className="text-red-500 text-sm mt-1">{beneficiaryError}</p>}
                    {beneficiaryName && !beneficiaryError && <p className="text-emerald-400 text-sm mt-1">اسم المستفيد: {beneficiaryName}</p>}
                </div>
                <div>
                    <label htmlFor="assistance_id" className="block text-sm font-medium text-gray-300 mb-1">نوع المساعدة</label>
                    <select id="assistance_id" name="assistance_id" value={formData.assistance_id} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded">
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                        <option value="">اختر نوع المساعدة</option>
                        {assistanceTypes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>
                <div>
<<<<<<< HEAD
                    <label htmlFor="amount" className={labelClasses}>قيمة المساعدة</label>
                    <input id="amount" type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="قيمة المساعدة" required className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="spending_entity" className={labelClasses}>جهة الإنفاق</label>
                    <input id="spending_entity" type="text" name="spending_entity" value={formData.spending_entity} onChange={handleChange} placeholder="جهة الإنفاق" required className={inputClasses}/>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="date" className={labelClasses}>تاريخ تقديم الطلب</label>
                    <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required className={inputClasses}/>
                </div>
            </div>
            
            <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 mt-4">
                <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400">تفاصيل قرار اللجنة وحالة الطلب</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="committee_number" className={labelClasses}>رقم اللجنة</label>
                        <input id="committee_number" type="text" name="committee_number" value={formData.committee_number || ''} onChange={handleChange} placeholder="رقم اللجنة" className={inputClasses}/>
                    </div>
                     <div>
                        <label htmlFor="status" className={labelClasses}>حالة العملية</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} required className={inputClasses}>
=======
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">قيمة المساعدة</label>
                    <input id="amount" type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="قيمة المساعدة" required className="w-full p-2 bg-gray-700 rounded"/>
                </div>
                <div>
                    <label htmlFor="spending_entity" className="block text-sm font-medium text-gray-300 mb-1">جهة الإنفاق</label>
                    <input id="spending_entity" type="text" name="spending_entity" value={formData.spending_entity} onChange={handleChange} placeholder="جهة الإنفاق" required className="w-full p-2 bg-gray-700 rounded"/>
                </div>
                <div>
                     <label htmlFor="employee_national_id" className="block text-sm font-medium text-gray-300 mb-1">الموظف المسؤول</label>
                    <select 
                        id="employee_national_id" 
                        name="employee_national_id" 
                        value={formData.employee_national_id} 
                        onChange={handleChange} 
                        required 
                        className="w-full p-2 bg-gray-700 rounded"
                        disabled={!formData.beneficiary_national_id || !!beneficiaryError}
                    >
                        <option value="">
                            {!formData.beneficiary_national_id || beneficiaryError ? 'اختر المستفيد أولاً' : 'اختر الموظف'}
                        </option>
                        {employees.filter(emp => !emp.is_frozen).map(emp => (
                            <option key={emp.national_id} value={emp.national_id}>{emp.name}</option>
                        ))}
                        <option value="VOLUNTEER">متطوع</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">تاريخ تقديم الطلب</label>
                    <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded"/>
                </div>
            </div>
            
            <div className="space-y-4 p-4 border border-gray-600 rounded-lg bg-gray-900/50 mt-4">
                <h3 className="text-lg font-semibold text-amber-400">تفاصيل قرار اللجنة وحالة الطلب</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="committee_number" className="block text-sm font-medium text-gray-300 mb-1">رقم اللجنة</label>
                        <input id="committee_number" type="text" name="committee_number" value={formData.committee_number || ''} onChange={handleChange} placeholder="رقم اللجنة" className="w-full p-2 bg-gray-700 rounded"/>
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">حالة العملية</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded">
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                            <option value="معلقة">معلقة</option>
                            <option value="مقبوله">مقبوله</option>
                            <option value="مرفوضه">مرفوضه</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
<<<<<<< HEAD
                        <label htmlFor="committee_decision_description" className={labelClasses}>وصف قرار اللجنة</label>
                        <textarea id="committee_decision_description" name="committee_decision_description" value={formData.committee_decision_description || ''} onChange={handleChange} placeholder="اكتب وصفًا موجزًا لقرار اللجنة..." className={inputClasses} rows={2}></textarea>
=======
                        <label htmlFor="committee_decision_description" className="block text-sm font-medium text-gray-300 mb-1">وصف قرار اللجنة</label>
                        <textarea id="committee_decision_description" name="committee_decision_description" value={formData.committee_decision_description || ''} onChange={handleChange} placeholder="اكتب وصفًا موجزًا لقرار اللجنة..." className="w-full p-2 bg-gray-700 rounded" rows={2}></textarea>
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                    </div>
                </div>

                {formData.status === 'معلقة' && (
                    <div className="animate-fade-in-right">
<<<<<<< HEAD
                        <label htmlFor="pending_date" className={labelClasses}>تاريخ التعليق</label>
                        <input id="pending_date" type="date" name="pending_date" value={formData.pending_date || ''} onChange={handleChange} required className={inputClasses}/>
=======
                        <label htmlFor="pending_date" className="block text-sm font-medium text-gray-300 mb-1">تاريخ التعليق</label>
                        <input id="pending_date" type="date" name="pending_date" value={formData.pending_date || ''} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded"/>
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                    </div>
                )}
                
                {formData.status === 'مقبوله' && (
<<<<<<< HEAD
                    <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2 animate-fade-in-right">
                        <h4 className="text-md font-semibold text-emerald-600 dark:text-emerald-400">تفاصيل القبول والصرف</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="acceptance_date" className={labelClasses}>تاريخ القبول</label>
                                <input id="acceptance_date" type="date" name="acceptance_date" value={formData.acceptance_date} onChange={handleChange} required className={inputClasses}/>
                            </div>
                            <div>
                                <label htmlFor="disbursement_status" className={labelClasses}>حالة الصرف</label>
                                <select id="disbursement_status" name="disbursement_status" value={formData.disbursement_status || ''} onChange={handleChange} className={inputClasses}>
=======
                    <div className="space-y-4 pt-2 border-t border-gray-700 mt-2 animate-fade-in-right">
                        <h4 className="text-md font-semibold text-emerald-400">تفاصيل القبول والصرف</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="acceptance_date" className="block text-sm font-medium text-gray-300 mb-1">تاريخ القبول</label>
                                <input id="acceptance_date" type="date" name="acceptance_date" value={formData.acceptance_date} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded"/>
                            </div>
                            <div>
                                <label htmlFor="disbursement_status" className="block text-sm font-medium text-gray-300 mb-1">حالة الصرف</label>
                                <select id="disbursement_status" name="disbursement_status" value={formData.disbursement_status || ''} onChange={handleChange} className="w-full p-2 bg-gray-700 rounded">
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                                    <option value="">اختر حالة الصرف (اختياري)</option>
                                    <option value="جاري التنفيذ">جاري التنفيذ</option>
                                    <option value="تم الصرف">تم الصرف</option>
                                </select>
                            </div>
                            {formData.disbursement_status && (
                                <div>
<<<<<<< HEAD
                                    <label htmlFor="disbursement_date" className={labelClasses}>تاريخ الصرف</label>
                                    <input id="disbursement_date" type="date" name="disbursement_date" value={formData.disbursement_date} onChange={handleChange} required className={inputClasses}/>
=======
                                    <label htmlFor="disbursement_date" className="block text-sm font-medium text-gray-300 mb-1">تاريخ الصرف</label>
                                    <input id="disbursement_date" type="date" name="disbursement_date" value={formData.disbursement_date} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded"/>
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="md:col-span-2">
<<<<<<< HEAD
                <label htmlFor="details" className={labelClasses}>تفاصيل إضافية (اختياري)</label>
                <textarea id="details" name="details" value={formData.details || ''} onChange={handleChange} placeholder="تفاصيل إضافية عن الطلب" className={inputClasses} rows={3}></textarea>
=======
                <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-1">تفاصيل إضافية (اختياري)</label>
                <textarea id="details" name="details" value={formData.details || ''} onChange={handleChange} placeholder="تفاصيل إضافية عن الطلب" className="w-full p-2 bg-gray-700 rounded" rows={3}></textarea>
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
            </div>
            
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
                <Button type="submit" variant="primary" disabled={isFormInvalid}>{operationToEdit ? 'تعديل' : 'إضافة'}</Button>
            </div>
        </form>
    );
};

const OperationDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    operation: Operation | null;
    beneficiary?: Beneficiary;
    assistanceType?: AssistanceType;
<<<<<<< HEAD
}> = ({ isOpen, onClose, operation, beneficiary, assistanceType }) => {
=======
    employees: Employee[];
}> = ({ isOpen, onClose, operation, beneficiary, assistanceType, employees }) => {
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
    if (!isOpen || !operation) return null;

    const handlePrint = () => {
        window.print();
    };
    
    const statusClasses = {
        'مقبوله': 'bg-emerald-500 text-white',
        'مرفوضه': 'bg-red-500 text-white',
        'معلقة': 'bg-amber-500 text-white',
    };
    
<<<<<<< HEAD
=======
    const employee = employees.find(e => e.national_id === operation.employee_national_id);
    const employeeName = employee ? employee.name : (operation.employee_national_id === 'VOLUNTEER' ? 'متطوع' : 'غير محدد');

>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`تفاصيل العملية #${operation.code}`}>
            <div id="printable-operation-details">
                {/* Print Header */}
                <div className="hidden print:block text-center mb-8">
                    <h1 className="text-3xl font-bold text-black">بيان مساعدة</h1>
                    <p className="text-lg text-gray-600">مؤسسة الجارحي للتنمية المجتمعيه</p>
                    <hr className="my-4 border-gray-400"/>
                </div>

                <div className="space-y-4">
                    {/* Beneficiary Info */}
<<<<<<< HEAD
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg print:border print:border-gray-300 print:bg-white">
                        <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2 print:text-black print:border-b print:border-black">بيانات المستفيد</h3>
                        <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 print:text-black">
=======
                    <div className="p-4 bg-gray-700/50 rounded-lg print:border print:border-gray-300 print:bg-white">
                        <h3 className="text-xl font-bold text-emerald-400 mb-2 print:text-black print:border-b print:border-black">بيانات المستفيد</h3>
                        <div className="grid grid-cols-2 gap-2 text-gray-300 print:text-black">
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                            <p><strong>كود العملية:</strong> {operation.code}</p>
                            <p><strong>الاسم:</strong> {beneficiary?.name || 'غير متوفر'}</p>
                            <p><strong>الرقم القومي:</strong> {operation.beneficiary_national_id}</p>
                            <p><strong>المحمول:</strong> {beneficiary?.phone || 'غير متوفر'}</p>
                        </div>
                    </div>

                    {/* Assistance Info */}
<<<<<<< HEAD
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg print:border print:border-gray-300 print:bg-white">
                        <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2 print:text-black print:border-b print:border-black">تفاصيل المساعدة</h3>
                        <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 print:text-black">
=======
                    <div className="p-4 bg-gray-700/50 rounded-lg print:border print:border-gray-300 print:bg-white">
                        <h3 className="text-xl font-bold text-emerald-400 mb-2 print:text-black print:border-b print:border-black">تفاصيل المساعدة</h3>
                        <div className="grid grid-cols-2 gap-2 text-gray-300 print:text-black">
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                            <p><strong>نوع المساعدة:</strong> {assistanceType?.name || 'غير متوفر'}</p>
                            <p><strong>القيمة:</strong> {operation.amount.toLocaleString('ar-EG')} جنيه</p>
                            <p><strong>تاريخ تقديم الطلب:</strong> {operation.date}</p>
                            <p><strong>جهة الإنفاق:</strong> {operation.spending_entity}</p>
<<<<<<< HEAD
=======
                            <p><strong>الموظف المسؤول:</strong> {employeeName}</p>
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                            <p className="col-span-2"><strong>تفاصيل الطلب:</strong> {operation.details || 'لا يوجد'}</p>
                        </div>
                    </div>

                    {/* Status Info */}
<<<<<<< HEAD
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg print:border print:border-gray-300 print:bg-white">
                         <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2 print:text-black print:border-b print:border-black">حالة وقرار اللجنة</h3>
                         <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 print:text-black items-start">
=======
                    <div className="p-4 bg-gray-700/50 rounded-lg print:border print:border-gray-300 print:bg-white">
                         <h3 className="text-xl font-bold text-emerald-400 mb-2 print:text-black print:border-b print:border-black">حالة وقرار اللجنة</h3>
                         <div className="grid grid-cols-2 gap-2 text-gray-300 print:text-black items-start">
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                            <div className="col-span-2">
                                <strong>الحالة:</strong>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full mr-2 ${statusClasses[operation.status]} print:bg-gray-200 print:text-black print:border print:border-gray-400`}>{operation.status}</span>
                            </div>
                             <p><strong>رقم اللجنة:</strong> {operation.committee_number || 'لم يحدد'}</p>

                            {operation.status === 'مقبوله' && (
                                <>
                                    <p><strong>تاريخ القبول:</strong> {operation.acceptance_date || 'غير محدد'}</p>
                                    <p><strong>حالة الصرف:</strong> {operation.disbursement_status || 'لم تحدد'}</p>
                                    {operation.disbursement_date && <p><strong>تاريخ الصرف:</strong> {operation.disbursement_date}</p>}
                                </>
                            )}
                             {operation.status === 'معلقة' && (
                                <p><strong>تاريخ التعليق:</strong> {operation.pending_date || 'غير محدد'}</p>
                            )}
                             <p className="col-span-2"><strong>وصف قرار اللجنة:</strong> {operation.committee_decision_description || 'لا يوجد'}</p>
                         </div>
                    </div>
                </div>
                
                {/* Print Footer */}
                <div className="hidden print:block mt-12">
                    <h3 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">ملاحظات</h3>
                    <div className="border border-dashed border-gray-400 h-40"></div>
                </div>
            </div>
             <div className="flex justify-end space-x-2 space-x-reverse pt-6 print:hidden">
                <Button variant="secondary" icon="fa-print" onClick={handlePrint}>طباعة</Button>
                <Button variant="secondary" onClick={onClose}>إغلاق</Button>
            </div>
        </Modal>
    );
};

const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
        <nav className="mt-6 flex justify-center items-center space-x-1 space-x-reverse">
            <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="secondary" className="px-3 py-1">
                <i className="fas fa-chevron-right"></i>
            </Button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
<<<<<<< HEAD
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${ currentPage === number ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600' }`}
=======
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${ currentPage === number ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600' }`}
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
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

<<<<<<< HEAD
export const OperationsPage: React.FC<OperationsPageProps> = ({ operations, setOperations, beneficiaries, assistanceTypes, showToast }) => {
=======
export const OperationsPage: React.FC<OperationsPageProps> = ({ operations, setOperations, beneficiaries, assistanceTypes, employees, showToast }) => {
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [operationToEdit, setOperationToEdit] = useState<Operation | null>(null);
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<OperationStatus | ''>('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });
    const [selectedIds, setSelectedIds] = useState(new Set<number>());
    const headerCheckboxRef = useRef<HTMLInputElement>(null);
    const ITEMS_PER_PAGE = 10;
<<<<<<< HEAD

    const inputFilterClasses = "w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-emerald-500 focus:border-emerald-500";
    const labelFilterClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
=======
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
    
    const filteredOperations = useMemo(() => {
        return operations.filter(op => {
            const beneficiary = beneficiaries.find(b => b.national_id === op.beneficiary_national_id);
            const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
            
            const searchMatch = !lowercasedSearchTerm || 
                (beneficiary && beneficiary.name.toLowerCase().includes(lowercasedSearchTerm)) || 
                op.beneficiary_national_id.includes(lowercasedSearchTerm) ||
                op.code.toLowerCase().includes(lowercasedSearchTerm);
            const statusMatch = !filterStatus || op.status === filterStatus;
            const dateMatch = (!filterStartDate || op.date >= filterStartDate) && (!filterEndDate || op.date <= filterEndDate);

            return searchMatch && statusMatch && dateMatch;
        });
    }, [operations, searchTerm, beneficiaries, filterStatus, filterStartDate, filterEndDate]);
    
    const sortedOperations = useMemo(() => {
        let sortableItems = [...filteredOperations];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const getSortableValue = (operation: Operation, key: OperationSortKey) => {
                    if (key === 'beneficiaryName') {
                         return beneficiaries.find(ben => ben.national_id === operation.beneficiary_national_id)?.name || '';
                    }
                    return operation[key as keyof Operation];
                }

                const valA = getSortableValue(a, sortConfig.key!);
                const valB = getSortableValue(b, sortConfig.key!);

                let comparison = 0;
                if (valA === null || valA === undefined) comparison = 1;
                else if (valB === null || valB === undefined) comparison = -1;
                else if (typeof valA === 'string' && typeof valB === 'string') {
                    comparison = valA.localeCompare(valB, 'ar');
                }

                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [filteredOperations, sortConfig, beneficiaries]);

    const requestSort = (key: OperationSortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortDirectionIcon = (key: OperationSortKey) => {
         if (sortConfig.key !== key) {
            return 'fa-sort text-gray-500';
         }
         return sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    };

    useEffect(() => {
        setCurrentPage(1);
        setSelectedIds(new Set());
    }, [searchTerm, filterStatus, filterStartDate, filterEndDate, sortConfig]);

    const paginatedOperations = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedOperations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, sortedOperations]);
    
    useEffect(() => {
        if (headerCheckboxRef.current) {
            const numSelected = paginatedOperations.filter(op => selectedIds.has(op.id)).length;
            headerCheckboxRef.current.checked = numSelected === paginatedOperations.length && paginatedOperations.length > 0;
            headerCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < paginatedOperations.length;
        }
    }, [selectedIds, paginatedOperations]);


    const totalPages = Math.ceil(sortedOperations.length / ITEMS_PER_PAGE);

    const handleAdd = (operation: Omit<Operation, 'id' | 'code'>) => {
        const numericCodes = operations
            .map(op => parseInt(op.code.replace('OP', ''), 10))
            .filter(n => !isNaN(n));
        const maxCode = numericCodes.length > 0 ? Math.max(...numericCodes) : 0;
        const newCode = `OP${String(maxCode + 1).padStart(3, '0')}`;

        setOperations(prev => [...prev, { ...operation, id: Date.now(), code: newCode }]);
        setIsModalOpen(false);
    };
    
    const handleEdit = (operation: Omit<Operation, 'id' | 'code'>) => {
        if (operationToEdit) {
            setOperations(prev => prev.map(op => op.id === operationToEdit.id ? { ...operationToEdit, ...operation } : op));
        }
        setIsModalOpen(false);
        setOperationToEdit(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه العملية؟')) {
            setOperations(prev => prev.filter(op => op.id !== id));
        }
    };
    
    const handleBulkDelete = () => {
        if (window.confirm(`هل أنت متأكد من حذف ${selectedIds.size} عملية (عمليات)؟`)) {
            setOperations(prev => prev.filter(op => !selectedIds.has(op.id)));
            setSelectedIds(new Set());
        }
    };

    const handleSelect = (id: number) => {
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
            setSelectedIds(new Set(paginatedOperations.map(op => op.id)));
        } else {
            setSelectedIds(new Set());
        }
    };
    
    const openEditModal = (operation: Operation) => {
        setOperationToEdit(operation);
        setIsModalOpen(true);
    };

    const openDetailsModal = (operation: Operation) => {
        setSelectedOperation(operation);
        setIsDetailsModalOpen(true);
    };

    const executeLocalExport = () => {
        if (filteredOperations.length === 0) {
            alert('لا توجد بيانات لتصديرها.');
            return;
        }

        const dataToExport = filteredOperations.map(op => {
            const beneficiary = beneficiaries.find(b => b.national_id === op.beneficiary_national_id);
            const assistance = assistanceTypes.find(a => a.id === op.assistance_id);
<<<<<<< HEAD
=======
            const employee = employees.find(e => e.national_id === op.employee_national_id);
            const employeeName = employee ? employee.name : (op.employee_national_id === 'VOLUNTEER' ? 'متطوع' : '');

>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
            return {
                'كود العملية': op.code,
                'المستفيد': beneficiary?.name || 'غير معروف',
                'الرقم القومي للمستفيد': op.beneficiary_national_id,
                'نوع المساعدة': assistance?.name || 'غير معروف',
                'القيمة': op.amount,
                'تاريخ تقديم الطلب': op.date,
                'جهة الإنفاق': op.spending_entity,
<<<<<<< HEAD
=======
                'الموظف المسؤول': employeeName,
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                'رقم اللجنة': op.committee_number || '',
                'وصف قرار اللجنة': op.committee_decision_description || '',
                'الحالة': op.status,
                'تاريخ القبول': op.acceptance_date || '',
                'تاريخ التعليق': op.pending_date || '',
                'حالة الصرف': op.disbursement_status || '',
                'تاريخ الصرف': op.disbursement_date || '',
                'تفاصيل إضافية': op.details || ''
            };
        });

        try {
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "العمليات");
            const filename = `قائمة_العمليات_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.xlsx`;
            XLSX.writeFile(wb, filename);
            showToast('بدأ تنزيل ملف العمليات.', 'success', filename);
        } catch (error) {
            console.error("Failed to export operations", error);
            alert("حدث خطأ أثناء تصدير البيانات.");
        }
    };

    const handleProviderSelection = (provider: 'local' | 'google_drive') => {
        if (provider === 'google_drive') {
            alert('خاصية التصدير إلى Google Drive قيد التطوير!');
            setIsProviderModalOpen(false);
            return;
        }
        executeLocalExport();
        setTimeout(() => setIsProviderModalOpen(false), 100);
    };

    const statusClasses: Record<OperationStatus, string> = {
        'مقبوله': 'bg-emerald-800 text-emerald-200',
        'مرفوضه': 'bg-red-800 text-red-200',
        'معلقة': 'bg-amber-800 text-amber-200',
    };
    
    const ThSortable: React.FC<{ sortKey: OperationSortKey; label: string; }> = ({ sortKey, label }) => (
        <th className="p-3">
<<<<<<< HEAD
            <button onClick={() => requestSort(sortKey)} className="w-full flex items-center justify-end text-right font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none">
=======
            <button onClick={() => requestSort(sortKey)} className="w-full flex items-center justify-end text-right font-semibold text-gray-300 hover:text-white transition-colors focus:outline-none">
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                <span>{label}</span>
                <i className={`fas ${getSortDirectionIcon(sortKey)} mr-2`}></i>
            </button>
        </th>
    );

    return (
        <div>
            <Header title="إدارة العمليات" icon="fa-exchange-alt" />
            <div className="flex justify-end mb-6 space-x-2 space-x-reverse h-10">
                 {selectedIds.size > 0 ? (
                    <div className="flex items-center gap-4 animate-fade-in-right">
                        <span className="text-lg">{selectedIds.size} تم تحديده</span>
                        <Button icon="fa-trash" variant='danger' onClick={handleBulkDelete}>حذف المحدد</Button>
                    </div>
                ) : (
                    <>
                        <Button icon="fa-file-export" variant="secondary" onClick={() => setIsProviderModalOpen(true)} disabled={filteredOperations.length === 0} title="تصدير القائمة الحالية إلى Excel">
                            تصدير القائمة الحالية
                        </Button>
                         <Button icon="fa-plus" onClick={() => { setOperationToEdit(null); setIsModalOpen(true); }}>إضافة عملية جديدة</Button>
                    </>
                 )}
            </div>

<<<<<<< HEAD
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md my-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <label htmlFor="searchFilter" className={labelFilterClasses}>بحث بالاسم/الرقم القومي/الكود</label>
                        <input id="searchFilter" type="text" placeholder="ابحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={inputFilterClasses} />
                    </div>
                     <div>
                        <label htmlFor="statusFilter" className={labelFilterClasses}>فلترة بالحالة</label>
                        <select id="statusFilter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as OperationStatus | '')} className={inputFilterClasses}>
=======
            <div className="bg-gray-800 p-4 rounded-lg shadow-md my-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <label htmlFor="searchFilter" className="block text-sm font-medium text-gray-300 mb-1">بحث بالاسم/الرقم القومي/الكود</label>
                        <input id="searchFilter" type="text" placeholder="ابحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 bg-gray-700 rounded text-white" />
                    </div>
                     <div>
                        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-300 mb-1">فلترة بالحالة</label>
                        <select id="statusFilter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as OperationStatus | '')} className="w-full p-2 bg-gray-700 rounded text-white">
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                            <option value="">كل الحالات</option>
                            <option value="معلقة">معلقة</option>
                            <option value="مقبوله">مقبوله</option>
                            <option value="مرفوضه">مرفوضه</option>
                        </select>
                    </div>
                     <div>
<<<<<<< HEAD
                        <label htmlFor="startDateFilter" className={labelFilterClasses}>من تاريخ</label>
                        <input id="startDateFilter" type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className={inputFilterClasses}/>
                    </div>
                    <div>
                        <label htmlFor="endDateFilter" className={labelFilterClasses}>إلى تاريخ</label>
                        <input id="endDateFilter" type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className={inputFilterClasses}/>
=======
                        <label htmlFor="startDateFilter" className="block text-sm font-medium text-gray-300 mb-1">من تاريخ</label>
                        <input id="startDateFilter" type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="w-full p-2 bg-gray-700 rounded text-white"/>
                    </div>
                    <div>
                        <label htmlFor="endDateFilter" className="block text-sm font-medium text-gray-300 mb-1">إلى تاريخ</label>
                        <input id="endDateFilter" type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="w-full p-2 bg-gray-700 rounded text-white"/>
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                    </div>
                </div>
            </div>
            
<<<<<<< HEAD
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                             <th className="p-3 text-center w-12">
                                <input type="checkbox" ref={headerCheckboxRef} onChange={handleSelectAll} className="form-checkbox h-5 w-5 text-emerald-600 bg-gray-100 border-gray-300 dark:bg-gray-900 dark:border-gray-600 rounded focus:ring-emerald-500 cursor-pointer" />
=======
            <div className="bg-gray-800 shadow-lg rounded-lg overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-gray-700">
                        <tr>
                             <th className="p-3 text-center w-12">
                                <input type="checkbox" ref={headerCheckboxRef} onChange={handleSelectAll} className="form-checkbox h-5 w-5 text-emerald-600 bg-gray-800 border-gray-600 rounded focus:ring-emerald-500 cursor-pointer" />
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                            </th>
                            <ThSortable sortKey="code" label="كود العملية" />
                            <ThSortable sortKey="beneficiaryName" label="اسم المستفيد" />
                            <ThSortable sortKey="date" label="تاريخ التسجيل" />
                            <ThSortable sortKey="status" label="الحالة" />
                            <th className="p-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedOperations.map(op => {
                            const beneficiary = beneficiaries.find(b => b.national_id === op.beneficiary_national_id);
                            return (
<<<<<<< HEAD
                                <tr key={op.id} className={`border-b border-gray-200 dark:border-gray-700 transition-colors ${selectedIds.has(op.id) ? 'bg-emerald-50 dark:bg-emerald-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                    <td className="p-3 text-center">
                                        <input type="checkbox" checked={selectedIds.has(op.id)} onChange={() => handleSelect(op.id)} className="form-checkbox h-5 w-5 text-emerald-600 bg-gray-100 border-gray-300 dark:bg-gray-900 dark:border-gray-600 rounded focus:ring-emerald-500 cursor-pointer" />
                                    </td>
                                    <td className="p-3">{op.code}</td>
                                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer hover:text-emerald-500 dark:hover:text-emerald-300" onClick={() => openDetailsModal(op)}>
=======
                                <tr key={op.id} className={`border-b border-gray-700 transition-colors ${selectedIds.has(op.id) ? 'bg-emerald-900/50' : 'hover:bg-gray-700/50'}`}>
                                    <td className="p-3 text-center">
                                        <input type="checkbox" checked={selectedIds.has(op.id)} onChange={() => handleSelect(op.id)} className="form-checkbox h-5 w-5 text-emerald-600 bg-gray-800 border-gray-600 rounded focus:ring-emerald-500 cursor-pointer" />
                                    </td>
                                    <td className="p-3">{op.code}</td>
                                    <td className="p-3 text-emerald-400 font-semibold cursor-pointer hover:text-emerald-300" onClick={() => openDetailsModal(op)}>
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                                        {beneficiary?.name || 'غير معروف'}
                                    </td>
                                    <td className="p-3">{op.date}</td>
                                    <td className="p-3">
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusClasses[op.status]}`}>
                                            {op.status}
                                        </span>
                                        {op.status === 'مقبوله' && op.disbursement_status === 'جاري التنفيذ' && (
                                            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-amber-600 text-amber-100 animate-pulse">
                                                جاري التنفيذ
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3 flex space-x-2 space-x-reverse">
                                        <Button variant="secondary" onClick={() => openEditModal(op)} title="تعديل"><i className="fas fa-edit"></i></Button>
                                        <Button variant="danger" onClick={() => handleDelete(op.id)} title="حذف"><i className="fas fa-trash"></i></Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {sortedOperations.length === 0 && (
<<<<<<< HEAD
                    <div className="text-center p-6 text-gray-500 dark:text-gray-400">
=======
                    <div className="text-center p-6 text-gray-400">
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
                        لا توجد بيانات تطابق معايير البحث الحالية.
                    </div>
                )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={operationToEdit ? 'تعديل عملية' : 'إضافة عملية'}>
<<<<<<< HEAD
                <OperationForm onSubmit={operationToEdit ? handleEdit : handleAdd} onClose={() => setIsModalOpen(false)} operationToEdit={operationToEdit} beneficiaries={beneficiaries} assistanceTypes={assistanceTypes} />
=======
                <OperationForm onSubmit={operationToEdit ? handleEdit : handleAdd} onClose={() => setIsModalOpen(false)} operationToEdit={operationToEdit} beneficiaries={beneficiaries} assistanceTypes={assistanceTypes} employees={employees} />
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
            </Modal>
            <OperationDetailsModal 
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                operation={selectedOperation}
                beneficiary={beneficiaries.find(b => b.national_id === selectedOperation?.beneficiary_national_id)}
                assistanceType={assistanceTypes.find(a => a.id === selectedOperation?.assistance_id)}
<<<<<<< HEAD
=======
                employees={employees}
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
            />
            <FileProviderModal
                isOpen={isProviderModalOpen}
                onClose={() => setIsProviderModalOpen(false)}
                onSelectProvider={handleProviderSelection}
                title="اختر مكان تصدير الملف"
            />
        </div>
    );
<<<<<<< HEAD
};
=======
};
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
