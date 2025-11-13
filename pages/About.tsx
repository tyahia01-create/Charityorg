import React from 'react';
import { Header } from '../components/Header';

const InfoCard: React.FC<{ icon: string; title: string; children: React.ReactNode; link: string; }> = ({ icon, title, children, link }) => (
    <a 
        href={link}
        target="_blank" 
        rel="noopener noreferrer"
        className="group flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300"
    >
        <i className={`${icon} text-3xl w-12 text-center transition-transform group-hover:scale-110`}></i>
        <div className="mr-4">
            <h3 className="font-bold text-lg text-white">{title}</h3>
            <div className="text-gray-300">{children}</div>
        </div>
    </a>
);


export const AboutPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Header title="عن التطبيق" icon="fa-info-circle" />

            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl text-center animate-fade-in-right">
                <div className="mb-6">
                    <h2 className="text-4xl font-bold text-white">طارق يحيى</h2>
                    <p className="text-xl text-emerald-400 mt-2">مطور برمجيات</p>
                </div>

                <div className="space-y-4 text-right">
                   <InfoCard icon="fab fa-whatsapp text-green-400" title="واتساب" link="https://wa.me/201554189154">
                       <span dir="ltr">01554189154</span>
                   </InfoCard>
                   <InfoCard icon="fas fa-phone-alt text-blue-400" title="اتصال" link="tel:+201555540800">
                       <span dir="ltr">01555540800</span>
                   </InfoCard>
                   <InfoCard icon="fab fa-linkedin text-sky-400" title="لينكدإن" link="https://www.linkedin.com/in/tarek-yahia-12b05311b/">
                       <span>الملف الشخصي</span>
                   </InfoCard>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className="text-gray-400">
                        تم تطوير هذا التطبيق لمؤسسة الجارحي للتنمية المجتمعية
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                       الإصدار 1.0.0
                    </p>
                </div>
            </div>
        </div>
    );
};
