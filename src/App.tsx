
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardList, 
  Bell, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  TrendingUp,
  Warehouse,
  TrendingDown,
  History,
  LogOut,
  Edit,
  Mail,
  Eye,
  AlertTriangle,
  Menu,
  X,
  Check,
  Lock,
  Phone,
  PieChart as PieChartIcon,
  FileBarChart,
  Trash2
} from 'lucide-react';

import { Services } from './services';


// --- CONSTANTS & LISTS ---

const PROPERTY_TYPES = [
  'Departamento', 'Casa', 'Oficina', 'Parcela', 'Local Comercial', 
  'Terreno', 'Sitio', 'Bodega', 'Industrial', 'Agrícola', 
  'Estacionamiento', 'Loteo', 'Otro'
];

const COMUNAS_CHILE = [
  // Región de Arica y Parinacota
  "Arica", "Camarones", "Putre", "General Lagos",

  // Región de Tarapacá
  "Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica",

  // Región de Antofagasta
  "Antofagasta", "Mejillones", "Sierra Gorda", "Taltal",
  "Calama", "Ollagüe", "San Pedro de Atacama",
  "Tocopilla", "María Elena",

  // Región de Atacama
  "Copiapó", "Caldera", "Tierra Amarilla",
  "Chañaral", "Diego de Almagro",
  "Vallenar", "Alto del Carmen", "Freirina", "Huasco",

  // Región de Coquimbo
  "La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña",
  "Illapel", "Canela", "Los Vilos", "Salamanca",
  "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado",

  // Región de Valparaíso
  "Valparaíso", "Viña del Mar", "Concón", "Quintero", "Puchuncaví",
  "Casablanca", "Juan Fernández",
  "Quilpué", "Villa Alemana", "Limache", "Olmué",
  "San Antonio", "Cartagena", "El Tabo", "El Quisco", "Algarrobo",
  "Santo Domingo",
  "Quillota", "La Calera", "Hijuelas", "La Cruz", "Nogales",
  "San Felipe", "Llaillay", "Putaendo", "Santa María", "Catemu",
  "Panquehue",
  "Los Andes", "Calle Larga", "San Esteban", "Rinconada",
  "San Francisco de Limache" ,

  // Región Metropolitana
  "Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque",
  "Estación Central", "Huechuraba", "Independencia", "La Cisterna",
  "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes",
  "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú",
  "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia",
  "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca",
  "San Joaquín", "San Miguel", "San Ramón", "Vitacura",
  "Puente Alto", "La Puente", "San José de Maipo", "Pirque",
  "Colina", "Lampa", "Til Til",

  // Región de O’Higgins
  "Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros",
  "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo",
  "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente",
  "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad",
  "Paredones",
  "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua",
  "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz",

  // Región del Maule
  "Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco",
  "Pencahue", "Río Claro", "San Clemente", "San Rafael",
  "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral",
  "Sagrada Familia", "Teno", "Vichuquén",
  "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier",
  "Villa Alegre", "Yerbas Buenas",
  "Cauquenes", "Chanco", "Pelluhue",

  // Región de Ñuble
  "Chillán", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón",
  "San Ignacio", "Yungay",
  "Bulnes", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo",
  "Quirihue", "Ránquil", "Treguaco",
  "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás",

  // Región del Biobío
  "Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota",
  "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé",
  "Hualpén",
  "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos",
  "Tirúa",
  "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento",
  "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara",
  "Tucapel", "Yumbel", "Alto Biobío",

  // Región de La Araucanía
  "Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino",
  "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial",
  "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra",
  "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica",
  "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces",
  "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria",

  // Región de Los Ríos
  "Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina",
  "Paillaco", "Panguipulli",
  "La Unión", "Futrono", "Lago Ranco", "Río Bueno",

  // Región de Los Lagos
  "Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Llanquihue",
  "Los Muermos", "Maullín", "Puerto Varas",
  "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón",
  "Queilen", "Quellón", "Quemchi", "Quinchao",
  "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro",
  "San Juan de la Costa", "San Pablo",
  "Chaitén", "Futaleufú", "Hualaihué", "Palena",

  // Región de Aysén
  "Coyhaique", "Lago Verde",
  "Aysén", "Cisnes", "Guaitecas",
  "Cochrane", "O'Higgins", "Tortel",
  "Chile Chico", "Río Ibáñez",

  // Región de Magallanes
  "Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio",
  "Cabo de Hornos", "Antártica",
  "Porvenir", "Primavera", "Timaukel",
  "Natales", "Torres del Paine"
];

const USERS = [
  { id: 1, name: 'Administrador', role: 'ADMIN', email: 'admin@sauma.cl', pass: 'admin' },
  { id: 2, name: 'Juan Pérez', role: 'EXECUTIVE', email: 'juan@sauma.cl', pass: '1234' },
  { id: 3, name: 'Maria Gomez', role: 'OPERATIONS', email: 'maria@sauma.cl', pass: '1234' },
];

// --- MODELS & TYPES ---

type PropertyStatus = 'AVAILABLE' | 'LEASED' | 'NOTICE_GIVEN';

interface Property {
  id: string;
  address: string;
  commune: string;
  type: string;
  landM2: number;
  builtM2: number;
  storageM2?: number;
  condominium?: string;
  priceUF: number;
  status: PropertyStatus;
  owner: string;
  
  // Status Specific Data
  vacancyStartDate?: string; // For AVAILABLE (to calc days empty)
  noticeEndDate?: string;    // For NOTICE_GIVEN (to calc days to handover)
  
  // Leased Data
  currentTenant?: string;
  leaseStartDate?: string;
  leaseEndDate?: string;
  leaseType?: 'FIXED' | 'RENEWABLE';

  createdAt: string;
  updatedAt: string;
}

interface ActionHistoryItem {
  action: string;
  scheduledDate: string;
  status: 'PENDING' | 'DONE' | 'ARCHIVED'; 
  archivedDate: string; // Date when it was moved to history (edited/replaced)
  completedDate?: string; // Date when it was finished (if applicable)
  note?: string; // Reason for archive/closure
}

interface Visit {
  id: string;
  propertyId: string;
  date: string; // ISO String YYYY-MM-DD
  executiveName: string; 
  
  // Client Data
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  
  offerUF?: number;
  hasBroker: boolean;
  brokerName?: string;
  comments: string;
  
  // Current Active Action
  nextAction: string;
  nextActionDate: string; // ISO String YYYY-MM-DD
  actionStatus: 'PENDING' | 'DONE';
  actionCompletedDate?: string; // Date when marked as DONE
  
  // History of past actions
  history?: ActionHistoryItem[];

  createdAt: string;
}

// --- MOCK DATABASE & SERVICES ---

const STORAGE_KEYS = {
  PROPERTIES: 'sauma_properties_v3',
  VISITS: 'sauma_visits_v3',
  SESSION: 'sauma_session'
};

const Service = {
  getProperties: (): Property[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    let properties: Property[] = stored ? JSON.parse(stored) : [];
    
    // AUTO-UPDATE STATUS LOGIC
    const today = new Date().toISOString().split('T')[0];
    let hasChanges = false;

    properties = properties.map(p => {
      if (p.status === 'NOTICE_GIVEN' && p.noticeEndDate && p.noticeEndDate < today) {
        hasChanges = true;
        return {
          ...p,
          status: 'AVAILABLE',
          vacancyStartDate: p.noticeEndDate, 
          noticeEndDate: undefined
        };
      }
      return p;
    });

    if (hasChanges) {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
    }
    
   // Seed if empty
if (properties.length === 0) {
  const seed: Property[] = [
    {
      id: 'P-1001',
      address: 'Av. Providencia 1234',
      commune: 'Providencia',
      type: 'Oficina',
      landM2: 0,
      builtM2: 120,
      priceUF: 4500,
      status: 'AVAILABLE',
      vacancyStartDate: '2023-10-01',
      owner: 'Dueño demo 1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    },
    {
      id: 'P-1002',
      address: 'El Golf 500',
      commune: 'Las Condes',
      type: 'Oficina',
      landM2: 0,
      builtM2: 200,
      priceUF: 12000,
      status: 'LEASED',
      currentTenant: 'Tech Corp',
      leaseEndDate: '2025-12-31',
      owner: 'Dueño demo 2',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    },
    {
      id: 'P-1003',
      address: 'Vitacura 3000',
      commune: 'Vitacura',
      type: 'Local Comercial',
      landM2: 300,
      builtM2: 150,
      priceUF: 15000,
      status: 'NOTICE_GIVEN',
      noticeEndDate: '2023-12-01',
      owner: 'Dueño demo 3',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    }
  ];
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(seed));
  return seed;
}


    return properties;
  },

  saveProperty: (property: Property) => {
    const properties = Service.getProperties();
    const index = properties.findIndex(p => p.id === property.id);
    if (index >= 0) {
      properties[index] = { ...property, updatedAt: new Date().toISOString() };
    } else {
      properties.push({ ...property, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  },



  getVisits: (): Visit[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.VISITS);
    return stored ? JSON.parse(stored) : [];
  },

  addVisit: (visit: Visit) => {
    const visits = Service.getVisits();
    visits.push(visit);
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
    alert("Visita registrada exitosamente.");
  },

  processActionUpdate: (visitId: string, type: 'MARK_DONE' | 'NEW_ACTION', payload?: { action: string, date: string, note?: string }) => {
    const visits = Service.getVisits();
    const index = visits.findIndex(v => v.id === visitId);
    if (index === -1) return;
    
    const visit = visits[index];
    const now = new Date().toISOString().split('T')[0];

    if (type === 'MARK_DONE') {
      // Mark current action as done
      visit.actionStatus = 'DONE';
      visit.actionCompletedDate = now;
    } 
    else if (type === 'NEW_ACTION' && payload) {
      // 1. Archive current action to history
      if (!visit.history) visit.history = [];
      
      visit.history.push({
        action: visit.nextAction,
        scheduledDate: visit.nextActionDate,
        status: visit.actionStatus,
        completedDate: visit.actionCompletedDate,
        archivedDate: now // Date of edit/replacement
      });

      // 2. Set new action
      visit.nextAction = payload.action;
      visit.nextActionDate = payload.date;
      visit.actionStatus = 'PENDING';
      visit.actionCompletedDate = undefined;
    }

    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
  },
  
  closeNonWinnerCommitments: (propertyId: string, winnerClientName: string) => {
    const visits = Service.getVisits();
    const now = new Date().toISOString().split('T')[0];
    let hasChanges = false;

    visits.forEach(visit => {
       if (visit.propertyId === propertyId && visit.actionStatus === 'PENDING') {
          if (visit.clientName !== winnerClientName) {
             // LOSER: Auto close
             if (!visit.history) visit.history = [];
             
             // Archive current to history
             visit.history.push({
               action: visit.nextAction,
               scheduledDate: visit.nextActionDate,
               status: 'ARCHIVED',
               archivedDate: now,
               note: 'Propiedad ya no está disponible'
             });

             visit.actionStatus = 'DONE';
             visit.nextAction = 'Cierre Automático: Propiedad no disponible';
             visit.actionCompletedDate = now;
             hasChanges = true;
          }
       }
    });

    if (hasChanges) {
      localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
    }
  },

  deleteProperty: (propertyId: string) => {
    // 1. Filtrar propiedades
    const properties = Service
      .getProperties()
      .filter(p => p.id !== propertyId);
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));

    // 2. Filtrar visitas asociadas a esa propiedad
    const visits = Service
      .getVisits()
      .filter(v => v.propertyId !== propertyId);
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));

    // devolvemos los nuevos arrays para actualizar el estado en React
    return { properties, visits };
  },
  getAlerts: () => {
    const properties = Service.getProperties();
    const visits = Service.getVisits();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // 1. Propiedades sin visitas en 30 días (Solo Disponibles o Notice Given)
    const staleProperties = properties.filter(p => {
      if (p.status === 'LEASED') return false;
      const propVisits = visits.filter(v => v.propertyId === p.id);
      
      // If no visits ever, check vacancy duration or creation date
      if (propVisits.length === 0) {
        let referenceDate = new Date(p.createdAt);
        
        if (p.status === 'AVAILABLE' && p.vacancyStartDate) {
            referenceDate = new Date(p.vacancyStartDate);
        } 
        
        const diffDays = Math.ceil((now.getTime() - referenceDate.getTime()) / (1000 * 3600 * 24));
        return diffDays > 30;
      }

      const lastVisit = propVisits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      const lastVisitDate = new Date(lastVisit.date);
      const diffTime = now.getTime() - lastVisitDate.getTime(); 
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
      
      return diffDays > 30;
    });

    // 2. Compromisos
    const pendingActions = visits.filter(v => v.actionStatus !== 'DONE');
    const alerts = pendingActions.map(v => {
      const diffTime = new Date(v.nextActionDate).setHours(0,0,0,0) - new Date(todayStr).setHours(0,0,0,0);
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
      
      let status: 'URGENT' | 'WARNING' | 'NORMAL' = 'NORMAL';
      
      if (diffDays < 0) status = 'URGENT'; 
      else if (diffDays <= 10) status = 'WARNING'; 

      return { visit: v, daysLeft: diffDays, status };
    }).filter((a): a is { visit: Visit, daysLeft: number, status: 'URGENT' | 'WARNING' } => a.status !== 'NORMAL');

    alerts.sort((a, b) => a.daysLeft - b.daysLeft);

    return { staleProperties, actionAlerts: alerts };
  }
};

// --- HELPERS ---
const formatUF = (val: number) => `UF ${val.toLocaleString('es-CL')}`;

const getDaysDiff = (dateStr?: string) => {
  if (!dateStr) return 0;
  const start = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 3600 * 24));
};

// --- CHART COMPONENTS ---

const SimpleBarChart = ({ data, title, height = 200 }: { data: { label: string, value: number, color?: string }[], title: string, height?: number }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
      <h4 className="font-bold text-slate-700 mb-6">{title}</h4>
      <div className="flex items-end gap-4" style={{ height: `${height}px` }}>
        {data.length === 0 ? (
           <div className="w-full h-full flex items-center justify-center text-slate-400 italic">Sin datos</div>
        ) : (
          data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group min-w-[40px]">
             <div className="w-full relative flex items-end justify-center bg-slate-50 rounded-t-lg overflow-hidden h-full">
                <div 
                  className={`w-full transition-all duration-500 ${d.color || 'bg-amber-500 hover:bg-amber-600'}`} 
                  style={{ height: `${(d.value / max) * 100}%` }}
                ></div>
             </div>
             <div className="text-center w-full">
               <span className="block font-bold text-slate-800 text-sm">{d.value}</span>
               <span className="text-[10px] sm:text-xs text-slate-500 truncate w-full block" title={d.label}>{d.label}</span>
             </div>
          </div>
        )))}
      </div>
    </div>
  );
};

const SimplePieChart = ({ data, title }: { data: { label: string, value: number, color: string }[], title: string }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let accumulatedDeg = 0;
  
  const gradientParts = data.map(d => {
    if (total === 0) return '';
    const start = accumulatedDeg;
    const degrees = (d.value / total) * 360;
    accumulatedDeg += degrees;
    return `${d.color} ${start}deg ${accumulatedDeg}deg`;
  }).filter(Boolean).join(', ');

  const background = total > 0 ? `conic-gradient(${gradientParts})` : '#f1f5f9';

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
      <h4 className="font-bold text-slate-700 mb-6 self-start">{title}</h4>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div 
          className="w-48 h-48 rounded-full shadow-inner relative flex items-center justify-center"
          style={{ background }}
        >
           {total === 0 && <span className="text-slate-400 text-sm">Sin datos</span>}
        </div>
        <div className="space-y-3">
           {data.map((d, i) => (
             <div key={i} className="flex items-center gap-3">
               <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: d.color }}></div>
               <div className="text-sm">
                 <span className="font-bold text-slate-700">{d.label}</span>
                 <span className="text-slate-500 ml-2">({total > 0 ? Math.round((d.value/total)*100) : 0}%)</span>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const SimpleLineChart = ({ data, title }: { data: { label: string, value: number }[], title: string }) => {
  const max = Math.max(...data.map(d => d.value), 5); // Minimum max of 5 for scale
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value / max) * 80); // Keep some padding at top
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-full">
      <h4 className="font-bold text-slate-700 mb-6">{title}</h4>
      <div className="relative h-[250px] w-full px-4 pb-6">
         <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
               <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
            ))}
            
            {/* Line */}
            {data.length > 1 && (
              <polyline 
                 points={points} 
                 fill="none" 
                 stroke="#f59e0b" 
                 strokeWidth="2" 
                 strokeLinecap="round" 
                 strokeLinejoin="round"
                 vectorEffect="non-scaling-stroke"
              />
            )}
            
            {/* Dots */}
            {data.map((d, i) => {
               const x = (i / (data.length - 1)) * 100;
               const y = 100 - ((d.value / max) * 80);
               return (
                 <g key={i} className="group cursor-pointer">
                   <circle cx={x} cy={y} r="1.5" fill="white" stroke="#f59e0b" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                   {/* Label X */}
                   <text x={x} y={110} textAnchor="middle" fontSize="3" fill="#94a3b8" className="uppercase tracking-tighter">{d.label}</text>
                   {/* Value Tooltipish */}
                   <text x={x} y={y - 5} textAnchor="middle" fontSize="4" fill="#64748b" className="font-bold">{d.value}</text>
                 </g>
               )
            })}
         </svg>
      </div>
    </div>
  )
}

const LoginScreen = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.email === email && u.pass === pass);
    if (user) {
      onLogin(user);
      setError('');
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl border border-slate-200">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            SAUMA <span className="text-sky-600">HERMANOS</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Inmobiliaria</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
              Email Corporativo
            </label>
            <input
              type="email"
              required
              className="w-full p-3 md:p-3.5 border border-slate-300 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ejemplo@sauma.cl"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full p-3 md:p-3.5 border border-slate-300 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-rose-500 text-center text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 md:py-3.5 rounded-xl text-sm md:text-base transition-colors shadow-md"
          >
            Ingresar al Sistema
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 md:mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-[11px] md:text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 text-center">
            Credenciales de Demo
          </p>
          <div className="space-y-1.5 md:space-y-2">
            {USERS.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setEmail(u.email);
                  setPass(u.pass);
                }}
                className="w-full flex justify-between items-center text-xs md:text-sm p-2 hover:bg-slate-100 rounded-lg transition-colors group"
              >
                <span className="font-medium text-slate-700">{u.name}</span>
                <span className="font-mono text-slate-500 group-hover:text-sky-600">
                  {u.email}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Badge reutilizable para estados de propiedades y alertas
const StatusBadge = ({
  status,
}: {
  status: PropertyStatus | 'URGENT' | 'WARNING' | 'DONE' | 'PENDING' | 'ARCHIVED';
}) => {
  const styles: Record<string, string> = {
    AVAILABLE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    LEASED: 'bg-slate-100 text-slate-700 border-slate-200',
    NOTICE_GIVEN: 'bg-amber-100 text-amber-800 border-amber-200',
    URGENT: 'bg-red-100 text-red-700 border-red-200',
    WARNING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    DONE: 'bg-green-100 text-green-700 border-green-200',
    PENDING: 'bg-blue-50 text-blue-700 border-blue-200',
    ARCHIVED: 'bg-slate-200 text-slate-600 border-slate-300',
  };

  const labels: Record<string, string> = {
    AVAILABLE: 'Disponible',
    LEASED: 'Arrendada',
    NOTICE_GIVEN: 'Aviso de Entrega',
    URGENT: 'VENCIDO',
    WARNING: 'PRÓXIMO',
    DONE: 'Realizada',
    PENDING: 'Pendiente',
    ARCHIVED: 'Archivado',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border uppercase tracking-wide ${
        styles[status] || 'bg-gray-100 text-slate-700 border-slate-200'
      }`}
    >
      {labels[status] || status}
    </span>
  );
};
const ActionModal = ({ visit, onClose, onUpdate }: { visit: Visit, onClose: () => void, onUpdate: () => void }) => {
  const [mode, setMode] = useState<'SELECT' | 'NEW'>('SELECT');
  const [newAction, setNewAction] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleMarkDone = () => {
    Service.processActionUpdate(visit.id, 'MARK_DONE');
    onUpdate();
    onClose();
  };

  const handleNewAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction || !newDate) return;
    Service.processActionUpdate(visit.id, 'NEW_ACTION', { action: newAction, date: newDate });
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4 border-b pb-4">
          <h3 className="text-xl font-bold text-slate-800">Gestionar Compromiso</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Compromiso Actual</p>
          <p className="font-bold text-slate-800 text-lg">{visit.nextAction}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-slate-600">Fecha: {visit.nextActionDate}</span>
            <StatusBadge status={visit.actionStatus} />
          </div>
        </div>

        {mode === 'SELECT' ? (
          <div className="space-y-3">
            {visit.actionStatus !== 'DONE' && (
              <button
                onClick={handleMarkDone}
                className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl flex items-center justify-between group transition-all"
              >
                <div className="text-left">
                  <span className="block font-bold">Marcar como REALIZADO</span>
                  <span className="text-green-200 text-xs">La tarea se guardará como completada</span>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-200 group-hover:text-white" />
              </button>
            )}

            <button
              onClick={() => setMode('NEW')}
              className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 p-4 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="text-left">
                <span className="block font-bold">Programar NUEVA ACCIÓN</span>
                <span className="text-amber-700 text-xs">Archiva la actual y crea una nueva</span>
              </div>
              <Calendar className="w-6 h-6 text-amber-600" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleNewAction} className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nueva Acción / Tarea</label>
              <input
                required
                autoFocus
                className="w-full p-3 border rounded-xl"
                placeholder="Ej: Llamar nuevamente, Enviar correo..."
                value={newAction}
                onChange={e => setNewAction(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Límite</label>
              <input
                required
                type="date"
                className="w-full p-3 border rounded-xl"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setMode('SELECT')} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">Volver</button>
              <button type="submit" className="flex-1 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700">Guardar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// LEASE RESOLUTION MODAL
const LeaseResolutionModal = ({ propertyId, winnerClientName, onComplete, onCancel }: { propertyId: string, winnerClientName: string, onComplete: () => void, onCancel: () => void }) => {
  const [pendingWinnerVisits, setPendingWinnerVisits] = useState<Visit[]>([]);

  useEffect(() => {
    const visits = Service.getVisits();
    const winnerVisits = visits.filter(v =>
      v.propertyId === propertyId &&
      v.actionStatus === 'PENDING' &&
      v.clientName === winnerClientName
    );
    setPendingWinnerVisits(winnerVisits);
  }, [propertyId, winnerClientName]);

  const handleResolveWinnerVisit = (visit: Visit) => {
    Service.processActionUpdate(visit.id, 'MARK_DONE');
    setPendingWinnerVisits(prev => prev.filter(v => v.id !== visit.id));
  };

  const hasPending = pendingWinnerVisits.length > 0;

  return (
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Cierre de Propiedad</h3>
          <p className="text-slate-500 mt-2">
            Estás marcando la propiedad como <b>ARRENDADA</b> a <span className="font-bold text-slate-800">{winnerClientName}</span>.
          </p>
        </div>

        {hasPending ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" /> Acción Requerida
            </h4>
            <p className="text-sm text-amber-700 mb-4">
              Existen compromisos pendientes con el cliente ganador. Debes resolverlos (marcar como cumplidos) antes de finalizar el cierre.
            </p>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {pendingWinnerVisits.map(v => (
                <div key={v.id} className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{v.nextAction}</p>
                    <p className="text-xs text-slate-500">{v.nextActionDate}</p>
                  </div>
                  <button
                    onClick={() => handleResolveWinnerVisit(v)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                  >
                    CUMPLIR
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <p className="text-green-800 text-sm font-medium">Todo listo con el cliente ganador.</p>
          </div>
        )}

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Acciones Automáticas</p>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-slate-400 mt-0.5" />
              <span>Se cerrarán automáticamente los compromisos pendientes de <b>otros clientes</b> con la nota: "Propiedad ya no está disponible".</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-slate-400 mt-0.5" />
              <span>El historial de visitas se mantendrá intacto para futuras gestiones.</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            onClick={onComplete}
            disabled={hasPending}
            className={`flex-1 py-3 font-bold rounded-xl text-white transition-all ${hasPending ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg'}`}
          >
            Confirmar Cierre
          </button>
        </div>
      </div>
    </div>
  );
};

const ClientHistoryModal = ({ clientName, visits, onClose }: { clientName: string, visits: Visit[], onClose: () => void }) => {
  const clientVisits = visits
    .filter(v => v.clientName === clientName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const properties = Service.getProperties();

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full p-0 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <User className="w-6 h-6 text-amber-600" /> {clientName}
              </h3>
              <p className="text-sm text-slate-500 mt-1">Hoja de vida del cliente y seguimiento de negociaciones.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
          </div>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">
          {clientVisits.length === 0 ? (
            <p className="text-center text-slate-500 italic">No hay historial disponible para este cliente.</p>
          ) : (
            clientVisits.map(visit => {
              const prop = properties.find(p => p.id === visit.propertyId);
              return (
                <div key={visit.id} className="relative pl-8 before:absolute before:left-3 before:top-8 before:bottom-0 before:w-0.5 before:bg-slate-200 last:before:bg-transparent">
                  <div className="absolute left-0 top-1 bg-slate-200 p-1.5 rounded-full text-slate-500">
                    <Building2 className="w-3 h-3" />
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-2 border-b border-slate-50 pb-2">
                      <div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mb-1 inline-block">VISITA: {visit.date}</span>
                        <h4 className="font-bold text-slate-800">{prop?.address || visit.propertyId}</h4>
                      </div>
                      <div className="text-xs text-right text-slate-500">
                        <p>Ejecutivo: {visit.executiveName}</p>
                        {visit.offerUF && <p className="font-bold text-green-600">Oferta: {formatUF(visit.offerUF)}</p>}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 italic mb-4">"{visit.comments}"</p>

                    <div className="bg-slate-50 rounded-lg p-3 space-y-3">
                      <h5 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                        <History className="w-3 h-3" /> Historial de Compromisos
                      </h5>

                      {visit.history?.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm opacity-70">
                          <div className="mt-0.5">
                            {h.status === 'DONE' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Edit className="w-4 h-4 text-slate-400" />}
                          </div>
                          <div>
                            <p className="font-medium text-slate-700 line-through">{h.action}</p>
                            <p className="text-xs text-slate-500">
                              {h.status === 'DONE'
                                ? `Cumplido el ${h.completedDate}`
                                : (h.status === 'ARCHIVED'
                                  ? `Archivado: ${h.archivedDate}`
                                  : `Modificado el ${h.archivedDate}`)}
                            </p>
                            {h.note && <p className="text-xs text-slate-400 italic">{h.note}</p>}
                          </div>
                        </div>
                      ))}

                      <div className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5">
                          {visit.actionStatus === 'DONE' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{visit.nextAction}</p>
                          <p className="text-xs text-slate-500">
                            {visit.actionStatus === 'DONE'
                              ? `Realizado el ${visit.actionCompletedDate}`
                              : `Programado para: ${visit.nextActionDate}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const VisitDetailModal = ({ visit, onClose }: { visit: Visit, onClose: () => void }) => {
  const properties = Service.getProperties();
  const prop = properties.find(p => p.id === visit.propertyId);

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4 border-b pb-4">
          <h3 className="text-xl font-bold text-slate-800">Detalle de Visita</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><LogOut className="w-5 h-5 rotate-45" /></button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Fecha Visita</label>
              <p className="font-bold text-slate-800 text-lg">{visit.date}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Ejecutivo</label>
              <p className="font-medium text-slate-800">{visit.executiveName}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Propiedad Visitada</label>
            <p className="font-bold text-slate-800">{prop?.address || visit.propertyId}</p>
            <p className="text-sm text-slate-500">{prop?.type} - {prop?.commune}</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Cliente</label>
            <p className="font-medium text-slate-800 text-lg">{visit.clientName}</p>

            {(visit.clientPhone || visit.clientEmail) && (
              <div className="flex gap-4 mt-2 text-sm text-slate-600">
                {visit.clientPhone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-amber-600" /> {visit.clientPhone}</span>}
                {visit.clientEmail && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-amber-600" /> {visit.clientEmail}</span>}
              </div>
            )}

            {visit.hasBroker && (
              <p className="text-sm text-amber-600 mt-2 font-medium bg-amber-50 p-2 rounded border border-amber-100 inline-block">
                Asistió con Corredor: {visit.brokerName}
              </p>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Comentarios</label>
            <p className="text-slate-700 italic">"{visit.comments}"</p>
          </div>

          {/* Compromiso actual */}
          <div className="border-t border-slate-100 pt-4">
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Compromiso Actual</label>
            <div className={`p-4 rounded-xl border ${visit.actionStatus === 'DONE' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-800">{visit.nextAction}</p>
                  <p className="text-sm text-slate-500">Fecha Límite: {visit.nextActionDate}</p>
                </div>
                <StatusBadge status={visit.actionStatus} />
              </div>
              {visit.actionStatus === 'DONE' && visit.actionCompletedDate && (
                <div className="mt-2 text-xs font-bold text-green-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Realizado el {visit.actionCompletedDate}
                </div>
              )}
            </div>
          </div>

          {/* Historial */}
          {visit.history && visit.history.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Historial de Acciones</label>
              <div className="space-y-2">
                {visit.history.map((h, idx) => (
                  <div key={idx} className="text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-700">{h.action}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${h.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                        {h.status === 'DONE' ? 'REALIZADO' : (h.status === 'ARCHIVED' ? 'ARCHIVADO' : h.status)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-slate-500">
                      <span>Prog: {h.scheduledDate}</span>
                      <span>
                        {h.status === 'DONE'
                          ? `Completado: ${h.completedDate}`
                          : `Archivado: ${h.archivedDate}`}
                      </span>
                    </div>
                    {h.note && <div className="text-xs text-slate-400 mt-1 italic">{h.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {visit.offerUF && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center mt-4">
              <span className="text-green-800 font-bold">Oferta Realizada: {formatUF(visit.offerUF)}</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};


// 1. DASHBOARD
const Dashboard = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [alertsData, setAlertsData] = useState(Service.getAlerts());
  const [selectedVisitForAction, setSelectedVisitForAction] = useState<Visit | null>(null);
  const [viewVisit, setViewVisit] = useState<Visit | null>(null);

  // 🔹 Ahora properties viene de Supabase (con backup local)
  const [properties, setProperties] = useState<Property[]>([]);
  const allVisits = Service.getVisits();

  const refreshAlerts = () => {
    setAlertsData(Service.getAlerts());
  };

  useEffect(() => {
    // refresca alertas como antes
    refreshAlerts();

    // carga propiedades desde Supabase
    const loadProps = async () => {
      try {
        const fromDb = await Services.fetchPropertiesFromSupabase();
        console.log('Dashboard – propiedades desde Supabase:', fromDb);

        if (!fromDb || fromDb.length === 0) {
          console.warn('Supabase no devolvió propiedades en Dashboard, uso backup local');
          setProperties(Service.getProperties());
          return;
        }

        const mapped: Property[] = fromDb.map((p: any) => ({
          id: p.id,
          address: p.address || '',
          commune: p.comuna || '',
          type: p.property_type || 'Oficina',
          owner: p.owner_name || '',
          condominium: p.condominium_name || '',
          priceUF: p.arriendo_publicacion_uf || 0,
          landM2: p.superficie_terreno || 0,
          builtM2: p.superficie_construida || 0,
          storageM2: p.superficie_bodega || 0,
          status:
            p.status === 'Disponible'
              ? 'AVAILABLE'
              : p.status === 'Arrendado'
              ? 'LEASED'
              : p.status === 'Aviso entrega'
              ? 'NOTICE_GIVEN'
              : 'AVAILABLE',
          vacancyStartDate: p.fecha_disponible_desde || '',
          noticeEndDate: '',
          leaseStartDate: '',
          leaseEndDate: '',
          currentTenant: '',
          leaseType: 'FIXED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        setProperties(mapped);
      } catch (err) {
        console.error('Dashboard – error al cargar propiedades desde Supabase:', err);
        setProperties(Service.getProperties()); // backup si hay error
      }
    };

    loadProps();
  }, []);

  const { actionAlerts } = alertsData;

  // 🔹 Propiedades críticas: sin visitas por 30 días o más.
  // Hoy, como no hay visitas registradas, TODAS las propiedades disponibles o con aviso serán críticas.
  const staleProperties = useMemo(() => {
    const today = new Date();

    return properties.filter((p) => {
      // Propiedades arrendadas NO son críticas
      if (p.status === 'LEASED') return false;

      // Todas las visitas de esta propiedad
      const visitsForProp = allVisits.filter((v) => v.propertyId === p.id);

      // Si nunca ha tenido visitas → crítica
      if (visitsForProp.length === 0) return true;

      // Encontrar la última visita válida
      const lastVisit = visitsForProp
        .map((v) => new Date(v.date))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => b.getTime() - a.getTime())[0];

      if (!lastVisit) return true;

      const diffDays =
        (today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24);

      // Crítica si han pasado 30+ días desde la última visita
      return diffDays >= 30;
    });
  }, [properties, allVisits]);

  // Logic for Recent Visits (Last 7 Days)
  const recentVisits = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    return allVisits
      .filter((v) => {
        const d = new Date(v.date);
        return d >= sevenDaysAgo && d <= now;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allVisits]);

  const stats = {
    AVAILABLE: properties.filter((p) => p.status === 'AVAILABLE').length,
    LEASED: properties.filter((p) => p.status === 'LEASED').length,
    NOTICE: properties.filter((p) => p.status === 'NOTICE_GIVEN').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Disponibles
            </p>
            <Building2 className="text-sky-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {stats.AVAILABLE}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Propiedades en oferta
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Aviso entrega
            </p>
            <Clock className="text-amber-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {stats.NOTICE}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Próximas a liberarse
          </p>
        </div>

        <div
          className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab('alerts')}
        >
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Alertas
            </p>
            <Bell className="text-rose-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-semibold text-rose-600 mt-1">
            {actionAlerts.length + staleProperties.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Requieren atención
          </p>
        </div>
      </div>

      {/* Recent Visits Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
            Visitas recientes (últimos 7 días)
          </h3>
          <button
            onClick={() => setActiveTab('visits')}
            className="text-xs md:text-sm text-sky-600 font-medium hover:underline"
          >
            Ir a bitácora
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[11px] md:text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3 md:p-4 font-semibold">Fecha</th>
                <th className="p-3 md:p-4 font-semibold">Propiedad</th>
                <th className="p-3 md:p-4 font-semibold">Cliente</th>
                <th className="p-3 md:p-4 font-semibold">Ejecutivo</th>
                <th className="p-3 md:p-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
              {recentVisits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No se registraron visitas en los últimos 7 días.
                  </td>
                </tr>
              ) : (
                recentVisits.map((v) => {
                  const prop = properties.find((p) => p.id === v.propertyId);
                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3 md:p-4">
                        <button
                          onClick={() => setViewVisit(v)}
                          className="font-medium text-sky-600 hover:underline flex items-center gap-1 text-xs md:text-sm"
                        >
                          {v.date} <Eye className="w-3 h-3" />
                        </button>
                      </td>
                      <td className="p-3 md:p-4 font-medium text-slate-700">
                        {prop?.address || v.propertyId}
                      </td>
                      <td className="p-3 md:p-4 text-slate-600">
                        <div className="font-medium text-sm">
                          {v.clientName}
                        </div>
                        {v.hasBroker && (
                          <div className="text-[11px] text-amber-600 mt-0.5">
                            Corredor: {v.brokerName}
                          </div>
                        )}
                      </td>
                      <td className="p-3 md:p-4 text-slate-500 text-sm">
                        {v.executiveName}
                      </td>
                      <td className="p-3 md:p-4">
                        <StatusBadge status={v.actionStatus} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
              Compromisos próximos (10 días)
            </h3>
            <button
              onClick={() => setActiveTab('visits')}
              className="text-xs md:text-sm text-sky-600 font-medium hover:underline"
            >
              Ver todo
            </button>
          </div>
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {actionAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No hay compromisos pendientes cercanos.
              </div>
            ) : (
              actionAlerts.map((alert, i) => (
                <div
                  key={i}
                  className={`p-4 border-l-4 ${
                    alert.status === 'URGENT'
                      ? 'border-l-rose-500 bg-rose-50/60'
                      : 'border-l-amber-400 bg-amber-50/60'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          alert.status === 'URGENT'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {alert.status === 'URGENT'
                          ? `Vencido (${Math.abs(alert.daysLeft)} días)`
                          : `Vence en ${alert.daysLeft} días`}
                      </span>
                      <p className="font-semibold text-slate-900 mt-2 text-sm md:text-base">
                        {alert.visit.nextAction}
                      </p>
                      <p className="text-xs md:text-sm text-slate-600 mt-1">
                        Cliente: {alert.visit.clientName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                        {alert.visit.nextActionDate}
                      </p>
                      <button
                        onClick={() => setSelectedVisitForAction(alert.visit)}
                        className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[11px] md:text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <Edit className="w-3 h-3" /> EDITAR
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stale Properties */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
              Stock sin movimiento (&gt; 30 días)
            </h3>
            <button
              onClick={() => setActiveTab('stale')}
              className="text-xs md:text-sm text-sky-600 font-medium hover:underline"
            >
              Ver todo
            </button>
          </div>
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {staleProperties.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Todo el stock tiene movimiento reciente.
              </div>
            ) : (
              staleProperties.map((p, i) => (
                <div
                  key={i}
                  className="p-4 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setActiveTab('stale')}
                >
                  <div className="flex justify-between items-center gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm md:text-base">
                        {p.address}
                      </p>
                      <p className="text-xs md:text-sm text-slate-500 mt-1">
                        {p.commune} • {formatUF(p.priceUF)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="bg-orange-100 text-orange-700 text-[11px] font-semibold px-2 py-1 rounded-full">
                        Sin visitas (&gt; 30 días)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedVisitForAction && (
        <ActionModal
          visit={selectedVisitForAction}
          onClose={() => setSelectedVisitForAction(null)}
          onUpdate={refreshAlerts}
        />
      )}
      {viewVisit && (
        <VisitDetailModal visit={viewVisit} onClose={() => setViewVisit(null)} />
      )}
    </div>
  );
};

// 2. PROPERTIES PAGE
const PropertiesPage = ({
  user,
  ufValue,
}: {
  user: any;
  ufValue: number | null;
}) => {

  const formatCLP = (value: number | null) => {
    if (value === null) return '—';
    return value.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    });
  };

  const [properties, setProperties] = useState<Property[]>([]);
  const [visits, setVisits] = useState<Visit[]>(Service.getVisits());
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [sortPriority, setSortPriority] = useState(false);

  // 🔹 Cargar propiedades desde Supabase al iniciar la página
  useEffect(() => {
    const loadProps = async () => {
      try {
        const fromDb = await Services.fetchPropertiesFromSupabase();
        console.log('Propiedades desde Supabase:', fromDb);

        if (!fromDb || fromDb.length === 0) {
          console.warn('Supabase no devolvió propiedades');
          return; // dejamos properties como []
        }

        // Adaptar columnas de la BD al formato que usa tu app
        const mapped: Property[] = fromDb.map((p: any) => ({
          id: p.id,
          address: p.address || '',
          commune: p.comuna || '',
          type: p.property_type || 'Oficina',
          owner: p.owner_name || '',
          condominium: p.condominium_name || '',
          priceUF: p.arriendo_publicacion_uf || 0,
          landM2: p.superficie_terreno || 0,
          builtM2: p.superficie_construida || 0,
          storageM2: p.superficie_bodega || 0,

          // Estado de BD -> estado de la app
          status:
            p.status === 'Disponible'
              ? 'AVAILABLE'
              : p.status === 'Arrendado'
              ? 'LEASED'
              : p.status === 'Aviso entrega'
              ? 'NOTICE_GIVEN'
              : 'AVAILABLE',

          vacancyStartDate: p.fecha_disponible_desde || '',

          // Campos que tu BD aún no tiene
          noticeEndDate: '',
          leaseStartDate: '',
          leaseEndDate: '',
          currentTenant: '',
          leaseType: 'FIXED',

          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        setProperties(mapped);
      } catch (err) {
        console.error('Error cargando propiedades desde Supabase:', err);
      }
    };

    loadProps();
  }, []);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [viewVisit, setViewVisit] = useState<Visit | null>(null);

  // Lease Resolution Logic
  const [showLeaseResolution, setShowLeaseResolution] = useState(false);
  const [pendingLeaseData, setPendingLeaseData] = useState<{ propId: string; winner: string } | null>(null);

  // Default form data
  const initialForm: Partial<Property> = {
    status: 'AVAILABLE',
    type: 'Oficina',
    commune: 'Providencia',
    landM2: 0,
    builtM2: 0,
    priceUF: 0,
    storageM2: 0,
    address: '',
    owner: '',
    condominium: '', // opcional
  };

  const [formData, setFormData] = useState<Partial<Property>>(initialForm);

  const openNew = () => {
    setEditingProp(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (p: Property) => {
    setEditingProp(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  // 🔴 NUEVO: función para eliminar propiedades (solo usada por ADMIN)
  const handleDeleteProperty = (prop: Property) => {
    const ok = window.confirm(
      `¿Eliminar ${prop.address}? Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    // Bloquear eliminar propiedades arrendadas
    if (prop.status === 'LEASED') {
      alert('No puedes eliminar una propiedad que está arrendada.');
      return;
    }

    Service.deleteProperty(prop.id);
    setProperties(Service.getProperties());
    setVisits(Service.getVisits()); // opcional, por si quieres refrescar también visitas
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for status dates
    if (formData.status === 'AVAILABLE' && !formData.vacancyStartDate) {
      alert("Debe ingresar la fecha desde cuándo está disponible (Inicio Vacancia).");
      return;
    }
    if (formData.status === 'NOTICE_GIVEN' && !formData.noticeEndDate) {
      alert("Debe ingresar la fecha de término del contrato actual (Entrega).");
      return;
    }
    if (
      formData.status === 'LEASED' &&
      (!formData.leaseStartDate || !formData.leaseEndDate || !formData.currentTenant)
    ) {
      alert("Debe ingresar los datos del contrato (Cliente, Fechas).");
      return;
    }

    const propId = editingProp
      ? editingProp.id
      : `P-${Math.floor(Math.random() * 90000) + 10000}`;

    const isTransitionToLeased =
      formData.status === 'LEASED' && editingProp?.status !== 'LEASED';

    if (isTransitionToLeased) {
      const pendingVisits = visits.filter(
        (v) => v.propertyId === propId && v.actionStatus === 'PENDING'
      );
      if (pendingVisits.length > 0) {
        setPendingLeaseData({ propId, winner: formData.currentTenant || '' });
        setShowLeaseResolution(true);
        return;
      }
    }

    finalizeSave(propId);
  };

  const finalizeSave = (propId: string) => {
    const newProp: Property = {
      ...(formData as Property),
      id: propId,
      createdAt: editingProp ? editingProp.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (showLeaseResolution && pendingLeaseData) {
      Service.closeNonWinnerCommitments(pendingLeaseData.propId, pendingLeaseData.winner);
      setShowLeaseResolution(false);
      setPendingLeaseData(null);
    }

    Service.saveProperty(newProp);
    setProperties(Service.getProperties());
    setVisits(Service.getVisits());
    setIsModalOpen(false);
  };

  // Filtering & Sorting
  const filteredAndSorted = useMemo(() => {
    let result = properties.filter(p => {
      const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
      const matchesSearch = p.address.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    if (sortPriority) {
      result.sort((a, b) => {
        // Criteria: Price (Highest first) as primary sort
        return b.priceUF - a.priceUF;
      });
    }

    return result;
  }, [properties, filterStatus, search, sortPriority]);

  const getLastVisit = (propertyId: string) => {
    const propVisits = visits.filter(v => v.propertyId === propertyId);
    if (propVisits.length === 0) return null;
    return propVisits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
          Gestión de Stock
        </h2>
        <button
          onClick={openNew}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl flex items-center gap-2 text-sm md:text-base font-medium shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" /> Nueva Propiedad
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-4 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por dirección, ID o comuna..."
            className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm md:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <select
            className="px-3 md:px-4 py-2.5 md:py-3 border border-slate-300 rounded-xl bg-white text-sm md:text-base font-medium focus:outline-none focus:border-sky-500 min-w-[180px] flex-1"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Todos los estados</option>
            <option value="AVAILABLE">Disponibles</option>
            <option value="LEASED">Arrendadas</option>
            <option value="NOTICE_GIVEN">Con Aviso de Entrega</option>
          </select>

          <button
            onClick={() => setSortPriority(!sortPriority)}
            className={`px-3 md:px-4 py-2.5 md:py-3 border rounded-xl text-sm md:text-base font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              sortPriority
                ? 'bg-sky-50 text-sky-700 border-sky-200'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            {sortPriority ? 'Orden: Precio Mayor' : 'Orden: Estándar'}
          </button>
        </div>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAndSorted.map(p => {
          const lastVisit = getLastVisit(p.id);

          return (
            <div
              key={p.id}
              className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6 relative group"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-[11px] md:text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                    {p.id}
                  </span>
                  <StatusBadge status={p.status} />
                  <span className="text-xs md:text-sm text-slate-500 font-medium">
                    {p.type}
                  </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  {/* Editar: lo pueden ver todos */}
                  <button
                    onClick={() => openEdit(p)}
                    className="text-slate-400 hover:text-sky-600 p-1.5 md:p-2 rounded-full bg-white/90 shadow-sm"
                    title="Editar propiedad"
                  >
                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  {/* Eliminar: SOLO para ADMIN */}
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteProperty(p)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 md:p-2 rounded-full bg-white/90 shadow-sm"
                      title="Eliminar propiedad"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                  {p.address}, {p.commune}
                </h3>

                {/* Condominio (solo si existe) */}
                {p.condominium && (
                  <p className="text-xs md:text-sm text-slate-500">
                    Condominio: <span className="font-semibold">{p.condominium}</span>
                  </p>
                )}

                {/* Dueño de la propiedad */}
                <p className="text-xs md:text-sm text-slate-600">
                  Dueño: <span className="font-semibold">{p.owner || 'No informado'}</span>
                </p>

                <div className="flex flex-wrap gap-4 text-xs md:text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" /> <b>{p.builtM2}</b> m² const.
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> <b>{p.landM2}</b> m² terr.
                  </span>
                  <span className="flex items-center gap-1">
                    <Warehouse className="w-4 h-4" />
                    <b>{p.storageM2 || 0}</b> m² bodega
                  </span>
                </div>

                {/* Status Specific Info */}
                <div className="pt-2 flex flex-col md:flex-row gap-3 items-start md:items-center">
                  {p.status === 'AVAILABLE' && (
                    <div className="text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg inline-block text-xs md:text-sm font-medium">
                      Vacancia:{' '}
                      <span className="font-semibold">
                        {getDaysDiff(p.vacancyStartDate)} días
                      </span>{' '}
                      sin arrendar
                    </div>
                  )}
                  {p.status === 'NOTICE_GIVEN' && p.noticeEndDate && (
                    <div className="text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg inline-block text-xs md:text-sm font-medium">
                      Se libera en:{' '}
                      <span className="font-semibold">
                        {Math.ceil(
                          (new Date(p.noticeEndDate).getTime() - new Date().getTime()) /
                            (1000 * 3600 * 24)
                        )}{' '}
                        días
                      </span>{' '}
                      ({p.noticeEndDate})
                    </div>
                  )}
                  {p.status === 'LEASED' && (
                    <div className="text-xs md:text-sm text-slate-600">
                      Arrendatario: <b>{p.currentTenant}</b> | Vence: {p.leaseEndDate}
                    </div>
                  )}

                  {lastVisit ? (
                    <button
                      onClick={() => setViewVisit(lastVisit)}
                      className="text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 text-xs md:text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" /> Última visita: {lastVisit.date}
                    </button>
                  ) : (
                    <div className="text-xs md:text-sm text-slate-400 italic px-3 py-1.5">
                      Sin visitas registradas
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[170px]">
                {/* Precio en UF */}
                <div className="text-2xl md:text-3xl font-semibold text-slate-900">
                  {formatUF(p.priceUF)}
                </div>
                <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider font-medium">
                  Valor lista (UF)
                </div>

                {/* Precio en CLP, calculado con la UF del día */}
                {ufValue !== null && (
                  <>
                    <div className="text-sm font-semibold text-slate-700 mt-2">
                      {formatCLP(p.priceUF * ufValue)}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Referencia hoy en CLP
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODALS */}
      {viewVisit && (
        <VisitDetailModal
          visit={viewVisit}
          onClose={() => setViewVisit(null)}
        />
      )}

      {showLeaseResolution && pendingLeaseData && (
        <LeaseResolutionModal
          propertyId={pendingLeaseData.propId}
          winnerClientName={pendingLeaseData.winner}
          onCancel={() => { setShowLeaseResolution(false); setPendingLeaseData(null); }}
          onComplete={() => finalizeSave(pendingLeaseData.propId)}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 md:p-8 shadow-2xl my-10 max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-5 md:mb-6 border-b pb-3 md:pb-4">
              {editingProp ? `Editar Propiedad ${editingProp.id}` : 'Nueva Propiedad'}
            </h3>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    Dirección
                  </label>
                  <input
                    required
                    className="w-full p-2.5 md:p-3 border border-slate-300 rounded-xl text-sm md:text-base"
                    value={formData.address || ''}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    Precio estimado hoy (CLP)
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="w-full p-2.5 md:p-3 border border-slate-200 rounded-xl text-sm md:text-base bg-slate-50 text-slate-600"
                    value={
                      ufValue !== null && formData.priceUF
                        ? formatCLP(formData.priceUF * ufValue)
                        : '—'
                    }
                  />
                  <p className="text-[11px] md:text-xs text-slate-400 mt-1">
                    Cálculo automático: UF ingresada × UF del día.
                  </p>
                </div>

                {/* ⭐ NUEVO: Condominio (opcional) */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    Condominio (opcional)
                  </label>
                  <input
                    className="w-full p-2.5 md:p-3 border border-slate-300 rounded-xl text-sm md:text-base"
                    value={formData.condominium || ''}
                    onChange={e => setFormData({ ...formData, condominium: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    Comuna
                  </label>
                  <select
                    required
                    className="w-full p-2.5 md:p-3 border border-slate-300 rounded-xl text-sm md:text-base bg-white"
                    value={formData.commune}
                    onChange={e => setFormData({ ...formData, commune: e.target.value })}
                  >
                    {COMUNAS_CHILE.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    Dueño de la propiedad
                  </label>
                  <input
                    className="w-full p-2.5 md:p-3 border border-slate-300 rounded-xl text-sm md:text-base"
                    value={formData.owner || ''}
                    onChange={e => setFormData({ ...formData, owner: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    Tipo Inmueble
                  </label>
                  <select
                    required
                    className="w-full p-2.5 md:p-3 border border-slate-300 rounded-xl text-sm md:text-base bg-white"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    {PROPERTY_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    Precio (UF)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full p-2.5 md:p-3 border border-slate-300 rounded-xl text-sm md:text-base"
                    value={formData.priceUF || ''}
                    onChange={e => setFormData({ ...formData, priceUF: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    M² Terreno
                  </label>
                  <input
                    type="number"
                    className="w-full p-2.5 md:p-3 border border-slate-300 rounded-xl text-sm md:text-base"
                    value={formData.landM2 || ''}
                    onChange={e => setFormData({ ...formData, landM2: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    M² Construidos
                  </label>
                  <input
                    type="number"
                    className="w-full p-2.5 md:p-3 border border-slate-300 rounded-xl text-sm md:text-base"
                    value={formData.builtM2 || ''}
                    onChange={e => setFormData({ ...formData, builtM2: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    M² Bodega
                  </label>
                  <input
                    type="number"
                    className="w-full p-2.5 md:p-3 border border-slate-300 rounded-xl text-sm md:text-base"
                    value={formData.storageM2 || ''}
                    onChange={e => setFormData({ ...formData, storageM2: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-5 md:p-6 rounded-xl border border-slate-200">
                <h4 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
                  Estado y Ocupación
                </h4>
                <div className="mb-4">
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-2">
                    Estado Actual
                  </label>
                  <select
                    className="w-full p-2.5 md:p-3 border border-slate-300 rounded-xl text-sm md:text-base bg-white"
                    value={formData.status}
                    onChange={e =>
                      setFormData({ ...formData, status: e.target.value as PropertyStatus })
                    }
                  >
                    <option value="AVAILABLE">DISPONIBLE</option>
                    <option value="LEASED">ARRENDADA</option>
                    <option value="NOTICE_GIVEN">CON AVISO DE ENTREGA</option>
                  </select>
                </div>

                {formData.status === 'AVAILABLE' && (
                  <div className="bg-white p-4 rounded-lg border border-slate-200 animate-in fade-in">
                    <label className="block text-xs md:text-sm font-semibold text-sky-700 mb-2">
                      Disponible desde (Inicio Vacancia)
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                      value={formData.vacancyStartDate || ''}
                      onChange={e =>
                        setFormData({ ...formData, vacancyStartDate: e.target.value })
                      }
                    />
                    <p className="text-[11px] md:text-xs text-slate-500 mt-1">
                      Se usa para calcular días de vacancia.
                    </p>
                  </div>
                )}

                {formData.status === 'NOTICE_GIVEN' && (
                  <div className="bg-white p-4 rounded-lg border border-slate-200 animate-in fade-in">
                    <label className="block text-xs md:text-sm font-semibold text-amber-700 mb-2">
                      Fecha de Entrega / Fin Contrato
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                      value={formData.noticeEndDate || ''}
                      onChange={e =>
                        setFormData({ ...formData, noticeEndDate: e.target.value })
                      }
                    />
                    <p className="text-[11px] md:text-xs text-slate-500 mt-1">
                      El sistema cambiará automáticamente a "Disponible" después de esta fecha.
                    </p>
                  </div>
                )}

                {formData.status === 'LEASED' && (
                  <div className="bg-white p-4 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                    <div className="md:col-span-2">
                      <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1">
                        Nombre Cliente/Empresa
                      </label>
                      <input
                        required
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                        value={formData.currentTenant || ''}
                        onChange={e =>
                          setFormData({ ...formData, currentTenant: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1">
                        Inicio Contrato
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                        value={formData.leaseStartDate || ''}
                        onChange={e =>
                          setFormData({ ...formData, leaseStartDate: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1">
                        Fin Contrato
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                        value={formData.leaseEndDate || ''}
                        onChange={e =>
                          setFormData({ ...formData, leaseEndDate: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1">
                        Tipo Contrato
                      </label>
                      <select
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                        value={formData.leaseType || 'FIXED'}
                        onChange={e =>
                          setFormData({ ...formData, leaseType: e.target.value as any })
                        }
                      >
                        <option value="FIXED">Plazo Fijo</option>
                        <option value="RENEWABLE">Renovable</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-3 md:pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 md:py-3 text-sm md:text-base text-slate-500 font-medium hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 md:py-3 bg-sky-600 text-white text-sm md:text-base font-semibold rounded-xl hover:bg-sky-700 shadow-md"
                >
                  Guardar Propiedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. VISITS PAGE
const VisitsPage = () => {
  const [visits, setVisits] = useState<Visit[]>(Service.getVisits());
  const [properties] = useState<Property[]>(Service.getProperties());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewVisit, setViewVisit] = useState<Visit | null>(null);
  const [viewHistoryClient, setViewHistoryClient] = useState<string | null>(null);
  const [selectedVisitForAction, setSelectedVisitForAction] = useState<Visit | null>(null);

  // Filtros de búsqueda
  const [searchText, setSearchText] = useState('');
  const [filterExec, setFilterExec] = useState<'ALL' | string>('ALL');
  const [filterBroker, setFilterBroker] = useState<'ALL' | 'WITH' | 'WITHOUT'>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const executives = Array.from(
    new Set(USERS.filter(u => u.role !== 'ADMIN').map(u => u.name))
  );

  // New Visit Form State
  const initialForm: Partial<Visit> = {
    date: new Date().toISOString().split('T')[0],
    executiveName: executives[0] || 'Juan Pérez',
    hasBroker: false,
    actionStatus: 'PENDING',
  };
  const [formData, setFormData] = useState<Partial<Visit>>(initialForm);

  const refreshVisits = () => {
    setVisits(Service.getVisits());
  };

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.propertyId) {
      alert('Seleccione una propiedad');
      return;
    }

    const newVisit: Visit = {
      ...formData as Visit,
      id: `V-${Math.floor(Math.random() * 90000) + 10000}`,
      createdAt: new Date().toISOString(),
    };

    Service.addVisit(newVisit);
    refreshVisits();
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  // FILTRO + ORDEN de visitas
  const filteredVisits = useMemo(() => {
    return visits.filter(v => {
      const prop = properties.find(p => p.id === v.propertyId);

      const matchesSearch =
        searchText.trim() === '' ||
        v.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
        v.id.toLowerCase().includes(searchText.toLowerCase()) ||
        v.propertyId.toLowerCase().includes(searchText.toLowerCase()) ||
        (prop?.address || '').toLowerCase().includes(searchText.toLowerCase());

      const matchesExec = filterExec === 'ALL' || v.executiveName === filterExec;

      const matchesBroker =
        filterBroker === 'ALL' ||
        (filterBroker === 'WITH' && v.hasBroker) ||
        (filterBroker === 'WITHOUT' && !v.hasBroker);

      const visitTime = new Date(v.date).getTime();
      const matchesFrom = fromDate === '' || visitTime >= new Date(fromDate).getTime();
      const matchesTo = toDate === '' || visitTime <= new Date(toDate).getTime();

      return matchesSearch && matchesExec && matchesBroker && matchesFrom && matchesTo;
    });
  }, [visits, properties, searchText, filterExec, filterBroker, fromDate, toDate]);

  const sortedVisits = useMemo(
    () =>
      [...filteredVisits].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [filteredVisits]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Bitácora de Visitas</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm md:text-base font-semibold shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" /> Registrar Visita
        </button>
      </div>

      {/* Filtros de búsqueda */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda libre */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, dirección, ID visita o ID propiedad..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>

          {/* Ejecutivo */}
          <select
            className="px-4 py-2.5 border border-slate-300 rounded-xl bg-white text-sm font-medium focus:outline-none focus:border-sky-500 min-w-[180px]"
            value={filterExec}
            onChange={e => setFilterExec(e.target.value)}
          >
            <option value="ALL">Todos los ejecutivos</option>
            {executives.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          {/* Con / sin corredor */}
          <select
            className="px-4 py-2.5 border border-slate-300 rounded-xl bg-white text-sm font-medium focus:outline-none focus:border-sky-500 min-w-[180px]"
            value={filterBroker}
            onChange={e =>
              setFilterBroker(e.target.value as 'ALL' | 'WITH' | 'WITHOUT')
            }
          >
            <option value="ALL">Con y sin corredor</option>
            <option value="WITH">Sólo con corredor</option>
            <option value="WITHOUT">Sólo sin corredor</option>
          </select>
        </div>

        {/* Rango de fechas */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Desde fecha
            </label>
            <input
              type="date"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-sky-500"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Hasta fecha
            </label>
            <input
              type="date"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-sky-500"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Lista de visitas */}
      <div className="grid grid-cols-1 gap-4">
        {sortedVisits.map(v => {
          const prop = properties.find(p => p.id === v.propertyId);
          return (
            <div
              key={v.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-1 rounded text-xs">
                    {v.date}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    {v.id}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {prop?.address || v.propertyId}
                </h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <button
                      onClick={() => setViewHistoryClient(v.clientName)}
                      className="hover:text-sky-600 hover:underline font-medium"
                    >
                      {v.clientName}
                    </button>
                  </p>
                  <p className="pl-6 text-xs text-slate-500">
                    Ejecutivo: {v.executiveName}
                  </p>
                  {v.hasBroker && (
                    <p className="pl-6 text-xs text-sky-700">
                      Corredor: {v.brokerName}
                    </p>
                  )}
                </div>

                <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm italic text-slate-600">
                  "{v.comments}"
                </div>
              </div>

              <div className="md:w-72 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                <div className="mb-3">
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">
                    Compromiso Actual
                  </label>
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-semibold text-slate-900 leading-tight">
                      {v.nextAction}
                    </p>
                    <StatusBadge status={v.actionStatus} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Fecha: {v.nextActionDate}
                  </p>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setViewVisit(v)}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> Ver Detalle
                  </button>
                  <button
                    onClick={() => setSelectedVisitForAction(v)}
                    className="flex-1 py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3 h-3" /> Gestionar
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {sortedVisits.length === 0 && (
          <p className="text-center text-slate-400 py-10">
            No hay visitas que coincidan con los filtros.
          </p>
        )}
      </div>

      {/* MODAL: Nueva visita */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">
              Registrar Nueva Visita
            </h3>

            <form onSubmit={handleAddVisit} className="space-y-6">
              {/* Datos básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Propiedad Visitada
                  </label>
                  <select
                    required
                    className="w-full p-3 border rounded-xl text-base bg-white"
                    value={formData.propertyId || ''}
                    onChange={e =>
                      setFormData({ ...formData, propertyId: e.target.value })
                    }
                  >
                    <option value="">Seleccionar...</option>
                    {properties
                      .filter(p => p.status !== 'LEASED')
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.address} ({formatUF(p.priceUF)})
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Fecha de Visita
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-3 border rounded-xl text-base"
                    value={formData.date}
                    onChange={e =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Ejecutivo Responsable
                  </label>
                  <select
                    required
                    className="w-full p-3 border rounded-xl text-base bg-white"
                    value={formData.executiveName}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        executiveName: e.target.value,
                      })
                    }
                  >
                    {executives.map(name => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cliente */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" /> Datos del Cliente
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      required
                      className="w-full p-3 border rounded-xl"
                      placeholder="Ej: Juan Pérez"
                      value={formData.clientName || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          clientName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      className="w-full p-3 border rounded-xl"
                      type="tel"
                      placeholder="+569..."
                      value={formData.clientPhone || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          clientPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      className="w-full p-3 border rounded-xl"
                      type="email"
                      placeholder="cliente@email.com"
                      value={formData.clientEmail || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          clientEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded text-sky-600"
                      checked={!!formData.hasBroker}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          hasBroker: e.target.checked,
                        })
                      }
                    />
                    <span className="text-sm font-bold text-slate-700">
                      ¿Asiste con Corredor?
                    </span>
                  </label>
                  {formData.hasBroker && (
                    <input
                      className="w-full p-3 border rounded-xl mt-2"
                      placeholder="Nombre del Corredor / Empresa"
                      value={formData.brokerName || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          brokerName: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              </div>

              {/* Comentarios */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Resultado / Comentarios
                </label>
                <textarea
                  required
                  className="w-full p-3 border rounded-xl h-24"
                  placeholder="Resumen de la visita, interés del cliente, etc."
                  value={formData.comments || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      comments: e.target.value,
                    })
                  }
                />
              </div>

              {/* Compromiso */}
              <div className="bg-sky-50 p-6 rounded-xl border border-sky-100">
                <h4 className="font-bold text-sky-900 mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" /> Compromiso / Siguiente Paso
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Acción a Realizar
                    </label>
                    <input
                      required
                      className="w-full p-3 border rounded-xl"
                      placeholder="Ej: Enviar planos, Llamar para respuesta..."
                      value={formData.nextAction || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          nextAction: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Fecha Límite
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full p-3 border rounded-xl"
                      value={formData.nextActionDate || ''}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          nextActionDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 shadow-lg"
                >
                  Registrar Visita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View / Gestionar / Historial cliente */}
      {viewVisit && (
        <VisitDetailModal visit={viewVisit} onClose={() => setViewVisit(null)} />
      )}
      {selectedVisitForAction && (
        <ActionModal
          visit={selectedVisitForAction}
          onClose={() => setSelectedVisitForAction(null)}
          onUpdate={refreshVisits}
        />
      )}
      {viewHistoryClient && (
        <ClientHistoryModal
          clientName={viewHistoryClient}
          visits={visits}
          onClose={() => setViewHistoryClient(null)}
        />
      )}
    </div>
  );
};



// 4. REPORTS PAGE
const ReportsPage = () => {
  const [activeSubTab, setActiveSubTab] = useState<'EXECUTIVES' | 'STOCK' | 'STALE'>('EXECUTIVES');
  const visits = useMemo(() => Service.getVisits(), []);
  const properties = useMemo(() => Service.getProperties(), []);
  const executives = Array.from(new Set(USERS.filter(u => u.role !== 'ADMIN').map(u => u.name)));

  // --- TAB 1: Executives Logic ---
  const executivesData = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const data = executives.map(exName => {
      const exVisits = visits.filter(v => v.executiveName === exName);
      
      const thisWeek = exVisits.filter(v => new Date(v.date) >= startOfWeek).length;
      const thisMonth = exVisits.filter(v => new Date(v.date) >= startOfMonth).length;
      const prevMonth = exVisits.filter(v => {
        const d = new Date(v.date);
        return d >= startOfPrevMonth && d <= endOfPrevMonth;
      }).length;

      return {
        name: exName,
        thisWeek,
        thisMonth,
        prevMonth
      };
    });

    return data;
  }, [visits, executives]);

  // --- TAB 2: Stock Logic ---
  const stockData = useMemo(() => {
    // Current
    const available = properties.filter(p => p.status === 'AVAILABLE').length;
    const leased = properties.filter(p => p.status === 'LEASED').length;
    const notice = properties.filter(p => p.status === 'NOTICE_GIVEN').length;

    // Simulated Previous Period (Mocked for visual, as we don't have full history logs)
    // In a real app, this would come from historical snapshots.
    // For demo: assume slight variation.
    const prevAvailable = Math.max(0, available + Math.floor(Math.random() * 3) - 1);
    const prevLeased = Math.max(0, leased - Math.floor(Math.random() * 2));
    const prevNotice = Math.max(0, notice + 1);

    // VACANCY DAYS LOGIC
    const availableProps = properties.filter(p => p.status === 'AVAILABLE');
    const calculateAvgVacancy = (props: Property[]) => {
        if (props.length === 0) return 0;
        const totalDays = props.reduce((acc, p) => {
             let start = new Date(p.createdAt);
             if (p.vacancyStartDate) start = new Date(p.vacancyStartDate);
             
             const now = new Date();
             const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 3600 * 24));
             return acc + (diff > 0 ? diff : 0);
        }, 0);
        return Math.round(totalDays / props.length);
    };

    const currentAvg = calculateAvgVacancy(availableProps);
    
    // Mock history for Vacancy Evolution
    const vacancyHistory = [
        { label: 'Hace 6 meses', value: Math.max(0, currentAvg + 12) },
        { label: 'Hace 3 meses', value: Math.max(0, currentAvg + 5) },
        { label: 'Mes anterior', value: Math.max(0, currentAvg + 2) },
        { label: 'Hoy', value: currentAvg }
    ];

    return {
      current: [
        { label: 'Disponibles', value: available, color: '#10b981' }, // emerald-500
        { label: 'Arrendadas', value: leased, color: '#64748b' }, // slate-500
        { label: 'Con Aviso', value: notice, color: '#f59e0b' } // amber-500
      ],
      previous: [
        { label: 'Disponibles', value: prevAvailable, color: '#10b981' }, 
        { label: 'Arrendadas', value: prevLeased, color: '#64748b' }, 
        { label: 'Con Aviso', value: prevNotice, color: '#f59e0b' } 
      ],
      vacancyHistory
    };
  }, [properties]);

  // --- TAB 3: Stale Properties Logic ---
  const staleData = useMemo(() => {
    const alerts = Service.getAlerts();
    const currentFromAlerts = alerts.staleProperties.length; // MISMO NÚMERO QUE EN ALERTAS STOCK

    // Generate last 4–5 weeks points (histórico aproximado)
    const points: { label: string; value: number }[] = [];
    const now = new Date();
    
    // Calcula cuántas habrían estado críticas en una fecha pasada
    const getStaleCountForDate = (date: Date) => {
       return properties.filter(p => {
          if (p.status === 'LEASED') return false;
          const visitsUntilDate = visits.filter(
            v => v.propertyId === p.id && new Date(v.date) <= date
          );
          
          if (visitsUntilDate.length === 0) {
             const created = new Date(p.createdAt);
             return (date.getTime() - created.getTime()) / (1000 * 3600 * 24) > 30;
          }

          const lastVisit = visitsUntilDate.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];
          const lastVisitDate = new Date(lastVisit.date);
          return (date.getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24) > 30;
       }).length;
    };

    // Últimas 5 semanas
    for (let i = 4; i >= 0; i--) {
       const d = new Date(now);
       d.setDate(d.getDate() - i * 7);
       const label = i === 0 ? 'Hoy' : `Hace ${i} sem`;
       points.push({ label, value: getStaleCountForDate(d) });
    }

    // Aseguramos que el punto "Hoy" coincida 100% con Alertas Stock
    if (points.length > 0) {
      points[points.length - 1].value = currentFromAlerts;
    }

    // Métrica de "recuperadas"
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const staleThen = getStaleCountForDate(thirtyDaysAgo);
    const staleNow = currentFromAlerts;
    const recovered = Math.max(0, staleThen - staleNow + 2); // sigue siendo aproximado

    return { points, recovered, current: currentFromAlerts };
  }, [properties, visits]);


  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Informes y Métricas</h2>
      </div>

      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row gap-2 bg-white p-1 rounded-xl border border-slate-200">
         <button 
           onClick={() => setActiveSubTab('EXECUTIVES')}
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeSubTab === 'EXECUTIVES' ? 'bg-amber-100 text-amber-800 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
         >
           <User className="w-4 h-4" /> Gestión por Ejecutivo
         </button>
         <button 
           onClick={() => setActiveSubTab('STOCK')}
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeSubTab === 'STOCK' ? 'bg-amber-100 text-amber-800 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
         >
           <PieChartIcon className="w-4 h-4" /> Variación de Stock
         </button>
         <button 
           onClick={() => setActiveSubTab('STALE')}
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${activeSubTab === 'STALE' ? 'bg-amber-100 text-amber-800 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
         >
           <History className="w-4 h-4" /> Gestión Stock Crítico
         </button>
      </div>

      {/* TAB CONTENT */}
      {activeSubTab === 'EXECUTIVES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2">
           <SimpleBarChart
title="Visitas esta Semana"
data={executivesData.map((d) => ({
// mostramos solo el primer nombre en la etiqueta
label: d.name.split(' ')[0],
// usamos las visitas reales de esa persona esta semana
value: d.thisWeek,
}))}
/>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-700 mb-6">Comparativa Mensual</h4>
             <div className="space-y-6">
                {executivesData.map((d, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-slate-700">{d.name}</span>
                      <span className="text-slate-500">Act: <b className="text-slate-800">{d.thisMonth}</b> vs Ant: {d.prevMonth}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex relative">
                       {/* Prev Month Marker (Ghost bar) */}
                       <div className="bg-slate-300 h-full absolute top-0 left-0 opacity-50" style={{ width: `${Math.min((d.prevMonth / 20) * 100, 100)}%` }}></div>
                       {/* Current Month Bar */}
                       <div className="bg-amber-500 h-full relative z-10" style={{ width: `${Math.min((d.thisMonth / 20) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
             <p className="text-xs text-slate-400 mt-6 italic text-center">La barra gris indica el mes anterior.</p>
           </div>
        </div>
      )}

      {activeSubTab === 'STOCK' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-2">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SimplePieChart 
                title="Distribución Actual" 
                data={stockData.current}
              />
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
                  <h4 className="font-bold text-slate-700 mb-6">Variación vs Período Anterior</h4>
                  <div className="space-y-4">
                    {stockData.current.map((curr, i) => {
                        const prev = stockData.previous[i];
                        const diff = curr.value - prev.value;
                        return (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: curr.color }}></div>
                              <span className="font-medium text-slate-700">{curr.label}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold text-slate-800">{curr.value}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${diff > 0 ? 'bg-green-100 text-green-700' : (diff < 0 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600')}`}>
                                  {diff > 0 ? <TrendingUp className="w-3 h-3"/> : (diff < 0 ? <TrendingDown className="w-3 h-3"/> : null)}
                                  {diff > 0 ? `+${diff}` : diff}
                                </span>
                            </div>
                          </div>
                        );
                    })}
                  </div>
                  <p className="text-xs text-slate-400 mt-4 italic text-center">Comparativa respecto al cierre del mes anterior.</p>
              </div>
           </div>

           <SimpleLineChart 
              title="Evolución Promedio Días de Vacancia" 
              data={stockData.vacancyHistory} 
           />
        </div>
      )}

      {activeSubTab === 'STALE' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-2">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                 <p className="text-xs font-bold text-orange-600 uppercase">Propiedades Críticas Hoy</p>
                 <p className="text-3xl font-bold text-orange-800 mt-2">{staleData.current}</p>
                 <p className="text-xs text-orange-600/70 mt-1">{'>'}30 días sin visitas</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                 <p className="text-xs font-bold text-blue-600 uppercase">Recuperadas este Mes</p>
                 <p className="text-3xl font-bold text-blue-800 mt-2">{staleData.recovered}</p>
                 <p className="text-xs text-blue-600/70 mt-1">Salieron de la lista</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                 <p className="text-xs font-bold text-green-600 uppercase">Tendencia</p>
                 <p className="text-lg font-bold text-green-800 mt-3 flex items-center justify-center gap-2">
                   {staleData.points[staleData.points.length-1].value < staleData.points[0].value ? (
                     <><TrendingDown className="w-5 h-5"/> A LA BAJA</>
                   ) : (
                     <><TrendingUp className="w-5 h-5"/> ESTABLE</>
                   )}
                 </p>
              </div>
           </div>

           <SimpleLineChart 
              title="Evolución Histórica: Propiedades sin visitas (+30 días)"
              data={staleData.points}
           />
           <p className="text-sm text-slate-500 italic text-center px-4">
             El gráfico muestra cuántas propiedades se encontraban en estado crítico (sin visitas por más de 30 días) al cierre de cada semana.
           </p>
        </div>
      )}
    </div>
  );
};

/*
// 5. MAIN APP
// Calcula visitas por ejecutivo en la semana actual (lunes a domingo)
function getWeeklyExecutiveStats() {
  const visits = Service.getVisits(); // usamos las visitas guardadas en localStorage
  const now = new Date();

  // calcular lunes de esta semana
  const day = now.getDay(); // 0 = domingo, 1 = lunes, ...
  const diffToMonday = (day + 6) % 7;

  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const counters: Record<string, number> = {};

  for (const v of visits) {
    const date = new Date(v.date);
    if (date >= monday && date <= sunday) {
      const exec = (v as any).executive || (v as any).ejecutivo || "Sin Ejecutivo";
      counters[exec] = (counters[exec] || 0) + 1;
    }
  }

  return counters;
}
*/

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

const [ufValue, setUfValue] = useState<number | null>(null);
// eliminamos ufDate porque no la usas
const [ufError, setUfError] = useState<string | null>(null);

useEffect(() => {
  const fetchUF = async () => {
    try {
      const res = await fetch('https://mindicador.cl/api/uf');
      const data = await res.json();

      const latest = data.serie && data.serie[0];
      if (latest) {
        setUfValue(latest.valor);
        // eliminamos esta línea porque ya no existe ufDate:
        // setUfDate(new Date(latest.fecha).toLocaleDateString('es-CL'));
      } else {
        setUfError('Sin datos de UF');
      }
    } catch (err) {
      console.error(err);
      setUfError('No se pudo cargar la UF');
    }
  };

  fetchUF();
}, []);




  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

const todayStr = new Date().toLocaleDateString('es-CL');

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-600 bg-slate-50">
      {/* Sidebar */}
           {/* Sidebar */}
      {/* Sidebar */}
<aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col shadow-xl z-20">
  {/* Logo / Marca */}
  <div className="px-6 pt-8 pb-6 border-b border-slate-800">
    <h1 className="text-2xl font-bold tracking-tight">
      SAUMA <span className="text-sky-400">HERMANOS</span>
    </h1>
    <p className="text-slate-400 text-sm mt-1">Inmobiliaria</p>
  </div>

  {/* Menú principal */}
  <nav className="flex-1 px-4 py-6 space-y-2">
    {/* Dashboard */}
    <button
      onClick={() => setActiveTab('dashboard')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
        ${
          activeTab === 'dashboard'
            ? 'bg-sky-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <span className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
        <LayoutDashboard className="w-4 h-4" />
      </span>
      <span>Dashboard</span>
    </button>

    {/* Propiedades */}
    <button
      onClick={() => setActiveTab('properties')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
        ${
          activeTab === 'properties'
            ? 'bg-sky-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <span className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
        <Building2 className="w-4 h-4" />
      </span>
      <span>Propiedades</span>
    </button>

    {/* Bitácora visitas */}
    <button
      onClick={() => setActiveTab('visits')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
        ${
          activeTab === 'visits'
            ? 'bg-sky-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <span className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
        <ClipboardList className="w-4 h-4" />
      </span>
      <span>Bitácora Visitas</span>
    </button>

    {/* Informes */}
    <button
      onClick={() => setActiveTab('reports')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
        ${
          activeTab === 'reports'
            ? 'bg-sky-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <span className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
        <FileBarChart className="w-4 h-4" />
      </span>
      <span>Informes</span>
    </button>

    {/* Alertas Stock */}
    <button
      onClick={() => setActiveTab('stale')}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
        ${
          activeTab === 'stale'
            ? 'bg-sky-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <span className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
        <AlertCircle className="w-4 h-4" />
      </span>
      <span>Alertas Stock</span>
    </button>
  </nav>

  {/* Usuario / Cerrar sesión */}
  <div className="px-6 py-5 border-t border-slate-800">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center font-bold text-white">
        {user.name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-bold text-white">{user.name}</p>
        <p className="text-xs text-slate-500">
          {user.role === 'ADMIN' ? 'Administrador' : 'Ejecutivo'}
        </p>
      </div>
    </div>
    <button
      onClick={() => setUser(null)}
      className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm font-bold py-2"
    >
      <LogOut className="w-4 h-4" /> Cerrar Sesión
    </button>
  </div>
</aside>


      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto max-h-screen pb-10">
      {/* Barra UF + Fecha */}
<div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 
                bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm text-sm">

  <span>
    Fecha hoy: <b>{todayStr}</b>
  </span>

  <span>
    UF hoy:{" "}
    {ufError ? (
      <span className="text-red-600">{ufError}</span>
    ) : ufValue ? (
      <b>{ufValue.toLocaleString("es-CL")} CLP</b>
    ) : (
      "cargando..."
    )}
  </span>

</div>

        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
           <span className="font-bold">SAUMA</span>
           <button className="p-2"><Menu className="w-6 h-6"/></button>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto pb-20">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'properties' && (<PropertiesPage user={user} ufValue={ufValue} />
)}
          {activeTab === 'visits' && <VisitsPage />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'alerts' && <Dashboard setActiveTab={setActiveTab} />} {/* Redirect to dashboard for now */}
          {activeTab === 'stale' && (
            <div>
               <h2 className="text-2xl font-bold text-slate-800 mb-6">Stock Sin Movimiento</h2>
               <p className="text-slate-500 mb-8">Listado de propiedades que no han recibido visitas en los últimos 30 días.</p>
               {/* Reusing logic from dashboard but full view could be here. For brevity, showing simple list */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="space-y-4">
                    {Service.getAlerts().staleProperties.map(p => (
                       <div key={p.id} className="p-4 border rounded-xl flex justify-between items-center hover:bg-slate-50">
                          <div>
                             <p className="font-bold text-slate-800">{p.address}</p>
                             <p className="text-sm text-slate-500">{p.commune} - {formatUF(p.priceUF)}</p>
                          </div>
                          <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">REVISAR PRECIO / FOTOS</span>
                       </div>
                    ))}
                    {Service.getAlerts().staleProperties.length === 0 && <p className="text-center text-slate-400 py-8">Todo el stock tiene movimiento reciente.</p>}
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default App
