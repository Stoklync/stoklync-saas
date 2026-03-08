'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import {
  DndContext, DragEndEvent, useDraggable, useDroppable, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { supabase } from '@/lib/supabase';
import VisualBuilder from './VisualBuilder';
import {
  LayoutDashboard, LogOut, Loader2, Globe, Users, Megaphone, LifeBuoy,
  Settings, UserPlus, CreditCard, ExternalLink, Mail, Phone, Plus, Trash2, MessageCircle, X,
  Sparkles, ShoppingBag, Clock, PenTool, Layout, Send, Shield, ArrowRight,
} from 'lucide-react';

const WEBSITE_TEMPLATES = {
  product: {
    hero_title: 'Products That Deliver',
    hero_subtitle: 'Quality products. Fast delivery. Trusted by businesses.',
    value_line: 'Shop smarter.',
    process_title: 'How it works',
    process_subtitle: 'Browse, order, receive. We handle logistics so you focus on growth.',
    about_title: 'About us',
    about_body1: 'We supply quality products with reliable delivery. Our catalog serves businesses of all sizes.',
    about_body2: '',
    stock_quote_title: 'Request a quote',
    stock_quote_subtitle: 'Tell us what you need. We reply within 24 hours.',
  },
  service: {
    hero_title: 'Services That Scale',
    hero_subtitle: 'Expert support when you need it.',
    value_line: 'Your success is our priority.',
    process_title: 'Our services',
    process_subtitle: 'From setup to ongoing support, we guide you through every step.',
    about_title: 'About us',
    about_body1: 'We deliver professional services with clear deliverables and transparent pricing.',
    about_body2: '',
    stock_quote_title: 'Get started',
    stock_quote_subtitle: 'Describe your needs. We will be in touch with a tailored proposal.',
  },
  consulting: {
    hero_title: 'Strategic Consulting',
    hero_subtitle: 'High-ticket advice for serious growth.',
    value_line: 'Think bigger.',
    process_title: 'Our approach',
    process_subtitle: 'Discovery, strategy, execution. We partner with you to achieve measurable outcomes.',
    about_title: 'About us',
    about_body1: 'We help leaders make better decisions. Our consultants bring deep expertise across strategy, operations, and growth.',
    about_body2: '',
    stock_quote_title: 'Book a call',
    stock_quote_subtitle: 'Let us understand your challenge. We will propose a clear path forward.',
  },
};

type Tab = 'home' | 'website' | 'crm' | 'marketing' | 'support' | 'team' | 'settings' | 'billing';
type WebsiteSubTab = 'preview' | 'branding' | 'contact' | 'cms' | 'visual';
type CrmSubTab = 'pipeline' | 'contacts';
type CrmViewType = 'consulting' | 'deals' | 'product' | 'services';
const DEALS_STAGES = ['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
const CONSULTING_STAGES = ['DISCOVERY', 'STRATEGY_SESSION', 'PROPOSAL', 'CONTRACT_SIGNED'];

const INVITEABLE_ROLES = [
  { value: 'ADMIN' as const, label: 'Admin', desc: 'Team, settings, invite. No billing access' },
  { value: 'SALES_AGENT' as const, label: 'Sales Agent', desc: 'Leads, CRM, no billing access' },
  { value: 'FINANCE_MANAGER' as const, label: 'Finance Manager', desc: 'Finance & billing (subscription, payments)' },
  { value: 'MARKETING_MANAGER' as const, label: 'Marketing', desc: 'Campaigns, bulk emails' },
  { value: 'SUPPORT_MANAGER' as const, label: 'Support', desc: 'Tickets, customer support' },
  { value: 'OPERATIONS_MANAGER' as const, label: 'Operations', desc: 'Orders, inventory, logistics' },
];

interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Permissions {
  invite_team?: boolean;
  manage_billing?: boolean;
  manage_finance?: boolean;
  edit_branding?: boolean;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  stage: string;
  source: string;
  next_action?: string;
  created_at: string;
}

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  contact_email?: string;
  message?: string;
  status: string;
  priority: string;
  assignee?: string;
  source?: string;
  created_at: string;
}

function SalesChart({ weeklyData }: { weeklyData: number[] }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const data = weeklyData.length >= 7 ? weeklyData : [0, 0, 0, 0, 0, 0, 0];
  useEffect(() => {
    let chart: { destroy: () => void } | null = null;
    import('chart.js/auto').then((Chart) => {
      if (!chartRef.current) return;
      chart = new Chart.default(chartRef.current, {
        type: 'line',
        data: {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          datasets: [{
            data,
            borderColor: '#10b981',
            borderWidth: 3,
            pointRadius: 0,
            fill: true,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 } } },
          },
        },
      });
    });
    return () => { chart?.destroy(); };
  }, [data.join(',')]);
  return (
    <div className="h-[80px] w-full">
      <canvas ref={chartRef} />
    </div>
  );
}

function DroppableColumn({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${className || ''} ${isOver ? 'ring-2 ring-indigo-400 ring-opacity-50' : ''}`}>
      {children}
    </div>
  );
}

function DraggableCard({ lead, pipelineStages, onStageChange, onSelect, isDragging }: {
  lead: Lead; pipelineStages: string[]; onStageChange: (leadId: string, stage: string) => void; onSelect: () => void; isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: lead.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={onSelect}
      className={`p-3 bg-white rounded-lg border border-slate-200 text-sm cursor-grab active:cursor-grabbing hover:border-emerald-300 transition-colors ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
      onClickCapture={(e) => { if ((e.target as HTMLElement).tagName === 'SELECT' || (e.target as HTMLElement).closest('select')) e.stopPropagation(); }}>
      <p className="font-medium text-slate-900 truncate">{lead.name}</p>
      <p className="text-xs text-slate-500 truncate">{lead.company || lead.email}</p>
      <select value={pipelineStages.includes(lead.stage || '') ? lead.stage : pipelineStages[0]} onChange={(e) => onStageChange(lead.id, e.target.value)} className="mt-2 w-full text-xs border border-slate-200 rounded px-2 py-1" onClick={(e) => e.stopPropagation()}>
        {pipelineStages.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
      </select>
      <div className="mt-2 flex gap-1">
        {lead.email && <a href={`mailto:${lead.email}`} className="p-1 rounded hover:bg-slate-100" title="Email" onClick={(e) => e.stopPropagation()}><Mail size={12} /></a>}
        {lead.phone && <a href={`tel:${lead.phone}`} className="p-1 rounded hover:bg-slate-100" title="Call" onClick={(e) => e.stopPropagation()}><Phone size={12} /></a>}
      </div>
    </div>
  );
}

function KanbanPipeline({ pipelineStages, leadsByStage, stageForLead, updateLeadStage, setSelectedLead, setLeadNextAction }: {
  pipelineStages: string[];
  leadsByStage: Record<string, Lead[]>;
  stageForLead: (l: Lead) => string;
  updateLeadStage: (leadId: string, stage: string) => void;
  setSelectedLead: (l: Lead) => void;
  setLeadNextAction: (s: string) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const handleDragEnd = (e: DragEndEvent) => {
    const leadId = e.active.id as string;
    const overId = String(e.over?.id || '');
    let targetStage = pipelineStages.includes(overId) ? overId : null;
    if (!targetStage) {
      const overLead = Object.values(leadsByStage).flat().find((l) => l.id === overId);
      if (overLead) targetStage = stageForLead(overLead);
    }
    if (targetStage) updateLeadStage(leadId, targetStage);
  };
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[420px]">
        {pipelineStages.map((stage) => (
          <DroppableColumn key={stage} id={stage} className={`flex-shrink-0 w-52 rounded-xl p-4 flex flex-col border shadow-sm ${stage === 'LOST' ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/80 border-slate-200'}`}>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
              <span className="font-bold text-xs text-slate-600 uppercase">{stage.replace(/_/g, ' ')}</span>
              <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{leadsByStage[stage]?.length || 0}</span>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto min-h-[120px]">
              {(leadsByStage[stage] || []).map((l) => (
                <DraggableCard key={l.id} lead={l} pipelineStages={pipelineStages} onStageChange={updateLeadStage}
                  onSelect={() => { setSelectedLead(l); setLeadNextAction(l.next_action || ''); }} />
              ))}
            </div>
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}

function computeNextBestAction(leads: Lead[]): { message: string; cta: string; tab: Tab } | null {
  const byStage = (s: string) => leads.filter((l) => (l.stage || 'NEW') === s).length;
  const proposal = byStage('PROPOSAL');
  const negotiation = byStage('NEGOTIATION');
  const discovery = byStage('DISCOVERY');
  const strategy = byStage('STRATEGY_SESSION');
  if (proposal >= 2) return { message: `${proposal} leads in Proposal – follow up?`, cta: 'View pipeline', tab: 'crm' as Tab };
  if (negotiation >= 1) return { message: `${negotiation} lead(s) in Negotiation – close the deal?`, cta: 'View pipeline', tab: 'crm' as Tab };
  if (strategy >= 2) return { message: `${strategy} in Strategy Session – send proposal?`, cta: 'Go to CRM', tab: 'crm' as Tab };
  if (discovery >= 3) return { message: `${discovery} leads in Discovery – qualify and advance`, cta: 'View leads', tab: 'crm' as Tab };
  if (leads.length === 0) return { message: 'No leads yet – get them from your site or ads', cta: 'Setup website', tab: 'website' as Tab };
  return null;
}

function BentoHome({ userName, orgName, leadCount, topLeads, leads, serviceHours, productRevenue, weeklyRevenue, onNavigate }: {
  userName: string;
  orgName: string;
  leadCount: number;
  topLeads: Lead[];
  leads: Lead[];
  serviceHours: number;
  productRevenue: number;
  weeklyRevenue: number[];
  onNavigate: (tab: Tab) => void;
}) {
  const nudge = computeNextBestAction(leads);
  const headerRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to(headerRef.current, { opacity: 1, y: 0, duration: 1.2 });
    tl.from('.bento-item', { opacity: 0, y: 30, duration: 0.8, stagger: 0.1 }, '-=0.8');
    tl.to(sidebarRef.current, { opacity: 1, x: 0, duration: 1 }, '-=0.5');
    return () => { tl.kill(); };
  }, []);

  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="relative min-h-[calc(100vh-8rem)] bg-[#050505] text-white -m-6 p-6 md:p-12 lg:pr-[420px] rounded-2xl overflow-hidden">
      <div className="aurora-bg pointer-events-none">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <main className="max-w-6xl mx-auto relative z-10">
        <header ref={headerRef} className="mb-8 opacity-0 translate-y-4" id="bento-header">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Command Center</h1>
              <p className="text-zinc-400 text-sm">Overview of your pipeline, revenue, and next actions.</p>
            </div>
            <p className="text-zinc-500 text-sm mt-2 md:mt-0">{leadCount} leads</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
            <span className="font-medium text-zinc-300">Workflow</span>
            <Globe size={14} className="text-indigo-400" />
            <span>Website</span>
            <ArrowRight size={12} />
            <span>Leads</span>
            <ArrowRight size={12} />
            <span>CRM</span>
            <ArrowRight size={12} />
            <span className="text-emerald-400">Launch</span>
          </div>
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <button className="glass-card px-6 py-3 font-semibold text-sm hover:text-white flex items-center gap-2">
              <Sparkles size={18} /> AI Insights
            </button>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-white/20">
              <span className="font-bold text-sm">{initials}</span>
            </div>
          </div>
        </header>
        <div ref={bentoRef} className="bento-grid">
          <div className="glass-card col-span-1 md:col-span-2 row-span-2 p-8 flex flex-col justify-between bento-item min-h-[360px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-indigo-500/20 rounded-xl w-fit">
                  <Users className="text-indigo-400" size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Consultancy Pillar</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Lead Pipeline</h2>
              <p className="text-zinc-400 text-sm mb-8">Current high-ticket consulting opportunities.</p>
              <div className="space-y-4">
                {topLeads.length > 0 ? topLeads.map((l) => (
                  <div key={l.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">{l.name[0]}</div>
                      <div>
                        <p className="font-semibold text-sm">{l.company || l.name}</p>
                        <p className="text-xs text-zinc-500">{l.stage || 'NEW'}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-zinc-500 text-sm">No leads yet. Add leads or get them from your website.</p>
                )}
              </div>
            </div>
            <button onClick={() => onNavigate('crm')} className="w-full py-3 bg-white text-black font-bold rounded-xl mt-6 hover:bg-zinc-200 transition-colors">
              View All Leads
            </button>
          </div>
          <button onClick={() => onNavigate('crm')} className="glass-card col-span-1 md:col-span-2 p-8 flex flex-col bento-item text-left overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase">Product Performance</p>
                <h3 className="text-xl font-bold">${productRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h3>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-[10px]">Orders revenue</p>
              </div>
            </div>
            <div className="flex-grow min-h-[80px]">
              <SalesChart weeklyData={weeklyRevenue} />
            </div>
          </button>
          <div className="glass-card col-span-1 p-8 flex flex-col justify-between bento-item">
            <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
              <Clock className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 mb-1 uppercase">Service Bank</p>
              <h3 className="text-3xl font-bold tracking-tight">{serviceHours}h</h3>
            </div>
          </div>
          <button onClick={() => onNavigate('website')} className="glass-card col-span-1 md:col-span-2 p-8 relative overflow-hidden group bento-item text-left">
            <div className="relative z-10">
              <div className="p-3 bg-amber-500/20 rounded-xl w-fit mb-4">
                <Layout className="text-amber-400" size={24} />
              </div>
              <h2 className="text-xl font-bold mb-2">Visual AI Builder</h2>
              <p className="text-zinc-400 text-sm max-w-[200px]">Generate immersive sites instantly.</p>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] w-1/2 h-1/2 bg-gradient-to-tl from-amber-500/20 to-transparent rounded-full opacity-50 group-hover:opacity-70 transition-opacity" />
          </button>
          <button
            onClick={() => nudge && onNavigate(nudge.tab)}
            className={`glass-card col-span-1 p-8 flex flex-col justify-center items-center text-center bento-item ${nudge ? 'ring-2 ring-indigo-500/50 hover:ring-indigo-400' : ''}`}
          >
            {nudge ? (
              <>
                <div className="p-3 bg-indigo-500/20 rounded-xl w-fit mb-4">
                  <Sparkles className="text-indigo-400" size={24} />
                </div>
                <p className="text-sm font-semibold text-zinc-300 mb-2">Next best action</p>
                <p className="text-xs text-zinc-500 mb-4">{nudge.message}</p>
                <span className="text-indigo-400 text-xs font-bold">{nudge.cta} →</span>
              </>
            ) : (
              <>
                <div className="relative mb-4">
                  <svg className="w-20 h-20">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-500" strokeDasharray="226" strokeDashoffset={leadCount > 0 ? 45 : 158} strokeLinecap="round" />
                  </svg>
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold">{leadCount > 0 ? 80 : 30}%</span>
                </div>
                <p className="text-sm font-semibold text-zinc-400">{leadCount > 0 ? 'Pipeline active' : 'Add leads to start'}</p>
              </>
            )}
          </button>
          <button onClick={() => onNavigate('marketing')} className="glass-card col-span-1 p-8 flex flex-col justify-between bento-item text-left">
            <div className="p-3 bg-rose-500/20 rounded-xl w-fit mb-4">
              <PenTool className="text-rose-400" size={24} />
            </div>
            <h3 className="font-bold">Draft Copy</h3>
            <p className="text-xs text-zinc-500">AI ready for product descriptions.</p>
          </button>
        </div>
      </main>
      <aside ref={sidebarRef} className="fixed top-6 right-6 bottom-6 w-[380px] z-50 flex flex-col p-6 glass-card opacity-0 translate-x-8" id="aiSidebar">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" size={16} />
            </div>
            <h2 className="font-bold">AI Agent</h2>
          </div>
          <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-zinc-400 font-bold uppercase tracking-wider">Context: CRM</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 min-h-0">
          <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
            <p className="text-sm text-zinc-300 leading-relaxed">
              {leadCount === 0
                ? "Hello! I've analyzed your pipeline. Add leads from your website, Facebook ads, or manually to get started."
                : leadCount < 5
                  ? `Hello! I've analyzed your pipeline. You have ${leadCount} lead${leadCount === 1 ? '' : 's'}. I can help prioritize follow-ups and draft proposals.`
                  : `Hello! I've analyzed your <strong>Consultancy Pipeline</strong>. You have ${leadCount} leads. Several are nearing the closing stage—should I draft follow-up proposals?`}
            </p>
          </div>
          <div className="bg-indigo-500/20 p-4 rounded-2xl rounded-tr-none border border-indigo-500/20 ml-12">
            <p className="text-sm text-indigo-100">Yes, prioritize TechNova Solutions first.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
            <p className="text-sm text-zinc-300 leading-relaxed">
              Understood. I&apos;ve drafted a proposal focusing on the strategy deliverables for <strong>TechNova</strong>. It&apos;s ready in your drafts.
            </p>
          </div>
        </div>
        <div className="relative">
          <input type="text" placeholder="Ask AI about your business..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-indigo-500 transition-colors pr-12 text-white placeholder-zinc-500" />
          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
            <Send className="w-4 h-4" size={16} />
          </button>
        </div>
      </aside>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { name?: string; company?: string } } | null>(null);
  const [org, setOrg] = useState<{ id: string; name: string } | null>(null);
  const [tab, setTab] = useState<Tab>('website');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [permissions, setPermissions] = useState<Permissions>({});
  const [inviteRole, setInviteRole] = useState<(typeof INVITEABLE_ROLES)[number]['value']>('SALES_AGENT');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadNotes, setLeadNotes] = useState<{ leadId: string; note: string; performedBy: string; createdAt: string }[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [websiteSubTab, setWebsiteSubTab] = useState<WebsiteSubTab>('preview');
  const [branding, setBranding] = useState({
    company_name: '', logo_url: '', primary_color: '#163A63', phone: '', whatsapp: '', address: '',
    info_email: '', support_email: '', sales_email: '', contact_email: '',
    instagram_url: '', facebook_url: '', business_type: 'product' as 'product' | 'service',
  });
  const [websiteCms, setWebsiteCms] = useState({
    hero_title: '', hero_subtitle: '', value_line: '', process_title: '', process_subtitle: '',
    about_title: '', about_body1: '', about_body2: '', stock_quote_title: '', stock_quote_subtitle: '',
  });
  const [supportFilter, setSupportFilter] = useState<'ALL' | 'ESCALATIONS' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [ticketForm, setTicketForm] = useState<{ subject: string; customer: string; priority: 'LOW' | 'MEDIUM' | 'HIGH'; assignee: string; source: 'MANUAL' | 'LEAD_ESCALATION' | 'CUSTOMER_PORTAL' | 'WEBSITE' }>({ subject: '', customer: '', priority: 'MEDIUM', assignee: '', source: 'MANUAL' });
  const [addLeadModal, setAddLeadModal] = useState(false);
  const [addLeadForm, setAddLeadForm] = useState({ name: '', company: '', email: '', phone: '' });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNextAction, setLeadNextAction] = useState('');
  const [leadNote, setLeadNote] = useState('');
  const [marketingCompose, setMarketingCompose] = useState({ subject: '', body: '', recipientIds: [] as string[] });
  const [marketingSending, setMarketingSending] = useState(false);
  const [crmSubTab, setCrmSubTab] = useState<CrmSubTab>('pipeline');
  const [crmViewType, setCrmViewType] = useState<CrmViewType>('deals');
  const [crmSearch, setCrmSearch] = useState('');
  const [crmSourceFilter, setCrmSourceFilter] = useState<string>('ALL');
  const [supportNewTicketOpen, setSupportNewTicketOpen] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [newLeadsDot, setNewLeadsDot] = useState(false);
  const [websitePreviewKey, setWebsitePreviewKey] = useState(0);
  const [aiGenerateLoading, setAiGenerateLoading] = useState(false);
  const [serviceProjects, setServiceProjects] = useState<{ id: string; name: string; status: string; credits_total: number; lead_id?: string }[]>([]);
  const [orders, setOrders] = useState<{ id: string; total: number; status: string; created_at: string }[]>([]);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }
    const run = async () => {
      const { data: { session } } = await client.auth.getSession();
      if (!session) {
        router.replace('/auth/signin');
        return;
      }
      setUser(session.user);

      const { data: tm } = await client.from('team_members').select('org_id').eq('user_id', session.user.id).limit(1).maybeSingle();
      if (!tm) {
        setOnboarding(true);
        const company = (session.user.user_metadata?.company as string) || 'My Business';
        const name = (session.user.user_metadata?.name as string) || session.user.email?.split('@')[0] || 'User';
        const orgId = 'ORG-' + Math.random().toString(36).slice(2, 10).toUpperCase();
        await client.from('organizations').insert({ id: orgId, name: company });
        await client.from('team_members').insert({
          org_id: orgId, user_id: session.user.id, name, email: session.user.email || '', role: 'OWNER', status: 'ACTIVE',
        });
        await client.from('branding').insert({
          org_id: orgId, company_name: company,
        });
        try { await client.from('website_cms').insert({ org_id: orgId }); } catch (_) {}
        await client.from('user_organizations').insert({
          user_id: session.user.id, org_id: orgId, role: 'OWNER',
        });
        try {
          await client.from('role_permissions').insert({
            org_id: orgId, role: 'OWNER',
            invite_team: true, manage_billing: true, manage_finance: true, edit_branding: true,
            delete_leads: true, delete_orders: true, add_pipeline_stages: true, edit_quotes: true, edit_templates: true,
          });
        } catch (_) {}
        setOrg({ id: orgId, name: company });
        setPermissions({ invite_team: true, manage_billing: true, manage_finance: true, edit_branding: true });
        setOnboarding(false);
        setLoading(false);
        return;
      }
      const orgId = tm.org_id;
      const { data: orgData } = await client.from('organizations').select('id, name').eq('id', orgId).single();
      if (orgData) setOrg(orgData);

      const { data: myTm } = await client.from('team_members').select('role').eq('org_id', orgId).eq('user_id', session.user.id).single();
      const role = myTm?.role;
      if (role) {
        const { data: perms } = await client.from('role_permissions').select('invite_team, manage_billing, manage_finance, edit_branding')
          .eq('org_id', orgId).eq('role', role).maybeSingle();
        setPermissions({
          invite_team: perms?.invite_team ?? false,
          manage_billing: perms?.manage_billing ?? false,
          manage_finance: perms?.manage_finance ?? false,
          edit_branding: perms?.edit_branding ?? false,
        });
      }

      const { data: m } = await client.from('team_members').select('id, name, email, role').eq('org_id', orgId).order('created_at');
      setMembers(m || []);

      const [leadsRes, ticketsRes, brandRes, cmsRes, projectsSettled, ordersSettled] = await Promise.all([
        client.from('leads').select('id, name, email, company, phone, stage, source, next_action, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(200),
        client.from('tickets').select('id, subject, customer, contact_email, message, status, priority, assignee, source, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(200),
        client.from('branding').select('*').eq('org_id', orgId).maybeSingle(),
        client.from('website_cms').select('*').eq('org_id', orgId).maybeSingle(),
        (async () => { try { const r = await client.from('service_projects').select('id, name, status, credits_total, lead_id').eq('org_id', orgId).order('created_at', { ascending: false }).limit(100); return r.data || []; } catch { return []; } })(),
        (async () => { try { const r = await client.from('orders').select('id, total, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(200); return r.data || []; } catch { return []; } })(),
      ]);
      const l = leadsRes.data || [];
      setLeads(l.map((x: Record<string, unknown>) => ({
        id: String(x.id), name: String(x.name || ''), email: String(x.email || ''), company: String(x.company || ''),
        phone: String((x.phone as string) || ''), stage: String(x.stage || 'NEW'), source: String(x.source || ''),
        next_action: String((x.next_action as string) || ''), created_at: String(x.created_at || ''),
      })));
      const t = ticketsRes.data || [];
      setTickets(t.map((x: Record<string, unknown>) => ({
        id: String(x.id), subject: String(x.subject || ''), customer: String(x.customer || ''),
        contact_email: (x.contact_email as string) || undefined, message: (x.message as string) || undefined,
        status: String(x.status || 'OPEN'), priority: String(x.priority || 'MEDIUM'),
        assignee: (x.assignee as string) || undefined, source: (x.source as string) || undefined,
        created_at: String(x.created_at || ''),
      })));
      const b = brandRes.data;
      if (b) {
        const rb = b as Record<string, unknown>;
        setBranding({
          company_name: String(rb.company_name || orgData?.name || ''),
          logo_url: String(rb.logo_url || ''),
          primary_color: String(rb.primary_color || '#163A63'),
          phone: String(rb.phone || ''),
          whatsapp: String(rb.whatsapp || ''),
          address: String(rb.address || ''),
          info_email: String(rb.info_email || ''),
          support_email: String(rb.support_email || ''),
          sales_email: String(rb.sales_email || ''),
          contact_email: String(rb.contact_email || ''),
          instagram_url: String(rb.instagram_url || ''),
          facebook_url: String(rb.facebook_url || ''),
          business_type: (rb.business_type === 'service' ? 'service' : 'product') as 'product' | 'service',
        });
      }
      const projects = Array.isArray(projectsSettled) ? projectsSettled : [];
      setServiceProjects(projects.map((p: Record<string, unknown>) => ({
        id: String(p.id), name: String(p.name || 'Project'), status: String(p.status || 'ACTIVE'),
        credits_total: Number(p.credits_total || 0), lead_id: p.lead_id ? String(p.lead_id) : undefined,
      })));
      const ords = Array.isArray(ordersSettled) ? ordersSettled : [];
      setOrders(ords.map((o: Record<string, unknown>) => ({
        id: String(o.id), total: Number(o.total || 0), status: String(o.status || ''),
        created_at: String(o.created_at || ''),
      })));

      const c = cmsRes.data;
      if (c) {
        const rc = c as Record<string, unknown>;
        setWebsiteCms({
          hero_title: String(rc.hero_title || 'Build your business online'),
          hero_subtitle: String(rc.hero_subtitle || 'We help you grow.'),
          value_line: String(rc.value_line || 'Simple. Modern. Effective.'),
          process_title: String(rc.process_title || 'How we help'),
          process_subtitle: String(rc.process_subtitle || ''),
          about_title: String(rc.about_title || 'About us'),
          about_body1: String(rc.about_body1 || ''),
          about_body2: String(rc.about_body2 || ''),
          stock_quote_title: String(rc.stock_quote_title || 'Get in touch'),
          stock_quote_subtitle: String(rc.stock_quote_subtitle || "Leave your details and we'll reach out."),
        });
      }
      setLoading(false);
    };
    run();
  }, [router]);

  useEffect(() => {
    const client = supabase;
    if (!client || !org?.id) return;
    const channel = client.channel(`leads-${org.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads', filter: `org_id=eq.${org.id}` }, (payload) => {
      const r = payload.new as Record<string, unknown>;
      if (r && typeof r.id === 'string') {
        setLeads(prev => {
          if (prev.some(l => l.id === r.id)) return prev;
          return [{
            id: String(r.id), name: String(r.name || ''), email: String(r.email || ''), company: String(r.company || ''),
            phone: String((r.phone as string) || ''), stage: String(r.stage || 'NEW'), source: String(r.source || ''),
            next_action: String((r.next_action as string) || ''), created_at: String(r.created_at || ''),
          }, ...prev];
        });
        setNewLeadsDot(true);
      }
    }).subscribe();
    return () => { client.removeChannel(channel); };
  }, [supabase, org?.id]);

  useEffect(() => {
    if (tab === 'crm') setNewLeadsDot(false);
  }, [tab]);

  const handleInvite = async () => {
    if (!supabase || !org || !inviteEmail.trim()) return;
    setInviteLoading(true);
    try {
      await supabase.from('invites').insert({
        org_id: org.id, email: inviteEmail.trim(), name: inviteEmail.split('@')[0], role: inviteRole, status: 'INVITED',
      });
      setInviteEmail('');
    } catch (_) {}
    setInviteLoading(false);
  };

  const saveBranding = async () => {
    if (!supabase || !org || !permissions.edit_branding) return;
    try {
      await supabase.from('branding').upsert({
        org_id: org.id, company_name: branding.company_name, logo_url: branding.logo_url || null,
        primary_color: branding.primary_color || '#163A63', phone: branding.phone || null, whatsapp: branding.whatsapp || null,
        address: branding.address || null, info_email: branding.info_email || null, support_email: branding.support_email || null,
        sales_email: branding.sales_email || null, contact_email: branding.contact_email || null,
        instagram_url: branding.instagram_url || null, facebook_url: branding.facebook_url || null,
        business_type: branding.business_type || 'product', updated_at: new Date().toISOString(),
      }, { onConflict: 'org_id' });
      setSettingsSaved(true);
      setWebsitePreviewKey(k => k + 1);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (e) {
      console.warn('Save branding failed:', e);
    }
  };

  const generateAICopy = async (type: 'hero' | 'about' | 'tagline') => {
    const prompt = branding.company_name || org?.name || 'our business';
    setAiGenerateLoading(true);
    try {
      const res = await fetch('/api/generate-copy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, type }) });
      const data = await res.json();
      if (data.headline) setWebsiteCms(c => ({ ...c, hero_title: data.headline, hero_subtitle: data.subheadline || c.hero_subtitle }));
      else if (data.body) setWebsiteCms(c => ({ ...c, about_body1: data.body }));
      else if (data.tagline) setWebsiteCms(c => ({ ...c, value_line: data.tagline }));
    } catch (_) {}
    setAiGenerateLoading(false);
  };

  const applyTemplate = async (key: keyof typeof WEBSITE_TEMPLATES) => {
    const t = WEBSITE_TEMPLATES[key];
    const next = {
      ...websiteCms,
      hero_title: t.hero_title,
      hero_subtitle: t.hero_subtitle,
      value_line: t.value_line,
      process_title: t.process_title,
      process_subtitle: t.process_subtitle,
      about_title: t.about_title,
      about_body1: t.about_body1,
      about_body2: t.about_body2,
      stock_quote_title: t.stock_quote_title,
      stock_quote_subtitle: t.stock_quote_subtitle,
    };
    setWebsiteCms(next);
    if (supabase && org && permissions.edit_branding) {
      try {
        await supabase.from('website_cms').upsert({
          org_id: org.id, hero_title: next.hero_title, hero_subtitle: next.hero_subtitle,
          value_line: next.value_line || null, process_title: next.process_title,
          process_subtitle: next.process_subtitle || null, about_title: next.about_title,
          about_body1: next.about_body1 || null, about_body2: next.about_body2 || null,
          stock_quote_title: next.stock_quote_title, stock_quote_subtitle: next.stock_quote_subtitle || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'org_id' });
        setSettingsSaved(true);
        setWebsitePreviewKey(k => k + 1);
        setTimeout(() => setSettingsSaved(false), 2000);
      } catch (_) {}
    }
  };

  const saveWebsiteCms = async () => {
    if (!supabase || !org || !permissions.edit_branding) return;
    try {
      await supabase.from('website_cms').upsert({
        org_id: org.id, hero_title: websiteCms.hero_title, hero_subtitle: websiteCms.hero_subtitle,
        value_line: websiteCms.value_line || null, process_title: websiteCms.process_title,
        process_subtitle: websiteCms.process_subtitle || null, about_title: websiteCms.about_title,
        about_body1: websiteCms.about_body1 || null, about_body2: websiteCms.about_body2 || null,
        stock_quote_title: websiteCms.stock_quote_title, stock_quote_subtitle: websiteCms.stock_quote_subtitle || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'org_id' });
      setSettingsSaved(true);
      setWebsitePreviewKey(k => k + 1);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (e) {
      console.warn('Save website CMS failed:', e);
    }
  };

  const updateLeadStage = async (leadId: string, stage: string) => {
    if (!supabase || !org) return;
    const lead = leads.find(l => l.id === leadId);
    const prevStage = lead?.stage;
    setLeads(l => l.map(x => x.id === leadId ? { ...x, stage } : x));
    const { error } = await supabase.from('leads').update({ stage }).eq('id', leadId);
    if (error && lead) setLeads(l => l.map(x => x.id === leadId ? { ...x, stage: prevStage || 'NEW' } : x));
    else if (!error && lead && (stage === 'WON' || stage === 'CONTRACT_SIGNED')) {
      await supabase.from('service_projects').insert({
        org_id: org.id, lead_id: leadId, name: `${lead.company || lead.name} — Project`, status: 'ACTIVE',
      }).then(() => {});
    }
  };

  const updateLeadNextAction = async (leadId: string, nextAction: string) => {
    if (!supabase) return;
    await supabase.from('leads').update({ next_action: nextAction }).eq('id', leadId);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, next_action: nextAction } : l));
  };

  const createQuoteFromLead = async () => {
    if (!supabase || !org || !selectedLead) return;
    const id = `QT-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    const createdBy = user?.email || user?.id || 'user';
    const performer = user?.user_metadata?.name as string || user?.email || 'User';
    try {
      await supabase.from('quotes').insert({
        id, org_id: org.id, lead_id: selectedLead.id, customer_name: selectedLead.name, customer_company: selectedLead.company || '',
        customer_email: selectedLead.email, customer_phone: selectedLead.phone || '', total: 0, status: 'DRAFT', items_json: [],
        created_by: createdBy,
      });
      await supabase.from('activity_log').insert({
        org_id: org.id, action: 'NOTE', entity_type: 'LEAD', entity_id: selectedLead.id,
        details: { note: `Created quote ${id} (draft)` }, performed_by: performer,
      });
      setLeadNotes(prev => [{ leadId: selectedLead.id, note: `Created quote ${id}`, performedBy: performer, createdAt: new Date().toISOString() }, ...prev]);
    } catch (_) {}
  };

  const addLeadNote = async () => {
    if (!supabase || !org || !selectedLead || !leadNote.trim()) return;
    const performer = user?.user_metadata?.name as string || user?.email || 'User';
    await supabase.from('activity_log').insert({
      org_id: org.id, action: 'NOTE', entity_type: 'LEAD', entity_id: selectedLead.id,
      details: { note: leadNote.trim() }, performed_by: performer,
    });
    setLeadNotes(prev => [{ leadId: selectedLead.id, note: leadNote.trim(), performedBy: performer, createdAt: new Date().toISOString() }, ...prev]);
    setLeadNote('');
  };

  useEffect(() => {
    if (!supabase || !selectedLead || !org) { setLeadNotes([]); return; }
    supabase.from('activity_log').select('id, entity_id, action, details, performed_by, created_at')
      .eq('org_id', org.id).eq('entity_type', 'LEAD').eq('entity_id', selectedLead.id)
      .order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => {
        setLeadNotes((data || []).map((r: Record<string, unknown>) => ({
          leadId: String(r.entity_id), note: String((r.details as { note?: string })?.note || ''),
          performedBy: String(r.performed_by || ''), createdAt: String(r.created_at || ''),
        })));
      });
  }, [selectedLead?.id, org?.id, supabase]);

  const sendBulkEmail = async () => {
    if (!marketingCompose.subject.trim() || !marketingCompose.body.trim()) return;
    const toSend = marketingCompose.recipientIds.length > 0
      ? leads.filter(l => marketingCompose.recipientIds.includes(l.id))
      : leads;
    if (toSend.length === 0) return;
    setMarketingSending(true);
    for (const lead of toSend) {
      try {
        await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: lead.email,
            subject: marketingCompose.subject,
            body: marketingCompose.body.replace(/\{name\}/g, lead.name.split(' ')[0] || lead.name).replace(/\{company\}/g, lead.company || ''),
          }),
        });
      } catch (_) {}
    }
    setMarketingSending(false);
    setMarketingCompose({ subject: '', body: '', recipientIds: [] });
  };

  const addLead = async () => {
    if (!supabase || !org || !addLeadForm.name.trim() || !addLeadForm.email.trim()) return;
    const defaultStage = crmViewType === 'consulting' ? 'DISCOVERY' : 'NEW';
    try {
      await supabase.from('leads').insert({
        org_id: org.id, name: addLeadForm.name.trim(), company: addLeadForm.company.trim() || 'Website',
        email: addLeadForm.email.trim(), phone: addLeadForm.phone.trim() || '', stage: defaultStage, source: 'MANUAL',
      });
      setAddLeadForm({ name: '', company: '', email: '', phone: '' });
      setAddLeadModal(false);
      const { data } = await supabase.from('leads').select('id, name, email, company, phone, stage, source, next_action, created_at')
        .eq('org_id', org.id).order('created_at', { ascending: false }).limit(1).single();
      if (data) {
        const d = data as Record<string, unknown>;
        setLeads(prev => [{
          id: String(d.id), name: String(d.name || ''), email: String(d.email || ''), company: String(d.company || ''),
          phone: String((d.phone as string) || ''), stage: String(d.stage || defaultStage), source: String(d.source || ''),
          next_action: '', created_at: String(d.created_at || ''),
        }, ...prev]);
      }
    } catch (_) {}
  };

  const addTicket = async () => {
    if (!supabase || !org || !ticketForm.subject.trim() || !ticketForm.customer.trim()) return;
    const id = `TKT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    try {
      await supabase.from('tickets').insert({
        id, org_id: org.id, subject: ticketForm.subject.trim(), customer: ticketForm.customer.trim(),
        priority: ticketForm.priority, status: 'OPEN', assignee: ticketForm.assignee || null, source: ticketForm.source || 'MANUAL',
      });
      setTicketForm({ subject: '', customer: '', priority: 'MEDIUM', assignee: '', source: 'MANUAL' });
      setTickets(prev => [{ id, subject: ticketForm.subject.trim(), customer: ticketForm.customer.trim(), status: 'OPEN', priority: ticketForm.priority, assignee: ticketForm.assignee || undefined, source: ticketForm.source, created_at: new Date().toISOString() } as Ticket, ...prev]);
    } catch (_) {}
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    if (!supabase) return;
    await supabase.from('tickets').update({ status }).eq('id', ticketId);
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
  };

  const updateTicketAssignee = async (ticketId: string, assignee: string) => {
    if (!supabase) return;
    await supabase.from('tickets').update({ assignee: assignee || null }).eq('id', ticketId);
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignee: assignee || undefined } : t));
  };

  const deleteTicket = async (ticketId: string) => {
    if (!supabase) return;
    await supabase.from('tickets').delete().eq('id', ticketId);
    setTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  const escalationTickets = tickets.filter(t => t.source === 'WEBSITE' || t.source === 'LEAD_ESCALATION');
  const visibleTickets = supportFilter === 'ALL'
    ? tickets
    : supportFilter === 'ESCALATIONS'
      ? escalationTickets
      : tickets.filter(t => t.status === supportFilter);

  const crmFilteredLeads = leads.filter(l => {
    const matchSearch = !crmSearch.trim() || [l.name, l.email, l.company, l.phone].some(v => String(v || '').toLowerCase().includes(crmSearch.toLowerCase()));
    const matchSource = crmSourceFilter === 'ALL' || (l.source || '').toUpperCase() === crmSourceFilter;
    return matchSearch && matchSource;
  });
  const pipelineStages = crmViewType === 'consulting' ? CONSULTING_STAGES : crmViewType === 'deals' ? DEALS_STAGES : [];
  const stageForLead = (l: Lead) => {
    const s = l.stage || 'NEW';
    return pipelineStages.includes(s) ? s : pipelineStages[0] || s;
  };
  const leadsByStage = pipelineStages.reduce((acc, s) => {
    acc[s] = crmFilteredLeads.filter(l => stageForLead(l) === s);
    return acc;
  }, {} as Record<string, Lead[]>);
  const sourceOptions = ['ALL', ...Array.from(new Set(leads.map(l => (l.source || 'MANUAL').toUpperCase())))];

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    router.replace('/');
  };

  if (loading || onboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <Loader2 className="animate-spin text-slate-400 mx-auto mb-4" size={40} />
          <p className="text-slate-600">{onboarding ? 'Setting up your workspace...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard; permission?: keyof Permissions }[] = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm', label: 'CRM', icon: Users },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'team', label: 'Team', icon: UserPlus },
    { id: 'billing', label: 'Billing', icon: CreditCard, permission: 'manage_billing' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  const nav = navItems.filter((n) => !n.permission || permissions[n.permission]);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <aside className="w-56 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <span className="font-bold text-lg">Stoklync</span>
        </div>
        <nav className="flex-1 p-2">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-1 relative ${
                tab === id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={18} /> {label}
              {id === 'crm' && newLeadsDot && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="New leads" />}
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <h1 className="font-semibold text-slate-900">{navItems.find((n) => n.id === tab)?.label ?? 'Dashboard'}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </nav>
        <main className="flex-1 p-6 overflow-auto">
          {tab === 'home' && (() => {
            const paidOrders = orders.filter(o => ['PAID', 'FULFILLED', 'CONFIRMED', 'DELIVERED', 'PROCESSING'].includes((o.status || '').toUpperCase()));
            const productRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
            const serviceHours = serviceProjects.reduce((s, p) => s + (p.credits_total || 0), 0);
            const now = new Date();
            const weeklyRevenue = [0, 1, 2, 3, 4, 5, 6].map(d => {
              const day = new Date(now);
              day.setDate(day.getDate() - (6 - d));
              const dayStr = day.toISOString().slice(0, 10);
              return paidOrders.filter(o => o.created_at?.slice(0, 10) === dayStr).reduce((s, o) => s + o.total, 0);
            });
            return (
              <BentoHome
                userName={user?.user_metadata?.name || 'there'}
                orgName={org?.name || ''}
                leadCount={leads.length}
                topLeads={leads.slice(0, 2)}
                leads={leads}
                serviceHours={serviceHours}
                productRevenue={productRevenue}
                weeklyRevenue={weeklyRevenue}
                onNavigate={(t: Tab) => setTab(t)}
              />
            );
          })()}
          {tab === 'website' && (
            <div className="max-w-4xl">
              <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                <span className="font-medium text-slate-700">Workflow:</span>
                <Globe size={14} />
                <span>Website</span>
                <ArrowRight size={12} />
                <span>Leads</span>
                <ArrowRight size={12} />
                <span>CRM</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {(['preview', 'branding', 'contact', 'cms', 'visual'] as const).map((st) => (
                  <button key={st} onClick={() => setWebsiteSubTab(st)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${websiteSubTab === st ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {st === 'preview' ? 'View site' : st === 'branding' ? 'Branding' : st === 'contact' ? 'Contact' : st === 'cms' ? 'Content' : 'Visual'}
                  </button>
                ))}
              </div>
              {websiteSubTab === 'preview' && org && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-slate-600 text-sm">Live preview</p>
                    <div className="flex gap-2">
                      <button onClick={() => setWebsitePreviewKey(k => k + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Refresh</button>
                      <a href={`/site/${org.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                        <ExternalLink size={16} /> Open in new tab
                      </a>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm" style={{ aspectRatio: '16/10', minHeight: 400 }}>
                    <iframe key={websitePreviewKey} src={`/site/${org.id}?preview=1`} className="w-full h-full border-0" title="Site preview" />
                  </div>
                </div>
              )}
              {websiteSubTab === 'branding' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <h3 className="font-bold text-slate-800">Branding</h3>
                  <div><label className="block text-sm font-medium mb-1">Company name</label><input type="text" value={branding.company_name} onChange={e => setBranding({ ...branding, company_name: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                  <div><label className="block text-sm font-medium mb-1">Logo URL</label><input type="url" value={branding.logo_url} onChange={e => setBranding({ ...branding, logo_url: e.target.value })} placeholder="https://..." className="w-full p-2 border rounded text-sm" /></div>
                  <div><label className="block text-sm font-medium mb-1">Primary color</label><input type="text" value={branding.primary_color} onChange={e => setBranding({ ...branding, primary_color: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                  <div><label className="block text-sm font-medium mb-1">Business type</label><select value={branding.business_type} onChange={e => setBranding({ ...branding, business_type: e.target.value as 'product' | 'service' })} className="w-full p-2 border rounded text-sm"><option value="product">Product</option><option value="service">Service</option></select></div>
                  <button onClick={saveBranding} disabled={!permissions.edit_branding} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium disabled:opacity-50">{settingsSaved ? 'Saved' : 'Save Branding'}</button>
                </div>
              )}
              {websiteSubTab === 'contact' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <h3 className="font-bold text-slate-800">Contact settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" value={branding.phone} onChange={e => setBranding({ ...branding, phone: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                    <div><label className="block text-sm font-medium mb-1">WhatsApp</label><input type="text" value={branding.whatsapp} onChange={e => setBranding({ ...branding, whatsapp: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                    <div><label className="block text-sm font-medium mb-1">Sales email</label><input type="email" value={branding.sales_email} onChange={e => setBranding({ ...branding, sales_email: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                    <div><label className="block text-sm font-medium mb-1">Support email</label><input type="email" value={branding.support_email} onChange={e => setBranding({ ...branding, support_email: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address</label><input type="text" value={branding.address} onChange={e => setBranding({ ...branding, address: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                  </div>
                  <button onClick={saveBranding} disabled={!permissions.edit_branding} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium disabled:opacity-50">{settingsSaved ? 'Saved' : 'Save Contact'}</button>
                </div>
              )}
              {websiteSubTab === 'cms' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">Website content</h3>
                    <p className="text-sm text-slate-600 mb-4">Start with a template or edit the fields below.</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <button onClick={() => applyTemplate('product')} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">Product</button>
                      <button onClick={() => applyTemplate('service')} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">Service</button>
                      <button onClick={() => applyTemplate('consulting')} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">Consulting</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">Or use AI to generate copy.</p>
                    <div className="flex gap-2">
                      <button onClick={() => generateAICopy('hero')} disabled={aiGenerateLoading} className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 disabled:opacity-50 flex items-center gap-1.5">
                        {aiGenerateLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Generate hero
                      </button>
                      <button onClick={() => generateAICopy('tagline')} disabled={aiGenerateLoading} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-50">AI tagline</button>
                      <button onClick={() => generateAICopy('about')} disabled={aiGenerateLoading} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-50">AI about</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-2 border-slate-200 pl-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Top section</p>
                      <div className="space-y-3">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Headline</label><input type="text" value={websiteCms.hero_title} onChange={e => setWebsiteCms({ ...websiteCms, hero_title: e.target.value })} placeholder="e.g. Grow your business" className="w-full p-3 border border-slate-200 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Subheadline</label><textarea value={websiteCms.hero_subtitle} onChange={e => setWebsiteCms({ ...websiteCms, hero_subtitle: e.target.value })} placeholder="Supporting line under the headline" rows={2} className="w-full p-3 border border-slate-200 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label><input type="text" value={websiteCms.value_line} onChange={e => setWebsiteCms({ ...websiteCms, value_line: e.target.value })} placeholder="Short catchphrase (optional)" className="w-full p-3 border border-slate-200 rounded-lg text-sm" /></div>
                      </div>
                    </div>
                    <div className="border-l-2 border-slate-200 pl-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">About & contact</p>
                      <div className="space-y-3">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">About section title</label><input type="text" value={websiteCms.about_title} onChange={e => setWebsiteCms({ ...websiteCms, about_title: e.target.value })} placeholder="e.g. About us" className="w-full p-3 border border-slate-200 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Contact form heading</label><input type="text" value={websiteCms.stock_quote_title} onChange={e => setWebsiteCms({ ...websiteCms, stock_quote_title: e.target.value })} placeholder="e.g. Get in touch" className="w-full p-3 border border-slate-200 rounded-lg text-sm" /></div>
                      </div>
                    </div>
                  </div>
                  <button onClick={saveWebsiteCms} disabled={!permissions.edit_branding} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{settingsSaved ? 'Saved' : 'Save changes'}</button>
                </div>
              )}
              {websiteSubTab === 'visual' && (
                <div>
                  <h3 className="font-bold text-slate-800 mb-4">Visual builder</h3>
                  <VisualBuilder />
                </div>
              )}
            </div>
          )}
          {tab === 'crm' && (
            <div className="w-full max-w-6xl">
              <div className="mb-4 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-4 py-2 border border-slate-200 w-fit">
                <Globe size={14} /><span>Website</span><ArrowRight size={12} /><span>Leads land here</span><ArrowRight size={12} /><span className="font-medium text-slate-700">CRM</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">CRM</h2>
                  <p className="text-sm text-slate-600">Leads from your website and other sources. Move through pipeline, follow up.</p>
                </div>
                <button onClick={() => setAddLeadModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shrink-0 shadow-sm">
                  <Plus size={16} /> Add lead
                </button>
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm min-w-[120px]">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{leads.length}</p>
                </div>
                {pipelineStages.slice(0, 5).map(s => (
                  <div key={s} className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm min-w-[100px]">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">{s}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-0.5">{leads.filter(l => (l.stage || 'NEW') === s).length}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <select value={crmViewType} onChange={e => setCrmViewType(e.target.value as CrmViewType)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white font-medium">
                  <option value="consulting">Consulting</option>
                  <option value="deals">Deals</option>
                  <option value="product">Product</option>
                  <option value="services">Services</option>
                </select>
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                  <button onClick={() => setCrmSubTab('pipeline')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${crmSubTab === 'pipeline' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Pipeline</button>
                  <button onClick={() => setCrmSubTab('contacts')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${crmSubTab === 'contacts' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Contacts</button>
                </div>
                <input type="text" value={crmSearch} onChange={e => setCrmSearch(e.target.value)} placeholder="Search leads..." className="px-3 py-2 rounded-lg border border-slate-200 text-sm w-44 focus:ring-2 focus:ring-slate-300 focus:border-slate-300" />
                <select value={crmSourceFilter} onChange={e => setCrmSourceFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white">
                  {sourceOptions.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All sources' : s}</option>)}
                </select>
              </div>
              {crmViewType === 'product' ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-slate-800">Product orders</h3>
                    <p className="text-sm text-slate-500">Orders from your store or catalog</p>
                  </div>
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No orders yet. Orders appear when customers purchase from your site or catalog.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left px-4 py-3 font-semibold text-slate-700">Order</th><th className="text-left px-4 py-3 font-semibold text-slate-700">Total</th><th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th><th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th></tr></thead>
                        <tbody>
                          {orders.slice(0, 20).map(o => (
                            <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="px-4 py-3 font-mono text-xs">{o.id.slice(0, 8)}…</td>
                              <td className="px-4 py-3 font-medium">${o.total.toFixed(2)}</td>
                              <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">{o.status}</span></td>
                              <td className="px-4 py-3 text-slate-600">{o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : crmViewType === 'services' ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-slate-800">Service projects</h3>
                    <p className="text-sm text-slate-500">Projects created when leads are marked Won</p>
                  </div>
                  {serviceProjects.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No projects yet. Move a consulting lead to Won or Contract Signed to auto-create a project.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left px-4 py-3 font-semibold text-slate-700">Project</th><th className="text-left px-4 py-3 font-semibold text-slate-700">Credits</th><th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th></tr></thead>
                        <tbody>
                          {serviceProjects.slice(0, 20).map(p => (
                            <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="px-4 py-3 font-medium">{p.name}</td>
                              <td className="px-4 py-3">{p.credits_total}h</td>
                              <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : p.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'}`}>{p.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : leads.length === 0 ? (
                <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-slate-500">No leads yet. Share your site, run Facebook ads to your site, or add a lead manually.</div>
              ) : crmSubTab === 'contacts' ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Company</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Email</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Stage</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Source</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {crmFilteredLeads.map(l => (
                          <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-3"><button onClick={() => { setSelectedLead(l); setLeadNextAction(l.next_action || ''); }} className="font-medium text-slate-900 hover:underline">{l.name}</button></td>
                            <td className="px-4 py-3 text-slate-600">{l.company || '—'}</td>
                            <td className="px-4 py-3"><a href={`mailto:${l.email}`} className="text-blue-600 hover:underline">{l.email}</a></td>
                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">{l.stage || 'NEW'}</span></td>
                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">{l.source || '—'}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {l.email && <a href={`mailto:${l.email}`} className="p-1.5 rounded hover:bg-blue-100 text-blue-600" title="Email"><Mail size={14} /></a>}
                                {l.phone && <a href={`tel:${l.phone}`} className="p-1.5 rounded hover:bg-slate-200" title="Call"><Phone size={14} /></a>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <KanbanPipeline
                  pipelineStages={pipelineStages}
                  leadsByStage={leadsByStage}
                  stageForLead={stageForLead}
                  updateLeadStage={updateLeadStage}
                  setSelectedLead={setSelectedLead}
                  setLeadNextAction={setLeadNextAction}
                />
              )}
              {addLeadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setAddLeadModal(false)}>
                  <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-bold text-slate-800 mb-4">Add lead</h3>
                    <div className="space-y-3">
                      <input type="text" placeholder="Name *" value={addLeadForm.name} onChange={e => setAddLeadForm({ ...addLeadForm, name: e.target.value })} className="w-full p-2 border rounded text-sm" />
                      <input type="text" placeholder="Company" value={addLeadForm.company} onChange={e => setAddLeadForm({ ...addLeadForm, company: e.target.value })} className="w-full p-2 border rounded text-sm" />
                      <input type="email" placeholder="Email *" value={addLeadForm.email} onChange={e => setAddLeadForm({ ...addLeadForm, email: e.target.value })} className="w-full p-2 border rounded text-sm" />
                      <input type="tel" placeholder="Phone" value={addLeadForm.phone} onChange={e => setAddLeadForm({ ...addLeadForm, phone: e.target.value })} className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={addLead} disabled={!addLeadForm.name.trim() || !addLeadForm.email.trim()} className="px-4 py-2 bg-slate-800 text-white rounded text-sm font-medium disabled:opacity-50">Add</button>
                      <button onClick={() => setAddLeadModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
              {selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedLead(null)}>
                  <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-slate-800 text-lg">{selectedLead.name}</h3>
                      <button onClick={() => setSelectedLead(null)} className="p-1 rounded hover:bg-slate-100"><X size={18} /></button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <p><span className="text-slate-500">Company</span> {selectedLead.company || '—'}</p>
                      <p><span className="text-slate-500">Email</span> <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">{selectedLead.email}</a></p>
                      <p><span className="text-slate-500">Phone</span> {selectedLead.phone ? <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">{selectedLead.phone}</a> : '—'}</p>
                      <p><span className="text-slate-500">Stage</span> {selectedLead.stage} · Source: {selectedLead.source || '—'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedLead.email && <a href={`mailto:${selectedLead.email}`} className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 flex items-center gap-2 text-sm font-medium hover:bg-blue-200"><Mail size={16} /> Email</a>}
                      {selectedLead.phone && <a href={`tel:${selectedLead.phone}`} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-2 text-sm font-medium hover:bg-slate-200"><Phone size={16} /> Call</a>}
                      {selectedLead.phone && <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-green-100 text-green-700 flex items-center gap-2 text-sm font-medium hover:bg-green-200"><MessageCircle size={16} /> WhatsApp</a>}
                      <button onClick={createQuoteFromLead} className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 flex items-center gap-2 text-sm font-medium hover:bg-emerald-200">Create quote</button>
                    </div>
                    <div className="mt-6">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Next action</label>
                      <div className="flex gap-2">
                        <input type="text" value={leadNextAction} onChange={e => setLeadNextAction(e.target.value)} placeholder="e.g. Follow up tomorrow" className="flex-1 p-2 border rounded text-sm" />
                        <button onClick={() => updateLeadNextAction(selectedLead.id, leadNextAction)} className="px-3 py-2 bg-slate-800 text-white rounded text-sm font-medium">Save</button>
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Add note</label>
                      <div className="flex gap-2">
                        <input type="text" value={leadNote} onChange={e => setLeadNote(e.target.value)} placeholder="Log a note..." className="flex-1 p-2 border rounded text-sm" onKeyDown={e => e.key === 'Enter' && addLeadNote()} />
                        <button onClick={addLeadNote} disabled={!leadNote.trim()} className="px-3 py-2 bg-slate-800 text-white rounded text-sm font-medium disabled:opacity-50">Add</button>
                      </div>
                    </div>
                    {leadNotes.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Contact 360 — Activity timeline</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {leadNotes.map((n, i) => (
                            <div key={i} className="p-2 bg-slate-50 rounded text-sm">
                              <p className="text-slate-800">{n.note}</p>
                              <p className="text-xs text-slate-400 mt-1">{n.performedBy} · {new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === 'marketing' && (
            <div className="max-w-2xl space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Marketing</h2>
                <p className="text-sm text-slate-500">Get leads and send emails. Run Facebook ads, point them to your site, and leads drop into CRM.</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-3">Automations</h3>
                <p className="text-sm text-slate-600 mb-4">Rule example: &quot;If lead in Proposal for 3+ days, send follow-up email.&quot; Use the Marketing tab to select leads and send bulk emails manually until automations are configured.</p>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-500">Automation engine will support stage-based triggers and scheduled emails.</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-3">Lead sources</h3>
                <p className="text-sm text-slate-600 mb-4">Leads land in CRM from these sources:</p>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-medium text-slate-800 text-sm">1. Your website</p>
                    <p className="text-slate-600 text-sm mt-1">Your contact form captures leads. Run Facebook or Google ads to your site URL—leads land in CRM.</p>
                    {org && (
                      <div className="mt-2 flex gap-2">
                        <code className="flex-1 p-2 bg-white rounded border border-slate-200 text-xs font-mono break-all">
                          {typeof window !== 'undefined' ? `${window.location.origin}/site/${org.id}` : `/site/${org.id}`}
                        </code>
                        <button type="button" onClick={() => { const u = typeof window !== 'undefined' ? `${window.location.origin}/site/${org.id}` : ''; navigator.clipboard?.writeText(u); }} className="shrink-0 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium hover:bg-slate-50">Copy</button>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-medium text-slate-800 text-sm">2. Webhook for Zapier / Facebook Lead Ads</p>
                    <p className="text-slate-600 text-sm mt-1">Connect Facebook Lead Ads or any tool via webhook—POST leads to this URL:</p>
                    <div className="mt-2 flex gap-2">
                      <code className="flex-1 p-2 bg-white rounded border border-slate-200 text-xs font-mono break-all">
                        {typeof window !== 'undefined' ? `${window.location.origin}/api/submit-contact` : '/api/submit-contact'}
                      </code>
                      <button type="button" onClick={() => { const u = typeof window !== 'undefined' ? `${window.location.origin}/api/submit-contact` : ''; navigator.clipboard?.writeText(u); }} className="shrink-0 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium hover:bg-slate-50">Copy</button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">JSON body: org_id, name, email, type:&quot;QUOTE&quot;, source:&quot;FACEBOOK&quot;, message, phone, company</p>
                    {org && <p className="text-xs text-slate-500 mt-1">Your org_id: <code className="bg-white px-1 rounded border">{org.id}</code> <button type="button" onClick={() => navigator.clipboard?.writeText(org.id)} className="text-blue-600 hover:underline ml-1">Copy</button></p>}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-medium text-slate-800 text-sm">3. Manual add</p>
                    <p className="text-slate-600 text-sm mt-1">Add leads from CRM → Add lead.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <h3 className="font-semibold text-slate-800">Send email</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Recipients</label>
                  <p className="text-xs text-slate-500 mb-2">Choose who receives this email. Leave all unchecked to send to everyone; or select one or more leads.</p>
                  <div className="flex gap-2 mb-2">
                    <button type="button" onClick={() => setMarketingCompose({ ...marketingCompose, recipientIds: leads.map(l => l.id) })} className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">Select all</button>
                    <button type="button" onClick={() => setMarketingCompose({ ...marketingCompose, recipientIds: [] })} className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">Select none</button>
                  </div>
                  <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
                    {leads.map(l => (
                      <label key={l.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                        <input type="checkbox" checked={marketingCompose.recipientIds.length === 0 || marketingCompose.recipientIds.includes(l.id)} onChange={e => {
                          if (marketingCompose.recipientIds.length === 0) setMarketingCompose({ ...marketingCompose, recipientIds: leads.filter(x => x.id !== l.id).map(x => x.id) });
                          else if (e.target.checked) setMarketingCompose({ ...marketingCompose, recipientIds: [...marketingCompose.recipientIds, l.id] });
                          else setMarketingCompose({ ...marketingCompose, recipientIds: marketingCompose.recipientIds.filter(id => id !== l.id) });
                        }} />
                        <span className="text-sm truncate">{l.name} {l.company ? `· ${l.company}` : ''}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{marketingCompose.recipientIds.length === 0 ? `Will send to all ${leads.length} leads` : `Sending to ${marketingCompose.recipientIds.length} selected`}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input type="text" value={marketingCompose.subject} onChange={e => setMarketingCompose({ ...marketingCompose, subject: e.target.value })} placeholder="Your email subject" className="w-full p-3 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Body</label>
                  <textarea value={marketingCompose.body} onChange={e => setMarketingCompose({ ...marketingCompose, body: e.target.value })} placeholder={`Hi {name},\n\n...\n\nBest regards`} rows={6} className="w-full p-3 border border-slate-200 rounded-lg text-sm resize-none" />
                  <p className="text-xs text-slate-500 mt-1">Use {"{name}"} for first name, {"{company}"} for company.</p>
                </div>
                <button onClick={sendBulkEmail} disabled={marketingSending || leads.length === 0 || !marketingCompose.subject.trim() || !marketingCompose.body.trim()} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {marketingSending ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                  {marketingSending ? 'Sending...' : `Send to ${marketingCompose.recipientIds.length > 0 ? marketingCompose.recipientIds.length : leads.length} recipient${(marketingCompose.recipientIds.length || leads.length) === 1 ? '' : 's'}`}
                </button>
              </div>
            </div>
          )}
          {tab === 'support' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Support Tickets</h2>
                  <p className="text-sm text-slate-500">Tickets from your website, leads, and customer portal. Assign, reply, resolve.</p>
                </div>
                <select value={supportFilter} onChange={e => setSupportFilter(e.target.value as typeof supportFilter)} className="p-2 border border-slate-200 rounded-lg text-sm">
                  <option value="ALL">All tickets</option>
                  <option value="ESCALATIONS">From website / leads</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">Open: {tickets.filter(t => t.status === 'OPEN').length}</span>
                <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800">In progress: {tickets.filter(t => t.status === 'IN_PROGRESS').length}</span>
                <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800">Resolved: {tickets.filter(t => t.status === 'RESOLVED').length}</span>
              </div>
              {escalationTickets.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-amber-900">Escalation Queue</h3>
                    <span className="text-xs text-amber-700">Open: {escalationTickets.filter(t => t.status !== 'RESOLVED').length} · Unassigned: {escalationTickets.filter(t => !(t.assignee || '').trim()).length}</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {escalationTickets.slice(0, 6).map(t => (
                      <div key={t.id} className="bg-white border border-amber-200 rounded-lg p-3 flex justify-between items-center gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{t.subject}</p>
                          <p className="text-xs text-slate-500">{t.assignee || 'Unassigned'} · {new Date(t.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">{t.priority}</span>
                          <button onClick={() => updateTicketStatus(t.id, 'IN_PROGRESS')} className="px-2 py-1 rounded bg-amber-600 text-white text-xs hover:bg-amber-700">Start</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button onClick={() => setSupportNewTicketOpen(!supportNewTicketOpen)} className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">{supportNewTicketOpen ? 'Close' : 'New ticket'}</span>
                  <Plus size={18} className={supportNewTicketOpen ? 'rotate-45' : ''} />
                </button>
                {supportNewTicketOpen && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mt-4">
                      <input value={ticketForm.subject} onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })} placeholder="Subject" className="p-2 border border-slate-200 rounded-lg text-sm" />
                      <input value={ticketForm.customer} onChange={e => setTicketForm({ ...ticketForm, customer: e.target.value })} placeholder="Customer / company" className="p-2 border border-slate-200 rounded-lg text-sm" />
                      <select value={ticketForm.priority} onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })} className="p-2 border border-slate-200 rounded-lg text-sm">
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                      <select value={ticketForm.assignee} onChange={e => setTicketForm({ ...ticketForm, assignee: e.target.value })} className="p-2 border border-slate-200 rounded-lg text-sm">
                        <option value="">Assign to</option>
                        {members.map(m => (<option key={m.id} value={m.name}>{m.name}</option>))}
                      </select>
                      <select value={ticketForm.source} onChange={e => setTicketForm({ ...ticketForm, source: e.target.value as typeof ticketForm.source })} className="p-2 border border-slate-200 rounded-lg text-sm">
                        <option value="MANUAL">MANUAL</option>
                        <option value="LEAD_ESCALATION">LEAD_ESCALATION</option>
                        <option value="CUSTOMER_PORTAL">CUSTOMER_PORTAL</option>
                        <option value="WEBSITE">WEBSITE</option>
                      </select>
                      <button onClick={async () => { await addTicket(); setSupportNewTicketOpen(false); }} disabled={!ticketForm.subject.trim() || !ticketForm.customer.trim()} className="bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 py-2">Create</button>
                    </div>
                  </div>
                )}
              </div>
              {visibleTickets.length === 0 ? (
                <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
                  {tickets.length === 0 ? 'No tickets yet. Create one or wait for submissions from your website / contact form.' : 'No tickets match this filter.'}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {visibleTickets.map(t => (
                    <div key={t.id} className="border-b border-slate-100 last:border-b-0">
                      <div
                        onClick={() => setExpandedTicketId(expandedTicketId === t.id ? null : t.id)}
                        className="p-4 flex justify-between items-start gap-4 hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900">{t.subject}</h4>
                          <p className="text-xs text-slate-500">{t.customer}{t.contact_email ? ` · ${t.contact_email}` : ''} · {new Date(t.created_at).toLocaleDateString()} · {t.source || 'MANUAL'} · {t.assignee || 'Unassigned'}</p>
                          {t.message && <p className={`text-sm text-slate-600 mt-2 whitespace-pre-wrap ${expandedTicketId === t.id ? '' : 'line-clamp-2'}`}>{t.message}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                          <span className={`text-xs px-2 py-1 rounded font-bold ${t.priority === 'HIGH' ? 'bg-red-100 text-red-700' : t.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{t.priority}</span>
                          <select value={t.assignee || ''} onChange={e => updateTicketAssignee(t.id, e.target.value)} className="p-1.5 border border-slate-200 rounded text-xs">
                            <option value="">Unassigned</option>
                            {members.map(m => (<option key={m.id} value={m.name}>{m.name}</option>))}
                          </select>
                          <select value={t.status} onChange={e => updateTicketStatus(t.id, e.target.value)} className="p-1.5 border border-slate-200 rounded text-xs">
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In progress</option>
                            <option value="RESOLVED">Resolved</option>
                          </select>
                          {(() => { const email = t.contact_email || leads.find(l => l.name === t.customer || l.company === t.customer)?.email; return email ? <a href={`mailto:${email}?subject=Re:%20${encodeURIComponent(t.subject)}`} className="p-1.5 rounded hover:bg-slate-100 text-slate-600" title="Reply via email"><Mail size={16} /></a> : null; })()}
                          <button onClick={() => deleteTicket(t.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      {expandedTicketId === t.id && t.message && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="pl-0 text-sm text-slate-600 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 border border-slate-100">{t.message}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === 'team' && (
            <div className="max-w-2xl">
              <p className="text-slate-600 mb-4">Invite team members and manage access. Only admins can invite; you choose each person&apos;s role (e.g. Sales, Finance, Marketing) to control what they can see.</p>
              {permissions.invite_team && (
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap gap-2 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="min-w-[180px]">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Role (access level)</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      >
                        {INVITEABLE_ROLES.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleInvite}
                      disabled={inviteLoading || !inviteEmail.trim()}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                    >
                      Invite
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    {INVITEABLE_ROLES.find((r) => r.value === inviteRole)?.desc}. Pick the role that matches what they should access.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              {permissions.edit_branding ? (
                <>
                  <div className="p-6 bg-white rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Organization</h3>
                    <div className="space-y-3">
                      <div><label className="block text-sm font-medium text-slate-700 mb-1">Organization name</label><input type="text" value={org?.name || ''} onChange={async (e) => { const n = e.target.value; if (org && n.trim()) { await supabase?.from('organizations').update({ name: n.trim() }).eq('id', org.id); setOrg(o => o ? { ...o, name: n.trim() } : o); } }} className="w-full p-3 border border-slate-200 rounded-lg text-sm" placeholder="Your company name" /></div>
                      <p className="text-xs text-slate-500">ID: {org?.id}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Shield size={18} /> Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">Protect your account with TOTP. Use Google Authenticator or Authy to verify sign-in.</p>
                    <a href="https://supabase.com/docs/guides/auth/auth-mfa" target="_blank" rel="noopener noreferrer" className="inline-flex px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Enable 2FA (docs)</a>
                  </div>
                </>
              ) : (
                <div className="p-6 bg-white rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2">Organization</h3>
                  <p className="text-slate-600">{org?.name} ({org?.id})</p>
                  <p className="text-sm text-slate-500 mt-4">Contact your admin to change settings.</p>
                </div>
              )}
            </div>
          )}
          {tab === 'billing' && (
            <div className="max-w-2xl space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">Subscription</h3>
                <p className="text-sm text-slate-600 mb-4">Manage your plan and payment methods. Connect Stripe to accept payments and take a success fee on sales.</p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">Free tier active</span>
                  <a href="https://stripe.com/docs/connect" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline font-medium">Stripe Connect docs →</a>
                </div>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-2">Success fees</h3>
                <p className="text-sm text-slate-600">When you connect Stripe, the platform can deduct 1–2% from each sale. You keep the rest.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
