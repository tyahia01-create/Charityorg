import React, { useRef, useState } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import type { AppData, Employee, Beneficiary, AssistanceType, Operation, Note, User, Task } from '../types';
import { FileProviderModal } from '../components/FileProviderModal';
import { initialTasks } from '../constants';

// This assumes xlsx is loaded from a CDN in index.html
declare const XLSX: any;


interface BackupPageProps {
    onBackup: () => void;
    onRestore: (data: AppData) => void;
    appData: AppData;
    showToast: (message: string, type?: 'success' | 'info', copyText?: string) => void;
}

const defaultUsers: User[] = [
    { id: 1, name: 'Admin User', mobile: '01000000000', username: 'Admin', password: 'Admin', role: 'مدير' },
    { id: 2, name: 'Tarek User', mobile: '01011112222', username: 'Tarek', password: '123', role: 'مدير' }
];

export const BackupPage: React.FC<BackupPageProps> = ({ onBackup, onRestore, appData, showToast }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<'json_backup' | 'excel_backup' | 'restore' | null>(null);

    const executeLocalExcelBackup = () => {
        try {
            const wb = XLSX.utils.book_new();

            const beneficiariesForExport = appData.beneficiaries.map(ben => {
                const { notes, ...rest } = ben;
                const notesString = notes?.map(note => `[${note.date}] ${note.text}`).join('\n') || '';
                return { ...rest, notes: notesString };
            });

            const ws_employees = XLSX.utils.json_to_sheet(appData.employees);
            XLSX.utils.book_append_sheet(wb, ws_employees, "الموظفين");

            const ws_beneficiaries = XLSX.utils.json_to_sheet(beneficiariesForExport);
            XLSX.utils.book_append_sheet(wb, ws_beneficiaries, "المستفيدين");

            const ws_assistance = XLSX.utils.json_to_sheet(appData.assistanceTypes);
            XLSX.utils.book_append_sheet(wb, ws_assistance, "أنواع المساعدات");

            const ws_operations = XLSX.utils.json_to_sheet(appData.operations);
            XLSX.utils.book_append_sheet(wb, ws_operations, "العمليات");

            const ws_users = XLSX.utils.json_to_sheet(appData.users);
            XLSX.utils.book_append_sheet(wb, ws_users, "المستخدمين");
            
            const ws_tasks = XLSX.utils.json_to_sheet(appData.tasks);
            XLSX.utils.book_append_sheet(wb, ws_tasks, "المهام");
            
            const date = new Date().toISOString().split('T')[0];
            const fileName = `backup-excel-مؤسسة-الجارحي-${date}.xlsx`;
            XLSX.writeFile(wb, fileName);
            showToast('بدأ تنزيل ملف النسخة الاحتياطية (Excel).', 'success', fileName);

        } catch (error) {
            console.error("Failed to export to Excel", error);
            alert("حدث خطأ أثناء تصدير البيانات إلى Excel.");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm("هل أنت متأكد من رغبتك في استعادة البيانات من هذا الملف؟ سيتم الكتابة فوق جميع البيانات الحالية بشكل دائم. لا يمكن التراجع عن هذا الإجراء.")) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const reader = new FileReader();
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        reader.onload = (e) => {
            try {
                let restoredData: AppData;

                if (fileExtension === 'json') {
                    const text = e.target?.result;
                    if (typeof text !== 'string') throw new Error("File content is not readable text.");
                    restoredData = JSON.parse(text);
                } else if (fileExtension === 'xlsx') {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'array' });

                    const employees: Employee[] = XLSX.utils.sheet_to_json(workbook.Sheets['الموظفين']);
                    const beneficiariesRaw: any[] = XLSX.utils.sheet_to_json(workbook.Sheets['المستفيدين']);
                    const assistanceTypes: AssistanceType[] = XLSX.utils.sheet_to_json(workbook.Sheets['أنواع المساعدات']);
                    const operations: Operation[] = XLSX.utils.sheet_to_json(workbook.Sheets['العمليات']);
                    
                    let users: User[] = [];
                    const usersSheet = workbook.Sheets['المستخدمين'];
                    if (usersSheet) {
                        users = XLSX.utils.sheet_to_json(usersSheet);
                    }

                    let tasks: Task[] = initialTasks;
                    const tasksSheet = workbook.Sheets['المهام'];
                    if (tasksSheet) {
                        tasks = XLSX.utils.sheet_to_json(tasksSheet);
                    }

                    const beneficiaries: Beneficiary[] = beneficiariesRaw.map(b => {
                        const notesString = b.notes || '';
                        const parsedNotes: Note[] = [];
                        if (notesString && typeof notesString === 'string') {
                            notesString.split('\n').forEach(line => {
                                const match = line.match(/^\[(.*?)\]\s(.*)$/);
                                if (match && match[1] && match[2]) {
                                    parsedNotes.push({ date: match[1], text: match[2] });
                                }
                            });
                        }
                        const { notes, ...rest } = b;
                        return { ...rest, notes: parsedNotes };
                    });
                    restoredData = { users, employees, beneficiaries, assistanceTypes, operations, tasks };
                } else {
                    throw new Error("Unsupported file type.");
                }
                
                if (!restoredData.users || restoredData.users.length === 0) {
                    restoredData.users = defaultUsers;
                } else {
                    // Role migration for older backup files
                    restoredData.users = restoredData.users.map((user: User) => {
                        if (!user.role) {
                            if (user.username === 'Admin' || user.username === 'Tarek') {
                                return { ...user, role: 'مدير' };
                            }
                            return { ...user, role: 'مستخدم' };
                        }
                        return user;
                    });
                }
                
                onRestore(restoredData);

            } catch (error) {
                console.error("Failed to parse backup file", error);
                alert("فشل في قراءة ملف النسخة الاحتياطية. قد يكون الملف تالفًا أو بصيغة غير صحيحة.");
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };

        if (fileExtension === 'json') {
            reader.readAsText(file);
        } else if (fileExtension === 'xlsx') {
            reader.readAsArrayBuffer(file);
        } else {
            alert("صيغة الملف غير مدعومة. يرجى اختيار ملف .json أو .xlsx");
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const triggerLocalFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleProviderSelection = (provider: 'local' | 'google_drive') => {
        if (provider === 'google_drive') {
            alert(`خاصية ${pendingAction === 'restore' ? 'الاستيراد من' : 'النسخ الاحتياطي إلى'} Google Drive قيد التطوير!`);
            setIsProviderModalOpen(false);
            setPendingAction(null);
            return;
        }

        switch(pendingAction) {
            case 'json_backup':
                onBackup();
                break;
            case 'excel_backup':
                executeLocalExcelBackup(); 
                break;
            case 'restore':
                triggerLocalFileInput();
                break;
        }

        setTimeout(() => {
            setIsProviderModalOpen(false);
            setPendingAction(null);
        }, 100);
    };
    
    return (
        <div>
            <Header title="النسخ الاحتياطي والاستعادة" icon="fa-database" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Manual Backup Section */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">إنشاء نسخة احتياطية يدوية</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        اضغط على الزر أدناه لتنزيل نسخة كاملة من جميع بياناتك الحالية. احتفظ بهذا الملف في مكان آمن.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={() => { setPendingAction('json_backup'); setIsProviderModalOpen(true); }} icon="fa-download" variant="primary">
                            إنشاء نسخة احتياطية (JSON)
                        </Button>
                        <Button onClick={() => { setPendingAction('excel_backup'); setIsProviderModalOpen(true); }} icon="fa-file-excel" variant="secondary">
                            إنشاء نسخة احتياطية (Excel)
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        يقوم النظام أيضًا بإنشاء نسخة احتياطية تلقائية (JSON) مرة كل 24 ساعة.
                    </p>
                </div>

                {/* Restore from Backup Section */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                     <h2 className="text-2xl font-bold mb-4 text-amber-600 dark:text-amber-400">استعادة من نسخة احتياطية</h2>
                     <p className="text-gray-700 dark:text-gray-300 mb-6">
                        يمكنك استعادة حالة النظام بالكامل من ملف نسخة احتياطية تم إنشاؤه مسبقًا. اختر ملف النسخة الاحتياطية (بصيغة .json أو .xlsx) من جهازك.
                    </p>
                    <div className="bg-red-100 dark:bg-red-900/50 border-r-4 border-red-500 p-4 rounded-md mb-6">
                        <p className="font-bold text-red-700 dark:text-red-300"><i className="fas fa-exclamation-triangle mr-2"></i>تحذير هام</p>
                        <p className="text-red-800 dark:text-red-400">
                           عملية الاستعادة ستقوم بحذف جميع البيانات الحالية واستبدالها بالبيانات الموجودة في الملف الذي تختاره. هذا الإجراء نهائي ولا يمكن التراجع عنه.
                        </p>
                    </div>

                    <input
                        type="file"
                        accept=".json,.xlsx"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button onClick={() => { setPendingAction('restore'); setIsProviderModalOpen(true); }} icon="fa-upload" variant="secondary">
                        اختر ملف النسخة الاحتياطية
                    </Button>
                </div>
            </div>
             <FileProviderModal
                isOpen={isProviderModalOpen}
                onClose={() => {
                    setIsProviderModalOpen(false);
                    setPendingAction(null);
                }}
                onSelectProvider={handleProviderSelection}
                title={
                    pendingAction === 'restore' 
                        ? "اختر مصدر الاستيراد" 
                        : "اختر وجهة الحفظ"
                }
            />
        </div>
    );
};