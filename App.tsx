import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { UsersPage } from './pages/Users';
import { EmployeesPage } from './pages/Employees';
import { BeneficiariesPage } from './pages/Beneficiaries';
import { AssistancePage } from './pages/Assistance';
import { OperationsPage } from './pages/Operations';
import { SearchPage } from './pages/Search';
import { ExportPage } from './pages/Export';
import { BackupPage } from './pages/Backup';
import { IncentivePage } from './pages/Incentive';
import { LoginPage } from './pages/Login';
import { AboutPage } from './pages/About';
import { initialEmployees, initialBeneficiaries, initialAssistanceTypes, initialOperations, initialTasks } from './constants';
import type { User, Employee, Beneficiary, AssistanceType, Operation, AppData, Task } from './types';
import { Toast } from './components/Toast';

type View = 'dashboard' | 'users' | 'employees' | 'beneficiaries' | 'assistance' | 'operations' | 'search' | 'export' | 'backup' | 'incentive' | 'about';

const LOCAL_STORAGE_KEY = 'charityAppData';
const LAST_AUTO_BACKUP_KEY = 'lastAutoBackupTimestamp';
const SESSION_STORAGE_AUTH_KEY = 'currentUser';

interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'info';
    copyText?: string;
}

const defaultUsers: User[] = [
    { id: 1, name: 'Admin User', mobile: '01000000000', username: 'Admin', password: 'Admin', role: 'مدير' },
    { id: 2, name: 'Tarek User', mobile: '01011112222', username: 'Tarek', password: '123', role: 'مدير' }
];

const getInitialState = (): AppData => {
    try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.employees && parsedData.beneficiaries && parsedData.assistanceTypes && parsedData.operations) {
                // Role migration for older data structures
                if (parsedData.users && Array.isArray(parsedData.users)) {
                    parsedData.users = parsedData.users.map((user: User) => {
                        if (!user.role) {
                            if (user.username === 'Admin' || user.username === 'Tarek') {
                                return { ...user, role: 'مدير' };
                            }
                            return { ...user, role: 'مستخدم' };
                        }
                        return user;
                    });
                } else {
                     parsedData.users = [];
                }
                
                if (parsedData.users.length === 0) {
                    parsedData.users = defaultUsers;
                }

                if (!parsedData.tasks) {
                    parsedData.tasks = initialTasks;
                }
                
                return parsedData;
            }
        }
    } catch (error) {
        console.error("Failed to parse data from localStorage", error);
    }
    return {
        users: defaultUsers,
        employees: initialEmployees,
        beneficiaries: initialBeneficiaries,
        assistanceTypes: initialAssistanceTypes,
        operations: initialOperations,
        tasks: initialTasks,
    };
};

const getInitialUser = (): User | null => {
    try {
        const savedUser = sessionStorage.getItem(SESSION_STORAGE_AUTH_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
        return null;
    }
};

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(getInitialUser);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!currentUser);
    const [view, setView] = useState<View>('dashboard');
    const [appData, setAppData] = useState<AppData>(getInitialState);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const { users, employees, beneficiaries, assistanceTypes, operations, tasks } = appData;

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [appData]);
    
    const showToast = useCallback((message: string, type: 'success' | 'info' = 'success', copyText?: string) => {
        const id = Date.now();
        setToasts(prev => [...prev.slice(-4), { id, message, type, copyText }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const setUsers = (updater: React.SetStateAction<User[]>) => {
        const newUsers = typeof updater === 'function' ? updater(users) : updater;
        setAppData(prev => ({ ...prev, users: newUsers }));
    };

    const setEmployees = (updater: React.SetStateAction<Employee[]>) => {
        const newEmployees = typeof updater === 'function' ? updater(employees) : updater;
        setAppData(prev => ({ ...prev, employees: newEmployees }));
    };
    
    const setBeneficiaries = (updater: React.SetStateAction<Beneficiary[]>) => {
        const newBeneficiaries = typeof updater === 'function' ? updater(beneficiaries) : updater;
        setAppData(prev => ({ ...prev, beneficiaries: newBeneficiaries }));
    };

    const setAssistanceTypes = (updater: React.SetStateAction<AssistanceType[]>) => {
        const newAssistanceTypes = typeof updater === 'function' ? updater(assistanceTypes) : updater;
        setAppData(prev => ({ ...prev, assistanceTypes: newAssistanceTypes }));
    };

    const setOperations = (updater: React.SetStateAction<Operation[]>) => {
        const newOperations = typeof updater === 'function' ? updater(operations) : updater;
        setAppData(prev => ({ ...prev, operations: newOperations }));
    };

    const setTasks = (updater: React.SetStateAction<Task[]>) => {
        const newTasks = typeof updater === 'function' ? updater(tasks) : updater;
        setAppData(prev => ({ ...prev, tasks: newTasks }));
    };

    const updateEmployee = useCallback((updatedEmployee: Employee, originalNationalId: string) => {
        setAppData(prev => {
            const newEmployees = prev.employees.map(emp => emp.national_id === originalNationalId ? updatedEmployee : emp);
            let newBeneficiaries = prev.beneficiaries;
            if (updatedEmployee.national_id !== originalNationalId) {
                newBeneficiaries = newBeneficiaries.map(ben => ben.employee_national_id === originalNationalId ? { ...ben, employee_national_id: updatedEmployee.national_id } : ben);
            }
            return { ...prev, employees: newEmployees, beneficiaries: newBeneficiaries };
        });
    }, []);

    const handleBackup = useCallback((isAuto = false) => {
        try {
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(appData, null, 2))}`;
            const link = document.createElement("a");
            link.href = jsonString;
            const date = new Date().toISOString().split('T')[0];
            const filename = `backup-مؤسسة-الجارحي-${date}.json`;
            link.download = filename;
            link.click();
            if (isAuto) {
                localStorage.setItem(LAST_AUTO_BACKUP_KEY, new Date().toISOString());
                 console.log("Automatic daily backup completed.");
            } else {
                 showToast("بدأ تنزيل ملف النسخة الاحتياطية.", 'success', filename);
            }
        } catch (error) {
            console.error("Backup failed", error);
            alert("فشل إنشاء النسخة الاحتياطية.");
        }
    }, [appData, showToast]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const lastBackupTimestamp = localStorage.getItem(LAST_AUTO_BACKUP_KEY);
        const oneDay = 24 * 60 * 60 * 1000;
        const now = new Date().getTime();

        if (!lastBackupTimestamp || (now - new Date(lastBackupTimestamp).getTime()) > oneDay) {
            console.log("Performing automatic daily backup...");
            handleBackup(true);
        }
    }, [handleBackup, isAuthenticated]);

    const handleRestore = (restoredData: AppData) => {
        if (!restoredData.users || !Array.isArray(restoredData.users) || restoredData.users.length === 0) {
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
        if (!restoredData.tasks) {
            restoredData.tasks = initialTasks;
        }
        if (restoredData.employees && restoredData.beneficiaries && restoredData.assistanceTypes && restoredData.operations) {
            setAppData(restoredData);
            showToast("تم استعادة البيانات بنجاح!", 'success');
        } else {
            alert("ملف النسخة الاحتياطية غير صالح أو تالف.");
        }
    };

    const handleLogin = (username: string, password: string): boolean => {
        const normalizeUsername = (str: string) => str.trim().replace(/[^a-zA-Z0-9]/g, '');
        const normalizedInputUsername = normalizeUsername(username);
        const trimmedPassword = password.trim();

        const user = appData.users.find(u => {
            const normalizedStoredUsername = normalizeUsername(u.username);
            return normalizedStoredUsername.toLowerCase() === normalizedInputUsername.toLowerCase() && u.password === trimmedPassword;
        });

        if (user) {
            sessionStorage.setItem(SESSION_STORAGE_AUTH_KEY, JSON.stringify(user));
            setIsAuthenticated(true);
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        sessionStorage.removeItem(SESSION_STORAGE_AUTH_KEY);
        setIsAuthenticated(false);
        setCurrentUser(null);
        setView('dashboard');
    };

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard 
                            stats={{ employees: employees.length, beneficiaries: beneficiaries.length, operations: operations.length }}
                            currentUser={currentUser}
                            tasks={tasks}
                            setTasks={setTasks} 
                        />;
            case 'users':
                return currentUser?.role === 'مدير' 
                    ? <UsersPage users={users} setUsers={setUsers} />
                    : <Dashboard 
                        stats={{ employees: employees.length, beneficiaries: beneficiaries.length, operations: operations.length }}
                        currentUser={currentUser}
                        tasks={tasks}
                        setTasks={setTasks} 
                      />;
            case 'employees':
                return <EmployeesPage employees={employees} setEmployees={setEmployees} beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} updateEmployee={updateEmployee} />;
            case 'beneficiaries':
                return <BeneficiariesPage beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} employees={employees} operations={operations} showToast={showToast} />;
            case 'assistance':
                return <AssistancePage assistanceTypes={assistanceTypes} setAssistanceTypes={setAssistanceTypes} />;
            case 'operations':
                return <OperationsPage operations={operations} setOperations={setOperations} beneficiaries={beneficiaries} assistanceTypes={assistanceTypes} employees={employees} showToast={showToast} />;
            case 'incentive':
                return <IncentivePage employees={employees} beneficiaries={beneficiaries} />;
            case 'search':
                return <SearchPage beneficiaries={beneficiaries} employees={employees} operations={operations} assistanceTypes={assistanceTypes} />;
            case 'export':
                return <ExportPage data={{ employees, beneficiaries, assistanceTypes, operations }} showToast={showToast} />;
            case 'backup':
                return <BackupPage onBackup={() => handleBackup(false)} onRestore={handleRestore} appData={appData} showToast={showToast} />;
            case 'about':
                return <AboutPage />;
            default:
                return <Dashboard 
                            stats={{ employees: employees.length, beneficiaries: beneficiaries.length, operations: operations.length }}
                            currentUser={currentUser}
                            tasks={tasks}
                            setTasks={setTasks} 
                        />;
        }
    };

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen flex">
            <Sidebar setView={setView} currentView={view} onLogout={handleLogout} currentUser={currentUser} />
            <main className="flex-1 p-6 sm:p-10 transition-all duration-300">
                {renderView()}
            </main>
            <div className="fixed bottom-4 left-4 z-[100] space-y-2" dir="rtl">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </div>
    );
};

export default App;
